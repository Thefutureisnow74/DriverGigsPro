// Client-side RBAC utilities
import { useAuth } from '@/hooks/useAuth';
// Import centralized RBAC constants and utilities - CRITICAL SECURITY FIX
import {
  ROLES,
  USER_STATUS,
  PERMISSIONS,
  PERMISSION_GROUPS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessUserData,
  canModifyUserData,
  canAssignRole,
  isHigherRole,
  isHigherOrEqualRole,
  getRoleDisplayName,
  getRoleDescription,
  getStatusDisplayName,
  getPermissionGroupName,
  type Role,
  type UserStatus,
  type Permission
} from '@shared/rbac';

// React hooks for permission checking
export function usePermissions() {
  const { user } = useAuth();
  
  const checkPermission = (permission: Permission): boolean => {
    if (!user || !user.role) return false;
    return hasPermission(user.role as Role, permission);
  };
  
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!user || !user.role) return false;
    return hasAnyPermission(user.role as Role, permissions);
  };
  
  const checkAllPermissions = (permissions: Permission[]): boolean => {
    if (!user || !user.role) return false;
    return hasAllPermissions(user.role as Role, permissions);
  };
  
  const checkUserAccess = (targetUserId: number): boolean => {
    if (!user || !user.role || !user.id) return false;
    return canAccessUserData(user.role as Role, user.id, targetUserId);
  };
  
  // CRITICAL SECURITY FIX: Use the centralized, secure version
  const checkUserModify = (targetUserId: number, targetUserRole?: Role): boolean => {
    if (!user || !user.role || !user.id) return false;
    return canModifyUserData(user.role as Role, user.id, targetUserId, targetUserRole);
  };
  
  const checkRoleAssignment = (targetRole: Role): boolean => {
    if (!user || !user.role) return false;
    return canAssignRole(user.role as Role, targetRole);
  };
  
  const isOwner = user?.role === ROLES.OWNER;
  const isAssistant = user?.role === ROLES.ASSISTANT;
  const isViewer = user?.role === ROLES.VIEWER;
  const isActive = user?.status === USER_STATUS.ACTIVE;
  
  return {
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    canAccessUser: checkUserAccess,
    canModifyUser: checkUserModify,
    canAssignRole: checkRoleAssignment,
    isOwner,
    isAssistant,
    isViewer,
    isActive,
    userRole: user?.role as Role,
    userStatus: user?.status as UserStatus
  };
}

// Enhanced React hook for component-level UI guards
export function useRoleGuards() {
  const { user } = useAuth();
  
  const isAtLeastRole = (minRole: Role): boolean => {
    if (!user?.role) return false;
    return isHigherOrEqualRole(user.role as Role, minRole);
  };
  
  const isHigherThanRole = (compareRole: Role): boolean => {
    if (!user?.role) return false;
    return isHigherRole(user.role as Role, compareRole);
  };
  
  return {
    isAtLeastRole,
    isHigherThanRole,
    isOwner: user?.role === ROLES.OWNER,
    isAssistant: user?.role === ROLES.ASSISTANT,
    isViewer: user?.role === ROLES.VIEWER,
    isActive: user?.status === USER_STATUS.ACTIVE,
    canManageUsers: user?.role === ROLES.OWNER,
    canViewAllData: user?.role === ROLES.OWNER || user?.role === ROLES.ASSISTANT
  };
}

// Client-specific utility functions for UI components
export function formatUserRole(role: Role): string {
  return getRoleDisplayName(role);
}

export function formatUserStatus(status: UserStatus): string {
  return getStatusDisplayName(status);
}

export function getRoleBadgeColor(role: Role): string {
  switch (role) {
    case ROLES.OWNER:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case ROLES.ASSISTANT:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case ROLES.VIEWER:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}

export function getStatusBadgeColor(status: UserStatus): string {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case USER_STATUS.SUSPENDED:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case USER_STATUS.DELETED:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}