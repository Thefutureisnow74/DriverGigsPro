# 🗄️ Database Setup - Gig Work Driver Software

## ✅ Current Database Status: FULLY CONFIGURED

Your PostgreSQL database is now fully set up and ready for production use with all required tables created and relationships established.

## 📊 Database Tables Overview

### Core User Data
- **users** - User profiles (name, email, password, subscription plan)
- **userStats** - User performance metrics and statistics

### Company & Job Management  
- **companies** - Company database (name, vehicle types, pay rates, service verticals)
- **applications** - Applied companies (date applied, status, notes)
- **hiredJobs** - Hired companies (job start date, status, pay rate)

### Fleet & Equipment
- **vehicles** - My Fleet data (vehicle details, maintenance, financial tracking)
- **fuelCards** - Fuel card management (limits, balances, restrictions)

### Administrative
- **adminTasks** - Admin tasks (documents, expiration dates, notes)
- **documents** - File uploads and document management
- **expenses** - Expense tracking with receipt storage
- **contactLogs** - Communication tracking with companies

### Learning System
- **courses** - Gig Work Academy courses
- **userCourseProgress** - Learning progress tracking

## 🔐 Security & Environment Variables

Your database uses these secure environment variables (already configured):
- `DATABASE_URL` - PostgreSQL connection string
- `PGDATABASE`, `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGPORT` - Database credentials

## 📁 File Upload System

Organized upload directories created:
```
/uploads/
  ├── documents/     - Legal documents, contracts
  ├── certificates/  - Certifications, licenses  
  ├── receipts/      - Expense receipts
  ├── vehicle-images/- Vehicle photos
  └── profile-images/- User profile pictures
```

## 🔄 CRUD Operations Ready

All database operations are implemented:
- **Create** - Add new records to all tables
- **Read** - Retrieve and search data efficiently  
- **Update** - Modify existing records
- **Delete** - Remove records with proper relationships

## 💾 Backup System

### Automatic Daily Backups (2:00 AM)
Two backup formats created:
1. **SQL Dump** - Complete PostgreSQL backup
2. **JSON Export** - Readable data export

### Manual Backup Commands
```bash
# Create immediate backup
node -e "import('./server/backup.js').then(m => m.backupManager.createBackup())"

# Create JSON backup  
node -e "import('./server/backup.js').then(m => m.backupManager.createJSONBackup())"
```

### Backup Location
All backups stored in: `./backups/`
- Format: `gig-work-backup-YYYY-MM-DD-HH-mm-ss.sql`
- JSON: `gig-work-data-YYYY-MM-DD-HH-mm-ss.json`

## 🚀 Ready to Use Features

### ✅ Data Persistence
- All data survives app restarts
- Relationships maintained automatically
- Data integrity enforced

### ✅ File Management  
- Secure file uploads to organized folders
- File paths stored in database
- Support for PDFs, images, documents

### ✅ API Integration
Your frontend can now store real data using existing API endpoints:
- `/api/users` - User management
- `/api/companies` - Company data
- `/api/applications` - Job applications
- `/api/hired-jobs` - Active jobs
- `/api/vehicles` - Fleet management
- `/api/fuel-cards` - Fuel card tracking

## 🔧 Database Connection Code

The connection is already configured in `server/db.ts`:
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

export const db = drizzle({ client: pool, schema });
```

## 📈 Next Steps - Start Using Your Database

1. **Continue using your app normally** - All data will now be stored permanently
2. **Upload documents** - Files will be saved to `/uploads/` folders
3. **Add real company data** - Replace sample data with actual companies
4. **Track your gig work** - Applications, earnings, and fleet data persist

## 🆘 Support Commands

### Check Database Status
```bash
npm run db:studio  # Visual database browser (if needed)
```

### Reset Database (Emergency Only)
```bash
npm run db:push    # Reapply schema changes
```

Your database is production-ready and will automatically store all future data!