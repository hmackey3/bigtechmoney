
import { PlanHeader } from "./plan-info/PlanHeader";
import { PlanStatusDisplay } from "./plan-status/PlanStatusDisplay";
import { ScheduledPlanBanner } from "./plan-info/ScheduledPlanBanner";
import { PlanMetadata } from "./plan-info/PlanMetadata";

interface SubscriptionPlanInfoProps {
  subscription: any;
  formatDate: (timestamp: number) => string;
  onSubscriptionUpdated: () => void;
}

export function SubscriptionPlanInfo({ 
  subscription, 
  formatDate,
  onSubscriptionUpdated 
}: SubscriptionPlanInfoProps) {
  if (!subscription) return null;

  const planName = subscription.plan || 'Unknown';
  const frequency = subscription.subscription_frequency || 'monthly';
  const scheduledPlan = subscription.scheduled_plan;
  
  return (
    <div className="space-y-4">
      <PlanHeader planName={planName} frequency={frequency} />
      
      <PlanStatusDisplay 
        subscription={subscription} 
        onSubscriptionUpdated={onSubscriptionUpdated} 
      />
      
      {scheduledPlan && (
        <ScheduledPlanBanner
          currentPlan={planName}
          scheduledPlan={scheduledPlan}
          currentPeriodEnd={subscription.current_period_end}
          formatDate={formatDate}
        />
      )}
      
      <PlanMetadata
        currentPeriodEnd={subscription.current_period_end}
        frequency={frequency}
        formatDate={formatDate}
      />
    </div>
  );
}
