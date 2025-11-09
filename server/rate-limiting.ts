import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { Request, Response } from 'express';

// PRODUCTION FIX: Remove custom IP key generator to use express-rate-limit's default
// This prevents IPv6 bypass attacks by using the library's built-in IP handling

// Custom key generators for specific rate limiting scenarios
const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: { error: options.message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: options.keyGenerator, // Use default IP handling if no custom key
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    skipFailedRequests: options.skipFailedRequests || false,
    handler: (req: Request, res: Response) => {
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      console.log(`Rate limit exceeded for ${clientIp} on ${req.path}`);
      res.status(429).json({
        error: options.message,
        retryAfter: Math.round(options.windowMs / 1000)
      });
    }
  });
};

// ENHANCED LOGIN THROTTLING - Layered protection against credential stuffing
// Layer 1: Per-IP login attempts (broader protection)
export const loginRateLimitIP = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  message: 'Too many login attempts from this IP. Please try again in 15 minutes.',
  skipSuccessfulRequests: true
});

// Layer 2: Per-username login attempts (global protection)
export const loginRateLimitUsername = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // 8 attempts per username globally per window
  message: 'Too many login attempts for this account. Please try again in 15 minutes.',
  keyGenerator: (req: Request) => `login-user:${req.body?.username || req.body?.email || 'unknown'}`,
  skipSuccessfulRequests: true
});

// Layer 3: Per-IP-per-username (most restrictive)
export const loginRateLimitIPUser = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP per username per window
  message: 'Too many login attempts for this account from your IP. Please try again in 15 minutes.',
  keyGenerator: undefined, // Use default IP handling to avoid IPv6 issues
  skipSuccessfulRequests: true
});

// Legacy single limiter for backwards compatibility
export const loginRateLimit = loginRateLimitIPUser;

export const passwordChangeRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 3, // 3 password changes per window
  message: 'Too many password change attempts. Please wait 15 minutes before trying again.',
  keyGenerator: (req: Request) => `password-change:${ipKeyGenerator(req)}:${(req as any).user?.id || 'anonymous'}`
});

export const passwordResetRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 reset requests per hour
  message: 'Too many password reset requests. Please wait 1 hour before requesting another reset.',
  keyGenerator: (req: Request) => `password-reset:${ipKeyGenerator(req)}:${req.body?.email || 'unknown'}`
});

// Session management rate limiters
export const sessionRevokeRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 session operations per window
  message: 'Too many session management requests. Please wait 5 minutes.',
  keyGenerator: (req: Request) => `session:${ipKeyGenerator(req)}:${(req as any).user?.id || 'anonymous'}`
});

// Account creation rate limiters
export const accountCreationRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 account creations per hour per IP
  message: 'Too many account creation attempts. Please wait 1 hour before creating another account.',
  keyGenerator: (req: Request) => `account-creation:${ipKeyGenerator(req)}`
});

// API abuse prevention
export const generalApiRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window for general API calls (increased for normal usage)
  message: 'Too many API requests. Please slow down and try again later.'
});

// Sensitive operations rate limiter
export const sensitiveOperationsRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 sensitive operations per window
  message: 'Too many sensitive operations. Please wait 10 minutes.',
  keyGenerator: (req: Request) => `sensitive:${ipKeyGenerator(req)}:${(req as any).user?.id || 'anonymous'}`
});

// CSRF token generation rate limiter
export const csrfTokenRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 CSRF token requests per window
  message: 'Too many CSRF token requests. Please wait 5 minutes.',
  keyGenerator: (req: Request) => `csrf:${ipKeyGenerator(req)}`
});

// User profile operations rate limiter
export const profileOperationsRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // 15 profile updates per window
  message: 'Too many profile operations. Please wait 5 minutes.',
  keyGenerator: (req: Request) => `profile:${ipKeyGenerator(req)}:${(req as any).user?.id || 'anonymous'}`
});

// File upload rate limiter
export const fileUploadRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 file uploads per window
  message: 'Too many file uploads. Please wait 10 minutes.',
  keyGenerator: (req: Request) => `upload:${ipKeyGenerator(req)}:${(req as any).user?.id || 'anonymous'}`
});

// Company management rate limiter
export const companyOperationsRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 company operations per window
  message: 'Too many company operations. Please wait 15 minutes.',
  keyGenerator: (req: Request) => `company:${ipKeyGenerator(req)}:${(req as any).user?.id || 'anonymous'}`
});

// Rate limiter configuration object for easy application
export const rateLimiters = {
  // Layered login protection (use all three for maximum security)
  loginIP: loginRateLimitIP,
  loginUsername: loginRateLimitUsername,
  loginIPUser: loginRateLimitIPUser,
  login: loginRateLimit, // Backwards compatibility
  
  passwordChange: passwordChangeRateLimit,
  passwordReset: passwordResetRateLimit,
  sessionManagement: sessionRevokeRateLimit,
  accountCreation: accountCreationRateLimit,
  generalApi: generalApiRateLimit,
  sensitiveOperations: sensitiveOperationsRateLimit,
  csrfToken: csrfTokenRateLimit,
  profileOperations: profileOperationsRateLimit,
  fileUpload: fileUploadRateLimit,
  companyOperations: companyOperationsRateLimit
};

// Audit logging for rate limit violations
export const logRateLimitViolation = (req: Request, limitType: string) => {
  const userId = (req as any).user?.id || 'anonymous';
  const userAgent = req.get('User-Agent') || 'unknown';
  const timestamp = new Date().toISOString();
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  
  console.log(`[RATE_LIMIT_VIOLATION] ${timestamp} - Type: ${limitType}, IP: ${clientIp}, User: ${userId}, UserAgent: ${userAgent}, Path: ${req.path}`);
  
  // Note: Could also persist to audit logs table here for compliance
};

// Helper to apply multiple rate limiters to a route (for layered protection)
export const applyMultipleRateLimiters = (...limiters: any[]) => {
  return (req: Request, res: Response, next: Function) => {
    let currentIndex = 0;
    
    const applyNext = () => {
      if (currentIndex >= limiters.length) {
        return next();
      }
      
      const limiter = limiters[currentIndex++];
      limiter(req, res, applyNext);
    };
    
    applyNext();
  };
};