"use client";

import { useAuth } from "@/context/auth-context";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component
 * Redirects to login if user is not authenticated
 * Shows loading state while checking authentication
 */
export function ProtectedRoute({ 
  children, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) {
  const { authenticated, ready } = usePrivy();
  const { account, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for Privy and auth context to be ready
    if (!ready || isLoading) return;

    // If not authenticated by Privy, redirect to login
    if (!authenticated) {
      router.push(redirectTo);
      return;
    }

    // If authenticated by Privy but no account in our system, wait for registration
    // (handled by WalletConnectButton or OAuthLogin components)
  }, [authenticated, account, ready, isLoading, router, redirectTo]);

  // Show loading state
  if (!ready || isLoading || !authenticated || !account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
