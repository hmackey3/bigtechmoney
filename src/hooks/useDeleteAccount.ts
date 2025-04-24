/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { m } from "framer-motion";

export const useDeleteAccount = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signOut, session, user } = useAuth();

  const deleteAccount = async (newOwnerId: string | null = null) => {
    setIsDeleting(true);
    setError(null);

    try {
      // Check if we have a valid session
      if (!session) {
        throw new Error("You must be logged in to delete your account");
      }

      console.log("Calling delete-account function with newOwnerId:", newOwnerId);

      // Pass the auth token in the request
      const { data, error: invokeError } = await supabase.functions.invoke('delete-account', {
        body: { new_owner_id: newOwnerId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (invokeError) {
        console.error("Edge function invoke error:", invokeError);
        throw new Error(invokeError.message || "Failed to invoke delete account function");
      }

      // Check for error in the response data
      if (data && data.error) {
        console.error("Edge function error response:", data.error);
        throw new Error(data.error);
      }

      console.log("Delete account response:", data);


      // Sign out the user
      await signOut();
      toast.success("Account deleted successfully");
      return true;

    } catch (error: any) {
      console.error("Error deleting account:", error);
      const errorMessage = error.message || "Failed to delete account";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAccount, isDeleting, error };
};
