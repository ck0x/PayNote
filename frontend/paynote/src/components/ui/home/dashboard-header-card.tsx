import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardHeaderCardProps {
  title: string;
  description: string;
  eyebrow?: string;
  className?: string;
}

export function DashboardHeaderCard({
  title,
  description,
  eyebrow,
  className,
}: DashboardHeaderCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      {eyebrow ? (
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </Card>
  );
}
