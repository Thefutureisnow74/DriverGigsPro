import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;
console.log('Neon WebSocket constructor set to ws DBURL', process.env.DATABASE_URL)
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Ensure video_url column exists (hotfix for schema sync issue)
export async function ensureVideoUrlColumn() {
  try {
    await db.execute(sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS video_url text`);
    console.log('Video URL column ensured in companies table');
  } catch (error) {
    console.log('Video URL column check:', error.message);
  }
}