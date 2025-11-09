# Replit.md

## Overview
**DriverGigsPro** is a full-stack web application designed for gig workers to manage their work opportunities, applications, and career development. It provides tools for real-time analytics, company and application tracking, a learning academy, and administrative utilities like document and expense management, all tailored to enhance efficiency and career growth for gig workers. The project aims to be a comprehensive platform for tracking job applications, managing company relationships, accessing training resources, and handling administrative tasks related to gig work.

The platform boasts a comprehensive database of 645 active non-CDL courier companies with verified website information, focusing on accessible driver opportunities without commercial license requirements. It includes systematic database monitoring protocols to maintain data integrity.

## User Preferences
Preferred communication style: Simple, everyday language.
Action Settings Persistence: All company action selections (Research, Apply, Active) must save permanently and persist across sessions.
Data Persistence: All user data including reminders, company notes, job applications, and user preferences must save automatically and persist when logging off/on.
UI Design: Modern, sleek cards with company name above action dropdowns, no icons in company cards, full-width action buttons matching other button widths.
Navigation Menu: Driver Opportunities positioned prominently in the sidebar navigation. Driver Gigs Academy moved to bottom "Add-On Services" section.
Company Deletion Safety: Warning dialog required before permanent deletion with option to change status to inactive instead.
Reminder System: Complete reminder functionality with delete capability, navigation from reminder cards to company cards with auto-scroll and highlight effects.
Interview Date Auto-Save: Interview dates must always save automatically to Driver Opportunities notes with professional formatting and timestamp.
SAAS Multi-Tenancy: Each user deployment must be completely isolated with dedicated database, unique session management, and independent data. No data sharing between tenants. Each deployment requires unique DATABASE_URL and SESSION_SECRET for proper isolation. Automated provisioning system creates isolated tenants with migration tools for existing users.
Authentication System: Dual authentication supporting both Replit OAuth and traditional username/password login. User account "cfmbusiness" (ID: 38492032) with password authentication working correctly. Session persistence fixed with proper passport.js integration.
Medical Document Upload System: Complete medical certification upload system with 16+ certification types (HIPAA, OSHA Bloodborne, CPR/First Aid, HazMat, IATA/DOT, Specimen Handling, Dangerous Goods (DG) Certified, Dangerous Goods Class 7 (DG7) Certified, etc.) fully functional with upload, view, download capabilities. Fixed backend validation and improved UX by eliminating page reloads after uploads. Added two customizable certification upload slots with editable names for user-specific requirements. Enhanced with comprehensive educational system featuring informational buttons throughout all certification sections explaining purpose, requirements, and employer preferences for each credential type. Educational modal dialogs cover medical certifications, transportation authority numbers (DOT/MC), and custom certification fields to help users make informed decisions about professional development.
User Interface Preferences: "Verification Documents" section renamed to "License and Certification" on User Profile page per user request.
DOT and MC Numbers: Added DOT Number (safety monitoring ID) and MC Number (authority for interstate commerce) fields to User Profile with auto-save functionality. Fields are always editable and save automatically when clicking outside each field. Backend storage properly handles both dotNumber and mcNumber fields. Complete implementation working correctly with database persistence and UI display.
Personal Credit System: Comprehensive credit monitoring system for tracking credit scores from all three major bureaus (Equifax, Experian, TransUnion). Features include credit score tracking with visual progress indicators, credit factors analysis, vehicle financing qualification checker, credit improvement tips, goal setting and progress tracking, credit alerts and monitoring setup, and educational resources for building credit to qualify for vehicle purchases and fleet expansion. Enhanced with dedicated Personal Credit and Debit Cards tracking section with 22 comprehensive fields per card (Company Name, Website, Card Type, Expiration, Security Code, Credit Limit, Balance, Due Dates, Login Credentials, AutoPay settings, etc.) supporting up to 5 cards with auto-save functionality.
Business Credit Tracking: Standalone "Business Loans and Credit Cards" tab in Business Profile with comprehensive tradeline management. Credit card section features 22 fields matching personal credit system (Company Name, Website, Type, Card Name, Last Four Digits, Expiration, Security Code, Monitor, Credit Limit, Balance Due, Due Date, Internal/Official Late Dates, Report Date, Login, Password, Payment, Interest Rate, AutoPay, AutoPay Account, Date Opened, Account Status, Notes) for detailed business credit and debit card tracking with auto-save functionality.

