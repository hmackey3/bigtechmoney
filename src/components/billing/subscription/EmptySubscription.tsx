
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmptySubscription() {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-6 space-y-4">
      <p className="text-muted-foreground">You don't have an active subscription yet.</p>
      <Button onClick={() => navigate("/plan")}>
        View Plans
      </Button>
    </div>
  );
}
