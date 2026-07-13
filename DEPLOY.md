# ============================================
# LaundroT Vercel Deployment Guide
# ============================================

## Prerequisites

1. **Node.js** 18.x or higher
2. **Vercel CLI** (optional, for local deployment)
   ```bash
   npm install -g vercel
   ```
3. **PostgreSQL Database** (Vercel Postgres, Supabase, or Neon)
4. **Git** repository initialized

---

## Database Setup

### Option 1: Vercel Postgres (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing
3. Go to **Storage** tab
4. Create a **Postgres** database
5. Copy the connection string

### Option 2: Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings > Database
3. Use: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

### Option 3: Neon

1. Create project at [neon.tech](https://neon.tech)
2. Get connection string from Dashboard
3. Use the provided connection string

---

## Environment Setup

### 1. Copy Environment Template

```bash
# Root .env
cp .env.example .env.local

# Frontend .env
cp spokes/branch-app/.env.example spokes/branch-app/.env.production
```

### 2. Configure .env.local

```bash
# Database connection
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Authentication (IMPORTANT: Generate a secure secret!)
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d

# CORS (Add your Vercel domain)
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### 3. Generate Secure JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

---

## Vercel Dashboard Deployment

### 1. Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project settings:

   **Framework Preset:** Other
   **Root Directory:** `./` (or leave empty)
   **Build Command:** `npm run build`
   **Output Directory:** `spokes/branch-app/dist`

### 2. Configure Environment Variables

In Vercel Dashboard > Project > Settings > Environment Variables:

| Name | Value | Environments |
|------|-------|--------------|
| `DATABASE_URL` | `postgresql://...` | Production, Preview, Development |
| `JWT_SECRET` | `generated-secret` | Production, Preview, Development |
| `JWT_EXPIRES_IN` | `7d` | Production, Preview, Development |
| `ALLOWED_ORIGINS` | `*.vercel.app,your-domain.com` | Production |
| `NODE_ENV` | `production` | Production |

### 3. Configure Build & Development Settings

- **Build Command:** `npm run build`
- **Output Directory:** `spokes/branch-app/dist`
- **Install Command:** `npm install`
- **Development Command:** Leave empty or use `npm run dev`

---

## CLI Deployment

### 1. Login to Vercel

```bash
vercel login
```

### 2. Deploy Preview

```bash
vercel
```

### 3. Deploy Production

```bash
vercel --prod
```

### 4. Set Environment Variables

```bash
# Set production env vars
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
vercel env add ALLOWED_ORIGINS

# Pull existing env vars
vercel env pull .env.local
```

---

## Database Migration

### Run Prisma Migrations

After deployment, run database migrations:

```bash
# Install Prisma globally if needed
npm install -g prisma

# Generate Prisma Client
npx prisma generate

# Run migrations (use your production DATABASE_URL)
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### Seed Database (Optional)

```bash
# Seed with initial data
DATABASE_URL="your-production-url" npx prisma db seed
```

---

## API Endpoints Reference

After deployment, your API will be available at:

```
https://your-app.vercel.app/api/
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/register` | Register new user (Owner only) |
| GET | `/api/branches` | List all branches |
| GET | `/api/branches/:id` | Get branch details |
| POST | `/api/branches/:id/customer` | Create customer |
| POST | `/api/branches/:id/reconcile` | Create reconciliation |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:id` | Get order details |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET | `/api/couriers/:id/tasks` | Get courier tasks |
| GET | `/api/owner/dashboard` | Owner dashboard data |
| GET | `/api/expenses` | List expenses |
| POST | `/api/expenses` | Create expense |
| GET | `/api/inventory/:id_cabang` | Get inventory status |

---

## Troubleshooting

### CORS Errors

If you get CORS errors, ensure `ALLOWED_ORIGINS` includes your domain:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```

### Database Connection Failed

1. Check `DATABASE_URL` is correct
2. Ensure database allows connections from Vercel IPs
3. For Supabase/Neon, enable SSL: `?sslmode=require`

### JWT Token Invalid

Ensure `JWT_SECRET` is the same in all environments.

### Build Failed

Check that all TypeScript files compile:

```bash
npm run typecheck
npm run typecheck:api
```

---

## Monitoring

### Vercel Analytics

Enable Vercel Analytics in your project dashboard for:
- Web Vitals monitoring
- Real-time visitors
- Performance metrics

### Database Monitoring

For Vercel Postgres:
- Use Vercel Dashboard > Storage > Postgres
- View connection limits and usage

---

## Security Checklist

- [ ] JWT_SECRET is unique and secure
- [ ] DATABASE_URL uses SSL (`?sslmode=require`)
- [ ] CORS is configured for your domains
- [ ] Rate limiting is enabled (default: 100 req/min)
- [ ] Security headers are set (X-Frame-Options, etc.)
