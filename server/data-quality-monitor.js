/**
 * Data Quality Monitor
 * Prevents issues like the SDS Rx misclassification by validating company data
 */

// Common patterns that indicate data quality issues
const DATA_QUALITY_PATTERNS = {
  // Medical/pharmacy companies that shouldn't have food/grocery descriptions
  MEDICAL_FOOD_MISMATCH: {
    namePatterns: ['rx', 'med', 'health', 'lab', 'pharma', 'bio', 'clinic', 'hospital'],
    suspiciousDescriptions: ['grocery', 'food', 'restaurant', 'woolworths', 'supermarket', 'cafe']
  },
  
  // Courier companies with unrelated business descriptions
  COURIER_MISMATCH: {
    namePatterns: ['courier', 'delivery', 'express', 'logistics', 'transport'],
    suspiciousDescriptions: ['grocery', 'australian', 'retail', 'fashion', 'software']
  },
  
  // US companies incorrectly described as international
  GEOGRAPHIC_MISMATCH: {
    namePatterns: ['usa', 'america', 'us '], 
    suspiciousDescriptions: ['australian', 'canada', 'uk ', 'europe', 'asia']
  }
};

// Search terms to help find missing major companies
const ENHANCED_SEARCH_TERMS = {
  MEDICAL_COURIERS: [
    'medical courier services',
    'pharmacy delivery companies',
    'lab specimen transport',
    'healthcare logistics providers',
    'pharmaceutical distribution',
    'medical supply delivery',
    'radiology courier services',
    'blood bank transport',
    'organ transport services',
    'medical device delivery'
  ],
  
  GENERAL_COURIERS: [
    'same day delivery services',
    'express courier companies',
    'local delivery services',
    'package delivery companies',
    'freight courier services',
    'document delivery services',
    'time critical delivery',
    'rush delivery services'
  ],
  
  FOOD_DELIVERY: [
    'restaurant delivery services',
    'food courier companies',
    'catering delivery services',
    'grocery delivery platforms',
    'meal kit delivery services'
  ]
};

/**
 * Validates company data for quality issues
 */
function validateCompanyData(company) {
  const issues = [];
  const name = (company.name || '').toLowerCase();
  const description = (company.description || '').toLowerCase();
  const website = (company.website || '').toLowerCase();
  
  // Check for name/description mismatches
  for (const [category, patterns] of Object.entries(DATA_QUALITY_PATTERNS)) {
    const hasNamePattern = patterns.namePatterns.some(pattern => name.includes(pattern));
    const hasSuspiciousDescription = patterns.suspiciousDescriptions.some(term => 
      description.includes(term)
    );
    
    if (hasNamePattern && hasSuspiciousDescription) {
      issues.push({
        type: 'DESCRIPTION_MISMATCH',
        category,
        severity: 'HIGH',
        message: `Company name suggests ${category} but description contains unrelated content`,
        suggestion: 'Review and correct company description'
      });
    }
  }
  
  // Check for missing critical data
  if (!company.website || company.website.length < 5) {
    issues.push({
      type: 'MISSING_WEBSITE',
      severity: 'MEDIUM',
      message: 'Company is missing website information',
      suggestion: 'Research and add company website'
    });
  }
  
  if (!company.description || company.description.length < 20) {
    issues.push({
      type: 'INSUFFICIENT_DESCRIPTION',
      severity: 'MEDIUM',
      message: 'Company description is too short or missing',
      suggestion: 'Add detailed company description'
    });
  }
  
  // Website/name mismatch check
  if (website && name) {
    const nameWords = name.split(' ').filter(word => word.length > 2);
    const websiteMatch = nameWords.some(word => website.includes(word.toLowerCase()));
    
    if (!websiteMatch && nameWords.length > 0) {
      issues.push({
        type: 'WEBSITE_NAME_MISMATCH',
        severity: 'MEDIUM',
        message: 'Website URL does not appear to match company name',
        suggestion: 'Verify website URL is correct for this company'
      });
    }
  }
  
  return issues;
}

/**
 * Generates search strategies to find missing companies
 */
function generateSearchStrategies(existingCompanies) {
  const strategies = [];
  
  // Analyze gaps in coverage
  const medicalCount = existingCompanies.filter(c => 
    (c.serviceVertical || []).some(v => v.toLowerCase().includes('medical'))
  ).length;
  
  const courierCount = existingCompanies.filter(c => 
    c.name.toLowerCase().includes('courier')
  ).length;
  
  // Generate targeted search recommendations
  if (medicalCount < 100) {
    strategies.push({
      focus: 'Medical Couriers',
      priority: 'HIGH',
      searchTerms: ENHANCED_SEARCH_TERMS.MEDICAL_COURIERS,
      targetCount: '20-30 new companies',
      rationale: `Currently have ${medicalCount} medical companies, should expand coverage`
    });
  }
  
  if (courierCount < 200) {
    strategies.push({
      focus: 'General Couriers',
      priority: 'MEDIUM',
      searchTerms: ENHANCED_SEARCH_TERMS.GENERAL_COURIERS,
      targetCount: '15-25 new companies',
      rationale: `Currently have ${courierCount} courier companies, room for growth`
    });
  }
  
  // Geographic coverage analysis
  const stateCount = new Set(
    existingCompanies.map(c => c.areasServed || [])
      .flat()
      .filter(area => area && area.length === 2)
  ).size;
  
  if (stateCount < 40) {
    strategies.push({
      focus: 'Geographic Coverage',
      priority: 'MEDIUM',
      searchTerms: ['state specific courier services', 'regional delivery companies'],
      targetCount: '5-10 companies per underserved state',
      rationale: `Currently covering ${stateCount} states, need better geographic distribution`
    });
  }
  
  return strategies;
}

module.exports = {
  validateCompanyData,
  generateSearchStrategies,
  DATA_QUALITY_PATTERNS,
  ENHANCED_SEARCH_TERMS
};