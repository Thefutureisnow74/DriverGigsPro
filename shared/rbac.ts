// Centralized RBAC constants and types shared between server and client
// This file eliminates dangerous code duplication and ensures consistency

// Role hierarchy and permissions
export const ROLES = {
  OWNER: 'OWNER',
  ASSISTANT: 'ASSISTANT', 
  VIEWER: 'VIEWER'
} as const;

export type Role = keyof typeof ROLES;

// User status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED'
} as const;

export type UserStatus = keyof typeof USER_STATUS;

// Comprehensive permission matrix
export const PERMISSIONS = {
  // User Management
  CREATE_INVITATIONS: 'CREATE_INVITATIONS',
  REVOKE_INVITATIONS: 'REVOKE_INVITATIONS',
  MANAGE_USERS: 'MANAGE_USERS',
  SUSPEND_USERS: 'SUSPEND_USERS',
  DELETE_USERS: 'DELETE_USERS',
  VIEW_USER_LIST: 'VIEW_USER_LIST',
  
  // Role Management
  ASSIGN_ROLES: 'ASSIGN_ROLES',
  CHANGE_ROLES: 'CHANGE_ROLES',
  
  // Session Management
  REVOKE_SESSIONS: 'REVOKE_SESSIONS',
  VIEW_SESSION_LOGS: 'VIEW_SESSION_LOGS',
  
  // Data Access
  READ_ALL_DATA: 'READ_ALL_DATA',
  MODIFY_ALL_DATA: 'MODIFY_ALL_DATA',
  DELETE_ALL_DATA: 'DELETE_ALL_DATA',
  
  // System Administration
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
  SYSTEM_SETTINGS: 'SYSTEM_SETTINGS',
  EXPORT_DATA: 'EXPORT_DATA',
  
  // Personal Data
  READ_OWN_DATA: 'READ_OWN_DATA',
  MODIFY_OWN_DATA: 'MODIFY_OWN_DATA',
  
  // Shared Operations
  COLLABORATE: 'COLLABORATE',
  SHARE_RESOURCES: 'SHARE_RESOURCES'
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Role-based permission matrix - CRITICAL: This is the single source of truth
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.OWNER]: [
    // Full system access
    PERMISSIONS.CREATE_INVITATIONS,
    PERMISSIONS.REVOKE_INVITATIONS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.SUSPEND_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.VIEW_USER_LIST,
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.CHANGE_ROLES,
    PERMISSIONS.REVOKE_SESSIONS,
    PERMISSIONS.VIEW_SESSION_LOGS,
    PERMISSIONS.READ_ALL_DATA,
    PERMISSIONS.MODIFY_ALL_DATA,
    PERMISSIONS.DELETE_ALL_DATA,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.READ_OWN_DATA,
    PERMISSIONS.MODIFY_OWN_DATA,
    PERMISSIONS.COLLABORATE,
    PERMISSIONS.SHARE_RESOURCES
  ],
  
  [ROLES.ASSISTANT]: [
    // Limited administrative access
    PERMISSIONS.VIEW_USER_LIST,
    PERMISSIONS.REVOKE_SESSIONS,
    PERMISSIONS.VIEW_SESSION_LOGS,
    PERMISSIONS.READ_ALL_DATA,
    PERMISSIONS.MODIFY_ALL_DATA,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.READ_OWN_DATA,
    PERMISSIONS.MODIFY_OWN_DATA,
    PERMISSIONS.COLLABORATE,
    PERMISSIONS.SHARE_RESOURCES
  ],
  
  [ROLES.VIEWER]: [
    // Read-only access to own data only
    PERMISSIONS.READ_OWN_DATA,
    PERMISSIONS.MODIFY_OWN_DATA,
    PERMISSIONS.COLLABORATE
  ]
};

// Role hierarchy helpers
export function isHigherRole(role1: Role, role2: Role): boolean {
  const roleHierarchy = {
    [ROLES.OWNER]: 3,
    [ROLES.ASSISTANT]: 2,
    [ROLES.VIEWER]: 1
  };
  
  return roleHierarchy[role1] > roleHierarchy[role2];
}

export function isHigherOrEqualRole(role1: Role, role2: Role): boolean {
  const roleHierarchy = {
    [ROLES.OWNER]: 3,
    [ROLES.ASSISTANT]: 2,
    [ROLES.VIEWER]: 1
  };
  
  return roleHierarchy[role1] >= roleHierarchy[role2];
}

// Permission checking utilities
export function hasPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

