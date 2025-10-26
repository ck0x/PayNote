"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/navigation/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import HeroBlockAnimation from "@/components/animation/framer/background-effect";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Sidebar>{children}</Sidebar>
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <HeroBlockAnimation />
      </div>
    </ProtectedRoute>
  );
}
