import { readFile } from 'fs/promises';
import { join } from 'path';

async function validateData() {
  const dataPath = join(process.cwd(), 'scripts', 'data', 'driver-opportunities-v2025-11-04.json');
  const data = JSON.parse(await readFile(dataPath, 'utf-8'));
  
  console.log('Total companies:', data.length);
  console.log('\nFirst 2 companies:');
  console.log(JSON.stringify(data.slice(0, 2), null, 2));
  
  console.log('\nDuplicates check:');
  const names = data.map((c: any) => c.name);
  const dups = names.filter((n: string, i: number) => names.indexOf(n) !== i);
  console.log('Duplicate count:', new Set(dups).size);
  
  if (new Set(dups).size > 0) {
    console.log('\nDuplicate names:');
    console.log(Array.from(new Set(dups)).slice(0, 20));
  }
  
  console.log('\nLevel distribution:');
  const levels = data.reduce((acc: any, c: any) => {
    acc[c.level] = (acc[c.level] || 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify(levels, null, 2));
  
  console.log('\nMissing required fields:');
  const missing = data.filter((c: any) => !c.name || !c.contractType || !c.serviceVertical || c.serviceVertical.length === 0);
  console.log('Count:', missing.length);
  if (missing.length > 0) {
    console.log('Examples:', missing.slice(0, 3).map((c: any) => c.name));
  }
}

validateData().catch(console.error);
