import pg from 'pg';
import OpenAI from 'openai';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fraud detection criteria
function analyzeFraudRisk(company) {
  const riskFactors = [];
  let riskScore = 0;
  
  // 1. Unrealistic pay rates (>$100/hour)
  if (company.averagePay && company.averagePay.includes('$')) {
    const payMatch = company.averagePay.match(/\$(\d+)/);
    if (payMatch && parseInt(payMatch[1]) > 100) {
      riskFactors.push('Unrealistic pay rate (>$100/hour)');
      riskScore += 30;
    }
  }
  
  // 2. Missing contact information
  if (!company.website && !company.contactPhone && !company.contactEmail) {
    riskFactors.push('No contact information available');
    riskScore += 25;
  }
  
  // 3. Generic/promotional names
  const suspiciousNames = ['Best', 'Top', 'Premium', 'Elite', 'VIP', 'Pro', 'Max', 'Super'];
  if (suspiciousNames.some(word => company.name.includes(word))) {
    riskFactors.push('Generic promotional name');
    riskScore += 15;
  }
  
  // 4. Suspicious licensing requirements
  if (company.licenseRequirements && company.licenseRequirements.includes('None')) {
    if (company.averagePay && company.averagePay.includes('$')) {
      const payMatch = company.averagePay.match(/\$(\d+)/);
      if (payMatch && parseInt(payMatch[1]) > 50) {
        riskFactors.push('High pay with no license requirements');
        riskScore += 20;
      }
    }
  }
  
  // 5. Minimal insurance for high-pay positions
  if (company.insuranceRequirements === 'No' && company.averagePay) {
    const payMatch = company.averagePay.match(/\$(\d+)/);
    if (payMatch && parseInt(payMatch[1]) > 30) {
      riskFactors.push('No insurance required for high-pay position');
      riskScore += 20;
    }
  }
  
  // 6. Obviously fake names
  const fakePatterns = ['gggggg', 'pppppp', 'uuuuu', 'test', 'fake', 'dummy'];
  if (fakePatterns.some(pattern => company.name.toLowerCase().includes(pattern))) {
    riskFactors.push('Obviously fake company name');
    riskScore += 50;
  }
  
  return {
    riskScore,
    riskFactors,
    riskLevel: riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MEDIUM' : 'LOW'
  };
}

async function detectFakeCompanies() {
  console.log('🔍 Starting comprehensive fraud detection...');
  
  const result = await pool.query('SELECT * FROM companies WHERE is_active = true OR is_active IS NULL');
  const companies = result.rows;
  
  console.log(`Analyzing ${companies.length} companies for fraud indicators...`);
  
  const suspiciousCompanies = [];
  const highRiskCompanies = [];
  
  for (const company of companies) {
    const analysis = analyzeFraudRisk(company);
    
    if (analysis.riskLevel === 'HIGH') {
      highRiskCompanies.push({
        ...company,
        analysis
      });
    } else if (analysis.riskLevel === 'MEDIUM') {
      suspiciousCompanies.push({
        ...company,
        analysis
      });
    }
  }
  
  console.log(`\n🚨 FRAUD DETECTION RESULTS:`);
  console.log(`High Risk Companies: ${highRiskCompanies.length}`);
  console.log(`Medium Risk Companies: ${suspiciousCompanies.length}`);
  console.log(`Total Flagged: ${highRiskCompanies.length + suspiciousCompanies.length}`);
  
  if (highRiskCompanies.length > 0) {
    console.log('\n⚠️  HIGH RISK COMPANIES:');
    for (const company of highRiskCompanies.slice(0, 10)) {
      console.log(`- ${company.name} (Score: ${company.analysis.riskScore})`);
      console.log(`  Risk factors: ${company.analysis.riskFactors.join(', ')}`);
    }
  }
  
  return {
    totalCompanies: companies.length,
    highRisk: highRiskCompanies.length,
    mediumRisk: suspiciousCompanies.length,
    highRiskCompanies,
    suspiciousCompanies
  };
}

