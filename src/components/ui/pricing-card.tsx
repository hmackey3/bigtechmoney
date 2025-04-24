import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useSubscription } from "@/hooks/billing/useSubscription";

import {
  PricingTier,
  PricingCardProps,
} from "@/components/pricing/pricing-tier-types";
import { TierHeader } from "@/components/pricing/tier-header";
import { PriceDisplay } from "@/components/pricing/price-display";
import { PricingFeatures } from "@/components/pricing/pricing-features";
import { PlanButton } from "@/components/pricing/plan-button";
import {
  HighlightedBackground,
  PopularBackground,
} from "@/components/pricing/backgrounds";

export type { PricingTier, PricingCardProps };

export function PricingCard({ tier, paymentFrequency }: PricingCardProps) {
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;
  const { subscription } = useSubscription();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Show canceled message if present in URL
  React.useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      toast.info("Checkout canceled. Your subscription has not been changed.");
      // Remove the parameter from URL
      navigate("/plan", { replace: true });
    }
  }, [searchParams, navigate]);

  // Check if this is the current plan - more robust check to handle different data formats
  const isCurrentPlan = React.useMemo(() => {
    if (!subscription) return false;

    // Check plan property (most common)
    if (subscription.plan && tier.id) {
      return subscription.plan.toLowerCase() === tier.id.toLowerCase();
    }

    // Check subscription_plan property (fallback)
    if (subscription.subscription_plan && tier.id) {
      return (
        subscription.subscription_plan.toLowerCase() === tier.id.toLowerCase()
      );
    }

    // Check product ID match if using Stripe product IDs
    if (subscription.product?.id === tier.id) {
      return true;
    }

    // Check plan name match
    if (subscription.plan_name && tier.name) {
      return subscription.plan_name.toLowerCase() === tier.name.toLowerCase();
    }

    return false;
  }, [subscription, tier]);

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-8 overflow-hidden p-6",
        isHighlighted
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
        isPopular && "ring-2 ring-primary"
      )}
    >
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      <TierHeader
        name={tier.name}
        isPopular={isPopular}
        isCurrentPlan={isCurrentPlan}
      />

      <PriceDisplay price={price} paymentFrequency={paymentFrequency} />

      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium">{tier.description}</h3>
        <PricingFeatures
          features={tier.features}
          isHighlighted={isHighlighted}
        />
      </div>

      <div className="relative z-10">
        <PlanButton
          planId={tier.id}
          ctaText={isCurrentPlan ? "Current Plan" : tier.cta}
          isCurrentPlan={isCurrentPlan}
          paymentFrequency={paymentFrequency}
          isHighlighted={isHighlighted}
        />
      </div>
    </Card>
  );
}
