import { db } from "./server/db";
import { rideshareCompanies } from "./shared/schema";
import { eq } from "drizzle-orm";

const sampleCompanies = [
  {
    name: "Uber",
    description: "Leading rideshare platform with worldwide coverage for passenger transportation and food delivery.",
    url: "https://uber.com",
    regionCoverage: ["nationwide"],
    vehicleRequirements: "2015+ vehicle, 4-door, good condition",
    avgHourlyEstimate: 18,
    nicheTags: ["rideshare", "food-delivery", "flexible-schedule"],
    onboardingSpeed: "fast",
    payModel: "per-trip-commission"
  },
  {
    name: "Lyft",
    description: "Popular rideshare service focusing on friendly driver-passenger experience.",
    url: "https://lyft.com",
    regionCoverage: ["nationwide"],
    vehicleRequirements: "2011+ vehicle, 4-door, clean interior",
    avgHourlyEstimate: 16,
    nicheTags: ["rideshare", "passenger-transport", "community-focused"],
    onboardingSpeed: "fast",
    payModel: "per-trip-commission"
  },
  {
    name: "DoorDash",
    description: "Leading food delivery platform with extensive restaurant network.",
    url: "https://doordash.com",
    regionCoverage: ["nationwide"],
    vehicleRequirements: "any vehicle, bike, scooter",
    avgHourlyEstimate: 15,
    nicheTags: ["food-delivery", "flexible-vehicle", "peak-hours"],
    onboardingSpeed: "fast",
    payModel: "per-delivery-plus-tips"
  }
];

async function populateRideshareCompanies() {
  try {
    console.log("Populating rideshare companies...");
    
    for (const company of sampleCompanies) {
      const [existingCompany] = await db
        .select()
        .from(rideshareCompanies)
        .where(eq(rideshareCompanies.name, company.name));
      
      if (!existingCompany) {
        await db.insert(rideshareCompanies).values(company);
        console.log(`Added ${company.name}`);
      } else {
        console.log(`${company.name} already exists, skipping`);
      }
    }
    
    console.log("Rideshare companies population complete!");
  } catch (error) {
    console.error("Error populating rideshare companies:", error);
  }
}

// Run if called directly
populateRideshareCompanies().then(() => process.exit(0));

export { populateRideshareCompanies };