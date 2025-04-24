
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, 
} from "@/components/ui/dialog";
import { PlanChangeDescription } from "./PlanChangeDescription";
import { PlanChangeActions } from "./PlanChangeActions";
import { usePlanChange } from "./hooks/usePlanChange";

interface PlanChangeDialogProps {
  children: React.ReactNode;
  planId: string;
  planName: string;
  frequency: string;
  isUpgrade: boolean;
  currentPlanName?: string;
  currentPlanFrequency?: string;
  price: number | string;
}

export function PlanChangeDialog({
  children,
  planId,
  planName,
  frequency,
  isUpgrade,
  currentPlanName,
  currentPlanFrequency,
  price
}: PlanChangeDialogProps) {
  const [open, setOpen] = useState(false);
  const { isLoading, handlePlanChange } = usePlanChange();

  // Determine if we're changing frequency on the same plan
  const isFrequencyChange = currentPlanName?.toLowerCase() === planId.toLowerCase() && 
                           currentPlanFrequency !== frequency;

  const handleConfirm = () => {
    return handlePlanChange(planId, frequency, setOpen);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUpgrade
              ? `Upgrade to ${planName}`
              : isFrequencyChange
              ? `Change to ${frequency} billing`
              : `Change to ${planName} plan`}
          </DialogTitle>
          <DialogDescription>
            <PlanChangeDescription
              isUpgrade={isUpgrade}
              isFrequencyChange={isFrequencyChange}
              planName={planName}
              frequency={frequency}
              currentPlanName={currentPlanName}
              currentPlanFrequency={currentPlanFrequency}
              price={price}
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <PlanChangeActions
            isLoading={isLoading}
            onClose={() => setOpen(false)}
            onConfirm={handleConfirm}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
