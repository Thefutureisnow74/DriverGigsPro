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

/**
 * UNIFIED SEARCH CRITERIA FRAMEWORK
 * 
 * This comprehensive framework integrates proven search strategies with bulletproof
 * duplicate prevention for systematic database expansion across all delivery sectors.
 */

// ============================================================================
// 1. GENERAL DELIVERY COMPANIES - Search Terms
// ============================================================================
const GENERAL_DELIVERY_SEARCH_TERMS = [
  // Core delivery services
  "last mile delivery companies",
  "same day delivery services", 
  "courier services + [city/state]",
  "regional logistics companies",
  "non-CDL delivery jobs",
  "delivery startups founded in [recent year]",
  "e-commerce delivery partners",
  
  // Dedicated route focus
  "dedicated delivery routes",
  "dedicated courier routes",
  "contract delivery routes",
  "scheduled delivery services",
  "route-based delivery companies",
  "regular route delivery jobs",
  "dedicated route drivers needed",
  "contract route delivery services",
  "recurring delivery routes",
  "established delivery routes",
  
  // Independent contractor focus
  "independent courier companies near [city/state]",
  "1099 delivery driver jobs",
  "contractor delivery driver jobs",
  "independent delivery contractors",
  "gig courier app",
  "driver subcontractor courier service",
  "become a delivery courier contractor",
  "apply courier driver independent contractor"
];

// ============================================================================
// 2. MEDICAL DELIVERY COMPANIES - Enhanced Search Terms (Updated from SDS Rx Analysis)
// ============================================================================
const MEDICAL_DELIVERY_SEARCH_TERMS = [
  // Core medical delivery
  "medical delivery services",
  "medical courier jobs", 
  "pharmacy delivery companies",
  "hospital courier services",
  "specimen transport services",
  "lab courier companies",
  "blood transport delivery companies",
  "organ and tissue transport logistics",
  "diagnostic courier delivery",
  "healthcare delivery specialists",
  "healthcare logistics providers",
  "pharmaceutical courier services",
  "medical supply delivery",
  "radiology courier services",
  "blood bank transport",
  "organ transport services",
  "medical device delivery",
  "pharmaceutical distribution",
  
  // Specialized medical transport
  "durable medical equipment delivery",
  "non-emergency medical transportation delivery",
  "HIPAA-compliant delivery services",
  "pathology courier services",
  "oncology drug delivery logistics",
  "clinical trial logistics couriers",
  "biological sample transport services",
  "home infusion delivery service",
  "nuclear medicine courier delivery",
  "surgical instrument delivery logistics",
  "STAT courier companies + [city/state]",
  "prescription medication delivery",
  "lab specimen transport",
  "medical supplies courier",
  "nuclear medicines delivery",
  "medical waste transport",
  "temperature controlled medical delivery",
  "chain of custody medical transport",
  
  // Dedicated medical route focus
  "dedicated medical delivery routes",
  "contract medical courier services",
  "scheduled medical deliveries",
  "recurring medical transport routes",
  "regular hospital courier routes",
  "dedicated pharmacy delivery routes",
  "contract lab courier services",
  "scheduled specimen pickup routes",
  "medical logistics specialists",
  "healthcare supply chain delivery",
  
  // Independent contractor medical focus
  "independent pharmacy delivery service [city/state]",
  "1099 medical courier jobs",
  "contractor medical delivery driver jobs",
  "independent delivery contractors healthcare",
  "gig courier app healthcare",
  "become a medical courier contractor",
  "apply medical courier driver independent contractor",
  
  // Quality indicators (to avoid SDS Rx-type errors)
  "HIPAA certified delivery",
  "medical courier compliance",
  "temperature monitored transport",
  "chain of custody delivery",
  "medical incident-free record",
  "healthcare delivery specialists",
  "medical logistics professionals"
];

