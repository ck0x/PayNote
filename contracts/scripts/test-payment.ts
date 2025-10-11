import { network } from "hardhat";
import { formatEther, parseEther } from "viem";

async function main() {
  const networkName = process.env.HARDHAT_NETWORK || "hardhat";
  console.log("\n🧪 Testing PayNoteRegistry on", networkName);
  console.log("========================================\n");

  const { viem } = await network.connect();
  const [sender] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  // Contract address on Optimism Sepolia
  const CONTRACT_ADDRESS = "0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f";
  
  console.log("📝 Sender address:", sender.account.address);
  
  const balance = await publicClient.getBalance({
    address: sender.account.address,
  });
  
  console.log("💰 Sender balance:", formatEther(balance), "ETH\n");

  // Get contract instance
  const payNoteRegistry = await viem.getContractAt(
    "PayNoteRegistry",
    CONTRACT_ADDRESS
  );

  // Read contract information
  console.log("📊 Contract Information:");
  const version = await payNoteRegistry.read.VERSION();
  const owner = await payNoteRegistry.read.owner();
  const registrationFee = await payNoteRegistry.read.registrationFee();
  const totalPayNotes = await payNoteRegistry.read.totalPayNotes();

  console.log("   Version:", version);
  console.log("   Owner:", owner);
  console.log("   Registration Fee:", registrationFee.toString(), "wei");
  console.log("   Total PayNotes:", totalPayNotes.toString());

  console.log("\n💸 Sending test payment with reference...");
  
  // Send a small payment with a reference
  const recipient = "0x1234567890123456789012345678901234567890"; // Example recipient
  const paymentAmount = parseEther("0.0001"); // 0.0001 ETH
  const payReference = `TEST-${Date.now()}`;

  try {
    const hash = await payNoteRegistry.write.sendPaymentWithReference(
      [recipient, payReference],
      {
        value: paymentAmount,
        account: sender.account,
      }
    );

    console.log("✅ Transaction sent!");
    console.log("   Transaction Hash:", hash);
    console.log("   Payment Reference:", payReference);
    console.log("   Amount:", formatEther(paymentAmount), "ETH");
    console.log("   Recipient:", recipient);

    // Wait for transaction to be mined
    console.log("\n⏳ Waiting for confirmation...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    // Get the PayNote ID from the event
    const logs = await payNoteRegistry.getEvents.PaymentSent();
    const latestLog = logs[logs.length - 1];
    const payNoteId = latestLog.args.payNoteId;

    console.log("\n📋 PayNote Created:");
    console.log("   PayNote ID:", payNoteId);

    // Resolve the PayNote
    const payNote = await payNoteRegistry.read.resolvePayNote([payNoteId!]);
    console.log("   Sender:", payNote[0]);
    console.log("   Recipient:", payNote[1]);
    console.log("   Amount:", formatEther(payNote[2]), "ETH");
    console.log("   Reference:", payNote[3]);
    console.log("   Timestamp:", new Date(Number(payNote[4]) * 1000).toISOString());
    console.log("   TX Hash:", payNote[5]);

    // Get updated total
    const newTotal = await payNoteRegistry.read.totalPayNotes();
    console.log("\n📊 Updated Total PayNotes:", newTotal.toString());

    console.log("\n🔗 View on Explorer:");
    console.log(`   https://sepolia-optimism.etherscan.io/tx/${hash}`);

  } catch (error: any) {
    console.error("\n❌ Test payment failed:");
    console.error(error.message || error);
  }

  console.log("\n✨ Test completed!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Test failed:");
    console.error(error);
    process.exit(1);
  });
