import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import pdfParse from 'pdf-parse';

interface CompanyData {
  name: string;
  website: string | null;
  contractType: string;
  vehicles: string[];
  pay: string | null;
  description: string | null;
  serviceVertical: string[];
  level: string;
}

// Map service descriptions to service vertical categories
function mapServiceVertical(description: string, companyName: string): string[] {
  const lower = description.toLowerCase();
  const verticals: Set<string> = new Set();
  
  if (lower.includes('medical') || lower.includes('pharmaceutical') || lower.includes('hospital') || 
      lower.includes('lab') || lower.includes('specimen') || lower.includes('pharmacy') ||
      companyName.toLowerCase().includes('medical') || companyName.toLowerCase().includes('pharmacy')) {
    verticals.add('Medical');
  }
  if (lower.includes('package delivery') || lower.includes('parcel')) {
    verticals.add('Package Delivery');
  }
  if (lower.includes('freight') || lower.includes('cargo') || lower.includes('trucking')) {
    verticals.add('Freight');
  }
  if (lower.includes('food') || lower.includes('restaurant') || lower.includes('meal') || lower.includes('grocery')) {
    verticals.add('Food Delivery');
  }
  if (lower.includes('pet') || lower.includes('animal')) {
    verticals.add('Pet Transport');
  }
  if (lower.includes('rideshare') || lower.includes('passenger') || lower.includes('ride')) {
    verticals.add('Rideshare');
  }
  if (lower.includes('luggage') || lower.includes('baggage')) {
    verticals.add('Luggage Delivery');
  }
  if (lower.includes('vehicle transport') || lower.includes('car carrier') || lower.includes('auto')) {
    verticals.add('Vehicle Transport');
  }
  if (lower.includes('junk removal') || lower.includes('moving')) {
    verticals.add('Junk Removal');
  }
  if (lower.includes('government') || lower.includes('contract')) {
    verticals.add('Government Contracts');
  }
  if (lower.includes('logistics')) {
    verticals.add('Logistics Services');
  }
  
  if (verticals.size === 0) {
    verticals.add('Other');
  }
  
  return Array.from(verticals);
}

// Parse vehicle types from text
function parseVehicles(vehiclesText: string): string[] {
  if (!vehiclesText || vehiclesText.trim() === '') return [];
  
  const vehicles = vehiclesText.split(',').map(v => v.trim()).filter(v => v.length > 0);
  return vehicles;
}

// Parse pay information
function parsePay(payText: string): string | null {
  if (!payText || payText.trim() === '' || payText.toLowerCase().includes('contact company') || 
      payText.toLowerCase().includes('varies')) {
    return null;
  }
  return payText.trim();
}

