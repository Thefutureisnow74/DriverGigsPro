import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, sql } from 'drizzle-orm';
import ws from "ws";
import { companies } from "./shared/schema.ts";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { companies } });

// Medical delivery companies from expanded search criteria
const medicalCompanies = [
  {
    name: "Medical Couriers Inc (MCI)",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "Nationwide",
    contractType: "Independent Contractor",
    averagePay: "$30,000-$45,000 annually",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license, clean record",
    certificationsRequired: "HIPAA, Bloodborne Pathogen",
    description: "Founded in 1969, family-owned medical courier service specializing in lab specimens, blood samples, and medical equipment transport with eco-friendly Prius Prime fleet",
    website: "https://medicalcouriers.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "BioTouch Global",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "Global",
    contractType: "Independent Contractor",
    averagePay: "Competitive",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "HIPAA compliance",
    description: "Healthcare logistics and supply chain solutions company, acquired MedSprint for specimen transportation with global operations",
    website: "https://biotouchglobaljobs.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "Life Couriers",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "39 states",
    contractType: "Independent Contractor",
    averagePay: "Competitive rates",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license, Hazmat endorsement",
    certificationsRequired: "ANSI/AAMI ST79:2017 compliant, HIPAA",
    description: "40+ years experience in medical transport, operates in 39 states with dedicated daily routes and temperature-controlled containers for organ and tissue transport",
    website: "https://www.associated-couriers.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "Lab Logistics",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "450+ hospitals nationwide",
    contractType: "Independent Contractor",
    averagePay: "Competitive",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "Medical courier certification",
    description: "Professional courier service serving 450+ hospitals and labs in the U.S. with specialized tracking technology and efficiency optimization",
    website: "https://www.lablogistics.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "NORA (Nationwide Organ Recovery Transport Alliance)",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans", "Aircraft"],
    areasServed: "Nationwide",
    contractType: "Independent Contractor",
    averagePay: "Premium rates for organ transport",
    insuranceRequirements: "Commercial insurance required",
    licenseRequirements: "Valid driver license, Hazmat certification",
    certificationsRequired: "Organ transport certification, HIPAA",
    description: "Elite ground and air organ transportation with 24/7/365 dispatch for time-critical organ and tissue transport",
    website: "https://www.noratrans.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "Medi-Ops",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans", "Aircraft"],
    areasServed: "Nationwide",
    contractType: "Independent Contractor",
    averagePay: "Premium rates",
    insuranceRequirements: "Commercial insurance required",
    licenseRequirements: "Valid driver license, TSA/DHS certification",
    certificationsRequired: "Medical transport certification, HIPAA",
    description: "TSA/DHS certified air carrier specializing in organ and medical equipment transport with rotor/fixed-wing aircraft capabilities",
    website: "https://www.medi-ops.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "ParaWorks",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "Nationwide",
    contractType: "Independent Contractor",
    averagePay: "Up to $50/hour",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "HIPAA certification",
    description: "100,000+ vetted drivers providing same-day/next-day pharmacy delivery with hospital-at-home focus. Quick onboarding, keep 100% of tips",
    website: "https://www.withpara.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "Medzoomer",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "Multiple states",
    contractType: "Independent Contractor",
    averagePay: "Above average delivery rates",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "HIPAA certified 1099 couriers",
    description: "HIPAA certified medical delivery platform with custom route optimization software for efficient prescription and medical deliveries",
    website: "https://medzoomer.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "USPack Healthcare",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "Nationwide",
    contractType: "Independent Contractor",
    averagePay: "Competitive with fleet management opportunities",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "Medical courier certification",
    description: "30+ years experience in medical logistics with 24/7/365 availability. Opportunity to become master contractor managing fleet",
    website: "https://gouspack.com/healthcare",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "TNT Healthcare Solutions",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "International",
    contractType: "Independent Contractor",
    averagePay: "Competitive international rates",
    insuranceRequirements: "Commercial insurance required",
    licenseRequirements: "Valid driver license, international permits",
    certificationsRequired: "HIPAA, international transport certification",
    description: "International blood and specimen transport with temperature-controlled delivery options. Up to 40% cost reduction vs other transport companies",
    website: "https://www.tnt.com/express/en_gb/site/how-to/ship-healthcare/blood-transportation.html",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "World Courier",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans", "Aircraft"],
    areasServed: "Global",
    contractType: "Independent Contractor",
    averagePay: "Premium international rates",
    insuranceRequirements: "Commercial insurance required",
    licenseRequirements: "Valid driver license, international permits",
    certificationsRequired: "Clinical trial certification, cold chain management",
    description: "Global laboratory logistics and cold chain management specializing in clinical trial specimen transport with worldwide connectivity",
    website: "https://www.worldcourier.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "Allstate Courier Systems",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "Boston/Hingham area",
    contractType: "Independent Contractor",
    averagePay: "Regional competitive rates",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "OSHA Bloodborne Pathogen Standards",
    description: "Decade+ experience in medical specimen transport including blood, urine, tissue, pathology slides with STAT same-day delivery services",
    website: "https://allstatecouriers.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "Excel Courier",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "Washington DC area",
    contractType: "Independent Contractor",
    averagePay: "Regional competitive rates",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "OSHA, DOT, and HIPAA compliant",
    description: "Temperature-controlled transportation with dry ice serving hospitals, labs, pharmacies, blood banks with professional driver training",
    website: "https://www.excelcourier.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "Uniship Courier",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "Regional",
    contractType: "Independent Contractor",
    averagePay: "Competitive",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "Annual driver training programs",
    description: "Medical specimen warehousing capabilities with STAT and routine transport services specializing in temperature requirements",
    website: "https://www.uniship.us",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "QuickSTAT",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans", "Aircraft"],
    areasServed: "Global",
    contractType: "Independent Contractor",
    averagePay: "Premium rates",
    insuranceRequirements: "Commercial insurance required",
    licenseRequirements: "Valid driver license, aviation permits",
    certificationsRequired: "Cord blood/stem cell specialist certification",
    description: "Global transportation specializing in cord blood/stem cell transport with on-board courier services for organ and tissue donation logistics",
    website: "https://quickstat.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "Reliable Couriers",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "Regional",
    contractType: "Independent Contractor",
    averagePay: "Competitive",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "OSHA/HIPAA compliant",
    description: "Climate-controlled vehicles with GPS tracking specializing in medical device courier and delivery services",
    website: "https://www.reliablecouriers.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "Swift Delivery & Logistics",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans"],
    areasServed: "MD, VA, DC",
    contractType: "Independent Contractor",
    averagePay: "Regional competitive rates",
    insuranceRequirements: "Auto insurance required",
    licenseRequirements: "Valid driver license",
    certificationsRequired: "Medical equipment handling certification",
    description: "White glove medical equipment delivery service specializing in dialysis equipment and durable medical equipment (DME) delivery",
    website: "https://swiftdeliveryandlogistics.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "American Expediting",
    serviceVertical: "Medical",
    vehicleTypes: ["Cars", "Vans", "Aircraft"],
    areasServed: "Nationwide",
    contractType: "Independent Contractor",
    averagePay: "Premium rates",
    insuranceRequirements: "Commercial insurance required",
    licenseRequirements: "Valid driver license, aviation permits",
    certificationsRequired: "Medical transport certification",
    description: "40+ years experience in organ transport with nationwide coverage providing same-day on-demand services for time-critical medical deliveries",
    website: "https://americanexpediting.com",
    workflowStatus: null,
    isActive: true
  },
  {
    name: "BLADE MediMobility",
    serviceVertical: "Medical",
    vehicleTypes: ["Aircraft", "Ground vehicles"],
    areasServed: "Nationwide",
    contractType: "Independent Contractor",
    averagePay: "Premium aviation rates",
    insuranceRequirements: "Aviation insurance required",
    licenseRequirements: "Valid pilot license or driver license",
    certificationsRequired: "Medical transport aviation certification",
    description: "Largest point-to-point organ transport in US with 70+ hospital partners and 13 jet aircraft hubs for critical medical transport",
    website: "https://www.blade.com/medimobility",
    workflowStatus: null,
    isActive: true
  }
];

