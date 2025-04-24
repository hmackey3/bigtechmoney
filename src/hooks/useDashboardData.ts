
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  SupabaseTeamInsights, 
  SupabaseEventDistribution, 
  SupabaseUpcomingEvent,
  TeamInsights,
  EventDistribution,
  UpcomingEvent
} from "@/lib/types";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

export const useDashboardData = () => {
  const [teamInsights, setTeamInsights] = useState<TeamInsights | null>(null);
  const [eventDistribution, setEventDistribution] = useState<EventDistribution[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<UpcomingEvent[]>([]);
  const [upcomingWorkiversaries, setUpcomingWorkiversaries] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Transform Supabase event to the expected format with correct date handling
  const transformEvent = (event: SupabaseUpcomingEvent): UpcomingEvent => {
    let daysUntil = event.days_until;
    let eventDate = new Date(event.date);
    
    // If days until is negative, adjust it to next year's event
    if (daysUntil < 0) {
      const nextYear = new Date(eventDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      
      // Calculate days until next year's event
      const today = new Date();
      const timeDiff = nextYear.getTime() - today.getTime();
      daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Update the date to next year
      eventDate = nextYear;
    }
    
    return {
      id: event.id,
      name: event.name,
      date: eventDate.toISOString(),
      daysUntil: daysUntil,
      type: event.event_type === 'birthday' ? 'birthday' : 'workiversary',
      age: event.event_type === 'birthday' ? (event.age ? event.age + 1 : undefined) : undefined,
      yearsAtCompany: event.event_type === 'workiversary' ? (event.years_at_company ? event.years_at_company + 1 : undefined) : undefined
    };
  };

  // Fetch system account ID
  const fetchSystemAccountId = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("system_account_id")
        .eq("id", user.id)
        .single();
        
      if (error) throw error;
      return data?.system_account_id;
    } catch (error) {
      console.error("Error fetching system account ID:", error);
      return null;
    }
  };

  // Fetch team insights
  const fetchTeamInsights = async (systemAccountId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_team_insights', { p_system_account_id: systemAccountId });
        
      if (error) throw error;
      
      const insights = data[0] as SupabaseTeamInsights;
      
      // Handle potentially null values with defaults
      setTeamInsights({
        totalMembers: insights.total_members || 0,
        averageEmploymentTime: insights.average_employment_time ? parseFloat(insights.average_employment_time.toFixed(1)) : 0,
        averageAge: insights.average_age ? parseFloat(insights.average_age.toFixed(1)) : 0,
        genderRatio: insights.gender_ratio ? parseFloat(insights.gender_ratio.toFixed(1)) : 0
      });
    } catch (error) {
      console.error("Error fetching team insights:", error);
      toast.error("Failed to load team insights");
    }
  };

  // Fetch event distribution
  const fetchEventDistribution = async (systemAccountId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_event_distribution', { p_system_account_id: systemAccountId });
        
      if (error) throw error;
      
      const distribution: EventDistribution[] = (data as SupabaseEventDistribution[]).map(item => ({
        month: item.month,
        birthdays: Number(item.birthdays),
        workiversaries: Number(item.workiversaries)
      }));
      
      setEventDistribution(distribution);
    } catch (error) {
      console.error("Error fetching event distribution:", error);
      toast.error("Failed to load event distribution");
    }
  };

  // Fetch upcoming events
  const fetchUpcomingEvents = async (systemAccountId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_upcoming_events', { p_system_account_id: systemAccountId });
        
      if (error) throw error;
      
      const events = data as SupabaseUpcomingEvent[];
      
      // Sort events by days until (always positive now)
      const sortedEvents = events.map(transformEvent).sort((a, b) => a.daysUntil - b.daysUntil);
      
      // Split events by type
      const birthdays: UpcomingEvent[] = [];
      const workiversaries: UpcomingEvent[] = [];
      
      sortedEvents.forEach(event => {
        if (event.type === 'birthday') {
          birthdays.push(event);
        } else {
          workiversaries.push(event);
        }
      });
      
      setUpcomingBirthdays(birthdays);
      setUpcomingWorkiversaries(workiversaries);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      toast.error("Failed to load upcoming events");
    }
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const systemAccountId = await fetchSystemAccountId();
      if (!systemAccountId) {
        console.error("No system account ID found");
        return;
      }
      
      // Fetch all data in parallel
      await Promise.all([
        fetchTeamInsights(systemAccountId),
        fetchEventDistribution(systemAccountId),
        fetchUpcomingEvents(systemAccountId)
      ]);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return {
    teamInsights,
    eventDistribution,
    upcomingBirthdays,
    upcomingWorkiversaries,
    isLoading,
    refreshData: fetchDashboardData
  };
};
