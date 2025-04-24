
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionPlanInfo } from "./SubscriptionPlanInfo";
import { SubscriptionActions } from "./SubscriptionActions";
import { EmptySubscription } from "./EmptySubscription";
import { useSubscriptionRefresh } from "./use-subscription-refresh";

interface SubscriptionCardProps {
  subscription: any;
  setIsLoading: (isLoading: boolean) => void;
  formatDate: (timestamp: number) => string;
  refreshData?: () => void;
}

export function SubscriptionCard({ 
  subscription, 
  setIsLoading, 
  formatDate, 
  refreshData 
}: SubscriptionCardProps) {
  const { triggerRefresh } = useSubscriptionRefresh({ refreshData });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
        <CardDescription>Your current subscription plan and status</CardDescription>
      </CardHeader>
      <CardContent>
        {subscription ? (
          <div className="space-y-4">
            <SubscriptionPlanInfo 
              subscription={subscription} 
              formatDate={formatDate}
              onSubscriptionUpdated={triggerRefresh}
            />
            
            <SubscriptionActions 
              subscription={subscription}
              onSubscriptionUpdated={triggerRefresh}
              setIsLoading={setIsLoading}
            />
          </div>
        ) : (
          <EmptySubscription />
        )}
      </CardContent>
    </Card>
  );
}
