"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnectButton() {
  return <ConnectButton showBalance={false} chainStatus="icon" />;
}