// ============================================================================
// 3. DOCUMENT DELIVERY COMPANIES - Specialized Search Terms
// ============================================================================
const DOCUMENT_DELIVERY_SEARCH_TERMS = [
  // Legal courier services
  "legal courier services",
  "court document delivery",
  "process serving companies",
  "law firm courier services",
  "legal document transport",
  "court filing delivery services",
  "attorney courier services",
  "legal papers delivery",
  "litigation support couriers",
  "summons and subpoena delivery",
  
  // Business document services
  "business document delivery",
  "corporate courier services",
  "contract delivery services", 
  "confidential document transport",
  "corporate mailroom services",
  "executive document delivery",
  "same-day document courier",
  "urgent document delivery",
  "inter-office delivery services",
  "document pickup and delivery",
  
  // Financial document services
  "financial document courier",
  "bank document delivery",
  "loan document services",
  "mortgage document courier",
  "insurance document delivery",
  "notary document transport",
  "real estate document courier",
  "title document delivery",
  "escrow document services",
  "financial institution courier",
  
  // Government document services
  "government document delivery",
  "permit delivery services",
  "license document courier",
  "municipal document transport",
  "county document delivery",
  "state document courier services",
  "regulatory filing delivery",
  "government agency courier",
  "public records delivery",
  "official document transport",
  
  // Specialized document transport
  "rush document delivery",
  "overnight document courier",
  "secure document transport",
  "chain of custody document delivery",
  "archived document services",
  "records management courier",
  "confidential file transport",
  "time-sensitive document delivery",
  "authenticated document courier",
  "certified document delivery",
  
  // Dedicated document route focus
  "dedicated document delivery routes",
  "contract legal courier services",
  "scheduled court document pickup",
  "recurring legal delivery routes",
  "regular law firm courier services",
  "dedicated business document routes",
  "contract financial document delivery",
  "scheduled government filing routes",
  
  // Independent contractor focus
  "independent document courier jobs",
  "1099 document delivery driver",
  "contractor legal courier jobs",
  "freelance document delivery",
  "document courier contractor opportunities",
  "become a legal courier driver",
  "apply document delivery contractor",
  "court courier driver jobs"
];

// ============================================================================
// 4. VERIFICATION STANDARDS - Automated Validation
// ============================================================================
const VERIFICATION_CHECKLIST = {
  businessPresence: [
    "Professional website with contact information",
    "Verified Google Business Profile",
    "Listed service areas and coverage"
  ],
  
  driverOpportunities: [
    "Clearly states they hire independent contractors or drivers",
    "Lists accepted vehicle types (cars, vans, SUVs, box trucks)",
    "Provides pay details or rate information",
    "Application process or contact for drivers"
  ],
  
  medicalSpecific: [
    "HIPAA compliance mentioned",
    "Chain-of-custody protocols for specimens",
    "Vendor credentialing (hospitals/labs)",
    "Requirements like insulated bags or coolers",
    "Medical certifications or training requirements"
  ],
  
  marketPresence: [
    "Recent press mentions or news articles",
    "Active social media accounts",
    "Job postings on Indeed, Craigslist, or other platforms",
    "Customer reviews and testimonials",
    "Industry association memberships"
  ]
};

// ============================================================================
// 4. EXCLUSIONS - Quality Control Filters
// ============================================================================
const EXCLUSION_CRITERIA = [
  "Freight or trucking companies requiring CDL",
  "Inactive or defunct companies",
  "Scam or fake listings with no real driver opportunities", 
  "Pure technology platforms that don't hire drivers directly",
  "Furniture-only or moving companies",
  "Companies without clear independent contractor opportunities"
];

// ============================================================================
// 5. RESEARCH SOURCES - Comprehensive Coverage
// ============================================================================
const RESEARCH_SOURCES = [
  // Industry publications
  "Industry logistics and courier news publications",
  "Startup funding announcements",
  "Regional business directories (Chamber of Commerce, YellowPages, BBB)",
  "Professional networking sites like LinkedIn",
  
  // Government and official sources
  "Government contractor/vendor databases",
  "Healthcare provider networks", 
  "Hospital procurement and vendor credentialing systems",
  "Pharmacy distributor and vendor lists",
  
  // Industry associations
  "CLDA (Customized Logistics & Delivery Association)",
  "Courier industry associations",
  "Medical transport organizations",
  "Regional courier networks"
];

// ============================================================================
// 6. ENHANCED DUPLICATE PREVENTION SYSTEM - Comprehensive Protection
// ============================================================================

// Import enhanced duplicate detection
import { checkCompanyDuplicates, createCompanyWithEnhancedDuplicateCheck } from './server/enhanced-duplicate-detection.js';

/**
 * Legacy function for backward compatibility
 * Now uses the enhanced duplicate detection system
 */
