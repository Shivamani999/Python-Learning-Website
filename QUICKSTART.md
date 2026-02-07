# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Set Up Supabase

### Create Project
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Wait 2 minutes

### Run SQL
1. Go to SQL Editor in Supabase
2. Copy all content from `supabase-setup.sql`
3. Paste and run

### Get API Keys
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - anon public key

## 3. Configure Environment

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## 4. Add Your Content

Put your markdown files in `public/content/`:
- `day-1.md` ✅ (already done)
- `day-2.md` through `day-30.md` (add yours)

## 5. Run

```bash
npm run dev
```

Visit http://localhost:3000

## 6. Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add same env vars
4. Deploy

Done! 🎉

---

**Need help?** Read the full README.md
