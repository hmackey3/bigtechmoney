
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Create new departments that don't exist yet in the system
 */
export async function createNewDepartments(
  departments: string[], 
  systemAccountId: string
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();
  
  try {
    // Fetch existing departments to avoid duplicates
    const { data: existingDepts, error: fetchError } = await supabase
      .from("departments")
      .select("name")
      .eq("system_account_id", systemAccountId);
      
    if (fetchError) {
      console.error("Error fetching departments:", fetchError);
      return results;
    }
    
    // Create a set of existing department names (lowercase for case-insensitive comparison)
    const existingDeptNames = new Set(
      existingDepts?.map(dept => dept.name.toLowerCase()) || []
    );
    
    // Filter out departments that already exist
    const newDepartments = departments.filter(
      dept => !existingDeptNames.has(dept.toLowerCase())
    );
    
    if (newDepartments.length === 0) {
      return results; // No new departments to add
    }
    
    // Prepare department objects for insertion
    const deptObjects = newDepartments.map(name => ({
      name: name,
      system_account_id: systemAccountId
    }));
    
    // Insert new departments
    const { data: insertedDepts, error: insertError } = await supabase
      .from("departments")
      .insert(deptObjects)
      .select();
      
    if (insertError) {
      console.error("Error creating new departments:", insertError);
      return results;
    }
    
    // Mark successfully created departments
    newDepartments.forEach(dept => {
      results.set(dept, true);
    });
    
    if (newDepartments.length > 0) {
      toast.success(`Added ${newDepartments.length} new department(s)`);
    }
    
  } catch (error) {
    console.error("Error in createNewDepartments:", error);
  }
  
  return results;
}
