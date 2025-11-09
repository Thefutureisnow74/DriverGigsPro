import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  console.warn("REPLIT_DOMAINS not provided - OAuth login will be disabled");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: true, // Changed to save sessions
    rolling: true,
    name: 'drivergigsessionid',
    cookie: {
      httpOnly: true,
      secure: false, // Development mode
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  // Generate username from email or use default
  const email = claims["email"] || '';
  const username = email.split('@')[0] || `user_${claims["sub"]}`;
  const fullName = [claims["first_name"], claims["last_name"]].filter(Boolean).join(' ') || email.split('@')[0] || 'Unknown User';
  
  await storage.upsertUser({
    id: claims["sub"],
    username: username,
    password: 'oauth_user', // OAuth users don't need passwords
    fullName: fullName,
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user: any = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Only setup OAuth strategies if REPLIT_DOMAINS is configured
  if (process.env.REPLIT_DOMAINS) {
    for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
      const strategy = new Strategy(
        {
          name: `replitauth:${domain}`,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
    }
  }

  passport.serializeUser((user: Express.User, cb) => {
    console.log("Serializing user:", user);
    // Handle both OAuth users (with claims) and traditional users (with id)
    const userId = (user as any)?.claims?.sub || (user as any)?.id;
    if (userId) {
      cb(null, { id: userId, type: (user as any)?.claims ? 'oauth' : 'traditional' });
    } else {
      cb(new Error("No user ID found for serialization"));
    }
  });
  
  passport.deserializeUser(async (serializedUser: any, cb) => {
    try {
      console.log("Deserializing user:", serializedUser);
      
      // CRITICAL SECURITY FIX: Always return consistent user object with role/status for RBAC
      const userId = serializedUser?.id || serializedUser;
      const user = await storage.getUser(userId);
      
      if (user) {
        // Ensure all users have proper RBAC fields regardless of auth method
        const consistentUser = {
          ...user,
          // Preserve OAuth metadata if present
          ...(serializedUser?.type === 'oauth' && {
            oauthMetadata: {
              claims: { sub: userId },
              type: 'oauth'
            }
          })
        };
        cb(null, consistentUser);
      } else {
        cb(null, false);
      }
    } catch (error) {
      console.error("Error deserializing user:", error);
      cb(null, false);
    }
  });

  app.get("/api/login", (req, res, next) => {
    // Check if OAuth is available for this domain
    const supportedDomains = process.env.REPLIT_DOMAINS?.split(",") || [];
    if (!supportedDomains.includes(req.hostname)) {
      return res.status(400).json({ 
        error: "OAuth login not available for this domain. Please use traditional login." 
      });
    }
    
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    // Check if OAuth is available for this domain
    const supportedDomains = process.env.REPLIT_DOMAINS?.split(",") || [];
    if (!supportedDomains.includes(req.hostname)) {
      return res.redirect("/login?error=oauth_not_supported");
    }
    
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    const user = req.user as any;
    console.log("Logout requested for user:", user?.claims?.sub || 'unknown');
    req.logout(() => {
      // Clear the session completely
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        // Clear all session cookies
        res.clearCookie('connect.sid');
        res.clearCookie('gig-work-session');
        
        // Redirect to Replit's logout endpoint
        res.redirect(
          client.buildEndSessionUrl(config, {
            client_id: process.env.REPL_ID!,
            post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
          }).href
        );
      });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Handle OAuth authentication (has claims and expires_at)
  if (user.claims && user.expires_at) {
    const now = Math.floor(Date.now() / 1000);
    if (now <= user.expires_at) {
      return next();
    }
    
    // Try to refresh the token if expired
    const refreshToken = user.refresh_token;
    if (!refreshToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const config = await getOidcConfig();
      const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
      updateUserSession(user, tokenResponse);
      return next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
  }

  // Handle traditional authentication (direct user object)
  if (user.id && user.username) {
    return next();
  }

  // If we get here, authentication failed
  return res.status(401).json({ message: "Unauthorized" });
};