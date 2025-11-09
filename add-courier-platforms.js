import { db } from "./server/db";
import { companies } from "./shared/schema";

const newCourierPlatforms = [
  {
    name: "MedicalCouriersInc.com",
    website: "https://medicalcouriersinc.com",
    vehicleTypes: ["Car", "SUV", "Van"],
    averagePay: "Varies by route",
    contractType: "Independent Contractor",
    serviceVertical: "Medical Courier",
    description: "Works nationwide with hospitals and pharmacies.",
    requirements: "Clean driving record, reliable vehicle",
    areasServed: ["Nationwide"],
    applicationProcess: "Online application",
    specialRequirements: "Medical courier experience preferred",
    payStructure: "Per delivery",
    benefits: "Nationwide opportunities",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "CourierExpress.net",
    website: "https://courierexpress.net",
    vehicleTypes: ["Car", "SUV", "Van", "Truck"],
    averagePay: "Varies by position",
    contractType: "Part-time and Full-time",
    serviceVertical: "General Courier",
    description: "Offers part-time and full-time courier roles.",
    requirements: "Valid driver's license, clean record",
    areasServed: ["Nationwide"],
    applicationProcess: "Online application",
    specialRequirements: "Flexible scheduling options",
    payStructure: "Hourly/Salary",
    benefits: "Part-time and full-time options",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "Shiply.com",
    website: "https://shiply.com",
    vehicleTypes: ["Car", "SUV", "Van", "Truck"],
    averagePay: "Set your own rates",
    contractType: "Independent Contractor",
    serviceVertical: "Freight/Shipping",
    description: "Bidding marketplace where drivers set their own rates.",
    requirements: "Valid license, appropriate vehicle for job",
    areasServed: ["Nationwide"],
    applicationProcess: "Online registration",
    specialRequirements: "Bidding system - compete for jobs",
    payStructure: "Per job (bidding)",
    benefits: "Set your own rates, choose jobs",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "MedZoomer",
    website: "https://medzoomer.com",
    vehicleTypes: ["Car", "SUV"],
    averagePay: "Varies by delivery",
    contractType: "Independent Contractor",
    serviceVertical: "Prescription Delivery",
    description: "Prescription delivery near major cities. Offers scheduled & on-demand gigs.",
    requirements: "Clean driving record, smartphone",
    areasServed: ["Major Cities"],
    applicationProcess: "Online application",
    specialRequirements: "Background check for prescription delivery",
    payStructure: "Per delivery",
    benefits: "Scheduled and on-demand options",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "Curaal",
    website: "https://curaal.com",
    vehicleTypes: ["Car", "SUV", "Van"],
    averagePay: "Keep up to 80% of fees",
    contractType: "Independent Contractor",
    serviceVertical: "Same-Day Delivery",
    description: "Keep up to 80% of fees, pays for wait time. Active in major cities.",
    requirements: "Clean driving record, reliable vehicle",
    areasServed: ["Dallas", "Atlanta", "NYC", "Los Angeles", "Major Cities"],
    applicationProcess: "Online application",
    specialRequirements: "Wait time compensation included",
    payStructure: "80% of delivery fees + wait time",
    benefits: "High percentage of fees, wait time pay",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "Freight.com",
    website: "https://freight.com",
    vehicleTypes: ["Compact Car", "SUV", "Pickup Truck"],
    averagePay: "Varies by load",
    contractType: "Independent Contractor",
    serviceVertical: "Freight/Shipping",
    description: "Matches drivers to businesses. Accepts compact to pickup trucks.",
    requirements: "Valid license, appropriate vehicle",
    areasServed: ["Nationwide"],
    applicationProcess: "Online registration",
    specialRequirements: "Vehicle size requirements vary by job",
    payStructure: "Per load",
    benefits: "Wide range of accepted vehicles",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "GoJitzu",
    website: "https://gojitzu.com",
    vehicleTypes: ["Car", "SUV", "Van"],
    averagePay: "Varies by delivery",
    contractType: "Independent Contractor",
    serviceVertical: "General Courier",
    description: "Simple app signup with flexible courier work opportunities.",
    requirements: "Smartphone, clean driving record",
    areasServed: ["Select Cities"],
    applicationProcess: "Mobile app signup",
    specialRequirements: "App-based platform",
    payStructure: "Per delivery",
    benefits: "Simple signup process, flexible work",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "CourierGigs.com",
    website: "https://couriergigs.com",
    vehicleTypes: ["Any Vehicle"],
    averagePay: "Varies by listing",
    contractType: "Directory Service",
    serviceVertical: "Job Directory",
    description: "Directory site for courier jobs. Filter by city, ZIP, job type (medical, pharma, cargo, etc.).",
    requirements: "Varies by individual job listing",
    areasServed: ["Nationwide"],
    applicationProcess: "Apply to individual listings",
    specialRequirements: "Job board - not direct employer",
    payStructure: "Varies by job",
    benefits: "Comprehensive job filtering, any vehicle type",
    verified: true,
    fraudRisk: "low"
  },
  {
    name: "Drive.com",
    website: "https://drive.com",
    vehicleTypes: ["Car", "SUV", "Van"],
    averagePay: "Weekly payouts",
    contractType: "Independent Contractor",
    serviceVertical: "General Courier",
    description: "Set your own schedule with weekly payouts.",
    requirements: "Valid license, reliable vehicle",
    areasServed: ["Select Markets"],
    applicationProcess: "Online application",
    specialRequirements: "Flexible scheduling",
    payStructure: "Weekly payouts",
    benefits: "Schedule flexibility, weekly pay",
    verified: true,
    fraudRisk: "low"
  }
];

async function addCourierPlatforms() {
  console.log("Adding courier platforms to database...");
  
  try {
    for (const company of newCourierPlatforms) {
      console.log(`Adding: ${company.name}`);
      
      const [insertedCompany] = await db
        .insert(companies)
        .values(company)
        .returning();
      
      console.log(`✅ Added: ${insertedCompany.name} (ID: ${insertedCompany.id})`);
    }
    
    console.log("\n🎉 Successfully added all 9 courier platforms!");
    console.log("Companies added:");
    newCourierPlatforms.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} - ${company.serviceVertical}`);
    });
    
  } catch (error) {
    console.error("Error adding companies:", error);
  }
}

addCourierPlatforms();