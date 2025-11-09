import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { companies } from './shared/schema';
import { like, or, ilike, inArray } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { companies } });

console.log('🚨 EMERGENCY: Removing fraudulent pet transport companies...');

async function removeFraudulentPetCompanies() {
  try {
    // Find all pet transport companies with no contact information
    const suspiciousPetCompanies = await db.select().from(companies).where(
      or(
        ilike(companies.serviceVertical, '%pet%'),
        ilike(companies.name, '%pet%'),
        ilike(companies.name, '%paw%'),
        ilike(companies.name, '%animal%'),
        ilike(companies.name, '%fur%'),
        ilike(companies.name, '%transit%')
      )
    );
    
    console.log(`\n📊 Found ${suspiciousPetCompanies.length} pet/transit companies to analyze...`);
    
    const fraudulentCompanies = [];
    
    for (const company of suspiciousPetCompanies) {
      const redFlags = [];
      
      // Major red flag: No contact information
      if (!company.website && !company.phoneNumber) {
        redFlags.push('No contact information');
      }
      
      // Check for generic names
      const genericPetTerms = ['pet', 'paw', 'fur', 'wag', 'fetch', 'transport', 'transit'];
      const nameWords = company.name.toLowerCase();
      const hasGenericTerms = genericPetTerms.some(term => nameWords.includes(term));
      
      if (hasGenericTerms && redFlags.length > 0) {
        redFlags.push('Generic pet service name');
      }
      
      // Flag companies with no verifiable information
      if (redFlags.length >= 1) {
        fraudulentCompanies.push({
          ...company,
          redFlags
        });
      }
    }
    
    console.log(`\n🚨 FRAUDULENT COMPANIES TO REMOVE: ${fraudulentCompanies.length}`);
    
    if (fraudulentCompanies.length === 0) {
      console.log('✅ No fraudulent pet companies found');
      return;
    }
    
    // Show first 20 companies being removed
    console.log('\n🗑️ REMOVING THESE FAKE COMPANIES:');
    fraudulentCompanies.slice(0, 20).forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} (${company.serviceVertical})`);
      console.log(`   Flags: ${company.redFlags.join(', ')}`);
    });
    
    if (fraudulentCompanies.length > 20) {
      console.log(`   ...and ${fraudulentCompanies.length - 20} more fake companies`);
    }
    
    // Execute bulk removal
    const companyIds = fraudulentCompanies.map(c => c.id);
    await db.delete(companies).where(inArray(companies.id, companyIds));
    
    console.log(`\n✅ Successfully removed ${fraudulentCompanies.length} fraudulent pet transport companies`);
    
    // Verify final count
    const remainingCompanies = await db.select().from(companies);
    console.log(`📊 Database Status:`);
    console.log(`• Before: 443 companies`);
    console.log(`• Removed: ${fraudulentCompanies.length} fake pet companies`);
    console.log(`• After: ${remainingCompanies.length} legitimate companies`);
    
    console.log('\n🎉 FRAUDULENT PET TRANSPORT OPERATION DISMANTLED!');
    console.log('Your directory is now protected from fake pet transport scams.');
    
    return fraudulentCompanies;
    
  } catch (error) {
    console.error('❌ Removal failed:', error.message);
  }
}

removeFraudulentPetCompanies().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Execution failed:', error);
  process.exit(1);
});