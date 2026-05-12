# Deployment Guide

## Prerequisites

- Vercel account (connected to GitHub)
- Supabase project (production-ready)
- GitHub repository with the app code

## Environment Variables

### Vercel Dashboard (set these)

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `NEXT_PUBLIC_APP_URL` | Production domain | Yes |

### Supabase Dashboard (set these)

| Variable | Value | Required |
|----------|-------|----------|
| `ANTHROPIC_API_KEY` | Claude API key (sk-xxx) | Yes (for AI chat) |

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import the GitHub repository
3. Configure project settings:
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2. Set Environment Variables

In Vercel project settings:
1. Go to Settings → Environment Variables
2. Add each variable from the table above
3. Set scope to "Production" (or all environments)

### 3. Configure Supabase

1. Go to Supabase Dashboard → Settings → API
2. Add Vercel domain to allowed CORS origins:
   - `https://so-tay-tieu-duong.vercel.app`
   - Your production domain when registered
3. Go to Authentication → Settings
4. Ensure email confirmation is enabled (required)
5. Add redirect URLs for production domain

### 4. Set Claude API Key (Supabase)

1. Go to Supabase Dashboard → Edge Functions → Secrets
2. Add secret: `ANTHROPIC_API_KEY` with your Claude API key
3. This is required for AI chat to work

### 5. Deploy

**Preview Deployment:**
- Create a pull request
- Vercel automatically deploys to preview URL

**Production Deployment:**
- Merge PR to main branch
- Vercel automatically deploys to production

## Post-Deployment Verification

- [ ] Login/Register works
- [ ] Protected routes redirect properly
- [ ] AI chat sends messages
- [ ] All 4 navigation screens render
- [ ] No console errors

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find the working deployment
3. Click "..." → "Promote to Production"

### Database Rollback

1. Always backup before migration:
   ```bash
   supabase db dump > backup.sql
   ```
2. Restore from backup if needed:
   ```bash
   psql -h your-host -U postgres -d your-db -f backup.sql
   ```

## Troubleshooting

### Build Failures

- Check TypeScript errors: `npm run typecheck`
- Verify environment variables are set

### AI Chat Not Working

- Verify `ANTHROPIC_API_KEY` is set in Supabase dashboard
- Check Supabase Edge Functions logs

### Database Connection Issues

- Verify Supabase project is not paused
- Check allowed CORS origins