
import * as XLSX from 'xlsx';
import { TeamMember } from '@/lib/types';
import { format, parse } from 'date-fns';

// Template data for when there are no team members
const TEMPLATE_DATA: TeamMember[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'John Doe',
    email: 'john.doe@example.com',
    birthday: new Date('1990-01-15').toISOString().split('T')[0],
    start_date: new Date('2022-03-01').toISOString().split('T')[0],
    department: 'Engineering',
    gender: 'male',
    active: true,
    system_account_id: '00000000-0000-0000-0000-000000000000',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Format a date according to the user's selected format
function formatDateForExport(dateString: string): string {
  // Get the selected date format from localStorage
  const dateFormat = localStorage.getItem("exportDateFormat") || "YYYYMMDD";
  
  try {
    // Parse the ISO date
    const date = new Date(dateString);
    
    // Format according to the selected format
    switch (dateFormat) {
      case "DD/MM/YYYY":
        return format(date, 'dd/MM/yyyy');
      case "MM/DD/YYYY":
        return format(date, 'MM/dd/yyyy');
      case "YYYY-MM-DD":
        return format(date, 'yyyy-MM-dd');
      case "YYYYMMDD":
        return format(date, 'yyyyMMdd');
      default:
        return dateString;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

// Prepare data for export (simplified for display)
function prepareDataForExport(members: TeamMember[]): Record<string, string | number | boolean>[] {
  const dataToUse = members.length > 0 ? members : TEMPLATE_DATA;
  
  return dataToUse.map(member => ({
    Name: member.name,
    Email: member.email,
    Birthday: formatDateForExport(member.birthday),
    'Start Date': formatDateForExport(member.start_date),
    Department: member.department,
    Gender: member.gender,
    Active: member.active ? 'Yes' : 'No'
  }));
}

// Export as CSV
export function exportAsCSV(members: TeamMember[], filename = 'team-members'): void {
  const data = prepareDataForExport(members);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  // Create download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create download link and click it
  downloadFile(url, `${filename}.csv`);
}

// Export as XLSX
export function exportAsXLSX(members: TeamMember[], filename = 'team-members'): void {
  const data = prepareDataForExport(members);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Team Members');
  
  // Generate XLSX file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  // Create download link and click it
  downloadFile(url, `${filename}.xlsx`);
}

// Helper function to trigger file download
function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
