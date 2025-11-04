# TaxFlow - Complete Setup Guide

This guide will walk you through setting up TaxFlow from scratch with a new Supabase project.

## Prerequisites
- Node.js 18+ installed
- npm or pnpm installed  
- A Supabase account (free tier is fine)
- A Vercel account (free tier is fine)
- Stripe account (optional for MVP, required for billing)
- OpenAI API key
- Resend account for emails

---

## Step 1: Create a New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Project name**: TaxFlow (or your preferred name)
   - **Database password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

### Get Your Supabase Credentials

Once provisioned:
1. Go to **Settings** (gear icon) > **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

---

## Step 2: Set Up the Database Schema

### Option A: Using SQL Editor (Recommended)

1. In Supabase Dashboard, click **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Open `supabase/migrations/001_init.sql` from this project
4. Copy the entire contents
5. Paste into the Supabase SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" - that's good!

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
supabase db push
```

---

## Step 3: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Name it: `docs`
4. Make it **Private** (not public)
5. Click **"Create bucket"**

The RLS policies are already set up by the migration!

---

## Step 4: Configure Authentication

1. Go to **Authentication** > **Providers** in Supabase Dashboard
2. Enable **Email** provider:
   - Click on Email
   - Toggle "Enable Email provider" to ON
   - Toggle "Confirm email" based on your preference (OFF for easier testing)
   - Click "Save"

3. **(Optional)** Enable **Google OAuth**:
   - Follow guide: https://supabase.com/docs/guides/auth/social-login/auth-google
   - You'll need to create OAuth credentials in Google Cloud Console
   - Add credentials to Supabase

4. Update **URL Configuration**:
   - Go to **Authentication** > **URL Configuration**
   - Add Site URL: `http://localhost:3000` (for development)
   - Add Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://YOUR_DOMAIN.vercel.app` (add after deploying)
     - `https://YOUR_DOMAIN.vercel.app/auth/callback` (add after deploying)

---

## Step 5: Set Up Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. Add your OpenAI API key:
```bash
OPENAI_API_KEY=sk-proj-xxxxx
```

4. Add Resend for emails:
```bash
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev  # or your verified domain
```

5. **(Optional but recommended)** Add Stripe:
```bash
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Get this after creating webhook
STRIPE_BASIC_PRICE_ID=price_xxxxx  # Create in Stripe Dashboard
STRIPE_PRO_PRICE_ID=price_xxxxx    # Create in Stripe Dashboard
```

6. Generate a cron secret (for Vercel cron jobs):
```bash
CRON_SECRET=$(openssl rand -base64 32)
echo "CRON_SECRET=$CRON_SECRET" >> .env.local
```

---

## Step 6: Install Dependencies & Run Locally

```bash
# Install all dependencies
npm install

# Run the development server
npm run dev
```

Open http://localhost:3000 - you should see the TaxFlow landing page!

### Test the App Locally

1. Click "Sign In" and try the email magic link auth
2. Check your email for the magic link
3. Click the link - you should be redirected to the dashboard
4. Try uploading a PDF document (any PDF will work for testing)
5. The document should appear in your documents list

---

## Step 7: Deploy to Vercel

### A. Connect Your Repo

1. Push this code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - TaxFlow MVP"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to https://vercel.com
3. Click "Add New" > "Project"
4. Import your GitHub repository

### B. Configure Build Settings

Vercel should auto-detect Next.js. Confirm:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next` (auto-detected)

### C. Add Environment Variables

Click "Environment Variables" and add ALL variables from your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_BASIC_PRICE_ID=...
STRIPE_PRO_PRICE_ID=...
OPENAI_API_KEY=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
CRON_SECRET=...
MCP_GMAIL_ENABLED=false
MCP_DRIVE_ENABLED=false
```

**Important**: Add these to **ALL** environments (Production, Preview, Development)

### D. Deploy!

1. Click "Deploy"
2. Wait ~2-3 minutes for the build
3. Once deployed, you'll get a URL like: `https://taxflow-xxxxx.vercel.app`

---

## Step 8: Post-Deployment Configuration

### Update Supabase Auth URLs

1. Go back to Supabase Dashboard
2. **Authentication** > **URL Configuration**
3. Add your Vercel URLs:
   - Site URL: `https://YOUR_APP.vercel.app`
   - Redirect URLs:
     - `https://YOUR_APP.vercel.app`
     - `https://YOUR_APP.vercel.app/auth/callback`

### Configure Stripe Webhook (If Using Stripe)

1. Go to Stripe Dashboard > **Developers** > **Webhooks**
2. Click "Add endpoint"
3. Endpoint URL: `https://YOUR_APP.vercel.app/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Update in Vercel: **Settings** > **Environment Variables** > Edit `STRIPE_WEBHOOK_SECRET`
8. Redeploy from Vercel Dashboard (Deployments > ... > Redeploy)

### Test the Cron Job

The weekly nudge email runs every Monday at 9 AM UTC. To test immediately:

```bash
curl -X POST https://YOUR_APP.vercel.app/api/cron/weekly-nudges \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Step 9: Share with Friends! 🎉

Your TaxFlow MVP is now live at: **https://YOUR_APP.vercel.app**

### Quick Test Checklist

- [ ] Visit the deployed URL
- [ ] Sign up with a new email
- [ ] Receive and click the magic link
- [ ] Upload a test PDF document
- [ ] Verify it appears in the dashboard
- [ ] Try the checklist generation
- [ ] Test export functionality
- [ ] Try Stripe checkout (use test card: `4242 4242 4242 4242`)

---

## Troubleshooting

### Build Fails on Vercel
- Check the build logs in Vercel dashboard
- Most common: Missing environment variables or TypeScript errors
- The `next.config.ts` has TypeScript errors temporarily ignored

### Authentication Not Working
- Verify Supabase redirect URLs include your Vercel domain
- Check that email confirmation is disabled in Supabase (Auth > Providers > Email)
- Look at Supabase Auth logs

### Stripe Webhook Failing
- Ensure webhook URL is correct: `https://your-domain.vercel.app/api/stripe/webhook`
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly in Vercel
- Check Stripe webhook logs for detailed error messages

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check that `RESEND_FROM_EMAIL` is verified (or use `onboarding@resend.dev` for testing)
- Look at Resend dashboard for delivery logs

### Document Upload Fails
- Check Supabase Storage bucket exists and is named `docs`
- Verify storage policies are set up (from migration)
- Look at browser console for errors
- Check Supabase logs

---

## Next Steps

Once everything is working:

1. **Add Demo Data**: Run the seed script `supabase/seed/001_demo.sql` to add sample data
2. **Customize Branding**: Update colors, logo, and copy in the app
3. **Configure MCP Integrations**: Set up Gmail and Google Drive MCP servers
4. **Monitor Usage**: Set up Vercel Analytics and Supabase monitoring
5. **Iterate**: Get feedback from your friends and improve!

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Resend Docs**: https://resend.com/docs

Need more help? Check `DEPLOYMENT_CHECKLIST.md` for a detailed step-by-step checklist.

