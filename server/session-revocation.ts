import { Request, Response, NextFunction } from 'express';
import { IStorage } from './storage';
import crypto from 'crypto';

// Security helper to redact sensitive session data
function redactSessionId(sessionId: string): string {
  if (!sessionId || sessionId.length < 8) return '[redacted]';
  const hash = crypto.createHash('sha256').update(sessionId).digest('hex');
  return `${sessionId.slice(0, 4)}***${hash.slice(0, 8)}`;
}

// Type-safe user ID extraction
function extractUserId(user: any): number | null {
  const id = user?.claims?.sub || user?.id;
  if (!id) return null;
  return typeof id === 'string' ? parseInt(id, 10) : Number(id);
}

declare global {
  namespace Express {
    interface Request {
      storage?: IStorage;
    }
  }
}

// Session revocation middleware
export const sessionRevocationMiddleware = (storage: IStorage) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip for unauthenticated requests
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user || !req.sessionID) {
      return next();
    }

    try {
      // Check if session exists in userSessions table
      const userSession = await storage.getUserSessionBySessionId(req.sessionID);
      
      if (userSession) {
        // Check if session is revoked
        if (userSession.revokedAt) {
          console.log(`Blocking revoked session: ${redactSessionId(req.sessionID)} for user: ${extractUserId(req.user)}`);
          
          // Clear the session
          req.logout((err) => {
            if (err) console.error('Error during logout:', err);
          });
          
          req.session?.destroy((err) => {
            if (err) console.error('Error destroying session:', err);
          });
          
          return res.status(401).json({ 
            error: 'Session revoked',
            message: 'Your session has been revoked. Please log in again.'
          });
        }

        // Check if session is expired
        if (userSession.expiresAt && new Date() > userSession.expiresAt) {
          console.log(`Blocking expired session: ${redactSessionId(req.sessionID)} for user: ${extractUserId(req.user)}`);
          
          // Auto-revoke expired session
          await storage.revokeUserSession(req.sessionID);
          
          // Clear the session
          req.logout((err) => {
            if (err) console.error('Error during logout:', err);
          });
          
          req.session?.destroy((err) => {
            if (err) console.error('Error destroying session:', err);
          });
          
          return res.status(401).json({ 
            error: 'Session expired',
            message: 'Your session has expired. Please log in again.'
          });
        }

        // Update last activity for valid sessions
        await storage.updateUserSessionActivity(req.sessionID);
      } else {
        // Session not tracked in userSessions table - create entry for existing session
        const userId = extractUserId(req.user);
        if (userId) {
          const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
          const expiresAt = new Date(Date.now() + sessionTtl);
          
          await storage.createUserSession({
            sessionId: req.sessionID,
            userId: userId,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            expiresAt: expiresAt,
            lastActivityAt: new Date()
          });
          
          console.log(`Created session tracking for session: ${redactSessionId(req.sessionID)}, user: ${userId}`);
        }
      }
      
      // Add storage to request for easy access in routes
      req.storage = storage;
      
    } catch (error) {
      console.error('Session revocation middleware error:', error);
      // Don't block the request on database errors, but log the issue
    }
    
    next();
  };
};

// Session management endpoint handlers
export const getCurrentUserSessions = async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req.user);
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found' });
    }

    const storage = req.storage!;
    const sessions = await storage.getUserSessions(userId);
    
    // Don't expose full session data, just safe information
    const safeSessions = sessions.map(session => ({
      id: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt,
      isRevoked: !!session.revokedAt,
      isCurrent: session.sessionId === req.sessionID
    }));
    
    res.json({ sessions: safeSessions });
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

export const revokeUserSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = extractUserId(req.user);
    
    if (!sessionId || !userId) {
      return res.status(400).json({ error: 'Session ID and user ID required' });
    }

    const storage = req.storage!;
    
    // Verify the session belongs to the current user (security check)
    const session = await storage.getUserSessionBySessionId(sessionId);
    if (!session || session.userId !== userId) {
      console.warn(`Unauthorized session revocation attempt: user ${userId} tried to revoke session ${redactSessionId(sessionId)}`);
      return res.status(403).json({ error: 'Session not found or access denied' });
    }

    // Revoke the session
    await storage.revokeUserSession(sessionId);
    
    console.log(`Session ${redactSessionId(sessionId)} revoked by user ${userId}`);
    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    console.error('Error revoking session:', error);
    res.status(500).json({ error: 'Failed to revoke session' });
  }
};

export const revokeAllUserSessions = async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req.user);
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found' });
    }

    const storage = req.storage!;
    const currentSessionId = req.sessionID;
    
    // Revoke all sessions except current one (optional - can be changed)
    const { excludeCurrent = true } = req.body;
    
    await storage.revokeAllUserSessions(userId, excludeCurrent ? currentSessionId : undefined);
    
    console.log(`All sessions revoked for user ${userId}${excludeCurrent ? ` (except current: ${redactSessionId(currentSessionId)})` : ''}`);
    res.json({ 
      message: excludeCurrent 
        ? 'All other sessions revoked successfully' 
        : 'All sessions revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking all sessions:', error);
    res.status(500).json({ error: 'Failed to revoke sessions' });
  }
};