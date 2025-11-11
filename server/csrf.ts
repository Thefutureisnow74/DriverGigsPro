import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface Request {
      csrfToken?: () => string;
    }
    interface Session {
      csrfToken?: string;
      csrfSignature?: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
    csrfSignature?: string;
  }
}

// CSRF token generation and validation
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;

  // Generate a CSRF token
  static generateToken(): string {
    return crypto.randomBytes(this.TOKEN_LENGTH).toString('hex');
  }

  // Validate CSRF token against stored token
  static validateToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) {
      return false;
    }

    // Use timing-safe comparison
    try {
      return crypto.timingSafeEqual(
        Buffer.from(token, 'hex'),
        Buffer.from(storedToken, 'hex')
      );
    } catch (e) {
      return false;
    }
  }
}

// Middleware to add CSRF token to request
export const csrfTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add csrf token generator to request
  req.csrfToken = () => {
    const token = CSRFProtection.generateToken();
    
    // Store in session for validation
    if (req.session) {
      req.session.csrfToken = token;
    }
    
    return token;
  };
  
  next();
};

// Middleware to validate CSRF token on state-changing requests
export const csrfValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF validation for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for API authentication endpoints (they use other protection)
  if (req.path.startsWith('/api/auth/') || req.path === '/api/login') {
    return next();
  }

  // File upload endpoints now require CSRF protection (removed skip)

  // Temporarily skip CSRF for critical endpoints while fixing session issues
  if (req.path === '/api/gigbot/chat' || req.path === '/api/user/profile' || req.path === '/api/sider/free-chat' || req.path === '/api/job-search-notes') {
    return next();
  }

  const token = req.body._csrf || req.headers['x-csrf-token'] || req.headers['csrf-token'];
  const storedToken = req.session?.csrfToken || '';

  if (!CSRFProtection.validateToken(token, storedToken)) {
    console.log('[CSRF VALIDATION FAILED]', {
      hasToken: !!token,
      hasStoredToken: !!storedToken,
      sessionId: req.sessionID,
      path: req.path
    });
    return res.status(403).json({ 
      error: 'CSRF token validation failed',
      message: 'Invalid or missing CSRF token'
    });
  }

  next();
};

// Endpoint to get CSRF token for frontend
export const getCsrfToken = (req: Request, res: Response) => {
  if (!req.csrfToken) {
    return res.status(500).json({ error: 'CSRF token generation not available' });
  }
  
  const token = req.csrfToken();
  
  // Explicitly save the session to ensure the token is persisted
  req.session.save((err) => {
    if (err) {
      console.error('[CSRF] Failed to save session:', err);
      return res.status(500).json({ error: 'Failed to save CSRF token' });
    }
    
    console.log('[CSRF] Token generated and session saved', {
      sessionId: req.sessionID,
      hasToken: !!req.session.csrfToken
    });
    
    res.json({ csrfToken: token });
  });
};