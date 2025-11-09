// Debug the actual API response
const fs = require('fs');

const testResponse = {
  response: "🔍 **Driver Gig Opportunities Database Analysis Complete**\n\n📊 **Verification Summary:**\n• **Total Companies Analyzed:** 452\n• **Suspicious Companies Identified:** 358\n• **Data Quality Score:** 21%\n• **Verification Method:** Multi-factor fraud analysis + OpenAI validation\n\n🚨 **MAJOR DATA QUALITY ISSUE DETECTED**\n\nI found **358 potentially fake companies** in your Driver Gig Opportunities directory. This represents **79%** of your total database.",
  metadata: {
    webSearch: false,
    appData: true,
    sources: ["OpenAI Knowledge Base"],
    functionUsed: "verify_companies_online",
    processing: false
  }
};

console.log('Test Response Structure:');
console.log('Response type:', typeof testResponse.response);
console.log('Response length:', testResponse.response.length);
console.log('Response preview:', testResponse.response.substring(0, 100));
console.log('Full response valid:', testResponse.response !== undefined && testResponse.response !== null);

fs.writeFileSync('debug-output.txt', JSON.stringify(testResponse, null, 2));
console.log('Debug file written to debug-output.txt');