import fs from 'fs';
import pdfParse from 'pdf-parse';
import { db } from '../server/db';
import { companies } from '../shared/schema';

interface CompanyData {
  name: string;
  contractType: string;
  vehicleRequirements: string;
  payInformation: string;
  website: string;
  description?: string;
  level?: string;
}

async function extractPDFText(): Promise<string[]> {
  const dataBuffer = fs.readFileSync('attached_assets/Driver Gig Complete List_1761842839616.pdf');
  const pdfData = await pdfParse(dataBuffer);
  const lines = pdfData.text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  return lines;
}

function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s]/g, '');
}

async function parsePDFContent(): Promise<CompanyData[]> {
  const lines = await extractPDFText();
  
  const companiesList: CompanyData[] = [];
  let currentLevel = '';
  
  // New approach: Find all "Contract Type:" lines and work backwards
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track level sections
    if (line.includes('Level 1 - Entry:') || line.includes('Instant Sign-Up Apps')) {
      currentLevel = 'Entry';
      continue;
    } else if (line.includes('Level 2 - Growth:') || line.includes('Contract-Based Companies')) {
      currentLevel = 'Growth';
      continue;
    } else if (line.includes('Level 3 - Scale:') || line.includes('Load Boards')) {
      currentLevel = 'Scale';
      continue;
    } else if (line.includes('Level 4 - Professional:') || line.includes('TMS Platforms')) {
      currentLevel = 'Professional';
      continue;
    } else if (line.includes('Other/Specialized')) {
      currentLevel = 'Other';
      continue;
    }
    
    // When we find "Contract Type:", we know we have a company
    if (line.startsWith('Contract Type:')) {
      const company: Partial<CompanyData> = {
        contractType: line.replace('Contract Type:', '').trim(),
        level: currentLevel
      };
      
      // Look ahead for other fields
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const nextLine = lines[j];
        
        if (nextLine.startsWith('Vehicle Requirements:')) {
          company.vehicleRequirements = nextLine.replace('Vehicle Requirements:', '').trim();
        } else if (nextLine.startsWith('Pay Information:')) {
          company.payInformation = nextLine.replace('Pay Information:', '').trim();
        } else if (nextLine.startsWith('Website:')) {
          company.website = nextLine.replace('Website:', '').trim();
          break; // Website is the last field
        }
      }
      
      // Find company name - the line IMMEDIATELY before "Contract Type:"
      // Skip backwards past junk lines to find the actual company name
      let companyName = '';
      let description = '';
      
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        const prevLine = lines[j].trim();
        
        // Skip completely empty lines
        if (!prevLine) continue;
        
        // Skip obvious junk
        if (/^\d+$/.test(prevLine) ||  // Just a number
            prevLine.match(/^\d+\/\d+$/) ||  // Page numbers like "5/177"
            prevLine.includes('10/30/25') ||  // Date stamp
            prevLine.includes('Driver Gigs Pro') ||
            prevLine.includes('📊')) {
          continue;
        }
        
        // Skip section headers
        if (prevLine.includes(' Companies') ||
            prevLine.includes('Level 1') ||
            prevLine.includes('Level 2') ||
            prevLine.includes('Level 3') ||
            prevLine.includes('Level 4') ||
            prevLine.includes('Instant Sign-Up') ||
            prevLine.includes('Contract-Based') ||
            prevLine.includes('Load Boards') ||
            prevLine.includes('TMS Platforms') ||
            prevLine.includes('Other/Specialized') ||
            prevLine.startsWith('Find your own') ||
            prevLine.startsWith('Gig apps for')) {
          continue;
        }
        
        // Skip URL fragments
        if (prevLine.includes('/') && (prevLine.includes('.html') || prevLine.includes('services'))) {
          continue;
        }
        
        // Skip vehicle lists (lines that are just comma-separated vehicle types)
        const lowerLine = prevLine.toLowerCase();
        const vehicleKeywords = ['van', 'truck', 'suv', 'car', 'cargo', 'sprinter', 'box', 'trailer', 'pickup'];
        const hasVehicleKeyword = vehicleKeywords.some(v => lowerLine.includes(v));
        const hasMultipleCommas = prevLine.split(',').length >= 3;
        if (hasVehicleKeyword && hasMultipleCommas) {
          description = prevLine + (description ? ' ' + description : '');
          continue;
        }
        
        // Skip description lines
        if (prevLine.includes('service.') || 
            prevLine.includes('Contract type:') ||
            prevLine.includes('. Vehicles:')) {
          description = prevLine + (description ? ' ' + description : '');
          continue;
        }
        
        // This should be the company name
        if (prevLine.length > 1 && prevLine.length < 100) {
          companyName = prevLine;
          break;
        }
      }
      
      // Only add if we found a company name
      if (companyName) {
        companiesList.push({
          name: companyName,
          contractType: company.contractType || 'Independent Contractor',
          vehicleRequirements: company.vehicleRequirements || 'Varies',
          payInformation: company.payInformation || 'Varies',
          website: company.website || '',
          description: description || '',
          level: currentLevel
        });
      }
    }
  }
  
  console.log(`📊 Parsed ${companiesList.length} companies from PDF`);
  return companiesList;
}

