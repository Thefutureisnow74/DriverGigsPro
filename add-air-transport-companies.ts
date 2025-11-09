import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./shared/schema.ts";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

const airTransportCompanies = [
  {
    name: "Air Charter Service",
    serviceVertical: "Air Transport",
    vehicleTypes: ["None Required"],
    areasServed: ["Worldwide"],
    contractType: "Independent Contractor",
    averagePay: "Flight + Hotel Paid",
    insuranceRequirements: "Health Insurance Required",
    licenseRequirements: "Valid Passport",
    certificationsRequired: ["18+ Years Old", "Valid Passport"],
    description: "Hand-carry time-sensitive shipments (documents, prototypes, medical equipment). Company pays for flight and hotel accommodations.",
    website: "aircharterservice.com",
    workflowStatus: "apply",
    isActive: true
  },
  {
    name: "Royale International",
    serviceVertical: "Air Transport", 
    vehicleTypes: ["None Required"],
    areasServed: ["Global", "United States"],
    contractType: "Independent Contractor",
    averagePay: "Competitive",
    insuranceRequirements: "Health Insurance Required",
    licenseRequirements: "Valid Passport",
    certificationsRequired: ["18+ Years Old", "Valid Passport"],
    description: "Handles urgent deliveries for automotive, aerospace, medical, and other industries. Global presence with U.S. operations.",
    website: "royaleinternational.com",
    workflowStatus: "apply",
    isActive: true
  },
  {
    name: "Wings On Board",
    serviceVertical: "Air Transport",
    vehicleTypes: ["None Required"], 
    areasServed: ["International", "Global"],
    contractType: "Independent Contractor",
    averagePay: "Travel Expenses Covered",
    insuranceRequirements: "Health Insurance Required",
    licenseRequirements: "Valid Passport",
    certificationsRequired: ["18+ Years Old", "Valid Passport", "Willingness to Travel Internationally"],
    description: "International onboard courier company specializing in urgent, global deliveries. Ideal for those willing to travel abroad.",
    website: "wings-onboard.com",
    workflowStatus: "apply",
    isActive: true
  },
  {
    name: "Time Matters",
    serviceVertical: "Air Transport",
    vehicleTypes: ["None Required"],
    areasServed: ["Global"],
    contractType: "Independent Contractor", 
    averagePay: "Varies by Shipment",
    insuranceRequirements: "Health Insurance Required",
    licenseRequirements: "Valid Passport",
    certificationsRequired: ["18+ Years Old", "Valid Passport"],
    description: "Courier solutions for sensitive and urgent shipments worldwide. Global service provider with extensive network.",
    website: "timematters.com",
    workflowStatus: "apply",
    isActive: true
  },
  {
    name: "Airmates On Board Couriers",
    serviceVertical: "Air Transport",
    vehicleTypes: ["None Required"],
    areasServed: ["Worldwide"],
    contractType: "Independent Contractor",
    averagePay: "Freelancer Rates",
    insuranceRequirements: "Health Insurance Required",
    licenseRequirements: "Valid Passport",
    certificationsRequired: ["18+ Years Old", "Valid Passport", "Health Insurance", "Smartphone", "Credit Card"],
    description: "Freelancer-based courier jobs for independent contractors. Multiple requirements including passport, health insurance, smartphone, and credit card.",
    website: "airmates.com",
    workflowStatus: "apply",
    isActive: true
  },
  {
    name: "USA Couriers",
    serviceVertical: "Air Transport",
    vehicleTypes: ["None Required"],
    areasServed: ["United States"],
    contractType: "Independent Contractor",
    averagePay: "Domestic Rates",
    insuranceRequirements: "Health Insurance Preferred",
    licenseRequirements: "Driver's License (Passport for International)",
    certificationsRequired: ["18+ Years Old", "Valid ID"],
    description: "U.S.-based onboard courier jobs with domestic-only options that may not require passport. Focus on domestic shipments.",
    website: "usacouriers.com",
    workflowStatus: "apply",
    isActive: true
  },
  {
    name: "FedEx Air Expedite",
    serviceVertical: "Air Transport",
    vehicleTypes: ["None Required"],
    areasServed: ["Worldwide"],
    contractType: "Employee",
    averagePay: "FedEx Employee Benefits",
    insuranceRequirements: "Company Provided",
    licenseRequirements: "Valid Passport",
    certificationsRequired: ["18+ Years Old", "Valid Passport", "Background Check"],
    description: "FedEx offers onboard courier work under Air Expedite division. Apply through FedEx Careers or contact directly.",
    website: "fedex.com/careers",
    workflowStatus: "apply",
    isActive: true
  },
  {
    name: "National Air Cargo",
    serviceVertical: "Air Transport",
    vehicleTypes: ["None Required"],
    areasServed: ["United States", "International"],
    contractType: "Independent Contractor",
    averagePay: "Security Clearance Premium",
    insuranceRequirements: "Required",
    licenseRequirements: "Valid Passport",
    certificationsRequired: ["18+ Years Old", "Valid Passport", "Security Clearance (May Be Required)"],
    description: "Onboard courier roles under Air Freight division. May require security clearance and passport for sensitive shipments.",
    website: "nationalaircargo.com",
    workflowStatus: "apply",
    isActive: true
  },
  {
    name: "Cathay Pacific Cargo",
    serviceVertical: "Air Transport",
    vehicleTypes: ["None Required"],
    areasServed: ["Asia", "International"],
    contractType: "Independent Contractor",
    averagePay: "International Rates",
    insuranceRequirements: "Required",
    licenseRequirements: "Valid Passport",
    certificationsRequired: ["18+ Years Old", "Valid Passport", "International Travel Experience"],
    description: "Asia-based onboard logistics for international flights, especially in Asian markets. Ideal for frequent international travelers.",
    website: "cathaypacificcargo.com",
    workflowStatus: "apply",
    isActive: true
  }
];

async function addAirTransportCompanies() {
  try {
    console.log('Adding Air Transport onboard courier companies...');
    
    for (const company of airTransportCompanies) {
      console.log(`Adding ${company.name}...`);
      
      const result = await db.insert(schema.companies).values({
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
      
      console.log(`✅ Added ${company.name} (ID: ${result[0].id})`);
    }
    
    console.log(`\n🎉 Successfully added ${airTransportCompanies.length} Air Transport companies!`);
    console.log('\n✈️ Requirements Summary:');
    console.log('• Valid passport (for international gigs)');
    console.log('• Driver\'s license (for ID)');
    console.log('• Credit card (for hotel check-in/incidentals)');
    console.log('• Ability to travel on short notice');
    console.log('• Fluent English');
    console.log('• No major criminal history');
    console.log('• Health insurance (typically required)');
    
  } catch (error) {
    console.error('Error adding Air Transport companies:', error);
  } finally {
    await pool.end();
  }
}

addAirTransportCompanies();