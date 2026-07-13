# ============================================
# Vercel Deployment Checklist
# ============================================

## Pre-Deployment

### 1. Code Preparation

- [x] Convert Express routes to Vercel API handlers
- [x] Create vercel.json configuration
- [x] Add security middleware (rate limiting, headers)
- [x] Create .env.example templates
- [x] Update CORS for production

### 2. Environment Variables

- [ ] Copy `.env.example` to `.env.local`
- [ ] Generate secure JWT_SECRET
- [ ] Configure DATABASE_URL
- [ ] Set ALLOWED_ORIGINS for production

### 3. Database

- [ ] Create Vercel Postgres or use external provider
- [ ] Run Prisma migrations
- [ ] Seed database (optional)

---

## Vercel Dashboard Setup

### 1. Import Project

- [ ] Connect Git repository
- [ ] Select root directory: `./`
- [ ] Set framework: Other

### 2. Configure Build

- [ ] Build Command: `npm run build`
- [ ] Output Directory: `spokes/branch-app/dist`

### 3. Environment Variables

Add in Vercel Dashboard > Settings > Environment Variables:

| Variable | Required | Example |
|----------|----------|---------|
| DATABASE_URL | ✅ | `postgresql://...` |
| JWT_SECRET | ✅ | `openssl rand -base64 32` |
| JWT_EXPIRES_IN | ✅ | `7d` |
| ALLOWED_ORIGINS | ✅ | `https://*.vercel.app` |
| NODE_ENV | ✅ | `production` |

---

## Post-Deployment

### 1. Verify API

```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{"status":"ok","service":"laundrot-api"}
```

### 2. Test Authentication

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@test.com","password":"password"}'
```

### 3. Configure Frontend

Update `spokes/branch-app/.env.production`:
```
VITE_API_URL=https://your-app.vercel.app/api
```

### 4. Rebuild Frontend (if needed)

```bash
cd spokes/branch-app
npm run build
```

---

## Troubleshooting

### Common Issues

1. **CORS Error**: Check ALLOWED_ORIGINS includes your domain
2. **Database Error**: Verify DATABASE_URL is correct with SSL
3. **Build Error**: Run `npm run typecheck` locally first
4. **401 Unauthorized**: Check JWT_SECRET matches environment

### Useful Commands

```bash
# Check TypeScript errors
npm run typecheck:api

# Preview deployment locally
vercel dev

# View logs
vercel logs your-project

# Pull env vars from Vercel
vercel env pull .env.local
```

---

## Support

For issues:
1. Check Vercel Dashboard logs
2. Verify environment variables
3. Test API endpoints directly
4. Review deployment documentation