function mapServiceVertical(description: string, level: string, contractType: string): string[] {
  const verticals: string[] = [];
  const text = description.toLowerCase();
  
  // Service type detection from description
  if (text.includes('medical') || text.includes('pharmaceutical') || text.includes('specimen') || text.includes('healthcare')) {
    verticals.push('Medical Transport');
  }
  if (text.includes('food') || text.includes('restaurant') || text.includes('grocery') || text.includes('meal')) {
    verticals.push('Food Delivery');
  }
  if (text.includes('package') || text.includes('parcel') || text.includes('courier') || text.includes('delivery service')) {
    verticals.push('Package Delivery');
  }
  if (text.includes('freight') || text.includes('cargo') || text.includes('trucking')) {
    verticals.push('Freight');
  }
  if (text.includes('pet') || text.includes('animal')) {
    verticals.push('Pet Transport');
  }
  if (text.includes('rideshare') || text.includes('passenger') || text.includes('ride')) {
    verticals.push('Rideshare');
  }
  if (text.includes('luggage') || text.includes('baggage')) {
    verticals.push('Luggage');
  }
  if (text.includes('vehicle transport') || text.includes('car carrier') || text.includes('auto driveaway')) {
    verticals.push('Vehicle Transport');
  }
  if (text.includes('construction') || text.includes('parts') || text.includes('materials')) {
    verticals.push('Construction/Parts');
  }
  
  // Level-based categorization
  if (level === 'Scale') {
    verticals.push('Load Boards');
  }
  if (level === 'Professional') {
    verticals.push('TMS Platforms');
  }
  
  // Default if no match
  if (verticals.length === 0) {
    if (level === 'Entry') {
      verticals.push('Gig Apps');
    } else {
      verticals.push('Package Delivery');
    }
  }
  
  return verticals;
}

function parseVehicleTypes(vehicleReq: string): string[] {
  const types: string[] = [];
  const text = vehicleReq.toLowerCase();
  
  if (text.includes('car') && !text.includes('cargo')) types.push('Car');
  if (text.includes('suv')) types.push('SUV');
  if (text.includes('van') || text.includes('cargo van') || text.includes('sprinter') || text.includes('mini-van') || text.includes('minivan')) types.push('Van');
  if (text.includes('truck') || text.includes('pickup') || text.includes('pick-up')) types.push('Truck');
  if (text.includes('box truck')) types.push('Box Truck');
  if (text.includes('bike') || text.includes('bicycle')) types.push('Bicycle');
  if (text.includes('scooter') || text.includes('motorcycle')) types.push('Scooter');
  if (text.includes('walk')) types.push('Walking');
  if (text.includes('rv')) types.push('RV');
  if (text.includes('flatbed')) types.push('Flatbed');
  if (text.includes('semi')) types.push('Semi Truck');
  
  return types.length > 0 ? types : ['Car'];
}

