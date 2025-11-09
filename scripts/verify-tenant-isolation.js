#!/usr/bin/env node

/**
 * SAAS Tenant Isolation Verification Script
 * Verifies that deployments are properly isolated
 */

import { execSync } from 'child_process';

function checkDatabaseIsolation() {
  try {
    const result = execSync('psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"', { encoding: 'utf8' });
    const userCount = parseInt(result.match(/\d+/)[0]);
    
    return {
      status: userCount === 0 ? 'PASS' : 'FAIL',
      message: userCount === 0 ? 'Database is clean' : `Found ${userCount} existing users - database not isolated`,
      userCount
    };
  } catch (error) {
    return {
      status: 'ERROR',
      message: 'Could not connect to database: ' + error.message,
      userCount: null
    };
  }
}

function checkEnvironmentVariables() {
  const required = ['DATABASE_URL', 'SESSION_SECRET', 'REPLIT_DOMAINS'];
  const results = {};
  
  required.forEach(env => {
    const value = process.env[env];
    results[env] = {
      status: value ? 'PASS' : 'FAIL',
      message: value ? 'Set' : 'Missing',
      hasValue: !!value,
      isUnique: env === 'SESSION_SECRET' ? value && value.length >= 32 : true
    };
  });
  
  return results;
}

function checkSessionIsolation() {
  const sessionSecret = process.env.SESSION_SECRET;
  
  if (!sessionSecret) {
    return {
      status: 'FAIL',
      message: 'SESSION_SECRET not set'
    };
  }
  
  if (sessionSecret === 'fallback-secret-key') {
    return {
      status: 'FAIL',
      message: 'Using default session secret - not isolated'
    };
  }
  
  if (sessionSecret.length < 32) {
    return {
      status: 'FAIL',
      message: 'Session secret too short'
    };
  }
  
  return {
    status: 'PASS',
    message: 'Unique session secret configured'
  };
}

function checkCompanyDatabase() {
  try {
    const result = execSync('psql $DATABASE_URL -c "SELECT COUNT(*) FROM companies;"', { encoding: 'utf8' });
    const companyCount = parseInt(result.match(/\d+/)[0]);
    
    return {
      status: companyCount > 400 ? 'PASS' : 'WARN',
      message: `Found ${companyCount} companies`,
      companyCount
    };
  } catch (error) {
    return {
      status: 'ERROR',
      message: 'Could not check companies table: ' + error.message,
      companyCount: null
    };
  }
}

function runIsolationCheck() {
  console.log('🔍 SAAS Tenant Isolation Verification\n');
  
  // Check database isolation
  console.log('📊 Database Isolation:');
  const dbCheck = checkDatabaseIsolation();
  console.log(`   ${dbCheck.status === 'PASS' ? '✅' : '❌'} ${dbCheck.message}`);
  
  // Check environment variables
  console.log('\n🔧 Environment Variables:');
  const envCheck = checkEnvironmentVariables();
  Object.entries(envCheck).forEach(([key, result]) => {
    console.log(`   ${result.status === 'PASS' ? '✅' : '❌'} ${key}: ${result.message}`);
  });
  
  // Check session isolation
  console.log('\n🔐 Session Isolation:');
  const sessionCheck = checkSessionIsolation();
  console.log(`   ${sessionCheck.status === 'PASS' ? '✅' : '❌'} ${sessionCheck.message}`);
  
  // Check company database
  console.log('\n🏢 Company Database:');
  const companyCheck = checkCompanyDatabase();
  console.log(`   ${companyCheck.status === 'PASS' ? '✅' : companyCheck.status === 'WARN' ? '⚠️' : '❌'} ${companyCheck.message}`);
  
  // Overall assessment
  const allChecks = [dbCheck, sessionCheck, ...Object.values(envCheck), companyCheck];
  const passing = allChecks.filter(check => check.status === 'PASS').length;
  const total = allChecks.length;
  
  console.log(`\n📋 Overall Status: ${passing}/${total} checks passing`);
  
  if (passing === total) {
    console.log('🎉 Tenant isolation verified - ready for deployment!');
    return true;
  } else {
    console.log('⚠️  Issues found - resolve before deployment');
    return false;
  }
}

function main() {
  const isolated = runIsolationCheck();
  process.exit(isolated ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  checkDatabaseIsolation,
  checkEnvironmentVariables,
  checkSessionIsolation,
  checkCompanyDatabase,
  runIsolationCheck
};