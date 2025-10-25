"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/navigation/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Sidebar>{children}</Sidebar>
    </ProtectedRoute>
  );
}
