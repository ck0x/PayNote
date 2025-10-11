// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./IPayNoteRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PayNoteRegistry
 * @dev Implementation of the PayNote Registry standard
 * @notice This contract allows users to create payment references that are stored on-chain
 * and can be resolved by anyone. It's designed to become a standard protocol for transaction references.
 * 
 * Use Cases:
 * - Invoice payments with reference numbers
 * - Rent payments with month/year references
 * - Subscription payments with service details
 * - Donation tracking with donor messages
 * - Business-to-business transaction records
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
    string public constant VERSION = "1.0.0";
    
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
    function createPayNote(
        address recipient,
        uint256 amount,
        string calldata reference
    ) external payable override nonReentrant returns (bytes32 payNoteId) {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(reference).length > 0, "Reference cannot be empty");
        require(bytes(reference).length <= 256, "Reference too long");
        require(msg.value >= registrationFee, "Insufficient registration fee");
        
        // Generate unique PayNote ID
        payNoteCounter++;
        payNoteId = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                amount,
                reference,
                block.timestamp,
                payNoteCounter
            )
        );
        
        // Ensure ID is unique (should always be true with counter)
        require(payNotes[payNoteId].sender == address(0), "PayNote ID collision");
        
        // Create the PayNote
        payNotes[payNoteId] = PayNote({
            sender: msg.sender,
            recipient: recipient,
            amount: amount,
            reference: reference,
            createdAt: block.timestamp,
            fulfilledAt: 0,
            txHash: bytes32(0),
            isFulfilled: false
        });
        
        // Track PayNotes by sender and recipient
        senderPayNotes[msg.sender].push(payNoteId);
        recipientPayNotes[recipient].push(payNoteId);
        
        emit PayNoteCreated(
            payNoteId,
            msg.sender,
            recipient,
            amount,
            reference,
            block.timestamp
        );
        
        return payNoteId;
    }
    
    /**
     * @inheritdoc IPayNoteRegistry
     */
    function fulfillPayNote(
        bytes32 payNoteId,
        bytes32 txHash
    ) external override payNoteExistsModifier(payNoteId) {
        PayNote storage payNote = payNotes[payNoteId];
        
        require(msg.sender == payNote.sender, "Only sender can fulfill PayNote");
        require(!payNote.isFulfilled, "PayNote already fulfilled");
        require(txHash != bytes32(0), "Invalid transaction hash");
        
        payNote.isFulfilled = true;
        payNote.fulfilledAt = block.timestamp;
        payNote.txHash = txHash;
        
        emit PayNoteFulfilled(payNoteId, txHash, block.timestamp);
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
        return payNotes[payNoteId].reference;
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
     * @dev Updates the reference for an existing PayNote (only by sender, only if not fulfilled)
     * @param payNoteId Unique identifier for the PayNote
     * @param newReference New reference string
     */
    function updateReference(
        bytes32 payNoteId,
        string calldata newReference
    ) external payNoteExistsModifier(payNoteId) {
        PayNote storage payNote = payNotes[payNoteId];
        
        require(msg.sender == payNote.sender, "Only sender can update reference");
        require(!payNote.isFulfilled, "Cannot update fulfilled PayNote");
        require(bytes(newReference).length > 0, "Reference cannot be empty");
        require(bytes(newReference).length <= 256, "Reference too long");
        
        string memory oldReference = payNote.reference;
        payNote.reference = newReference;
        
        emit PayNoteReferenceUpdated(payNoteId, oldReference, newReference);
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
    function withdrawFees() external onlyOwner {
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
