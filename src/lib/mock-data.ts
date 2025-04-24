import { 
  TeamMember, 
  NotificationRecipient, 
  Department, 
  EventDistribution,
  UpcomingEvent,
  TeamInsights,
  AgeDistribution,
  EmploymentTimeDistribution,
  TeamGrowth,
  NotificationPreference
} from './types';

// Departments
export const departments: Department[] = [
  { id: '1', name: 'All Departments' },
  { id: '2', name: 'Finance' },
  { id: '3', name: 'HR' },
  { id: '4', name: 'Management' },
  { id: '5', name: 'Marketing' },
  { id: '6', name: 'Sales' },
  { id: '7', name: 'Tech' },
];

// Team Members
export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Andrew Clark',
    email: 'andrew.clark@annive.com',
    department: 'Sales',
    birthday: '1979-12-01',
    start_date: '2023-04-19',
    gender: 'male',
    active: true,
    system_account_id: '',
    created_at: '',
    updated_at: ''
  },
  {
    id: '2',
    name: 'Victoria Spencer',
    email: 'victoria.spencer@annive.com',
    department: 'Marketing',
    birthday: '1998-07-28',
    start_date: '2023-05-10',
    gender: 'female',
    active: true,
    system_account_id: '',
    created_at: '',
    updated_at: ''
  },
  {
    id: '3',
    name: 'William Brown',
    email: 'william.brown@annive.com',
    department: 'Management',
    birthday: '1970-06-18',
    start_date: '2015-01-10',
    gender: 'male',
    active: true,
    system_account_id: '',
    created_at: '',
    updated_at: ''
  },
  {
    id: '4',
    name: 'Sarah Davis',
    email: 'sarah.davis@annive.com',
    department: 'HR',
    birthday: '1974-03-07',
    start_date: '2018-05-15',
    gender: 'female',
    active: true,
    system_account_id: '',
    created_at: '',
    updated_at: ''
  },
  {
    id: '5',
    name: 'Jennifer Perry',
    email: 'jennifer.perry@annive.com',
    department: 'Tech',
    birthday: '1975-03-13',
    start_date: '2014-04-05',
    gender: 'female',
    active: true,
    system_account_id: '',
    created_at: '',
    updated_at: ''
  },
  {
    id: '6',
    name: 'Henrik Almskoug',
    email: 'henrik@grxwth.com',
    department: 'Management',
    birthday: '1983-03-18',
    start_date: '2016-12-01',
    gender: 'male',
    active: true,
    system_account_id: '',
    created_at: '',
    updated_at: ''
  },
  {
    id: '7',
    name: 'Peter King',
    email: 'peter.king@annive.com',
    department: 'Finance',
    birthday: '1980-10-22',
    start_date: '2021-03-06',
    gender: 'male',
    active: true,
    system_account_id: '',
    created_at: '',
    updated_at: ''
  },
  {
    id: '8',
    name: 'Mary Johnson',
    email: 'mary.johnson@annive.com',
    department: 'Sales',
    birthday: '1985-08-30',
    start_date: '2019-03-15',
    gender: 'female',
    active: true,
    system_account_id: '',
    created_at: '',
    updated_at: ''
  },
];

// Event Distribution (Birthdays and Workiversaries per month)
export const eventDistribution: EventDistribution[] = [
  { month: 'Jan', birthdays: 2, workiversaries: 3 },
  { month: 'Feb', birthdays: 2, workiversaries: 3 },
  { month: 'Mar', birthdays: 4, workiversaries: 3 },
  { month: 'Apr', birthdays: 2, workiversaries: 3 },
  { month: 'May', birthdays: 2, workiversaries: 4 },
  { month: 'Jun', birthdays: 2, workiversaries: 2 },
  { month: 'Jul', birthdays: 3, workiversaries: 3 },
  { month: 'Aug', birthdays: 2, workiversaries: 2 },
  { month: 'Sep', birthdays: 3, workiversaries: 2 },
  { month: 'Oct', birthdays: 3, workiversaries: 2 },
  { month: 'Nov', birthdays: 3, workiversaries: 3 },
  { month: 'Dec', birthdays: 3, workiversaries: 1 },
];

