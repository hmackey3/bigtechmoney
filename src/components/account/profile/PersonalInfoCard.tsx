import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PersonalInfoCard = () => {
  // Auth state
  const { user } = useAuth();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      // Set email from auth user
      setEmail(user.email || "");

      // Get profile data from profiles table
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          setName(data.name || "");
        }
      };

      fetchProfile();
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Error updating profile");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              value={email}
              readOnly
              type="email"
              className="flex-1 bg-gray-50"
            />
            <Button
              variant="outline"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-email-dialog"))
              }
            >
              Change Email
            </Button>
          </div>
        </div>
        <Button onClick={handleProfileUpdate} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
