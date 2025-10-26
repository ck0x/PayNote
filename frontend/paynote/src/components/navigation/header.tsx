"use client";

import { AccountInfo } from "@/components/auth/account-info";
import SidebarToggle from "@/components/navigation/sidebar-toggle";
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Header() {
  const { account, isLoading } = useAuth();
  const pathname = usePathname();
  const showAccountInfo = Boolean(account) && !isLoading;
  const isHomePage = pathname === "/";
  const showWelcomeMessage = showAccountInfo && isHomePage;
  const welcomeMessage = "Welcome back to PayNote";

  return (
    <section className="overflow-hidden bg-brand-gradient text-primary-foreground shadow-card">
      <div className="flex flex-col gap-2 px-6 pt-6 sm:px-8 sm:pt-8 sm:pb-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            {showWelcomeMessage && (
              <div className="flex items-center gap-3 ml-4">
                <div className="flex">
                  {welcomeMessage.split("").map((char, index) => (
                    <motion.span
                      key={`${index}-${char}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.03,
                        ease: "easeOut",
                      }}
                      className="text-base sm:text-4xl font-semibold text-black"
                      style={{ display: "inline-block" }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: welcomeMessage.length * 0.03 + 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Image
                    src="/feather-primary.svg"
                    alt="PayNote Feather"
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </motion.div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {showAccountInfo ? <AccountInfo /> : <WalletConnectButton />}
          </div>
        </div>
      </div>
    </section>
  );
}
