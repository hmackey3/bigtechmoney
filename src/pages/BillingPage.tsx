
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SubscriptionCard } from "@/components/billing/SubscriptionCard";
import { InvoicesTable } from "@/components/billing/InvoicesTable";
import { BillingHeader } from "@/components/billing/BillingHeader";
import { useSubscription } from "@/hooks/billing/useSubscription";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function BillingPage() {
  const { invoices, subscription, isLoading, setIsLoading, formatDate, fetchSubscriptionData } = useSubscription();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for different URL parameters to show appropriate messages
    const sessionId = searchParams.get('session_id');
    const setupIntent = searchParams.get('setup_intent');
    const planUpdated = searchParams.get('plan_updated');
    const planCreated = searchParams.get('plan_created');
    const planUpgraded = searchParams.get('plan_upgraded');
    const planDowngradeScheduled = searchParams.get('plan_downgrade_scheduled');
    const canceled = searchParams.get('canceled');
    
    // Clear the URL parameters
    if (sessionId || setupIntent || planUpdated || planCreated || planUpgraded || planDowngradeScheduled || canceled) {
      navigate('/billing', { replace: true });
      
      // Refresh the subscription data
      fetchSubscriptionData();
    }
    
    // Show appropriate success messages
    if (sessionId) {
      toast.success("Payment successful! Your subscription is now active.");
    } else if (setupIntent) {
      toast.success("Payment method updated successfully!");
    } else if (planUpgraded) {
      toast.success("Your subscription has been upgraded successfully! The new features are available immediately.");
    } else if (planDowngradeScheduled) {
      toast.success("Your plan will be downgraded at the end of your current billing period.");
    } else if (planUpdated) {
      toast.success("Your subscription plan has been updated successfully!");
    } else if (planCreated) {
      toast.success("Your subscription has been created successfully!");
    } else if (canceled) {
      toast.info("Your plan selection was canceled.");
    }
  }, [searchParams, navigate, fetchSubscriptionData]);

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        title="Billing"
        description="Manage your subscription and view invoice history"
      />
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <SubscriptionCard 
            subscription={subscription} 
            setIsLoading={setIsLoading} 
            formatDate={formatDate}
            refreshData={fetchSubscriptionData}
          />
      
          {invoices && invoices.length > 0 ? (
            <>
              <BillingHeader invoicesCount={invoices.length} />
              <InvoicesTable invoices={invoices} formatDate={formatDate} />
            </>
          ) : (
            <div className="text-center py-6 mt-4 bg-gray-50 rounded-lg">
              <p className="text-muted-foreground">No billing history available.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
