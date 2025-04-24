
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";

export interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchPaymentMethods = useCallback(async () => {
    if (!user) {
      setPaymentMethods([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching payment methods for user:", user.id);
      const { data, error } = await supabase.functions.invoke('get-payment-methods', {
        body: {}
      });

      if (error) {
        console.error("Supabase functions error:", error);
        // For new users, don't throw - just set empty state
        if (error.message && error.message.includes("Customer not found")) {
          setPaymentMethods([]);
          setDefaultPaymentMethodId(null);
          return;
        }
        throw error;
      }

      console.log("Payment methods response:", data);
      
      if (data) {
        setPaymentMethods(data.paymentMethods || []);
        setDefaultPaymentMethodId(data.defaultPaymentMethod);
      } else {
        setPaymentMethods([]);
        setDefaultPaymentMethodId(null);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      // Don't show toast errors for new users
      setError(error instanceof Error ? error : new Error("Failed to load payment information"));
      setPaymentMethods([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  return {
    paymentMethods,
    defaultPaymentMethodId,
    isLoading,
    error,
    fetchPaymentMethods
  };
}
