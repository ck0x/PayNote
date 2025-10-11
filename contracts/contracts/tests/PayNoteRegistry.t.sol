// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PayNoteRegistry} from "../PayNoteRegistry.sol";
import {IPayNoteRegistry} from "../interfaces/IPayNoteRegistry.sol";
import {Test} from "forge-std/Test.sol";

/**
 * @title PayNoteRegistryTest
 * @dev Simple unit tests for PayNoteRegistry contract
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
    }
    
    function test_CreatePayNote() public {
        vm.startPrank(sender);
        
        uint256 amount = 1 ether;
        string memory payRef = "Invoice #12345";
        
        bytes32 payNoteId = registry.createPayNote(recipient, amount, payRef);
        
        require(payNoteId != bytes32(0), "PayNote ID should not be zero");
        require(registry.getTotalPayNotes() == 1, "Total PayNotes should be 1");
        
        vm.stopPrank();
    }
    
    function test_ResolvePayNote() public {
        vm.prank(sender);
        
        uint256 amount = 2.5 ether;
        string memory payRef = "Rent - January 2025";
        
        bytes32 payNoteId = registry.createPayNote(recipient, amount, payRef);
        
        IPayNoteRegistry.PayNote memory payNote = registry.resolvePayNote(payNoteId);
        
        require(payNote.sender == sender, "Sender should match");
        require(payNote.recipient == recipient, "Recipient should match");
        require(payNote.amount == amount, "Amount should match");
        require(keccak256(bytes(payNote.payReference)) == keccak256(bytes(payRef)), "Reference should match");
        require(!payNote.isFulfilled, "Should not be fulfilled initially");
    }
    
    function test_FulfillPayNote() public {
        vm.prank(sender);
        bytes32 payNoteId = registry.createPayNote(recipient, 1 ether, "Test Payment");
        
        bytes32 txHash = keccak256("transaction_hash");
        
        vm.prank(sender);
        registry.fulfillPayNote(payNoteId, txHash);
        
        IPayNoteRegistry.PayNote memory payNote = registry.resolvePayNote(payNoteId);
        require(payNote.isFulfilled, "PayNote should be fulfilled");
        require(payNote.txHash == txHash, "Transaction hash should match");
    }
}
