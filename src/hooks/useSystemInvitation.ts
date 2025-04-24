
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

export const useSystemInvitation = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const acceptInvitation = async (invitationToken: string) => {
    if (!user) {
      toast.error("You must be logged in to accept an invitation");
      return false;
    }

    try {
      setIsProcessing(true);
      console.log("Accepting system invitation with token:", invitationToken);
      
      const { data, error } = await supabase
        .rpc('accept_system_invitation', { p_invitation_token: invitationToken });
        
      if (error) {
        console.error("Error accepting invitation:", error);
        toast.error(error.message || "Failed to accept invitation");
        return false;
      }
      
      console.log("Invitation accepted successfully:", data);
      toast.success("Invitation accepted successfully");
      return true;
      
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      toast.error(error.message || "Failed to accept invitation");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const sendInvitation = async (
    email: string,
    role: string,
    inviterName: string
  ) => {
    if (!user) {
      toast.error("You must be logged in to send invitations");
      return false;
    }

    try {
      setIsProcessing(true);
      
      // First create the invitation in the database
      console.log("Creating invitation for email:", email, "with role:", role);
      const { data: invitationData, error } = await supabase
        .rpc('invite_system_member', { 
          member_email: email,
          member_role: role 
        });
        
      if (error) {
        console.error("Error creating invitation:", error);
        throw error;
      }
      
      console.log("Invitation created with token:", invitationData);
      
      // Then send the invitation email
      console.log("Sending invitation email to:", email);
      const { data: emailData, error: emailError } = await supabase.functions.invoke(
        'send-invitation-email',
        {
          body: {
            email,
            inviterName,
            invitationToken: invitationData,
          },
        }
      );
      
      if (emailError) {
        console.error("Error sending invitation email:", emailError);
        // Delete the invitation since email failed
        await supabase.from('system_members').delete().match({ invitation_token: invitationData });
        throw new Error("Failed to send invitation email");
      }

      console.log("Invitation email sent successfully:", emailData);
      toast.success("Invitation sent successfully");
      return true;
      
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      toast.error(error.message || "Failed to send invitation");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    acceptInvitation,
    sendInvitation,
  };
};
