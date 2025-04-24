
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthInvitation = (invitationToken: string | null) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to accept an invitation after login/signup
  const acceptInvitation = async (token: string) => {
    if (!token) return false;
    
    try {
      setIsProcessing(true);
      console.log("Accepting invitation with token:", token);
      
      const { data, error } = await supabase.rpc('accept_system_invitation', {
        p_invitation_token: token
      });
      
      if (error) {
        console.error("Error accepting invitation:", error);
        // Only show specific errors, not the invalid invitation one (it's handled elsewhere)
        if (!error.message.includes("Invalid or expired invitation")) {
          toast.error(error.message || "Error accepting invitation");
        }
        return false;
      }
      
      if (data) {
        console.log("Invitation acceptance successful:", data);
        toast.success("You've successfully joined the organization!");
        return true;
      } else {
        console.warn("Invitation acceptance returned no data");
        // Don't show any warnings, user already gets a success message
        return false;
      }
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      // Only show specific errors, not the invalid invitation one (it's handled elsewhere)
      if (!error.message?.includes("Invalid or expired invitation")) {
        toast.error(error.message || "Error accepting invitation");
      }
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    acceptInvitation,
    isProcessing
  };
};
