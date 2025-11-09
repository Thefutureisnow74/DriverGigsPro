import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// EMERGENCY INSURANCE DATE FIELDS COMPONENT
// This is a standalone test to verify if date fields render properly

export default function EmergencyInsuranceDateTest() {
  const [testData, setTestData] = useState({
    insuranceStartDate: '2024-01-15',
    insuranceExpiry: '2025-01-14'
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">EMERGENCY INSURANCE DATE FIELDS TEST</h1>
      
      {/* MEGA VISIBLE TEST SECTION */}
      <div style={{
        backgroundColor: 'red',
        color: 'white',
        padding: '40px',
        border: '15px solid yellow',
        margin: '20px 0',
        borderRadius: '15px',
        boxShadow: '0 0 30px rgba(255,255,0,0.9)'
      }}>
        <h2 style={{
          color: 'yellow',
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '30px',
          textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
        }}>🚨🔥 EMERGENCY INSURANCE DATE FIELDS TEST 🔥🚨</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div style={{
            backgroundColor: 'darkblue',
            padding: '25px',
            border: '8px solid white',
            borderRadius: '12px'
          }}>
            <label style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '24px',
              display: 'block',
              marginBottom: '20px',
              textAlign: 'center'
            }}>🔥 INSURANCE START DATE 🔥</label>
            <Input
              type="date"
              value={testData.insuranceStartDate}
              onChange={(e) => setTestData(prev => ({ ...prev, insuranceStartDate: e.target.value }))}
              style={{
                backgroundColor: 'yellow',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '20px',
                padding: '20px',
                border: '5px solid red',
                borderRadius: '8px'
              }}
            />
            <div style={{
              color: 'yellow',
              fontWeight: 'bold',
              marginTop: '15px',
              textAlign: 'center',
              fontSize: '18px'
            }}>CURRENT VALUE: {testData.insuranceStartDate || 'EMPTY'}</div>
          </div>
          
          <div style={{
            backgroundColor: 'darkblue',
            padding: '25px',
            border: '8px solid white',
            borderRadius: '12px'
          }}>
            <label style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '24px',
              display: 'block',
              marginBottom: '20px',
              textAlign: 'center'
            }}>🔥 INSURANCE EXPIRATION DATE 🔥</label>
            <Input
              type="date"
              value={testData.insuranceExpiry}
              onChange={(e) => setTestData(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
              style={{
                backgroundColor: 'yellow',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '20px',
                padding: '20px',
                border: '5px solid red',
                borderRadius: '8px'
              }}
            />
            <div style={{
              color: 'yellow',
              fontWeight: 'bold',
              marginTop: '15px',
              textAlign: 'center',
              fontSize: '18px'
            }}>CURRENT VALUE: {testData.insuranceExpiry || 'EMPTY'}</div>
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          backgroundColor: 'black',
          border: '3px solid white',
          borderRadius: '10px'
        }}>
          <h3 style={{
            color: 'yellow',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>DEPLOYMENT TEST STATUS</h3>
          <p style={{
            color: 'white',
            fontSize: '16px'
          }}>If you can see this section with bright colors and fire emojis, the deployment is working.</p>
          <p style={{
            color: 'lime',
            fontSize: '18px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}>TEST DATA LOADED: ✅ {testData.insuranceStartDate} to {testData.insuranceExpiry}</p>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Standard Insurance Date Fields (Normal Styling)</h3>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Insurance Start Date</label>
            <Input
              type="date"
              value={testData.insuranceStartDate}
              onChange={(e) => setTestData(prev => ({ ...prev, insuranceStartDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Insurance Expiration Date</label>
            <Input
              type="date"
              value={testData.insuranceExpiry}
              onChange={(e) => setTestData(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}