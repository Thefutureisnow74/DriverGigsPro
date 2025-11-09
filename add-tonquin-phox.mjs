import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const companies = [
  {
    name: 'Tonquin',
    website: 'https://tonquin.com',
    phoneNumber: '(855) 484-2420',
    serviceVertical: 'Automotive parts',
    contractType: 'Independent Contractor',
    averagePay: '$1.25+ per mile, $6-$25 per delivery (~$18/hour)',
    vehicleTypes: ['Car', 'SUV', 'Pickup Truck'],
    areasServed: ['28+ cities across United States'],
    insuranceRequirements: 'Vehicle insurance required',
    licenseRequired: 'Standard driver license (non-CDL)',
    description: 'Automotive parts delivery platform connecting drivers with auto parts suppliers like Advance Auto Parts, NAPA, American Tire Distributors, and Lowes. Flexible Monday-Friday 8am-2pm schedule with 70-80% fare retention.',
    applicationProcess: 'Sign up at tonquin.com, background check, mobile app download',
    benefits: 'Pro status available with priority notifications and 24-hour early access to charter opportunities',
    isActive: true
  },
  {
    name: 'Phox Health',
    website: 'https://phoxhealth.com',
    phoneNumber: '(844) 688-7469',
    contactEmail: 'support@phoxhealth.com',
    serviceVertical: 'Medical',
    contractType: 'Independent Contractor',
    averagePay: '$52,000-$78,000 annually',
    vehicleTypes: ['Car', 'SUV', 'Minivan'],
    areasServed: ['Major metropolitan areas across United States'],
    insuranceRequirements: 'Vehicle insurance required',
    licenseRequired: 'Standard driver license (non-CDL), must be 21+',
    description: 'Tech-enabled healthcare logistics company specializing in prescription delivery services for major health systems like Kaiser Permanente, Ochsner Health, MultiCare. HIPAA/SOC 2 compliant medical courier services with same-day and 1-hour STAT delivery options.',
    applicationProcess: 'Contact support@phoxhealth.com or apply via website',
    benefits: '100% medical courier fleet, competitive rates, real-time performance monitoring',
    isActive: true
  }
];

async function addCompanies() {
  try {
    console.log('🚚 Adding Tonquin and Phox Health to Driver Opportunities...');
    
    for (const company of companies) {
      // Check if company already exists
      const existing = await pool.query(
        'SELECT id FROM companies WHERE name = $1 OR website = $2',
        [company.name, company.website]
      );
      
      if (existing.rows.length > 0) {
        console.log(`⚠️  ${company.name} already exists in database`);
        continue;
      }
      
      // Insert company
      const result = await pool.query(`
        INSERT INTO companies (
          name, website, contact_phone, contact_email, service_vertical,
          contract_type, average_pay, vehicle_types, areas_served,
          insurance_requirements, license_requirements, description, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        ) RETURNING id, name
      `, [
        company.name,
        company.website,
        company.phoneNumber,
        company.contactEmail || null,
        company.serviceVertical,
        company.contractType,
        company.averagePay,
        company.vehicleTypes,
        company.areasServed,
        company.insuranceRequirements,
        company.licenseRequired,
        company.description + (company.applicationProcess ? ` Application: ${company.applicationProcess}.` : '') + (company.benefits ? ` Benefits: ${company.benefits}.` : ''),
        company.isActive
      ]);
      
      console.log(`✅ Added ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    }
    
    // Verify total count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM companies WHERE is_active = true');
    console.log(`\n📊 Total active companies: ${countResult.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error adding companies:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

addCompanies();