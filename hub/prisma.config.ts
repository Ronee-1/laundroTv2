import "dotenv/config";
import { defineConfig } from "prisma/config";
import { fileURLToPath } from "url";
import path from "path";

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Seed command using tsx to run TypeScript
const seedCommand = `npx tsx "${path.join(__dirname, "prisma", "seed.ts")}"`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"]!,
  },
  earlyAccess: true,
});

// Export seed command for manual use
export { seedCommand };