async function checkCompanyExists(name, website) {
  const result = await checkCompanyDuplicates(name, website);
  
  if (result.hasDuplicates && result.duplicates.length > 0) {
    const bestMatch = result.duplicates[0];
    return { 
      exists: true, 
      reason: bestMatch.matchReasons[0], 
      company: bestMatch.existing,
      confidence: bestMatch.confidence,
      allDuplicates: result.duplicates
    };
  }
  
  return { exists: false, reason: null, company: null };
}

/**
 * Safe company creation with enhanced duplicate prevention
 * Returns detailed results for tracking and verification
 */
async function createCompanyWithDuplicateCheck(companyData) {
  try {
    // Use enhanced duplicate detection system
    const duplicateCheck = await createCompanyWithEnhancedDuplicateCheck(companyData);
    
    if (duplicateCheck.isDuplicate) {
      return {
        success: false,
        action: 'skipped',
        reason: duplicateCheck.message,
        existingCompany: duplicateCheck.bestMatch?.existing || null,
        newCompany: null,
        confidence: duplicateCheck.bestMatch?.confidence || 0,
        duplicateInfo: duplicateCheck.duplicateInfo
      };
    }
    
    // Validate required fields
    if (!companyData.name || !companyData.serviceVertical) {
      return {
        success: false,
        action: 'error',
        reason: 'Missing required fields (name, serviceVertical)',
        existingCompany: null,
        newCompany: null
      };
    }
    
    // Create new company
    const [result] = await db.insert(companies).values({
      name: companyData.name,
      serviceVertical: companyData.serviceVertical,
      vehicleTypes: companyData.vehicleTypes || [],
      areasServed: companyData.areasServed || "Not specified",
      contractType: companyData.contractType || "Independent Contractor",
      averagePay: companyData.averagePay || "Competitive",
      insuranceRequirements: companyData.insuranceRequirements || "Auto insurance required",
      licenseRequirements: companyData.licenseRequirements || "Valid driver license",
      certificationsRequired: companyData.certificationsRequired || "",
      description: companyData.description || "",
      website: companyData.website || "",
      workflowStatus: companyData.workflowStatus || null,
      isActive: companyData.isActive !== false // Default to true
    }).returning();
    
    return {
      success: true,
      action: 'added',
      reason: 'Successfully created new company',
      existingCompany: null,
      newCompany: result
    };
    
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      return {
        success: false,
        action: 'skipped',
        reason: 'Database duplicate key constraint',
        existingCompany: null,
        newCompany: null
      };
    }
    
    return {
      success: false,
      action: 'error',
      reason: `Database error: ${error.message}`,
      existingCompany: null,
      newCompany: null
    };
  }
}

// ============================================================================
// 7. BATCH PROCESSING WITH COMPREHENSIVE REPORTING
// ============================================================================

/**
 * Process multiple companies with detailed tracking and reporting
 */
async function processBatchCompanies(companiesArray, batchName = "Unknown Batch") {
  console.log(`\n🚀 Processing ${batchName}...`);
  console.log(`📋 Total companies to process: ${companiesArray.length}`);
  
  const results = {
    added: [],
    skipped: [],
    errors: [],
    summary: {
      totalProcessed: 0,
      successfullyAdded: 0,
      skippedDuplicates: 0,
      errors: 0
    }
  };
  
  for (let i = 0; i < companiesArray.length; i++) {
    const company = companiesArray[i];
    console.log(`\n[${i + 1}/${companiesArray.length}] Processing: ${company.name}`);
    
    const result = await createCompanyWithDuplicateCheck(company);
    results.summary.totalProcessed++;
    
    switch (result.action) {
      case 'added':
        console.log(`✅ Added: ${company.name} (ID: ${result.newCompany.id})`);
        results.added.push({ company, result });
        results.summary.successfullyAdded++;
        break;
        
      case 'skipped':
        console.log(`⚠️  Skipped: ${company.name} - ${result.reason}`);
        if (result.existingCompany) {
          console.log(`   Existing ID: ${result.existingCompany.id}`);
        }
        results.skipped.push({ company, result });
        results.summary.skippedDuplicates++;
        break;
        
      case 'error':
        console.log(`❌ Error: ${company.name} - ${result.reason}`);
        results.errors.push({ company, result });
        results.summary.errors++;
        break;
    }
  }
  
  // Final summary report
  console.log(`\n📊 ${batchName} - Final Results:`);
  console.log(`✅ Successfully added: ${results.summary.successfullyAdded}`);
  console.log(`⚠️  Skipped (duplicates): ${results.summary.skippedDuplicates}`);
  console.log(`❌ Errors: ${results.summary.errors}`);
  console.log(`🎯 Total processed: ${results.summary.totalProcessed}`);
  
  // Get updated database count
  const [totalResult] = await db.select({ count: sql`count(*)` }).from(companies).where(eq(companies.isActive, true));
  console.log(`📈 Total active companies in database: ${totalResult.count}`);
  
  return results;
}

