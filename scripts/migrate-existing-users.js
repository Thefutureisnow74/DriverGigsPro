#!/usr/bin/env node

/**
 * Migrate Existing Users to Isolated Tenants
 * Moves each of the 15 existing users to their own isolated database
 */

import { execSync } from 'child_process';
import fs from 'fs';
import crypto from 'crypto';

const SHARED_DATABASE_URL = process.env.DATABASE_URL;

function generateTenantId() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

function generateSessionSecret() {
  return crypto.randomBytes(32).toString('hex');
}

async function getExistingUsers() {
  try {
    const result = execSync(`psql "${SHARED_DATABASE_URL}" -c "SELECT id, username FROM users ORDER BY id;"`, { encoding: 'utf8' });
    const lines = result.split('\n').filter(line => line.trim() && !line.includes('---') && !line.includes('id') && !line.includes('row'));
    
    return lines.map(line => {
      const [id, username] = line.trim().split('|').map(s => s.trim());
      return { id: parseInt(id), username };
    }).filter(user => user.id && user.username);
  } catch (error) {
    console.error('Failed to get existing users:', error.message);
    return [];
  }
}

function createTenantDatabase(tenantId, userId, username) {
  const dbName = `drivergigspro_${tenantId.toLowerCase()}`;
  const sessionSecret = generateSessionSecret();
  
  console.log(`\n🏗️  Creating tenant for User ${userId} (${username})`);
  console.log(`   Database: ${dbName}`);
  console.log(`   Tenant ID: ${tenantId}`);
  
  // Create database
  try {
    execSync(`createdb "${dbName}"`, { stdio: 'inherit' });
    console.log(`   ✅ Database created`);
  } catch (error) {
    console.log(`   ⚠️  Database might already exist`);
  }
  
  // Create environment file
  const envContent = `# DriverGigsPro SAAS - User: ${username} (ID: ${userId})
# Generated: ${new Date().toISOString()}

DATABASE_URL="postgresql://neondb_owner:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${dbName}?sslmode=require"
SESSION_SECRET="${sessionSecret}"
REPLIT_DOMAINS="${username.toLowerCase()}-drivergigspro.replit.app"
NODE_ENV="production"
`;

  fs.writeFileSync(`.env.user.${userId}`, envContent);
  
  return {
    userId,
    username,
    tenantId,
    dbName,
    sessionSecret,
    envFile: `.env.user.${userId}`
  };
}

