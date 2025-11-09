import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar, index, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { ROLES, USER_STATUS } from "./rbac";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: varchar("email").unique(),
  profileImage: text("profile_image"),
  profileCompletion: integer("profile_completion").default(0),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zip_code", { length: 10 }),
  dateOfBirth: date("date_of_birth"),
  bio: text("bio"),
  dotNumber: varchar("dot_number"),
  mcNumber: varchar("mc_number"),
  gigGoals: text("gig_goals"),
  isAdmin: boolean("is_admin").default(false),
  role: varchar("role", { length: 20 }).default("VIEWER"), // OWNER, ASSISTANT, VIEWER
  status: varchar("status", { length: 20 }).default("ACTIVE"), // ACTIVE, SUSPENDED, DELETED
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invitation system for RBAC
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  role: varchar("role", { length: 20 }).notNull(), // OWNER, ASSISTANT, VIEWER
  invitedByUserId: integer("invited_by_user_id").notNull().references(() => users.id),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced session tracking for RBAC
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull().unique(),
  userId: integer("user_id").notNull().references(() => users.id),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  lastActivityAt: timestamp("last_activity_at"),
});

// Comprehensive audit logging for security events
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorUserId: integer("actor_user_id").references(() => users.id),
  targetUserId: integer("target_user_id").references(() => users.id),
  action: varchar("action").notNull(), // INVITE_CREATED, INVITE_ACCEPTED, ROLE_CHANGED, USER_SUSPENDED, etc.
  resource: varchar("resource"), // user, invitation, session
  resourceId: varchar("resource_id"),
  meta: jsonb("meta"), // Additional context and details
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User activity tracking table
export const userActivity = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // 'login', 'logout', 'create', 'update', 'delete', 'view'
  resource: text("resource"), // 'vehicle', 'application', 'business_entity', 'document', etc.
  resourceId: text("resource_id"), // ID of the resource being acted upon
  details: jsonb("details"), // Additional context like old/new values
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  sessionId: varchar("session_id"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Admin activity logs
export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  adminUserId: varchar("admin_user_id").notNull(),
  targetUserId: varchar("target_user_id"), // User being viewed/managed
  action: text("action").notNull(), // 'view_user_data', 'export_data', 'view_analytics'
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Networking groups table
export const networkingGroups = pgTable("networking_groups", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  groupName: text("group_name").notNull(),
  platform: text("platform").notNull(), // 'facebook', 'linkedin', 'telegram', 'discord', 'other'
  groupUrl: text("group_url"),
  loginEmail: text("login_email"),
  loginUsername: text("login_username"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  joinedDate: timestamp("joined_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// OAuth connections table
export const oauthConnections = pgTable("oauth_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // 'doordash', 'uber', 'amazon_flex', etc.
  oauthProvider: text("oauth_provider").notNull(), // 'platform_oauth', 'plaid', 'teller', 'truelayer'
  accessToken: text("access_token"), // Encrypted
  refreshToken: text("refresh_token"), // Encrypted
  tokenExpiry: timestamp("token_expiry"),
  accountId: text("account_id"), // Platform-specific account ID
  isActive: boolean("is_active").default(true),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Banking connections table (Plaid/Teller/Truelayer)
export const bankingConnections = pgTable("banking_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  provider: text("provider").notNull(), // 'plaid', 'teller', 'truelayer'
  institutionId: text("institution_id"),
  institutionName: text("institution_name"),
  accessToken: text("access_token"), // Encrypted
  itemId: text("item_id"), // Plaid item ID
  accounts: jsonb("accounts"), // Array of connected accounts
  isActive: boolean("is_active").default(true),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Earnings data table
export const earningsData = pgTable("earnings_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyId: integer("company_id").references(() => companies.id),
  companyName: text("company_name").notNull(),
  dataSource: text("data_source").notNull(), // 'oauth', 'banking', 'manual', 'scraping'
  date: date("date").notNull(),
  dailyEarnings: decimal("daily_earnings", { precision: 10, scale: 2 }),
  weeklyEarnings: decimal("weekly_earnings", { precision: 10, scale: 2 }),
  monthlyEarnings: decimal("monthly_earnings", { precision: 10, scale: 2 }),
  tripCount: integer("trip_count"),
  deliveryCount: integer("delivery_count"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  acceptanceRate: decimal("acceptance_rate", { precision: 5, scale: 2 }),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }),
  onlineHours: decimal("online_hours", { precision: 5, scale: 2 }),
  activeHours: decimal("active_hours", { precision: 5, scale: 2 }),
  milesDriven: decimal("miles_driven", { precision: 8, scale: 2 }),
  rawData: jsonb("raw_data"), // Store original API response
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sync settings table
export const syncSettings = pgTable("sync_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyId: integer("company_id").references(() => companies.id),
  companyName: text("company_name").notNull(),
  syncEnabled: boolean("sync_enabled").default(false),
  syncMethod: text("sync_method"), // 'oauth', 'banking', 'manual', 'scraping'
  autoSyncInterval: integer("auto_sync_interval").default(24), // hours
  lastSyncAttempt: timestamp("last_sync_attempt"),
  lastSuccessfulSync: timestamp("last_successful_sync"),
  syncErrors: jsonb("sync_errors"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  vehicleTypes: text("vehicle_types").array(),
  averagePay: text("average_pay"),
  serviceVertical: text("service_vertical").array().notNull(),
  contractType: text("contract_type").notNull(),
  areasServed: text("areas_served").array(),
  insuranceRequirements: text("insurance_requirements"),
  licenseRequirements: text("license_requirements"),
  certificationsRequired: text("certifications_required").array(),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  description: text("description"),
  logoUrl: text("logo_url"),
  workflowStatus: text("workflow_status"), // "apply", "research", "uncheck" for Driver Gig Opportunities
  level: text("level", {
    enum: ["Level 1 - Entry", "Level 2 - Growth", "Level 3 - Scale", "Level 4 - Professional", "Support Services", "Other/Specialized"]
  }), // Company tier/category from production database
  // Company Information fields
  yearEstablished: text("year_established"),
  companySize: text("company_size"),
  headquarters: text("headquarters"),
  businessModel: text("business_model"),
  companyMission: text("company_mission"),
  targetCustomers: text("target_customers"),
  companyCulture: text("company_culture"),
  videoUrl: text("video_url"), // Video link for company cards
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Company actions tracking - persistent user actions on companies
export const companyActions = pgTable("company_actions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyId: integer("company_id").notNull().references(() => companies.id),
  action: text("action").notNull(), // 'research', 'apply', 'active'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  position: text("position").notNull(),
  status: text("status").notNull().default("Interested"), // "Interested", "Applied", "Accepted"
  workflowStatus: text("workflow_status"), // "apply", "research", "uncheck" from Driver Gig Opportunities
  dateAdded: timestamp("date_added").defaultNow(),
  dateApplied: timestamp("date_applied"),
  dateAccepted: timestamp("date_accepted"),
  notes: text("notes"),
  followUpDate: timestamp("follow_up_date"),
  interviewDate: timestamp("interview_date"),
  reminderNotes: text("reminder_notes"),
  priority: text("priority").default("Medium"), // "High", "Medium", "Low"
  lastContactDate: timestamp("last_contact_date"),
  onWaitingList: boolean("on_waiting_list").default(false), // Indicates if user is on company waiting list
  activeDate: timestamp("active_date"), // Override for when user became active with the company
});

// Employment records for active work relationships
export const employmentRecords = pgTable("employment_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  role: text("role").notNull(),
  status: text("status").notNull(), // Active, Ongoing, Hired, On-Assignment, Onboarding-Complete, Eligible-To-Drive, Scheduled-Shift, Dispatched, Paused, Deactivated, etc.
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  market: text("market"), // Region/market served
  region: text("region"),
  applicationId: integer("application_id").references(() => applications.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assignment tracking for active work
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  employmentRecordId: integer("employment_record_id").references(() => employmentRecords.id),
  status: text("status").notNull(), // Dispatched, Scheduled-Shift, Completed, In-Progress, etc.
  assignmentDate: timestamp("assignment_date"),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  details: jsonb("details"), // Assignment-specific details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  vertical: text("vertical").notNull(),
  duration: integer("duration_minutes"),
  difficulty: text("difficulty").default("Beginner"),
  thumbnailUrl: text("thumbnail_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userCourseProgress = pgTable("user_course_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  startedAt: timestamp("started_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // drivers_license, insurance, vehicle_registration, vehicle_photos, etc.
  name: text("name"), // User-friendly name for the document
  filename: text("filename").notNull(),
  filepath: text("filepath"), // Local file path for uploaded files
  url: text("url"), // External URL if applicable
  size: integer("size"), // File size in bytes
  mimetype: text("mimetype"), // MIME type of the file
  expirationDate: timestamp("expiration_date"),
  isVerified: boolean("is_verified").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});


// === VA SYSTEM SCHEMA ===

// VA Activities table
export const vaActivity = pgTable("va_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  activityType: text("activity_type").notNull(), // 'call', 'email', 'meeting', 'task'
  channel: text("channel"), // 'phone', 'email', 'video', 'in_person'
  company: text("company"),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"), // Duration in minutes
  status: text("status").default("pending"), // 'pending', 'completed', 'cancelled'
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// VA Assignments table
export const vaAssignments = pgTable("va_assignments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assignmentType: text("assignment_type").notNull(), // 'application', 'follow_up', 'research'
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").default("medium"), // 'low', 'medium', 'high', 'urgent'
  status: text("status").default("assigned"), // 'assigned', 'in_progress', 'completed', 'cancelled'
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  assignedBy: integer("assigned_by"), // VA or admin user ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Consent Grants table for RBAC
export const consentGrants = pgTable("consent_grants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  grantType: text("grant_type").notNull(), // 'data_access', 'application_management', 'profile_editing'
  permissions: text("permissions").array(), // Array of specific permissions
  grantedTo: integer("granted_to"), // User ID who received the grant
  grantedBy: integer("granted_by"), // User ID who granted the permission
  expiresAt: timestamp("expires_at"),
  isRevoked: boolean("is_revoked").default(false),
  revokedAt: timestamp("revoked_at"),
  revokedBy: integer("revoked_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User addresses
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  postal: text("postal").notNull(),
  country: text("country").default("US").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced user profiles for VA system
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  version: integer("version").default(1),
  headline: text("headline"),
  summary: text("summary"),
  workAuth: text("work_auth"),
  ssnLast4: varchar("ssn_last4", { length: 4 }),
  driversLicense: text("drivers_license"), // encrypted
  dlState: text("dl_state"),
  dlExpiry: date("dl_expiry"),
  backgroundCheckStatus: text("background_check_status").default("PENDING"), // PENDING, CLEAR, FLAGGED, EXPIRED
  languages: text("languages").array(),
  certifications: text("certifications").array(),
  portfolioLinks: text("portfolio_links").array(),
  availability: jsonb("availability"), // structured weekly schedule
  travelRadiusMi: integer("travel_radius_mi"),
  preferredGigs: text("preferred_gigs").array(),
  photoId: integer("photo_id").references(() => documents.id),
  completenessScore: integer("completeness_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicle records
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  nickname: text("nickname"),
  year: varchar("year", { length: 4 }).notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  vehicleType: text("vehicle_type"),
  color: text("color"),
  vin: varchar("vin", { length: 17 }).notNull(), // encrypted
  licensePlate: text("license_plate"),
  state: varchar("state", { length: 2 }),
  mileage: integer("mileage"),
  fuelType: text("fuel_type"),
  mpg: integer("mpg"),
  status: text("status").default("active"),
  registrationExpiry: date("registration_expiry"),
  inspectionExpiry: date("inspection_expiry"),
  insuranceExpiry: date("insurance_expiry"),
  lastMaintenance: date("last_maintenance"),
  nextMaintenanceDue: date("next_maintenance_due"),
  purchaseDate: date("purchase_date"),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  dateOfEntry: date("date_of_entry"),
  monthlyPayment: decimal("monthly_payment", { precision: 10, scale: 2 }),
  activeApps: text("active_apps").array(),
  totalLength: decimal("total_length", { precision: 5, scale: 1 }),
  cubicFeet: decimal("cubic_feet", { precision: 8, scale: 2 }),
  insideLength: decimal("inside_length", { precision: 5, scale: 1 }),
  insideWidth: decimal("inside_width", { precision: 5, scale: 1 }),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }),
  loanTerm: integer("loan_term"),
  financeCompany: text("finance_company"),
  downPayment: decimal("down_payment", { precision: 10, scale: 2 }),
  loanStartDate: date("loan_start_date"),
  firstPaymentDue: date("first_payment_due"),
  finalPaymentDue: date("final_payment_due"),
  remainingBalance: decimal("remaining_balance", { precision: 10, scale: 2 }),
  loanAccountNumber: text("loan_account_number"),
  financeCompanyPhone: text("finance_company_phone"),
  financeCompanyContact: text("finance_company_contact"),
  vehicleWeight: integer("vehicle_weight"),
  exteriorLength: decimal("exterior_length", { precision: 5, scale: 1 }),
  exteriorWidth: decimal("exterior_width", { precision: 5, scale: 1 }),
  exteriorHeight: decimal("exterior_height", { precision: 5, scale: 1 }),
  cargoLength: decimal("cargo_length", { precision: 5, scale: 1 }),
  cargoWidth: decimal("cargo_width", { precision: 5, scale: 1 }),
  cargoHeight: decimal("cargo_height", { precision: 5, scale: 1 }),
  cargoVolume: decimal("cargo_volume", { precision: 5, scale: 1 }),
  payloadCapacity: integer("payload_capacity"),
  towingCapacity: integer("towing_capacity"),
  engineType: text("engine_type"),
  transmission: text("transmission"),
  insuranceCompanyName: text("insurance_company_name"),
  insuranceType: text("insurance_type"),
  insuranceTypeOther: text("insurance_type_other"),
  insuranceMonthlyPremium: decimal("insurance_monthly_premium", { precision: 10, scale: 2 }),
  insurancePremiumDueDate: date("insurance_premium_due_date"),
  insuranceTotalCoverage: decimal("insurance_total_coverage", { precision: 10, scale: 2 }),
  insurancePhoneNumber: text("insurance_phone_number"),
  insuranceRepresentativeName: text("insurance_representative_name"),
  insurancePolicyNumber: text("insurance_policy_number"),
  insuranceStartDate: date("insurance_start_date"),
  bodilyInjuryCoverageLimit: text("bodily_injury_coverage_limit"),
  bodilyInjuryPremium: decimal("bodily_injury_premium", { precision: 10, scale: 2 }),
  bodilyInjuryDeductible: decimal("bodily_injury_deductible", { precision: 10, scale: 2 }),
  propertyDamageCoverageLimit: text("property_damage_coverage_limit"),
  propertyDamagePremium: decimal("property_damage_premium", { precision: 10, scale: 2 }),
  propertyDamageDeductible: decimal("property_damage_deductible", { precision: 10, scale: 2 }),
  personalInjuryProtectionStatus: text("personal_injury_protection_status"),
  personalInjuryProtectionLimit: text("personal_injury_protection_limit"),
  personalInjuryProtectionPremium: decimal("personal_injury_protection_premium", { precision: 10, scale: 2 }),
  personalInjuryProtectionDeductible: decimal("personal_injury_protection_deductible", { precision: 10, scale: 2 }),
  uninsuredMotoristBIStatus: text("uninsured_motorist_bi_status"),
  uninsuredMotoristBILimit: text("uninsured_motorist_bi_limit"),
  uninsuredMotoristBIPremium: decimal("uninsured_motorist_bi_premium", { precision: 10, scale: 2 }),
  uninsuredMotoristBIDeductible: decimal("uninsured_motorist_bi_deductible", { precision: 10, scale: 2 }),
  uninsuredMotoristPDStatus: text("uninsured_motorist_pd_status"),
  uninsuredMotoristPDLimit: text("uninsured_motorist_pd_limit"),
  uninsuredMotoristPDPremium: decimal("uninsured_motorist_pd_premium", { precision: 10, scale: 2 }),
  uninsuredMotoristPDDeductible: decimal("uninsured_motorist_pd_deductible", { precision: 10, scale: 2 }),
  accidentalDeathBenefitAmount: text("accidental_death_benefit_amount"),
  fullTermPremium: decimal("full_term_premium", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Emergency contacts
export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  relation: text("relation").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gigTags: text("gig_tags").array(),
  companiesLike: text("companies_like").array(),
  companiesBlock: text("companies_block").array(),
  notification: jsonb("notification"),
  locale: text("locale").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced gig applications with VA system
export const gigApplications = pgTable("gig_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  employerId: integer("employer_id").references(() => companies.id),
  companyName: text("company_name").notNull(),
  role: text("role").notNull(),
  channel: text("channel").notNull(), // WEB_FORM, EMAIL, PHONE, REFERRAL, OTHER
  status: text("status").default("DRAFT"), // DRAFT, SUBMITTED, UNDER_REVIEW, INTERVIEW, OFFER, HIRED, REJECTED, WITHDRAWN
  submittedAt: timestamp("submitted_at"),
  externalRef: text("external_ref"),
  url: text("url"),
  notes: text("notes"),
  createdBy: integer("created_by").notNull().references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Audit Events
export const auditEvents = pgTable("audit_events", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").notNull().references(() => users.id),
  actorRole: text("actor_role").notNull(), // USER, VA, ADMIN
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactLogs = pgTable("contact_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  dateCalled: timestamp("date_called").notNull(),
  messageLeft: text("message_left"),
  response: text("response"),
  notes: text("notes"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
});

// Dismissed GigBot recommendations tracking
export const dismissedRecommendations = pgTable("dismissed_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyId: integer("company_id").notNull().references(() => companies.id),
  companyName: text("company_name").notNull(),
  dismissedAt: timestamp("dismissed_at").defaultNow(),
  reason: text("reason"), // Optional reason for dismissal
});

export const jobSearchNotes = pgTable("job_search_notes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  applicationId: integer("application_id").notNull().references(() => applications.id, { onDelete: 'cascade' }),
  companyId: integer("company_id").notNull().references(() => companies.id),
  dateApplied: timestamp("date_applied"),
  contactDate: timestamp("contact_date"),
  interviewDate: timestamp("interview_date"),
  contactName: text("contact_name"),
  phoneNumber: text("phone_number"),
  emailAddress: text("email_address"),
  personSpokenWith: text("person_spoken_with"),
  conversationSummary: text("conversation_summary"),
  notes: text("notes"),
  followUpDate: timestamp("follow_up_date"),
  followUpReminder: boolean("follow_up_reminder").default(false),
  reminderDate: timestamp("reminder_date"),
  reminderTime: varchar("reminder_time"),
  reminderText: text("reminder_text"),
  applicationStatus: text("application_status").default("Applied"), // Applied, Interview Scheduled, Follow-up, Hired, Rejected
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activeJobs: integer("active_jobs").default(0),
  weeklyEarnings: decimal("weekly_earnings", { precision: 10, scale: 2 }).default("0"),
  totalApplications: integer("total_applications").default(0),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Newsletter subscribers table for waitlist collection
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  platform: varchar("platform", { length: 50 }).notNull(), // 'looking-for-drivers', 'cdl-driver-gigs', 'gigspro-ai'
  subscribedAt: timestamp("subscribed_at").defaultNow()
});

// Task boards table
export const taskBoards = pgTable("task_boards", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  backgroundColor: text("background_color").default("#f8fafc"),
  position: integer("position").default(0),
  isStarred: boolean("is_starred").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task lists (columns) table
export const taskLists = pgTable("task_lists", {
  id: serial("id").primaryKey(),
  boardId: integer("board_id").notNull().references(() => taskBoards.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  position: integer("position").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task cards table
export const taskCards = pgTable("task_cards", {
  id: serial("id").primaryKey(),
  listId: integer("list_id").notNull().references(() => taskLists.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").default(0),
  priority: text("priority").default("Medium"), // High, Medium, Low
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  reminderDays: integer("reminder_days").default(1),
  completedDate: timestamp("completed_date"),
  labels: text("labels").array(),
  assignedTo: text("assigned_to"),
  coverImage: text("cover_image"),
  attachments: text("attachments").array(),
  checklist: jsonb("checklist"), // Array of {id, text, completed}
  comments: jsonb("comments"), // Array of {id, text, author, timestamp}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task card attachments table
export const taskCardAttachments = pgTable("task_card_attachments", {
  id: serial("id").primaryKey(),
  cardId: integer("card_id").notNull().references(() => taskCards.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(), // MIME type
  fileSize: integer("file_size").notNull(), // Size in bytes
  filePath: text("file_path").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Task card reminders table
export const taskCardReminders = pgTable("task_card_reminders", {
  id: serial("id").primaryKey(),
  cardId: integer("card_id").notNull().references(() => taskCards.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  dueAt: timestamp("due_at").notNull(),
  channel: text("channel").notNull().default("inapp"), // 'inapp' | 'email'
  status: text("status").notNull().default("unread"), // 'unread' | 'snoozed' | 'done'
  createdAt: timestamp("created_at").defaultNow(),
});





// Removed duplicate vehicles table - using the enhanced version in VA system above

// Vehicle documents table for file uploads
export const vehicleDocuments = pgTable("vehicle_documents", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  documentCategory: text("document_category").notNull(), // vehicle_photos, insurance_policy, insurance_cards, registration, title, vehicle_warranty, tire_warranty, parts_warranty, maintenance_records, other_documents
  uploadDate: timestamp("upload_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vehicle maintenance checklist items
export const vehicleMaintenanceItems = pgTable("vehicle_maintenance_items", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").notNull(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(), // 'maintenance', 'accessory'
  description: text("description"),
  notes: text("notes"),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  isCompleted: boolean("is_completed").default(false),
  priority: text("priority").default("medium"), // 'low', 'medium', 'high'
  cost: decimal("cost", { precision: 10, scale: 2 }),
  serviceProvider: text("service_provider"),
  reminderEnabled: boolean("reminder_enabled").default(false),
  reminderDays: integer("reminder_days").default(7),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fuelCards = pgTable("fuel_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardName: text("card_name").notNull(),
  provider: text("provider").notNull(),
  cardType: text("card_type").notNull(),
  cardNumber: text("card_number").notNull(),
  expiryDate: text("expiry_date"),
  status: text("status").default("active"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default("0"),
  monthlyLimit: decimal("monthly_limit", { precision: 10, scale: 2 }).default("0"),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0"),
  monthlySpent: decimal("monthly_spent", { precision: 10, scale: 2 }).default("0"),
  lastUsed: timestamp("last_used"),
  pinRequired: boolean("pin_required").default(false),
  restrictions: text("restrictions").array(),
  rewards: text("rewards"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User saved fuel cards table
export const userSavedFuelCards = pgTable("user_saved_fuel_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  cardName: text("card_name").notNull(),
  cardProvider: text("card_provider").notNull(),
  rebateOffer: text("rebate_offer"),
  monthlySpend: decimal("monthly_spend", { precision: 10, scale: 2 }).default("0.00"),
  earnedRebates: decimal("earned_rebates", { precision: 10, scale: 2 }).default("0.00"),
  personalNotes: text("personal_notes"),
  rating: integer("rating"), // 1-5 stars
  dateAdded: timestamp("date_added").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Fuel card spend history table
export const fuelCardSpendHistory = pgTable("fuel_card_spend_history", {
  id: serial("id").primaryKey(),
  savedCardId: integer("saved_card_id").notNull().references(() => userSavedFuelCards.id),
  userId: integer("user_id").notNull().references(() => users.id),
  spendAmount: decimal("spend_amount", { precision: 10, scale: 2 }).notNull(),
  rebateEarned: decimal("rebate_earned", { precision: 10, scale: 2 }).default("0.00"),
  recordDate: date("record_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business Entities table
export const businessEntities = pgTable("business_entities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  businessType: text("business_type").notNull(), // LLC, Corporation, etc.
  registeredAgent: text("registered_agent"),
  registeredAgentAddress: text("registered_agent_address"),
  registeredAgentCity: text("registered_agent_city"),
  registeredAgentState: text("registered_agent_state"),
  registeredAgentZipCode: text("registered_agent_zip_code"),
  registeredAgentPhone: text("registered_agent_phone"),
  sosFileNumber: text("sos_file_number"),
  sosFileLink: text("sos_file_link"),
  effectiveSosDate: date("effective_sos_date"),
  rightToTransactStatus: text("right_to_transact_status"),
  sosRegistrationStatus: text("sos_registration_status"),
  formationDate: date("formation_date"),
  companyAddress: text("company_address"),
  companyCity: text("company_city"),
  companyState: text("company_state"),
  companyZipCode: text("company_zip_code"),
  mailboxProvider: text("mailbox_provider"),
  mailboxProviderWebsite: text("mailbox_provider_website"),
  mailboxProviderLogin: text("mailbox_provider_login"),
  mailboxRenewalDate: date("mailbox_renewal_date"),
  mailboxMonthlyCost: text("mailbox_monthly_cost"),
  mailboxNumber: text("mailbox_number"),
  mailboxAddress: text("mailbox_address"),
  mailboxPhone: text("mailbox_phone"),
  companyPhone: text("company_phone"),
  phoneProvider: text("phone_provider"),
  ein: text("ein"),
  stateOfOrganization: text("state_of_organization"),
  currentManagingMembers: text("current_managing_members"),
  banking: text("banking"),
  banking2: text("banking2"),
  nameOfAccountHolder1: text("name_of_account_holder1"),
  nameOfAccountHolder2: text("name_of_account_holder2"),
  // Primary Bank Fields
  bankName: text("bank_name"),
  routingNumber: text("routing_number"), 
  accountNumber: text("account_number"),
  bankAddress: text("bank_address"),
  // Secondary Bank Fields
  bank2Name: text("bank2_name"),
  bank2RoutingNumber: text("bank2_routing_number"),
  bank2AccountNumber: text("bank2_account_number"), 
  bank2Address: text("bank2_address"),
  // Third Bank Fields
  bank3Name: text("bank3_name"),
  bank3RoutingNumber: text("bank3_routing_number"),
  bank3AccountNumber: text("bank3_account_number"),
  bank3Address: text("bank3_address"),
  status: text("status").default("active"),
  organizer: text("organizer"),
  website: text("website"),
  websiteHost: text("website_host"),
  websiteHostLogin: text("website_host_login"),
  websiteHostRenewalDate: date("website_host_renewal_date"),
  websiteDomainExpirationDate: date("website_domain_expiration_date"),
  email: text("email"),
  emailLogin: text("email_login"),
  franchiseTaxFilingDate: date("franchise_tax_filing_date"),
  franchiseTaxLogin: text("franchise_tax_login"),
  franchiseTaxNumber: text("franchise_tax_number"),
  franchiseXtNumber: text("franchise_xt_number"),
  franchiseTaxReminderMethod: text("franchise_tax_reminder_method"),
  franchiseTaxReminderEmails: text("franchise_tax_reminder_emails"),
  franchiseTaxReminderPhones: text("franchise_tax_reminder_phones"),
  franchiseTaxReminderDate: date("franchise_tax_reminder_date"),
  franchiseTaxReminderFrequency: text("franchise_tax_reminder_frequency"),
  franchiseTaxReminderLeadDays: integer("franchise_tax_reminder_lead_days"),
  publicInfoReport: text("public_info_report"),
  publicInfoReportFilingDate: date("public_info_report_filing_date"),
  publicInfoReportReminderMethod: text("public_info_report_reminder_method"),
  publicInfoReportReminderEmails: text("public_info_report_reminder_emails"),
  publicInfoReportReminderPhones: text("public_info_report_reminder_phones"),
  publicInfoReportReminderDate: date("public_info_report_reminder_date"),
  publicInfoReportReminderFrequency: text("public_info_report_reminder_frequency"),
  publicInfoReportReminderLeadDays: integer("public_info_report_reminder_lead_days"),
  
  // Tax Deadlines
  annualReportDue: date("annual_report_due"),
  businessFilingExpiry: date("business_filing_expiry"),
  annualTaxFiling: date("annual_tax_filing"),
  q1TaxDue: date("q1_tax_due"),
  q2TaxDue: date("q2_tax_due"),
  q3TaxDue: date("q3_tax_due"),
  q4TaxDue: date("q4_tax_due"),
  dunBradstreetNumber: text("dun_bradstreet_number"),
  dunBradstreetWebsite: text("dun_bradstreet_website"),
  nicis: text("nicis"),
  navCreditHealth: text("nav_credit_health"),
  // Business Credit Scores
  experianIntelliscoreScore: text("experian_intelliscore_score"),
  experianIntelliscoreRating: text("experian_intelliscore_rating"),
  dunBradstreetPaydexScore: text("dun_bradstreet_paydex_score"),
  equifaxBusinessDelinquencyScore: text("equifax_business_delinquency_score"),
  equifaxBusinessRating: text("equifax_business_rating"),
  ficoSmallBusinessScore: text("fico_small_business_score"),
  
  // Personal Credit Scores
  experianPersonalScore: text("experian_personal_score"),
  transUnionPersonalScore: text("trans_union_personal_score"),
  equifaxPersonalScore: text("equifax_personal_score"),
  
  // Additional Business Credit Fields  
  businessCreditCard: text("business_credit_card"),
  dAndBNumber: text("d_and_b_number"),
  nicisNumber: text("nicis_number"),
  equifaxBusinessScore: text("equifax_business_score"),
  
  // Enhanced Business Planning Fields
  executiveSummary: text("executive_summary"),
  businessDescription: text("business_description"),
  servicesOffered: text("services_offered"),
  targetMarket: text("target_market"),
  marketSize: text("market_size"),
  competitiveAnalysis: text("competitive_analysis"),
  competitiveAdvantage: text("competitive_advantage"),
  marketingStrategy: text("marketing_strategy"),
  salesStrategy: text("sales_strategy"),
  operationsPlan: text("operations_plan"),
  managementTeam: text("management_team"),
  organizationStructure: text("organization_structure"),
  startupCosts: text("startup_costs"),
  monthlyExpenses: text("monthly_expenses"),
  revenueProjections: text("revenue_projections"),
  breakEvenAnalysis: text("break_even_analysis"),
  fundingRequirements: text("funding_requirements"),
  riskAnalysis: text("risk_analysis"),
  growthStrategy: text("growth_strategy"),
  exitStrategy: text("exit_strategy"),
  // Entity Structure Planning
  entityType: text("entity_type"),
  taxStructure: text("tax_structure"),
  ownershipStructure: text("ownership_structure"),
  liabilityProtection: text("liability_protection"),
  // Operating Agreement
  operatingAgreementStatus: text("operating_agreement_status"),
  memberRoles: text("member_roles"),
  profitDistribution: text("profit_distribution"),
  votingProcedures: text("voting_procedures"),
  // Vehicle & Equipment Planning
  vehicleType: text("vehicle_type"),
  vehicleYear: text("vehicle_year"),
  vehicleMake: text("vehicle_make"),
  vehicleModel: text("vehicle_model"),
  insuranceProvider: text("insurance_provider"),
  equipmentNeeded: text("equipment_needed"),
  // Asset Protection
  assetProtectionPlan: text("asset_protection_plan"),
  businessInsurance: text("business_insurance"),
  personalAssetSeparation: text("personal_asset_separation"),
  // Tax Planning
  stateTaxRegistration: text("state_tax_registration"),
  federalTaxSetup: text("federal_tax_setup"),
  accountingMethod: text("accounting_method"),
  quarterlyPayments: text("quarterly_payments"),
  retirementPlan: text("retirement_plan"),
  // Financial Services
  businessBankAccount: text("business_bank_account"),
  merchantAccount: text("merchant_account"),
  businessCredit: text("business_credit"),
  accountingSystem: text("accounting_system"),
  // Licensing & Insurance
  businessLicenses: text("business_licenses"),
  generalLiability: text("general_liability"),
  professionalLiability: text("professional_liability"),
  industryPermits: text("industry_permits"),
  // Branding
  logoDesign: text("logo_design"),
  trademarkApplication: text("trademark_application"),
  brandGuidelines: text("brand_guidelines"),
  brandAssets: text("brand_assets"),
  // Digital Presence
  websiteUrl: text("website_url"),
  businessEmail: text("business_email"),
  domainRegistration: text("domain_registration"),
  digitalBusinessCards: text("digital_business_cards"),
  // Digital & Email (optional for backward compatibility)
  domainName: text("domain_name"),
  domainRenewalDate: date("domain_renewal_date"),
  gmailAccount: text("gmail_account"),
  gmailPassword: text("gmail_password"),
  // Social Media Platforms
  youtubeChannel: text("youtube_channel"),
  youtubeChannelUrl: text("youtube_channel_url"),
  youtubeManager: text("youtube_manager"),
  facebookPage: text("facebook_page"),
  facebookPageUrl: text("facebook_page_url"),
  facebookManager: text("facebook_manager"),
  tiktokAccount: text("tiktok_account"),
  tiktokUrl: text("tiktok_url"),
  tiktokManager: text("tiktok_manager"),
  instagramAccount: text("instagram_account"),
  instagramUrl: text("instagram_url"),
  instagramManager: text("instagram_manager"),
  linkedinProfile: text("linkedin_profile"),
  linkedinUrl: text("linkedin_url"),
  linkedinManager: text("linkedin_manager"),
  xTwitterAccount: text("x_twitter_account"),
  xTwitterUrl: text("x_twitter_url"),
  xTwitterManager: text("x_twitter_manager"),
  snapchatAccount: text("snapchat_account"),
  snapchatUrl: text("snapchat_url"),
  snapchatManager: text("snapchat_manager"),
  pinterestAccount: text("pinterest_account"),
  pinterestUrl: text("pinterest_url"),
  pinterestManager: text("pinterest_manager"),
  threadsAccount: text("threads_account"),
  threadsUrl: text("threads_url"),
  threadsManager: text("threads_manager"),
  redditAccount: text("reddit_account"),
  redditUrl: text("reddit_url"),
  redditManager: text("reddit_manager"),
  discordServer: text("discord_server"),
  discordUrl: text("discord_url"),
  discordManager: text("discord_manager"),
  telegramChannel: text("telegram_channel"),
  telegramUrl: text("telegram_url"),
  telegramManager: text("telegram_manager"),
  // Detailed Social Media Manager Contact Information
  instagramManagerName: text("instagram_manager_name"),
  instagramManagerCompany: text("instagram_manager_company"),
  instagramManagerPhone: text("instagram_manager_phone"),
  instagramManagerEmail: text("instagram_manager_email"),
  instagramManagerAddress: text("instagram_manager_address"),
  facebookManagerName: text("facebook_manager_name"),
  facebookManagerCompany: text("facebook_manager_company"),
  facebookManagerPhone: text("facebook_manager_phone"),
  facebookManagerEmail: text("facebook_manager_email"),
  facebookManagerAddress: text("facebook_manager_address"),
  xManagerName: text("x_manager_name"),
  xManagerCompany: text("x_manager_company"),
  xManagerPhone: text("x_manager_phone"),
  xManagerEmail: text("x_manager_email"),
  xManagerAddress: text("x_manager_address"),
  linkedinManagerName: text("linkedin_manager_name"),
  linkedinManagerCompany: text("linkedin_manager_company"),
  linkedinManagerPhone: text("linkedin_manager_phone"),
  linkedinManagerEmail: text("linkedin_manager_email"),
  linkedinManagerAddress: text("linkedin_manager_address"),
  youtubeManagerName: text("youtube_manager_name"),
  youtubeManagerCompany: text("youtube_manager_company"),
  youtubeManagerPhone: text("youtube_manager_phone"),
  youtubeManagerEmail: text("youtube_manager_email"),
  youtubeManagerAddress: text("youtube_manager_address"),
  // Credit score date fields for pie charts
  experianIntelliscoreScoreDate: date("experian_intelliscore_score_date"),
  dunBradstreetPaydexScoreDate: date("dun_bradstreet_paydex_score_date"),
  equifaxBusinessScoreDate: date("equifax_business_score_date"),
  // Legacy social media fields for backward compatibility
  facebookBusiness: text("facebook_business"),
  youtubeChannelBusiness: text("youtube_channel_business"),
  instagramBusiness: text("instagram_business"),
  tiktokBusiness: text("tiktok_business"),
  // Business Classification Codes & Certifications
  naicsCode: text("naics_code"), // North American Industry Classification System
  naicsCodeDescription: text("naics_code_description"),
  sicCode: text("sic_code"), // Standard Industrial Classification
  sicCodeDescription: text("sic_code_description"),
  nigpCode: text("nigp_code"), // National Institute of Governmental Purchasing
  nigpCodeDescription: text("nigp_code_description"),
  // Driver Gig Specific Classification Codes removed - using existing naics/sic/nigp fields
  // Federal Certifications & SAM Registration
  samUei: text("sam_uei"), // Unique Entity ID in SAM.gov
  cageCode: text("cage_code"), // Commercial and Government Entity Code
  samRegistrationDate: date("sam_registration_date"),
  samExpirationDate: date("sam_expiration_date"),
  dunsNumber: text("duns_number"), // Data Universal Numbering System
  // Small Business Certifications
  sbaSmallBusiness: boolean("sba_small_business").default(false),
  sba8aCertification: boolean("sba_8a_certification").default(false),
  sba8aStartDate: date("sba_8a_start_date"),
  sba8aExpirationDate: date("sba_8a_expiration_date"),
  hubzoneCertified: boolean("hubzone_certified").default(false),
  hubzoneCertificationNumber: text("hubzone_certification_number"),
  hubzoneExpirationDate: date("hubzone_expiration_date"),
  // Diversity Certifications - Critical for Driver Gig Contracts
  mbeCertified: boolean("mbe_certified").default(false), // Minority Business Enterprise
  mbeCertificationNumber: text("mbe_certification_number"),
  mbeCertifyingBody: text("mbe_certifying_body"),
  mbeExpirationDate: date("mbe_expiration_date"),
  wbeCertified: boolean("wbe_certified").default(false), // Woman Business Enterprise
  wbeCertificationNumber: text("wbe_certification_number"),
  wbeExpirationDate: date("wbe_expiration_date"),
  dbeCertified: boolean("dbe_certified").default(false), // Disadvantaged Business Enterprise - KEY for Transportation
  dbeCertificationNumber: text("dbe_certification_number"),
  dbeExpirationDate: date("dbe_expiration_date"),
  dbeCertifyingState: text("dbe_certifying_state"),
  sbeCertified: boolean("sbe_certified").default(false), // Small Business Enterprise
  sbeCertificationNumber: text("sbe_certification_number"),
  sbeExpirationDate: date("sbe_expiration_date"),
  // Veteran Certifications - Important for Government Logistics Contracts
  vosbCertified: boolean("vosb_certified").default(false), // Veteran-Owned Small Business
  vosbCertificationNumber: text("vosb_certification_number"),
  sdvosbCertified: boolean("sdvosb_certified").default(false), // Service-Disabled Veteran-Owned Small Business
  sdvosbCertificationNumber: text("sdvosb_certification_number"),
  veteranExpirationDate: date("veteran_expiration_date"),
  // State-Level Certifications
  stateHubCertified: boolean("state_hub_certified").default(false), // State HUB (TX, etc.)
  stateHubCertificationNumber: text("state_hub_certification_number"),
  stateCertifyingAgency: text("state_certifying_agency"),
  stateHubExpirationDate: date("state_hub_expiration_date"),
  // Driver Gig Specific Codes
  driverGigNaicsPrimary: text("driver_gig_naics_primary"), // Primary NAICS for driver services
  driverGigNaicsSecondary: text("driver_gig_naics_secondary").array(), // Secondary NAICS codes
  courierLicense: text("courier_license"), // Local courier license number
  courierLicenseExpiration: date("courier_license_expiration"),
  commercialInsuranceRequired: boolean("commercial_insurance_required").default(false),
  dotNumber: text("dot_number"), // DOT number if applicable
  mcNumber: text("mc_number"), // MC number for interstate commerce
  // Credit Monitor Fields
  creditMonitor1Name: text("credit_monitor_1_name"),
  creditMonitor1Link: text("credit_monitor_1_link"),
  creditMonitor2Name: text("credit_monitor_2_name"),
  creditMonitor2Link: text("credit_monitor_2_link"),
  creditMonitor3Name: text("credit_monitor_3_name"),
  creditMonitor3Link: text("credit_monitor_3_link"),
  // Mailing Address Fields
  mailingAddress: text("mailing_address"),
  mailingCity: text("mailing_city"),
  mailingState: text("mailing_state"),
  mailingZipCode: text("mailing_zip_code"),
  // Enhanced Mailbox Provider Fields
  mailboxProviderAddress: text("mailbox_provider_address"),
  mailboxProviderCity: text("mailbox_provider_city"),
  mailboxProviderState: text("mailbox_provider_state"),
  mailboxProviderZip: text("mailbox_provider_zip"),
  // Company Personnel Fields
  primaryContactName: text("primary_contact_name"),
  primaryContactTitle: text("primary_contact_title"),
  primaryContactPhone: text("primary_contact_phone"),
  primaryContactEmail: text("primary_contact_email"),
  primaryContactAddress: text("primary_contact_address"),
  primaryContactCity: text("primary_contact_city"),
  primaryContactState: text("primary_contact_state"),
  primaryContactZip: text("primary_contact_zip"),
  secondaryContactName: text("secondary_contact_name"),
  secondaryContactTitle: text("secondary_contact_title"),
  secondaryContactPhone: text("secondary_contact_phone"),
  secondaryContactEmail: text("secondary_contact_email"),
  secondaryContactAddress: text("secondary_contact_address"),
  secondaryContactCity: text("secondary_contact_city"),
  secondaryContactState: text("secondary_contact_state"),
  secondaryContactZip: text("secondary_contact_zip"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactAddress: text("emergency_contact_address"),
  emergencyContactCity: text("emergency_contact_city"),
  emergencyContactState: text("emergency_contact_state"),
  emergencyContactZip: text("emergency_contact_zip"),
  // Additional Business Formation Fields
  listing411: text("listing_411"), // 411 Directory Listing
  listing411Status: text("listing_411_status"), // Active, Pending, Not Listed
  assetProtectionAttorney: text("asset_protection_attorney"), // Asset Protection Attorney/Company
  assetProtectionAttorneyPhone: text("asset_protection_attorney_phone"),
  assetProtectionAttorneyEmail: text("asset_protection_attorney_email"),
  retirementPlan401k: text("retirement_plan_401k"), // 401(K) Provider
  retirementPlan401kAccountNumber: text("retirement_plan_401k_account_number"),
  retirementPlan401kWebsite: text("retirement_plan_401k_website"),
  businessInsuranceProvider: text("business_insurance_provider"), // e.g., Next Insurance
  businessInsurancePolicyNumber: text("business_insurance_policy_number"),
  businessInsuranceWebsite: text("business_insurance_website"),
  businessInsuranceRenewalDate: date("business_insurance_renewal_date"),
  businessLicenseNumber: text("business_license_number"),
  businessLicenseType: text("business_license_type"),
  businessLicenseExpirationDate: date("business_license_expiration_date"),
  socialMediaManager: text("social_media_manager"), // e.g., Solo-to, Hootsuite, Buffer
  socialMediaManagerWebsite: text("social_media_manager_website"),
  socialMediaManagerLogin: text("social_media_manager_login"),
  businessCreditCard1: text("business_credit_card_1"), // e.g., DIVVY
  businessCreditCard1Limit: text("business_credit_card_1_limit"),
  businessCreditCard1Website: text("business_credit_card_1_website"),
  businessCreditCard2: text("business_credit_card_2"), // e.g., FundBox
  businessCreditCard2Limit: text("business_credit_card_2_limit"),
  businessCreditCard2Website: text("business_credit_card_2_website"),
  operatingAgreement: text("operating_agreement"), // Link or status
  operatingAgreementDate: date("operating_agreement_date"),
  articlesOfFormation: text("articles_of_formation"), // Link or status
  articlesOfFormationDate: date("articles_of_formation_date"),
  // Logo and Branding
  logoUrl: text("logo_url"), // Business logo file URL
  // DBA and Business Names
  dba: text("dba"), // Doing Business As name
  dbaFilingDate: date("dba_filing_date"),
  dbaExpirationDate: date("dba_expiration_date"),
  // Sales Tax and Permits
  salesTaxPermit: text("sales_tax_permit"), // Sales tax permit number
  salesTaxPermitStatus: text("sales_tax_permit_status"),
  salesTaxPermitExpirationDate: date("sales_tax_permit_expiration_date"),
  // Certificate of Good Standing
  certificateOfGoodStanding: text("certificate_of_good_standing"), // Status or document link
  certificateOfGoodStandingDate: date("certificate_of_good_standing_date"),
  certificateOfGoodStandingExpirationDate: date("certificate_of_good_standing_expiration_date"),
  // Foreign Qualification
  foreignQualification: text("foreign_qualification"), // States where qualified
  foreignQualificationStates: text("foreign_qualification_states").array(),
  foreignQualificationStatus: text("foreign_qualification_status"),
  // S Corporation Election
  sCorpElection: text("s_corp_election"), // Status
  sCorpElectionDate: date("s_corp_election_date"),
  sCorpElectionForm: text("s_corp_election_form"), // Form 2553 reference
  // LLC/Corporate Kit
  llcKitOrdered: boolean("llc_kit_ordered").default(false),
  llcKitOrderDate: date("llc_kit_order_date"),
  llcKitVendor: text("llc_kit_vendor"),
  // Amendment Tracking
  amendmentStatus: text("amendment_status"),
  amendmentDate: date("amendment_date"),
  amendmentDetails: text("amendment_details"),
  // Company Name Change
  companyNameChange: text("company_name_change"), // Previous names
  companyNameChangeDate: date("company_name_change_date"),
  // Virtual Address Services
  virtualAddressProvider: text("virtual_address_provider"),
  virtualAddressService: text("virtual_address_service"),
  virtualAddressLogin: text("virtual_address_login"),
  // Contract Templates
  contractTemplatesSource: text("contract_templates_source"), // Where contracts are stored
  contractTemplatesLink: text("contract_templates_link"),
  // Annual Report
  annualReportStatus: text("annual_report_status"),
  annualReportLastFiled: date("annual_report_last_filed"),
  // Tax Consultation
  taxConsultant: text("tax_consultant"),
  taxConsultantPhone: text("tax_consultant_phone"),
  taxConsultantEmail: text("tax_consultant_email"),
  lastTaxConsultation: date("last_tax_consultation"),
  // Dissolution and Reinstatement
  dissolutionStatus: text("dissolution_status"), // Active, Dissolved, Reinstated
  dissolutionDate: date("dissolution_date"),
  reinstatementDate: date("reinstatement_date"),
  reinstatementStatus: text("reinstatement_status"),
  // Business Card and Branding
  businessCardDesign: text("business_card_design"), // File or link
  businessCardPrintVendor: text("business_card_print_vendor"),
  brandedMerchandise: text("branded_merchandise"), // Shirts, hats, etc.
  brandedMerchandiseVendor: text("branded_merchandise_vendor"),
  // Reminder Settings for Expiration Dates
  annualReportDueReminderMethod: text("annual_report_due_reminder_method"),
  annualReportDueReminderEmails: text("annual_report_due_reminder_emails"),
  annualReportDueReminderPhones: text("annual_report_due_reminder_phones"),
  annualReportDueReminderDate: date("annual_report_due_reminder_date"),
  annualReportDueReminderFrequency: text("annual_report_due_reminder_frequency"),
  annualReportDueReminderLeadDays: integer("annual_report_due_reminder_lead_days"),
  businessFilingExpiryReminderMethod: text("business_filing_expiry_reminder_method"),
  businessFilingExpiryReminderEmails: text("business_filing_expiry_reminder_emails"),
  businessFilingExpiryReminderPhones: text("business_filing_expiry_reminder_phones"),
  businessFilingExpiryReminderDate: date("business_filing_expiry_reminder_date"),
  businessFilingExpiryReminderFrequency: text("business_filing_expiry_reminder_frequency"),
  businessFilingExpiryReminderLeadDays: integer("business_filing_expiry_reminder_lead_days"),
  domainExpirationReminderMethod: text("domain_expiration_reminder_method"),
  domainExpirationReminderEmails: text("domain_expiration_reminder_emails"),
  domainExpirationReminderPhones: text("domain_expiration_reminder_phones"),
  domainExpirationReminderDate: date("domain_expiration_reminder_date"),
  domainExpirationReminderFrequency: text("domain_expiration_reminder_frequency"),
  domainExpirationReminderLeadDays: integer("domain_expiration_reminder_lead_days"),
  annualTaxFilingReminderMethod: text("annual_tax_filing_reminder_method"),
  annualTaxFilingReminderEmails: text("annual_tax_filing_reminder_emails"),
  annualTaxFilingReminderPhones: text("annual_tax_filing_reminder_phones"),
  annualTaxFilingReminderDate: date("annual_tax_filing_reminder_date"),
  annualTaxFilingReminderFrequency: text("annual_tax_filing_reminder_frequency"),
  annualTaxFilingReminderLeadDays: integer("annual_tax_filing_reminder_lead_days"),
  q1TaxDueReminderMethod: text("q1_tax_due_reminder_method"),
  q1TaxDueReminderEmails: text("q1_tax_due_reminder_emails"),
  q1TaxDueReminderPhones: text("q1_tax_due_reminder_phones"),
  q1TaxDueReminderDate: date("q1_tax_due_reminder_date"),
  q1TaxDueReminderFrequency: text("q1_tax_due_reminder_frequency"),
  q1TaxDueReminderLeadDays: integer("q1_tax_due_reminder_lead_days"),
  q2TaxDueReminderMethod: text("q2_tax_due_reminder_method"),
  q2TaxDueReminderEmails: text("q2_tax_due_reminder_emails"),
  q2TaxDueReminderPhones: text("q2_tax_due_reminder_phones"),
  q2TaxDueReminderDate: date("q2_tax_due_reminder_date"),
  q2TaxDueReminderFrequency: text("q2_tax_due_reminder_frequency"),
  q2TaxDueReminderLeadDays: integer("q2_tax_due_reminder_lead_days"),
  q3TaxDueReminderMethod: text("q3_tax_due_reminder_method"),
  q3TaxDueReminderEmails: text("q3_tax_due_reminder_emails"),
  q3TaxDueReminderPhones: text("q3_tax_due_reminder_phones"),
  q3TaxDueReminderDate: date("q3_tax_due_reminder_date"),
  q3TaxDueReminderFrequency: text("q3_tax_due_reminder_frequency"),
  q3TaxDueReminderLeadDays: integer("q3_tax_due_reminder_lead_days"),
  q4TaxDueReminderMethod: text("q4_tax_due_reminder_method"),
  q4TaxDueReminderEmails: text("q4_tax_due_reminder_emails"),
  q4TaxDueReminderPhones: text("q4_tax_due_reminder_phones"),
  q4TaxDueReminderDate: date("q4_tax_due_reminder_date"),
  q4TaxDueReminderFrequency: text("q4_tax_due_reminder_frequency"),
  q4TaxDueReminderLeadDays: integer("q4_tax_due_reminder_lead_days"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Documents table
export const businessDocuments = pgTable("business_documents", {
  id: serial("id").primaryKey(),
  businessEntityId: integer("business_entity_id").notNull().references(() => businessEntities.id),
  userId: integer("user_id").notNull().references(() => users.id),
  documentName: text("document_name").notNull(),
  documentType: text("document_type").notNull(), // Business Plan, EIN Letter, Articles of Formation, etc.
  fileUrl: text("file_url"),
  googleFileLink: text("google_file_link"),
  documentCategory: text("document_category").notNull(), // Formation, Tax, Banking, Legal, etc.
  notes: text("notes"),
  issuedDate: date("issued_date"),
  expiryDate: date("expiry_date"),
  status: text("status").default("active"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Custom Document Names table - for user-defined names for Custom Document slots
export const customDocumentNames = pgTable("custom_document_names", {
  id: serial("id").primaryKey(),
  businessEntityId: integer("business_entity_id").notNull().references(() => businessEntities.id),
  userId: integer("user_id").notNull().references(() => users.id),
  slotNumber: integer("slot_number").notNull(), // 1, 2, 3, or 4 for Custom Document 1-4
  customName: text("custom_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Tradelines table - Track business loans and credit cards
export const businessTradelines = pgTable("business_tradelines", {
  id: serial("id").primaryKey(),
  businessEntityId: integer("business_entity_id").notNull().references(() => businessEntities.id),
  userId: integer("user_id").notNull().references(() => users.id),
  tradelineType: text("tradeline_type").notNull(), // 'loan' or 'credit_card'
  slotNumber: integer("slot_number").notNull(), // 1-5 for loans, 1-5 for credit cards
  issuingCompany: text("issuing_company"),
  accountType: text("account_type"), // e.g., "Business Line of Credit", "Term Loan", "Business Credit Card"
  accountNumber: text("account_number"), // Last 4 digits or reference
  dateOpened: date("date_opened"),
  originalAmount: decimal("original_amount", { precision: 12, scale: 2 }),
  currentBalance: decimal("current_balance", { precision: 12, scale: 2 }),
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }), // APR percentage
  monthlyPayment: decimal("monthly_payment", { precision: 10, scale: 2 }),
  paymentDueDate: integer("payment_due_date"), // Day of month (1-31)
  maturityDate: date("maturity_date"), // For loans
  accountStatus: text("account_status").default("active"), // active, paid_off, closed
  paymentHistory: text("payment_history"), // Track on-time payment status
  reportsToCreditBureaus: boolean("reports_to_credit_bureaus").default(true),
  notes: text("notes"),
  // Additional credit card fields
  website: text("website"),
  cardTypeCategory: text("card_type_category"), // credit or debit
  expiration: text("expiration"), // MM/YY format
  secCode: text("sec_code"), // CVV/Security Code
  monitor: text("monitor"), // Monitoring service
  internalLateDate: integer("internal_late_date"), // Day of month (1-31)
  officialLateDate: integer("official_late_date"), // Day of month (1-31)
  reportDate: date("report_date"), // Report/Settlement date
  login: text("login"), // Username or email for account access
  password: text("password"), // Password for account access
  autoPay: text("auto_pay"), // yes or no
  autoPayAcct: text("auto_pay_acct"), // Bank account for autopay
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Formation Data table
// Enhanced Rideshare Companies table for GigBot
export const rideshareCompanies = pgTable("rideshare_companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  regionCoverage: text("region_coverage").array(), // Array of regions like ["TX", "CA", "nationwide"]
  vehicleRequirements: text("vehicle_requirements").notNull(), // "Any vehicle", "SUV required", etc.
  onboardingSpeed: text("onboarding_speed").notNull(), // "fast", "medium", "slow"
  payModel: text("pay_model").notNull(), // "per_delivery", "hourly", "commission"
  avgHourlyEstimate: decimal("avg_hourly_estimate", { precision: 5, scale: 2 }),
  nicheTags: jsonb("niche_tags"), // JSON array for tags like ["food_delivery", "grocery", "medical"]
  url: text("url"),
  description: text("description"),
  minVehicleYear: integer("min_vehicle_year"),
  backgroundCheckRequired: boolean("background_check_required").default(true),
  commercialInsuranceRequired: boolean("commercial_insurance_required").default(false),
  phoneRequired: boolean("phone_required").default(true),
  ageRequirement: integer("age_requirement").default(18),
  drivingRecordYears: integer("driving_record_years").default(3),
  signupBonus: decimal("signup_bonus", { precision: 8, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User company status tracking for GigBot recommendations
export const userCompanyStatus = pgTable("user_company_status", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyId: integer("company_id").references(() => rideshareCompanies.id),
  status: text("status").notNull(), // "active", "applied", "rejected", "paused", "interested"
  notes: text("notes"),
  applicationDate: date("application_date"),
  hireDate: date("hire_date"),
  avgWeeklyEarnings: decimal("avg_weekly_earnings", { precision: 10, scale: 2 }),
  avgHoursPerWeek: decimal("avg_hours_per_week", { precision: 5, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }), // Driver rating with company
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Chat conversations for GigBot
export const aiChatConversations = pgTable("ai_chat_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(),
  messages: jsonb("messages").notNull(), // Store array of messages
  metadata: jsonb("metadata"), // Store additional context, sources, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const businessFormationData = pgTable("business_formation_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessId: text("business_id").notNull(), // UUID for multiple business support
  businessName: text("business_name").notNull(),
  // Step 1: Business Name & Domain
  domainName: text("domain_name"),
  domainProvider: text("domain_provider"),
  gmailAccount: text("gmail_account"),
  youtubeChannel: text("youtube_channel"),
  facebookPage: text("facebook_page"),
  tiktokUsername: text("tiktok_username"),
  trademarkStatus: text("trademark_status"),
  trademarkNumber: text("trademark_number"),
  trademarkFilingDate: date("trademark_filing_date"),
  // Step 2: Business Plan - Comprehensive Template
  executiveSummary: text("executive_summary"),
  businessDescription: text("business_description"),
  servicesOffered: text("services_offered"),
  targetMarket: text("target_market"),
  marketSize: text("market_size"),
  competitiveAnalysis: text("competitive_analysis"),
  competitiveAdvantage: text("competitive_advantage"),
  marketingStrategy: text("marketing_strategy"),
  salesStrategy: text("sales_strategy"),
  operationsPlan: text("operations_plan"),
  managementTeam: text("management_team"),
  organizationStructure: text("organization_structure"),
  startupCosts: text("startup_costs"),
  monthlyExpenses: text("monthly_expenses"),
  revenueProjections: text("revenue_projections"),
  breakEvenAnalysis: text("break_even_analysis"),
  fundingRequirements: text("funding_requirements"),
  riskAnalysis: text("risk_analysis"),
  growthStrategy: text("growth_strategy"),
  exitStrategy: text("exit_strategy"),
  // Legacy fields for backward compatibility
  businessModel: text("business_model"),
  marketingPlan: text("marketing_plan"),
  // Step 3: Business Entity Structure
  entityType: text("entity_type"),
  taxStructure: text("tax_structure"),
  ownershipStructure: text("ownership_structure"),
  liabilityProtection: text("liability_protection"),
  // Step 4: Registered Agent & Address
  registeredAgent: text("registered_agent"),
  registeredAgentService: text("registered_agent_service"),
  businessAddress: text("business_address"),
  mailboxService: text("mailbox_service"),
  mailboxProvider: text("mailbox_provider"),
  // Step 5: Operating Agreement
  operatingAgreementStatus: text("operating_agreement_status"),
  memberRoles: text("member_roles"),
  profitDistribution: text("profit_distribution"),
  votingProcedures: text("voting_procedures"),
  // Step 6: Vehicle Setup
  vehicleType: text("vehicle_type"),
  vehicleYear: text("vehicle_year"),
  vehicleMake: text("vehicle_make"),
  vehicleModel: text("vehicle_model"),
  insuranceProvider: text("insurance_provider"),
  equipmentNeeded: text("equipment_needed"),
  // Step 7: Form Business & Register
  filingState: text("filing_state"),
  einNumber: text("ein_number"),
  businessPhone: text("business_phone"),
  listingService: text("listing_service"),
  sosFileNumber: text("sos_file_number"),
  // Step 8: Asset Protection
  assetProtectionPlan: text("asset_protection_plan"),
  businessInsurance: text("business_insurance"),
  personalAssetSeparation: text("personal_asset_separation"),
  // Step 9: Tax Planning
  stateTaxRegistration: text("state_tax_registration"),
  federalTaxSetup: text("federal_tax_setup"),
  accountingMethod: text("accounting_method"),
  quarterlyPayments: text("quarterly_payments"),
  retirementPlan: text("retirement_plan"),
  // Step 10: Banking & Financial Services
  businessBankAccount: text("business_bank_account"),
  merchantAccount: text("merchant_account"),
  businessCredit: text("business_credit"),
  accountingSystem: text("accounting_system"),
  // Step 11: Business Insurance & Licensing
  businessLicenses: text("business_licenses"),
  generalLiability: text("general_liability"),
  professionalLiability: text("professional_liability"),
  industryPermits: text("industry_permits"),
  // Step 12: Branding & Trademark
  logoDesign: text("logo_design"),
  trademarkApplication: text("trademark_application"),
  brandGuidelines: text("brand_guidelines"),
  brandAssets: text("brand_assets"),
  // Step 13: Website & Digital Presence
  websiteUrl: text("website_url"),
  businessEmail: text("business_email"),
  domainRegistration: text("domain_registration"),
  digitalBusinessCards: text("digital_business_cards"),
  // Step 14: Social Media Setup
  facebookBusiness: text("facebook_business"),
  linkedinProfile: text("linkedin_profile"),
  youtubeChannelBusiness: text("youtube_channel_business"),
  instagramBusiness: text("instagram_business"),
  tiktokBusiness: text("tiktok_business"),
  // Progress tracking
  completedSteps: jsonb("completed_steps").default([]), // Array of completed step IDs
  completedSubTasks: jsonb("completed_sub_tasks").default({}), // Object mapping step-task to completion status
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  applications: many(applications),
  courseProgress: many(userCourseProgress),
  documents: many(documents),
  contactLogs: many(contactLogs),
  taskBoards: many(taskBoards),
  vehicles: many(vehicles),
  fuelCards: many(fuelCards),
  businessEntities: many(businessEntities),
  businessDocuments: many(businessDocuments),
  businessFormationData: many(businessFormationData),
  stats: one(userStats),
  activities: many(userActivity),
  adminLogsAsAdmin: many(adminLogs, { relationName: "adminUser" }),
  adminLogsAsTarget: many(adminLogs, { relationName: "targetUser" }),
}));

export const userActivityRelations = relations(userActivity, ({ one }) => ({
  user: one(users, { fields: [userActivity.userId], references: [users.id] }),
}));

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
  adminUser: one(users, { fields: [adminLogs.adminUserId], references: [users.id], relationName: "adminUser" }),
  targetUser: one(users, { fields: [adminLogs.targetUserId], references: [users.id], relationName: "targetUser" }),
}));

// Task board relations
export const taskBoardsRelations = relations(taskBoards, ({ one, many }) => ({
  user: one(users, { fields: [taskBoards.userId], references: [users.id] }),
  lists: many(taskLists),
}));

export const taskListsRelations = relations(taskLists, ({ one, many }) => ({
  board: one(taskBoards, { fields: [taskLists.boardId], references: [taskBoards.id] }),
  cards: many(taskCards),
}));

export const taskCardsRelations = relations(taskCards, ({ one, many }) => ({
  list: one(taskLists, { fields: [taskCards.listId], references: [taskLists.id] }),
  attachments: many(taskCardAttachments),
  reminders: many(taskCardReminders),
}));

export const taskCardAttachmentsRelations = relations(taskCardAttachments, ({ one }) => ({
  card: one(taskCards, { fields: [taskCardAttachments.cardId], references: [taskCards.id] }),
  user: one(users, { fields: [taskCardAttachments.userId], references: [users.id] }),
}));

export const taskCardRemindersRelations = relations(taskCardReminders, ({ one }) => ({
  card: one(taskCards, { fields: [taskCardReminders.cardId], references: [taskCards.id] }),
  user: one(users, { fields: [taskCardReminders.userId], references: [users.id] }),
}));


export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  user: one(users, { fields: [vehicles.userId], references: [users.id] }),
}));

export const fuelCardsRelations = relations(fuelCards, ({ one }) => ({
  user: one(users, { fields: [fuelCards.userId], references: [users.id] }),
}));

export const businessEntitiesRelations = relations(businessEntities, ({ one, many }) => ({
  user: one(users, { fields: [businessEntities.userId], references: [users.id] }),
  documents: many(businessDocuments),
  tradelines: many(businessTradelines),
}));

export const businessDocumentsRelations = relations(businessDocuments, ({ one }) => ({
  user: one(users, { fields: [businessDocuments.userId], references: [users.id] }),
  businessEntity: one(businessEntities, { fields: [businessDocuments.businessEntityId], references: [businessEntities.id] }),
}));

export const customDocumentNamesRelations = relations(customDocumentNames, ({ one }) => ({
  user: one(users, { fields: [customDocumentNames.userId], references: [users.id] }),
  businessEntity: one(businessEntities, { fields: [customDocumentNames.businessEntityId], references: [businessEntities.id] }),
}));

export const businessTradelinesRelations = relations(businessTradelines, ({ one }) => ({
  user: one(users, { fields: [businessTradelines.userId], references: [users.id] }),
  businessEntity: one(businessEntities, { fields: [businessTradelines.businessEntityId], references: [businessEntities.id] }),
}));

export const businessFormationDataRelations = relations(businessFormationData, ({ one }) => ({
  user: one(users, { fields: [businessFormationData.userId], references: [users.id] }),
}));

// GigBot Relations
export const rideshareCompaniesRelations = relations(rideshareCompanies, ({ many }) => ({
  userStatuses: many(userCompanyStatus),
}));

export const userCompanyStatusRelations = relations(userCompanyStatus, ({ one }) => ({
  user: one(users, { fields: [userCompanyStatus.userId], references: [users.id] }),
  company: one(rideshareCompanies, { fields: [userCompanyStatus.companyId], references: [rideshareCompanies.id] }),
}));

export const aiChatConversationsRelations = relations(aiChatConversations, ({ one }) => ({
  user: one(users, { fields: [aiChatConversations.userId], references: [users.id] }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  applications: many(applications),

  contactLogs: many(contactLogs),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(users, { fields: [applications.userId], references: [users.id] }),
  company: one(companies, { fields: [applications.companyId], references: [companies.id] }),
  jobSearchNotes: many(jobSearchNotes),
}));

export const jobSearchNotesRelations = relations(jobSearchNotes, ({ one }) => ({
  user: one(users, { fields: [jobSearchNotes.userId], references: [users.id] }),
  application: one(applications, { fields: [jobSearchNotes.applicationId], references: [applications.id] }),
  company: one(companies, { fields: [jobSearchNotes.companyId], references: [companies.id] }),
}));



export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userCourseProgress),
}));

export const userCourseProgressRelations = relations(userCourseProgress, ({ one }) => ({
  user: one(users, { fields: [userCourseProgress.userId], references: [users.id] }),
  course: one(courses, { fields: [userCourseProgress.courseId], references: [courses.id] }),
}));

// Insert and Select Schemas with CRITICAL security enum validation
// SECURITY: Use proper enums to prevent privilege escalation attacks
export const insertUserSchema = createInsertSchema(users)
  .omit({ createdAt: true, updatedAt: true })
  .extend({
    role: z.enum([ROLES.OWNER, ROLES.ASSISTANT, ROLES.VIEWER]).optional(),
    status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.SUSPENDED, USER_STATUS.DELETED]).optional()
  });

export const selectUserSchema = createSelectSchema(users)
  .extend({
    role: z.enum([ROLES.OWNER, ROLES.ASSISTANT, ROLES.VIEWER]),
    status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.SUSPENDED, USER_STATUS.DELETED])
  });

export const insertCompanySchema = createInsertSchema(companies).omit({ id: true, createdAt: true });
export const selectCompanySchema = createSelectSchema(companies);

export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, dateAdded: true });
export const selectApplicationSchema = createSelectSchema(applications);



export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true });
export const selectCourseSchema = createSelectSchema(courses);


export const insertContactLogSchema = createInsertSchema(contactLogs).omit({ id: true });
export const selectContactLogSchema = createSelectSchema(contactLogs);

export const insertJobSearchNoteSchema = createInsertSchema(jobSearchNotes).omit({ id: true, createdAt: true, updatedAt: true });
export const selectJobSearchNoteSchema = createSelectSchema(jobSearchNotes);



export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true, createdAt: true });
export const selectVehicleSchema = createSelectSchema(vehicles);

export const insertVehicleMaintenanceItemSchema = createInsertSchema(vehicleMaintenanceItems).omit({ id: true, createdAt: true, updatedAt: true });
export const selectVehicleMaintenanceItemSchema = createSelectSchema(vehicleMaintenanceItems);

export const insertFuelCardSchema = createInsertSchema(fuelCards).omit({ id: true, createdAt: true });
export const selectFuelCardSchema = createSelectSchema(fuelCards);

export const insertBusinessEntitySchema = createInsertSchema(businessEntities).omit({ id: true, createdAt: true, updatedAt: true });
export const selectBusinessEntitySchema = createSelectSchema(businessEntities);

export const insertBusinessDocumentSchema = createInsertSchema(businessDocuments).omit({ id: true, createdAt: true, updatedAt: true });
export const selectBusinessDocumentSchema = createSelectSchema(businessDocuments);

export const insertCustomDocumentNameSchema = createInsertSchema(customDocumentNames).omit({ id: true, createdAt: true, updatedAt: true });
export const selectCustomDocumentNameSchema = createSelectSchema(customDocumentNames);

export const insertBusinessTradelineSchema = createInsertSchema(businessTradelines).omit({ id: true, createdAt: true, updatedAt: true });
export const selectBusinessTradelineSchema = createSelectSchema(businessTradelines);

export const insertBusinessFormationDataSchema = createInsertSchema(businessFormationData).omit({ id: true, createdAt: true, updatedAt: true });
export const selectBusinessFormationDataSchema = createSelectSchema(businessFormationData);

// === VA SYSTEM ZOD SCHEMAS ===
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const selectUserProfileSchema = createSelectSchema(userProfiles);

export const insertAddressSchema = createInsertSchema(addresses).omit({ id: true, createdAt: true, updatedAt: true });
export const selectAddressSchema = createSelectSchema(addresses);

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({ id: true, createdAt: true, updatedAt: true });
export const selectEmergencyContactSchema = createSelectSchema(emergencyContacts);

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true, createdAt: true, updatedAt: true });
export const selectUserPreferencesSchema = createSelectSchema(userPreferences);

export const insertGigApplicationSchema = createInsertSchema(gigApplications).omit({ id: true, createdAt: true, updatedAt: true });
export const selectGigApplicationSchema = createSelectSchema(gigApplications);

// VA Activity schemas
export const insertVAActivitySchema = createInsertSchema(vaActivity).omit({ id: true, createdAt: true, updatedAt: true });
export const selectVAActivitySchema = createSelectSchema(vaActivity);

// VA Assignment schemas
export const insertVAAssignmentSchema = createInsertSchema(vaAssignments).omit({ id: true, createdAt: true, updatedAt: true });
export const selectVAAssignmentSchema = createSelectSchema(vaAssignments);

// Consent Grant schemas
export const insertConsentGrantSchema = createInsertSchema(consentGrants).omit({ id: true, createdAt: true, updatedAt: true });
export const selectConsentGrantSchema = createSelectSchema(consentGrants);





export const insertAuditEventSchema = createInsertSchema(auditEvents).omit({ id: true, createdAt: true });
export const selectAuditEventSchema = createSelectSchema(auditEvents);



// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

// Application with company data for API responses
export type ApplicationWithCompany = Application & {
  company: Company | null;
};



export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;


export type ContactLog = typeof contactLogs.$inferSelect;
export type InsertContactLog = z.infer<typeof insertContactLogSchema>;

export type JobSearchNote = typeof jobSearchNotes.$inferSelect;
export type InsertJobSearchNote = z.infer<typeof insertJobSearchNoteSchema>;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

// === VA SYSTEM TYPES ===
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = z.infer<typeof insertAddressSchema>;

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

export type GigApplication = typeof gigApplications.$inferSelect;
export type InsertGigApplication = z.infer<typeof insertGigApplicationSchema>;

export type VAActivity = typeof vaActivity.$inferSelect;
export type InsertVAActivity = z.infer<typeof insertVAActivitySchema>;

export type VAAssignment = typeof vaAssignments.$inferSelect;
export type InsertVAAssignment = z.infer<typeof insertVAAssignmentSchema>;

export type ConsentGrant = typeof consentGrants.$inferSelect;
export type InsertConsentGrant = z.infer<typeof insertConsentGrantSchema>;





export type AuditEvent = typeof auditEvents.$inferSelect;
export type InsertAuditEvent = z.infer<typeof insertAuditEventSchema>;

export type VehicleMaintenanceItem = typeof vehicleMaintenanceItems.$inferSelect;
export type InsertVehicleMaintenanceItem = z.infer<typeof insertVehicleMaintenanceItemSchema>;



export type FuelCard = typeof fuelCards.$inferSelect;
export type InsertFuelCard = z.infer<typeof insertFuelCardSchema>;

export type BusinessEntity = typeof businessEntities.$inferSelect;
export type InsertBusinessEntity = z.infer<typeof insertBusinessEntitySchema>;

export type BusinessDocument = typeof businessDocuments.$inferSelect;
export type InsertBusinessDocument = z.infer<typeof insertBusinessDocumentSchema>;

export type CustomDocumentName = typeof customDocumentNames.$inferSelect;
export type InsertCustomDocumentName = z.infer<typeof insertCustomDocumentNameSchema>;

export type BusinessTradeline = typeof businessTradelines.$inferSelect;
export type InsertBusinessTradeline = z.infer<typeof insertBusinessTradelineSchema>;

export type BusinessFormationData = typeof businessFormationData.$inferSelect;
export type InsertBusinessFormationData = z.infer<typeof insertBusinessFormationDataSchema>;

export type UserStats = typeof userStats.$inferSelect;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({ id: true, subscribedAt: true });

// GigBot Schemas
export const insertRideshareCompanySchema = createInsertSchema(rideshareCompanies).omit({ id: true, createdAt: true, updatedAt: true });
export const selectRideshareCompanySchema = createSelectSchema(rideshareCompanies);

export const insertUserCompanyStatusSchema = createInsertSchema(userCompanyStatus).omit({ id: true, createdAt: true, updatedAt: true });
export const selectUserCompanyStatusSchema = createSelectSchema(userCompanyStatus);

export const insertAiChatConversationSchema = createInsertSchema(aiChatConversations).omit({ id: true, createdAt: true, updatedAt: true });
export const selectAiChatConversationSchema = createSelectSchema(aiChatConversations);

// Activity tracking schemas
export const insertUserActivitySchema = createInsertSchema(userActivity).omit({ id: true, timestamp: true });
export const selectUserActivitySchema = createSelectSchema(userActivity);

export const insertAdminLogSchema = createInsertSchema(adminLogs).omit({ id: true, timestamp: true });
export const selectAdminLogSchema = createSelectSchema(adminLogs);

export type UserActivity = typeof userActivity.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;

// GigBot Types
export type RideshareCompany = typeof rideshareCompanies.$inferSelect;
export type InsertRideshareCompany = z.infer<typeof insertRideshareCompanySchema>;

export type UserCompanyStatus = typeof userCompanyStatus.$inferSelect;
export type InsertUserCompanyStatus = z.infer<typeof insertUserCompanyStatusSchema>;

export type AiChatConversation = typeof aiChatConversations.$inferSelect;
export type InsertAiChatConversation = z.infer<typeof insertAiChatConversationSchema>;

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  token: varchar("token").notNull().unique(),
  email: varchar("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({ id: true, createdAt: true });
export const selectPasswordResetTokenSchema = createSelectSchema(passwordResetTokens);

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;

// Task board schemas
export const insertTaskBoardSchema = createInsertSchema(taskBoards).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTaskBoardSchema = createSelectSchema(taskBoards);

export const insertTaskListSchema = createInsertSchema(taskLists).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTaskListSchema = createSelectSchema(taskLists);

export const insertTaskCardSchema = createInsertSchema(taskCards).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTaskCardSchema = createSelectSchema(taskCards);

export type TaskBoard = typeof taskBoards.$inferSelect;
export type InsertTaskBoard = z.infer<typeof insertTaskBoardSchema>;

export type TaskList = typeof taskLists.$inferSelect;
export type InsertTaskList = z.infer<typeof insertTaskListSchema>;

export type TaskCard = typeof taskCards.$inferSelect;
export type InsertTaskCard = z.infer<typeof insertTaskCardSchema>;

// Vehicle documents schemas
export const insertVehicleDocumentSchema = createInsertSchema(vehicleDocuments).omit({ id: true, createdAt: true, uploadDate: true });
export const selectVehicleDocumentSchema = createSelectSchema(vehicleDocuments);

export type VehicleDocument = typeof vehicleDocuments.$inferSelect;
export type InsertVehicleDocument = z.infer<typeof insertVehicleDocumentSchema>;

export const insertTaskCardAttachmentSchema = createInsertSchema(taskCardAttachments).omit({ id: true, createdAt: true });
export const selectTaskCardAttachmentSchema = createSelectSchema(taskCardAttachments);

export type TaskCardAttachment = typeof taskCardAttachments.$inferSelect;
export type InsertTaskCardAttachment = z.infer<typeof insertTaskCardAttachmentSchema>;

export const insertTaskCardReminderSchema = createInsertSchema(taskCardReminders).omit({ id: true, createdAt: true });
export const selectTaskCardReminderSchema = createSelectSchema(taskCardReminders);

export type TaskCardReminder = typeof taskCardReminders.$inferSelect;
export type InsertTaskCardReminder = z.infer<typeof insertTaskCardReminderSchema>;

// OAuth and banking schemas
export const insertOauthConnectionSchema = createInsertSchema(oauthConnections).omit({ id: true, createdAt: true, updatedAt: true });
export const selectOauthConnectionSchema = createSelectSchema(oauthConnections);

export const insertBankingConnectionSchema = createInsertSchema(bankingConnections).omit({ id: true, createdAt: true, updatedAt: true });
export const selectBankingConnectionSchema = createSelectSchema(bankingConnections);

export const insertEarningsDataSchema = createInsertSchema(earningsData).omit({ id: true, createdAt: true, updatedAt: true });
export const selectEarningsDataSchema = createSelectSchema(earningsData);

export const insertSyncSettingsSchema = createInsertSchema(syncSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const selectSyncSettingsSchema = createSelectSchema(syncSettings);

export type OauthConnection = typeof oauthConnections.$inferSelect;
export type InsertOauthConnection = z.infer<typeof insertOauthConnectionSchema>;

export type BankingConnection = typeof bankingConnections.$inferSelect;
export type InsertBankingConnection = z.infer<typeof insertBankingConnectionSchema>;

export type EarningsData = typeof earningsData.$inferSelect;
export type InsertEarningsData = z.infer<typeof insertEarningsDataSchema>;

export type SyncSettings = typeof syncSettings.$inferSelect;
export type InsertSyncSettings = z.infer<typeof insertSyncSettingsSchema>;

// Progress Export and Sharing tables
export const progressExports = pgTable("progress_exports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  exportType: text("export_type").notNull(), // 'business_formation', 'full_profile', 'fleet_data', 'applications'
  exportFormat: text("export_format").notNull(), // 'pdf', 'json', 'csv', 'link'
  title: text("title").notNull(),
  description: text("description"),
  exportData: jsonb("export_data").notNull(), // Complete snapshot of progress data
  shareToken: varchar("share_token").unique(), // Unique token for sharing
  isPublic: boolean("is_public").default(false),
  allowComments: boolean("allow_comments").default(false),
  expiresAt: timestamp("expires_at"), // Optional expiration for shared links
  downloadCount: integer("download_count").default(0),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sharedProgressAccess = pgTable("shared_progress_access", {
  id: serial("id").primaryKey(),
  exportId: integer("export_id").notNull().references(() => progressExports.id),
  accessorEmail: varchar("accessor_email"),
  accessorName: varchar("accessor_name"),
  accessType: text("access_type").notNull(), // 'view', 'comment', 'download'
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  accessedAt: timestamp("accessed_at").defaultNow(),
});

export const progressComments = pgTable("progress_comments", {
  id: serial("id").primaryKey(),
  exportId: integer("export_id").notNull().references(() => progressExports.id),
  commenterName: varchar("commenter_name"),
  commenterEmail: varchar("commenter_email"),
  comment: text("comment").notNull(),
  isPrivate: boolean("is_private").default(false), // Only visible to progress owner
  createdAt: timestamp("created_at").defaultNow(),
});

// Business Formation Progress Tracking
export const businessFormationProgress = pgTable("business_formation_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessId: varchar("business_id").notNull(), // Multiple businesses support
  stepId: integer("step_id").notNull(),
  stepTitle: text("step_title").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedTasks: jsonb("completed_tasks"), // Array of completed sub-task indices
  formData: jsonb("form_data"), // Step-specific form data
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export type definitions
export type ProgressExport = typeof progressExports.$inferSelect;
export type InsertProgressExport = typeof progressExports.$inferInsert;
export type SharedProgressAccess = typeof sharedProgressAccess.$inferSelect;
export type InsertSharedProgressAccess = typeof sharedProgressAccess.$inferInsert;
export type ProgressComment = typeof progressComments.$inferSelect;
export type InsertProgressComment = typeof progressComments.$inferInsert;
export type BusinessFormationProgress = typeof businessFormationProgress.$inferSelect;
export type InsertBusinessFormationProgress = typeof businessFormationProgress.$inferInsert;

// User saved fuel cards schemas
export const insertUserSavedFuelCardSchema = createInsertSchema(userSavedFuelCards).omit({ id: true, dateAdded: true, lastUpdated: true });
export const selectUserSavedFuelCardSchema = createSelectSchema(userSavedFuelCards);
export type UserSavedFuelCard = typeof userSavedFuelCards.$inferSelect;
export type InsertUserSavedFuelCard = z.infer<typeof insertUserSavedFuelCardSchema>;

// Fuel card spend history schemas
export const insertFuelCardSpendHistorySchema = createInsertSchema(fuelCardSpendHistory).omit({ id: true, createdAt: true });
export const selectFuelCardSpendHistorySchema = createSelectSchema(fuelCardSpendHistory);
export type FuelCardSpendHistory = typeof fuelCardSpendHistory.$inferSelect;
export type InsertFuelCardSpendHistory = z.infer<typeof insertFuelCardSpendHistorySchema>;

// Company Actions schemas
export const insertCompanyActionSchema = createInsertSchema(companyActions).omit({ id: true, createdAt: true, updatedAt: true });
export const selectCompanyActionSchema = createSelectSchema(companyActions);

export type CompanyAction = typeof companyActions.$inferSelect;
export type InsertCompanyAction = z.infer<typeof insertCompanyActionSchema>;

// Insert schemas for validation
export const insertProgressExportSchema = createInsertSchema(progressExports).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSharedProgressAccessSchema = createInsertSchema(sharedProgressAccess).omit({ id: true, accessedAt: true });
export const insertProgressCommentSchema = createInsertSchema(progressComments).omit({ id: true, createdAt: true });
export const insertBusinessFormationProgressSchema = createInsertSchema(businessFormationProgress).omit({ id: true, createdAt: true, updatedAt: true });

// Job board notes table
export const jobBoardNotes = pgTable("job_board_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  jobBoardName: varchar("job_board_name", { length: 255 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job board notes schemas
export const insertJobBoardNotesSchema = createInsertSchema(jobBoardNotes).omit({ id: true, createdAt: true, updatedAt: true });
export const selectJobBoardNotesSchema = createSelectSchema(jobBoardNotes);

export type JobBoardNote = typeof jobBoardNotes.$inferSelect;
export type InsertJobBoardNote = z.infer<typeof insertJobBoardNotesSchema>;

// YouTube video URLs table
export const youtubeVideoUrls = pgTable("youtube_video_urls", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  resourceName: varchar("resource_name", { length: 255 }).notNull(),
  url: text("url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// YouTube video URLs schemas
export const insertYoutubeVideoUrlSchema = createInsertSchema(youtubeVideoUrls).omit({ id: true, createdAt: true, updatedAt: true });
export const selectYoutubeVideoUrlSchema = createSelectSchema(youtubeVideoUrls);

export type YoutubeVideoUrl = typeof youtubeVideoUrls.$inferSelect;
export type InsertYoutubeVideoUrl = z.infer<typeof insertYoutubeVideoUrlSchema>;

// Employment Records schemas
export const insertEmploymentRecordSchema = createInsertSchema(employmentRecords).omit({ id: true, createdAt: true, updatedAt: true });
export const selectEmploymentRecordSchema = createSelectSchema(employmentRecords);

export type EmploymentRecord = typeof employmentRecords.$inferSelect;
export type InsertEmploymentRecord = z.infer<typeof insertEmploymentRecordSchema>;

// Assignments schemas  
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true, createdAt: true, updatedAt: true });
export const selectAssignmentSchema = createSelectSchema(assignments);

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;


// Networking Groups schemas
export const insertNetworkingGroupSchema = createInsertSchema(networkingGroups).omit({ id: true, createdAt: true, updatedAt: true });
export const selectNetworkingGroupSchema = createSelectSchema(networkingGroups);

export type NetworkingGroup = typeof networkingGroups.$inferSelect;
export type InsertNetworkingGroup = z.infer<typeof insertNetworkingGroupSchema>;

// Personal Credit Score Tracking
export const personalCreditScores = pgTable("personal_credit_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bureauName: text("bureau_name").notNull(), // 'Equifax', 'Experian', 'TransUnion'
  score: integer("score").notNull(),
  scoreDate: timestamp("score_date").notNull(),
  scoreModel: text("score_model").default("FICO"), // 'FICO', 'VantageScore', etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personal Credit Goals
export const personalCreditGoals = pgTable("personal_credit_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  goalType: text("goal_type").notNull(), // 'credit_score', 'utilization_reduction', 'debt_payoff'
  goalName: text("goal_name").notNull(),
  targetValue: text("target_value").notNull(), // Target score, percentage, dollar amount
  currentValue: text("current_value"),
  targetDate: timestamp("target_date"),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personal Credit Tradelines (Credit Cards, Loans, etc.)
export const personalCreditTradelines = pgTable("personal_credit_tradelines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  accountName: text("account_name").notNull(),
  accountType: text("account_type").notNull(), // 'credit_card', 'auto_loan', 'mortgage', 'personal_loan', 'line_of_credit'
  creditorName: text("creditor_name").notNull(),
  accountNumber: text("account_number"), // Last 4 digits only for security
  openDate: timestamp("open_date"),
  status: text("status").notNull().default("active"), // 'active', 'closed', 'paid_off'
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
  currentBalance: decimal("current_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  minimumPayment: decimal("minimum_payment", { precision: 10, scale: 2 }),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }), // APR percentage
  paymentDueDate: integer("payment_due_date"), // Day of month (1-31)
  lastPaymentAmount: decimal("last_payment_amount", { precision: 10, scale: 2 }),
  lastPaymentDate: timestamp("last_payment_date"),
  isReporting: boolean("is_reporting").default(true), // Whether it reports to credit bureaus
  reportsToBureaus: text("reports_to_bureaus").array(), // ['Equifax', 'Experian', 'TransUnion']
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personal Credit Cards (Detailed tracking for credit and debit cards)
export const personalCreditCards = pgTable("personal_credit_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  slotNumber: integer("slot_number").notNull(), // 1-5 for tracking multiple cards
  issuingCompany: text("issuing_company"), // Bank or card issuer (e.g., "Chase")
  accountNumber: text("account_number"), // Last 4 digits only
  website: text("website"), // Bank website URL
  cardTypeCategory: text("card_type_category"), // 'credit' or 'debit'
  cardName: text("card_name"), // Card product name (e.g., "Chase Freedom Unlimited")
  lastFour: text("last_four"), // Last 4 digits for quick reference
  expiration: text("expiration"), // MM/YY format
  secCode: text("sec_code"), // CVV/Security Code
  monitor: text("monitor"), // Monitoring service or note
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
  balanceDue: decimal("balance_due", { precision: 12, scale: 2 }),
  dueDate: integer("due_date"), // Day of month (1-31)
  internalLateDate: integer("internal_late_date"), // Day of month (1-31)
  officialLateDate: integer("official_late_date"), // Day of month (1-31)
  reportDate: date("report_date"), // Report/Settlement date
  login: text("login"), // Username or email for account access
  password: text("password"), // Encrypted/secure storage recommended
  payment: decimal("payment", { precision: 10, scale: 2 }), // Regular payment amount
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }), // APR percentage
  autoPay: text("auto_pay"), // 'yes' or 'no'
  autoPayAcct: text("auto_pay_acct"), // Account used for autopay
  dateOpened: date("date_opened"),
  accountStatus: text("account_status").default("active"), // 'active', 'closed', 'frozen'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personal Credit Score schemas
export const insertPersonalCreditScoreSchema = createInsertSchema(personalCreditScores).omit({ id: true, createdAt: true, updatedAt: true });
export const selectPersonalCreditScoreSchema = createSelectSchema(personalCreditScores);

export type PersonalCreditScore = typeof personalCreditScores.$inferSelect;
export type InsertPersonalCreditScore = z.infer<typeof insertPersonalCreditScoreSchema>;

// Personal Credit Goals schemas
export const insertPersonalCreditGoalSchema = createInsertSchema(personalCreditGoals).omit({ id: true, createdAt: true, updatedAt: true });
export const selectPersonalCreditGoalSchema = createSelectSchema(personalCreditGoals);

export type PersonalCreditGoal = typeof personalCreditGoals.$inferSelect;
export type InsertPersonalCreditGoal = z.infer<typeof insertPersonalCreditGoalSchema>;

// Personal Credit Tradelines schemas
export const insertPersonalCreditTradelineSchema = createInsertSchema(personalCreditTradelines).omit({ id: true, createdAt: true, updatedAt: true });
export const selectPersonalCreditTradelineSchema = createSelectSchema(personalCreditTradelines);

export type PersonalCreditTradeline = typeof personalCreditTradelines.$inferSelect;
export type InsertPersonalCreditTradeline = z.infer<typeof insertPersonalCreditTradelineSchema>;

// Personal Credit Cards schemas
export const insertPersonalCreditCardSchema = createInsertSchema(personalCreditCards).omit({ id: true, createdAt: true, updatedAt: true });
export const selectPersonalCreditCardSchema = createSelectSchema(personalCreditCards);

export type PersonalCreditCard = typeof personalCreditCards.$inferSelect;
export type InsertPersonalCreditCard = z.infer<typeof insertPersonalCreditCardSchema>;

// Whitelisted Companies (for fake/fraudulent company prevention)
export const whitelistedCompanies = pgTable("blacklisted_companies", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name").notNull().unique(),
  reason: varchar("reason").default("fake_company"), // 'fake_company', 'fraud', 'spam', etc.
  whitelistedBy: integer("blacklisted_by"), // User ID who whitelisted it
  whitelistedAt: timestamp("blacklisted_at").defaultNow(),
  notes: text("notes"),
});

export const insertWhitelistedCompanySchema = createInsertSchema(whitelistedCompanies).omit({ id: true, whitelistedAt: true });
export const selectWhitelistedCompanySchema = createSelectSchema(whitelistedCompanies);

export type WhitelistedCompany = typeof whitelistedCompanies.$inferSelect;
export type InsertWhitelistedCompany = z.infer<typeof insertWhitelistedCompanySchema>;

// === RBAC SYSTEM ZOD SCHEMAS ===

// Invitation schemas with CRITICAL security enum validation
export const insertInvitationSchema = createInsertSchema(invitations)
  .omit({ id: true, createdAt: true })
  .extend({
    role: z.enum([ROLES.OWNER, ROLES.ASSISTANT, ROLES.VIEWER])
  });

export const selectInvitationSchema = createSelectSchema(invitations)
  .extend({
    role: z.enum([ROLES.OWNER, ROLES.ASSISTANT, ROLES.VIEWER])
  });

export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;

// User Session schemas
export const insertUserSessionSchema = createInsertSchema(userSessions).omit({ id: true, createdAt: true });
export const selectUserSessionSchema = createSelectSchema(userSessions);

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

// Audit Log schemas
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const selectAuditLogSchema = createSelectSchema(auditLogs);

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
