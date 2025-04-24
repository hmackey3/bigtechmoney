
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

export function useSubscription() {
  const [invoices, setInvoices] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchSubscriptionData = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setInvoices([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching subscription data for user:", user.id);
      
      // Fetch subscription data from our API
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke('get-subscription-data', {
        body: { }
      });
      
      if (stripeError) {
        console.error("Error fetching Stripe data:", stripeError);
        throw stripeError;
      }
      
      console.log("Stripe data received:", stripeData);
      
      // Set subscription and invoice data
      if (stripeData?.subscription) {
        // Add frequency information if available from database
        if (stripeData.customer?.subscription_frequency) {
          stripeData.subscription.subscription_frequency = stripeData.customer.subscription_frequency;
        }
        setSubscription(stripeData.subscription);
      } else {
        setSubscription(null);
      }
      
      if (stripeData?.invoices && stripeData.invoices.length > 0) {
        setInvoices(stripeData.invoices);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error in subscription data fetch:", error);
      // Don't show error toast for new users without subscriptions
      // Just set the error state for potential handling in UI
      setError(error instanceof Error ? error : new Error("Failed to load billing information"));
      setSubscription(null);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return {
    invoices,
    subscription,
    isLoading,
    error,
    setIsLoading,
    formatDate,
    fetchSubscriptionData
  };
}
