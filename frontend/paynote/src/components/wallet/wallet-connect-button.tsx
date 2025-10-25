"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { useEffect } from "react";

export function WalletConnectButton() {
  const { ready, authenticated, login, user } = usePrivy();
  const { registerOrLogin, logout: authLogout, account, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (authenticated && user && !account && !isLoading) {
      // User authenticated via Privy but not registered in our system
      const walletAddress = user.wallet?.address;
      const email = user.email?.address;

      registerOrLogin({
        privyUserId: user.id,
        email,
        walletAddress,
        authMethod: walletAddress ? "wallet" : "email",
      })
        .then(() => {
          toast({
            title: "Welcome!",
            description: "You've been signed in successfully.",
          });
          router.push("/");
        })
        .catch((error) => {
          console.error("Failed to register/login:", error);
          toast({
            title: "Authentication Error",
            description: "Failed to complete sign in. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [authenticated, user, account, isLoading, registerOrLogin, router, toast]);

  const handleLogout = async () => {
    await authLogout();
    toast({
      title: "Signed Out",
      description: "You've been logged out successfully.",
    });
  };

  if (!ready || isLoading) {
    return (
      <Button
        disabled
        variant="outline"
        className="border-dashed border-border/70 bg-muted/40 text-muted-foreground"
      >
        Preparing wallet...
      </Button>
    );
  }

  const walletAddress = user?.wallet?.address;
  const walletLabel = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;
  const displayLabel = account?.email || walletLabel || "Unknown user";

  if (authenticated && account) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-muted/40 px-3 py-2 shadow-inset">
        <span className="font-mono text-xs text-muted-foreground">
          {displayLabel}
        </span>
        <Button onClick={handleLogout} variant="secondary" size="sm">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={login} variant="default" size="lg" className="shadow-card">
      Sign In
    </Button>
  );
}
