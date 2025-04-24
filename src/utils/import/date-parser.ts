
/**
 * Date parsing utilities for the import system
 */

// Define acceptable date formats
export const dateFormats = [
  'YYYY-MM-DD',  // e.g., 2023-01-15
  'DD/MM/YYYY',  // e.g., 15/01/2023
  'MM/DD/YYYY',  // e.g., 01/15/2023
  'DD.MM.YYYY',   // e.g., 15.01.2023
  'MM-DD-YYYY',  // e.g., 01-15-2023
  'MM/DD/YY',    // e.g., 01/15/23
  'DD/MM/YY',    // e.g., 15/01/23
];

/**
 * Parse date from various formats and convert to ISO format
 * Returns null if the date cannot be parsed
 */
export function parseDate(dateStr: string): string | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  
  // Clean up the input
  const cleanDateStr = dateStr.trim();
  if (!cleanDateStr) return null;
  
  // Try ISO format first (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDateStr)) {
    // Validate the date
    const date = new Date(cleanDateStr);
    return !isNaN(date.getTime()) ? cleanDateStr : null;
  }
  
  let parsedDate: Date | null = null;
  
  // Try MM-DD-YYYY format
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(cleanDateStr)) {
    const parts = cleanDateStr.split('-');
    parsedDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
  }
  // Try DD/MM/YYYY or MM/DD/YYYY format
  else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanDateStr)) {
    const parts = cleanDateStr.split('/');
    
    // If first number is > 12, assume DD/MM/YYYY
    if (parseInt(parts[0]) > 12) {
      parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      // Could be either MM/DD/YYYY or DD/MM/YYYY
      // For US format, check if the second number is > 12 (indicating it's a day)
      const firstNum = parseInt(parts[0]);
      const secondNum = parseInt(parts[1]);
      
      if (firstNum <= 12 && secondNum > 12) {
        // Likely MM/DD/YYYY
        parsedDate = new Date(parseInt(parts[2]), firstNum - 1, secondNum);
      } else {
        // Default to DD/MM/YYYY unless we're pretty sure it's MM/DD/YYYY
        parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }
  }
  // Try DD.MM.YYYY format
  else if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(cleanDateStr)) {
    const parts = cleanDateStr.split('.');
    parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  // Try MM/DD/YY or DD/MM/YY format
  else if (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(cleanDateStr)) {
    const parts = cleanDateStr.split('/');
    // Assume 20xx for years < 50, 19xx for years >= 50
    const year = parseInt(parts[2]) < 50 ? 2000 + parseInt(parts[2]) : 1900 + parseInt(parts[2]);
    
    // Default to MM/DD/YY, but handle DD/MM/YY if first number > 12
    if (parseInt(parts[0]) > 12) {
      parsedDate = new Date(year, parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      parsedDate = new Date(year, parseInt(parts[0]) - 1, parseInt(parts[1]));
    }
  }
  
  if (parsedDate && !isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0];
  }
  
  return null;
}

