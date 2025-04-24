
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CancelSubscriptionDialog } from "../CancelSubscriptionDialog";

interface SubscriptionActionsProps {
  subscription: any;
  onSubscriptionUpdated: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function SubscriptionActions({ 
  subscription, 
  onSubscriptionUpdated,
  setIsLoading 
}: SubscriptionActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <Button 
        variant="outline" 
        onClick={() => navigate("/plan")}
      >
        Change Plan
      </Button>
      
      {subscription.status === 'active' && subscription.id && (
        <CancelSubscriptionDialog
          subscriptionId={subscription.id}
          setIsLoading={setIsLoading}
          onSubscriptionUpdated={onSubscriptionUpdated}
        />
      )}
    </div>
  );
}
