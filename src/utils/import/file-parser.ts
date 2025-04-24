
import * as XLSX from 'xlsx';

/**
 * Parse data from different file formats (CSV, XLSX, XLS)
 */
export function parseFileData(file: File, data: ArrayBuffer): any[] {
  try {
    // Parse the file based on its extension
    const fileType = file.name.toLowerCase();
    let workbook: XLSX.WorkBook;
    
    if (fileType.endsWith('.csv')) {
      // Parse CSV - use string_array to preserve leading zeros and date formats
      workbook = XLSX.read(data, { type: 'binary', raw: true });
    } else if (fileType.endsWith('.xlsx') || fileType.endsWith('.xls')) {
      // Parse Excel - use date detection
      workbook = XLSX.read(data, { 
        type: 'binary', 
        cellDates: true, 
        dateNF: 'yyyy-mm-dd'
      });
    } else {
      throw new Error('Unsupported file format. Please use CSV, XLS, or XLSX files.');
    }
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('The file contains no sheets.');
    }
    
    // Convert to JSON with headers
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: '', // Default empty value instead of undefined
      raw: false  // Convert everything to strings to avoid date formatting issues
    });
    
    return jsonData;
  } catch (error) {
    console.error("Error parsing file:", error);
    throw error;
  }
}

