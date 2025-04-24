
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import PersonalInfoCard from "./profile/PersonalInfoCard";
import TimeZoneCard from "./profile/TimeZoneCard";
import PasswordCard from "./profile/PasswordCard";
import EmailChangeDialog from "./profile/EmailChangeDialog";
import DeleteAccountDialog from "./profile/DeleteAccountDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ProfileSettings = () => {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!user) {
    return <div>Please log in to view your profile settings.</div>;
  }

  return (
    <div className="space-y-6">
      <PersonalInfoCard />
      <TimeZoneCard />
      <PasswordCard />
      <EmailChangeDialog />
      
      <Card className="border-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently remove your account and all associated data from our system. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Deleting your account will remove all your personal information, preferences, and data from our servers. 
            If you are the owner of a system with other members, you will be given options to transfer ownership or delete the entire system.
          </p>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Account
          </Button>
          <DeleteAccountDialog 
            open={showDeleteDialog} 
            onOpenChange={setShowDeleteDialog} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
