import { readFileSync } from 'fs';
import { db } from './db';
import { companies } from '../shared/schema';

interface CompanyRow {
  name: string;
  vehicleTypes: string[];
  averagePay: string;
  serviceVertical: string;
  contractType: string;
  areasServed: string[];
  insuranceRequirements: string;
  licenseRequirements: string;
  certificationsRequired: string[];
}

function parseCompanyData(): CompanyRow[] {
  const filePath = './attached_assets/Pasted-AirSpace-Car-SUV-Van-Cargo-Van-25-45-hr-Time-Critical-Air-Freight-Medical-Courier-Independent-1751034081760_1751034081761.txt';
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  const companies: CompanyRow[] = [];
  
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length >= 8) {
      const [
        name,
        vehicleTypesStr,
        averagePay,
        serviceVertical,
        contractType,
        areasServedStr,
        insuranceRequirements,
        licenseRequirements,
        certificationsStr = ''
      ] = parts;
      
      // Parse vehicle types
      const vehicleTypes = vehicleTypesStr.split(',').map(v => v.trim());
      
      // Parse areas served  
      const areasServed = areasServedStr.split(',').map(a => a.trim());
      
      // Parse certifications
      const certificationsRequired = certificationsStr ? 
        certificationsStr.split(',').map(c => c.trim()) : [];
      
      companies.push({
        name: name.trim(),
        vehicleTypes,
        averagePay: averagePay.trim(),
        serviceVertical: serviceVertical.trim(),
        contractType: contractType.trim(),
        areasServed,
        insuranceRequirements: insuranceRequirements.trim(),
        licenseRequirements: licenseRequirements.trim(),
        certificationsRequired
      });
    }
  }
  
  return companies;
}

async function importCompanies() {
  try {
    console.log('Starting company import...');
    
    const companyData = parseCompanyData();
    console.log(`Parsed ${companyData.length} companies`);
    
    // Insert companies in batches
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < companyData.length; i += batchSize) {
      const batch = companyData.slice(i, i + batchSize);
      
      await db.insert(companies).values(batch.map(company => ({
        name: company.name,
        vehicleTypes: company.vehicleTypes,
        averagePay: company.averagePay,
        serviceVertical: company.serviceVertical,
        contractType: company.contractType,
        areasServed: company.areasServed,
        insuranceRequirements: company.insuranceRequirements,
        licenseRequirements: company.licenseRequirements,
        certificationsRequired: company.certificationsRequired,
        isActive: true
      })));
      
      imported += batch.length;
      console.log(`Imported ${imported}/${companyData.length} companies`);
    }
    
    console.log('Company import completed successfully!');
    
  } catch (error) {
    console.error('Error importing companies:', error);
    throw error;
  }
}

// Export the function for potential reuse
// To run: npx tsx server/import-companies.ts

export { importCompanies };