// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PayNoteRegistry} from "../PayNoteRegistry.sol";
import {IPayNoteRegistry} from "../interfaces/IPayNoteRegistry.sol";
import {Test} from "forge-std/Test.sol";

/**
 * @title PayNoteRegistryTest
 * @dev Simple unit tests for refactored PayNoteRegistry contract
 */
contract PayNoteRegistryTest is Test {
    PayNoteRegistry public registry;
    
    address public owner;
    address public sender;
    address public recipient;
    
    function setUp() public {
        // Set up test accounts
        owner = address(this);
        sender = makeAddr("sender");
        recipient = makeAddr("recipient");
        
        // Deploy the registry
        registry = new PayNoteRegistry(owner);
        
        // Fund test accounts
        vm.deal(sender, 100 ether);
        vm.deal(recipient, 100 ether);
    }
    
    function test_InitialState() public view {
        require(registry.owner() == owner, "Owner should be set correctly");
        require(registry.registrationFee() == 0, "Registration fee should be 0");
        require(registry.getTotalPayNotes() == 0, "Total PayNotes should be 0");
        require(keccak256(bytes(registry.VERSION())) == keccak256(bytes("2.0.0")), "Version should be 2.0.0");
    }
    
    function test_SendPaymentWithReference() public {
        vm.startPrank(sender);
        
        uint256 amount = 1 ether;
        string memory payRef = "Invoice #12345";
        
        uint256 recipientBalanceBefore = recipient.balance;
        
        bytes32 payNoteId = registry.sendPaymentWithReference{value: amount}(
            recipient,
            payRef
        );
        
        require(payNoteId != bytes32(0), "PayNote ID should not be zero");
        require(registry.getTotalPayNotes() == 1, "Total PayNotes should be 1");
        require(recipient.balance == recipientBalanceBefore + amount, "Recipient should receive payment");
        
        vm.stopPrank();
    }
    
    function test_ResolvePayNote() public {
        vm.prank(sender);
        
        uint256 amount = 2.5 ether;
        string memory payRef = "Rent - January 2025";
        
        bytes32 payNoteId = registry.sendPaymentWithReference{value: amount}(
            recipient,
            payRef
        );
        
        IPayNoteRegistry.PayNote memory payNote = registry.resolvePayNote(payNoteId);
        
        require(payNote.sender == sender, "Sender should match");
        require(payNote.recipient == recipient, "Recipient should match");
        require(payNote.amount == amount, "Amount should match");
        require(keccak256(bytes(payNote.payReference)) == keccak256(bytes(payRef)), "Reference should match");
        require(payNote.timestamp > 0, "Timestamp should be set");
    }
    
    function test_GetPayNotesBySender() public {
        vm.startPrank(sender);
        
        registry.sendPaymentWithReference{value: 1 ether}(recipient, "Payment 1");
        registry.sendPaymentWithReference{value: 2 ether}(recipient, "Payment 2");
        
        bytes32[] memory payNotes = registry.getPayNotesBySender(sender);
        require(payNotes.length == 2, "Sender should have 2 PayNotes");
        
        vm.stopPrank();
    }
    
    function test_GetPayNotesByRecipient() public {
        vm.prank(sender);
        registry.sendPaymentWithReference{value: 1 ether}(recipient, "Payment 1");
        
        vm.prank(makeAddr("other"));
        vm.deal(makeAddr("other"), 10 ether);
        registry.sendPaymentWithReference{value: 2 ether}(recipient, "Payment 2");
        
        bytes32[] memory payNotes = registry.getPayNotesByRecipient(recipient);
        require(payNotes.length == 2, "Recipient should have 2 PayNotes");
    }
}
