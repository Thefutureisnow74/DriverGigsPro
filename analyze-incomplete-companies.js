import pg from 'pg';
import OpenAI from 'openai';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeIncompleteCompanies() {
  console.log('🔍 Analyzing authenticity of 200 incomplete companies...');
  
  // Get all incomplete companies
  const result = await pool.query(`
    SELECT id, name, service_vertical, average_pay, vehicle_types, 
           contact_phone, website, insurance_requirements, license_requirements, 
           areas_served, contract_type
    FROM companies 
    WHERE (is_active = true OR is_active IS NULL) 
    AND (year_established IS NULL OR year_established = '' 
         OR company_size IS NULL OR company_size = '' 
         OR headquarters IS NULL OR headquarters = '' 
         OR business_model IS NULL OR business_model = '')
    ORDER BY name
  `);
  
  console.log(`Found ${result.rows.length} incomplete companies to analyze`);
  
  let realCompanies = 0;
  let suspiciousCompanies = 0;
  let unknownCompanies = 0;
  const suspiciousList = [];
  
  for (const company of result.rows) {
    // Comprehensive authenticity assessment
    let authenticity = 'REAL';
    let suspicionScore = 0;
    const redFlags = [];
    
    // 1. Contact information check
    if (!company.website && !company.contact_phone) {
      suspicionScore += 25;
      redFlags.push('No contact information');
    }
    
    // 2. Pay rate analysis
    if (company.average_pay && company.average_pay.includes('$')) {
      const payMatch = company.average_pay.match(/\$(\d+)/);
      if (payMatch && parseInt(payMatch[1]) > 100) {
        suspicionScore += 40;
        redFlags.push(`Unrealistic pay: ${company.average_pay}`);
      }
    }
    
    // 3. Generic name patterns
    const genericTerms = ['Elite', 'Pro', 'VIP', 'Premium', 'Best', 'Top', 'Super', 'Max'];
    if (genericTerms.some(term => company.name.includes(term))) {
      suspicionScore += 15;
      redFlags.push('Generic promotional name');
    }
    
    // 4. Service vertical specificity
    if (!company.service_vertical || company.service_vertical === 'General') {
      suspicionScore += 10;
      redFlags.push('Vague service type');
    }
    
    // 5. Licensing inconsistencies
    if (company.license_requirements === 'None' && company.average_pay) {
      const payMatch = company.average_pay.match(/\$(\d+)/);
      if (payMatch && parseInt(payMatch[1]) > 50) {
        suspicionScore += 20;
        redFlags.push('High pay with no license requirements');
      }
    }
    
    // 6. Insurance inconsistencies
    if (company.insurance_requirements === 'No' && company.average_pay) {
      const payMatch = company.average_pay.match(/\$(\d+)/);
      if (payMatch && parseInt(payMatch[1]) > 30) {
        suspicionScore += 15;
        redFlags.push('No insurance for high-pay position');
      }
    }
    
    // Final assessment
    if (suspicionScore >= 50) {
      authenticity = 'SUSPICIOUS';
      suspiciousCompanies++;
      suspiciousList.push({
        name: company.name,
        score: suspicionScore,
        flags: redFlags
      });
    } else if (suspicionScore >= 25) {
      authenticity = 'QUESTIONABLE';
      unknownCompanies++;
    } else {
      realCompanies++;
    }
  }
  
  console.log('\n📊 AUTHENTICITY ANALYSIS RESULTS:');
  console.log('=================================');
  console.log(`Total incomplete companies analyzed: ${result.rows.length}`);
  console.log(`Likely real companies: ${realCompanies} (${Math.round(realCompanies/result.rows.length*100)}%)`);
  console.log(`Questionable companies: ${unknownCompanies} (${Math.round(unknownCompanies/result.rows.length*100)}%)`);
  console.log(`Suspicious companies: ${suspiciousCompanies} (${Math.round(suspiciousCompanies/result.rows.length*100)}%)`);
  
  if (suspiciousList.length > 0) {
    console.log('\n🚨 SUSPICIOUS COMPANIES (High Risk):');
    suspiciousList.slice(0, 10).forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} (Score: ${company.score})`);
      console.log(`   Red flags: ${company.flags.join(', ')}`);
    });
  }
  
  console.log('\n✅ CONCLUSION:');
  console.log(`Approximately ${realCompanies + unknownCompanies} companies (${Math.round((realCompanies + unknownCompanies)/result.rows.length*100)}%) appear to be legitimate businesses`);
  console.log(`${suspiciousCompanies} companies require further investigation or removal`);
  
  return {
    total: result.rows.length,
    real: realCompanies,
    questionable: unknownCompanies,
    suspicious: suspiciousCompanies,
    suspiciousList
  };
}

// AI-powered verification for suspicious companies
async function aiVerifyCompanies(suspiciousList) {
  console.log('\n🤖 AI-powered verification of suspicious companies...');
  
  for (const company of suspiciousList.slice(0, 5)) {
    try {
      const prompt = `Verify if this is a legitimate gig work company:

Company Name: ${company.name}
Red Flags: ${company.flags.join(', ')}

Based on your knowledge, is this a real company that offers gig work opportunities? 
Consider:
1. Does this company name match known legitimate businesses?
2. Are the red flags indicative of fraud or just incomplete data?
3. Does the company operate in the gig work/courier industry?

Respond with JSON:
{
  "isLegitimate": true/false,
  "confidence": 0-100,
  "reasoning": "explanation",
  "recommendation": "KEEP" or "REMOVE" or "INVESTIGATE"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a business verification expert. Analyze company legitimacy based on industry knowledge and red flags."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      console.log(`\n${company.name}:`);
      console.log(`  Legitimate: ${analysis.isLegitimate}`);
      console.log(`  Confidence: ${analysis.confidence}%`);
      console.log(`  Recommendation: ${analysis.recommendation}`);
      console.log(`  Reasoning: ${analysis.reasoning}`);
      
    } catch (error) {
      console.error(`AI analysis failed for ${company.name}:`, error.message);
    }
  }
}

async function main() {
  try {
    const results = await analyzeIncompleteCompanies();
    
    if (results.suspiciousList.length > 0) {
      await aiVerifyCompanies(results.suspiciousList);
    }
    
  } catch (error) {
    console.error('Analysis failed:', error);
  } finally {
    await pool.end();
  }
}

if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  main();
}

export { analyzeIncompleteCompanies, aiVerifyCompanies };