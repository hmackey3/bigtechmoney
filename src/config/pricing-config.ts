
/**
 * Centralized pricing configuration
 * All pricing related values should be stored here
 */

// Monthly prices for each plan tier
export const MONTHLY_PRICES = {
  starter: 10,
  growth: 30,
  pro: 90,
  enterprise: "Custom"
};

// Yearly discount percentage (as a decimal)
export const YEARLY_DISCOUNT = 0.25; // 25% discount

// Automatically calculate yearly prices based on monthly prices and discount
export const YEARLY_PRICES = Object.entries(MONTHLY_PRICES).reduce((acc, [tier, price]) => {
  // Custom pricing remains as is
  if (typeof price === "string") {
    acc[tier] = price;
  } else {
    // Apply discount by multiplying monthly price by 12 and subtracting the discount
    acc[tier] = Math.round(price * 12 * (1 - YEARLY_DISCOUNT));
  }
  return acc;
}, {} as Record<string, number | string>);

// Helper function to get price for a specific plan and frequency
export function getPriceForPlan(planId: string, frequency: string): number | string {
  const planKey = planId.toLowerCase();
  if (frequency === 'yearly') {
    return YEARLY_PRICES[planKey] || "Custom";
  } else {
    return MONTHLY_PRICES[planKey] || "Custom";
  }
}

// Get formatted discount percentage
export function getDiscountPercentage(): string {
  return `${YEARLY_DISCOUNT * 100}%`;
}

// Calculate yearly savings compared to monthly billing
export function calculateYearlySavings(monthlyPrice: number): number {
  return monthlyPrice * 12 * YEARLY_DISCOUNT;
}

// Define tier hierarchy for comparison
export const TIER_ORDER = { 
  starter: 1, 
  growth: 2, 
  pro: 3, 
  enterprise: 4
};
