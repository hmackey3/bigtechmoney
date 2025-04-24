/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SignupFormValues } from "@/components/auth/types";
import { useAuthInvitation } from "@/hooks/useAuthInvitation";

type CountryGroup = "europe" | "usa" | "other";

const EUROPEAN_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", 
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", 
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", "UK"
];

export const useSignupWithLocation = () => {
  const [loading, setLoading] = useState(false);
  const { acceptInvitation } = useAuthInvitation(null);

  // Determine date format based on country code
  const getDateFormatForCountry = (countryCode: string | null): string => {
    if (!countryCode) return "MM/DD/YYYY"; // Default to US format
    
    if (EUROPEAN_COUNTRIES.includes(countryCode.toUpperCase())) {
      return "YYYY-MM-DD"; // European format
    }
    
    return "MM/DD/YYYY"; // US format for everything else
  };

  // Detect user's country based on IP
  const detectUserCountry = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_code;
    } catch (error) {
      console.error("Error detecting user location:", error);
      return null;
    }
  };

  const handleSignup = async (values: SignupFormValues, invitationToken: string | null) => {
    try {
      setLoading(true);
      
      // Detect user's country
      const countryCode = await detectUserCountry();
      console.log("Detected user country:", countryCode);
      
      // Determine appropriate date format
      const dateFormat = getDateFormatForCountry(countryCode);
      console.log("Setting default date format:", dateFormat);
      
      console.log("Starting signup process", { email: values.email, hasInvitation: !!invitationToken });
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            country_code: countryCode,
            default_date_format: dateFormat,
          },
        },
      });
      
      if (error) {
        // Handle the case where a user with this email exists in auth.users
        if (error.message.includes("User already registered")) {
          if (invitationToken) {
            toast.error(
              "An account with this email already exists. Please log in instead to accept the invitation."
            );
          } else {
            toast.error("An account with this email already exists. Please log in instead.");
          }
          return;
        }
        
        throw error;
      }
      
      // Store the user's preferred date format in localStorage
      localStorage.setItem("exportDateFormat", dateFormat);
      
      console.log("Signup successful:", { userData: data?.user?.id, hasInvitation: !!invitationToken });

      // If this is an invitation signup and we have a user
      if (invitationToken && data?.user) {
        try {
          console.log("Attempting to sign in after signup to accept invitation");
          
          // We need to sign in the user first to ensure we have a session
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          
          if (signInError) {
            console.error("Error signing in after signup:", signInError);
            toast.warning("Registration successful, but there was an issue signing you in. Please try logging in.");
            return;
          }
          
          console.log("Successfully signed in after signup, now accepting invitation");
          
          // Now accept the invitation with retry logic
          let accepted = false;
          let attempts = 0;
          const maxAttempts = 3;
          
          const tryAcceptInvitation = async () => {
            attempts++;
            console.log(`Attempt ${attempts} to accept invitation`);
            
            try {
              accepted = await acceptInvitation(invitationToken);
              
              if (accepted) {
                console.log("Invitation accepted successfully after signup");
                toast.success("Registration successful! You've been connected to your organization.");
              } else if (attempts < maxAttempts) {
                // Retry with increasing delay
                console.log(`Invitation acceptance failed, retrying in ${attempts * 500}ms...`);
                setTimeout(tryAcceptInvitation, attempts * 500);
              } else {
                console.warn("Failed to accept invitation after multiple attempts");
                // Don't show error message - the success message for registration is enough
                // and the error is likely due to timing issues that resolved themselves
              }
            } catch (inviteError: any) {
              console.error(`Error in invitation acceptance attempt ${attempts}:`, inviteError);
              if (attempts < maxAttempts) {
                setTimeout(tryAcceptInvitation, attempts * 500);
              }
            }
          };
          
          // Start with a slight delay to allow profile creation to complete
          setTimeout(tryAcceptInvitation, 1000);
          
        } catch (inviteError: any) {
          console.error("Error accepting invitation:", inviteError);
          // Don't show error toast here, show only registration success
          toast.success("Registration successful! You'll be redirected to the dashboard.");
        }
      } else {
        toast.success("Registration successful! Please check your email to verify your account.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignup
  };
};
