"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { Network } from "@/types/interfaces/Network";
import type { ContractBinding } from "@/types/interfaces/ContractBinding";

/**
 * Create Payment (Send) Page
 * Guided flow to call `sendPaymentWithReference` via connected wallet
 * Entities: Wallet, Network, ContractBinding
 */
export default function SendPaymentPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    reference: "",
    chainId: "",
  });

  // TODO: Fetch from API/wallet
  const connectedWallet: Wallet | undefined = undefined;
  const networks: Network[] = [];
  const contractBindings: ContractBinding[] = [];

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Send Payment</h1>
        <p className="text-muted-foreground mt-1">
          Send a payment with reference on-chain
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s === step
                    ? "bg-primary text-primary-foreground"
                    : s < step
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 4 && (
                <div
                  className={`h-1 w-16 mx-2 ${
                    s < step ? "bg-green-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Network */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Network</h2>
            <p className="text-sm text-muted-foreground">
              Choose the blockchain network for this transaction
            </p>
            <div className="grid gap-3">
              {networks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No networks available. Please configure contract bindings.
                </p>
              ) : (
                networks.map((network) => (
                  <button
                    key={network.chainId}
                    onClick={() => {
                      setFormData({ ...formData, chainId: String(network.chainId) });
                      handleNext();
                    }}
                    className="p-4 border rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <p className="font-semibold">{network.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Chain ID: {network.chainId} • {network.nativeSymbol}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Enter Recipient */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recipient Address</h2>
            <p className="text-sm text-muted-foreground">
              Enter the recipient's wallet address or ENS name
            </p>
            <Input
              placeholder="0x... or example.eth"
              value={formData.recipient}
              onChange={(e) =>
                setFormData({ ...formData, recipient: e.target.value })
              }
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.recipient}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Amount & Reference */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <div>
              <label className="text-sm font-medium">Amount (wei)</label>
              <Input
                type="number"
                placeholder="1000000000000000000"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Payment Reference</label>
              <Input
                placeholder="Invoice #12345 or description"
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This reference will be stored on-chain with your payment
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.amount || !formData.reference}
                className="flex-1"
              >
                Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Send */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Review Payment</h2>
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">
                  {networks.find((n) => String(n.chainId) === formData.chainId)
                    ?.name || formData.chainId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To</span>
                <span className="font-mono text-sm">{formData.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">{formData.amount} wei</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span>{formData.reference}</span>
              </div>
            </div>

            {!connectedWallet && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Please connect your wallet to send this payment
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={() => {
                  // TODO: Call sendPaymentWithReference contract method
                  alert("Payment submission - integrate with smart contract");
                }}
                disabled={!connectedWallet}
                className="flex-1"
              >
                Send Payment
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Wallet Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Connected Wallet</p>
            <p className="font-mono text-sm mt-1">
              {connectedWallet?.address || "Not connected"}
            </p>
          </div>
          <Button variant="outline" size="sm">
            {connectedWallet ? "Disconnect" : "Connect Wallet"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
