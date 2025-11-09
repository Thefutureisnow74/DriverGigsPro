import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function cleanupData() {
  const dataPath = join(process.cwd(), 'scripts', 'data', 'driver-opportunities-v2025-11-04.json');
  const data = JSON.parse(await readFile(dataPath, 'utf-8'));
  
  console.log('Original count:', data.length);
  
  // Filter out invalid entries
  let cleaned = data.filter((c: any) => {
    // Skip section headers and invalid names
    if (!c.name || c.name.includes('apps for immediate start') || 
        c.name.includes('Contract-Based Companies') ||
        c.name.includes('Load Boards') ||
        c.name.includes('TMS Platforms') ||
        c.name.startsWith('$') || // Pay amounts treated as names
        c.name.includes('–') || // Pay ranges treated as names
        c.name.includes('with Trailer') || // Vehicle specs treated as names
        c.name.match(/^\d+$/) || // Just numbers
        c.name.toLowerCase().includes('total companies') ||
        c.name.length < 2 ||
        c.name.length > 100) {
      return false;
    }
    
    // Must have either a website or contract type
    if (!c.website && c.contractType === 'Independent Contractor' && 
        c.serviceVertical.length === 1 && c.serviceVertical[0] === 'Other') {
      return false;
    }
    
    return true;
  });
  
  console.log('After filtering invalid entries:', cleaned.length);
  
  // Remove duplicates - keep first occurrence
  const seen = new Set();
  cleaned = cleaned.filter((c: any) => {
    const key = c.name.toLowerCase().trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  
  console.log('After deduplication:', cleaned.length);
  
  console.log('\nLevel distribution:');
  const levels = cleaned.reduce((acc: any, c: any) => {
    acc[c.level] = (acc[c.level] || 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify(levels, null, 2));
  
  // Write cleaned data
  const outputPath = join(process.cwd(), 'scripts', 'data', 'driver-opportunities-cleaned.json');
  await writeFile(outputPath, JSON.stringify(cleaned, null, 2));
  
  console.log(`\nCleaned data written to: ${outputPath}`);
  console.log('Ready for import!');
}

cleanupData().catch(console.error);
