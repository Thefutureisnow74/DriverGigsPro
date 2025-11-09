import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
// Import centralized RBAC constants and utilities - CRITICAL SECURITY FIX
import {
  ROLES,
  USER_STATUS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessUserData,
  canModifyUserData,
  canAssignRole,
  isHigherRole,
  isHigherOrEqualRole,
  isValidUserStatus,
  isValidRole,
  type Role,
  type UserStatus,
  type Permission
} from '@shared/rbac';

// Database storage interface for audit logging
import type { IStorage } from './storage';
import type { InsertAuditLog } from '@shared/schema';

// Express middleware for permission checking
export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any; // Will be properly typed after auth integration
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (user.status !== USER_STATUS.ACTIVE) {
      return res.status(403).json({ message: 'Account suspended' });
    }
    
    if (!hasPermission(user.role, permission)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
}

export function requireAnyPermission(permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (user.status !== USER_STATUS.ACTIVE) {
      return res.status(403).json({ message: 'Account suspended' });
    }
    
    if (!hasAnyPermission(user.role, permissions)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
}

export function requireAllPermissions(permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (user.status !== USER_STATUS.ACTIVE) {
      return res.status(403).json({ message: 'Account suspended' });
    }
    
    if (!hasAllPermissions(user.role, permissions)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
}

// NEW: Enhanced middleware guards for granular access control
export function requireSelfOrPermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (user.status !== USER_STATUS.ACTIVE) {
      return res.status(403).json({ message: 'Account suspended' });
    }
    
    // Extract target user ID from params, fallback to current user for self-operations
    const targetUserIdParam = req.params.userId || req.params.id;
    let targetUserId: number;
    
    if (targetUserIdParam) {
      targetUserId = parseInt(targetUserIdParam);
      if (isNaN(targetUserId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
    } else {
      // For routes like /api/user/profile with no userId param, default to self
      targetUserId = user.id;
    }
    
    // Allow if user is accessing their own data OR has the required permission
    if (user.id === targetUserId || hasPermission(user.role, permission)) {
      next();
    } else {
      return res.status(403).json({ message: 'Can only access own data or need higher permissions' });
    }
  };
}

export function requireRoleAtLeast(minRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (user.status !== USER_STATUS.ACTIVE) {
      return res.status(403).json({ message: 'Account suspended' });
    }
    
    if (!isHigherOrEqualRole(user.role, minRole)) {
      return res.status(403).json({ message: `Requires ${minRole} role or higher` });
    }
    
    next();
  };
}

// CRITICAL: Database-persisted audit logging with proper error handling
export async function createAndPersistAuditLog(
  storage: IStorage,
  action: string,
  actorUserId?: number,
  targetUserId?: number,
  resource?: string,
  resourceId?: string,
  meta?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> {
  try {
    const auditLogData: InsertAuditLog = {
      action,
      actorUserId: actorUserId || null,
      targetUserId: targetUserId || null,
      resource: resource || null,
      resourceId: resourceId || null,
      meta: meta || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null
    };
    
    // CRITICAL: Persist to database for security compliance
    await storage.createAuditLog(auditLogData);
    
    return true;
  } catch (error) {
    console.error('CRITICAL: Failed to persist security audit log - this is a compliance violation:', error);
    // Still log to console as fallback but this is a serious issue
    console.warn('[FALLBACK AUDIT LOG]', {
      action,
      actorUserId,
      targetUserId,
      resource,
      resourceId,
      meta,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    });
    return false;
  }
}

// Enhanced middleware for audit logging with automatic persistence
export function auditAction(action: string, resource?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Store audit info in res.locals for use in route handlers
    res.locals.auditAction = action;
    res.locals.auditResource = resource;
    res.locals.auditStartTime = Date.now();
    
    // Add audit helper to response locals for manual logging
    res.locals.auditLog = async (storage: IStorage, targetUserId?: number, meta?: any) => {
      const user = getUserFromRequest(req);
      await createAndPersistAuditLog(
        storage,
        action,
        user?.id,
        targetUserId,
        resource,
        req.params.id || req.params.userId,
        {
          ...meta,
          duration: Date.now() - res.locals.auditStartTime,
          method: req.method,
          url: req.url
        },
        getClientIP(req),
        getUserAgent(req)
      );
    };

    // CRITICAL: Automatic audit log persistence on response finish
    const originalEnd = res.end;
    let auditPersisted = false;
    
    res.end = function(...args: any[]) {
      if (!auditPersisted) {
        auditPersisted = true;
        // Persist audit log automatically - don't await to avoid blocking response
        setImmediate(async () => {
          try {
            // Import storage dynamically to avoid circular dependencies
            const { storage } = await import('./storage');
            const user = getUserFromRequest(req);
            await createAndPersistAuditLog(
              storage,
              action,
              user?.id,
              undefined, // Default targetUserId to undefined for auto-logging
              resource,
              req.params.id || req.params.userId,
              {
                duration: Date.now() - res.locals.auditStartTime,
                method: req.method,
                url: req.url,
                statusCode: res.statusCode
              },
              getClientIP(req),
              getUserAgent(req)
            );
          } catch (error) {
            console.error('CRITICAL: Failed to auto-persist audit log:', error);
          }
        });
      }
      return originalEnd.apply(this, args);
    };
    
    next();
  };
}

// Legacy helper for backward compatibility - DEPRECATED
// Use createAndPersistAuditLog instead
export function createAuditLog(
  action: string,
  actorUserId?: number,
  targetUserId?: number,
  resource?: string,
  resourceId?: string,
  meta?: any,
  ipAddress?: string,
  userAgent?: string
) {
  console.warn('DEPRECATED: createAuditLog should be replaced with createAndPersistAuditLog');
  return {
    action,
    actorUserId: actorUserId || null,
    targetUserId: targetUserId || null,
    resource: resource || null,
    resourceId: resourceId || null,
    meta: meta || null,
    ipAddress: ipAddress || null,
    userAgent: userAgent || null
  };
}

// Helper function to extract user info from request
export function getUserFromRequest(req: Request): { id: number; role: Role; status: UserStatus } | null {
  const user = req.user as any;
  if (!user || !user.id || !user.role || !user.status) {
    return null;
  }
  return {
    id: user.id,
    role: user.role as Role,
    status: user.status as UserStatus
  };
}

// Helper function to get IP address from request
export function getClientIP(req: Request): string {
  return (req.headers['x-forwarded-for'] as string) ||
         (req.connection?.remoteAddress) ||
         (req.socket?.remoteAddress) ||
         'unknown';
}

// Helper function to get user agent from request
export function getUserAgent(req: Request): string {
  return req.headers['user-agent'] || 'unknown';
}