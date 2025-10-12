"use client";

import Link from "next/link";
import { ReactNode } from "react";
// TODO - Replace with better navbar, just here for layout purposes
export default function Navbar({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r lg:block p-4">
        <div className="font-semibold mb-4">Paynote</div>
        <nav className="space-y-2 text-sm">
          <Link href="/" className="block hover:underline">
            Dashboard
          </Link>
          <Link href="/settings" className="block hover:underline">
            Settings
          </Link>
        </nav>
      </aside>
      {children}
    </div>
  );
}
