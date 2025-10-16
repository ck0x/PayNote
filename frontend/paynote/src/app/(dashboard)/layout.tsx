import { ReactNode } from "react";
import Sidebar from "@/components/navigation/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}
