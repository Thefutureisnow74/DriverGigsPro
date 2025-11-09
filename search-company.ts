import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { companies } from './shared/schema';
import { like, or, ilike } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { companies } });

console.log('🔍 Searching for AnimalAid Transit and similar companies...');

async function searchCompanies() {
  try {
    // Search for AnimalAid, Animal Aid, or Transit companies
    const searchResults = await db.select().from(companies).where(
      or(
        ilike(companies.name, '%animal%aid%'),
        ilike(companies.name, '%animalaid%'),
        ilike(companies.name, '%animal aid%'),
        ilike(companies.name, '%transit%'),
        ilike(companies.serviceVertical, '%pet%')
      )
    );
    
    console.log(`\n📊 Search Results: Found ${searchResults.length} companies`);
    
    if (searchResults.length === 0) {
      console.log('✅ No "AnimalAid Transit" found in your database');
      console.log('✅ No suspicious pet transport companies found');
      return;
    }
    
    console.log('\n🚨 COMPANIES FOUND:');
    searchResults.forEach((company, index) => {
      console.log(`\n${index + 1}. ${company.name}`);
      console.log(`   Service: ${company.serviceVertical || 'Unknown'}`);
      console.log(`   Pay: ${company.averagePay || 'Not specified'}`);
      console.log(`   Website: ${company.website || 'No website'}`);
      console.log(`   Phone: ${company.phoneNumber || 'No phone'}`);
      console.log(`   Vehicle Types: ${company.vehicleTypes || 'Not specified'}`);
      console.log(`   Areas: ${company.areasServed || 'Not specified'}`);
      console.log(`   Insurance Required: ${company.insuranceRequired || 'Not specified'}`);
      console.log(`   License Required: ${company.licenseRequired || 'Not specified'}`);
      
      // Check for red flags
      const redFlags = [];
      if (!company.website && !company.phoneNumber) {
        redFlags.push('No contact information');
      }
      if (company.averagePay) {
        const payMatch = company.averagePay.match(/\$?(\d+)/);
        if (payMatch && parseInt(payMatch[1]) > 100) {
          redFlags.push('Unrealistic pay rate');
        }
      }
      
      if (redFlags.length > 0) {
        console.log(`   🚩 RED FLAGS: ${redFlags.join(', ')}`);
      }
    });
    
    // Check if AnimalAid Transit specifically exists
    const animalAidTransit = searchResults.find(c => 
      c.name.toLowerCase().includes('animalaid') && 
      c.name.toLowerCase().includes('transit')
    );
    
    if (animalAidTransit) {
      console.log('\n⚠️ ALERT: "AnimalAid Transit" found in your database!');
      console.log('This company should be investigated and likely removed.');
      return animalAidTransit;
    } else {
      console.log('\n✅ "AnimalAid Transit" is NOT in your database');
      console.log('Your fraud detection system successfully prevented this fake company from being added.');
    }
    
  } catch (error) {
    console.error('❌ Search failed:', error.message);
  }
}

searchCompanies().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Execution failed:', error);
  process.exit(1);
});