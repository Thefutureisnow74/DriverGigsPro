import { readFile } from 'fs/promises';
import { join } from 'path';
import { db } from '../server/db';
import { companies } from '../shared/schema';
import { sql } from 'drizzle-orm';

interface CompanyImport {
  name: string;
  website: string | null;
  contractType: string;
  vehicles: string[];
  pay: string | null;
  description: string | null;
  serviceVertical: string[];
  level: string;
}

async function importDriverOpportunities() {
  console.log('Starting Driver Opportunities import...\n');
  
  try {
    // Step 1: Load the cleaned data
    console.log('Step 1: Loading cleaned company data...');
    const dataPath = join(process.cwd(), 'scripts', 'data', 'driver-opportunities-cleaned.json');
    const companiesData: CompanyImport[] = JSON.parse(await readFile(dataPath, 'utf-8'));
    console.log(`Loaded ${companiesData.length} companies from JSON file\n`);
    
    // Step 2: Check current database state
    console.log('Step 2: Checking current database state...');
    const currentCount = await db.select({ count: sql<number>`count(*)` }).from(companies);
    console.log(`Current companies in database: ${currentCount[0].count}`);
    console.log(`Companies to import: ${companiesData.length}\n`);
    
    // Step 3: Add level column if it doesn't exist
    console.log('Step 3: Ensuring level column exists...');
    try {
      await db.execute(sql`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'companies' AND column_name = 'level'
          ) THEN
            ALTER TABLE companies ADD COLUMN level TEXT;
          END IF;
        END $$;
      `);
      console.log('Level column check complete\n');
    } catch (error) {
      console.log('Column might already exist, continuing...\n');
    }
    
    // Step 4: Execute transaction
    console.log('Step 4: Starting database transaction...');
    
    await db.transaction(async (tx) => {
      // Delete related records first to avoid foreign key violations
      // Order matters: delete child records before parent records
      console.log('  - Deleting related records in correct order...');
      await tx.execute(sql`DELETE FROM assignments`); // First: has FK to employment_records
      await tx.execute(sql`DELETE FROM employment_records`); // Second: has FK to companies
      await tx.execute(sql`DELETE FROM applications`); // Has FK to companies
      await tx.execute(sql`DELETE FROM contact_logs`); // Has FK to companies
      await tx.execute(sql`DELETE FROM hired_jobs`); // Has FK to companies
      await tx.execute(sql`DELETE FROM job_search_notes`); // Has FK to companies
      await tx.execute(sql`DELETE FROM company_actions`); // Has FK to companies
      console.log('  - All related records deleted successfully');
      
      // Delete all existing companies
      console.log('  - Deleting all existing companies...');
      await tx.delete(companies);
      console.log(`  - Deleted ${currentCount[0].count} companies`);
      
      // Insert new companies in chunks
      const chunkSize = 100;
      let inserted = 0;
      
      for (let i = 0; i < companiesData.length; i += chunkSize) {
        const chunk = companiesData.slice(i, i + chunkSize);
        
        const insertData = chunk.map(c => ({
          name: c.name,
          website: c.website,
          contractType: c.contractType,
          vehicleTypes: c.vehicles.length > 0 ? c.vehicles : null,
          averagePay: c.pay,
          serviceVertical: c.serviceVertical,
          description: c.description,
          level: c.level as "Level 1 - Entry" | "Level 2 - Growth" | "Level 3 - Scale" | "Level 4 - Professional" | "Support Services" | "Other/Specialized",
          isActive: true
        }));
        
        await tx.insert(companies).values(insertData);
        inserted += chunk.length;
        
        console.log(`  - Inserted ${inserted}/${companiesData.length} companies...`);
      }
      
      console.log('  - Transaction committed successfully!\n');
    });
    
    // Step 5: Verify import
    console.log('Step 5: Verifying import...');
    const newCount = await db.select({ count: sql<number>`count(*)` }).from(companies);
    console.log(`New total companies: ${newCount[0].count}`);
    
    // Check level distribution
    const levelDist = await db.execute(sql`
      SELECT level, COUNT(*) as count
      FROM companies
      GROUP BY level
      ORDER BY level;
    `);
    
    console.log('\nLevel distribution in database:');
    for (const row of levelDist.rows) {
      console.log(`  - ${row.level || 'NULL'}: ${row.count}`);
    }
    
    console.log('\n✅ Import completed successfully!');
    console.log(`   Replaced ${currentCount[0].count} companies with ${newCount[0].count} new companies`);
    
  } catch (error) {
    console.error('\n❌ Import failed! Transaction rolled back.');
    console.error('Error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the import
importDriverOpportunities().catch(console.error);