// Helper function to check for duplicates
async function checkCompanyExists(name, website) {
  const [existingByName] = await db.select().from(companies).where(eq(companies.name, name));
  
  if (existingByName) {
    return existingByName;
  }
  
  if (website) {
    const [existingByWebsite] = await db.select().from(companies).where(eq(companies.website, website));
    if (existingByWebsite) {
      return existingByWebsite;
    }
  }
  
  return null;
}

async function addMedicalCompanies() {
  try {
    console.log('🏥 Adding specialized medical delivery companies...');
    console.log(`📋 Processing ${medicalCompanies.length} companies with duplicate checking...`);
    
    let added = 0;
    let skipped = 0;
    
    for (const company of medicalCompanies) {
      try {
        // Check for duplicates
        const existing = await checkCompanyExists(company.name, company.website);
        
        if (existing) {
          console.log(`⚠️  Skipping ${company.name} - already exists (ID: ${existing.id})`);
          skipped++;
          continue;
        }
        
        // Add new company
        const [result] = await db.insert(companies).values({
          name: company.name,
          serviceVertical: company.serviceVertical,
          vehicleTypes: company.vehicleTypes,
          areasServed: company.areasServed,
          contractType: company.contractType,
          averagePay: company.averagePay,
          insuranceRequirements: company.insuranceRequirements,
          licenseRequirements: company.licenseRequirements,
          certificationsRequired: company.certificationsRequired,
          description: company.description,
          website: company.website,
          workflowStatus: company.workflowStatus,
          isActive: company.isActive
        }).returning();
        
        console.log(`✅ Added ${company.name} (ID: ${result.id})`);
        added++;
        
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Skipped (duplicate): ${company.name}`);
          skipped++;
        } else {
          console.log(`❌ Error adding ${company.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n📊 Medical Company Addition Results:`);
    console.log(`✅ Successfully added: ${added} companies`);
    console.log(`⚠️  Skipped (already exist): ${skipped} companies`);
    console.log(`🎯 Total processed: ${added + skipped} companies`);
    
    // Get updated company count
    const [totalResult] = await db.select({ count: sql`count(*)` }).from(companies).where(eq(companies.isActive, true));
    console.log(`📈 Total active companies in database: ${totalResult.count}`);
    
    console.log('\n🔬 Medical Delivery Expansion Complete!');
    console.log('Added companies covering:');
    console.log('• Lab specimen transport');
    console.log('• Organ/tissue delivery');
    console.log('• Pharmacy/prescription delivery');
    console.log('• Medical equipment transport');
    console.log('• HIPAA-compliant services');
    console.log('• Temperature-controlled transport');
    console.log('• Clinical trial logistics');
    
  } catch (error) {
    console.error('❌ Error adding medical companies:', error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  addMedicalCompanies();
}

export { addMedicalCompanies };