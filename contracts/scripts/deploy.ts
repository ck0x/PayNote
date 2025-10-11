import { network } from "hardhat";
import { formatEther } from "viem";

async function main() {
  // Get network name from command line arguments
  const networkName = process.env.HARDHAT_NETWORK || "hardhat";
  console.log("\n🚀 Deploying PayNoteRegistry to", networkName);
  console.log("========================================\n");

  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  console.log("📝 Deployer address:", deployer.account.address);
  
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });

  console.log("💰 Deployer balance:", formatEther(balance), "ETH\n");

  if (balance === 0n) {
    throw new Error("❌ Deployer has no ETH! Get some from the faucet first.");
  }

  console.log("⏳ Deploying contract...");
  
  const payNoteRegistry = await viem.deployContract("PayNoteRegistry", [
    deployer.account.address,
  ]);

  console.log("\n✅ PayNoteRegistry deployed!");
  console.log("📍 Contract address:", payNoteRegistry.address);
  console.log("👤 Owner:", deployer.account.address);
  
  // Verify deployment
  const version = await payNoteRegistry.read.VERSION();
  const registrationFee = await payNoteRegistry.read.registrationFee();
  const owner = await payNoteRegistry.read.owner();

  console.log("\n📊 Contract Details:");
  console.log("   Version:", version);
  console.log("   Registration Fee:", registrationFee.toString(), "wei");
  console.log("   Owner:", owner);
  console.log("   Total PayNotes:", "0 (new deployment)");

  console.log("\n🔗 Block Explorer:");
  if (networkName === "optimismSepolia") {
    console.log(`   https://sepolia-optimism.etherscan.io/address/${payNoteRegistry.address}`);
  } else if (networkName === "optimism") {
    console.log(`   https://optimistic.etherscan.io/address/${payNoteRegistry.address}`);
  } else {
    console.log(`   Check your network's block explorer`);
  }

  console.log("\n✨ Next Steps:");
  console.log("2. Verify the contract:");
  console.log(`   npx hardhat verify --network ${networkName} ${payNoteRegistry.address} ${deployer.account.address}`);
  console.log("3. Test a payment:");
  console.log(`   npx hardhat run scripts/test-payment.ts --network ${networkName}`);
  console.log("4. Update your frontend with the contract address\n");

  return payNoteRegistry.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