// ============================================================================
// 8. SYSTEMATIC EXPANSION STRATEGY
// ============================================================================

/**
 * Coordinated expansion approach using unified search criteria
 * Ensures comprehensive coverage without duplication
 */
class DatabaseExpansionStrategy {
  constructor() {
    this.searchTerms = {
      general: GENERAL_DELIVERY_SEARCH_TERMS,
      medical: MEDICAL_DELIVERY_SEARCH_TERMS,
      document: DOCUMENT_DELIVERY_SEARCH_TERMS,
      food: FOOD_DELIVERY_SEARCH_TERMS,
      freight: FREIGHT_DELIVERY_SEARCH_TERMS,
      rideshare: RIDESHARE_TRANSPORT_SEARCH_TERMS,
      cannabis: CANNABIS_DELIVERY_SEARCH_TERMS,
      pet: PET_TRANSPORT_SEARCH_TERMS,
      senior: SENIOR_SERVICES_SEARCH_TERMS,
      air: AIR_TRANSPORT_SEARCH_TERMS,
      vehicle: VEHICLE_TRANSPORT_SEARCH_TERMS,
      luggage: LUGGAGE_DELIVERY_SEARCH_TERMS,
      child: CHILD_TRANSPORT_SEARCH_TERMS
    };
    this.verification = VERIFICATION_CHECKLIST;
    this.exclusions = EXCLUSION_CRITERIA;
    this.sources = RESEARCH_SOURCES;
  }
  
  /**
   * Generate targeted search queries for specific regions/sectors
   */
  generateSearchQueries(sector, region = null) {
    const baseTerms = this.searchTerms[sector] || this.searchTerms.general;
    
    if (region) {
      return baseTerms.map(term => term.replace('[city/state]', region));
    }
    
    return baseTerms;
  }
  
  /**
   * Validate company against verification checklist
   */
  validateCompany(companyData) {
    const score = {
      businessPresence: 0,
      driverOpportunities: 0,
      marketPresence: 0,
      medicalSpecific: 0
    };
    
    // Implementation would check each criterion
    // This is a framework for systematic validation
    
    return score;
  }
  
  /**
   * Generate expansion report
   */
  async generateExpansionReport() {
    const [totalCompanies] = await db.select({ count: sql`count(*)` }).from(companies);
    const [activeCompanies] = await db.select({ count: sql`count(*)` }).from(companies).where(eq(companies.isActive, true));
    
    console.log('\n📊 DATABASE EXPANSION STATUS REPORT');
    console.log('=====================================');
    console.log(`📈 Total companies: ${totalCompanies.count}`);
    console.log(`✅ Active companies: ${activeCompanies.count}`);
    console.log(`🔍 Search criteria integrated: ${Object.keys(this.searchTerms).length} categories`);
    console.log(`✔️  Verification standards: ${Object.keys(this.verification).length} categories`);
    console.log(`❌ Exclusion filters: ${this.exclusions.length} criteria`);
    console.log(`📚 Research sources: ${this.sources.length} channels`);
    
    return {
      totalCompanies: totalCompanies.count,
      activeCompanies: activeCompanies.count,
      searchCategories: Object.keys(this.searchTerms).length,
      verificationStandards: Object.keys(this.verification).length,
      exclusionFilters: this.exclusions.length,
      researchSources: this.sources.length
    };
  }
}

// ============================================================================
// 4. FOOD DELIVERY COMPANIES - Dedicated Route Search Terms
// ============================================================================
const FOOD_DELIVERY_SEARCH_TERMS = [
  // Core food delivery
  "food delivery services",
  "meal delivery companies",
  "restaurant delivery drivers",
  "grocery delivery services",
  "catering delivery companies",
  
  // Dedicated food route focus
  "dedicated food delivery routes",
  "contract meal delivery services",
  "scheduled restaurant delivery routes",
  "recurring grocery delivery routes",
  "regular catering delivery routes",
  "dedicated kitchen delivery services",
  "contract food service delivery",
  "scheduled meal prep delivery routes"
];