// CRITICAL: Fixed canAccessUserData function with proper role hierarchy
export function canAccessUserData(actorRole: Role, actorId: number, targetUserId: number): boolean {
  // OWNER and ASSISTANT can access all user data
  if (actorRole === ROLES.OWNER || actorRole === ROLES.ASSISTANT) {
    return true;
  }
  
  // VIEWER can only access their own data
  if (actorRole === ROLES.VIEWER) {
    return actorId === targetUserId;
  }
  
  return false;
}

// CRITICAL SECURITY FIX: Proper role hierarchy enforcement for data modification
export function canModifyUserData(actorRole: Role, actorId: number, targetUserId: number, targetUserRole?: Role): boolean {
  // Users can always modify their own data (within permission constraints)
  if (actorId === targetUserId) {
    return true;
  }
  
  // OWNER can modify all user data
  if (actorRole === ROLES.OWNER) {
    return true;
  }
  
  // ASSISTANT can modify user data, but NOT OWNER accounts (CRITICAL FIX)
  if (actorRole === ROLES.ASSISTANT) {
    if (targetUserRole && targetUserRole === ROLES.OWNER) {
      return false; // ASSISTANT cannot modify OWNER accounts
    }
    return true; // ASSISTANT can modify ASSISTANT and VIEWER accounts
  }
  
  // VIEWER can only modify their own data (handled above)
  return false;
}

export function canAssignRole(actorRole: Role, targetRole: Role): boolean {
  // OWNER can assign any role
  if (actorRole === ROLES.OWNER) {
    return true;
  }
  
  // ASSISTANT cannot assign roles
  if (actorRole === ROLES.ASSISTANT) {
    return false;
  }
  
  // VIEWER cannot assign roles
  return false;
}

// Session and status validation
export function isValidUserStatus(status: string): status is UserStatus {
  return Object.values(USER_STATUS).includes(status as UserStatus);
}

export function isValidRole(role: string): role is Role {
  return Object.values(ROLES).includes(role as Role);
}

// Permission group helpers for UI
export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [
    PERMISSIONS.CREATE_INVITATIONS,
    PERMISSIONS.REVOKE_INVITATIONS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.SUSPEND_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.VIEW_USER_LIST
  ],
  ROLE_MANAGEMENT: [
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.CHANGE_ROLES
  ],
  SESSION_MANAGEMENT: [
    PERMISSIONS.REVOKE_SESSIONS,
    PERMISSIONS.VIEW_SESSION_LOGS
  ],
  DATA_ACCESS: [
    PERMISSIONS.READ_ALL_DATA,
    PERMISSIONS.MODIFY_ALL_DATA,
    PERMISSIONS.DELETE_ALL_DATA
  ],
  SYSTEM_ADMIN: [
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.EXPORT_DATA
  ],
  PERSONAL: [
    PERMISSIONS.READ_OWN_DATA,
    PERMISSIONS.MODIFY_OWN_DATA
  ],
  COLLABORATION: [
    PERMISSIONS.COLLABORATE,
    PERMISSIONS.SHARE_RESOURCES
  ]
} as const;

export function getPermissionGroupName(group: keyof typeof PERMISSION_GROUPS): string {
  switch (group) {
    case 'USER_MANAGEMENT':
      return 'User Management';
    case 'ROLE_MANAGEMENT':
      return 'Role Management';
    case 'SESSION_MANAGEMENT':
      return 'Session Management';
    case 'DATA_ACCESS':
      return 'Data Access';
    case 'SYSTEM_ADMIN':
      return 'System Administration';
    case 'PERSONAL':
      return 'Personal Data';
    case 'COLLABORATION':
      return 'Collaboration';
    default:
      return 'Unknown';
  }
}

// Role display utilities
export function getRoleDisplayName(role: Role): string {
  switch (role) {
    case ROLES.OWNER:
      return 'Owner';
    case ROLES.ASSISTANT:
      return 'Assistant';
    case ROLES.VIEWER:
      return 'Viewer';
    default:
      return 'Unknown';
  }
}

export function getRoleDescription(role: Role): string {
  switch (role) {
    case ROLES.OWNER:
      return 'Full system access and user management';
    case ROLES.ASSISTANT:
      return 'Limited administrative access to all data';
    case ROLES.VIEWER:
      return 'Read-only access to own data';
    default:
      return 'Unknown role';
  }
}

export function getStatusDisplayName(status: UserStatus): string {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return 'Active';
    case USER_STATUS.SUSPENDED:
      return 'Suspended';
    case USER_STATUS.DELETED:
      return 'Deleted';
    default:
      return 'Unknown';
  }
}