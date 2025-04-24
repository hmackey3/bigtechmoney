import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useAuthInvitation } from "@/hooks/useAuthInvitation";
import { toast } from "sonner";
import { Home, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [invitationEmail, setInvitationEmail] = useState<string | null>(null);
  const [invitationAccepted, setInvitationAccepted] = useState(false);
  const [invitationChecked, setInvitationChecked] = useState(false);

  // Extract invitation token and handle direct login/signup links
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("invitation");
    const loginParam = searchParams.get("login");
    const signupParam = searchParams.get("signup");

    // Set active tab based on URL parameters
    if (signupParam === "true") {
      setActiveTab("signup");
    } else if (loginParam === "true") {
      setActiveTab("login");
    }

    if (token) {
      console.log("Found invitation token in URL:", token);
      setInvitationToken(token);
      // Always default to signup for invitation links
      setActiveTab("signup");

      // Fetch the email to pre-fill in the signup form
      const fetchInvitationEmail = async () => {
        try {
          console.log("Fetching details for invitation token:", token);

          const { data, error } = await supabase
            .from("system_members")
            .select("email, user_id")
            .eq("invitation_token", token)
            .eq("status", "invited")
            .maybeSingle();

          if (error) {
            console.error("Error fetching invitation details:", error);
            // Don't show this error - we'll handle it in the signup form
            setInvitationChecked(true);
            return;
          }

          if (data) {
            console.log("Found invitation data:", data);
            setInvitationEmail(data.email);

            // No need to check if user exists, always send to signup
            setActiveTab("signup");
          } else {
            // Only show error once here, not in multiple components
            toast.error("Invalid or expired invitation");
          }

          setInvitationChecked(true);
        } catch (error) {
          console.error("Error processing invitation:", error);
          setInvitationChecked(true);
        }
      };

      fetchInvitationEmail();
    } else {
      setInvitationChecked(true);
    }
  }, [location, setActiveTab]);

  const { acceptInvitation, isProcessing } = useAuthInvitation(invitationToken);

  // Check if user is already logged in and handle invitation acceptance
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If user is logged in and has an invitation token, accept it
        if (invitationToken && !invitationAccepted) {
          console.log(
            "User is logged in with invitation token. Accepting invitation..."
          );
          const accepted = await acceptInvitation(invitationToken);
          setInvitationAccepted(accepted);

          if (accepted) {
            console.log(
              "Invitation accepted successfully, navigating to dashboard"
            );
          } else {
            console.warn("Failed to accept invitation");
          }

          navigate("/dashboard");
        } else {
          console.log("User is logged in, navigating to dashboard");
          navigate("/dashboard");
        }
      }
    };

    if (invitationChecked) {
      checkSession();
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed, event:", event);
      if (session) {
        // If user just logged in and has an invitation token, accept it
        if (invitationToken && !invitationAccepted) {
          console.log(
            "Auth state changed with invitation token, accepting invitation..."
          );
          // Give a moment for the auth to fully process
          setTimeout(async () => {
            const accepted = await acceptInvitation(invitationToken);
            setInvitationAccepted(accepted);

            if (accepted) {
              console.log("Invitation accepted successfully after auth change");
            } else {
              console.warn("Failed to accept invitation after auth change");
            }

            navigate("/dashboard");
          }, 500);
        } else {
          console.log("Auth state changed, navigating to dashboard");
          navigate("/dashboard");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [
    navigate,
    invitationToken,
    acceptInvitation,
    invitationAccepted,
    invitationChecked,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        size="icon"
        className="absolute top-4 left-4 z-20"
        asChild
      >
        <Link to="/">
          <Home className="h-6 w-6" />
          <span className="sr-only">Back to Home</span>
        </Link>
      </Button>
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome
            </CardTitle>
            <CardDescription className="text-center">
              {invitationToken
                ? "Complete your registration to join the organization"
                : "Sign in to your account or create a new one"}
            </CardDescription>
          </CardHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-2 mx-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm invitationToken={invitationToken} />
            </TabsContent>

            <TabsContent value="signup">
              <SignupForm invitationToken={invitationToken} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
