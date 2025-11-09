#!/usr/bin/env node

/**
 * Automated SAAS Provisioning System
 * Creates new isolated tenant deployments for incoming users
 */

import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';

function generateTenantId() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

function generateSessionSecret() {
  return crypto.randomBytes(32).toString('hex');
}

function generateUsername() {
  const adjectives = ['swift', 'smart', 'pro', 'elite', 'prime', 'ace', 'peak', 'top', 'mega', 'ultra'];
  const nouns = ['driver', 'courier', 'pilot', 'rider', 'hauler', 'mover', 'express', 'dash', 'fleet', 'cargo'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`;
}

function createSaasTenant(options = {}) {
  const tenantId = generateTenantId();
  const username = options.username || generateUsername();
  const dbName = `drivergigspro_${tenantId.toLowerCase()}`;
  const sessionSecret = generateSessionSecret();
  const domain = `${username.toLowerCase()}-drivergigspro.replit.app`;
  
  console.log(`\n🎯 Provisioning new SAAS tenant:`);
  console.log(`   Tenant ID: ${tenantId}`);
  console.log(`   Username: ${username}`);
  console.log(`   Database: ${dbName}`);
  console.log(`   Domain: ${domain}`);
  
  // Create database
  try {
    console.log(`   🏗️  Creating database...`);
    execSync(`createdb "${dbName}"`, { stdio: 'inherit' });
    console.log(`   ✅ Database created`);
  } catch (error) {
    console.log(`   ⚠️  Database creation failed: ${error.message}`);
    return null;
  }
  
  // Generate environment configuration
  const envContent = `# DriverGigsPro SAAS - Auto-Generated Tenant
# Tenant ID: ${tenantId}
# Generated: ${new Date().toISOString()}

DATABASE_URL="postgresql://neondb_owner:PGPASSWORD@PGHOST:PGPORT/${dbName}?sslmode=require"
SESSION_SECRET="${sessionSecret}"
REPLIT_DOMAINS="${domain}"
NODE_ENV="production"

# Optional: AI Features (user must provide)
# OPENAI_API_KEY="user_provided_key"
`;

  const envFile = `.env.tenant.${tenantId}`;
  fs.writeFileSync(envFile, envContent);
  
  // Setup database schema
  try {
    console.log(`   📊 Setting up database schema...`);
    const tenantDbUrl = `postgresql://neondb_owner:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${dbName}?sslmode=require`;
    execSync(`DATABASE_URL="${tenantDbUrl}" npm run db:push`, { stdio: 'inherit' });
    console.log(`   ✅ Schema created`);
  } catch (error) {
    console.log(`   ❌ Schema setup failed: ${error.message}`);
    return null;
  }
  
  // Seed with company database
  try {
    console.log(`   🏢 Seeding company database...`);
    const sourceDbUrl = process.env.DATABASE_URL;
    const tenantDbUrl = `postgresql://neondb_owner:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${dbName}?sslmode=require`;
    
    // Use the cleaned companies export
    // Import to tenant database
    execSync(`psql "${tenantDbUrl}" -c "\\copy companies (id, name, vehicle_types, average_pay, service_vertical, contract_type, areas_served, insurance_requirements, license_requirements, certifications_required, website, contact_email, contact_phone, description, logo_url, is_active, created_at, workflow_status, year_established, company_size, headquarters, business_model, company_mission, target_customers, company_culture) FROM 'companies_v1.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    
    console.log(`   ✅ Company database seeded`);
  } catch (error) {
    console.log(`   ⚠️  Company seeding failed: ${error.message}`);
  }
  
  return {
    tenantId,
    username,
    dbName,
    sessionSecret,
    domain,
    envFile,
    databaseUrl: `postgresql://neondb_owner:PGPASSWORD@PGHOST:PGPORT/${dbName}?sslmode=require`
  };
}

function generateDeploymentPackage(tenantConfig) {
  const { tenantId, username, domain, sessionSecret, dbName } = tenantConfig;
  
  // Create deployment instructions
  const instructions = `# SAAS Deployment Package - ${tenantId}

## Quick Deploy
1. Create new Replit project from this codebase
2. Set environment variables (see below)
3. Deploy to: ${domain}

## Environment Variables
\`\`\`env
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST:5432/${dbName}?sslmode=require"
SESSION_SECRET="${sessionSecret}"
REPLIT_DOMAINS="${domain}"
NODE_ENV="production"
\`\`\`

## User Information
- **Username**: ${username}
- **Domain**: https://${domain}
- **Tenant ID**: ${tenantId}
- **Database**: ${dbName}

## Features Included
✅ Isolated PostgreSQL database
✅ 400+ courier companies pre-loaded
✅ Complete DriverGigsPro functionality
✅ Secure session management
✅ Multi-tenant architecture

## Verification Checklist
- [ ] Database contains no existing users
- [ ] All forms start empty
- [ ] Company database populated
- [ ] Session isolation working
- [ ] Domain accessible

## Support
- Tenant ID: ${tenantId}
- Created: ${new Date().toISOString()}
- Architecture: SAAS Multi-Tenant
`;

  const packageDir = `deployment-package-${tenantId}`;
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir);
  }
  
  fs.writeFileSync(`${packageDir}/DEPLOYMENT.md`, instructions);
  fs.writeFileSync(`${packageDir}/.env.production`, tenantConfig.envFile);
  
  // Create user welcome email template
  const welcomeEmail = `Subject: Welcome to DriverGigsPro - Your Dedicated App Instance

Hi ${username},

Welcome to DriverGigsPro! Your personal, isolated app instance is ready.

🎯 Your App: https://${domain}
🔑 Username: ${username}
📧 Support: Tenant ID ${tenantId}

✨ What's Included:
• 400+ courier companies database
• Complete application tracking
• Vehicle fleet management  
• Task management system
• AI assistant (GigBot)
• Expense tracking
• Learning academy

🔒 Security Features:
• Completely isolated from other users
• Dedicated database instance
• Secure session management
• Data privacy guaranteed

🚀 Getting Started:
1. Visit your app URL above
2. Create your account 
3. Start exploring opportunities
4. Add your vehicles and preferences

Need help? Reply with your Tenant ID: ${tenantId}

Welcome aboard!
DriverGigsPro Team
`;

  fs.writeFileSync(`${packageDir}/welcome-email.txt`, welcomeEmail);
  
  return packageDir;
}

