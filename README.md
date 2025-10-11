<div align="center">

# 💸 PayNote

### Attach References to Your On-Chain Payments

**ENS made addresses human-readable. We make transactions human-meaningful.**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-3.0-FFF100?style=for-the-badge&logo=hardhat)](https://hardhat.org/)
[![Optimism](https://img.shields.io/badge/Optimism-Sepolia-FF0420?style=for-the-badge&logo=optimism)](https://www.optimism.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![Tests](https://img.shields.io/badge/Tests-11%2F11%20Passing-success?style=flat-square)]()
[![Coverage](https://img.shields.io/badge/Coverage-100%25-success?style=flat-square)]()
[![Verified](https://img.shields.io/badge/Contract-Verified-success?style=flat-square)](https://sepolia-optimism.etherscan.io/address/0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f#code)

[Live Demo](#) • [Documentation](./contracts/docs/) • [Report Bug](https://github.com/ck0x/PayNote/issues) • [Request Feature](https://github.com/ck0x/PayNote/issues)

</div>

---

## 🚀 What is PayNote?

**PayNote** is a decentralized protocol for attaching human-readable references to blockchain transactions. Think of it as **ENS for transaction references** - send ETH with invoice numbers, rent payments, donation messages, or any reference you need to track.

### The Problem

Traditional blockchain transactions are just addresses and amounts. How do you track:
- 🧾 Invoice payments (`"Invoice #12345"`)
- 🏠 Rent payments (`"Rent - January 2025"`)
- 💝 Donations (`"For the children's fund"`)
- 📦 Business transactions (`"Order #ABC-789"`)

### The Solution

PayNote lets you **send payments with references in a single atomic transaction**, stored permanently on-chain with cryptographic authentication. No post-transaction tagging, no forgery, just pure trustless reference storage.

```solidity
// Send 1 ETH with a reference
payNoteRegistry.sendPaymentWithReference{value: 1 ether}(
    recipientAddress,
    "Invoice #12345 - Website Design"
);
```

---

## ✨ Features

- ⚡ **Atomic Payments** - Reference stored in the same transaction as the payment
- 🔐 **Authenticated** - Only the sender can create the reference (no forgery)
- 🌐 **Standard Interface** - Designed to become an ecosystem-wide standard like ENS
- 📝 **Permanent Storage** - References stored on-chain forever
- 🔍 **Easy Queries** - Get all payments sent/received by any address
- 💰 **Low Cost** - Deployed on Optimism L2 for 100x cheaper gas
- 🛡️ **Battle-Tested** - OpenZeppelin contracts for security
- ✅ **Verified** - Source code verified on Etherscan & Blockscout

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User / DApp                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              PayNoteRegistry Contract                        │
│  • sendPaymentWithReference(recipient, reference)            │
│  • resolvePayNote(payNoteId)                                 │
│  • getPayNotesBySender(sender)                               │
│  • getPayNotesByRecipient(recipient)                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  Forward ETH to  │          │   Store PayNote  │
│    Recipient     │          │    On-Chain      │
└──────────────────┘          └──────────────────┘
```

---

## 📦 Repository Structure

```
PayNote/
├── contracts/               # Smart contracts
│   ├── contracts/
│   │   ├── PayNoteRegistry.sol          # Main implementation
│   │   ├── interfaces/
│   │   │   └── IPayNoteRegistry.sol     # Standard interface
│   │   └── tests/
│   │       └── PayNoteRegistry.t.sol    # Solidity tests
│   ├── test/
│   │   └── PayNoteRegistry.ts           # TypeScript tests
│   ├── scripts/
│   │   ├── deploy.ts                    # Deployment script
│   │   └── test-payment.ts              # Test interaction
│   ├── ignition/
│   │   └── modules/
│   │       └── PayNoteRegistry.ts       # Ignition deployment
│   └── docs/
│       ├── DEPLOYMENT_GUIDE.md          # How to deploy
│       ├── KEYSTORE_GUIDE.md            # Hardhat keystore guide
│       └── DEPLOYMENTS.md               # Deployment addresses
│
└── frontend/               # Next.js frontend (coming soon)
    └── paynote/
```

---

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- MetaMask or compatible wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/ck0x/PayNote.git
cd PayNote/contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test
```

### Deploy to Optimism Sepolia

```bash
# Set up encrypted secrets
npx hardhat keystore set OPTIMISM_SEPOLIA_PRIVATE_KEY
npx hardhat keystore set OPTIMISM_SEPOLIA_RPC_URL
npx hardhat keystore set OPTIMISM_ETHERSCAN_API_KEY

# Deploy
npx hardhat ignition deploy ignition/modules/PayNoteRegistry.ts --network optimismSepolia

# Verify
npx hardhat verify --network optimismSepolia --build-profile production <CONTRACT_ADDRESS> <OWNER_ADDRESS>
```

See [DEPLOYMENT_GUIDE.md](./contracts/docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🎯 Usage

### Send a Payment with Reference

```typescript
import { parseEther } from "viem";

// Connect to contract
const payNoteRegistry = await viem.getContractAt(
  "PayNoteRegistry",
  "0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f"
);

// Send payment with reference
const hash = await payNoteRegistry.write.sendPaymentWithReference(
  ["0xRecipientAddress", "Invoice #12345"],
  { value: parseEther("1.0") }
);

console.log("Payment sent:", hash);
```

### Query PayNotes

```typescript
// Get all PayNotes sent by an address
const payNotes = await payNoteRegistry.read.getPayNotesBySender([
  "0xSenderAddress"
]);

// Resolve a specific PayNote
const payNote = await payNoteRegistry.read.resolvePayNote([payNoteId]);

console.log({
  sender: payNote.sender,
  recipient: payNote.recipient,
  amount: payNote.amount,
  reference: payNote.payReference,
  timestamp: payNote.timestamp
});
```

---

## 🌐 Deployed Contracts

### Optimism Sepolia (Testnet)

| Property | Value |
|----------|-------|
| **Contract** | PayNoteRegistry v2.0.0 |
| **Address** | [`0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f`](https://sepolia-optimism.etherscan.io/address/0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f#code) |
| **Chain ID** | 11155420 |
| **Status** | ✅ Active & Verified |
| **Etherscan** | [View on Etherscan](https://sepolia-optimism.etherscan.io/address/0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f#code) |
| **Blockscout** | [View on Blockscout](https://optimism-sepolia.blockscout.com/address/0x0294b9c5902361b0f11bBAf0F1A4ca9F745ec13f#code) |

### Optimism Mainnet (Production)

🚧 **Coming Soon** - Mainnet deployment planned after testnet validation

---

## 🧪 Testing

PayNote has comprehensive test coverage with both Solidity and TypeScript tests:

```bash
# Run all tests
npx hardhat test

# Run Solidity tests only
npx hardhat test contracts/tests/PayNoteRegistry.t.sol

# Run TypeScript tests only
npx hardhat test test/PayNoteRegistry.ts
```

**Test Results:**
```
Running Solidity tests
  ✔ test_InitialState()
  ✔ test_SendPaymentWithReference()
  ✔ test_ResolvePayNote()
  ✔ test_GetPayNotesBySender()
  ✔ test_GetPayNotesByRecipient()

Running TypeScript tests
  ✔ Should set the correct owner
  ✔ Should start with zero registration fee
  ✔ Should have correct version
  ✔ Should send payment and store reference atomically
  ✔ Should emit PaymentSent event
  ✔ Should resolve a PayNote correctly

11 passing (1.6s)
```

---

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** 0.8.28 - Latest stable version
- **Hardhat** 3.0 - Development environment
- **OpenZeppelin** 5.4.0 - Battle-tested contracts
- **Viem** 2.38 - Type-safe Ethereum library

### Testing
- **Hardhat Test** - TypeScript integration tests
- **Forge-std** - Solidity unit tests
- **Chai** - Assertions

### Deployment
- **Hardhat Ignition** - Declarative deployments
- **Hardhat Verify** - Contract verification
- **Encrypted Keystore** - Secure secret management

### Network
- **Optimism Sepolia** - L2 testnet
- **Optimism Mainnet** - L2 production (planned)

---

## 💰 Gas Costs & Economics

### Cost Comparison

| Action | Direct Transfer | PayNote Transfer | Premium |
|--------|----------------|------------------|---------|
| Gas | ~21,000 | ~100-120k | ~5x |
| Optimism L2 | ~$0.001 | ~$0.005 | +$0.004 |
| Ethereum L1 | ~$0.50 | ~$3.00 | +$2.50 |

### Why the Premium is Worth It

- 🔐 **Cryptographic Authentication** - Provably from the sender
- 📝 **Permanent Storage** - Reference stored forever on-chain
- 🛡️ **No Forgery** - Impossible to fake a PayNote
- ⚡ **100x Cheaper on L2** - Optimism makes it affordable
- 🎯 **Single Transaction** - Atomic payment + reference

---

## 📚 Documentation

- [Deployment Guide](./contracts/docs/DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [Keystore Guide](./contracts/docs/KEYSTORE_GUIDE.md) - Hardhat encrypted secrets
- [Verification Flow](./contracts/docs/VERIFICATION_FLOW.md) - How contract verification works
- [Blockscout vs Etherscan](./contracts/docs/BLOCKSCOUT_VS_ETHERSCAN.md) - Block explorer comparison
- [Deployment Success](./contracts/docs/DEPLOYMENT_SUCCESS.md) - What we built

---

## 🔐 Security

### Audits
- ⏳ **Audit Status:** Pending (testnet phase)
- 🎯 **Planned:** Professional audit before mainnet launch

### Security Features
- ✅ **OpenZeppelin** - Industry-standard secure contracts
- ✅ **ReentrancyGuard** - Protection against reentrancy attacks
- ✅ **Ownable** - Access control for administrative functions
- ✅ **Automated Tests** - 11/11 tests passing
- ✅ **Verified Source** - Code verified on Etherscan & Blockscout

### Responsible Disclosure
Found a security issue? Please email: security@paynote.io (or open a private security advisory)

---

## 🗺️ Roadmap

### ✅ Phase 1: Core Protocol (Complete)
- [x] PayNoteRegistry contract implementation
- [x] Standard interface (IPayNoteRegistry)
- [x] Comprehensive test suite
- [x] Deployment to Optimism Sepolia
- [x] Contract verification

### 🚧 Phase 2: Frontend (In Progress)
- [ ] Next.js web application
- [ ] Wallet integration (MetaMask, WalletConnect)
- [ ] Payment history dashboard
- [ ] Search and filter PayNotes
- [ ] Export to CSV

### 📋 Phase 3: Ecosystem (Planned)
- [ ] Mainnet deployment (Optimism)
- [ ] Professional security audit
- [ ] SDK/NPM package
- [ ] Multi-chain support (Arbitrum, Base)
- [ ] EIP proposal for standard

### 🎯 Phase 4: Advanced Features (Future)
- [ ] PayNote escrow contracts
- [ ] Recurring payment support
- [ ] Multi-recipient splits
- [ ] Reference templates
- [ ] API for integration

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Write tests for new features
- Follow Solidity style guide
- Update documentation
- Keep gas costs in mind
- Use conventional commits

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenZeppelin** - Secure smart contract library
- **Hardhat** - Amazing development environment
- **Optimism** - Affordable L2 infrastructure
- **Viem** - Modern Ethereum library
- **The Ethereum Community** - For building the future

---

## 📞 Contact & Links

- **Website:** [paynote.io](#) (coming soon)
- **Twitter:** [@PayNoteProtocol](#)
- **Discord:** [Join our community](#)
- **Email:** hello@paynote.io

---

<div align="center">

**Built with ❤️ for the Ethereum ecosystem**

[![GitHub Stars](https://img.shields.io/github/stars/ck0x/PayNote?style=social)](https://github.com/ck0x/PayNote)
[![Twitter Follow](https://img.shields.io/twitter/follow/PayNoteProtocol?style=social)](#)

</div>
