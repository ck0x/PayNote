import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardHeaderCardProps {
  title: string;
  description: string;
  className?: string;
}

export function DashboardHeaderCard({
  title,
  description,
  className,
}: DashboardHeaderCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </Card>
  );
}
