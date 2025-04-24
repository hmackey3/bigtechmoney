
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  description,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start">
          {icon && (
            <div className="mr-4 p-2 rounded-full bg-blue-50 text-blue-500">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="flex items-baseline mt-1">
              <p className="text-2xl font-bold">{value}</p>
              {description && (
                <p className="ml-2 text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
