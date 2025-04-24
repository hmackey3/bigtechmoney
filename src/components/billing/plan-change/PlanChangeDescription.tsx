
import { getDiscountPercentage, calculateYearlySavings } from "@/config/pricing-config";

interface PlanChangeDescriptionProps {
  isUpgrade: boolean;
  isFrequencyChange: boolean;
  planName: string;
  frequency: string;
  currentPlanName?: string;
  currentPlanFrequency?: string;
  price: number | string;
}

export function PlanChangeDescription({
  isUpgrade,
  isFrequencyChange,
  planName,
  frequency,
  currentPlanName,
  currentPlanFrequency,
  price
}: PlanChangeDescriptionProps) {
  // Get discount percentage for yearly plans
  const discountPercentage = frequency === 'yearly' ? getDiscountPercentage() : null;
  
  // Calculate yearly savings when applicable
  const calculateSavings = () => {
    if (frequency === 'yearly' && typeof price === 'number') {
      // Use the non-discounted monthly price to calculate savings
      const monthlyPriceEquivalent = price / (12 * (1 - 0.25)); // reverse-calculate original monthly price
      return calculateYearlySavings(monthlyPriceEquivalent);
    }
    return null;
  };
  
  const savingsAmount = calculateSavings();

  return (
    <>
      {isUpgrade ? (
        <>
          You are upgrading from {currentPlanName || "your current plan"} to the {planName} plan.
          {typeof price === 'number' && (
            <span className="block mt-2">
              Your new {frequency} price will be ${price}{frequency === 'monthly' ? '/month' : '/year'}.
            </span>
          )}
          {frequency === 'yearly' && discountPercentage && (
            <span className="block mt-1 text-green-600">
              You'll save {discountPercentage} with annual billing!
              {savingsAmount && ` That's $${Math.round(savingsAmount)} per year.`}
            </span>
          )}
          <span className="block mt-2">
            Your upgrade will be effective immediately, with prorated billing for the remainder of your current billing period.
          </span>
        </>
      ) : isFrequencyChange ? (
        <>
          You are changing from {currentPlanFrequency} to {frequency} billing for your {currentPlanName} plan.
          {typeof price === 'number' && (
            <span className="block mt-2">
              Your new {frequency} price will be ${price}{frequency === 'monthly' ? '/month' : '/year'}.
            </span>
          )}
          {frequency === 'yearly' && discountPercentage && (
            <span className="block mt-1 text-green-600">
              You'll save {discountPercentage} with annual billing!
              {savingsAmount && ` That's $${Math.round(savingsAmount)} per year.`}
            </span>
          )}
          <span className="block mt-2">
            Your billing cycle change will be effective immediately, with prorated billing adjustment.
          </span>
        </>
      ) : (
        <>
          You are changing from {currentPlanName || "your current plan"} to the {planName} plan.
          {typeof price === 'number' && (
            <span className="block mt-2">
              Your new {frequency} price will be ${price}{frequency === 'monthly' ? '/month' : '/year'}.
            </span>
          )}
          {frequency === 'yearly' && discountPercentage && (
            <span className="block mt-1 text-green-600">
              You'll save {discountPercentage} with annual billing!
              {savingsAmount && ` That's $${Math.round(savingsAmount)} per year.`}
            </span>
          )}
          <span className="block mt-2">
            Your downgrade will take effect at the end of your current billing period.
          </span>
        </>
      )}
    </>
  );
}