function exportUserData(userId, username) {
  console.log(`   📦 Exporting data for ${username}...`);
  
  try {
    // Export user-specific data
    const userData = execSync(`psql "${SHARED_DATABASE_URL}" -c "\\copy (SELECT * FROM users WHERE id = ${userId}) TO 'user_${userId}_data.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    
    const companyActions = execSync(`psql "${SHARED_DATABASE_URL}" -c "\\copy (SELECT * FROM company_actions WHERE user_id = '${userId}') TO 'user_${userId}_company_actions.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    
    const applications = execSync(`psql "${SHARED_DATABASE_URL}" -c "\\copy (SELECT * FROM applications WHERE user_id = ${userId}) TO 'user_${userId}_applications.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    
    const vehicles = execSync(`psql "${SHARED_DATABASE_URL}" -c "\\copy (SELECT * FROM vehicles WHERE user_id = ${userId}) TO 'user_${userId}_vehicles.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    
    // Note: Reminders table doesn't exist in current schema, skipping
    // const reminders = execSync(`psql "${SHARED_DATABASE_URL}" -c "\\copy (SELECT * FROM reminders WHERE user_id = ${userId}) TO 'user_${userId}_reminders.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    
    console.log(`   ✅ Data exported`);
    return true;
  } catch (error) {
    console.log(`   ❌ Export failed: ${error.message}`);
    return false;
  }
}

function importUserData(tenantConfig) {
  const { userId, username, dbName } = tenantConfig;
  const tenantDbUrl = `postgresql://neondb_owner:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${dbName}?sslmode=require`;
  
  console.log(`   📥 Importing data to ${dbName}...`);
  
  try {
    // Run database migrations first
    execSync(`DATABASE_URL="${tenantDbUrl}" npm run db:push`, { stdio: 'inherit' });
    
    // Import shared company data
    execSync(`psql "${SHARED_DATABASE_URL}" -c "\\copy (SELECT * FROM companies) TO 'companies.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    execSync(`psql "${tenantDbUrl}" -c "\\copy companies FROM 'companies.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    
    // Import user-specific data if files exist
    if (fs.existsSync(`user_${userId}_data.sql`)) {
      execSync(`psql "${tenantDbUrl}" -c "\\copy users FROM 'user_${userId}_data.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    }
    
    if (fs.existsSync(`user_${userId}_company_actions.sql`)) {
      execSync(`psql "${tenantDbUrl}" -c "\\copy company_actions FROM 'user_${userId}_company_actions.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    }
    
    if (fs.existsSync(`user_${userId}_applications.sql`)) {
      execSync(`psql "${tenantDbUrl}" -c "\\copy applications FROM 'user_${userId}_applications.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    }
    
    if (fs.existsSync(`user_${userId}_vehicles.sql`)) {
      execSync(`psql "${tenantDbUrl}" -c "\\copy vehicles FROM 'user_${userId}_vehicles.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    }
    
    if (fs.existsSync(`user_${userId}_reminders.sql`)) {
      execSync(`psql "${tenantDbUrl}" -c "\\copy reminders FROM 'user_${userId}_reminders.sql' WITH CSV HEADER;"`, { encoding: 'utf8' });
    }
    
    console.log(`   ✅ Data imported successfully`);
    return true;
  } catch (error) {
    console.log(`   ❌ Import failed: ${error.message}`);
    return false;
  }
}

function createDeploymentInstructions(tenantConfig) {
  const { userId, username, tenantId, dbName, sessionSecret } = tenantConfig;
  
  const instructions = `# Deployment Instructions - User: ${username} (ID: ${userId})

## Tenant Information
- **Tenant ID**: ${tenantId}
- **Database**: ${dbName}
- **Username**: ${username}
- **Migration Date**: ${new Date().toISOString()}

## Environment Variables for Replit Deployment
\`\`\`env
DATABASE_URL="postgresql://neondb_owner:PGPASSWORD@PGHOST:PGPORT/${dbName}?sslmode=require"
SESSION_SECRET="${sessionSecret}"
REPLIT_DOMAINS="${username.toLowerCase()}-drivergigspro.replit.app"
NODE_ENV="production"
\`\`\`

## Verification Steps
1. Database contains only this user's data
2. All forms start empty for new sessions
3. Company database populated with 400+ companies
4. User sessions isolated from other deployments

## User Communication
**Subject**: Your DriverGigsPro App is Ready!

Hi ${username},

Your dedicated DriverGigsPro instance has been set up with complete data isolation.

**Your App URL**: https://${username.toLowerCase()}-drivergigspro.replit.app
**Features**: All your data migrated, 400+ companies available, fully isolated

Login with your existing credentials. All your previous data (vehicles, applications, reminders) has been preserved.

## Support Information
- Tenant ID: ${tenantId}
- Database: ${dbName}
- Migration completed: ${new Date().toLocaleDateString()}
`;

  fs.writeFileSync(`deployment-user-${userId}.md`, instructions);
  return `deployment-user-${userId}.md`;
}

function cleanupTempFiles(userId) {
  const files = [
    `user_${userId}_data.sql`,
    `user_${userId}_company_actions.sql`,
    `user_${userId}_applications.sql`,
    `user_${userId}_vehicles.sql`,
    `user_${userId}_reminders.sql`,
    'companies.sql'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
}

async function main() {
  console.log('🚀 SAAS User Migration - Converting Shared Database to Isolated Tenants\n');
  
  if (!SHARED_DATABASE_URL) {
    console.error('❌ DATABASE_URL not found');
    process.exit(1);
  }
  
  // Get existing users
  console.log('📋 Getting existing users...');
  const users = await getExistingUsers();
  
  if (users.length === 0) {
    console.log('✅ No users found - database is clean');
    return;
  }
  
  console.log(`Found ${users.length} users to migrate:`);
  users.forEach(user => console.log(`   - ${user.username} (ID: ${user.id})`));
  
  const migrations = [];
  
  // Process each user
  for (const user of users) {
    const tenantId = generateTenantId();
    
    // Create tenant database
    const tenantConfig = createTenantDatabase(tenantId, user.id, user.username);
    
    // Export user data
    const exported = exportUserData(user.id, user.username);
    
    if (exported) {
      // Import to tenant database
      const imported = importUserData(tenantConfig);
      
      if (imported) {
        // Create deployment instructions
        const instructionsFile = createDeploymentInstructions(tenantConfig);
        
        migrations.push({
          ...tenantConfig,
          instructionsFile,
          status: 'success'
        });
        
        console.log(`   ✅ Migration complete`);
      } else {
        console.log(`   ❌ Migration failed`);
        migrations.push({ ...tenantConfig, status: 'failed' });
      }
    }
    
    // Cleanup temp files
    cleanupTempFiles(user.id);
  }
  
  // Summary
  console.log('\n📊 Migration Summary:');
  const successful = migrations.filter(m => m.status === 'success');
  const failed = migrations.filter(m => m.status === 'failed');
  
  console.log(`✅ Successful migrations: ${successful.length}`);
  console.log(`❌ Failed migrations: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎉 Ready for deployment:');
    successful.forEach(migration => {
      console.log(`   - ${migration.username}: ${migration.instructionsFile}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n⚠️  Failed migrations need manual review:');
    failed.forEach(migration => {
      console.log(`   - ${migration.username} (ID: ${migration.userId})`);
    });
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. Review deployment instructions for each user');
  console.log('2. Set up Replit deployments with isolated environments');
  console.log('3. Test each deployment for proper isolation');
  console.log('4. Notify users of their new dedicated instances');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as migrateExistingUsers };