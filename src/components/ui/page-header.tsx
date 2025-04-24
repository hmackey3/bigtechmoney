
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 mb-6", className)}>
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
