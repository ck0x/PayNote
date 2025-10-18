"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

export function WalletConnectButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) {
    return (
      <Button disabled variant="outline">
        Loading...
      </Button>
    );
  }

  if (authenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {user?.email?.address || user?.wallet?.address?.slice(0, 6) + "..." + user?.wallet?.address?.slice(-4)}
        </span>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={login} variant="default" className="background- font-medium size-xl px-6 py-3 rounded-lg">
      Sign In
    </Button>
  );
}
