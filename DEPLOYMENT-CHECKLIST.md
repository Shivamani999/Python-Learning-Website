# Deployment Checklist

## Before Deployment

### Content
- [ ] All 30 markdown files added to `public/content/`
- [ ] Image references removed from markdown
- [ ] Content reviewed and formatted correctly

### Supabase
- [ ] Account created
- [ ] Project created
- [ ] SQL script executed successfully
- [ ] Tables visible in Table Editor
- [ ] RLS policies enabled

### Environment Variables
- [ ] `.env.local` created
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set correctly
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set correctly
- [ ] Local site runs without errors

### Testing
- [ ] Can sign up new account
- [ ] Can log in
- [ ] Dashboard shows correctly
- [ ] Can navigate to Day 1
- [ ] Can mark day as complete
- [ ] Streak updates correctly
- [ ] Can log out

## Deployment to Vercel

### GitHub
- [ ] Repository created
- [ ] Code pushed to main branch
- [ ] `.env.local` NOT committed (check .gitignore)

### Vercel
- [ ] Account created with GitHub
- [ ] Project imported
- [ ] Environment variables added:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Build successful
- [ ] Site accessible

### Post-Deployment
- [ ] Test sign up on live site
- [ ] Test login on live site
- [ ] Test completing a day
- [ ] Test streak functionality
- [ ] Test on mobile device

## Common Issues

### Build fails
- Check that all imports are correct
- Verify TypeScript errors in terminal
- Check package.json dependencies

### Database errors
- Verify Supabase URL is correct
- Check that SQL script ran completely
- Verify RLS policies are enabled

### Env vars not working
- Must start with `NEXT_PUBLIC_` for client-side
- Restart dev server after changes
- In Vercel, redeploy after adding vars

## Success Criteria

✅ Users can sign up
✅ Users can log in
✅ Dashboard shows progress
✅ Days can be marked complete
✅ Streak counts correctly
✅ Works on mobile
✅ No console errors

---

**Ready to deploy?** Follow QUICKSTART.md step by step.
