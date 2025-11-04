# TaxFlow - Quick Database Setup

Your `.env.local` is already updated with your new Supabase credentials!

## Step 1: Apply Database Schema (2 minutes)

1. **Open Supabase Dashboard**: https://supabase.com/dashboard/project/pzroidinbwneyzwkevaa

2. **Go to SQL Editor**:
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New Query"**

3. **Copy the Migration**:
   - Open the file: `supabase/migrations/001_init.sql` (in this project)
   - Select ALL content (Cmd/Ctrl+A)
   - Copy it (Cmd/Ctrl+C)

4. **Run the Migration**:
   - Paste into the Supabase SQL Editor
   - Click **"Run"** (or press Cmd/Ctrl+Enter)
   - You should see "Success. No rows returned" ✅

## Step 2: Create Storage Bucket (1 minute)

1. **Go to Storage**:
   - Click **"Storage"** in the left sidebar
   - Click **"New bucket"**

2. **Configure Bucket**:
   - **Name**: `docs`
   - **Public**: OFF (keep it private)
   - Click **"Create bucket"**

## Step 3: Configure Authentication (1 minute)

1. **Enable Email Auth**:
   - Go to **Authentication** > **Providers**
   - Find **Email** provider
   - Toggle it **ON**
   - **Confirm email**: Toggle **OFF** (for easier testing)
   - Click **"Save"**

2. **Add Redirect URLs**:
   - Go to **Authentication** > **URL Configuration**
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: Add these (one per line):
     ```
     http://localhost:3000
     http://localhost:3000/auth/callback
     ```
   - Click **"Save"**

## Step 4: Test Locally (2 minutes)

```bash
# Install dependencies (if you haven't)
npm install

# Start the dev server
npm run dev
```

Open http://localhost:3000 - you should see the TaxFlow landing page!

Try:
1. Click "Sign In"
2. Enter your email
3. Check your email for the magic link
4. Click the link - you should be logged in!

---

## Step 5: Deploy to Vercel

Once local testing works, let me know and I'll help you deploy to Vercel and get you a shareable link!

You'll need:
- Your GitHub account connected to Vercel
- Any API keys you want to use (OpenAI, Stripe, Resend - all optional for initial deployment)

---

## Troubleshooting

### "Error connecting to database"
- Double-check the Supabase URL in `.env.local`
- Make sure you ran the migration SQL

### "Email not sending"
- Check your email spam folder
- Verify Email provider is enabled in Supabase

### "Can't sign in"
- Make sure redirect URLs are set in Supabase (step 3.2 above)
- Check browser console for errors

---

**Ready to deploy?** Let me know when local testing works and we'll get this on Vercel!