// Upcoming Events
export const upcomingBirthdays: UpcomingEvent[] = [
  {
    id: '1',
    name: 'Sarah Davis',
    date: '2023-03-07',
    daysUntil: 1,
    type: 'birthday',
    age: 49
  },
  {
    id: '2',
    name: 'Jennifer Perry',
    date: '2023-03-13',
    daysUntil: 7,
    type: 'birthday',
    age: 48
  },
  {
    id: '3',
    name: 'Henrik Almskoug',
    date: '2023-03-18',
    daysUntil: 12,
    type: 'birthday',
    age: 40
  },
  {
    id: '4',
    name: 'William Brown',
    date: '2023-06-18',
    daysUntil: 104,
    type: 'birthday',
    age: 53
  },
  {
    id: '5',
    name: 'Victoria Spencer',
    date: '2023-07-28',
    daysUntil: 144,
    type: 'birthday',
    age: 25
  },
  {
    id: '6',
    name: 'Mary Johnson',
    date: '2023-08-30',
    daysUntil: 177,
    type: 'birthday',
    age: 38
  },
];

export const upcomingWorkiversaries: UpcomingEvent[] = [
  {
    id: '7',
    name: 'Peter King',
    date: '2023-03-06',
    daysUntil: 0,
    type: 'workiversary',
    yearsAtCompany: 2
  },
  {
    id: '8',
    name: 'Mary Johnson',
    date: '2023-03-15',
    daysUntil: 9,
    type: 'workiversary',
    yearsAtCompany: 4
  },
  {
    id: '9',
    name: 'Jennifer Perry',
    date: '2023-04-05',
    daysUntil: 30,
    type: 'workiversary',
    yearsAtCompany: 9
  },
  {
    id: '10',
    name: 'Sarah Davis',
    date: '2023-05-15',
    daysUntil: 70,
    type: 'workiversary',
    yearsAtCompany: 5
  },
  {
    id: '11',
    name: 'Victoria Spencer',
    date: '2023-05-10',
    daysUntil: 65,
    type: 'workiversary',
    yearsAtCompany: 1
  },
  {
    id: '12',
    name: 'Andrew Clark',
    date: '2023-04-19',
    daysUntil: 44,
    type: 'workiversary',
    yearsAtCompany: 1
  },
];

// Team Insights
export const teamInsights: TeamInsights = {
  totalMembers: 31,
  averageEmploymentTime: 4.8,
  averageAge: 40.2,
  genderRatio: 1.4, // male/female
};

// Age Distribution
export const ageDistribution: AgeDistribution[] = [
  { range: '20-25', count: 4 },
  { range: '26-30', count: 5 },
  { range: '31-35', count: 8 },
  { range: '36-40', count: 14 },
  { range: '41+', count: 0 },
];

// Employment Time Distribution - Sorted by range (0-1 first, 10+ last)
export const employmentTimeDistribution: EmploymentTimeDistribution[] = [
  { range: '0-1', count: 6 },
  { range: '1-2', count: 2 },
  { range: '2-5', count: 10 },
  { range: '5-10', count: 13 },
  { range: '10+', count: 0 },
];

// Team Growth Over Time
export const teamGrowth: TeamGrowth[] = [
  { date: '2015-01', count: 2 },
  { date: '2016-01', count: 5 },
  { date: '2017-01', count: 8 },
  { date: '2018-01', count: 10 },
  { date: '2019-01', count: 16 },
  { date: '2020-01', count: 20 },
  { date: '2021-01', count: 24 },
  { date: '2022-01', count: 26 },
  { date: '2023-01', count: 29 },
  { date: '2024-01', count: 31 },
];

// Notification Recipients
export const notificationRecipients: NotificationRecipient[] = [
  {
    id: '1',
    name: 'Henrik Almskoug',
    email: 'henrik@grxwth.com',
    mobile: '+46708501239',
    departments: ['2', '3', '4', '5', '6', '7'],
    notificationPreferences: [
      {
        id: '1',
        eventType: 'both',
        notificationMethod: 'email',
        timing: 'same-day',
        timeOfDay: '07:00'
      }
    ]
  }
];

// Removed organizationMembers mock data as we're now using Supabase data
