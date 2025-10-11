// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IPayNoteRegistry
 * @dev Interface for PayNote Registry - a standard for attaching references to blockchain transactions
 * @notice This interface defines the core functionality that any PayNote Registry implementation must provide
 * Similar to ENS, this is designed to become a standard protocol for transaction references
 */
interface IPayNoteRegistry {
    /**
     * @dev Emitted when a new PayNote is created
     * @param payNoteId Unique identifier for the PayNote
     * @param sender Address that created the PayNote
     * @param recipient Address that will receive the payment
     * @param amount Amount associated with the PayNote
     * @param payReference Human-readable reference for the payment
     * @param timestamp When the PayNote was created
     */
    event PayNoteCreated(
        bytes32 indexed payNoteId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string payReference,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a PayNote is fulfilled (payment sent)
     * @param payNoteId Unique identifier for the PayNote
     * @param txHash Transaction hash of the payment
     * @param timestamp When the PayNote was fulfilled
     */
    event PayNoteFulfilled(
        bytes32 indexed payNoteId,
        bytes32 txHash,
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
        uint256 createdAt;
        uint256 fulfilledAt;
        bytes32 txHash;
        bool isFulfilled;
    }

    /**
     * @dev Creates a new PayNote with a reference
     * @param recipient Address that will receive the payment
     * @param amount Amount to be paid
     * @param payReference Human-readable reference for the payment (e.g., "Invoice #12345", "Rent - January 2025")
     * @return payNoteId Unique identifier for the created PayNote
     */
    function createPayNote(
        address recipient,
        uint256 amount,
        string calldata payReference
    ) external payable returns (bytes32 payNoteId);

    /**
     * @dev Marks a PayNote as fulfilled with transaction details
     * @param payNoteId Unique identifier for the PayNote
     * @param txHash Transaction hash of the payment
     */
    function fulfillPayNote(bytes32 payNoteId, bytes32 txHash) external;

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
     * @dev Gets all PayNotes created by a specific sender
     * @param sender Address to query
     * @return payNoteIds Array of PayNote IDs created by the sender
     */
    function getPayNotesBySender(address sender) external view returns (bytes32[] memory payNoteIds);

    /**
     * @dev Gets all PayNotes for a specific recipient
     * @param recipient Address to query
     * @return payNoteIds Array of PayNote IDs for the recipient
     */
    function getPayNotesByRecipient(address recipient) external view returns (bytes32[] memory payNoteIds);

    /**
     * @dev Checks if a PayNote exists
     * @param payNoteId Unique identifier for the PayNote
     * @return exists True if the PayNote exists
     */
    function payNoteExists(bytes32 payNoteId) external view returns (bool exists);
}