async function importCompanies(dryRun: boolean = false) {
  console.log(`🚀 Starting company import from PDF... (${dryRun ? 'DRY RUN' : 'LIVE'})`);
  
  try {
    // Parse PDF
    console.log('📄 Parsing PDF content...');
    const parsedCompanies = await parsePDFContent();
    
    if (parsedCompanies.length === 0) {
      console.error('❌ No companies parsed from PDF! Check the parsing logic.');
      return;
    }
    
    console.log(`✅ Parsed ${parsedCompanies.length} companies from PDF`);
    
    // Expected count validation
    if (parsedCompanies.length < 700) {
      console.warn(`⚠️  Warning: Expected ~711 companies but only found ${parsedCompanies.length}`);
    }
    
    // Get existing companies to avoid duplicates
    console.log('🔍 Checking existing companies...');
    const existingCompanies = await db.select().from(companies);
    const existingNormalized = new Map(
      existingCompanies.map(c => [normalizeName(c.name), c.name])
    );
    console.log(`📊 Found ${existingCompanies.length} existing companies in database`);
    
    // Filter out duplicates (both against existing DB and within the parsed batch)
    const newCompanies: CompanyData[] = [];
    const duplicates: string[] = [];
    const seenInBatch = new Set<string>();
    
    for (const company of parsedCompanies) {
      const normalized = normalizeName(company.name);
      
      // Check against existing database
      if (existingNormalized.has(normalized)) {
        duplicates.push(`${company.name} (matches DB: ${existingNormalized.get(normalized)})`);
      }
      // Check against other companies in this batch
      else if (seenInBatch.has(normalized)) {
        duplicates.push(`${company.name} (duplicate within PDF)`);
      }
      else {
        newCompanies.push(company);
        seenInBatch.add(normalized);
      }
    }
    
    console.log(`🆕 Found ${newCompanies.length} new companies to import`);
    console.log(`🔁 Found ${duplicates.length} duplicates (will skip)`);
    
    if (duplicates.length > 0 && duplicates.length < 20) {
      console.log('\nSample duplicates:');
      duplicates.slice(0, 10).forEach(d => console.log(`   - ${d}`));
    }
    
    if (dryRun) {
      console.log('\n📋 DRY RUN - Sample of companies to be imported:');
      newCompanies.slice(0, 10).forEach(c => {
        console.log(`   - ${c.name}`);
        console.log(`     Contract: ${c.contractType}`);
        console.log(`     Vehicles: ${c.vehicleRequirements}`);
        console.log(`     Pay: ${c.payInformation}`);
        console.log(`     Level: ${c.level}`);
        console.log('');
      });
      console.log(`\n✅ DRY RUN complete. ${newCompanies.length} companies would be imported.`);
      return;
    }
    
    // Import companies
    let imported = 0;
    let skipped = 0;
    
    for (const company of newCompanies) {
      try {
        const serviceVerticals = mapServiceVertical(
          company.description || '',
          company.level || '',
          company.contractType
        );
        const vehicleTypes = parseVehicleTypes(company.vehicleRequirements);
        
        await db.insert(companies).values({
          name: company.name,
          contractType: company.contractType || 'Independent Contractor',
          vehicleTypes: vehicleTypes,
          averagePay: company.payInformation,
          serviceVertical: serviceVerticals,
          areasServed: [],
          website: company.website || '',
          description: company.description || `${company.level || 'Driver'} opportunity - ${company.contractType}`,
          isActive: true,
        });
        
        imported++;
        if (imported % 100 === 0) {
          console.log(`   ⏳ Imported ${imported}/${newCompanies.length} companies...`);
        }
      } catch (error) {
        console.error(`   ❌ Error importing ${company.name}:`, error);
        skipped++;
      }
    }
    
    console.log('\n✅ Import complete!');
    console.log(`   📈 Imported: ${imported} companies`);
    console.log(`   ⏭️  Skipped: ${skipped} companies (errors)`);
    console.log(`   🔁 Duplicates: ${duplicates.length} companies`);
    console.log(`   📊 Total in database: ${existingCompanies.length + imported} companies`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

// Check if running in dry-run mode
const dryRun = process.argv.includes('--dry-run');

// Run the import
importCompanies(dryRun)
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
