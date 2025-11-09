import fs from 'fs';
import path from 'path';
import { db } from './db.js';
import { companies } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

interface CompanyContact {
  name: string;
  website: string;
  phone: string;
}

function parseContactData(): CompanyContact[] {
  const filePath = path.join(process.cwd(), 'attached_assets', 'Pasted-Company-Name-Website-Phone-Number-A-Stat-Medical-Courier-astatmedicalcourierservice-com-940-923-087-1751168525403_1751168525403.txt');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const lines = content.split('\n').slice(1); // Skip header
  const contactMap = new Map<string, CompanyContact>();
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const parts = line.split('\t');
    if (parts.length < 3) continue;
    
    const name = parts[0]?.trim();
    const website = parts[1]?.trim();
    const phone = parts[2]?.trim();
    
    if (!name) continue;
    
    // Clean and normalize data
    const cleanWebsite = website && website !== 'Not publicly listed' && website !== 'Not available' && !website.includes('#ERROR!') 
      ? (website.startsWith('http') ? website : `https://${website}`)
      : '';
    
    const cleanPhone = phone && phone !== 'Not publicly listed' && phone !== 'Not available' && !phone.includes('#ERROR!')
      ? phone.replace(/[^\d\-\(\)\s\+]/g, '').trim()
      : '';
    
    // Use the best available data (prefer entries with more complete info)
    const existing = contactMap.get(name);
    if (!existing || (cleanWebsite && !existing.website) || (cleanPhone && !existing.phone)) {
      contactMap.set(name, {
        name,
        website: cleanWebsite || existing?.website || '',
        phone: cleanPhone || existing?.phone || ''
      });
    }
  }
  
  return Array.from(contactMap.values());
}

async function importContactInfo() {
  try {
    console.log('Starting contact info import...');
    
    const contactData = parseContactData();
    console.log(`Parsed ${contactData.length} unique companies with contact info`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const contact of contactData) {
      try {
        // Find company by exact name match
        const existingCompanies = await db
          .select()
          .from(companies)
          .where(eq(companies.name, contact.name));
        
        if (existingCompanies.length > 0) {
          // Update the first matching company
          await db
            .update(companies)
            .set({
              website: contact.website || null,
              contactPhone: contact.phone || null,
            })
            .where(eq(companies.id, existingCompanies[0].id));
          
          updatedCount++;
          console.log(`✓ Updated ${contact.name}`);
        } else {
          // Try to find similar names (handling variations)
          const similarCompanies = await db
            .select()
            .from(companies);
          
          const similarCompany = similarCompanies.find(c => 
            c.name.toLowerCase().includes(contact.name.toLowerCase()) ||
            contact.name.toLowerCase().includes(c.name.toLowerCase())
          );
          
          if (similarCompany) {
            await db
              .update(companies)
              .set({
                website: contact.website || null,
                contactPhone: contact.phone || null,
              })
              .where(eq(companies.id, similarCompany.id));
            
            updatedCount++;
            console.log(`✓ Updated ${similarCompany.name} (matched with ${contact.name})`);
          } else {
            notFoundCount++;
            console.log(`? Company not found: ${contact.name}`);
          }
        }
      } catch (error) {
        console.error(`Error updating ${contact.name}:`, error);
      }
    }
    
    console.log(`\nImport completed:`);
    console.log(`- Updated: ${updatedCount} companies`);
    console.log(`- Not found: ${notFoundCount} companies`);
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  importContactInfo().then(() => process.exit(0));
}

export { importContactInfo };