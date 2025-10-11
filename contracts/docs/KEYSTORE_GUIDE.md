# Hardhat 3 Keystore Quick Reference

## What is Hardhat Keystore?

Hardhat 3's built-in **encrypted secrets manager** that stores your private keys and API keys securely. No more `.env` files with plain-text secrets!

## Key Benefits

✅ **Encrypted** - All secrets are AES-256 encrypted with your password  
✅ **Git-Safe** - Encrypted files are safe to backup (password stays with you)  
✅ **No .env Files** - No risk of committing plain-text secrets  
✅ **Cross-Platform** - Works on Linux, Mac, and Windows  
✅ **Password Protected** - Prompts for password only when needed  

---

## Quick Commands

### Set a Secret
```bash
npx hardhat keystore set SECRET_NAME
```
**First time:** Creates encrypted keystore and asks for password  
**After:** Prompts for password, then secret value

### List All Secrets
```bash
npx hardhat keystore list
```
Shows secret names (not values)

### Delete a Secret
```bash
npx hardhat keystore delete SECRET_NAME
```

### View Keystore Location
Your secrets are stored in:
- **Linux/Mac:** `~/.hardhat-keystore/production/keystore.json`
- **Windows:** `%USERPROFILE%\.hardhat-keystore\production\keystore.json`

---

## Setup for PayNote Deployment

### 1. Required Secrets (Optimism Sepolia)

```bash
# Private key
npx hardhat keystore set OPTIMISM_SEPOLIA_PRIVATE_KEY
# Enter: Your wallet private key (from MetaMask)

# RPC URL (optional, has default)
npx hardhat keystore set OPTIMISM_SEPOLIA_RPC_URL
# Enter: https://sepolia.optimism.io
# Or your Alchemy URL: https://opt-sepolia.g.alchemy.com/v2/YOUR_KEY

# Etherscan API key (for verification)
npx hardhat keystore set OPTIMISM_ETHERSCAN_API_KEY
# Enter: Your API key from optimistic.etherscan.io
```

### 2. Optional Secrets (Other Networks)

```bash
# For Ethereum Sepolia testnet
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY

# For Optimism Mainnet (production)
npx hardhat keystore set OPTIMISM_RPC_URL
npx hardhat keystore set OPTIMISM_PRIVATE_KEY
```

### 3. Verify Setup
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

## How It Works

### In hardhat.config.ts:
```typescript
import { configVariable } from "hardhat/config";

const config: HardhatUserConfig = {
  networks: {
    optimismSepolia: {
      url: configVariable("OPTIMISM_SEPOLIA_RPC_URL"),
      accounts: [configVariable("OPTIMISM_SEPOLIA_PRIVATE_KEY")],
    },
  },
};
```

### When You Run a Command:
```bash
npx hardhat ignition deploy ignition/modules/PayNoteRegistry.ts --network optimismSepolia
```

**What happens:**
1. Hardhat detects `configVariable()` usage
2. Prompts: `[hardhat-keystore] Enter the password: ********`
3. Decrypts secrets from keystore
4. Uses decrypted values for deployment
5. Clears decrypted values from memory when done

---

## Security Features

### Encryption
- **Algorithm:** AES-256-GCM
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **Salt:** Random 32-byte salt per keystore

### Password Requirements
- Minimum 8 characters
- Set during first `keystore set` command
- Required every time secrets are accessed

### File Safety
The encrypted keystore file (`keystore.json`) is:
- ✅ Safe to backup to cloud storage
- ✅ Safe to include in disaster recovery backups
- ✅ Useless without your password
- ❌ Never commit password to git!

---

## Best Practices

### ✅ DO:
- Use strong, unique password for your keystore
- Store password in a password manager (1Password, Bitwarden, etc.)
- Back up the encrypted keystore file
- Use separate private keys for testnet vs mainnet
- Use network-specific variable names (e.g., `OPTIMISM_SEPOLIA_PRIVATE_KEY`)

### ❌ DON'T:
- Share your keystore password
- Use same password as your wallet
- Commit password to git
- Use the same private key for all networks
- Store password in plain text files

---

## Troubleshooting

### Forgot Password
If you forget your keystore password, you'll need to recreate it:

```bash
# Remove old keystore
rm -rf ~/.hardhat-keystore/production

# Create new keystore with new password
npx hardhat keystore set OPTIMISM_SEPOLIA_PRIVATE_KEY
```

⚠️ **Warning:** This deletes all secrets. You'll need to re-enter them all.

### Wrong Password Error
```
Error: Invalid password
```
**Solution:** Re-enter correct password. No retry limit.

### Keystore Not Found
```
Error: No keystore found
```
**Solution:** Run `npx hardhat keystore set SECRET_NAME` to create one.

### Permission Denied
```
Error: EACCES: permission denied
```
**Solution (Linux/Mac):**
```bash
chmod 700 ~/.hardhat-keystore/production
chmod 600 ~/.hardhat-keystore/production/keystore.json
```

---

## Advanced Usage

### Multiple Environments
Hardhat supports multiple keystore environments:

```bash
# Production keystore (default)
npx hardhat keystore set SECRET_NAME

# Development keystore
npx hardhat keystore set SECRET_NAME --environment dev

# Staging keystore
npx hardhat keystore set SECRET_NAME --environment staging
```

Use with:
```bash
npx hardhat deploy --network optimismSepolia --keystore-environment dev
```

### CI/CD Integration
For automated deployments, you can:

**Option 1: Environment Variables (Less Secure)**
```bash
export OPTIMISM_SEPOLIA_PRIVATE_KEY="0x..."
npx hardhat deploy --network optimismSepolia
```

**Option 2: Encrypted Keystore + Password Secret**
```bash
# Store encrypted keystore in repo
git add .hardhat-keystore/production/keystore.json

# Store password in GitHub Secrets: HARDHAT_KEYSTORE_PASSWORD
# Then in CI:
echo $HARDHAT_KEYSTORE_PASSWORD | npx hardhat deploy --network optimismSepolia
```

---

## Migration from .env Files

If you have existing `.env` files:

### 1. Read Current Values
```bash
cat .env
```

### 2. Move to Keystore
```bash
# For each secret in .env:
npx hardhat keystore set SECRET_NAME
# Paste the value from .env

# Repeat for all secrets
```

### 3. Verify
```bash
npx hardhat keystore list
```

### 4. Delete .env (Optional)
```bash
rm .env
```

### 5. Update .gitignore
Your `.gitignore` should already have:
```
.env
.env.local
.hardhat-keystore/
```

---

## Comparison: Keystore vs .env

| Feature | Hardhat Keystore | .env Files |
|---------|------------------|------------|
| **Encryption** | ✅ AES-256 | ❌ Plain text |
| **Password Protected** | ✅ Yes | ❌ No |
| **Git Safety** | ✅ File is encrypted | ⚠️ Must gitignore |
| **Backup Safety** | ✅ Encrypted | ❌ Plain text |
| **Accidental Exposure** | ✅ Protected | ❌ High risk |
| **Cross-Platform** | ✅ Yes | ✅ Yes |
| **CI/CD** | ⚠️ Needs setup | ✅ Easy |

---

## Summary

**Hardhat 3 Keystore** is the modern, secure way to manage secrets:

```bash
# Set it up once
npx hardhat keystore set OPTIMISM_SEPOLIA_PRIVATE_KEY

# Use it everywhere
npx hardhat deploy --network optimismSepolia
npx hardhat verify --network optimismSepolia
npx hardhat console --network optimismSepolia
```

**No more worrying about committing secrets to git!** 🎉
