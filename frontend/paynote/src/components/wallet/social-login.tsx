"use client";
import { createAppKit } from "@reown/appkit";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";

export function SocialLoginCTA() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  if (isConnected) {
    return <appkit-account-button />;
  }

  return (
    <button
      onClick={() => open()}
      className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Connect Wallet
    </button>
  );
}