// ============================================================================
// 5. FREIGHT DELIVERY COMPANIES - Non-CDL Dedicated Routes
// ============================================================================
const FREIGHT_DELIVERY_SEARCH_TERMS = [
  // Non-CDL freight
  "non-CDL freight delivery",
  "small freight courier services",
  "LTL freight delivery",
  "expedited freight services",
  "freight van delivery",
  
  // Dedicated freight route focus
  "dedicated freight routes non-CDL",
  "contract freight delivery services",
  "scheduled freight pickup routes",
  "recurring freight delivery routes",
  "regular freight courier routes",
  "dedicated cargo delivery routes",
  "contract logistics delivery services",
  "scheduled freight transport routes"
];

// ============================================================================
// 6. RIDESHARE & TRANSPORT COMPANIES - Dedicated Service Areas
// ============================================================================
const RIDESHARE_TRANSPORT_SEARCH_TERMS = [
  // Rideshare services
  "rideshare companies",
  "ride sharing services",
  "passenger transport services",
  "taxi companies",
  "transportation network companies",
  
  // Dedicated transport route focus
  "dedicated rideshare zones",
  "contract ride services",
  "scheduled transport services",
  "recurring passenger routes",
  "regular ride service areas",
  "dedicated transportation routes",
  "contract passenger services",
  "scheduled ride sharing routes"
];

// ============================================================================
// 7. CANNABIS DELIVERY COMPANIES - Licensed Route Services
// ============================================================================
const CANNABIS_DELIVERY_SEARCH_TERMS = [
  // Cannabis delivery
  "cannabis delivery services",
  "marijuana delivery companies",
  "dispensary delivery drivers",
  "cannabis courier services",
  "licensed cannabis delivery",
  
  // Dedicated cannabis route focus
  "dedicated cannabis delivery routes",
  "contract dispensary delivery services",
  "scheduled cannabis pickup routes",
  "recurring marijuana delivery routes",
  "regular dispensary courier routes",
  "dedicated licensed delivery routes",
  "contract cannabis transport services",
  "scheduled dispensary delivery routes"
];

// ============================================================================
// 8. PET TRANSPORT COMPANIES - Dedicated Animal Services
// ============================================================================
const PET_TRANSPORT_SEARCH_TERMS = [
  // Pet transport
  "pet transport services",
  "animal delivery companies",
  "pet taxi services",
  "veterinary transport",
  "pet relocation services",
  
  // Dedicated pet route focus
  "dedicated pet transport routes",
  "contract animal delivery services",
  "scheduled pet pickup routes",
  "recurring veterinary transport routes",
  "regular pet taxi routes",
  "dedicated animal courier routes",
  "contract pet transport services",
  "scheduled animal delivery routes"
];

// ============================================================================
// 9. SENIOR SERVICES COMPANIES - Dedicated Care Routes
// ============================================================================
const SENIOR_SERVICES_SEARCH_TERMS = [
  // Senior services
  "senior transportation services",
  "elderly transport companies",
  "senior care delivery",
  "medical transport for seniors",
  "senior service providers",
  
  // Dedicated senior route focus
  "dedicated senior transport routes",
  "contract elderly care services",
  "scheduled senior pickup routes",
  "recurring senior care routes",
  "regular elderly transport routes",
  "dedicated senior service routes",
  "contract senior transportation",
  "scheduled senior care delivery routes"
];

// ============================================================================
// 10. AIR TRANSPORT COMPANIES - Ground Support Services
// ============================================================================
const AIR_TRANSPORT_SEARCH_TERMS = [
  // Air transport ground services
  "airport ground services",
  "airline cargo delivery",
  "airport courier services",
  "aviation ground transport",
  "air freight ground delivery",
  
  // Dedicated air transport route focus
  "dedicated airport delivery routes",
  "contract airline ground services",
  "scheduled airport pickup routes",
  "recurring aviation delivery routes",
  "regular airport courier routes",
  "dedicated air cargo routes",
  "contract airport transport services",
  "scheduled airline delivery routes"
];

