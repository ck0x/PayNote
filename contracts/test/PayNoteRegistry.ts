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

      expect(await payNoteRegistry.read.VERSION()).to.equal("1.0.0");
    });
  });

  describe("Creating PayNotes", function () {
    it("Should create a PayNote successfully", async function () {
      const { payNoteRegistry, sender, recipient, publicClient} =
        await deployPayNoteRegistryFixture();

      const amount = parseEther("1.5");
      const reference = "Invoice #12345";

      const hash = await payNoteRegistry.write.createPayNote(
        [recipient.account.address, amount, reference],
        { account: sender.account }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      expect(await payNoteRegistry.read.getTotalPayNotes()).to.equal(1n);
    });

    it("Should emit PayNoteCreated event", async function () {
      const { payNoteRegistry, sender, recipient, publicClient } =
        await deployPayNoteRegistryFixture();

      const amount = parseEther("1.5");
      const reference = "Invoice #12345";

      const hash = await payNoteRegistry.write.createPayNote(
        [recipient.account.address, amount, reference],
        { account: sender.account }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const events = await payNoteRegistry.getEvents.PayNoteCreated();
      expect(events.length).to.be.greaterThan(0);
    });
  });

  describe("Resolving PayNotes", function () {
    it("Should resolve a PayNote correctly", async function () {
      const { payNoteRegistry, sender, recipient, publicClient } =
        await deployPayNoteRegistryFixture();

      const amount = parseEther("1.5");
      const reference = "Invoice #12345";

      const hash = await payNoteRegistry.write.createPayNote(
        [recipient.account.address, amount, reference],
        { account: sender.account }
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
      expect(payNote.isFulfilled).to.equal(false);
    });
  });
});