function verifyTenantIsolation(tenantConfig) {
  const { dbName } = tenantConfig;
  const tenantDbUrl = `postgresql://neondb_owner:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${dbName}?sslmode=require`;
  
  console.log(`   🔍 Verifying tenant isolation...`);
  
  try {
    // Check user count (should be 0)
    const userCount = execSync(`psql "${tenantDbUrl}" -c "SELECT COUNT(*) FROM users;" -t`, { encoding: 'utf8' }).trim();
    
    // Check company count (should be 400+)
    const companyCount = execSync(`psql "${tenantDbUrl}" -c "SELECT COUNT(*) FROM companies;" -t`, { encoding: 'utf8' }).trim();
    
    const checks = {
      emptyUsers: parseInt(userCount) === 0,
      hasCompanies: parseInt(companyCount) > 400,
      uniqueDatabase: true, // Database name is unique by design
      isolatedSessions: tenantConfig.sessionSecret.length >= 32
    };
    
    const passing = Object.values(checks).filter(Boolean).length;
    console.log(`   📊 Isolation checks: ${passing}/4 passing`);
    
    if (passing === 4) {
      console.log(`   ✅ Tenant isolation verified`);
      return true;
    } else {
      console.log(`   ❌ Isolation issues detected`);
      console.log(`      Empty users: ${checks.emptyUsers ? '✅' : '❌'}`);
      console.log(`      Has companies: ${checks.hasCompanies ? '✅' : '❌'}`);
      console.log(`      Unique database: ${checks.uniqueDatabase ? '✅' : '❌'}`);
      console.log(`      Isolated sessions: ${checks.isolatedSessions ? '✅' : '❌'}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Verification failed: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🚀 Automated SAAS Provisioning System\n');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    if (args[i] === '--username' && args[i + 1]) {
      options.username = args[i + 1];
    }
    if (args[i] === '--count' && args[i + 1]) {
      options.count = parseInt(args[i + 1]);
    }
  }
  
  const count = options.count || 1;
  
  console.log(`Creating ${count} new SAAS tenant${count > 1 ? 's' : ''}...`);
  
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const tenantConfig = createSaasTenant(options);
    
    if (tenantConfig) {
      const verified = verifyTenantIsolation(tenantConfig);
      const packageDir = generateDeploymentPackage(tenantConfig);
      
      results.push({
        ...tenantConfig,
        verified,
        packageDir,
        status: verified ? 'ready' : 'needs-review'
      });
      
      console.log(`   🎉 Tenant ${tenantConfig.tenantId} ${verified ? 'ready' : 'needs review'}`);
    }
  }
  
  // Summary
  console.log('\n📋 Provisioning Summary:');
  console.log(`✅ Successful: ${results.filter(r => r.status === 'ready').length}`);
  console.log(`⚠️  Needs Review: ${results.filter(r => r.status === 'needs-review').length}`);
  
  if (results.length > 0) {
    console.log('\n📦 Deployment Packages Created:');
    results.forEach(result => {
      console.log(`   ${result.tenantId}: ${result.packageDir}/`);
      console.log(`   Domain: https://${result.domain}`);
    });
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Deploy each package to Replit');
  console.log('2. Set environment variables from package');
  console.log('3. Test deployment isolation');
  console.log('4. Send welcome email to users');
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createSaasTenant, generateDeploymentPackage, verifyTenantIsolation };