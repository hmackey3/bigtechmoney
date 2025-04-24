
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ExportSettings = () => {
  const { user } = useAuth();
  const [dateFormat, setDateFormat] = useState(() => {
    // Try to get saved dateFormat from localStorage, otherwise default to "MM/DD/YYYY"
    return localStorage.getItem("exportDateFormat") || "MM/DD/YYYY";
  });

  // Update localStorage when dateFormat changes
  useEffect(() => {
    localStorage.setItem("exportDateFormat", dateFormat);
  }, [dateFormat]);

  const handleSaveFormat = async () => {
    localStorage.setItem("exportDateFormat", dateFormat);
    
    // If user is logged in, also update their metadata
    if (user) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: { default_date_format: dateFormat }
        });
        
        if (error) {
          console.error("Error updating user preferences:", error);
          toast.error("Failed to save preferences to your account");
          return;
        }
      } catch (err) {
        console.error("Error updating user metadata:", err);
      }
    }
    
    toast.success("Export settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Date Format for Exports</CardTitle>
          <CardDescription>
            Choose how dates should appear in your exported files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-3 rounded-md flex items-start space-x-2 mb-4">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Your default format was automatically set based on your location. You can change it anytime.
            </p>
          </div>
          
          <RadioGroup value={dateFormat} onValueChange={setDateFormat}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DD/MM/YYYY" id="DD/MM/YYYY" />
              <Label htmlFor="DD/MM/YYYY">DD/MM/YYYY (e.g., 15/03/2024)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MM/DD/YYYY" id="MM/DD/YYYY" />
              <Label htmlFor="MM/DD/YYYY">MM/DD/YYYY (e.g., 03/15/2024)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="YYYY-MM-DD" id="YYYY-MM-DD" />
              <Label htmlFor="YYYY-MM-DD">YYYY-MM-DD (e.g., 2024-03-15)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="YYYYMMDD" id="YYYYMMDD" />
              <Label htmlFor="YYYYMMDD">YYYYMMDD (e.g., 20240315)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveFormat}>Save Export Settings</Button>
      </div>
    </div>
  );
};

export default ExportSettings;
