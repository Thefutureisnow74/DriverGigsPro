import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// PUBLIC TEST PAGE - NO AUTHENTICATION REQUIRED
// This page tests if insurance date fields render properly

export default function PublicTest() {
  const [testData, setTestData] = useState({
    insuranceStartDate: '2024-01-15',
    insuranceExpiry: '2025-01-14'
  });
  
  const [apiStatus, setApiStatus] = useState('Loading...');

  useEffect(() => {
    // Test public API endpoint
    fetch('/api/public-test-status')
      .then(res => res.json())
      .then(data => {
        setApiStatus(`API Working: ${data.message} at ${data.timestamp}`);
      })
      .catch(err => {
        setApiStatus(`API Error: ${err.message}`);
      });
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">PUBLIC DEPLOYMENT TEST - NO LOGIN REQUIRED</h1>
      
      {/* MAXIMUM VISIBILITY TEST SECTION */}
      <div style={{
        backgroundColor: 'red',
        color: 'white',
        padding: '50px',
        border: '20px solid yellow',
        margin: '30px 0',
        borderRadius: '20px',
        boxShadow: '0 0 50px rgba(255,255,0,1)',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: 'yellow',
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '40px',
          textShadow: '5px 5px 10px rgba(0,0,0,0.8)',
          animation: 'blink 1s infinite'
        }}>🚨🔥 INSURANCE DATE FIELDS TEST 🔥🚨</h2>
        
        <div style={{
          backgroundColor: 'black',
          padding: '30px',
          border: '10px solid white',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: 'lime',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>DEPLOYMENT STATUS CHECK</h3>
          <p style={{
            color: 'white',
            fontSize: '18px',
            marginBottom: '10px'
          }}>If you can see this bright red section with yellow borders, the deployment is working correctly.</p>
          <p style={{
            color: 'yellow',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>Current Time: {new Date().toLocaleString()}</p>
          <p style={{
            color: 'lime',
            fontSize: '16px',
            marginTop: '10px'
          }}>API Status: {apiStatus}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div style={{
            backgroundColor: 'darkblue',
            padding: '30px',
            border: '10px solid white',
            borderRadius: '15px'
          }}>
            <label style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '28px',
              display: 'block',
              marginBottom: '25px'
            }}>🔥 INSURANCE START DATE 🔥</label>
            <Input
              type="date"
              value={testData.insuranceStartDate}
              onChange={(e) => setTestData(prev => ({ ...prev, insuranceStartDate: e.target.value }))}
              style={{
                backgroundColor: 'yellow',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '24px',
                padding: '25px',
                border: '8px solid red',
                borderRadius: '10px'
              }}
            />
            <div style={{
              color: 'yellow',
              fontWeight: 'bold',
              marginTop: '20px',
              fontSize: '20px'
            }}>VALUE: {testData.insuranceStartDate || 'EMPTY'}</div>
          </div>
          
          <div style={{
            backgroundColor: 'darkblue',
            padding: '30px',
            border: '10px solid white',
            borderRadius: '15px'
          }}>
            <label style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '28px',
              display: 'block',
              marginBottom: '25px'
            }}>🔥 INSURANCE EXPIRATION DATE 🔥</label>
            <Input
              type="date"
              value={testData.insuranceExpiry}
              onChange={(e) => setTestData(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
              style={{
                backgroundColor: 'yellow',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '24px',
                padding: '25px',
                border: '8px solid red',
                borderRadius: '10px'
              }}
            />
            <div style={{
              color: 'yellow',
              fontWeight: 'bold',
              marginTop: '20px',
              fontSize: '20px'
            }}>VALUE: {testData.insuranceExpiry || 'EMPTY'}</div>
          </div>
        </div>
      </div>

      {/* Additional Test Sections */}
      <Card className="mt-8 border-4 border-purple-500">
        <CardHeader className="bg-purple-100">
          <h3 className="text-2xl font-bold text-purple-800">Normal Insurance Date Fields (Standard Styling)</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-lg font-semibold block mb-2">Insurance Start Date</label>
              <Input
                type="date"
                value={testData.insuranceStartDate}
                onChange={(e) => setTestData(prev => ({ ...prev, insuranceStartDate: e.target.value }))}
                className="text-lg p-3"
              />
            </div>
            <div>
              <label className="text-lg font-semibold block mb-2">Insurance Expiration Date</label>
              <Input
                type="date"
                value={testData.insuranceExpiry}
                onChange={(e) => setTestData(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                className="text-lg p-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Test Instructions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The massive red section above should be impossible to miss</li>
          <li>If you see the red section with fire emojis, the deployment is working</li>
          <li>If you don't see the red section, there's a deployment environment issue</li>
          <li>Both date fields should be functional and show yellow backgrounds</li>
          <li>This page requires no authentication and should work immediately</li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}