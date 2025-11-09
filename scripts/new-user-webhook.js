#!/usr/bin/env node

/**
 * New User Webhook Handler
 * Automatically creates isolated SAAS tenant when new user registers
 */

import { createSaasTenant, verifyTenantIsolation } from './automated-saas-provisioning.js';
import express from 'express';

const app = express();
app.use(express.json());

// Webhook endpoint for new user registration
app.post('/webhook/new-user', async (req, res) => {
  try {
    const { username, email, source } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({
        error: 'Username and email required',
        received: { username, email }
      });
    }
    
    console.log(`🆕 New user registration: ${username} (${email})`);
    
    // Create isolated tenant
    const tenantConfig = createSaasTenant({ username });
    
    if (!tenantConfig) {
      return res.status(500).json({
        error: 'Failed to create tenant',
        username
      });
    }
    
    // Verify isolation
    const verified = verifyTenantIsolation(tenantConfig);
    
    if (!verified) {
      console.log(`⚠️  Tenant ${tenantConfig.tenantId} needs manual review`);
    }
    
    // Success response
    const response = {
      success: true,
      tenant: {
        id: tenantConfig.tenantId,
        username: tenantConfig.username,
        domain: tenantConfig.domain,
        appUrl: `https://${tenantConfig.domain}`,
        verified,
        created: new Date().toISOString()
      },
      deployment: {
        databaseUrl: tenantConfig.databaseUrl,
        sessionSecret: tenantConfig.sessionSecret,
        envFile: tenantConfig.envFile
      }
    };
    
    console.log(`✅ Tenant ${tenantConfig.tenantId} created for ${username}`);
    console.log(`🌐 App URL: https://${tenantConfig.domain}`);
    
    // TODO: Send welcome email to user
    // TODO: Trigger deployment to Replit
    // TODO: Update user management system
    
    res.status(201).json(response);
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/webhook/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SAAS Tenant Provisioning',
    timestamp: new Date().toISOString()
  });
});

// Manual tenant creation endpoint
app.post('/webhook/create-tenant', async (req, res) => {
  try {
    const { username, count = 1 } = req.body;
    
    const tenants = [];
    
    for (let i = 0; i < count; i++) {
      const options = username ? { username: `${username}${i > 0 ? i + 1 : ''}` } : {};
      const tenantConfig = createSaasTenant(options);
      
      if (tenantConfig) {
        const verified = verifyTenantIsolation(tenantConfig);
        tenants.push({
          ...tenantConfig,
          verified,
          appUrl: `https://${tenantConfig.domain}`
        });
      }
    }
    
    res.json({
      success: true,
      tenantsCreated: tenants.length,
      tenants
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create tenants',
      message: error.message
    });
  }
});

const PORT = process.env.WEBHOOK_PORT || 3001;

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`🎯 SAAS Tenant Webhook Service running on port ${PORT}`);
    console.log(`📝 Endpoints:`);
    console.log(`   POST /webhook/new-user - Auto-provision tenant`);
    console.log(`   POST /webhook/create-tenant - Manual tenant creation`);
    console.log(`   GET  /webhook/health - Health check`);
  });
}

export { app as webhookApp };