"use client";

import WalletConnectButton from "@/components/WalletConnectButton";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to PayNote</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your wallet to get started
          </p>
        </div>
        <div className="flex justify-center">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
}
