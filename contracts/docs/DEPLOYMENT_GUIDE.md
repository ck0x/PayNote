# Deploy PayNoteRegistry to Optimism Sepolia

This guide uses **Hardhat 3's encrypted keystore** for secure secret management. No `.env` files needed!

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

### 3. Get Your Wallet Private Key
From MetaMask:
1. Click on your account
2. Account Details → Show Private Key
3. Enter your password
4. Copy the private key (keep it secret!)

### 4. Get Optimism Etherscan API Key (optional, for verification)
1. Go to https://optimistic.etherscan.io/
2. Sign up/login
3. Go to API Keys
4. Create new API key
5. Copy the key

---

## Setup Encrypted Secrets (Hardhat Keystore)

Hardhat 3 includes an **encrypted keystore** that securely stores your secrets. You'll create a password-protected keystore once, then Hardhat will prompt for the password when needed.

### Step 1: Set Your Private Key
```bash
npx hardhat keystore set OPTIMISM_SEPOLIA_PRIVATE_KEY
```

You'll be prompted:
1. **First time:** Create a password for your keystore (remember this!)
2. Enter your wallet private key
3. Done! Your key is now encrypted

### Step 2: Set RPC URL (Optional)
The config uses a default public RPC, but you can override it:

```bash
npx hardhat keystore set OPTIMISM_SEPOLIA_RPC_URL
```
Enter: `https://sepolia.optimism.io` (or your Alchemy/Infura URL)

### Step 3: Set Etherscan API Key (Optional, for verification)
```bash
npx hardhat keystore set OPTIMISM_ETHERSCAN_API_KEY
```
Enter your API key from Optimistic Etherscan.

### Verify Your Keystore
```bash
npx hardhat keystore list
```

Should show:
```
Keys in the production keystore:
OPTIMISM_SEPOLIA_RPC_URL
OPTIMISM_SEPOLIA_PRIVATE_KEY
OPTIMISM_ETHERSCAN_API_KEY
```

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
1. Hardhat prompts for your keystore password
2. Decrypts your private key
3. Connects to Optimism Sepolia
4. Deploys PayNoteRegistry contract
5. You (deployer) become the owner
6. Returns deployment address

**Expected output:**
```
[hardhat-keystore] Enter the password: ********
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

## Verify Contract on Block Explorers

Verification makes your contract source code public and verifiable on Etherscan and Blockscout.

### Verify with Build Profile
```bash
npx hardhat verify --network optimismSepolia --build-profile production <CONTRACT_ADDRESS> <OWNER_ADDRESS>
```

**Example:**
```bash
npx hardhat verify --network optimismSepolia --build-profile production \
  0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f \
  0x8689ff1c035314d6ef54c96998e25276e2e5a19c
```

**What happens:**
1. Hardhat prompts for keystore password (to decrypt Etherscan API key)
2. Compiles with `production` profile (same as deployment)
3. Submits to both Etherscan and Blockscout
4. Polls for verification results

**Expected output:**
```
[hardhat-keystore] Enter the password: ********

=== Etherscan ===
✅ Contract verified successfully on Optimism Sepolia Etherscan!
   Explorer: https://sepolia-optimism.etherscan.io/address/0x...#code

=== Blockscout ===
✅ Contract verified successfully on Blockscout!
   Explorer: https://optimism-sepolia.blockscout.com/address/0x...#code
```

### What verification does:
- ✅ Makes source code publicly viewable
- ✅ Enables Etherscan UI interactions
- ✅ Builds trust with users
- ✅ Allows others to audit your code
- ✅ Verifies on both Etherscan AND Blockscout

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

### Error: "Configuration Variable not found"
**Problem:** Hardhat can't find your encrypted secret.
**Solution:**
```bash
# List what's in your keystore
npx hardhat keystore list

# Add missing variable
npx hardhat keystore set OPTIMISM_SEPOLIA_PRIVATE_KEY
```

### Error: "insufficient funds"
**Problem:** Not enough ETH for deployment.
**Solution:**
- Get more Sepolia ETH from faucet
- Bridge to Optimism Sepolia
- Check balance: https://sepolia-optimism.etherscan.io/

### Error: "Invalid password"
**Problem:** Wrong keystore password.
**Solution:**
- Remember the password you set with `keystore set`
- If forgotten, you'll need to recreate the keystore:
  ```bash
  # Remove old keystore (BE CAREFUL!)
  rm -rf ~/.hardhat-keystore/production
  
  # Set secrets again with new password
  npx hardhat keystore set OPTIMISM_SEPOLIA_PRIVATE_KEY
  ```

### Error: "nonce too high"
**Problem:** Nonce mismatch in MetaMask.
**Solution:**
- Reset your account in MetaMask
- Settings → Advanced → Clear activity tab data

### Error: "contract verification failed"
**Problem:** Verification didn't match deployed bytecode.
**Solution:**
- Use `--build-profile production` flag (Ignition uses production profile)
- Make sure you provide correct constructor arguments (owner address)
- Example:
  ```bash
  npx hardhat verify --network optimismSepolia --build-profile production \
    CONTRACT_ADDRESS OWNER_ADDRESS
  ```

### Keystore Location
Your encrypted secrets are stored at:
- **Linux/Mac:** `~/.hardhat-keystore/production/keystore.json`
- **Windows:** `%USERPROFILE%\.hardhat-keystore\production\keystore.json`

This file is encrypted and safe to backup (but keep your password secret!).

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
