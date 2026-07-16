import * as dotenv from 'dotenv';
import { defineConfig } from "prisma/config";
import { fileURLToPath } from "url";
import path from "path";

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env file from hub directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Seed command using tsx to run TypeScript
const seedCommand = `npx tsx "${path.join(__dirname, "prisma", "seed.ts")}"`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use env var or fallback to default connection string
    url: process.env["DATABASE_URL"] || "postgresql://postgres:postgres@127.0.0.1:51582/laundrot",
  },
  earlyAccess: true,
});

// Export seed command for manual use
export { seedCommand };
