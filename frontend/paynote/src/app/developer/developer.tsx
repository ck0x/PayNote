"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ContractBinding } from "@/types/interfaces/ContractBinding";
import type { Network } from "@/types/interfaces/Network";

/**
 * Developer / Contracts Page
 * Show registry addresses per chain, ABI, and example code
 * Entities: ContractBinding, Network
 */
export default function DeveloperPage() {
  const [selectedChain, setSelectedChain] = useState<number | null>(null);

  // TODO: Fetch from API
  const networks: Network[] = [];
  const contractBindings: ContractBinding[] = [];

  const selectedBinding = selectedChain
    ? contractBindings.find((b) => b.chainId === selectedChain)
    : null;

  const exampleCode = `// PayNote Registry Contract Integration
import { ethers } from 'ethers';

// Contract address and ABI
const REGISTRY_ADDRESS = "${selectedBinding?.address || "0x..."}";
const REGISTRY_ABI = [
  "function sendPaymentWithReference(address recipient, string memory reference) public payable",
  "function getPayNote(bytes32 payNoteId) public view returns (tuple)",
  "event PaymentSent(bytes32 indexed payNoteId, address indexed sender, address indexed recipient, uint256 amount, string reference)"
];

// Connect to contract
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const signer = await provider.getSigner();
const contract = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signer);

// Send payment with reference
const tx = await contract.sendPaymentWithReference(
  "0xRecipientAddress",
  "Invoice #12345",
  { value: ethers.parseEther("0.1") }
);

await tx.wait();
console.log("Payment sent:", tx.hash);`;

  const solidityABI = `// PayNoteRegistry Interface
interface IPayNoteRegistry {
    struct PayNote {
        bytes32 payNoteId;
        address sender;
        address recipient;
        uint256 amount;
        string payReference;
        uint256 timestamp;
        uint8 status;
    }

    function sendPaymentWithReference(
        address recipient,
        string memory reference
    ) external payable returns (bytes32 payNoteId);

    function getPayNote(bytes32 payNoteId)
        external
        view
        returns (PayNote memory);

    event PaymentSent(
        bytes32 indexed payNoteId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string reference,
        uint256 timestamp
    );
}`;

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Developer Resources</h1>
        <p className="text-muted-foreground mt-1">
          Smart contract addresses, ABIs, and integration examples
        </p>
      </div>

      {/* Network Selector */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {networks.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full text-center py-8">
              No networks configured. Please add contract bindings in settings.
            </p>
          ) : (
            networks.map((network) => {
              const binding = contractBindings.find(
                (b) => b.chainId === network.chainId
              );
              return (
                <button
                  key={network.chainId}
                  onClick={() => setSelectedChain(network.chainId)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedChain === network.chainId
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted"
                  }`}
                >
                  <p className="font-semibold">{network.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Chain ID: {network.chainId}
                  </p>
                  {binding && (
                    <p className="text-xs text-green-600 mt-1">✓ Configured</p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </Card>

      {/* Contract Details */}
      {selectedBinding && (
        <>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contract Address</h2>
            <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
              <code className="font-mono text-sm">{selectedBinding.address}</code>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigator.clipboard.writeText(selectedBinding.address)
                }
              >
                Copy
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded text-sm ${
                  selectedBinding.verified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {selectedBinding.verified ? "Verified" : "Unverified"}
              </span>
              <Button variant="outline" size="sm">
                View on Explorer
              </Button>
            </div>
          </Card>

          {/* ABI */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contract ABI</h2>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{solidityABI}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => navigator.clipboard.writeText(solidityABI)}
              >
                Copy
              </Button>
            </div>
          </Card>

          {/* Example Code */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Integration Example (TypeScript)
            </h2>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{exampleCode}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => navigator.clipboard.writeText(exampleCode)}
              >
                Copy
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* Quick Links */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Documentation & Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button variant="outline" className="justify-start">
            📘 API Documentation
          </Button>
          <Button variant="outline" className="justify-start">
            🔧 SDK & Libraries
          </Button>
          <Button variant="outline" className="justify-start">
            📝 Smart Contract Source
          </Button>
          <Button variant="outline" className="justify-start">
            💬 Developer Discord
          </Button>
        </div>
      </Card>

      {/* Network Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Supported Networks</h2>
        <div className="space-y-3">
          {networks.map((network) => (
            <div
              key={network.chainId}
              className="flex items-center justify-between border-b pb-3"
            >
              <div>
                <p className="font-semibold">{network.name}</p>
                <p className="text-sm text-muted-foreground">
                  Native: {network.nativeSymbol}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Chain ID: {network.chainId}
                </p>
                <a
                  href={network.explorerBaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Explorer →
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
