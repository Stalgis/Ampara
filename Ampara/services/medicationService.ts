// Simple medication lookup service
// In production, this would connect to FDA NDC database or similar

export interface MedicationInfo {
  name: string;
  genericName?: string;
  dosage?: string;
  manufacturer?: string;
  ndc?: string;
  description?: string;
}

// Mock database of common medications with their barcodes
// In production, this would be replaced with actual API calls
const MEDICATION_DATABASE: Record<string, MedicationInfo> = {
  // Common barcode formats for medications
  '0123456789012': {
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10mg',
    manufacturer: 'Generic Pharma',
    ndc: '0123-4567-89',
    description: 'ACE inhibitor for blood pressure'
  },
  '0987654321098': {
    name: 'Metformin',
    genericName: 'Metformin HCl',
    dosage: '500mg',
    manufacturer: 'Teva Pharmaceuticals',
    ndc: '0987-6543-21',
    description: 'Diabetes medication'
  },
  '1234567890123': {
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    dosage: '20mg',
    manufacturer: 'Pfizer',
    ndc: '1234-5678-90',
    description: 'Cholesterol lowering medication'
  },
  '5432167890123': {
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    dosage: '5mg',
    manufacturer: 'Norvasc',
    ndc: '5432-1678-90',
    description: 'Calcium channel blocker for blood pressure'
  }
};

export async function lookupMedicationByBarcode(barcode: string): Promise<MedicationInfo | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Clean barcode - remove any prefixes/suffixes
  const cleanBarcode = barcode.replace(/[^0-9]/g, '');
  
  // Try exact match first
  if (MEDICATION_DATABASE[cleanBarcode]) {
    return MEDICATION_DATABASE[cleanBarcode];
  }
  
  // Try partial matches for different barcode formats
  for (const [dbBarcode, medication] of Object.entries(MEDICATION_DATABASE)) {
    if (dbBarcode.includes(cleanBarcode) || cleanBarcode.includes(dbBarcode)) {
      return medication;
    }
  }
  
  return null;
}

export async function searchMedicationsByName(query: string): Promise<MedicationInfo[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const searchTerm = query.toLowerCase();
  const results: MedicationInfo[] = [];
  
  for (const medication of Object.values(MEDICATION_DATABASE)) {
    if (
      medication.name.toLowerCase().includes(searchTerm) ||
      medication.genericName?.toLowerCase().includes(searchTerm)
    ) {
      results.push(medication);
    }
  }
  
  return results;
}

// Function to add a new medication to local storage
export function addCustomMedication(medication: Omit<MedicationInfo, 'ndc'>) {
  // In production, this would sync with backend
  const customKey = `custom_${Date.now()}`;
  MEDICATION_DATABASE[customKey] = {
    ...medication,
    ndc: `CUSTOM-${customKey}`
  };
}

export function getMedicationSuggestions(): MedicationInfo[] {
  return Object.values(MEDICATION_DATABASE);
}