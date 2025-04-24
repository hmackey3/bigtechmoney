
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface CancelSubscriptionDialogProps {
  subscriptionId: string;
  setIsLoading: (isLoading: boolean) => void;
  onSubscriptionUpdated?: () => void;
}

export function CancelSubscriptionDialog({ 
  subscriptionId, 
  setIsLoading,
  onSubscriptionUpdated
}: CancelSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId },
      });

      if (error) throw error;
      
      toast.success("Your subscription has been scheduled for cancellation at the end of the current billing period");
      setOpen(false);
      
      // Refresh subscription data after cancellation
      if (onSubscriptionUpdated) {
        onSubscriptionUpdated();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-red-50 border-red-200 hover:bg-red-100 text-red-600">
          Cancel Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Cancel Subscription</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to cancel your subscription?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-md bg-amber-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Attention needed</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    Your subscription will remain active until the end of your current billing period. 
                    After that, your account will lose access to premium features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Never mind
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancelSubscription}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cancelling..." : "Cancel Subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
