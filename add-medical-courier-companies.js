import { db } from "./server/db";
import { companies } from "./shared/schema";

const newMedicalCourierCompanies = [
  {
    name: "STAT Medical Courier",
    website: "https://statmedicalcourier.com",
    vehicleTypes: ["Car", "SUV", "Van"],
    averagePay: "$1,000-$2,000/week",
    contractType: "Independent Contractor",
    serviceVertical: "Medical Courier",
    description: "Works with hospitals, labs, and pharmacies nationwide. Extra pay for nights/weekends.",
    requirements: "Driver's license, clean record, reliable vehicle, smartphone, HIPAA certification recommended",
    areasServed: ["Nationwide"],
    applicationProcess: "Online application",
    specialRequirements: "HIPAA certification recommended",
    payStructure: "Weekly",
    benefits: "Flexible scheduling, night/weekend bonuses",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "Dropoff",
    website: "https://dropoff.com",
    vehicleTypes: ["Midsize Car", "SUV", "Large Vehicle"],
    averagePay: "$22-$35/hour",
    contractType: "Independent Contractor",
    serviceVertical: "Same-Day Delivery",
    description: "Nationwide courier company known for same-day delivery and flexible scheduling. Great for parents or people with other jobs.",
    requirements: "Must have midsize or larger vehicle",
    areasServed: ["Texas", "Florida", "California", "Nationwide"],
    applicationProcess: "Online application",
    specialRequirements: "Midsize or larger vehicle required",
    payStructure: "Hourly + Tips",
    benefits: "Tips allowed in some areas, flexible scheduling",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "CBDriver.com",
    website: "https://cbdriver.com",
    vehicleTypes: ["Car", "SUV", "Van"],
    averagePay: "$150-$300/day ($1,200-$2,500/week)",
    contractType: "Independent Contractor",
    serviceVertical: "Medical Courier",
    description: "Like Indeed but for courier gigs. Lists medical delivery opportunities and long-term contracts.",
    requirements: "Independent contractor - track mileage, gas, and maintenance",
    areasServed: ["Nationwide"],
    applicationProcess: "Job board platform",
    specialRequirements: "Self-employment record keeping required",
    payStructure: "Per route/contract",
    benefits: "Long-term contract opportunities",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "Associated Couriers",
    website: "https://associatedcouriers.com",
    vehicleTypes: ["Small SUV", "Hatchback"],
    averagePay: "$5,000/month",
    contractType: "Part-time and Full-time",
    serviceVertical: "Medical Courier",
    description: "Works with blood banks, diagnostic labs, and hospitals. Offers both part-time and full-time roles.",
    requirements: "Small SUV or hatchback required",
    areasServed: ["Nationwide"],
    applicationProcess: "Online application",
    specialRequirements: "Small SUV or hatchback vehicle",
    payStructure: "Monthly routes",
    benefits: "Reliable and steady routes, flexible part-time/full-time",
    verified: true,
    fraudRisk: "low"
  }
];

async function addMedicalCourierCompanies() {
  console.log("Adding medical courier companies to database...");
  
  try {
    for (const company of newMedicalCourierCompanies) {
      console.log(`Adding: ${company.name}`);
      
      const [insertedCompany] = await db
        .insert(companies)
        .values(company)
        .returning();
      
      console.log(`✅ Added: ${insertedCompany.name} (ID: ${insertedCompany.id})`);
    }
    
    console.log("\n🎉 Successfully added all 4 medical courier companies!");
    console.log("Companies added:");
    newMedicalCourierCompanies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} - ${company.averagePay}`);
    });
    
  } catch (error) {
    console.error("Error adding companies:", error);
  }
}

addMedicalCourierCompanies();