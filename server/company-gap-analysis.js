/**
 * Company Gap Analysis Tool
 * Identifies missing companies in our database by analyzing industry patterns
 * and competitor landscapes to prevent gaps like the STAT-Logix situation
 */

const { db } = require('./db');
const { companies } = require('../shared/schema');
const { sql } = require('drizzle-orm');

// Use the storage interface for consistent data access
const { storage } = require('./storage');

// Common medical courier company naming patterns
const MEDICAL_COURIER_PATTERNS = [
  'stat',
  'med',
  'medical',
  'bio',
  'lab',
  'specimen',
  'pharma',
  'health',
  'clinic',
  'hospital',
  'urgent',
  'rush',
  'express',
  'logix',
  'logistics'
];

// Industry leaders that should be in our database
const INDUSTRY_LEADERS = [
  { name: 'STAT-Logix', website: 'stat-logix.com', vertical: 'Medical' },
  { name: 'Quest Diagnostics', website: 'questdiagnostics.com', vertical: 'Medical' },
  { name: 'LabCorp', website: 'labcorp.com', vertical: 'Medical' },
  { name: 'BioReference Laboratories', website: 'bioreference.com', vertical: 'Medical' },
  { name: 'Sonic Healthcare', website: 'sonichealthcareusa.com', vertical: 'Medical' },
  { name: 'Diligent Delivery Systems', website: 'diligentusa.com', vertical: 'Medical' },
  { name: 'MedSpeed', website: 'medspeed.com', vertical: 'Medical' },
  { name: 'PathGroup', website: 'pathgroup.com', vertical: 'Medical' },
  { name: 'Reliable Couriers', website: 'reliablecouriers.com', vertical: 'Medical' }
];

/**
 * Analyzes gaps in our company database
 */
async function analyzeCompanyGaps() {
  try {
    console.log('🔍 Starting Company Gap Analysis...');
    
    // Get all current companies using storage interface
    const existingCompanies = await storage.getAllCompanies();
    
    const existingNames = existingCompanies.map(c => c.name.toLowerCase());
    const existingDomains = existingCompanies.map(c => {
      if (!c.website) return '';
      try {
        return new URL(c.website).hostname.toLowerCase();
      } catch {
        return c.website.toLowerCase();
      }
    }).filter(Boolean);
    
    // Check for missing industry leaders
    const missingLeaders = [];
    for (const leader of INDUSTRY_LEADERS) {
      const nameExists = existingNames.some(name => 
        name.includes(leader.name.toLowerCase()) || 
        leader.name.toLowerCase().includes(name)
      );
      
      const domainExists = existingDomains.some(domain => 
        domain.includes(leader.website.toLowerCase()) ||
        leader.website.toLowerCase().includes(domain)
      );
      
      if (!nameExists && !domainExists) {
        missingLeaders.push(leader);
      }
    }
    
    // Analyze naming pattern gaps
    const patternAnalysis = {};
    for (const pattern of MEDICAL_COURIER_PATTERNS) {
      const count = existingNames.filter(name => name.includes(pattern)).length;
      patternAnalysis[pattern] = count;
    }
    
    // Find underrepresented patterns
    const avgCount = Object.values(patternAnalysis).reduce((a, b) => a + b, 0) / Object.keys(patternAnalysis).length;
    const underrepresented = Object.entries(patternAnalysis)
      .filter(([pattern, count]) => count < avgCount * 0.5)
      .map(([pattern]) => pattern);
    
    const results = {
      totalCompanies: existingCompanies.length,
      missingLeaders,
      underrepresentedPatterns: underrepresented,
      patternAnalysis,
      recommendations: generateRecommendations(missingLeaders, underrepresented)
    };
    
    console.log('📊 Gap Analysis Results:', JSON.stringify(results, null, 2));
    return results;
    
  } catch (error) {
    console.error('❌ Error in gap analysis:', error);
    throw error;
  }
}

/**
 * Generates recommendations based on gap analysis
 */
function generateRecommendations(missingLeaders, underrepresented) {
  const recommendations = [];
  
  if (missingLeaders.length > 0) {
    recommendations.push({
      type: 'Missing Industry Leaders',
      priority: 'HIGH',
      action: 'Add these major companies to database',
      companies: missingLeaders.map(l => l.name)
    });
  }
  
  if (underrepresented.length > 0) {
    recommendations.push({
      type: 'Underrepresented Patterns',
      priority: 'MEDIUM',
      action: 'Research more companies with these naming patterns',
      patterns: underrepresented
    });
  }
  
  recommendations.push({
    type: 'Regular Monitoring',
    priority: 'MEDIUM',
    action: 'Run this analysis monthly to identify new gaps',
    schedule: 'Monthly'
  });
  
  return recommendations;
}

/**
 * Suggests companies to research based on patterns
 */
function suggestCompaniesToResearch(vertical = 'Medical') {
  const suggestions = [];
  
  for (const pattern of MEDICAL_COURIER_PATTERNS) {
    suggestions.push(`${pattern} courier ${vertical.toLowerCase()}`);
    suggestions.push(`${pattern} delivery services`);
    suggestions.push(`${pattern} logistics ${vertical.toLowerCase()}`);
  }
  
  return suggestions;
}

module.exports = {
  analyzeCompanyGaps,
  suggestCompaniesToResearch,
  MEDICAL_COURIER_PATTERNS,
  INDUSTRY_LEADERS
};

// Run analysis if called directly
if (require.main === module) {
  analyzeCompanyGaps()
    .then(results => {
      console.log('✅ Analysis complete');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    });
}