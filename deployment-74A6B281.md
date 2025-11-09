# Deployment Instructions - Tenant: 74A6B281

## 1. Database Setup
Create new PostgreSQL database:
```sql
CREATE DATABASE "drivergigspro_74a6b281";
```

## 2. Environment Variables
Copy these to your Replit deployment:

DATABASE_URL="postgresql://user:pass@host:5432/drivergigspro_74a6b281"
SESSION_SECRET="dac2ff4db4d8f1024d34917a031ec2027589036b943a87b7d885a7b19a91aef8"
REPLIT_DOMAINS="drivergigspro-74a6b281.replit.app"

## 3. Database Migration
Run in your deployment:
```bash
npm run db:push
```

## 4. Verification
- [ ] Empty database with no users
- [ ] All forms start empty
- [ ] Unique session management
- [ ] No pre-filled data

## 5. User Handoff
- Provide deployment URL
- Confirm isolation testing
- Document tenant configuration
