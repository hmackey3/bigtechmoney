
import { TeamMember } from '@/lib/types';
import { parseDate } from './date-parser';

/**
 * Process and normalize imported data from various file formats
 */
export function processImportedData(data: any[]): Partial<TeamMember>[] {
  const processedData: Partial<TeamMember>[] = [];
  
  data.forEach((row) => {
    // Normalize field names (handle different cases and variations)
    const normalizedRow: Record<string, any> = {};
    
    Object.keys(row).forEach(key => {
      const lowerKey = key.toLowerCase().trim();
      // Store both original value and lowercase key for flexibility
      normalizedRow[lowerKey] = row[key];
    });
    
    // Extract fields using various possible key names
    const name = normalizedRow.name || normalizedRow.fullname || normalizedRow["full name"] || "";
    const email = normalizedRow.email || normalizedRow["email address"] || "";
    const department = normalizedRow.department || normalizedRow.dept || normalizedRow.division || "";
    
    // Handle various gender formats
    let gender = normalizedRow.gender || normalizedRow.sex || "prefer-not-to-say";
    // Normalize gender values
    gender = gender.toString().toLowerCase().trim();
    if (gender === 'yes' || gender === 'no' || gender === 'true' || gender === 'false') {
      // This might be from the "active" column being misinterpreted as gender
      gender = "prefer-not-to-say";
    }
    if (gender !== 'male' && gender !== 'female' && gender !== 'other') {
      gender = "prefer-not-to-say";
    }
    
    // Handle active status conversion
    let active = true;
    const activeField = normalizedRow.active || normalizedRow.status || normalizedRow.enabled || "Yes";
    const activeStr = String(activeField).toLowerCase().trim();
    if (activeStr === 'no' || activeStr === 'false' || activeStr === 'inactive' || activeStr === '0' || activeStr === 'disabled') {
      active = false;
    }
    
    // Parse dates with better key detection
    const birthdayStr = 
      normalizedRow.birthday || 
      normalizedRow.birthdate || 
      normalizedRow.birth || 
      normalizedRow.dob || 
      normalizedRow["date of birth"] || 
      normalizedRow["birth date"] || "";
    
    const startDateStr = 
      normalizedRow.startdate || 
      normalizedRow["start date"] || 
      normalizedRow.started || 
      normalizedRow.joined || 
      normalizedRow["join date"] || 
      normalizedRow["joining date"] || 
      normalizedRow["start"] || "";
    
    const birthday = parseDate(birthdayStr);
    const startDate = parseDate(startDateStr);
    
    // Only add the row if we have the required fields: name, email, birthday, and start_date
    if (name && email && birthday && startDate) {
      const member: Partial<TeamMember> = {
        name,
        email,
        department,
        gender: gender as 'male' | 'female' | 'other' | 'prefer-not-to-say',
        active,
        birthday,
        start_date: startDate
      };
      
      processedData.push(member);
    }
  });
  
  return processedData;
}

