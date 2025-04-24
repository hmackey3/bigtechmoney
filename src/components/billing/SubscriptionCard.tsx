import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionPlanInfo } from "./subscription/SubscriptionPlanInfo";
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog";

interface SubscriptionCardProps {
  subscription: any;
  setIsLoading: (isLoading: boolean) => void;
  formatDate: (timestamp: number) => string;
  refreshData?: () => void;
}

export function SubscriptionCard({ subscription, setIsLoading, formatDate, refreshData }: SubscriptionCardProps) {
  const navigate = useNavigate();
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  useEffect(() => {
    if (refreshData && lastUpdate !== null) {
      const timer = setTimeout(() => {
        refreshData();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [lastUpdate, refreshData]);

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
              onSubscriptionUpdated={() => setLastUpdate(Date.now())}
            />
            
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
                  onSubscriptionUpdated={() => setLastUpdate(Date.now())}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <p className="text-muted-foreground">You don't have an active subscription yet.</p>
            <Button onClick={() => navigate("/plan")}>
              View Plans
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
