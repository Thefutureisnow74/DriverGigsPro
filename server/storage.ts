import {
  users,
  companies,
  applications,
  jobSearchNotes,
  courses,
  userCourseProgress,
  documents,
  contactLogs,
  userStats,
  taskBoards,
  taskLists,
  taskCards,
  vehicles,
  vehicleDocuments,
  vehicleMaintenanceItems,
  fuelCards,
  businessEntities,
  businessDocuments,
  businessTradelines,
  businessFormationData,
  userActivity,
  adminLogs,
  userSavedFuelCards,
  fuelCardSpendHistory,
  newsletterSubscribers,
  jobBoardNotes,
  youtubeVideoUrls,
  rideshareCompanies,
  userCompanyStatus,
  aiChatConversations,
  // CRITICAL: Import session management tables for RBAC security
  userSessions,
  auditLogs,
  type User,
  type InsertUser,
  type UpsertUser,
  type BusinessEntity,
  type InsertBusinessEntity,
  type BusinessDocument,
  type InsertBusinessDocument,
  type BusinessTradeline,
  type InsertBusinessTradeline,
  type BusinessFormationData,
  type InsertBusinessFormationData,
  type JobBoardNote,
  type InsertJobBoardNote,
  type YoutubeVideoUrl,
  type InsertYoutubeVideoUrl,
  type Company,
  type InsertCompany,
  type Application,
  type InsertApplication,
  type ApplicationWithCompany,
  type Course,
  type UserStats,
  type TaskBoard,
  type InsertTaskBoard,
  type TaskList,
  type InsertTaskList,
  type TaskCard,
  type InsertTaskCard,
  type Vehicle,
  type InsertVehicle,
  type VehicleDocument,
  type InsertVehicleDocument,
  type VehicleMaintenanceItem,
  type InsertVehicleMaintenanceItem,
  type FuelCard,
  type InsertFuelCard,
  type UserSavedFuelCard,
  type InsertUserSavedFuelCard,
  type FuelCardSpendHistory,
  type InsertFuelCardSpendHistory,
  type UserActivity,
  type InsertUserActivity,
  type AdminLog,
  type InsertAdminLog,
  passwordResetTokens,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type CompanyAction,
  type InsertCompanyAction,
  companyActions,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type RideshareCompany,
  type InsertRideshareCompany,
  type UserCompanyStatus,
  type InsertUserCompanyStatus,
  type AiChatConversation,
  type InsertAiChatConversation,
  // VA System types
  userProfiles,
  addresses,
  emergencyContacts,
  userPreferences,
  gigApplications,
  vaActivity,
  vaAssignments,
  consentGrants,
  auditEvents,
  type UserProfile,
  type InsertUserProfile,
  type Address,
  type InsertAddress,
  type EmergencyContact,
  type InsertEmergencyContact,
  type UserPreferences,
  type InsertUserPreferences,
  type GigApplication,
  type InsertGigApplication,
  type VAActivity,
  type InsertVAActivity,
  type VAAssignment,
  type InsertVAAssignment,
  type ConsentGrant,
  type InsertConsentGrant,
  type AuditEvent,
  type InsertAuditEvent,
  // CRITICAL: Import audit log types for RBAC security
  type AuditLog,
  type InsertAuditLog,
  // Invitation system imports
  invitations,
  type Invitation,
  type InsertInvitation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, lt, or, isNotNull, isNull, ne, inArray, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: number): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // User Profile Management
  getUserProfile(userId: number): Promise<any | undefined>;
  updateUserProfile(userId: number, profileData: any): Promise<any>;
  updateUserPassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean>;

  // Companies
  getAllCompanies(): Promise<Company[]>;
  getCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  checkCompanyExists(name: string, website?: string): Promise<Company | undefined>;
  createCompanyWithDuplicateCheck(company: InsertCompany): Promise<{ company: Company; isNew: boolean }>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;
  deleteCompany(id: number): Promise<boolean>;
  searchCompanies(query: string): Promise<Company[]>;

  // Applications
  getUserApplications(userId: number): Promise<ApplicationWithCompany[]>;
  getApplicationsWithCompanies(userId: number): Promise<ApplicationWithCompany[]>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByCompanyId(userId: number, companyId: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<boolean>;

  // Job Search Notes
  createJobSearchNote(noteData: any): Promise<any>;
  getJobSearchNotes(userId: number, companyId: number): Promise<any[]>;
  updateJobSearchNote(noteId: number, updates: any): Promise<any>;
  removeAllRemindersForCompany(userId: number, companyId: number): Promise<any>;
  
  // Job Board Notes
  getJobBoardNotes(userId: number): Promise<JobBoardNote[]>;
  updateJobBoardNote(userId: number, jobBoardName: string, notes: string): Promise<JobBoardNote>;
  
  // YouTube Video URLs
  getYoutubeVideoUrls(userId: number): Promise<YoutubeVideoUrl[]>;
  updateYoutubeVideoUrl(userId: number, resourceName: string, url: string): Promise<YoutubeVideoUrl>;



  // Courses
  getAllCourses(): Promise<Course[]>;
  getUserCourseProgress(userId: number): Promise<any[]>;

  // User Stats
  getUserStats(userId: number): Promise<UserStats | undefined>;
  updateUserStats(userId: number, stats: Partial<UserStats>): Promise<UserStats>;

  // Business Entities
  getUserBusinessEntities(userId: number): Promise<BusinessEntity[]>;
  getBusinessEntity(id: number): Promise<BusinessEntity | undefined>;
  createBusinessEntity(entity: InsertBusinessEntity): Promise<BusinessEntity>;
  updateBusinessEntity(id: number, entity: Partial<InsertBusinessEntity>): Promise<BusinessEntity | undefined>;
  deleteBusinessEntity(id: number): Promise<boolean>;

  // Business Documents
  getBusinessDocuments(businessEntityId: number): Promise<BusinessDocument[]>;
  getUserBusinessDocuments(userId: number): Promise<BusinessDocument[]>;
  getBusinessDocument(id: number): Promise<BusinessDocument | undefined>;
  createBusinessDocument(document: InsertBusinessDocument): Promise<BusinessDocument>;
  updateBusinessDocument(id: number, document: Partial<InsertBusinessDocument>): Promise<BusinessDocument | undefined>;
  deleteBusinessDocument(id: number): Promise<boolean>;

  // Business Tradelines
  getBusinessTradelines(businessEntityId: number): Promise<BusinessTradeline[]>;
  getUserBusinessTradelines(userId: number): Promise<BusinessTradeline[]>;
  getBusinessTradeline(id: number): Promise<BusinessTradeline | undefined>;
  createBusinessTradeline(tradeline: InsertBusinessTradeline): Promise<BusinessTradeline>;
  updateBusinessTradeline(id: number, tradeline: Partial<InsertBusinessTradeline>): Promise<BusinessTradeline | undefined>;
  deleteBusinessTradeline(id: number): Promise<boolean>;

  // Business Formation Data
  getBusinessFormationData(userId: number, businessId: string): Promise<BusinessFormationData | undefined>;
  saveBusinessFormationData(data: InsertBusinessFormationData): Promise<BusinessFormationData>;

  // Vehicles
  getUserVehicles(userId: number): Promise<Vehicle[]>;
  
  // Vehicle Documents
  getVehicleDocuments(vehicleId: number): Promise<VehicleDocument[]>;
  getVehicleDocument(id: number): Promise<VehicleDocument | undefined>;
  createVehicleDocument(document: InsertVehicleDocument): Promise<VehicleDocument>;
  deleteVehicleDocument(id: number): Promise<boolean>;
  
  // Vehicle Maintenance Items
  getVehicleMaintenanceItems(vehicleId: number): Promise<VehicleMaintenanceItem[]>;
  getVehicleMaintenanceItem(id: number): Promise<VehicleMaintenanceItem | undefined>;
  createVehicleMaintenanceItem(item: InsertVehicleMaintenanceItem): Promise<VehicleMaintenanceItem>;
  updateVehicleMaintenanceItem(id: number, item: Partial<InsertVehicleMaintenanceItem>): Promise<VehicleMaintenanceItem | undefined>;
  deleteVehicleMaintenanceItem(id: number): Promise<boolean>;
  
  // General Documents
  getUserDocuments(userId: number): Promise<any[]>;
  createDocument(document: any): Promise<any>;
  deleteDocument(id: number, userId: number): Promise<boolean>;
  getDocumentById(documentId: number, userId: number): Promise<any | undefined>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;

  // Activity Tracking
  logUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  getUserActivity(userId: number, limit?: number): Promise<UserActivity[]>;

  // Password Reset
  createPasswordResetToken(userId: number, email: string, token: string, expiresAt: Date): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(tokenId: number): Promise<void>;
  cleanupExpiredTokens(): Promise<void>;

  // Task Boards
  getUserTaskBoards(userId: number): Promise<TaskBoard[]>;
  getTaskBoard(id: number): Promise<TaskBoard | undefined>;
  createTaskBoard(board: InsertTaskBoard): Promise<TaskBoard>;
  updateTaskBoard(id: number, board: Partial<InsertTaskBoard>): Promise<TaskBoard | undefined>;
  deleteTaskBoard(id: number): Promise<boolean>;

  // Task Lists
  getBoardLists(boardId: number): Promise<TaskList[]>;
  getTaskList(id: number): Promise<TaskList | undefined>;
  createTaskList(list: InsertTaskList): Promise<TaskList>;
  updateTaskList(id: number, list: Partial<InsertTaskList>): Promise<TaskList | undefined>;
  deleteTaskList(id: number): Promise<boolean>;

  // Task Cards
  getUserTaskCards(userId: number): Promise<TaskCard[]>;
  getListCards(listId: number): Promise<TaskCard[]>;
  getTaskCard(id: number): Promise<TaskCard | undefined>;
  createTaskCard(card: InsertTaskCard): Promise<TaskCard>;
  updateTaskCard(id: number, card: Partial<InsertTaskCard>): Promise<TaskCard | undefined>;
  deleteTaskCard(id: number): Promise<boolean>;
  moveTaskCard(cardId: number, targetListId: number, position: number): Promise<TaskCard | undefined>;
  addTaskCardComment(cardId: number, commentData: { text: string; userId: string; userName: string; createdAt: string }): Promise<TaskCard | undefined>;
  
  // Calendar Integration
  getTaskCalendarEvents(userId: number): Promise<Array<{
    id: number;
    title: string;
    startDate: Date | null;
    dueDate: Date | null;
    reminderDays: number | null;
    type: 'task';
    boardTitle: string;
    listTitle: string;
  }>>;
  
  // User Saved Fuel Cards
  getUserSavedFuelCards(userId: number): Promise<UserSavedFuelCard[]>;
  getUserSavedFuelCard(cardId: number): Promise<UserSavedFuelCard | undefined>;
  createUserSavedFuelCard(card: InsertUserSavedFuelCard): Promise<UserSavedFuelCard>;
  updateUserSavedFuelCard(cardId: number, updates: Partial<UserSavedFuelCard>): Promise<UserSavedFuelCard | undefined>;
  deleteUserSavedFuelCard(cardId: number): Promise<boolean>;
  
  // Fuel Card Spend History
  getFuelCardSpendHistory(cardId: number, userId: number): Promise<FuelCardSpendHistory[]>;
  createFuelCardSpendHistory(spend: InsertFuelCardSpendHistory): Promise<FuelCardSpendHistory>;

  // Newsletter Subscribers
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;

  // GigBot Rideshare Companies
  getAllRideshareCompanies(): Promise<RideshareCompany[]>;
  getRideshareCompany(id: number): Promise<RideshareCompany | undefined>;
  createRideshareCompany(company: InsertRideshareCompany): Promise<RideshareCompany>;
  updateRideshareCompany(id: number, company: Partial<InsertRideshareCompany>): Promise<RideshareCompany | undefined>;
  
  // User Company Status
  getUserCompanyStatus(userId: number, companyId: number): Promise<UserCompanyStatus | undefined>;
  createUserCompanyStatus(status: InsertUserCompanyStatus): Promise<UserCompanyStatus>;
  updateUserCompanyStatus(userId: number, companyId: number, updates: Partial<InsertUserCompanyStatus>): Promise<UserCompanyStatus | undefined>;
  getActiveRideshareCompaniesForUser(userId: number): Promise<(RideshareCompany & { status: UserCompanyStatus })[]>;
  getNonActiveRideshareCompaniesForUser(userId: number): Promise<RideshareCompany[]>;
  
  // Company Actions
  getUserCompanyActions(userId: number): Promise<any[]>;
  setCompanyAction(userId: number, companyId: number, action: string | null): Promise<any>;
  
  // AI Chat Conversations
  saveAiChatMessage(userId: number, sessionId: string, message: { role: string; content: string; messageId?: string; toolCalls?: any }): Promise<any>;
  getAiChatHistory(userId: number, sessionId: string, limit?: number): Promise<any[]>;

  // Session Management for RBAC
  getUserSessionBySessionId(sessionId: string): Promise<any | undefined>;
  createUserSession(sessionData: any): Promise<any>;
  updateUserSessionActivity(sessionId: string): Promise<void>;
  revokeUserSession(sessionId: string): Promise<void>;
  getUserSessions(userId: number): Promise<any[]>;
  revokeAllUserSessions(userId: number, excludeSessionId?: string): Promise<void>;


  // === VA SYSTEM INTERFACE ===
  // Profile Stats
  getProfileStats(userId: number): Promise<{ completenessScore: number; totalApplications: number; activeApplications: number; vaActivitiesCount: number; lastActivityDate?: string }>;

  // Address Management
  getUserAddresses(userId: number): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, address: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;

  // Emergency Contacts
  getEmergencyContacts(userId: number): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateEmergencyContact(id: number, contact: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined>;
  deleteEmergencyContact(id: number): Promise<boolean>;

  // User Preferences
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  updateUserPreferences(userId: number, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences>;

  // Vehicle Management (enhanced)
  getVehicles(userId: number): Promise<Vehicle[]>;
  
  // Gig Applications
  getGigApplications(userId: number, filters?: { status?: string; limit?: number; offset?: number }): Promise<GigApplication[]>;
  createGigApplication(application: InsertGigApplication): Promise<GigApplication>;
  updateGigApplication(id: number, application: Partial<InsertGigApplication>): Promise<GigApplication | undefined>;
  deleteGigApplication(id: number): Promise<boolean>;

  // VA Activities
  getVAActivities(userId: number, filters?: { dateRange?: string; activityType?: string; channel?: string; company?: string; limit?: number; offset?: number }): Promise<VAActivity[]>;
  createVAActivity(activity: InsertVAActivity): Promise<VAActivity>;
  updateVAActivity(id: number, activity: Partial<InsertVAActivity>): Promise<VAActivity | undefined>;
  deleteVAActivity(id: number): Promise<boolean>;
  getVAActivityStats(userId: number): Promise<{ totalActivities: number; thisMonth: number; avgDurationMin: number; completedTasks: number; pendingTasks: number }>;

  // VA Assignments
  getVAAssignments(userId: number): Promise<VAAssignment[]>;
  createVAAssignment(assignment: InsertVAAssignment): Promise<VAAssignment>;
  updateVAAssignment(id: number, assignment: Partial<InsertVAAssignment>): Promise<VAAssignment | undefined>;
  deleteVAAssignment(id: number): Promise<boolean>;

  // Consent Grants for RBAC
  getConsentGrants(userId: number): Promise<ConsentGrant[]>;
  createConsentGrant(grant: InsertConsentGrant): Promise<ConsentGrant>;
  revokeConsentGrant(id: number): Promise<boolean>;

  // Audit Events
  getAuditEvents(userId: number, options?: { limit?: number; offset?: number }): Promise<AuditEvent[]>;
  createAuditEvent(event: InsertAuditEvent): Promise<AuditEvent>;

  // CRITICAL: RBAC Security Audit Logging
  getAuditLogs(options?: {
    actorUserId?: number;
    targetUserId?: number;
    action?: string;
    resource?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]>;
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;

  // Dismissed Recommendations
  getDismissedRecommendations(userId: number): Promise<{ companyId: number; companyName: string; dismissedAt: Date; reason?: string }[]>;
  dismissRecommendation(userId: number, companyId: number, companyName: string, reason?: string): Promise<void>;
  
  // RBAC Invitation Management
  createInvitation(invitation: InsertInvitation): Promise<Invitation>;
  getInvitation(token: string): Promise<Invitation | undefined>;
  getInvitationById(id: number): Promise<Invitation | undefined>;
  getUserInvitations(userId: number): Promise<Invitation[]>;
  getAllPendingInvitations(): Promise<Invitation[]>;
  acceptInvitation(token: string, acceptingUserId: number): Promise<Invitation | undefined>;
  revokeInvitation(id: number): Promise<boolean>;
  cleanupExpiredInvitations(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // Job Board Notes operations
  async getJobBoardNotes(userId: number): Promise<JobBoardNote[]> {
    const notes = await db.select().from(jobBoardNotes).where(eq(jobBoardNotes.userId, userId));
    return notes;
  }

  async updateJobBoardNote(userId: number, jobBoardName: string, notes: string): Promise<JobBoardNote> {
    try {
      const [existingNote] = await db.select().from(jobBoardNotes)
        .where(and(eq(jobBoardNotes.userId, userId), eq(jobBoardNotes.jobBoardName, jobBoardName)));

      if (existingNote) {
        const [updatedNote] = await db.update(jobBoardNotes)
          .set({ notes, updatedAt: new Date() })
          .where(and(eq(jobBoardNotes.userId, userId), eq(jobBoardNotes.jobBoardName, jobBoardName)))
          .returning();
        return updatedNote;
      } else {
        const [newNote] = await db.insert(jobBoardNotes)
          .values({ userId, jobBoardName, notes })
          .returning();
        return newNote;
      }
    } catch (error) {
      console.error('Error updating job board note:', error);
      throw error;
    }
  }

  // YouTube Video URLs operations
  async getYoutubeVideoUrls(userId: number): Promise<YoutubeVideoUrl[]> {
    const urls = await db.select().from(youtubeVideoUrls).where(eq(youtubeVideoUrls.userId, userId));
    return urls;
  }

  async updateYoutubeVideoUrl(userId: number, resourceName: string, url: string): Promise<YoutubeVideoUrl> {
    try {
      const [existingUrl] = await db.select().from(youtubeVideoUrls)
        .where(and(eq(youtubeVideoUrls.userId, userId), eq(youtubeVideoUrls.resourceName, resourceName)));

      if (existingUrl) {
        const [updatedUrl] = await db.update(youtubeVideoUrls)
          .set({ url, updatedAt: new Date() })
          .where(and(eq(youtubeVideoUrls.userId, userId), eq(youtubeVideoUrls.resourceName, resourceName)))
          .returning();
        return updatedUrl;
      } else {
        const [newUrl] = await db.insert(youtubeVideoUrls)
          .values({ userId, resourceName, url })
          .returning();
        return newUrl;
      }
    } catch (error) {
      console.error('Error updating YouTube video URL:', error);
      throw error;
    }
  }

  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  // User Profile Management
  async getUserProfile(userId: number): Promise<any | undefined> {
    // Get the user data which includes extended profile info
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return undefined;
    
    // Return profile data (excluding sensitive fields)
    return {
      username: user.username,
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || '',
      dateOfBirth: user.dateOfBirth ? 
        (user.dateOfBirth && typeof user.dateOfBirth === 'object' && 'toISOString' in user.dateOfBirth ? (user.dateOfBirth as Date).toISOString().split('T')[0] : 
         typeof user.dateOfBirth === 'string' ? user.dateOfBirth.split('T')[0] : '') : '',
      bio: user.bio || '',
      profileImageUrl: user.profileImageUrl || '',
      fullName: user.fullName || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      dotNumber: user.dotNumber || '',
      mcNumber: user.mcNumber || '',
      gigGoals: user.gigGoals || '',
      createdAt: user.createdAt
    };
  }

  async updateUserProfile(userId: number, profileData: any): Promise<any> {
    // Update the user record with the new profile data
    const updateData: any = {
      updatedAt: new Date()
    };

    // Use !== undefined to allow empty strings to be saved
    if (profileData.firstName !== undefined) updateData.firstName = profileData.firstName;
    if (profileData.lastName !== undefined) updateData.lastName = profileData.lastName;
    if (profileData.email !== undefined) updateData.email = profileData.email;
    if (profileData.username !== undefined) updateData.username = profileData.username;
    if (profileData.phone !== undefined) updateData.phone = profileData.phone;
    if (profileData.address !== undefined) updateData.address = profileData.address;
    if (profileData.city !== undefined) updateData.city = profileData.city;
    if (profileData.state !== undefined) updateData.state = profileData.state;
    if (profileData.zipCode !== undefined) updateData.zipCode = profileData.zipCode;
    if (profileData.dateOfBirth !== undefined) updateData.dateOfBirth = profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null;
    if (profileData.bio !== undefined) updateData.bio = profileData.bio;
    if (profileData.profileImageUrl !== undefined) updateData.profileImageUrl = profileData.profileImageUrl;
    if (profileData.dotNumber !== undefined) updateData.dotNumber = profileData.dotNumber;
    if (profileData.mcNumber !== undefined) updateData.mcNumber = profileData.mcNumber;
    if (profileData.gigGoals !== undefined) updateData.gigGoals = profileData.gigGoals;
    
    // Update full name from first/last name if either is provided
    if (profileData.firstName !== undefined || profileData.lastName !== undefined) {
      const firstName = profileData.firstName !== undefined ? profileData.firstName : '';
      const lastName = profileData.lastName !== undefined ? profileData.lastName : '';
      updateData.fullName = `${firstName} ${lastName}`.trim();
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  async updateUserPassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    // Get the current user
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return false;

    // For OAuth users, we don't verify the current password since they don't have one
    // In a real app, you'd use bcrypt to compare passwords
    
    // Update the password (in a real app, hash it with bcrypt)
    await db
      .update(users)
      .set({ 
        password: newPassword, // In production, hash this
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));

    return true;
  }

  async getAllCompanies(): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.isActive, true)).orderBy(companies.name);
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.isActive, true)).orderBy(companies.name);
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async checkCompanyExists(name: string, website?: string): Promise<Company | undefined> {
    // Check by name first
    let query = db.select().from(companies).where(eq(companies.name, name));
    const [existingByName] = await query;
    
    if (existingByName) {
      return existingByName;
    }
    
    // If website provided, also check by website
    if (website) {
      const [existingByWebsite] = await db.select().from(companies).where(eq(companies.website, website));
      if (existingByWebsite) {
        return existingByWebsite;
      }
    }
    
    return undefined;
  }

  async createCompanyWithDuplicateCheck(company: InsertCompany): Promise<{ company: Company; isNew: boolean }> {
    // Check for duplicates
    const existing = await this.checkCompanyExists(company.name, company.website ?? undefined);
    
    if (existing) {
      console.log(`⚠️ Company "${company.name}" already exists (ID: ${existing.id}). Skipping creation.`);
      return { company: existing, isNew: false };
    }
    
    // Create new company if no duplicates found
    const newCompany = await this.createCompany(company);
    console.log(`✅ Created new company: ${company.name} (ID: ${newCompany.id})`);
    return { company: newCompany, isNew: true };
  }

  async updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined> {
    const [updatedCompany] = await db
      .update(companies)
      .set(company)
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany || undefined;
  }

  async deleteCompany(id: number): Promise<boolean> {
    const result = await db.update(companies).set({ isActive: false }).where(eq(companies.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async bulkDeleteCompanies(companyIds: number[]): Promise<number> {
    if (companyIds.length === 0) return 0;
    
    console.log(`🗑️ Storage: Deleting ${companyIds.length} companies with IDs:`, companyIds.slice(0, 10));
    
    const result = await db.update(companies).set({ isActive: false }).where(inArray(companies.id, companyIds));
    const deletedCount = result.rowCount || 0;
    
    console.log(`✅ Storage: Successfully deleted ${deletedCount} companies`);
    return deletedCount;
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const allCompanies = await this.getAllCompanies();
    return allCompanies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      (Array.isArray(company.serviceVertical) ? company.serviceVertical.join(' ') : (company.serviceVertical || '')).toLowerCase().includes(query.toLowerCase())
    );
  }













  // Job Search Notes
  async createJobSearchNote(noteData: any): Promise<any> {
    let applicationId = null;
    
    // Only create/find application if companyId is provided
    if (noteData.companyId !== null && noteData.companyId !== undefined) {
      const existingApplication = await db
        .select()
        .from(applications)
        .where(
          and(
            eq(applications.userId, parseInt(noteData.userId)),
            eq(applications.companyId, noteData.companyId)
          )
        );

      if (existingApplication.length > 0) {
        applicationId = existingApplication[0].id;
      } else {
        // Create a new application record
        const [newApplication] = await db
          .insert(applications)
          .values({
            userId: parseInt(noteData.userId),
            companyId: noteData.companyId,
            position: "Driver", // Default position
            status: "Interested",
          })
          .returning();
        applicationId = newApplication.id;
      }
    }

    // Create the job search note (works for both company-specific and general reminders)
    const [note] = await db
      .insert(jobSearchNotes)
      .values({
        ...noteData,
        applicationId, // Will be null for general reminders
      })
      .returning();

    return note;
  }

  async getJobSearchNotes(userId: number, companyId: number): Promise<any[]> {
    const notes = await db
      .select()
      .from(jobSearchNotes)
      .where(
        and(
          eq(jobSearchNotes.userId, userId.toString()),
          eq(jobSearchNotes.companyId, companyId)
        )
      )
      .orderBy(desc(jobSearchNotes.createdAt))
      .limit(1); // Only get the most recent note for faster queries
    
    return notes;
  }

  async updateJobSearchNote(noteId: number, updates: any): Promise<any> {
    const [updatedNote] = await db
      .update(jobSearchNotes)
      .set(updates)
      .where(eq(jobSearchNotes.id, noteId))
      .returning();
    
    return updatedNote;
  }

  async removeAllRemindersForCompany(userId: number, companyId: number): Promise<any> {
    console.log(`Removing ALL reminders for user ${userId}, company ${companyId}`);
    
    // Update ALL job search notes for this company to remove reminder fields
    const result = await db
      .update(jobSearchNotes)
      .set({
        reminderDate: null,
        reminderTime: null,
        reminderText: null
      })
      .where(
        and(
          eq(jobSearchNotes.userId, userId.toString()),
          eq(jobSearchNotes.companyId, companyId),
          isNotNull(jobSearchNotes.reminderDate)
        )
      )
      .returning();
    
    console.log(`Updated ${result.length} reminder records for company ${companyId}`);
    return { updatedCount: result.length, updatedRecords: result };
  }

  // Reminders operations
  async getActiveReminders(userId: string): Promise<any[]> {
    // Get company reminders
    const companyReminders = await db
      .select({
        id: jobSearchNotes.id,
        companyId: jobSearchNotes.companyId,
        companyName: companies.name,
        reminderDate: jobSearchNotes.reminderDate,
        reminderText: jobSearchNotes.reminderText,
        contactName: jobSearchNotes.contactName,
        phoneNumber: jobSearchNotes.phoneNumber,
        emailAddress: jobSearchNotes.emailAddress,
        notes: jobSearchNotes.notes,
        createdAt: jobSearchNotes.createdAt,
        type: sql<string>`'company'`,
        cardId: sql<number | null>`NULL`,
        cardTitle: sql<string | null>`NULL`,
        dueDate: sql<Date | null>`NULL`,
      })
      .from(jobSearchNotes)
      .innerJoin(companies, eq(jobSearchNotes.companyId, companies.id))
      .where(
        and(
          eq(jobSearchNotes.userId, userId),
          isNotNull(jobSearchNotes.reminderDate)
        )
      );

    // Get task card reminders
    const taskReminders = await db
      .select({
        id: taskCards.id,
        companyId: sql<number | null>`NULL`,
        companyName: sql<string | null>`NULL`,
        reminderDate: sql<Date>`${taskCards.dueDate} - (${taskCards.reminderDays} || ' days')::interval`,
        reminderText: taskCards.title,
        contactName: sql<string | null>`NULL`,
        phoneNumber: sql<string | null>`NULL`,
        emailAddress: sql<string | null>`NULL`,
        notes: taskCards.description,
        createdAt: taskCards.createdAt,
        type: sql<string>`'task'`,
        cardId: taskCards.id,
        cardTitle: taskCards.title,
        dueDate: taskCards.dueDate,
      })
      .from(taskCards)
      .innerJoin(taskLists, eq(taskCards.listId, taskLists.id))
      .innerJoin(taskBoards, eq(taskLists.boardId, taskBoards.id))
      .where(
        and(
          eq(taskBoards.userId, userId),
          isNotNull(taskCards.dueDate),
          isNotNull(taskCards.reminderDays),
          sql`${taskCards.dueDate} - (${taskCards.reminderDays} || ' days')::interval >= CURRENT_DATE - INTERVAL '30 days'`
        )
      );

    // Combine and sort by reminder date
    const allReminders = [...companyReminders, ...taskReminders];
    return allReminders.sort((a, b) => {
      const dateA = a.reminderDate ? new Date(a.reminderDate).getTime() : 0;
      const dateB = b.reminderDate ? new Date(b.reminderDate).getTime() : 0;
      return dateA - dateB;
    });
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isActive, true)).orderBy(courses.title);
  }

  async getUserCourseProgress(userId: number): Promise<any[]> {
    const progress = await db
      .select({
        courseId: userCourseProgress.courseId,
        progress: userCourseProgress.progress,
        completed: userCourseProgress.completed,
        title: courses.title,
        vertical: courses.vertical,
      })
      .from(userCourseProgress)
      .leftJoin(courses, eq(userCourseProgress.courseId, courses.id))
      .where(eq(userCourseProgress.userId, userId));
    
    return progress;
  }

  // Application methods - implementing missing interface methods
  async getUserApplications(userId: number): Promise<ApplicationWithCompany[]> {
    const userApps = await db.select({
      id: applications.id,
      userId: applications.userId,
      companyId: applications.companyId,
      position: applications.position,
      status: applications.status,
      workflowStatus: applications.workflowStatus,
      dateAdded: applications.dateAdded,
      dateApplied: applications.dateApplied,
      dateAccepted: applications.dateAccepted,
      notes: applications.notes,
      followUpDate: applications.followUpDate,
      interviewDate: applications.interviewDate,
      reminderNotes: applications.reminderNotes,
      priority: applications.priority,
      lastContactDate: applications.lastContactDate,
      onWaitingList: applications.onWaitingList,
      activeDate: applications.activeDate,
      company: {
        id: companies.id,
        name: companies.name,
        website: companies.website,
        serviceVertical: companies.serviceVertical,
        isActive: companies.isActive
      }
    })
    .from(applications)
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(eq(applications.userId, userId));
    
    return userApps as ApplicationWithCompany[];
  }

  async getApplicationsWithCompanies(userId: number): Promise<ApplicationWithCompany[]> {
    return this.getUserApplications(userId);
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationByCompanyId(userId: number, companyId: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications)
      .where(and(eq(applications.userId, userId), eq(applications.companyId, companyId)));
    return application;
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }

  async updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application | undefined> {
    const [updatedApplication] = await db.update(applications)
      .set(application)
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  async deleteApplication(id: number): Promise<boolean> {
    try {
      await db.delete(applications).where(eq(applications.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Business Formation Data methods
  async getBusinessFormationData(userId: number, businessId: string): Promise<BusinessFormationData | undefined> {
    const [data] = await db.select().from(businessFormationData)
      .where(and(eq(businessFormationData.userId, userId), eq(businessFormationData.businessId, businessId)));
    return data;
  }

  async saveBusinessFormationData(data: InsertBusinessFormationData): Promise<BusinessFormationData> {
    const [savedData] = await db.insert(businessFormationData).values(data)
      .onConflictDoUpdate({
        target: [businessFormationData.userId, businessFormationData.businessId],
        set: data
      })
      .returning();
    return savedData;
  }

  // Vehicle Document methods
  async getVehicleDocuments(vehicleId: number): Promise<VehicleDocument[]> {
    return await db.select().from(vehicleDocuments)
      .where(eq(vehicleDocuments.vehicleId, vehicleId));
  }

  async getVehicleDocument(id: number): Promise<VehicleDocument | undefined> {
    const [document] = await db.select().from(vehicleDocuments)
      .where(eq(vehicleDocuments.id, id));
    return document;
  }

  async createVehicleDocument(document: InsertVehicleDocument): Promise<VehicleDocument> {
    const [newDocument] = await db.insert(vehicleDocuments).values(document).returning();
    return newDocument;
  }

  async deleteVehicleDocument(id: number): Promise<boolean> {
    try {
      await db.delete(vehicleDocuments).where(eq(vehicleDocuments.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Vehicle Maintenance methods
  async getVehicleMaintenanceItems(vehicleId: number): Promise<VehicleMaintenanceItem[]> {
    return await db.select().from(vehicleMaintenanceItems)
      .where(eq(vehicleMaintenanceItems.vehicleId, vehicleId));
  }

  async getVehicleMaintenanceItem(id: number): Promise<VehicleMaintenanceItem | undefined> {
    const [item] = await db.select().from(vehicleMaintenanceItems)
      .where(eq(vehicleMaintenanceItems.id, id));
    return item;
  }

  async createVehicleMaintenanceItem(item: InsertVehicleMaintenanceItem): Promise<VehicleMaintenanceItem> {
    const [newItem] = await db.insert(vehicleMaintenanceItems).values(item).returning();
    return newItem;
  }

  async updateVehicleMaintenanceItem(id: number, item: Partial<InsertVehicleMaintenanceItem>): Promise<VehicleMaintenanceItem | undefined> {
    const [updatedItem] = await db.update(vehicleMaintenanceItems)
      .set(item)
      .where(eq(vehicleMaintenanceItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteVehicleMaintenanceItem(id: number): Promise<boolean> {
    try {
      await db.delete(vehicleMaintenanceItems).where(eq(vehicleMaintenanceItems.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Vehicle CRUD methods
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle;
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [newVehicle] = await db.insert(vehicles).values(vehicle).returning();
    return newVehicle;
  }

  async updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [updatedVehicle] = await db.update(vehicles)
      .set(vehicle)
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle;
  }

  async deleteVehicle(id: number): Promise<boolean> {
    try {
      await db.delete(vehicles).where(eq(vehicles.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    try {
      // Calculate real active companies from company_actions table
      const [activeCompaniesResult] = await db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(companyActions)
        .where(and(eq(companyActions.userId, userId), eq(companyActions.action, 'active')));
      
      // Calculate total applications
      const [totalApplicationsResult] = await db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(applications)
        .where(eq(applications.userId, userId));

      // Calculate completion rate based on hired vs total applications
      const [hiredJobsResult] = await db
        .select({ count: sql<number>`count(*)`.as('count') })
        .from(applications)
        .where(and(eq(applications.userId, userId), eq(applications.status, 'hired')));

      const activeCompanies = Number(activeCompaniesResult?.count || 0);
      const totalApplications = Number(totalApplicationsResult?.count || 0);
      const hiredJobs = Number(hiredJobsResult?.count || 0);
      const completionRate = totalApplications > 0 ? (hiredJobs / totalApplications) * 100 : 0;

      // Try to get existing stats record, or create default
      let [existingStats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
      
      if (!existingStats) {
        // Create default stats record for new users
        [existingStats] = await db.insert(userStats).values({
          userId: userId,
          activeJobs: activeCompanies, // Now represents active companies
          weeklyEarnings: '0',
          totalApplications: totalApplications,
          completionRate: completionRate.toString(),
          updatedAt: new Date()
        }).returning();
      } else {
        // Update existing stats with real calculated values
        [existingStats] = await db.update(userStats)
          .set({
            activeJobs: activeCompanies, // Now represents active companies
            totalApplications: totalApplications,
            completionRate: completionRate.toString(),
            updatedAt: new Date()
          })
          .where(eq(userStats.userId, userId))
          .returning();
      }

      return existingStats;
    } catch (error) {
      console.error("Error calculating user stats:", error);
      return undefined;
    }
  }

  async updateUserStats(userId: number, stats: Partial<UserStats>): Promise<UserStats> {
    const existing = await this.getUserStats(userId);
    if (existing) {
      const [updated] = await db
        .update(userStats)
        .set({ ...stats, updatedAt: new Date() })
        .where(eq(userStats.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userStats)
        .values({ userId, ...stats })
        .returning();
      return created;
    }
  }

  // Business Entities
  async getUserBusinessEntities(userId: number): Promise<BusinessEntity[]> {
    // Return full BusinessEntity objects to match interface
    return await db.select().from(businessEntities).where(eq(businessEntities.userId, userId));
  }

  async getBusinessEntity(id: number): Promise<BusinessEntity | undefined> {
    try {
      // Use raw SQL to avoid schema mismatch issues
      const result = await db.execute(sql`SELECT * FROM business_entities WHERE id = ${id} LIMIT 1`);
      const entity = result.rows[0] as any;
      return entity || undefined;
    } catch (error) {
      console.error("Error fetching business entity:", error);
      return undefined;
    }
  }

  async createBusinessEntity(entity: InsertBusinessEntity): Promise<BusinessEntity> {
    const [newEntity] = await db
      .insert(businessEntities)
      .values(entity)
      .returning();
    return newEntity;
  }

  async updateBusinessEntity(id: number, entity: Partial<InsertBusinessEntity>): Promise<BusinessEntity | undefined> {
    try {
      // Simple direct update using Drizzle ORM
      const [updatedEntity] = await db
        .update(businessEntities)
        .set(entity)
        .where(eq(businessEntities.id, id))
        .returning();
      
      return updatedEntity;
    } catch (error) {
      console.error("Error updating business entity:", error);
      return undefined;
    }
  }

  async updateBusinessEntityField(id: number, field: string, value: any): Promise<BusinessEntity | undefined> {
    try {
      // Simple field update
      const updateData = { [field]: value };
      return await this.updateBusinessEntity(id, updateData);
    } catch (error) {
      console.error("Error updating business entity field:", error);
      return undefined;
    }
  }

  async deleteBusinessEntity(id: number): Promise<boolean> {
    try {
      await db.delete(businessEntities).where(eq(businessEntities.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }


  // === VA SYSTEM STORAGE IMPLEMENTATION ===

  // Profile Stats
  async getProfileStats(userId: number): Promise<{ completenessScore: number; totalApplications: number; activeApplications: number; vaActivitiesCount: number; lastActivityDate?: string }> {
    try {
      // Get user profile completeness
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      let completenessScore = 0;
      if (user) {
        const fields = [user.firstName, user.lastName, user.email, user.phone];
        completenessScore = Math.round((fields.filter(f => f).length / fields.length) * 100);
      }

      // Get application counts - using regular applications table for now
      const apps = await db.select().from(applications).where(eq(applications.userId, userId));
      const totalApplications = apps.length;
      const activeApplications = apps.filter(a => ['applied', 'interview', 'offer'].includes(a.status || '')).length;

      // Get VA activities count - stub for now since table may not exist yet
      const vaActivitiesCount = 0;

      return {
        completenessScore,
        totalApplications,
        activeApplications,
        vaActivitiesCount
      };
    } catch (error) {
      console.error('Error getting profile stats:', error);
      return {
        completenessScore: 0,
        totalApplications: 0,
        activeApplications: 0,
        vaActivitiesCount: 0
      };
    }
  }

  // Address Management - stubbed for now
  async getUserAddresses(userId: number): Promise<Address[]> {
    return [];
  }

  async createAddress(address: InsertAddress): Promise<Address> {
    try {
      const [newAddress] = await db.insert(addresses).values(address).returning();
      return newAddress;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  async updateAddress(id: number, address: Partial<InsertAddress>): Promise<Address | undefined> {
    return undefined;
  }

  async deleteAddress(id: number): Promise<boolean> {
    return false;
  }

  // Emergency Contacts - stubbed
  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    return [];
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    try {
      const [newContact] = await db.insert(emergencyContacts).values(contact).returning();
      return newContact;
    } catch (error) {
      console.error('Error creating emergency contact:', error);
      throw error;
    }
  }

  async updateEmergencyContact(id: number, contact: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined> {
    return undefined;
  }

  async deleteEmergencyContact(id: number): Promise<boolean> {
    return false;
  }

  // User Preferences - stubbed
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return undefined;
  }

  async updateUserPreferences(userId: number, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    try {
      const [existingPreferences] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
      
      if (existingPreferences) {
        const [updated] = await db.update(userPreferences)
          .set({ ...preferences, updatedAt: new Date() })
          .where(eq(userPreferences.userId, userId))
          .returning();
        return updated;
      } else {
        const [created] = await db.insert(userPreferences)
          .values({ userId, ...preferences })
          .returning();
        return created;
      }
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Enhanced Vehicle Management
  async getVehicles(userId: number): Promise<Vehicle[]> {
    try {
      const userVehicles = await db.select().from(vehicles).where(eq(vehicles.userId, userId));
      return userVehicles;
    } catch (error) {
      console.error('Error getting vehicles:', error);
      return [];
    }
  }

  async getUserVehicles(userId: number): Promise<Vehicle[]> {
    try {
      const userVehicles = await db.select().from(vehicles).where(eq(vehicles.userId, userId));
      return userVehicles;
    } catch (error) {
      console.error('Error getting user vehicles:', error);
      return [];
    }
  }

  // Gig Applications - stubbed for now
  async getGigApplications(userId: number, filters: { status?: string; limit?: number; offset?: number } = {}): Promise<GigApplication[]> {
    return [];
  }

  async createGigApplication(application: InsertGigApplication): Promise<GigApplication> {
    try {
      const [newApplication] = await db.insert(gigApplications).values(application).returning();
      return newApplication;
    } catch (error) {
      console.error('Error creating gig application:', error);
      throw error;
    }
  }

  async updateGigApplication(id: number, application: Partial<InsertGigApplication>): Promise<GigApplication | undefined> {
    return undefined;
  }

  async deleteGigApplication(id: number): Promise<boolean> {
    return false;
  }

  // VA Activities - stubbed
  async getVAActivities(userId: number, filters: any = {}): Promise<VAActivity[]> {
    return [];
  }

  async createVAActivity(activity: InsertVAActivity): Promise<VAActivity> {
    try {
      const [newActivity] = await db.insert(vaActivity).values(activity).returning();
      return newActivity;
    } catch (error) {
      console.error('Error creating VA activity:', error);
      throw error;
    }
  }

  async updateVAActivity(id: number, activity: Partial<InsertVAActivity>): Promise<VAActivity | undefined> {
    return undefined;
  }

  async deleteVAActivity(id: number): Promise<boolean> {
    return false;
  }

  async getVAActivityStats(userId: number): Promise<{ totalActivities: number; thisMonth: number; avgDurationMin: number; completedTasks: number; pendingTasks: number }> {
    return {
      totalActivities: 0,
      thisMonth: 0,
      avgDurationMin: 0,
      completedTasks: 0,
      pendingTasks: 0
    };
  }


  // VA Assignments - stubbed
  async getVAAssignments(userId: number): Promise<VAAssignment[]> {
    return [];
  }

  async createVAAssignment(assignment: InsertVAAssignment): Promise<VAAssignment> {
    try {
      const [newAssignment] = await db.insert(vaAssignments).values(assignment).returning();
      return newAssignment;
    } catch (error) {
      console.error('Error creating VA assignment:', error);
      throw error;
    }
  }

  async updateVAAssignment(id: number, assignment: Partial<InsertVAAssignment>): Promise<VAAssignment | undefined> {
    return undefined;
  }

  async deleteVAAssignment(id: number): Promise<boolean> {
    return false;
  }

  // Consent Grants - stubbed
  async getConsentGrants(userId: number): Promise<ConsentGrant[]> {
    return [];
  }

  async createConsentGrant(grant: InsertConsentGrant): Promise<ConsentGrant> {
    try {
      const [newGrant] = await db.insert(consentGrants).values(grant).returning();
      return newGrant;
    } catch (error) {
      console.error('Error creating consent grant:', error);
      throw error;
    }
  }

  async revokeConsentGrant(id: number): Promise<boolean> {
    return false;
  }

  // Audit Events - stubbed
  async getAuditEvents(userId: number, options: { limit?: number; offset?: number } = {}): Promise<AuditEvent[]> {
    return [];
  }

  async createAuditEvent(event: InsertAuditEvent): Promise<AuditEvent> {
    try {
      const [newEvent] = await db.insert(auditEvents).values(event).returning();
      return newEvent;
    } catch (error) {
      console.error('Error creating audit event:', error);
      throw error;
    }
  }

  // CRITICAL: RBAC Security Audit Logging Implementation
  async getAuditLogs(options: {
    actorUserId?: number;
    targetUserId?: number;
    action?: string;
    resource?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<AuditLog[]> {
    try {
      const { actorUserId, targetUserId, action, resource, limit = 100, offset = 0 } = options;
      
      let query = db.select().from(auditLogs);
      
      // Build WHERE clause based on filters
      const conditions = [];
      if (actorUserId) {
        conditions.push(eq(auditLogs.actorUserId, actorUserId));
      }
      if (targetUserId) {
        conditions.push(eq(auditLogs.targetUserId, targetUserId));
      }
      if (action) {
        conditions.push(eq(auditLogs.action, action));
      }
      if (resource) {
        conditions.push(eq(auditLogs.resource, resource));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
      
      const results = await query
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);
      
      return results;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }

  async createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog> {
    try {
      const [result] = await db.insert(auditLogs).values(auditLog).returning();
      
      if (!result) {
        throw new Error('Failed to create audit log entry');
      }
      
      // Log critical security events to console as well for immediate alerting
      if (auditLog.action?.includes('ROLE_CHANGED') || 
          auditLog.action?.includes('USER_SUSPENDED') ||
          auditLog.action?.includes('PERMISSION_ESCALATION')) {
        console.warn('[CRITICAL SECURITY AUDIT]', {
          id: result.id,
          action: auditLog.action,
          actorUserId: auditLog.actorUserId,
          targetUserId: auditLog.targetUserId,
          resource: auditLog.resource,
          ipAddress: auditLog.ipAddress,
          timestamp: result.createdAt
        });
      }
      
      return result;
    } catch (error) {
      console.error('CRITICAL: Failed to persist audit log - security event may be lost:', error);
      throw error;
    }
  }

  // Dismissed Recommendations
  async getDismissedRecommendations(userId: number): Promise<{ companyId: number; companyName: string; dismissedAt: Date; reason?: string }[]> {
    try {
      // For now, store dismissed recommendations in memory or a simple table structure
      // Since the dismissedRecommendations table doesn't exist yet, return empty array
      // This will be replaced once the database schema is updated
      return [];
    } catch (error) {
      console.error('Error getting dismissed recommendations:', error);
      return [];
    }
  }

  async dismissRecommendation(userId: number, companyId: number, companyName: string, reason?: string): Promise<void> {
    try {
      // For now, log the dismissal
      // This will be replaced once the database schema is updated
      console.log(`User ${userId} dismissed recommendation for company ${companyName} (${companyId})${reason ? ': ' + reason : ''}`);
      
      // In a full implementation, this would insert into dismissedRecommendations table:
      // await db.insert(dismissedRecommendations).values({
      //   userId,
      //   companyId,
      //   companyName,
      //   reason
      // });
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
      throw error;
    }
  }

  // Document Management Methods
  async getUserDocuments(userId: number): Promise<any[]> {
    try {
      const userDocs = await db.select().from(documents).where(eq(documents.userId, userId));
      return userDocs;
    } catch (error) {
      console.error('Error getting user documents:', error);
      throw error;
    }
  }

  async createDocument(document: any): Promise<any> {
    try {
      const [newDocument] = await db.insert(documents).values({
        userId: document.userId,
        type: document.type,
        name: document.name,
        filename: document.filename,
        filepath: document.filepath,
        url: document.url,
        size: document.size,
        mimetype: document.mimetype,
        expirationDate: document.expirationDate
      }).returning();
      return newDocument;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  async deleteDocument(id: number, userId: number): Promise<boolean> {
    try {
      const result = await db.delete(documents)
        .where(and(eq(documents.id, id), eq(documents.userId, userId)));
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  async getDocumentById(documentId: number, userId: number): Promise<any | undefined> {
    try {
      const [document] = await db.select().from(documents)
        .where(and(eq(documents.id, documentId), eq(documents.userId, userId)));
      return document;
    } catch (error) {
      console.error('Error getting document by ID:', error);
      return undefined;
    }
  }

  // Business Documents methods
  async getBusinessDocuments(businessEntityId: number): Promise<BusinessDocument[]> {
    try {
      const docs = await db.select().from(businessDocuments)
        .where(eq(businessDocuments.businessEntityId, businessEntityId));
      return docs;
    } catch (error) {
      console.error('Error getting business documents:', error);
      return [];
    }
  }

  async getUserBusinessDocuments(userId: number): Promise<BusinessDocument[]> {
    try {
      const docs = await db.select().from(businessDocuments)
        .where(eq(businessDocuments.userId, userId));
      return docs;
    } catch (error) {
      console.error('Error getting user business documents:', error);
      return [];
    }
  }

  async getBusinessDocument(id: number): Promise<BusinessDocument | undefined> {
    try {
      const [doc] = await db.select().from(businessDocuments)
        .where(eq(businessDocuments.id, id));
      return doc;
    } catch (error) {
      console.error('Error getting business document:', error);
      return undefined;
    }
  }

  async createBusinessDocument(document: InsertBusinessDocument): Promise<BusinessDocument> {
    try {
      const [newDoc] = await db.insert(businessDocuments).values(document).returning();
      return newDoc;
    } catch (error) {
      console.error('Error creating business document:', error);
      throw error;
    }
  }

  async updateBusinessDocument(id: number, document: Partial<InsertBusinessDocument>): Promise<BusinessDocument | undefined> {
    try {
      const [updatedDoc] = await db.update(businessDocuments)
        .set(document)
        .where(eq(businessDocuments.id, id))
        .returning();
      return updatedDoc;
    } catch (error) {
      console.error('Error updating business document:', error);
      return undefined;
    }
  }

  async deleteBusinessDocument(id: number): Promise<boolean> {
    try {
      await db.delete(businessDocuments).where(eq(businessDocuments.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting business document:', error);
      return false;
    }
  }

  // Business Tradelines methods
  async getBusinessTradelines(businessEntityId: number): Promise<BusinessTradeline[]> {
    try {
      const tradelines = await db.select().from(businessTradelines)
        .where(eq(businessTradelines.businessEntityId, businessEntityId))
        .orderBy(asc(businessTradelines.tradelineType), asc(businessTradelines.slotNumber));
      return tradelines;
    } catch (error) {
      console.error('Error getting business tradelines:', error);
      return [];
    }
  }

  async getUserBusinessTradelines(userId: number): Promise<BusinessTradeline[]> {
    try {
      const tradelines = await db.select().from(businessTradelines)
        .where(eq(businessTradelines.userId, userId))
        .orderBy(asc(businessTradelines.tradelineType), asc(businessTradelines.slotNumber));
      return tradelines;
    } catch (error) {
      console.error('Error getting user business tradelines:', error);
      return [];
    }
  }

  async getBusinessTradeline(id: number): Promise<BusinessTradeline | undefined> {
    try {
      const [tradeline] = await db.select().from(businessTradelines)
        .where(eq(businessTradelines.id, id));
      return tradeline;
    } catch (error) {
      console.error('Error getting business tradeline:', error);
      return undefined;
    }
  }

  async createBusinessTradeline(tradeline: InsertBusinessTradeline): Promise<BusinessTradeline> {
    try {
      const [newTradeline] = await db.insert(businessTradelines).values(tradeline).returning();
      return newTradeline;
    } catch (error) {
      console.error('Error creating business tradeline:', error);
      throw error;
    }
  }

  async updateBusinessTradeline(id: number, tradeline: Partial<InsertBusinessTradeline>): Promise<BusinessTradeline | undefined> {
    try {
      const [updatedTradeline] = await db.update(businessTradelines)
        .set({ ...tradeline, updatedAt: new Date() })
        .where(eq(businessTradelines.id, id))
        .returning();
      return updatedTradeline;
    } catch (error) {
      console.error('Error updating business tradeline:', error);
      return undefined;
    }
  }

  async deleteBusinessTradeline(id: number): Promise<boolean> {
    try {
      await db.delete(businessTradelines).where(eq(businessTradelines.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting business tradeline:', error);
      return false;
    }
  }

  // Task Management Methods
  async getUserTaskBoards(userId: number): Promise<TaskBoard[]> {
    const boards = await db.select().from(taskBoards)
      .where(eq(taskBoards.userId, userId.toString()))
      .orderBy(asc(taskBoards.position));
    return boards;
  }

  async getTaskBoard(id: number): Promise<TaskBoard | undefined> {
    const [board] = await db.select().from(taskBoards)
      .where(eq(taskBoards.id, id));
    return board;
  }

  async getBoardLists(boardId: number): Promise<TaskList[]> {
    const lists = await db.select().from(taskLists)
      .where(eq(taskLists.boardId, boardId))
      .orderBy(asc(taskLists.position));
    return lists;
  }

  async getListCards(listId: number): Promise<TaskCard[]> {
    const cards = await db.select().from(taskCards)
      .where(eq(taskCards.listId, listId))
      .orderBy(asc(taskCards.position));
    return cards;
  }

  async getUserTaskCards(userId: number): Promise<TaskCard[]> {
    const cards = await db.select().from(taskCards)
      .innerJoin(taskLists, eq(taskCards.listId, taskLists.id))
      .innerJoin(taskBoards, eq(taskLists.boardId, taskBoards.id))
      .where(eq(taskBoards.userId, userId.toString()))
      .orderBy(asc(taskCards.position));
    
    return cards.map(c => c.task_cards);
  }

  // Activity Tracking Methods  
  async logUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const [newActivity] = await db.insert(userActivity).values(activity).returning();
    return newActivity;
  }

  async getUserActivity(userId: number, limit: number = 50): Promise<UserActivity[]> {
    const activities = await db.select().from(userActivity)
      .where(eq(userActivity.userId, userId.toString()))
      .orderBy(desc(userActivity.timestamp))
      .limit(limit);
    return activities;
  }

  // Task Board CRUD Methods
  async createTaskBoard(board: InsertTaskBoard): Promise<TaskBoard> {
    const [newBoard] = await db.insert(taskBoards).values(board).returning();
    return newBoard;
  }

  async updateTaskBoard(id: number, board: Partial<InsertTaskBoard>): Promise<TaskBoard | undefined> {
    const [updatedBoard] = await db.update(taskBoards)
      .set({ ...board, updatedAt: new Date() })
      .where(eq(taskBoards.id, id))
      .returning();
    return updatedBoard;
  }

  async deleteTaskBoard(id: number): Promise<boolean> {
    try {
      await db.delete(taskBoards).where(eq(taskBoards.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting task board:', error);
      return false;
    }
  }

  // Task List CRUD Methods
  async getTaskList(id: number): Promise<TaskList | undefined> {
    const [list] = await db.select().from(taskLists)
      .where(eq(taskLists.id, id));
    return list;
  }

  async createTaskList(list: InsertTaskList): Promise<TaskList> {
    const [newList] = await db.insert(taskLists).values(list).returning();
    return newList;
  }

  async updateTaskList(id: number, list: Partial<InsertTaskList>): Promise<TaskList | undefined> {
    const [updatedList] = await db.update(taskLists)
      .set({ ...list, updatedAt: new Date() })
      .where(eq(taskLists.id, id))
      .returning();
    return updatedList;
  }

  async deleteTaskList(id: number): Promise<boolean> {
    try {
      await db.delete(taskLists).where(eq(taskLists.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting task list:', error);
      return false;
    }
  }

  // Task Card CRUD Methods
  async getTaskCard(id: number): Promise<TaskCard | undefined> {
    const [card] = await db.select().from(taskCards)
      .where(eq(taskCards.id, id));
    return card;
  }

  async createTaskCard(card: InsertTaskCard): Promise<TaskCard> {
    const [newCard] = await db.insert(taskCards).values(card).returning();
    return newCard;
  }

  async updateTaskCard(id: number, card: Partial<InsertTaskCard>): Promise<TaskCard | undefined> {
    const [updatedCard] = await db.update(taskCards)
      .set({ ...card, updatedAt: new Date() })
      .where(eq(taskCards.id, id))
      .returning();
    return updatedCard;
  }

  async deleteTaskCard(id: number): Promise<boolean> {
    try {
      await db.delete(taskCards).where(eq(taskCards.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting task card:', error);
      return false;
    }
  }

  async moveTaskCard(cardId: number, targetListId: number, position: number): Promise<TaskCard | undefined> {
    const [movedCard] = await db.update(taskCards)
      .set({ 
        listId: targetListId, 
        position: position,
        updatedAt: new Date()
      })
      .where(eq(taskCards.id, cardId))
      .returning();
    return movedCard;
  }

  async addTaskCardComment(cardId: number, commentData: { text: string; userId: string; userName: string; createdAt: string }): Promise<TaskCard | undefined> {
    const [card] = await db.select().from(taskCards).where(eq(taskCards.id, cardId));
    if (!card) return undefined;

    const existingComments = Array.isArray(card.comments) ? card.comments : [];
    const newComments = [...existingComments, commentData];

    const [updatedCard] = await db.update(taskCards)
      .set({ 
        comments: newComments,
        updatedAt: new Date()
      })
      .where(eq(taskCards.id, cardId))
      .returning();
    return updatedCard;
  }

  // Company Actions Methods
  async getUserCompanyActions(userId: number): Promise<any[]> {
    try {
      const actions = await db.select({
        id: companyActions.id,
        userId: companyActions.userId,
        companyId: companyActions.companyId,
        action: companyActions.action,
        companyName: companies.name,
        createdAt: companyActions.createdAt,
        updatedAt: companyActions.updatedAt
      })
      .from(companyActions)
      .leftJoin(companies, eq(companyActions.companyId, companies.id))
      .where(eq(companyActions.userId, userId));
      
      return actions;
    } catch (error) {
      console.error("Error fetching user company actions:", error);
      return [];
    }
  }

  async setCompanyAction(userId: number, companyId: number, action: string | null): Promise<any> {
    try {
      // Check if an action already exists for this user/company combo
      const [existingAction] = await db.select().from(companyActions)
        .where(and(eq(companyActions.userId, userId), eq(companyActions.companyId, companyId)));

      if (existingAction) {
        if (action === null || action === '') {
          // Delete the action if setting to null/empty
          await db.delete(companyActions)
            .where(and(eq(companyActions.userId, userId), eq(companyActions.companyId, companyId)));
          return { userId, companyId, action: null };
        } else {
          // Update existing action
          const [updatedAction] = await db.update(companyActions)
            .set({ 
              action: action,
              updatedAt: new Date()
            })
            .where(and(eq(companyActions.userId, userId), eq(companyActions.companyId, companyId)))
            .returning();
          return updatedAction;
        }
      } else {
        if (action && action !== '') {
          // Create new action
          const [newAction] = await db.insert(companyActions)
            .values({
              userId,
              companyId,
              action,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            .returning();
          return newAction;
        } else {
          // No action to set for non-existing record
          return { userId, companyId, action: null };
        }
      }
    } catch (error) {
      console.error("Error setting company action:", error);
      throw error;
    }
  }

  // Password Reset methods
  async createPasswordResetToken(userId: number, email: string, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    const [newToken] = await db.insert(passwordResetTokens).values({
      userId: userId.toString(),
      email,
      token,
      expiresAt
    }).returning();
    return newToken;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db.select().from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.token, token), eq(passwordResetTokens.usedAt, null)));
    return resetToken;
  }

  async markPasswordResetTokenUsed(tokenId: number): Promise<void> {
    await db.update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, tokenId));
  }

  async cleanupExpiredTokens(): Promise<void> {
    await db.delete(passwordResetTokens)
      .where(lt(passwordResetTokens.expiresAt, new Date()));
  }

  // Calendar Integration
  async getTaskCalendarEvents(userId: number): Promise<Array<{
    id: number;
    title: string;
    startDate: Date | null;
    dueDate: Date | null;
    reminderDays: number | null;
    type: 'task';
    boardTitle: string;
    listTitle: string;
  }>> {
    const taskEvents = await db.select({
      id: taskCards.id,
      title: taskCards.title,
      startDate: taskCards.startDate,
      dueDate: taskCards.dueDate,
      reminderDays: taskCards.reminderDays,
      type: sql<'task'>`'task'`,
      boardTitle: taskBoards.title,
      listTitle: taskLists.title
    })
    .from(taskCards)
    .innerJoin(taskLists, eq(taskCards.listId, taskLists.id))
    .innerJoin(taskBoards, eq(taskLists.boardId, taskBoards.id))
    .where(eq(taskBoards.userId, userId.toString()));
    
    return taskEvents;
  }

  // Newsletter Subscribers methods
  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return newSubscriber;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }

  // AI Chat methods
  async saveAiChatMessage(userId: number, sessionId: string, message: { role: string; content: string; messageId?: string; toolCalls?: any }): Promise<any> {
    const [savedMessage] = await db.insert(aiChatConversations).values({
      userId: userId.toString(),
      sessionId,
      role: message.role,
      content: message.content,
      messageId: message.messageId || null,
      toolCalls: message.toolCalls || null
    }).returning();
    return savedMessage;
  }

  async getAiChatHistory(userId: number, sessionId: string, limit: number = 50): Promise<any[]> {
    return await db.select().from(aiChatConversations)
      .where(and(
        eq(aiChatConversations.userId, userId.toString()),
        eq(aiChatConversations.sessionId, sessionId)
      ))
      .orderBy(asc(aiChatConversations.createdAt))
      .limit(limit);
  }

  // Session Management Implementation
  async getUserSessionBySessionId(sessionId: string): Promise<any | undefined> {
    const [session] = await db.select().from(userSessions)
      .where(eq(userSessions.sessionId, sessionId))
      .limit(1);
    return session;
  }

  async createUserSession(sessionData: any): Promise<any> {
    const [session] = await db.insert(userSessions).values({
      sessionId: sessionData.sessionId,
      userId: sessionData.userId,
      ipAddress: sessionData.ipAddress,
      userAgent: sessionData.userAgent,
      expiresAt: sessionData.expiresAt,
      lastActivityAt: sessionData.lastActivityAt || new Date()
    }).returning();
    return session;
  }

  async updateUserSessionActivity(sessionId: string): Promise<void> {
    await db.update(userSessions)
      .set({ lastActivityAt: new Date() })
      .where(eq(userSessions.sessionId, sessionId));
  }

  async revokeUserSession(sessionId: string): Promise<void> {
    await db.update(userSessions)
      .set({ revokedAt: new Date() })
      .where(eq(userSessions.sessionId, sessionId));
  }

  async getUserSessions(userId: number): Promise<any[]> {
    return await db.select().from(userSessions)
      .where(eq(userSessions.userId, userId))
      .orderBy(desc(userSessions.createdAt));
  }

  async revokeAllUserSessions(userId: number, excludeSessionId?: string): Promise<void> {
    let query = db.update(userSessions)
      .set({ revokedAt: new Date() })
      .where(and(
        eq(userSessions.userId, userId),
        isNull(userSessions.revokedAt) // Only revoke non-revoked sessions
      ));
    
    if (excludeSessionId) {
      query = query.where(and(
        eq(userSessions.userId, userId),
        isNull(userSessions.revokedAt),
        ne(userSessions.sessionId, excludeSessionId)
      ));
    }
    
    await query;
  }

  // RBAC Invitation Management Implementation
  async createInvitation(invitation: InsertInvitation): Promise<Invitation> {
    const [newInvitation] = await db.insert(invitations).values(invitation).returning();
    return newInvitation;
  }

  async getInvitation(token: string): Promise<Invitation | undefined> {
    const [invitation] = await db.select().from(invitations)
      .where(eq(invitations.token, token))
      .limit(1);
    return invitation;
  }

  async getInvitationById(id: number): Promise<Invitation | undefined> {
    const [invitation] = await db.select().from(invitations)
      .where(eq(invitations.id, id))
      .limit(1);
    return invitation;
  }

  async getUserInvitations(userId: number): Promise<Invitation[]> {
    return await db.select().from(invitations)
      .where(eq(invitations.invitedByUserId, userId))
      .orderBy(desc(invitations.createdAt));
  }

  async getAllPendingInvitations(): Promise<Invitation[]> {
    return await db.select().from(invitations)
      .where(and(
        isNull(invitations.acceptedAt),
        isNull(invitations.revokedAt),
        sql`${invitations.expiresAt} > NOW()`
      ))
      .orderBy(desc(invitations.createdAt));
  }

  async acceptInvitation(token: string, acceptingUserId: number): Promise<Invitation | undefined> {
    // First verify invitation exists and is valid
    const invitation = await this.getInvitation(token);
    if (!invitation || invitation.acceptedAt || invitation.revokedAt) {
      return undefined;
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      return undefined; // Expired
    }

    // Accept the invitation
    const [updatedInvitation] = await db.update(invitations)
      .set({ acceptedAt: new Date() })
      .where(eq(invitations.token, token))
      .returning();

    return updatedInvitation;
  }

  async revokeInvitation(id: number): Promise<boolean> {
    const result = await db.update(invitations)
      .set({ revokedAt: new Date() })
      .where(eq(invitations.id, id));
      
    return result.rowCount !== null && result.rowCount > 0;
  }

  async cleanupExpiredInvitations(): Promise<number> {
    const result = await db.update(invitations)
      .set({ revokedAt: new Date() })
      .where(and(
        isNull(invitations.acceptedAt),
        isNull(invitations.revokedAt),
        sql`${invitations.expiresAt} <= NOW()`
      ));
      
    return result.rowCount || 0;
  }
}

export const storage = new DatabaseStorage();
