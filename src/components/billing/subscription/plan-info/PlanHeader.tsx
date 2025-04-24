
import { PlanIcon } from "./PlanIcon";

interface PlanHeaderProps {
  planName: string;
  frequency: string;
}

export function PlanHeader({ planName, frequency }: PlanHeaderProps) {
  const planNameCapitalized = planName.charAt(0).toUpperCase() + planName.slice(1);
  
  return (
    <div className="flex items-center gap-2">
      <PlanIcon planName={planName} />
      <h3 className="text-lg font-medium">{planNameCapitalized} Plan</h3>
      <span className="text-xs font-medium text-muted-foreground">
        ({frequency} billing)
      </span>
    </div>
  );
}