## System Architecture

### Frontend
-   **Framework**: React 18 with TypeScript
-   **Routing**: Wouter
-   **Styling**: Tailwind CSS with custom design system, shadcn/ui component library
-   **State Management**: TanStack Query for server state
-   **Forms**: React Hook Form with Zod validation
-   **Build Tool**: Vite

### Backend
-   **Server**: Node.js with Express.js
-   **Language**: TypeScript
-   **ORM**: Drizzle ORM
-   **Database**: Neon PostgreSQL

### Database Design
-   **Database Type**: PostgreSQL (Neon-backed) - Replit's built-in PostgreSQL database service, managed and hosted by Neon for reliability and performance
-   **Schema**: PostgreSQL with Drizzle ORM, schema-first approach with shared types and Zod validation
-   **Core Tables**: Users, Companies, Applications, Hired Jobs, Courses, User Course Progress, Documents, Expenses, Contact Logs, User Stats, employment_records, assignments, personal_credit_scores, personal_credit_goals, personal_credit_tradelines, personal_credit_cards, business_tradelines

### Key Features
-   **Dashboard**: Real-time stats, activity feed, notifications, earnings tracking.
-   **Company Management**: Directory, detailed profiles, service vertical categorization, contract tracking, comprehensive database of non-CDL courier companies.
-   **Application Tracking**: Lifecycle management (Applied, Interview, Hired, Rejected), scheduling, reminders, detailed notes.
-   **Learning Academy**: Course catalog, progress tracking, certifications, video/text content (Driver Gigs Academy).
-   **Administrative Tools**: Document management, expense tracking, contact logging, user analytics. Administrative tasks are handled by the AI assistant.
-   **My Fleet**: Comprehensive vehicle profiling, financial tracking, document/photo management, insurance tracking, vehicle alerts, Maintenance and Accessory Checklist.
-   **Business Management**: Comprehensive business profile management with strategic planning capabilities (business plan, entity structure, operations, vehicle/equipment setup), document storage, deadline tracking.
-   **Task Management**: Multi-board Kanban system with drag-and-drop, date/reminder management.
-   **AI Assistant (GigBot)**: OpenAI GPT-4o integration with comprehensive file system access, app architecture analysis, database schema understanding, app awareness, personalized recommendations, web search, company research, duplicate/fraud detection, system administration capabilities. Includes active employment tracking with specialized database tools.
-   **Company Data Synchronization**: Connects with gig platforms for earnings, trips, mileage data sync.
-   **User Profile Management**: Comprehensive profile editing, photo upload, automatic data persistence.
-   **User Profile Summary**: Complete consolidated profile page displaying all user data (personal info, vehicle details, work status, business info, applications) in organized format for external assistant use with export functionality.
-   **Unified Reminder System**: Integrated reminders from company notes and task cards, displayed in left navigation menu with smart navigation and delete functionality.
-   **Personal Credit**: Comprehensive credit monitoring and improvement system tracking scores from all three credit bureaus (Equifax, Experian, TransUnion) with vehicle financing qualification tools, credit building tips, goal tracking, and educational resources for fleet expansion financing.
-   **Authentication System**: Robust dual authentication system supporting both Replit OAuth and traditional username/password login with proper session management and persistence.

-   **UI/UX Decisions**: Consistent component library (shadcn/ui), professional card-based layouts, intuitive navigation, color-coded indicators, glassmorphism design elements. Seamless bidirectional navigation between Calendar and Board views in task management. Differentiated authentication flow for various platforms (DriverGigsPro, Looking for Drivers, CDL Driver Gigs, GigsProAI).

## External Dependencies
-   **React Ecosystem**: React, React-DOM, React Hook Form
-   **Styling**: Tailwind CSS, Radix UI components
-   **Database**: Drizzle ORM, Neon PostgreSQL driver
-   **Build Tools**: Vite, TypeScript
-   **State Management**: TanStack Query
-   **Validation**: Zod
-   **AI/LLM**: OpenAI (GPT-4o), Perplexity AI
-   **API Integration**: SERPAPI, various gig platform APIs (e.g., Roadie)
-   **File Handling**: Multer
-   **HTTP Client**: Axios