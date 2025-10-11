import { expect } from "chai";
import { network } from "hardhat";
import { describe, it } from "node:test";
import { parseEther } from "viem";

describe("PayNoteRegistry", function () {
  // Fixture to deploy the contract
  async function deployPayNoteRegistryFixture() {
    const { viem } = await network.connect();
    
    const [owner, sender, recipient] = await viem.getWalletClients();
    
    const payNoteRegistry = await viem.deployContract("PayNoteRegistry", [
      owner.account.address,
    ]);
    
    const publicClient = await viem.getPublicClient();

    return {
      payNoteRegistry,
      owner,
      sender,
      recipient,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { payNoteRegistry, owner } = await deployPayNoteRegistryFixture();

      const contractOwner = await payNoteRegistry.read.owner();
      expect(contractOwner.toLowerCase()).to.equal(
        owner.account.address.toLowerCase()
      );
    });

    it("Should start with zero registration fee", async function () {
      const { payNoteRegistry } = await deployPayNoteRegistryFixture();

      expect(await payNoteRegistry.read.registrationFee()).to.equal(0n);
    });

    it("Should have correct version", async function () {
      const { payNoteRegistry } = await deployPayNoteRegistryFixture();

      expect(await payNoteRegistry.read.VERSION()).to.equal("2.0.0");
    });
  });

  describe("Sending Payments with References", function () {
    it("Should send payment and store reference atomically", async function () {
      const { payNoteRegistry, sender, recipient, publicClient } =
        await deployPayNoteRegistryFixture();

      const amount = parseEther("1.5");
      const reference = "Invoice #12345";

      const recipientBalanceBefore = await publicClient.getBalance({
        address: recipient.account.address,
      });

      const hash = await payNoteRegistry.write.sendPaymentWithReference(
        [recipient.account.address, reference],
        { account: sender.account, value: amount }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const recipientBalanceAfter = await publicClient.getBalance({
        address: recipient.account.address,
      });

      expect(await payNoteRegistry.read.getTotalPayNotes()).to.equal(1n);
      expect(recipientBalanceAfter - recipientBalanceBefore).to.equal(amount);
    });

    it("Should emit PaymentSent event", async function () {
      const { payNoteRegistry, sender, recipient, publicClient } =
        await deployPayNoteRegistryFixture();

      const amount = parseEther("1.5");
      const reference = "Invoice #12345";

      const hash = await payNoteRegistry.write.sendPaymentWithReference(
        [recipient.account.address, reference],
        { account: sender.account, value: amount }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await payNoteRegistry.getEvents.PaymentSent();
      expect(events.length).to.be.greaterThan(0);
      expect(events[0].args.sender?.toLowerCase()).to.equal(
        sender.account.address.toLowerCase()
      );
      expect(events[0].args.recipient?.toLowerCase()).to.equal(
        recipient.account.address.toLowerCase()
      );
    });
  });

  describe("Resolving PayNotes", function () {
    it("Should resolve a PayNote correctly", async function () {
      const { payNoteRegistry, sender, recipient, publicClient } =
        await deployPayNoteRegistryFixture();

      const amount = parseEther("1.5");
      const reference = "Invoice #12345";

      const hash = await payNoteRegistry.write.sendPaymentWithReference(
        [recipient.account.address, reference],
        { account: sender.account, value: amount }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const payNotes = await payNoteRegistry.read.getPayNotesBySender([
        sender.account.address,
      ]);
      const payNoteId = payNotes[0];

      const payNote = await payNoteRegistry.read.resolvePayNote([payNoteId]);

      expect(payNote.sender.toLowerCase()).to.equal(
        sender.account.address.toLowerCase()
      );
      expect(payNote.recipient.toLowerCase()).to.equal(
        recipient.account.address.toLowerCase()
      );
      expect(payNote.amount).to.equal(amount);
      expect(payNote.payReference).to.equal(reference);
    });
  });
});
