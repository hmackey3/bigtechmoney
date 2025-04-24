export interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: string;
  birthday: string;
  start_date: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  active: boolean;
  system_account_id: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationRecipient {
  id: string;
  name: string;
  email: string;
  mobile: string;
  departments: string[];  // Array of department IDs or 'all'
  notificationPreferences: NotificationPreference[];
  user_id: string;
}

export interface NotificationPreference {
  id: string;
  eventType: 'birthday' | 'workiversary' | 'both';
  notificationMethod: 'email' | 'sms' | 'both';
  timing: 'same-day' | 'one-day-before' | 'two-days-before' | 'one-week-before';
  timeOfDay: string; // in format 'HH:MM'
}

export interface Department {
  id: string;
  name: string;
}

export interface EventDistribution {
  month: string;
  birthdays: number;
  workiversaries: number;
}

export interface UpcomingEvent {
  id: string;
  name: string;
  date: string;
  daysUntil: number;
  type: 'birthday' | 'workiversary';
  age?: number;
  yearsAtCompany?: number;
}

export interface TeamInsights {
  totalMembers: number;
  averageEmploymentTime: number;
  averageAge: number;
  genderRatio: number;
}

export interface AgeDistribution {
  range: string;
  count: number;
}

export interface EmploymentTimeDistribution {
  range: string;
  count: number;
}

export interface TeamGrowth {
  date: string;
  count: number;
}

export interface OrganizationMember {
  id: string;
  user_id: string | null;
  email: string;
  role: string;
  status: string;
  system_account_id: string;
  invitation_token?: string;
  invited_by?: string;
  invited_at?: string;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string | null;
  };
}

export interface SystemMember {
  id: string;
  user_id: string | null;
  email: string;
  role: string;
  status: string;
  system_account_id: string;
  invitation_token?: string;
  invited_by?: string;
  invited_at?: string;
  created_at: string;
  updated_at: string;
  full_name?: string | null;
}

export interface SupabaseTeamInsights {
  total_members: number;
  average_employment_time: number;
  average_age: number;
  gender_ratio: number;
}

export interface SupabaseEventDistribution {
  month: string;
  birthdays: number;
  workiversaries: number;
}

export interface SupabaseUpcomingEvent {
  id: string;
  name: string;
  date: string;
  days_until: number;
  event_type: 'birthday' | 'workiversary';
  age?: number;
  years_at_company?: number;
}
