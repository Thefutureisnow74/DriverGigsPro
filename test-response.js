// Test to see what the AI Assistant API is actually returning
async function testAIResponse() {
  try {
    const response = await fetch('http://localhost:5000/api/ai-assistant/advanced-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Compare my Driver Gig Opportunities companies with online research to find fake ones',
        userContext: {
          applications: [],
          vehicles: [],
          companies: [],
          userStats: {}
        }
      })
    });

    const data = await response.json();
    console.log('Full Response Data:', JSON.stringify(data, null, 2));
    console.log('Response Type:', typeof data.response);
    console.log('Response Length:', data.response ? data.response.length : 'N/A');
    console.log('Response Content Preview:', data.response ? data.response.substring(0, 100) : 'No response');
  } catch (error) {
    console.error('Test Error:', error);
  }
}

testAIResponse();