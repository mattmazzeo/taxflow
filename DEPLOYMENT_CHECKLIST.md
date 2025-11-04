# TaxFlow Deployment Checklist

Follow these steps to get TaxFlow live on Vercel and ready to share with friends!

## ✅ Pre-Deployment Checklist

### 1. Supabase Project Setup
- [ ] Created new Supabase project at https://supabase.com/dashboard
- [ ] Saved project URL (looks like: `https://xxxxx.supabase.co`)
- [ ] Saved anon key (from Settings > API)
- [ ] Saved service role key (from Settings > API - keep this secret!)
- [ ] Applied database schema (`supabase/migrations/001_init.sql` via SQL Editor)
- [ ] Created `docs` storage bucket (Storage > New Bucket > Private)
- [ ] Enabled Email auth provider (Authentication > Providers)
- [ ] Optionally enabled Google OAuth (Authentication > Providers > Google)

### 2. Stripe Setup
- [ ] Created Stripe account at https://stripe.com
- [ ] Got Stripe Secret Key (Developers > API Keys)
- [ ] Got Stripe Webhook Secret:
  - Go to Developers > Webhooks
  - Add endpoint: `https://YOUR_VERCEL_URL/api/stripe/webhook`
  - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Copy webhook signing secret
- [ ] Created two products with prices in Stripe:
  - **Basic Plan**: $9/month (or your preferred price)
  - **Pro Plan**: $29/month (or your preferred price)
  - Saved the Price IDs (starts with `price_`)

### 3. Other Services
- [ ] Created Resend account at https://resend.com
- [ ] Got Resend API key (API Keys)
- [ ] Verified sending domain (or use sandbox for testing)
- [ ] Created OpenAI account at https://platform.openai.com
- [ ] Got OpenAI API key (with GPT-4 access)

### 4. Update Environment Variables
- [ ] Updated `.env.local` with all credentials
- [ ] Tested locally with `npm run dev`
- [ ] Confirmed login works locally
- [ ] Confirmed file upload works locally

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Install Command**: `npm install` (default)

### 3. Add Environment Variables in Vercel
Go to Project Settings > Environment Variables and add:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>

# Stripe
STRIPE_SECRET_KEY=<your_stripe_secret_key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
STRIPE_BASIC_PRICE_ID=<your_basic_price_id>
STRIPE_PRO_PRICE_ID=<your_pro_price_id>

# OpenAI
OPENAI_API_KEY=<your_openai_api_key>

# Resend
RESEND_API_KEY=<your_resend_api_key>
RESEND_FROM_EMAIL=<your_verified_email>

# Vercel Cron Secret (generate a random string)
CRON_SECRET=<random_secret_for_cron_security>

# MCP (optional - can leave blank for MVP)
MCP_GMAIL_ENABLED=false
MCP_DRIVE_ENABLED=false
```

**Make sure to add these to ALL environments** (Production, Preview, Development)

### 4. Deploy!
Click "Deploy" and wait for the build to complete (~2-3 minutes)

### 5. Post-Deployment Configuration

#### Update Supabase Auth URLs
1. Go to your Supabase Dashboard
2. Navigate to Authentication > URL Configuration
3. Add your Vercel URL to allowed redirect URLs:
   - `https://YOUR_APP.vercel.app`
   - `https://YOUR_APP.vercel.app/auth/callback`

#### Update Stripe Webhook URL
1. Go to Stripe Dashboard > Developers > Webhooks
2. Update the endpoint URL to: `https://YOUR_APP.vercel.app/api/stripe/webhook`
3. Regenerate webhook secret if needed
4. Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

#### Test the Cron Job
The weekly nudge cron job is configured to run every Monday at 9 AM UTC.
To test it immediately:
```bash
curl -X POST https://YOUR_APP.vercel.app/api/cron/weekly-nudges \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🎉 Final Testing

### Test Core Features
- [ ] Visit your deployed URL
- [ ] Sign up with email (magic link)
- [ ] Create/verify user profile is created
- [ ] Upload a test PDF document
- [ ] Verify document appears in dashboard
- [ ] Test AI parsing (may need actual tax document)
- [ ] Generate checklist
- [ ] Test Stripe checkout (use test card: 4242 4242 4242 4242)
- [ ] Verify subscription updates in dashboard
- [ ] Test export functionality

### Share with Friends!
Your TaxFlow MVP is now live at:
**https://YOUR_APP.vercel.app**

## 📊 Monitoring & Maintenance

### Check Logs
- **Vercel Logs**: Vercel Dashboard > Your Project > Logs
- **Supabase Logs**: Supabase Dashboard > Logs
- **Stripe Events**: Stripe Dashboard > Developers > Events

### Monitor Costs
- **Supabase**: Free tier includes 500MB database, 1GB storage, 50k monthly active users
- **Vercel**: Free tier includes 100GB bandwidth, unlimited deployments
- **Stripe**: No monthly fee, just transaction fees
- **OpenAI**: Pay per token (GPT-4o is ~$2.50 per million input tokens)
- **Resend**: Free tier includes 100 emails/day

### Common Issues
1. **Build failing**: Check Vercel logs, usually TypeScript or env var issues
2. **Auth not working**: Verify Supabase redirect URLs match your domain
3. **Stripe webhook failing**: Ensure webhook secret is correct and endpoint is accessible
4. **Cron not running**: Check Vercel cron logs and CRON_SECRET

## 🔄 Making Updates
```bash
# Make changes locally
npm run dev

# Test thoroughly
# Commit and push
git add .
git commit -m "Your update description"
git push origin main

# Vercel will automatically redeploy!
```

---

**Need help?** Check the main README.md for detailed documentation on each feature.

