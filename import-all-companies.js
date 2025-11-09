import fs from 'fs';

// Direct company data from PDF
const companies = [
  {
    name: "Dropoff",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Van (less than 10 years old)",
    areasServed: "New York City, Albany, Rochester, Syracuse, Newark, Miami, Fort Lauderdale, Fort Myers, Jacksonville, Tampa, Orlando, Atlanta, Austin, Dallas, El Paso, Fort Worth, Houston, San Antonio, Los Angeles, Las Vegas, Nashville, Memphis, New Orleans, Lafayette, Philadelphia, Pittsburgh, Harrisburg, Raleigh, Durham, Chicago, Denver, Phoenix, Oklahoma City, Birmingham, Huntsville, Detroit, Grand Rapids, Lansing",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Medical Couriers",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Minivan, Cargo Van, Box Truck",
    areasServed: "Washington State, Oregon, California, Nevada, Montana, Idaho, Wyoming, Utah, Arizona, Colorado, New Mexico, Kansas, Oklahoma, Texas, Minneapolis, Iowa, Missouri, Arizona, Louisiana, Wisconsin, Illinois, Mississippi, Missouri, Indiana, Tennessee, Alabama, Ohio, Georgia, Florida, New York, Pennsylvania, Virginia, North Carolina, Vermont, New Jersey, Delaware, Washington DC, New Hampshire, Massachusetts, Connecticut, Maryland, Rhode Island",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Lab Logistics",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Minivan, Cargo Van, Box Truck",
    areasServed: "All 50 states",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Associated Couriers",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Pick-Up, Mini-Van, SUV, Cargo Van, Sprinter, Box Truck",
    areasServed: "New York, Missouri, Ohio, Georgia, Massachusetts, North Carolina, Illinois, Ohio, Texas, Michigan, New Jersey, Florida, Tennessee, Minneapolis, New England, Arizona, Missouri",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Fleet Couriers",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Pick-Up, Mini-Van, SUV, Cargo Van, Sprinter, Box Truck",
    areasServed: "New England, New Hampshire, Rhode Island",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Senpex",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Cargo Van, Box Truck",
    areasServed: "California, New York",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Frayt",
    serviceVertical: "General Courier",
    vehicleTypes: "Car and Mid-sized, SUV, Cargo/Sprinter Van, Box Truck",
    areasServed: "Atlanta, Boston, Austin, Dallas, Houston, San Antonio, Los Angeles, San Francisco Bay Area, Baltimore, Birmingham, Chicago, Detroit, Denver, Orlando, Tampa, Indianapolis, Kansas City, Las Vegas, Nashville, Memphis, Milwaukee, Minneapolis, New Orleans, New York City, Oklahoma City, Phoenix, Portland, Salt Lake City, Seattle, Virginia Beach, Washington",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "GoShare Driver",
    serviceVertical: "General Courier",
    vehicleTypes: "Pickup Truck, Cargo Van, Box Truck",
    areasServed: "All 50 States",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Point Pickup",
    serviceVertical: "General Courier",
    vehicleTypes: "Car, SUV, Pickup Truck, Cargo Van",
    areasServed: "All 50 States",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Ontrac",
    serviceVertical: "Auto Parts Delivery",
    vehicleTypes: "Car, SUV, Pickup Truck, Cargo Van",
    areasServed: "Arizona, California, Colorado, Nevada, Oregon, Utah, Washington",
    contractType: "Independent Contractor",
    averagePay: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  }
];

async function importAllCompanies() {
  try {
    console.log(`Importing ${companies.length} companies...`);
    
    const response = await fetch('http://localhost:5000/api/companies/bulk-import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companies })
    });

    const result = await response.json();
    console.log('Import result:', result);
    
    if (result.success) {
      console.log(`✅ Successfully imported ${result.addedCount} companies`);
      console.log(`⚠️ Skipped ${result.skippedCount} duplicates`);
      if (result.addedCompanies && result.addedCompanies.length > 0) {
        console.log('Added companies:', result.addedCompanies.join(', '));
      }
    }
  } catch (error) {
    console.error('Import failed:', error);
  }
}

importAllCompanies();