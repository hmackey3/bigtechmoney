
import * as XLSX from 'xlsx';
import { TeamMember } from '@/lib/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { parseFileData } from './file-parser';
import { processImportedData } from './data-processor';
import { createNewDepartments } from './department-handler';
import { dateFormats } from './date-parser';

// Re-export for convenience
export { dateFormats } from './date-parser';

/**
 * Main function to handle file import of team members
 */
export async function importTeamMembers(
  file: File, 
  addTeamMember: (member: Omit<TeamMember, 'id' | 'system_account_id' | 'created_at' | 'updated_at'>) => Promise<boolean>
): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('Failed to read file');
        }
        
        // Parse data from the file
        let parsedData = parseFileData(file, data as ArrayBuffer);
        
        if (parsedData.length === 0) {
          throw new Error('No data found in the file.');
        }
        
        console.log("Parsed data from file:", parsedData);
        
        // Process and validate the data
        const processedData = processImportedData(parsedData);
        
        if (processedData.length === 0) {
          throw new Error('No valid data found. Please ensure your file has all required fields: name, email, birthday, and start date.');
        }
        
        console.log("Processed data ready for import:", processedData);
        
        // Get user's system account ID for department creation
        const { data: profileData, error: profileError } = await supabase
          .rpc('get_user_system_account_id');
          
        if (profileError || !profileData) {
          throw new Error('Failed to get system account. Please try again.');
        }
        
        // Extract all unique departments from imported data
        const departmentsToCheck = [...new Set(
          processedData
            .map(member => member.department)
            .filter(Boolean) as string[]
        )];
        
        // Create any new departments that don't exist yet
        if (departmentsToCheck.length > 0) {
          await createNewDepartments(departmentsToCheck, profileData);
        }
        
        // Add each team member
        let successCount = 0;
        let failedCount = 0;
        
        for (const member of processedData) {
          try {
            console.log("Attempting to add team member:", member);
            const success = await addTeamMember(member as Omit<TeamMember, 'id' | 'system_account_id' | 'created_at' | 'updated_at'>);
            if (success) {
              successCount++;
            } else {
              failedCount++;
              console.error("Failed to add team member:", member);
            }
          } catch (error) {
            failedCount++;
            console.error('Error adding team member:', error);
          }
        }
        
        if (failedCount > 0 && successCount === 0) {
          throw new Error(`Failed to import any team members. Please check required fields and try again.`);
        } else if (failedCount > 0) {
          console.warn(`${failedCount} team members failed to import. Check required fields.`);
        }
        
        resolve(successCount);
      } catch (error) {
        console.error('Error processing file:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
}
