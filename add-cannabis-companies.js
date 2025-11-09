const { db } = require('./server/db.ts');
const { companies } = require('./shared/schema.ts');

const cannabisCompanies = [
  {
    name: "Berkeley Patients Group",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$15-25/hour",
    vehicleTypes: ["Car", "SUV"],
    areasServed: "Berkeley, CA area",
    insuranceRequired: "Auto insurance required",
    licenseRequired: "Valid driver's license, Cannabis handler permit",
    certifications: "Cannabis compliance training",
    website: "https://www.berkeleypatientsgroup.com",
    phone: "(510) 548-8200"
  },
  {
    name: "People's California",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor", 
    averagePay: "$18-28/hour",
    vehicleTypes: ["Car", "SUV"],
    areasServed: "California statewide",
    insuranceRequired: "Commercial auto insurance",
    licenseRequired: "Valid driver's license, State cannabis permit",
    certifications: "Cannabis delivery certification",
    website: "https://www.peoplesca.com",
    phone: "(555) 420-7777"
  },
  {
    name: "Ohana Gardens",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$16-24/hour",
    vehicleTypes: ["Car", "SUV", "Van"],
    areasServed: "Los Angeles County",
    insuranceRequired: "Auto insurance required",
    licenseRequired: "Valid driver's license, Cannabis transport license",
    certifications: "State compliance training",
    website: "https://www.ohanagardens.com",
    phone: "(323) 555-0123"
  },
  {
    name: "Embere Delivery",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$20-30/hour",
    vehicleTypes: ["Car", "SUV"],
    areasServed: "San Francisco Bay Area",
    insuranceRequired: "Commercial vehicle insurance",
    licenseRequired: "Valid driver's license, Cannabis delivery permit",
    certifications: "Cannabis handling certification",
    website: "https://www.emberedelivery.com",
    phone: "(415) 555-0199"
  },
  {
    name: "The Green Solution",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$17-26/hour",
    vehicleTypes: ["Car", "SUV", "Pickup Truck"],
    areasServed: "Denver, Colorado metro",
    insuranceRequired: "Auto insurance required",
    licenseRequired: "Valid driver's license, State cannabis badge",
    certifications: "Colorado cannabis compliance",
    website: "https://www.tgscolorado.com",
    phone: "(303) 555-0147"
  },
  {
    name: "Gardenhouse",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$19-27/hour",
    vehicleTypes: ["Car", "SUV"],
    areasServed: "Orange County, CA",
    insuranceRequired: "Commercial auto insurance",
    licenseRequired: "Valid driver's license, Cannabis transport permit",
    certifications: "Cannabis safety training",
    website: "https://www.gardenhouse.com",
    phone: "(714) 555-0166"
  },
  {
    name: "Vangst",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$16-25/hour",
    vehicleTypes: ["Car", "SUV", "Van"],
    areasServed: "Multiple states",
    insuranceRequired: "Auto insurance required",
    licenseRequired: "Valid driver's license, State cannabis license",
    certifications: "Cannabis industry training",
    website: "https://www.vangst.com",
    phone: "(720) 555-0188"
  },
  {
    name: "Flower Company",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$18-26/hour",
    vehicleTypes: ["Car", "SUV"],
    areasServed: "Portland, Oregon area",
    insuranceRequired: "Auto insurance required",
    licenseRequired: "Valid driver's license, Oregon cannabis permit",
    certifications: "Oregon cannabis compliance",
    website: "https://www.flowercompany.com",
    phone: "(503) 555-0177"
  },
  {
    name: "bud.com",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$20-28/hour",
    vehicleTypes: ["Car", "SUV"],
    areasServed: "California major cities",
    insuranceRequired: "Commercial auto insurance",
    licenseRequired: "Valid driver's license, Cannabis delivery license",
    certifications: "Cannabis delivery certification",
    website: "https://www.bud.com",
    phone: "(888) 555-0123"
  },
  {
    name: "Amuse",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$17-25/hour",
    vehicleTypes: ["Car", "SUV"],
    areasServed: "Nevada statewide",
    insuranceRequired: "Auto insurance required",
    licenseRequired: "Valid driver's license, Nevada cannabis agent card",
    certifications: "Nevada cannabis training",
    website: "https://www.amusenevada.com",
    phone: "(702) 555-0155"
  },
  {
    name: "MedMen",
    serviceVertical: "Cannabis Delivery",
    contractType: "Independent Contractor",
    averagePay: "$19-29/hour",
    vehicleTypes: ["Car", "SUV"],
    areasServed: "Multiple states",
    insuranceRequired: "Commercial vehicle insurance",
    licenseRequired: "Valid driver's license, State cannabis permit",
    certifications: "Cannabis compliance certification",
    website: "https://www.medmen.com",
    phone: "(855) 633-6363"
  }
];

async function addCannabisCompanies() {
  try {
    console.log('Adding', cannabisCompanies.length, 'cannabis companies...');
    
    for (const company of cannabisCompanies) {
      await db.insert(companies).values({
        ...company,
        vehicleTypes: company.vehicleTypes.join(', '),
        isDeleted: false,
        workflowStatus: null
      });
      console.log('✓ Added:', company.name);
    }
    
    console.log('\nSuccessfully added all cannabis companies!');
  } catch (error) {
    console.error('Error adding companies:', error.message);
  }
}

addCannabisCompanies();