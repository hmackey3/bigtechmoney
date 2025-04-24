
import { ArrowUp, ArrowDown } from "lucide-react";

interface ScheduledPlanBannerProps {
  currentPlan: string;
  scheduledPlan: string;
  currentPeriodEnd: number | null;
  formatDate: (timestamp: number) => string;
}

export function ScheduledPlanBanner({ 
  currentPlan, 
  scheduledPlan, 
  currentPeriodEnd,
  formatDate 
}: ScheduledPlanBannerProps) {
  const isUpgrade = scheduledPlan > currentPlan;
  const scheduledPlanCapitalized = scheduledPlan.charAt(0).toUpperCase() + scheduledPlan.slice(1);
  
  return (
    <div className="rounded-md bg-blue-50 p-3 text-sm">
      <div className="flex items-center gap-2">
        {isUpgrade ? (
          <ArrowUp className="h-4 w-4 text-blue-600" />
        ) : (
          <ArrowDown className="h-4 w-4 text-blue-600" />
        )}
        <span className="font-medium text-blue-600">
          {scheduledPlanCapitalized} Plan
        </span>
      </div>
      <p className="mt-1 text-blue-600">
        Your subscription will {isUpgrade ? 'upgrade to' : 'downgrade to'} the {scheduledPlanCapitalized} Plan 
        {currentPeriodEnd ? ` on ${formatDate(currentPeriodEnd)}` : ''}
      </p>
    </div>
  );
}
