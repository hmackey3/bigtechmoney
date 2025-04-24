
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

const EmailChangeDialog = () => {
  const { user } = useAuth();
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listen for custom event to open the dialog
  useEffect(() => {
    const handleOpenDialog = () => {
      setIsChangingEmail(true);
    };

    window.addEventListener('open-email-dialog', handleOpenDialog);
    
    return () => {
      window.removeEventListener('open-email-dialog', handleOpenDialog);
    };
  }, []);

  // Handle email change
  const handleEmailChange = async () => {
    if (!user || !newEmail) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) throw error;
      
      toast.success("Email update initiated. Please check your new email for confirmation.");
      setIsChangingEmail(false);
      setNewEmail("");
    } catch (error: any) {
      toast.error(error.message || "Error updating email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isChangingEmail} onOpenChange={setIsChangingEmail}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Email Address</DialogTitle>
          <DialogDescription>
            Enter your new email address. You'll need to verify this email before the change takes effect.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-email">New Email Address</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="your.new.email@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsChangingEmail(false)}>Cancel</Button>
          <Button 
            onClick={handleEmailChange}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Change Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailChangeDialog;
