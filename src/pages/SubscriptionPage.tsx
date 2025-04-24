/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@/components/providers/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
// import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { loadStripe } from "@stripe/stripe-js";
import { PageHeader } from "@/components/ui/page-header";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function SubscriptionManager() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "list-payment-methods"
      );
      if (error) throw error;
      setPaymentMethods(data.payment_methods || []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            planId,
            origin: window.location.origin, // 👈 pass the origin here
          },
        }
      );

      if (error) throw error;

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) throw stripeError;
    } catch (error) {
      console.error("Error starting subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke("cancel-subscription");
      if (error) throw error;
      await fetchSubscriptionData();
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSubscription = async (newPlanId) => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke("update-subscription", {
        body: { newPlanId },
      });
      if (error) throw error;
      await fetchSubscriptionData();
    } catch (error) {
      console.error("Error upgrading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManagePaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke(
        "create-billing-portal-session"
      );
      if (error) throw error;
      window.location.href = data.url;
    } catch (error) {
      console.error("Error opening payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading subscription details...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Subscription Management"
        description="Overview of upcoming events and statistics"
      />
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Subscription Management</h2>

        {subscription ? (
          <div className="mb-8">
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium">Current Plan</h3>
              <p className="mt-2">
                <span className="font-semibold">{subscription.plan_name}</span>
                {subscription.status === "active" && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                )}
                {subscription.status === "canceled" && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Canceled
                  </span>
                )}
              </p>
              {subscription.current_period_end && (
                <p className="text-sm text-gray-600 mt-1">
                  {subscription.status === "active"
                    ? `Renews on ${new Date(
                        subscription.current_period_end
                      ).toLocaleDateString()}`
                    : `Expires on ${new Date(
                        subscription.current_period_end
                      ).toLocaleDateString()}`}
                </p>
              )}
              {subscription.discount_applied && (
                <p className="text-sm font-medium text-green-600 mt-1">
                  Discount Applied: ${subscription.discount_amount}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {subscription.status === "active" && (
                <>
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                  <button
                    onClick={() =>
                      handleUpgradeSubscription(
                        subscription.plan_id === "monthly"
                          ? "yearly"
                          : "monthly"
                      )
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    {subscription.plan_id === "monthly"
                      ? "Upgrade to Yearly"
                      : "Switch to Monthly"}
                  </button>
                </>
              )}
              <button
                onClick={handleManagePaymentMethods}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Manage Payment Methods
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <p className="mb-4">You don't have an active subscription.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold">Monthly Plan</h3>
                <p className="text-2xl font-bold mt-2">
                  $249<span className="text-sm text-gray-600">/month</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Reduces to $99/month after 4 months
                </p>
                <button
                  onClick={() => handleSubscribe("monthly")}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold">Yearly Plan</h3>
                <p className="text-2xl font-bold mt-2">
                  $1,249<span className="text-sm text-gray-600">/year</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Save $739 compared to monthly
                </p>
                <button
                  onClick={() => handleSubscribe("yearly")}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}

        {paymentMethods.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Payment Methods</h3>
            <div className="space-y-2">
              {paymentMethods.slice(0, 1).map((method) => (
                <div
                  key={method.id}
                  className="flex items-center border p-3 rounded"
                >
                  <div className="mr-2">
                    {method.card.brand === "visa" && "💳 Visa"}
                    {method.card.brand === "mastercard" && "💳 Mastercard"}
                    {method.card.brand === "amex" && "💳 Amex"}
                    {!["visa", "mastercard", "amex"].includes(
                      method.card.brand
                    ) && "💳 Card"}
                  </div>
                  <div>
                    •••• {method.card.last4} | Expires {method.card.exp_month}/
                    {method.card.exp_year}
                    {method.is_default && (
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
