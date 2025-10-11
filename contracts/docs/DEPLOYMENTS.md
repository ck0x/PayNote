# PayNoteRegistry Deployments

This document tracks all contract deployments across different networks.

## Testnet Deployments

### Optimism Sepolia
- **Contract:** PayNoteRegistry v2.0.0
- **Address:** `0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f`
- **Chain ID:** 11155420
- **Deployed:** October 11, 2025
- **Owner/Deployer:** `0x8689ff1c035314d6ef54c96998e25276e2e5a19c`
- **Etherscan:** https://sepolia-optimism.etherscan.io/address/0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f#code
- **Blockscout:** https://optimism-sepolia.blockscout.com/address/0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f#code
- **Status:** ✅ Active & Verified

## Production Deployments

### Optimism Mainnet
- **Status:** Not yet deployed
- **Planned Chain ID:** 10

---

## Deployment Commands

### Testnet (Optimism Sepolia)
```bash
npx hardhat ignition deploy ignition/modules/PayNoteRegistry.ts --network optimismSepolia
```

### Production (Optimism Mainnet)
```bash
npx hardhat ignition deploy ignition/modules/PayNoteRegistry.ts --network optimism
```

## Verification Commands

### Verify on Optimism Sepolia
```bash
npx hardhat verify --network optimismSepolia \
  --build-profile production \
  0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f \
  0x8689ff1c035314d6ef54c96998e25276e2e5a19c
```

---

## Notes

- Testnet deployments are stored in `ignition/deployments/chain-11155420/` (gitignored)
- Production deployments should be committed to version control
- Always verify contract source code after deployment
- Keep track of deployer addresses and owner addresses separately
