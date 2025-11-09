// Bulk removal execution using ES modules
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { companies } from './shared/schema.js';
import { inArray } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { companies } });

console.log('🔍 Analyzing companies for fraud indicators...');

// Fraud detection algorithm (replicated from routes.ts)
async function detectFakeCompanies() {
  const allCompanies = await db.select().from(companies);
  console.log(`📊 Total companies to analyze: ${allCompanies.length}`);
  
  const suspiciousCompanies = [];
  
  for (const company of allCompanies) {
    const redFlags = [];
    let riskScore = 0;
    
    // Check for unrealistic pay rates
    if (company.averagePay) {
      const payMatch = company.averagePay.match(/\$?(\d+)/);
      if (payMatch) {
        const payAmount = parseInt(payMatch[1]);
        if (payAmount > 100) {
          redFlags.push(`Unrealistic pay rate: ${company.averagePay}`);
          riskScore += 30;
        }
        if (payAmount > 150) {
          redFlags.push(`Extremely high pay rate: ${company.averagePay}`);
          riskScore += 20;
        }
      }
    }
    
    // Check for missing contact information
    if (!company.website && !company.phoneNumber) {
      redFlags.push('No contact information available');
      riskScore += 15;
    }
    
    // Check for generic promotional names
    const genericTerms = ['easy', 'fast', 'quick', 'instant', 'guarantee', 'make money', 'earn now'];
    const nameWords = company.name.toLowerCase().split(/\s+/);
    const hasGenericTerms = genericTerms.some(term => 
      nameWords.some(word => word.includes(term))
    );
    if (hasGenericTerms) {
      redFlags.push('Generic promotional company name');
      riskScore += 10;
    }
    
    // Check for suspicious licensing requirements
    if (company.licenseRequired && company.licenseRequired.includes('None')) {
      const payMatch = company.averagePay?.match(/\$?(\d+)/);
      if (payMatch && parseInt(payMatch[1]) > 50) {
        redFlags.push('No license required for high-paying position');
        riskScore += 15;
      }
    }
    
    // Check for minimal insurance requirements with high pay
    if (company.insuranceRequired && company.insuranceRequired.toLowerCase().includes('none')) {
      const payMatch = company.averagePay?.match(/\$?(\d+)/);
      if (payMatch && parseInt(payMatch[1]) > 40) {
        redFlags.push('No insurance required for high-paying position');
        riskScore += 20;
      }
    }
    
    // Flag as suspicious if risk score is high enough
    if (riskScore >= 25 || redFlags.length >= 2) {
      suspiciousCompanies.push({
        ...company,
        redFlags,
        riskScore,
        riskLevel: riskScore >= 50 ? 'HIGH' : 'MEDIUM'
      });
    }
  }
  
  return {
    totalCompanies: allCompanies.length,
    suspiciousCompanies,
    highRiskCompanies: suspiciousCompanies.filter(c => c.riskLevel === 'HIGH'),
    mediumRiskCompanies: suspiciousCompanies.filter(c => c.riskLevel === 'MEDIUM')
  };
}

// Execute removal
async function executeRemoval() {
  try {
    const fakeResults = await detectFakeCompanies();
    const { suspiciousCompanies } = fakeResults;
    
    console.log(`📈 Analysis Results:`);
    console.log(`• Total Companies: ${fakeResults.totalCompanies}`);
    console.log(`• Suspicious Companies: ${suspiciousCompanies.length}`);
    console.log(`• High Risk: ${fakeResults.highRiskCompanies.length}`);
    console.log(`• Medium Risk: ${fakeResults.mediumRiskCompanies.length}`);
    console.log(`• Fraud Rate: ${Math.round((suspiciousCompanies.length / fakeResults.totalCompanies) * 100)}%`);
    
    if (suspiciousCompanies.length === 0) {
      console.log('✅ No fake companies found to remove');
      return;
    }
    
    console.log('\n🚨 SUSPICIOUS COMPANIES TO REMOVE:');
    suspiciousCompanies.slice(0, 15).forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} (${company.serviceVertical || 'Unknown'})`);
      console.log(`   Pay: ${company.averagePay || 'N/A'}`);
      console.log(`   Risk: ${company.riskLevel} (Score: ${company.riskScore})`);
      console.log(`   Flags: ${company.redFlags.slice(0, 2).join(', ')}`);
    });
    
    if (suspiciousCompanies.length > 15) {
      console.log(`   ...and ${suspiciousCompanies.length - 15} more suspicious companies`);
    }
    
    // Execute bulk deletion
    console.log(`\n🗑️ Removing ${suspiciousCompanies.length} suspicious companies...`);
    const companyIds = suspiciousCompanies.map(c => c.id);
    
    const result = await db.delete(companies).where(inArray(companies.id, companyIds));
    
    console.log(`✅ Successfully removed ${suspiciousCompanies.length} fake companies`);
    
    // Verify removal
    const remainingCompanies = await db.select().from(companies);
    console.log(`📊 Database cleanup complete:`);
    console.log(`• Before: ${fakeResults.totalCompanies} companies`);
    console.log(`• Removed: ${suspiciousCompanies.length} suspicious companies`);
    console.log(`• After: ${remainingCompanies.length} legitimate companies`);
    console.log(`• Data Quality Improved: ${Math.round((suspiciousCompanies.length / fakeResults.totalCompanies) * 100)}% of suspicious entries removed`);
    
    return {
      success: true,
      removedCount: suspiciousCompanies.length,
      remainingCount: remainingCompanies.length,
      fraudRate: Math.round((suspiciousCompanies.length / fakeResults.totalCompanies) * 100)
    };
    
  } catch (error) {
    console.error('❌ Removal failed:', error.message);
    return { success: false, error: error.message };
  }
}

executeRemoval().then(result => {
  if (result?.success) {
    console.log('\n🎉 FAKE COMPANY REMOVAL COMPLETE!');
    console.log('Your Driver Gig Opportunities directory is now clean.');
  }
  process.exit(0);
}).catch(error => {
  console.error('❌ Execution failed:', error);
  process.exit(1);
});