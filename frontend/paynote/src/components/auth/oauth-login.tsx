"use client";

import { useLoginWithOAuth } from "@privy-io/react-auth";
import type { OAuthProviderType } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface OAuthButtonProps {
  provider: OAuthProviderType;
  label: string;
  icon: React.ReactNode;
}

function OAuthButton({ provider, label, icon }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { registerOrLogin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const { initOAuth } = useLoginWithOAuth({
    onComplete: async ({ user, isNewUser }) => {
      console.log(`User logged in successfully with ${provider}`, user);

      try {
        await registerOrLogin({
          privyUserId: user.id,
          email: user.email?.address,
          walletAddress: user.wallet?.address,
          authMethod: provider,
        });

        toast({
          title: isNewUser ? "Welcome!" : "Welcome back!",
          description: isNewUser
            ? "Your account has been created successfully."
            : "You've been logged in successfully.",
        });
        router.push("/");
      } catch (error) {
        console.error("Failed to sync user with backend:", error);
        toast({
          title: "Authentication Error",
          description: "Failed to complete authentication. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error(`Login with ${provider} failed:`, error);
      toast({
        title: "Login Failed",
        description: `Could not sign in with ${label}. Please try again.`,
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await initOAuth({ provider });
    } catch (err) {
      console.error(`Failed to initiate ${provider} OAuth:`, err);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      variant="outline"
      size="lg"
      className="h-14 w-14 p-0 rounded-xl hover:scale-105 transition-transform"
      title={label}
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      ) : (
        icon
      )}
    </Button>
  );
}

export function OAuthLogin() {
  return (
    <div className="flex justify-center gap-4">
      <OAuthButton
        provider="google"
        label="Continue with Google"
        icon={
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        }
      />

      <OAuthButton
        provider="twitter"
        label="Continue with Twitter"
        icon={
          <svg className="h-6 w-6 fill-[#1DA1F2]" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        }
      />

      <OAuthButton
        provider="github"
        label="Continue with GitHub"
        icon={
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        }
      />
    </div>
  );
}
