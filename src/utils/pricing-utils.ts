
import { 
  getDiscountPercentage as getConfigDiscountPercentage,
  calculateYearlySavings as calculateConfigYearlySavings,
  TIER_ORDER
} from "@/config/pricing-config";

// Utility functions for pricing calculations

/**
 * Get the formatted discount percentage for a payment frequency
 * @param frequency The payment frequency (monthly, yearly, etc.)
 * @returns Formatted discount percentage or null if no discount applies
 */
export function getDiscountPercentage(frequency: string): string | null {
  if (frequency === 'yearly') {
    return getConfigDiscountPercentage(); // This could be configured dynamically in the future
  }
  return null;
}

/**
 * Calculate the amount saved with yearly billing compared to monthly
 * @param monthlyPrice The monthly price
 * @returns The amount saved annually
 */
export function calculateYearlySavings(monthlyPrice: number): number {
  return calculateConfigYearlySavings(monthlyPrice);
}

/**
 * Define tier hierarchy for comparison
 */
export const tierOrder = TIER_ORDER;

/**
 * Compare two plan tiers to determine upgrade/downgrade/same-tier
 */
export function comparePlans(currentPlan: string, newPlan: string): 'upgrade' | 'downgrade' | 'same-tier' {
  const currentTier = tierOrder[currentPlan?.toLowerCase()] || 0;
  const newTier = tierOrder[newPlan?.toLowerCase()] || 0;
  
  if (newTier > currentTier) {
    return 'upgrade';
  } else if (newTier < currentTier) {
    return 'downgrade';
  } else {
    return 'same-tier'; // Same tier, likely a frequency change
  }
}
