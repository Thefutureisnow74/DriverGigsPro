import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {
      id: number;
      role: string;
      status: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  // Handle properly hashed passwords
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    console.error("Invalid password format:", stored);
    return false;
  }
  
  try {
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

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
    secret: process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex'),
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    name: 'gig-work-session',
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  });
}

export function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      async (username, password, done) => {
        try {
          const user = await storage.getUserByUsername(username);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false, { message: 'Invalid username or password' });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number | string, done) => {
    try {
      // Handle cases where id might be the old OAuth structure
      if (typeof id === 'object' || (typeof id === 'string' && id.includes('{'))) {
        console.log("Clearing invalid session with complex ID:", id);
        return done(null, false);
      }
      
      // Convert string to number if needed
      const userId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (isNaN(userId)) {
        console.log("Invalid user ID:", id);
        return done(null, false);
      }
      
      const user = await storage.getUser(userId);
      done(null, user);
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(null, false); // Don't throw error, just fail authentication
    }
  });

  // Register endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      let { username, password, fullName, email } = req.body;
      
      if (!username || !password || !fullName || !email) {
        return res.status(400).json({ message: "Username, password, full name, and email are required" });
      }

      // Normalize username and email (lowercase, trim)
      username = username.trim().toLowerCase();
      email = email.trim().toLowerCase();

      // Validate username format
      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ message: "Username must be between 3-20 characters" });
      }

      const usernameRegex = /^[a-z0-9._-]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "Username can only contain letters, numbers, dots, dashes, and underscores" });
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }

      // Create new user with hashed password
      const hashedPassword = await hashPassword(password);
      
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        fullName,
        email,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          isAdmin: user.isAdmin
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Traditional login endpoint  
  app.post("/api/auth/traditional-login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Login error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login error" });
        }
        res.json({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          isAdmin: user.isAdmin
        });
      });
    })(req, res, next);
  });

  // Traditional registration endpoint (consistent with frontend)
  app.post("/api/auth/traditional-signup", async (req, res, next) => {
    try {
      // Safely extract fields with fallbacks
      const body = req.body || {};
      let { username, password, fullName, email } = body;
      
      // Alternative field names for compatibility
      username = username || body.user || '';
      fullName = fullName || body.full_name || body.name || '';
      email = email || '';
      password = password || '';
      
      if (!username || !password || !fullName || !email) {
        return res.status(400).json({ message: "Username, password, full name, and email are required" });
      }

      // Normalize username and email (lowercase, trim)
      username = username.trim().toLowerCase();
      email = email.trim().toLowerCase();

      // Validate username format
      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ message: "Username must be between 3-20 characters" });
      }

      const usernameRegex = /^[a-z0-9._-]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "Username can only contain letters, numbers, dots, dashes, and underscores" });
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }

      // Create new user with hashed password
      const hashedPassword = await hashPassword(password);
      
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        fullName,
        email,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          isAdmin: user.isAdmin
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ message: "Logout error" });
        }
        res.clearCookie('connect.sid');
        res.clearCookie('gig-work-session');
        res.json({ message: "Logged out successfully" });
      });
    });
  });
}

// Authentication middleware
export const isAuthenticated = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

