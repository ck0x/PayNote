# Contributing to PayNote

First off, thank you for considering contributing to PayNote! It's people like you that make PayNote such a great tool for the Ethereum community.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. We pledge to make participation in our project a harassment-free experience for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what you expected**
* **Include screenshots if relevant**
* **Specify your environment** (OS, Node version, Hardhat version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List some examples of how it would be used**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code follows the existing style
6. Issue the pull request!

## Development Process

### Setting Up Your Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/PayNote.git
cd PayNote/contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test
```

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Keep gas costs in mind

3. **Test your changes**
   ```bash
   # Run all tests
   npx hardhat test
   
   # Run specific test file
   npx hardhat test test/PayNoteRegistry.ts
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add multi-recipient payment support
fix: resolve reentrancy vulnerability in withdrawal
docs: update deployment guide with mainnet instructions
test: add edge case tests for zero-value payments
```

## Coding Standards

### Solidity Style Guide

Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html):

```solidity
// ✅ Good
function sendPaymentWithReference(
    address recipient,
    string calldata payReference
) external payable returns (bytes32 payNoteId) {
    require(recipient != address(0), "Invalid recipient");
    // ...
}

// ❌ Bad
function sendPaymentWithReference(address recipient,string calldata payReference) external payable returns(bytes32 payNoteId){
    require(recipient!=address(0),"Invalid recipient");
    // ...
}
```

### TypeScript Style Guide

```typescript
// ✅ Good
const payNote = await payNoteRegistry.read.resolvePayNote([payNoteId]);
expect(payNote.sender).to.equal(sender.account.address);

// ❌ Bad
const payNote=await payNoteRegistry.read.resolvePayNote([payNoteId])
expect(payNote.sender).to.equal(sender.account.address)
```

### Gas Optimization

Always consider gas costs:

```solidity
// ✅ Good - Pack variables
struct PayNote {
    address sender;      // 20 bytes
    address recipient;   // 20 bytes
    uint256 amount;      // 32 bytes
    string payReference; // dynamic
    uint256 timestamp;   // 32 bytes
}

// ❌ Bad - Wasteful storage
mapping(bytes32 => address) public senders;
mapping(bytes32 => address) public recipients;
mapping(bytes32 => uint256) public amounts;
// ... (multiple mappings instead of struct)
```

## Testing Requirements

All code contributions must include tests:

### Smart Contract Tests

```solidity
// contracts/tests/MyFeature.t.sol
function test_MyNewFeature() public {
    // Setup
    address recipient = address(0x123);
    
    // Execute
    bytes32 id = payNoteRegistry.sendPaymentWithReference{value: 1 ether}(
        recipient,
        "Test"
    );
    
    // Assert
    assertTrue(payNoteRegistry.payNoteExists(id));
}
```

### TypeScript Tests

```typescript
// test/MyFeature.ts
it("Should handle my new feature correctly", async function () {
  const { payNoteRegistry, sender, recipient } = await deployFixture();
  
  const hash = await payNoteRegistry.write.myNewFeature(
    [recipient.account.address],
    { account: sender.account }
  );
  
  expect(hash).to.not.equal(undefined);
});
```

## Documentation

Update documentation when you:

- Add new features
- Change existing behavior
- Fix bugs that affect usage
- Add configuration options

Documentation locations:
- `README.md` - Overview and quick start
- `contracts/docs/` - Detailed guides
- Code comments - Complex logic explanation
- Function NatSpec - All public/external functions

## Security

### Reporting Security Issues

**DO NOT** open a public issue for security vulnerabilities.

Instead:
1. Email security@paynote.io
2. Or open a private security advisory on GitHub
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Security Best Practices

When contributing code:

- ✅ Use OpenZeppelin contracts when possible
- ✅ Add reentrancy guards for external calls
- ✅ Validate all inputs
- ✅ Check for integer overflow/underflow
- ✅ Use `call` instead of `transfer` for ETH transfers
- ✅ Follow Checks-Effects-Interactions pattern
- ❌ Never use `tx.origin` for authentication
- ❌ Avoid `delegatecall` unless necessary
- ❌ Don't rely on timestamps for critical logic

## Review Process

1. **Automated Checks**
   - Tests must pass
   - Code must compile
   - Linting must pass

2. **Code Review**
   - Maintainer reviews code
   - Provides feedback
   - Requests changes if needed

3. **Approval & Merge**
   - Approved by maintainer
   - Merged to main branch
   - Included in next release

## Project Structure

```
PayNote/
├── contracts/
│   ├── contracts/          # Solidity contracts
│   │   ├── PayNoteRegistry.sol
│   │   ├── interfaces/
│   │   └── tests/
│   ├── test/              # TypeScript tests
│   ├── scripts/           # Deployment scripts
│   ├── ignition/          # Ignition modules
│   └── docs/              # Documentation
└── frontend/              # Frontend (future)
```

## Questions?

Don't hesitate to ask! You can:

- Open a discussion on GitHub
- Join our Discord
- Email hello@paynote.io

## Recognition

Contributors will be:

- Listed in our README
- Mentioned in release notes
- Credited in documentation
- Given contributor role on Discord

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to PayNote! 🎉
