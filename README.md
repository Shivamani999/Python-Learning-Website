# 30 Days of Python - Learning Platform

## Quick Setup

### 1. Install
```bash
npm install
```

### 2. Supabase Setup
1. Go to https://supabase.com and create project
2. Run `supabase-setup.sql` in SQL Editor
3. Get API keys from Settings → API

### 3. Environment
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 4. Test Build
```bash
npm run build
```
If this succeeds, deployment will work.

### 5. Run Locally
```bash
npm run dev
```

### 6. Deploy to Vercel
1. Push to GitHub
2. Import in Vercel
3. Add same environment variables
4. Deploy

## Add Your Content
Place markdown files in `public/content/`:
- day-1.md (already there)
- day-2.md through day-30.md

## Troubleshooting

**Build fails:**
Run `npm run build` locally first to see the real error.

**Database errors:**
Make sure SQL script ran completely in Supabase.

**Env vars not working:**
Must be EXACTLY: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
