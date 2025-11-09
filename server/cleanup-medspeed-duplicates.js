import { db } from "./db.ts";
import { companies, applications } from "../shared/schema.ts";
import { eq, inArray, sql } from "drizzle-orm";

/**
 * Safe cleanup script for MedSpeed duplicates
 * Merges duplicate entries while preserving all user data
 */

async function cleanupMedSpeedDuplicates() {
  console.log("🧹 Starting MedSpeed duplicate cleanup...");
  
  // Get all MedSpeed duplicates
  const medspeedCompanies = await db.select({
    id: companies.id,
    name: companies.name,
    website: companies.website,
    serviceVertical: companies.serviceVertical,
    description: companies.description,
    createdAt: companies.createdAt
  }).from(companies).where(
    // Using case-insensitive matching
    sql`LOWER(name) LIKE '%medspeed%'`
  );
  
  console.log(`Found ${medspeedCompanies.length} MedSpeed entries:`, medspeedCompanies);
  
  if (medspeedCompanies.length <= 1) {
    console.log("✅ No duplicates found, cleanup not needed");
    return;
  }
  
  // Identify the "canonical" company to keep (most complete data)
  let canonicalCompany = medspeedCompanies[0];
  let duplicatesToMerge = [];
  
  // Choose the best company based on completeness
  for (const company of medspeedCompanies) {
    let score = 0;
    
    // Score based on data completeness
    if (company.description && company.description.length > 50) score += 3;
    if (company.website && company.website.includes('https://www.')) score += 2;
    if (company.serviceVertical && company.serviceVertical.includes('Medical')) score += 1;
    
    // Prefer newer entries (they might have better data)
    if (new Date(company.createdAt) > new Date(canonicalCompany.createdAt)) score += 1;
    
    console.log(`Company ${company.name} (ID: ${company.id}) score: ${score}`);
    
    if (score > 0 && company.id !== canonicalCompany.id) {
      // This might be better, compare
      let canonicalScore = 0;
      if (canonicalCompany.description && canonicalCompany.description.length > 50) canonicalScore += 3;
      if (canonicalCompany.website && canonicalCompany.website.includes('https://www.')) canonicalScore += 2;
      if (canonicalCompany.serviceVertical && canonicalCompany.serviceVertical.includes('Medical')) canonicalScore += 1;
      
      if (score > canonicalScore) {
        duplicatesToMerge.push(canonicalCompany);
        canonicalCompany = company;
      } else {
        duplicatesToMerge.push(company);
      }
    } else if (company.id !== canonicalCompany.id) {
      duplicatesToMerge.push(company);
    }
  }
  
  console.log(`📋 Canonical company to keep:`, canonicalCompany);
  console.log(`🗑️ Duplicates to merge:`, duplicatesToMerge.map(c => `${c.name} (ID: ${c.id})`));
  
  if (duplicatesToMerge.length === 0) {
    console.log("✅ No duplicates to merge");
    return;
  }
  
  // Check for existing applications that reference these duplicate companies
  const duplicateIds = duplicatesToMerge.map(c => c.id);
  
  const affectedApplications = await db.select({
    id: applications.id,
    companyId: applications.companyId,
    userId: applications.userId,
    status: applications.status
  }).from(applications).where(
    inArray(applications.companyId, duplicateIds)
  );
  
  console.log(`📊 Found ${affectedApplications.length} applications referencing duplicates`);
  
  if (affectedApplications.length > 0) {
    console.log("🔄 Updating applications to reference canonical company...");
    
    // Update applications to point to canonical company
    for (const app of affectedApplications) {
      await db.update(applications)
        .set({ companyId: canonicalCompany.id })
        .where(eq(applications.id, app.id));
      
      console.log(`  ✅ Updated application ${app.id} (User: ${app.userId}) from company ${app.companyId} to ${canonicalCompany.id}`);
    }
  }
  
  // Update the canonical company with the best available data from all duplicates
  const updatedData = {
    name: "MedSpeed", // Standardize the name
    website: "https://www.medspeed.com", // Use the standard website
    description: canonicalCompany.description || findBestDescription(medspeedCompanies),
    serviceVertical: ["Medical"], // Standardize service vertical
  };
  
  console.log("📝 Updating canonical company with merged data...");
  await db.update(companies)
    .set(updatedData)
    .where(eq(companies.id, canonicalCompany.id));
  
  console.log(`  ✅ Updated canonical company ${canonicalCompany.id} with standardized data`);
  
  // Delete the duplicate companies
  console.log("🗑️ Removing duplicate companies...");
  for (const duplicate of duplicatesToMerge) {
    await db.delete(companies).where(eq(companies.id, duplicate.id));
    console.log(`  ✅ Deleted duplicate company: ${duplicate.name} (ID: ${duplicate.id})`);
  }
  
  console.log("🎉 MedSpeed duplicate cleanup completed successfully!");
  console.log(`📊 Final result: 1 canonical MedSpeed company (ID: ${canonicalCompany.id})`);
  
  return {
    canonicalCompany: canonicalCompany,
    mergedDuplicates: duplicatesToMerge.length,
    updatedApplications: affectedApplications.length
  };
}

function findBestDescription(companies) {
  // Find the longest, most detailed description
  let bestDescription = "";
  
  for (const company of companies) {
    if (company.description && company.description.length > bestDescription.length) {
      bestDescription = company.description;
    }
  }
  
  return bestDescription || "Market leader in healthcare same-day logistics providing medical courier services nationwide. Specializes in time-critical medical deliveries and healthcare supply chain management.";
}

// Export for use in other scripts
export {
  cleanupMedSpeedDuplicates
};

// Run if called directly
if (import.meta.main) {
  cleanupMedSpeedDuplicates()
    .then(result => {
      console.log("✅ Cleanup completed:", result);
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Cleanup failed:", error);
      process.exit(1);
    });
}