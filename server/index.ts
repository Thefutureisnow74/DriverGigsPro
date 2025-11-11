import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { csrfTokenMiddleware, csrfValidationMiddleware } from "./csrf";
import { sessionRevocationMiddleware } from "./session-revocation";

const app = express();

// PRODUCTION FIX: Trust proxy for accurate IP resolution behind proxies/CDNs
// Critical for rate limiting to work correctly in production
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // CRITICAL: Setup authentication and sessions FIRST
  const { setupAuth } = await import("./replitAuth");
  await setupAuth(app);
  
  // Import storage and add session revocation middleware
  const { storage } = await import("./storage");
  app.use(sessionRevocationMiddleware(storage));
  
  // Add CSRF protection middleware AFTER session is set up
  app.use(csrfTokenMiddleware);
  app.use(csrfValidationMiddleware);
  
  // Ensure video_url column exists
  const { ensureVideoUrlColumn } = await import("./db");
  await ensureVideoUrlColumn();
  
  const server = await registerRoutes(app);

  // Add API-specific error handler BEFORE the catch-all
  app.use('/api/*', (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Add 404 handler for API routes to return JSON instead of HTML
  app.use('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ message: "API endpoint not found" });
  });

  // General error handler for non-API routes
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // WORKAROUND: Ensure API routes bypass Vite middleware by adding API-specific middleware BEFORE Vite
    app.use('/api/*', (req, res, next) => {
      // This middleware runs before Vite and ensures API requests skip Vite processing
      next();
    });
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
