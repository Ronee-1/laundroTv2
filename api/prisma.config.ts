import "dotenv/config";
import { defineConfig } from "prisma/config";
import { fileURLToPath } from "url";
import path from "path";

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  schema: "../prisma/schema.prisma",
  migrations: {
    path: "../prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] || "postgresql://postgres:postgres@localhost:51582/laundrot",
  },
  earlyAccess: true,
});
