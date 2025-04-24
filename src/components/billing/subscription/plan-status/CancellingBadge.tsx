
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CancellingBadgeProps {
  subscriptionId: string;
  onReactivated: () => void;
}

export function CancellingBadge({ subscriptionId, onReactivated }: CancellingBadgeProps) {
  const handleReactivate = async () => {
    try {
      const { error } = await supabase.functions.invoke('reactivate-subscription', {
        body: { subscriptionId }
      });

      if (error) throw error;

      toast.success("Your subscription has been reactivated!");
      onReactivated();
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      toast.error("Failed to reactivate subscription. Please try again.");
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
        Cancels at period end
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleReactivate}
        className="h-7 px-2 text-xs"
      >
        Reactivate
      </Button>
    </div>
  );
}
