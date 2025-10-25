import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DashboardKpiCardProps {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  className?: string;
}

export function DashboardKpiCard({
  label,
  value,
  helper,
  className,
}: DashboardKpiCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <h3 className="text-sm font-medium text-primary">{label}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {helper ? (
        <p className="text-sm text-muted-foreground mt-1">{helper}</p>
      ) : null}
    </Card>
  );
}
