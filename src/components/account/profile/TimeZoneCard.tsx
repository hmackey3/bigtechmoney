
import { useState, useId, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";

const TimeZoneCard = () => {
  const { user } = useAuth();
  const [timeZone, setTimeZone] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const id = useId();

  // Use a comprehensive list of timezones as fallback
  const timezones = useMemo(() => [
    "UTC",
    "Africa/Abidjan", "Africa/Accra", "Africa/Algiers", "Africa/Bissau", "Africa/Cairo",
    "Africa/Casablanca", "Africa/Ceuta", "Africa/Johannesburg", "Africa/Lagos",
    "America/Anchorage", "America/Bogota", "America/Buenos_Aires", "America/Caracas",
    "America/Chicago", "America/Denver", "America/Godthab", "America/Halifax",
    "America/Los_Angeles", "America/Mexico_City", "America/New_York", "America/Phoenix",
    "America/Regina", "America/Santiago", "America/Sao_Paulo", "America/St_Johns",
    "Asia/Baghdad", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Dhaka",
    "Asia/Dubai", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Istanbul", "Asia/Jakarta",
    "Asia/Jerusalem", "Asia/Kabul", "Asia/Karachi", "Asia/Kathmandu", "Asia/Kolkata",
    "Asia/Kuwait", "Asia/Manila", "Asia/Muscat", "Asia/Riyadh", "Asia/Seoul",
    "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tehran", "Asia/Tokyo",
    "Australia/Adelaide", "Australia/Brisbane", "Australia/Darwin", "Australia/Hobart",
    "Australia/Melbourne", "Australia/Perth", "Australia/Sydney",
    "Europe/Amsterdam", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin",
    "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Copenhagen",
    "Europe/Dublin", "Europe/Helsinki", "Europe/Istanbul", "Europe/Kiev", "Europe/Lisbon",
    "Europe/London", "Europe/Madrid", "Europe/Moscow", "Europe/Oslo", "Europe/Paris",
    "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Sofia", "Europe/Stockholm",
    "Europe/Tallinn", "Europe/Vienna", "Europe/Vilnius", "Europe/Warsaw", "Europe/Zurich",
    "Pacific/Auckland", "Pacific/Fiji", "Pacific/Guam", "Pacific/Honolulu",
    "Pacific/Noumea", "Pacific/Port_Moresby", "Pacific/Tongatapu"
  ], []);

  // Fetch the user's timezone from their profile
  useEffect(() => {
    const fetchUserTimezone = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('timezone')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.timezone) {
          setTimeZone(data.timezone);
        } else {
          detectAndSetTimezone();
        }
      } catch (error) {
        console.error("Error fetching user timezone:", error);
        detectAndSetTimezone();
      }
    };
    
    fetchUserTimezone();
  }, [user]);

  // Detect and set the user's timezone
  const detectAndSetTimezone = () => {
    try {
      // Get the timezone from the browser
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimeZone(detectedTimezone);
    } catch (error) {
      console.error("Error detecting timezone:", error);
      setTimeZone("UTC"); // Fallback to UTC on error
    }
  };

  const formattedTimezones = useMemo(() => {
    return timezones.map((timezone) => {
      const formatter = new Intl.DateTimeFormat("en", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
      });
      const parts = formatter.formatToParts(new Date());
      const offset = parts.find((part) => part.type === "timeZoneName")?.value || "";
      const modifiedOffset = offset === "GMT" ? "GMT+0" : offset;

      return {
        value: timezone,
        label: `(${modifiedOffset}) ${timezone.replace(/_/g, " ")}`,
        numericOffset: parseInt(offset.replace("GMT", "").replace("+", "") || "0"),
      };
    }).sort((a, b) => a.numericOffset - b.numericOffset);
  }, [timezones]);

  // Handle timezone update
  const handleTimeZoneUpdate = async () => {
    if (!timeZone || !user) return;
    
    setIsSaving(true);
    
    try {
      // Update the timezone using the database function
      const { error } = await supabase.rpc('update_user_timezone', {
        new_timezone: timeZone
      });
      
      if (error) throw error;
      
      toast.success(`Time zone updated to ${timeZone}`);
    } catch (error: any) {
      console.error("Error updating timezone:", error);
      toast.error(error.message || "Error updating time zone");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Zone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`timezone-${id}`}>Select Time Zone</Label>
          <Select 
            value={timeZone || undefined} 
            onValueChange={setTimeZone}
          >
            <SelectTrigger id={`timezone-${id}`}>
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent>
              {formattedTimezones.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleTimeZoneUpdate} 
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Time Zone"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimeZoneCard;
