import fs from 'fs';
import pdfParse from 'pdf-parse';
import { db } from '../server/db';
import { companies } from '../shared/schema';

function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s]/g, '');
}

async function extractCompanyNamesFromPDF(): Promise<Set<string>> {
  const dataBuffer = fs.readFileSync('attached_assets/Driver Gig Complete List_1761842839616.pdf');
  const pdfData = await pdfParse(dataBuffer);
  const lines = pdfData.text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const companyNames = new Set<string>();
  
  // Find all "Contract Type:" entries and extract the line before it
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('Contract Type:')) {
      // Look back for the company name
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        const line = lines[j].trim();
        
        // Skip junk
        if (!line ||
            /^\d+$/.test(line) ||
            line.match(/^\d+\/\d+$/) ||
            line.includes('10/30/25') ||
            line.includes('Driver Gigs Pro') ||
            line.includes(' Companies') ||
            line.includes('Level ') ||
            line.includes('📊')) {
          continue;
        }
        
        // Found a potential company name
        if (line.length > 1 && line.length < 100) {
          companyNames.add(line);
          break;
        }
      }
    }
  }
  
  return companyNames;
}

async function compareToDatabase() {
  console.log('📊 Comparing PDF companies to database...\n');
  
  // Get all names from PDF
  const pdfNames = await extractCompanyNamesFromPDF();
  console.log(`Found ${pdfNames.size} company entries in PDF`);
  
  // Get all names from database
  const dbCompanies = await db.select().from(companies);
  const dbNames = new Set(dbCompanies.map(c => c.name));
  console.log(`Found ${dbCompanies.length} companies in database\n`);
  
  // Find exact matches
  const exactMatches: string[] = [];
  const missing: string[] = [];
  
  for (const pdfName of Array.from(pdfNames)) {
    if (dbNames.has(pdfName)) {
      exactMatches.push(pdfName);
    } else {
      // Check for normalized match
      const normalizedPdf = normalizeName(pdfName);
      const foundMatch = dbCompanies.find(c => normalizeName(c.name) === normalizedPdf);
      
      if (foundMatch) {
        exactMatches.push(pdfName);
      } else {
        missing.push(pdfName);
      }
    }
  }
  
  console.log(`✅ Exact matches: ${exactMatches.length}`);
  console.log(`❌ Missing from database: ${missing.length}\n`);
  
  // Filter out obvious junk from missing list
  const validMissing = missing.filter(name => {
    const lower = name.toLowerCase();
    const isJunk = 
      name.split(',').length > 3 ||  // Lots of commas (vehicle lists)
      name.endsWith('.') ||  // Ends with period (fragments)
      name.includes('service.') ||
      name.includes('/') ||  // URLs
      lower.includes('managing') ||
      lower.includes('compliance') ||
      lower.includes('provides') ||
      lower.includes('dedicated') ||
      lower.includes('same-day delivery') ||
      lower.includes('final mile') ||
      (name.split(',').length >= 2 && (lower.includes('van') || lower.includes('truck')));
    
    return !isJunk;
  });
  
  console.log('🎯 Valid missing companies (filtered junk):');
  console.log(`Found ${validMissing.length} valid missing companies\n`);
  
  if (validMissing.length > 0) {
    validMissing.sort().forEach((name, i) => {
      console.log(`${i + 1}. ${name}`);
    });
  }
  
  // Also show junk entries for reference
  const junkEntries = missing.filter(name => !validMissing.includes(name));
  if (junkEntries.length > 0) {
    console.log(`\n📝 Junk entries (${junkEntries.length}):`);
    junkEntries.slice(0, 20).forEach(name => console.log(`   - ${name}`));
  }
}

// Run the comparison
compareToDatabase()
  .then(() => {
    console.log('\n✅ Comparison complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
