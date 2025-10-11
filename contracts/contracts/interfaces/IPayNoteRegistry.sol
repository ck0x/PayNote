// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IPayNoteRegistry
 * @dev Interface for PayNote Registry - a standard for attaching references to blockchain transactions
 * @notice This interface defines the core functionality for sending payments with on-chain references
 * Similar to ENS, this is designed to become a standard protocol for transaction references
 */
interface IPayNoteRegistry {
    /**
     * @dev Emitted when a payment with reference is sent
     * @param payNoteId Unique identifier for the PayNote
     * @param sender Address that sent the payment
     * @param recipient Address that received the payment
     * @param amount Amount sent
     * @param payReference Human-readable reference for the payment
     * @param timestamp When the payment was sent
     */
    event PaymentSent(
        bytes32 indexed payNoteId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string payReference,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a PayNote reference is updated
     * @param payNoteId Unique identifier for the PayNote
     * @param oldReference Previous reference
     * @param newReference Updated reference
     */
    event PayNoteReferenceUpdated(
        bytes32 indexed payNoteId,
        string oldReference,
        string newReference
    );

    /**
     * @dev Structure representing a PayNote
     */
    struct PayNote {
        address sender;
        address recipient;
        uint256 amount;
        string payReference;
        uint256 timestamp;
        bytes32 txHash;
    }

    /**
     * @dev Sends a payment with an attached reference
     * @param recipient Address that will receive the payment
     * @param payReference Human-readable reference for the payment (e.g., "Invoice #12345", "Rent - January 2025")
     * @return payNoteId Unique identifier for the created PayNote
     * @notice msg.value is the amount to send. Payment is forwarded immediately to recipient.
     */
    function sendPaymentWithReference(
        address recipient,
        string calldata payReference
    ) external payable returns (bytes32 payNoteId);

    /**
     * @dev Resolves a PayNote ID to get its full details
     * @param payNoteId Unique identifier for the PayNote
     * @return payNote The complete PayNote structure
     */
    function resolvePayNote(bytes32 payNoteId) external view returns (PayNote memory payNote);

    /**
     * @dev Gets the reference string for a PayNote
     * @param payNoteId Unique identifier for the PayNote
     * @return payReference The reference string associated with the PayNote
     */
    function getReference(bytes32 payNoteId) external view returns (string memory payReference);

    /**
     * @dev Gets all PayNotes sent by a specific address
     * @param sender Address to query
     * @return payNoteIds Array of PayNote IDs sent by the address
     */
    function getPayNotesBySender(address sender) external view returns (bytes32[] memory payNoteIds);

    /**
     * @dev Gets all PayNotes received by a specific address
     * @param recipient Address to query
     * @return payNoteIds Array of PayNote IDs received by the address
     */
    function getPayNotesByRecipient(address recipient) external view returns (bytes32[] memory payNoteIds);

    /**
     * @dev Checks if a PayNote exists
     * @param payNoteId Unique identifier for the PayNote
     * @return exists True if the PayNote exists
     */
    function payNoteExists(bytes32 payNoteId) external view returns (bool exists);
}
