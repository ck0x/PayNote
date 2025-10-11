import { network } from "hardhat";
import { formatEther, parseEther } from "viem";

async function main() {
  const networkName = process.env.HARDHAT_NETWORK || "hardhat";
  console.log("\n🧪 Testing PayNoteRegistry on", networkName);
  console.log("========================================\n");

  const { viem } = await network.connect();
  const [sender] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  // Contract address - configurable via environment variable
  // Default is the Optimism Sepolia deployment
  const CONTRACT_ADDRESS = (process.env.CONTRACT_ADDRESS || 
    "0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f") as `0x${string}`;
  
  console.log("📝 Contract address:", CONTRACT_ADDRESS);
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
  const totalPayNotes = await payNoteRegistry.read.getTotalPayNotes();

  console.log("   Version:", version);
  console.log("   Owner:", owner);
  console.log("   Registration Fee:", registrationFee.toString(), "wei");
  console.log("   Total PayNotes:", totalPayNotes.toString());

  console.log("\n💸 Sending test payment with reference...");
  
  // Get recipient address from environment variable or use second account
  // You can set TEST_RECIPIENT_ADDRESS in your .env file
  const recipientAddress = process.env.TEST_RECIPIENT_ADDRESS;
  
  let recipient: `0x${string}`;
  
  if (recipientAddress) {
    // Use provided recipient address
    recipient = recipientAddress as `0x${string}`;
    console.log("   Using recipient from TEST_RECIPIENT_ADDRESS");
  } else {
    // Use second wallet account as recipient (safer for testing)
    const [, secondAccount] = await viem.getWalletClients();
    if (secondAccount) {
      recipient = secondAccount.account.address;
      console.log("   Using second wallet account as recipient");
    } else {
      // Fallback: use sender as recipient (will send to self)
      recipient = sender.account.address;
      console.log("   ⚠️  No second account found, sending to self (sender address)");
    }
  }
  
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
    console.log("   Transaction Hash:", hash);

    // Resolve the PayNote (stored on-chain data)
    const payNote = await payNoteRegistry.read.resolvePayNote([payNoteId!]);
    console.log("\n📝 On-Chain PayNote Data:");
    console.log("   Sender:", payNote.sender);
    console.log("   Recipient:", payNote.recipient);
    console.log("   Amount:", formatEther(payNote.amount), "ETH");
    console.log("   Reference:", payNote.payReference);
    console.log("   Timestamp:", new Date(Number(payNote.timestamp) * 1000).toISOString());

    // Get updated total
    const newTotal = await payNoteRegistry.read.getTotalPayNotes();
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
