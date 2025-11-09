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
  private static readonly SECRET_KEY = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');

  // Generate a CSRF token
  static generateToken(): string {
    return crypto.randomBytes(this.TOKEN_LENGTH).toString('hex');
  }

  // Create HMAC signature for token validation
  static createSignature(token: string, sessionId: string): string {
    const hmac = crypto.createHmac('sha256', this.SECRET_KEY);
    hmac.update(token + sessionId);
    return hmac.digest('hex');
  }

  // Validate CSRF token
  static validateToken(token: string, signature: string, sessionId: string): boolean {
    if (!token || !signature || !sessionId) {
      return false;
    }

    const expectedSignature = this.createSignature(token, sessionId);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

// Middleware to add CSRF token to request
export const csrfTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add csrf token generator to request
  req.csrfToken = () => {
    const token = CSRFProtection.generateToken();
    const sessionId = req.sessionID || req.session?.id || 'anonymous';
    const signature = CSRFProtection.createSignature(token, sessionId);
    
    // Store in session for validation
    if (req.session) {
      req.session.csrfToken = token;
      req.session.csrfSignature = signature;
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

  // Skip CSRF for file upload endpoints (they use authentication + multipart form data)
  if (req.path === '/api/user/profile-photo' || req.path === '/api/documents') {
    return next();
  }

  const token = req.body._csrf || req.headers['x-csrf-token'] || req.headers['csrf-token'];
  const sessionId = req.sessionID || req.session?.id || 'anonymous';
  const storedSignature = req.session?.csrfSignature;

  if (!CSRFProtection.validateToken(token, storedSignature, sessionId)) {
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
  res.json({ csrfToken: token });
};