
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuditActionType, logAuditEvent } from "@/utils/auditLogger";

export function usePlanChange() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlanChange = async (
    planId: string,
    frequency: string,
    setOpen: (open: boolean) => void
  ) => {
    try {
      setIsLoading(true);

      // Get the current origin for proper redirect URLs
      const origin = window.location.origin;
      const returnUrl = origin + '/billing';

      console.log(`Changing to plan: ${planId}, frequency: ${frequency}`);

      const { data, error } = await supabase.functions.invoke('change-subscription-plan', {
        body: {
          priceId: planId,
          frequency: frequency,
          returnUrl: returnUrl
        }
      });

      if (error) {
        console.error("Error changing plan:", error);
        throw new Error(error.message || "Error changing subscription plan");
      }

      if (!data) {
        console.error("No data returned from change-subscription-plan function");
        throw new Error("No response from billing service");
      }

      console.log("Plan change response:", data);
      logAuditEvent({
        actionType: AuditActionType.PLAN_UPGRADE,
        description: `Changed subscription plan to ${planId} (${frequency})`,
        metadata: { planId, frequency }
      })

      setOpen(false);

      // If we got a URL, it means we need to redirect to Stripe Checkout
      if (data?.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
        window.location.href = data.url;
        return;
      }

      // Otherwise, we've updated the subscription in-place
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        navigate('/billing');
        toast.success("Your subscription has been updated!");
      }
    } catch (error: any) {
      console.error("Error changing plan:", error);
      toast.error(error.message || "Failed to change subscription plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handlePlanChange };
}
