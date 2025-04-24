/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import type { SignupFormValues } from "@/components/auth/types";

export const useSignupInvitation = (
  invitationToken: string | null,
  form: ReturnType<typeof useForm<SignupFormValues>>
) => {
  const [invitationEmail, setInvitationEmail] = useState<string | null>(null);
  const [fetchingInvitation, setFetchingInvitation] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to fetch the email associated with this invitation
    if (invitationToken) {
      const fetchInvitationEmail = async () => {
        try {
          setFetchingInvitation(true);
          setFetchError(null);

          console.log(`Fetching invitation details for token: ${invitationToken}`);

          // Using maybeSingle() instead of single() to handle "no rows" case more gracefully
          const { data, error } = await supabase
            .from('system_members')
            .select('email, status, invitation_expiry_date')
            .eq('invitation_token', invitationToken)
            .eq('status', 'invited')  // Only get invitations that haven't been accepted yet
            .maybeSingle();

          console.log('Supabase response:', { data, error });

          if (error) {
            console.error("Error fetching invitation:", error);
            setFetchError(error.message);
            return;
          }
          const currentDate = new Date();
          const expiryDate = new Date(data.invitation_expiry_date);

          if (expiryDate < currentDate) {
            console.error("Invitation has expired");
            setFetchError("This invitation link has expired");
            return;
          }

          if (data && data.email) {
            console.log(`Found invitation email: ${data.email}`);
            setInvitationEmail(data.email);
            form.setValue("email", data.email);
          } else {
            console.error("No valid invitation found with this token");
            setFetchError("Invalid or expired invitation");
            // Don't show a toast here - the error is already displayed in the form
          }
        } catch (error: any) {
          console.error("Error fetching invitation details:", error);
          setFetchError("Error loading invitation details");
        } finally {
          setFetchingInvitation(false);
        }
      };

      fetchInvitationEmail();
    }
  }, [invitationToken, form]);

  return {
    invitationEmail,
    fetchingInvitation,
    fetchError
  };
};
