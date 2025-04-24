
import { LucideIcon, BadgeCheck, Shield, Zap } from "lucide-react";

interface PlanIconProps {
  planName: string;
}

export function PlanIcon({ planName }: PlanIconProps) {
  const getPlanIcon = (name: string): LucideIcon => {
    const lowerCaseName = name.toLowerCase();
    
    if (lowerCaseName === 'starter') return BadgeCheck;
    if (lowerCaseName === 'growth') return Zap;
    if (lowerCaseName === 'pro') return Shield;
    
    return BadgeCheck; // Default icon
  };
  
  const Icon = getPlanIcon(planName);
  
  return (
    <div className="rounded-full bg-primary/10 p-1">
      <Icon className="h-5 w-5 text-primary" />
    </div>
  );
}
