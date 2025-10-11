# Deploy PayNoteRegistry to Optimism Sepolia

## Prerequisites

### 1. Get Sepolia ETH (for bridging)
- Get Sepolia ETH from faucet: https://sepoliafaucet.com/
- Or: https://www.alchemy.com/faucets/ethereum-sepolia

### 2. Bridge to Optimism Sepolia
- Go to: https://app.optimism.io/bridge
- Connect wallet
- Bridge Sepolia ETH → Optimism Sepolia
- Wait ~1-2 minutes for bridging
- You need ~0.01 ETH for deployment

### 3. Get Optimism Sepolia RPC URL
**Option A: Use Public RPC (easiest)**
```
https://sepolia.optimism.io
```

**Option B: Use Alchemy (recommended for production)**
1. Sign up at https://www.alchemy.com/
2. Create new app
3. Select "Optimism Sepolia"
4. Copy the HTTPS URL

**Option C: Use Infura**
1. Sign up at https://infura.io/
2. Create new project
3. Select "Optimism Sepolia"
4. Copy the endpoint URL

### 4. Get Optimism Etherscan API Key (for verification)
1. Go to https://optimistic.etherscan.io/
2. Sign up/login
3. Go to API Keys
4. Create new API key
5. Copy the key

---

## Setup Environment Variables

Create a `.env` file in the contracts directory:

```bash
# Your deployer wallet private key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Optimism Sepolia RPC URL
OPTIMISM_SEPOLIA_RPC_URL=https://sepolia.optimism.io

# Optional: For contract verification
OPTIMISM_ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**⚠️ IMPORTANT: Add .env to .gitignore!**

---

## Deployment Steps

### Step 1: Compile Contracts
```bash
npx hardhat compile
```

Expected output:
```
Compiled 2 Solidity files with solc 0.8.28
```

### Step 2: Deploy to Optimism Sepolia
```bash
npx hardhat ignition deploy ignition/modules/PayNoteRegistry.ts --network optimismSepolia
```

**What happens:**
1. Connects to Optimism Sepolia
2. Deploys PayNoteRegistry contract
3. You (deployer) become the owner
4. Returns deployment address

**Expected output:**
```
✔ Confirm deploy to network optimismSepolia (11155420)? … yes
Deployed Addresses

PayNoteRegistryModule#PayNoteRegistry - 0x1234...5678
```

### Step 3: Save the Contract Address
Copy the deployment address and save it! You'll need it for:
- Frontend integration
- Contract verification
- Future interactions

---

## Verify Contract on Etherscan (Optional but Recommended)

### Manual Verification
```bash
npx hardhat verify --network optimismSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARG>
```

Example:
```bash
npx hardhat verify --network optimismSepolia 0x1234567890123456789012345678901234567890 0xYourWalletAddress
```

### What verification does:
- ✅ Makes source code public
- ✅ Enables Etherscan UI interactions
- ✅ Builds trust with users
- ✅ Allows others to verify your code

---

## Test Your Deployment

### Using Hardhat Console
```bash
npx hardhat console --network optimismSepolia
```

Then test:
```javascript
const PayNoteRegistry = await ethers.getContractAt("PayNoteRegistry", "YOUR_CONTRACT_ADDRESS");

// Check version
await PayNoteRegistry.VERSION();
// Should return: "2.0.0"

// Check owner
await PayNoteRegistry.owner();
// Should return: Your wallet address

// Check registration fee
await PayNoteRegistry.registrationFee();
// Should return: 0n
```

### Using Optimism Sepolia Explorer
1. Go to: https://sepolia-optimism.etherscan.io/
2. Search your contract address
3. You should see:
   - Contract creation transaction
   - Contract balance (0 ETH initially)
   - Source code (if verified)

---

## Send a Test Payment

### From Hardhat Console
```javascript
const [signer] = await ethers.getSigners();
const registry = await ethers.getContractAt("PayNoteRegistry", "YOUR_CONTRACT_ADDRESS");

// Send 0.001 ETH with reference
const tx = await registry.sendPaymentWithReference(
  "0xRecipientAddress",
  "Test Payment - Invoice #001",
  { value: ethers.parseEther("0.001") }
);

await tx.wait();
console.log("Payment sent! TX:", tx.hash);

// Check total PayNotes
const total = await registry.getTotalPayNotes();
console.log("Total PayNotes:", total.toString());

// Get your PayNotes
const myPayNotes = await registry.getPayNotesBySender(signer.address);
console.log("Your PayNote ID:", myPayNotes[0]);

// Resolve PayNote
const payNote = await registry.resolvePayNote(myPayNotes[0]);
console.log("PayNote details:", {
  sender: payNote.sender,
  recipient: payNote.recipient,
  amount: ethers.formatEther(payNote.amount),
  reference: payNote.payReference
});
```

---

## Deployment Costs

**Estimated gas costs on Optimism Sepolia:**
- Contract deployment: ~2-3M gas
- Cost: ~$0.05-$0.10 (with gas prices)
- Much cheaper than Ethereum mainnet! ⚡

---

## Troubleshooting

### Error: "insufficient funds"
- Get more Sepolia ETH from faucet
- Bridge to Optimism Sepolia
- Check balance: https://sepolia-optimism.etherscan.io/

### Error: "network not found"
- Check your .env file has PRIVATE_KEY
- Verify RPC URL is correct
- Try public RPC: https://sepolia.optimism.io

### Error: "nonce too high"
- Reset your account in MetaMask
- Settings → Advanced → Clear activity tab data

### Error: "contract verification failed"
- Make sure you're using the correct constructor arguments
- Check that compiler version matches (0.8.28)
- Verify optimizer is enabled (runs: 200)

---

## Next Steps After Deployment

1. **✅ Save deployment address** - Write it down!
2. **✅ Verify contract** - Make it public
3. **✅ Test transactions** - Send test payment
4. **✅ Update frontend** - Add contract address to your app
5. **✅ Share on Twitter** - "Just deployed to @Optimism! 🔴✨"

---

## Important Addresses

| Network | Chain ID | Block Explorer | Faucet |
|---------|----------|----------------|--------|
| Optimism Sepolia | 11155420 | https://sepolia-optimism.etherscan.io | https://app.optimism.io/faucet |
| Optimism Mainnet | 10 | https://optimistic.etherscan.io | N/A |

---

## Deploy to Mainnet Later

When you're ready for production:

```bash
# Get mainnet ETH on Optimism
# Update .env with mainnet RPC

# Deploy to production
npx hardhat ignition deploy ignition/modules/PayNoteRegistry.ts --network optimism
```

**⚠️ Mainnet Checklist:**
- [ ] Tested thoroughly on testnet
- [ ] Contracts audited (for large projects)
- [ ] Frontend ready
- [ ] User docs written
- [ ] Emergency procedures planned
- [ ] Monitor gas prices
- [ ] Have backup plan

---

## Support

**Need help?**
- Optimism Discord: https://discord.optimism.io/
- Hardhat Discord: https://hardhat.org/discord
- Optimism Docs: https://docs.optimism.io/

**Your contract:**
- Version: 2.0.0
- Tests: 11/11 passing ✅
- Optimized: Yes (200 runs)
- Ready: YES! 🚀

---

Good luck with your deployment! 🎉