// AI-powered fraud analysis using OpenAI
async function aiAnalyzeFraud(company) {
  try {
    const prompt = `Analyze this gig work company for potential fraud indicators:

Company: ${company.name}
Service Vertical: ${company.serviceVertical}
Average Pay: ${company.averagePay}
Vehicle Types: ${company.vehicleTypes}
Contract Type: ${company.contractType}
Areas Served: ${company.areasServed}
Insurance Required: ${company.insuranceRequirements}
License Required: ${company.licenseRequirements}
Website: ${company.website || 'Not provided'}
Phone: ${company.contactPhone || 'Not provided'}

Based on gig work industry standards, analyze for fraud indicators:
1. Unrealistic pay rates (>$80/hour for standard gig work)
2. Missing essential contact information
3. Suspicious licensing/insurance requirements
4. Generic or fake-sounding company names
5. Inconsistent service offerings

Return assessment as JSON with:
- fraudRisk: "HIGH", "MEDIUM", or "LOW"
- confidence: 0-100
- redFlags: array of specific concerns
- legitimacyScore: 0-100 (0=definitely fake, 100=definitely legitimate)`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a fraud detection expert specializing in gig work companies. Analyze companies for legitimacy based on industry standards and red flags."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error(`AI analysis failed for ${company.name}:`, error);
    return {
      fraudRisk: "UNKNOWN",
      confidence: 0,
      redFlags: ["Analysis failed"],
      legitimacyScore: 50
    };
  }
}

async function removeHighRiskCompanies() {
  console.log('🗑️ Starting removal of high-risk fake companies...');
  
  const fraudResults = await detectFakeCompanies();
  const toRemove = fraudResults.highRiskCompanies.filter(
    company => company.analysis.riskScore >= 70 // Very high confidence
  );
  
  console.log(`Found ${toRemove.length} companies to remove (risk score >= 70)`);
  
  if (toRemove.length > 0) {
    // Soft delete by setting isActive = false
    const companyIds = toRemove.map(company => company.id);
    await pool.query(
      'UPDATE companies SET is_active = false WHERE id = ANY($1)',
      [companyIds]
    );
    
    console.log(`✅ Removed ${toRemove.length} high-risk companies:`);
    toRemove.forEach(company => {
      console.log(`- ${company.name} (Score: ${company.analysis.riskScore})`);
    });
  }
  
  return toRemove.length;
}

// Main execution
async function main() {
  console.log('🤖 GigBot Fraud Detection System Starting...');
  
  try {
    // Run fraud detection
    const results = await detectFakeCompanies();
    
    // Run AI analysis on high-risk companies
    console.log('\n🧠 Running AI fraud analysis on high-risk companies...');
    for (const company of results.highRiskCompanies.slice(0, 5)) {
      const aiAnalysis = await aiAnalyzeFraud(company);
      console.log(`\nAI Analysis for ${company.name}:`);
      console.log(`  Fraud Risk: ${aiAnalysis.fraudRisk}`);
      console.log(`  Legitimacy Score: ${aiAnalysis.legitimacyScore}%`);
      console.log(`  Red Flags: ${aiAnalysis.redFlags.join(', ')}`);
    }
    
    // Remove obviously fake companies
    const removedCount = await removeHighRiskCompanies();
    
    console.log('\n✅ Fraud detection completed successfully!');
    console.log(`📊 Final Results:`);
    console.log(`- Total companies analyzed: ${results.totalCompanies}`);
    console.log(`- High risk detected: ${results.highRisk}`);
    console.log(`- Medium risk detected: ${results.mediumRisk}`);
    console.log(`- Companies removed: ${removedCount}`);
    
  } catch (error) {
    console.error('Error in fraud detection:', error);
  } finally {
    await pool.end();
  }
}

if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  main();
}

export { detectFakeCompanies, aiAnalyzeFraud, removeHighRiskCompanies };