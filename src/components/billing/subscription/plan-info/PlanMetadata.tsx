
import { Calendar } from "lucide-react";
import { getDiscountPercentage } from "@/config/pricing-config";

interface PlanMetadataProps {
  currentPeriodEnd: number | null;
  frequency: string;
  formatDate: (timestamp: number) => string;
}

export function PlanMetadata({ 
  currentPeriodEnd, 
  frequency, 
  formatDate 
}: PlanMetadataProps) {
  if (!currentPeriodEnd) return null;
  
  const discountPercentage = frequency === 'yearly' ? getDiscountPercentage() : null;
  
  return (
    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <div>
          <p className="text-gray-500">Current period ends</p>
          <p className="font-medium">{formatDate(currentPeriodEnd)}</p>
        </div>
      </div>
      {frequency === 'yearly' && discountPercentage && (
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-green-100 p-1">
            <span className="text-xs font-medium text-green-800">
              {discountPercentage}
            </span>
          </div>
          <p className="text-gray-500">Yearly discount</p>
        </div>
      )}
    </div>
  );
}
