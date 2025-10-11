// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IPayNoteRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PayNoteRegistry
 * @dev Implementation of the PayNote Registry standard - Send payments with on-chain references
 * @notice This contract allows users to send payments with references attached in a single atomic transaction
 * 
 * Use Cases:
 * - Invoice payments with reference numbers
 * - Rent payments with month/year references
 * - Subscription payments with service details
 * - Donation tracking with donor messages
 * - Business-to-business transaction records
 * - Any payment that needs an immutable reference
 */
contract PayNoteRegistry is IPayNoteRegistry, Ownable, ReentrancyGuard {
    // Storage
    mapping(bytes32 => PayNote) private payNotes;
    mapping(address => bytes32[]) private senderPayNotes;
    mapping(address => bytes32[]) private recipientPayNotes;
    
    // Global counter for generating unique IDs
    uint256 private payNoteCounter;
    
    // Fee configuration (optional - can be 0)
    uint256 public registrationFee;
    
    // Protocol version for future upgrades
    string public constant VERSION = "2.0.0";
    
    /**
     * @dev Constructor
     * @param initialOwner Address that will own the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        registrationFee = 0; // Start with no fees
    }
    
    /**
     * @dev Modifier to check if a PayNote exists
     */
    modifier payNoteExistsModifier(bytes32 payNoteId) {
        require(payNotes[payNoteId].sender != address(0), "PayNote does not exist");
        _;
    }
    
    /**
     * @inheritdoc IPayNoteRegistry
     */
    function sendPaymentWithReference(
        address recipient,
        string calldata payReference
    ) external payable override nonReentrant returns (bytes32 payNoteId) {
        require(recipient != address(0), "Invalid recipient address");
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(bytes(payReference).length > 0, "Reference cannot be empty");
        require(bytes(payReference).length <= 256, "Reference too long");
        
        // Calculate total cost (payment + registration fee)
        uint256 paymentAmount = msg.value - registrationFee;
        require(msg.value >= registrationFee, "Insufficient funds for registration fee");
        require(paymentAmount > 0, "Payment amount after fees must be greater than 0");
        
        // Generate unique PayNote ID
        payNoteCounter++;
        payNoteId = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                paymentAmount,
                payReference,
                block.timestamp,
                payNoteCounter
            )
        );
        
        // Ensure ID is unique (should always be true with counter)
        require(payNotes[payNoteId].sender == address(0), "PayNote ID collision");
        
        // Forward payment to recipient immediately
        (bool success, ) = recipient.call{value: paymentAmount}("");
        require(success, "Payment transfer failed");
        
        // Store the PayNote
        payNotes[payNoteId] = PayNote({
            sender: msg.sender,
            recipient: recipient,
            amount: paymentAmount,
            payReference: payReference,
            timestamp: block.timestamp
        });
        
        // Track PayNotes by sender and recipient
        senderPayNotes[msg.sender].push(payNoteId);
        recipientPayNotes[recipient].push(payNoteId);
        
        emit PaymentSent(
            payNoteId,
            msg.sender,
            recipient,
            paymentAmount,
            payReference,
            block.timestamp
        );
        
        return payNoteId;
    }
    
    /**
     * @inheritdoc IPayNoteRegistry
     */
    function resolvePayNote(
        bytes32 payNoteId
    ) external view override payNoteExistsModifier(payNoteId) returns (PayNote memory) {
        return payNotes[payNoteId];
    }
    
    /**
     * @inheritdoc IPayNoteRegistry
     */
    function getReference(
        bytes32 payNoteId
    ) external view override payNoteExistsModifier(payNoteId) returns (string memory) {
        return payNotes[payNoteId].payReference;
    }
    
    /**
     * @inheritdoc IPayNoteRegistry
     */
    function getPayNotesBySender(
        address sender
    ) external view override returns (bytes32[] memory) {
        return senderPayNotes[sender];
    }
    
    /**
     * @inheritdoc IPayNoteRegistry
     */
    function getPayNotesByRecipient(
        address recipient
    ) external view override returns (bytes32[] memory) {
        return recipientPayNotes[recipient];
    }
    
    /**
     * @inheritdoc IPayNoteRegistry
     */
    function payNoteExists(bytes32 payNoteId) external view override returns (bool) {
        return payNotes[payNoteId].sender != address(0);
    }
    
    /**
     * @dev Sets the registration fee (only owner)
     * @param newFee New registration fee in wei
     */
    function setRegistrationFee(uint256 newFee) external onlyOwner {
        registrationFee = newFee;
    }
    
    /**
     * @dev Withdraws collected fees (only owner)
     */
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Returns the total number of PayNotes created
     */
    function getTotalPayNotes() external view returns (uint256) {
        return payNoteCounter;
    }
    
    /**
     * @dev Batch resolve multiple PayNotes
     * @param payNoteIds Array of PayNote IDs to resolve
     * @return payNotesList Array of PayNote structures
     */
    function batchResolvePayNotes(
        bytes32[] calldata payNoteIds
    ) external view returns (PayNote[] memory payNotesList) {
        payNotesList = new PayNote[](payNoteIds.length);
        
        for (uint256 i = 0; i < payNoteIds.length; i++) {
            if (payNotes[payNoteIds[i]].sender != address(0)) {
                payNotesList[i] = payNotes[payNoteIds[i]];
            }
        }
        
        return payNotesList;
    }
}