// Clean up website URLs
function cleanWebsite(url: string): string | null {
  if (!url) return null;
  
  url = url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

async function parseDriverOpportunitiesPDF() {
  console.log('Reading PDF file...');
  
  const pdfPath = join(process.cwd(), 'attached_assets', 'DriverGigsPro_Production_Database_787_Companies Copy_1762661209326.pdf');
  const dataBuffer = await readFile(pdfPath);
  const data = await pdfParse(dataBuffer);
  const content = data.text;
  
  const lines = content.split('\n');
  const companies: CompanyData[] = [];
  
  let currentLevel = '';
  let i = 0;
  
  // Level definitions
  const levels = {
    'Level 1 - Entry': 'Level 1 - Entry',
    'Level 2 - Growth': 'Level 2 - Growth',
    'Level 3 - Scale': 'Level 3 - Scale',
    'Level 4 - Professional': 'Level 4 - Professional',
    'Support Services': 'Support Services',
    'Other/Specialized Services': 'Other/Specialized'
  };
  
  console.log('Parsing companies...');
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Detect level changes
    if (line.includes('Level 1 - Entry:')) {
      currentLevel = levels['Level 1 - Entry'];
      i++;
      continue;
    } else if (line.includes('Level 2 - Growth:')) {
      currentLevel = levels['Level 2 - Growth'];
      i++;
      continue;
    } else if (line.includes('Level 3 - Scale:')) {
      currentLevel = levels['Level 3 - Scale'];
      i++;
      continue;
    } else if (line.includes('Level 4 - Professional:')) {
      currentLevel = levels['Level 4 - Professional'];
      i++;
      continue;
    } else if (line === 'Support Services' && lines[i + 1]?.trim() === '') {
      currentLevel = levels['Support Services'];
      i++;
      continue;
    } else if (line === 'Other/Specialized Services') {
      currentLevel = levels['Other/Specialized Services'];
      i++;
      continue;
    }
    
    // Skip header/metadata lines
    if (!currentLevel || line === '' || line.includes('Total Companies:') || 
        line.includes('Page ') || line.includes('TABLE OF CONTENTS') ||
        line.includes('DRIVER GIGS PRO') || line.includes('Production Database') ||
        line.includes('Financial Services') || line.includes('Operational Support') ||
        line.includes('Other Support')) {
      i++;
      continue;
    }
    
    // Look for company name (non-URL, non-contract line)
    if (line && !line.startsWith('http') && !line.includes('Contract:') && 
        !line.includes('Vehicles:') && !line.includes('Pay:') &&
        !line.includes('service.') && !line.includes('Service.') &&
        line.length > 2 && line.length < 100) {
      
      const companyName = line;
      let website: string | null = null;
      let contractType = 'Independent Contractor';
      let vehicles: string[] = [];
      let pay: string | null = null;
      let description: string | null = null;
      
      // Look ahead for website
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine.startsWith('http') || nextLine.includes('.com') || nextLine.includes('.net') || nextLine.includes('.org')) {
          website = cleanWebsite(nextLine);
          i++;
        }
      }
      
      // Look ahead for contract/vehicles/pay info
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        
        if (nextLine === '') {
          i++;
        }
      }
      
      if (i + 1 < lines.length) {
        const infoLine = lines[i + 1].trim();
        
        if (infoLine.includes('Contract:') || infoLine.includes('Vehicles:') || infoLine.includes('Pay:')) {
          const parts = infoLine.split('|');
          
          for (const part of parts) {
            const trimmed = part.trim();
            
            if (trimmed.startsWith('Contract:')) {
              contractType = trimmed.replace('Contract:', '').trim();
            } else if (trimmed.startsWith('Vehicles:')) {
              const vehiclesText = trimmed.replace('Vehicles:', '').trim();
              vehicles = parseVehicles(vehiclesText);
            } else if (trimmed.startsWith('Pay:')) {
              pay = parsePay(trimmed.replace('Pay:', '').trim());
            }
          }
          
          i++;
        }
      }
      
      // Look for description
      if (i + 1 < lines.length) {
        const descLine = lines[i + 1].trim();
        
        if (descLine && !descLine.startsWith('http') && !descLine.includes('Contract:') &&
            (descLine.includes('service.') || descLine.includes('Service.') || descLine.includes('delivery') ||
             descLine.length > 50)) {
          description = descLine;
          i++;
        }
      }
      
      // Determine service vertical
      const serviceVertical = mapServiceVertical(
        (description || '') + ' ' + companyName,
        companyName
      );
      
      companies.push({
        name: companyName,
        website,
        contractType,
        vehicles,
        pay,
        description,
        serviceVertical,
        level: currentLevel
      });
    }
    
    i++;
  }
  
  console.log(`\nParsed ${companies.length} companies:`);
  console.log(`- Level 1 - Entry: ${companies.filter(c => c.level === 'Level 1 - Entry').length}`);
  console.log(`- Level 2 - Growth: ${companies.filter(c => c.level === 'Level 2 - Growth').length}`);
  console.log(`- Level 3 - Scale: ${companies.filter(c => c.level === 'Level 3 - Scale').length}`);
  console.log(`- Level 4 - Professional: ${companies.filter(c => c.level === 'Level 4 - Professional').length}`);
  console.log(`- Support Services: ${companies.filter(c => c.level === 'Support Services').length}`);
  console.log(`- Other/Specialized: ${companies.filter(c => c.level === 'Other/Specialized').length}`);
  
  // Write to JSON file
  const outputPath = join(process.cwd(), 'scripts', 'data', 'driver-opportunities-v2025-11-04.json');
  await writeFile(outputPath, JSON.stringify(companies, null, 2));
  
  console.log(`\nData written to: ${outputPath}`);
  console.log('Parser complete!');
  
  return companies;
}

// Run the parser
parseDriverOpportunitiesPDF().catch(console.error);
