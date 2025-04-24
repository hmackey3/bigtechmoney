
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";

interface PlanChangeActionsProps {
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function PlanChangeActions({
  isLoading,
  onClose,
  onConfirm
}: PlanChangeActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:justify-between gap-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={onConfirm} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Confirm Change
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
