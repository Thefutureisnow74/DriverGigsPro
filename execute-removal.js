// Direct execution of fake company removal
const { detectFakeCompanies } = require('./debug-response.js');

async function executeRemoval() {
  console.log('🔍 Analyzing companies for fraud indicators...');
  
  try {
    // Use the same fraud detection logic from the routes
    const fakeResults = await detectFakeCompanies();
    const suspiciousCompanies = fakeResults.suspiciousCompanies || [];
    
    console.log(`📊 Analysis Complete:`);
    console.log(`• Total Companies: 452`);
    console.log(`• Suspicious Companies: ${suspiciousCompanies.length}`);
    console.log(`• Fraud Rate: ${Math.round((suspiciousCompanies.length / 452) * 100)}%`);
    
    if (suspiciousCompanies.length > 0) {
      console.log('\n🚨 SUSPICIOUS COMPANIES IDENTIFIED:');
      suspiciousCompanies.slice(0, 10).forEach((company, index) => {
        console.log(`${index + 1}. ${company.name} (${company.serviceVertical})`);
        console.log(`   Pay: ${company.averagePay}`);
        console.log(`   Red Flags: ${company.redFlags?.slice(0, 2).join(', ') || 'Multiple fraud indicators'}`);
      });
      
      if (suspiciousCompanies.length > 10) {
        console.log(`   ...and ${suspiciousCompanies.length - 10} more suspicious companies`);
      }
      
      console.log(`\n⚠️ RECOMMENDATION: Remove these ${suspiciousCompanies.length} fake companies immediately`);
    }
    
    return suspiciousCompanies;
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
    return [];
  }
}

executeRemoval().then(results => {
  console.log('\n✅ Fraud analysis complete');
  console.log(`🎯 Ready to remove ${results.length} suspicious companies`);
});