// ============================================================================
// 11. VEHICLE TRANSPORT COMPANIES - Car Delivery Services
// ============================================================================
const VEHICLE_TRANSPORT_SEARCH_TERMS = [
  // Vehicle transport
  "vehicle transport services",
  "car delivery companies",
  "auto transport services",
  "vehicle relocation services",
  "car shipping companies",
  
  // Dedicated vehicle route focus
  "dedicated vehicle transport routes",
  "contract car delivery services",
  "scheduled vehicle pickup routes",
  "recurring auto transport routes",
  "regular car delivery routes",
  "dedicated auto transport routes",
  "contract vehicle delivery services",
  "scheduled car transport routes"
];

// ============================================================================
// 12. LUGGAGE DELIVERY COMPANIES - Travel Support Services
// ============================================================================
const LUGGAGE_DELIVERY_SEARCH_TERMS = [
  // Luggage services
  "luggage delivery services",
  "baggage transport companies",
  "travel luggage delivery",
  "airport luggage services",
  "hotel luggage delivery",
  
  // Dedicated luggage route focus
  "dedicated luggage delivery routes",
  "contract baggage transport services",
  "scheduled luggage pickup routes",
  "recurring travel delivery routes",
  "regular luggage courier routes",
  "dedicated baggage delivery routes",
  "contract luggage transport services",
  "scheduled travel luggage routes"
];

// ============================================================================
// 13. CHILD TRANSPORT COMPANIES - Safe Transport Services
// ============================================================================
const CHILD_TRANSPORT_SEARCH_TERMS = [
  // Child transport
  "child transport services",
  "school transportation companies",
  "kids taxi services",
  "childcare transport",
  "youth transportation services",
  
  // Dedicated child transport route focus
  "dedicated child transport routes",
  "contract school transport services",
  "scheduled child pickup routes",
  "recurring school transport routes",
  "regular kids transport routes",
  "dedicated childcare transport routes",
  "contract youth transportation",
  "scheduled child delivery routes"
];

// ============================================================================
// 9. EXPORT FUNCTIONS FOR MODULAR USE
// ============================================================================

export {
  checkCompanyExists,
  createCompanyWithDuplicateCheck,
  processBatchCompanies,
  DatabaseExpansionStrategy,
  GENERAL_DELIVERY_SEARCH_TERMS,
  MEDICAL_DELIVERY_SEARCH_TERMS,
  DOCUMENT_DELIVERY_SEARCH_TERMS,
  FOOD_DELIVERY_SEARCH_TERMS,
  FREIGHT_DELIVERY_SEARCH_TERMS,
  RIDESHARE_TRANSPORT_SEARCH_TERMS,
  CANNABIS_DELIVERY_SEARCH_TERMS,
  PET_TRANSPORT_SEARCH_TERMS,
  SENIOR_SERVICES_SEARCH_TERMS,
  AIR_TRANSPORT_SEARCH_TERMS,
  VEHICLE_TRANSPORT_SEARCH_TERMS,
  LUGGAGE_DELIVERY_SEARCH_TERMS,
  CHILD_TRANSPORT_SEARCH_TERMS,
  VERIFICATION_CHECKLIST,
  EXCLUSION_CRITERIA,
  RESEARCH_SOURCES
};

// ============================================================================
// 10. DEMONSTRATION USAGE
// ============================================================================

async function demonstrateFramework() {
  console.log('🎯 UNIFIED SEARCH CRITERIA FRAMEWORK DEMONSTRATION');
  console.log('==================================================');
  
  const strategy = new DatabaseExpansionStrategy();
  
  // Generate search queries for medical delivery in Texas
  console.log('\n🔍 Sample Search Queries (Medical Delivery - Texas):');
  const texasMedicalQueries = strategy.generateSearchQueries('medical', 'Texas');
  texasMedicalQueries.slice(0, 5).forEach((query, index) => {
    console.log(`${index + 1}. ${query}`);
  });
  
  // Generate search queries for document delivery
  console.log('\n🔍 Sample Search Queries (Document Delivery):');
  const documentQueries = strategy.generateSearchQueries('document');
  documentQueries.slice(0, 5).forEach((query, index) => {
    console.log(`${index + 1}. ${query}`);
  });
  
  // Show verification checklist
  console.log('\n✅ Verification Standards:');
  Object.entries(strategy.verification).forEach(([category, criteria]) => {
    console.log(`\n${category}:`);
    criteria.forEach(criterion => console.log(`  • ${criterion}`));
  });
  
  // Generate expansion report
  await strategy.generateExpansionReport();
  
  console.log('\n🚀 Framework ready for systematic database expansion!');
}

// Run demonstration if called directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  demonstrateFramework().finally(() => pool.end());
}