
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";
import { CancellingBadge } from "./CancellingBadge";

interface PlanStatusDisplayProps {
  subscription: any;
  onSubscriptionUpdated: () => void;
}

export function PlanStatusDisplay({ subscription, onSubscriptionUpdated }: PlanStatusDisplayProps) {
  if (!subscription.status) return null;
  
  const isCancelling = subscription.cancel_at_period_end === true;
  const displayStatus = subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
  
  return (
    <div className="flex items-center gap-4">
      <SubscriptionStatusBadge status={subscription.status}>
        {displayStatus}
      </SubscriptionStatusBadge>
      
      {isCancelling && (
        <CancellingBadge 
          subscriptionId={subscription.id} 
          onReactivated={onSubscriptionUpdated}
        />
      )}
    </div>
  );
}
