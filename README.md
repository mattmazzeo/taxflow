# TaxFlow MVP

An AI-powered tax document management system that helps users organize W-2s, 1099s, K-1s, receipts, and other tax documents. Features include intelligent document parsing with OpenAI, smart checklists, automated email reminders, and seamless CPA export.

Built with **Next.js 15**, **Supabase**, **Stripe**, **OpenAI GPT-4o**, and **Vercel**.

## Features

- 📤 **Smart Upload**: Drag-and-drop PDFs or connect Gmail/Drive to automatically find tax documents
- 🧠 **AI Extraction**: Automatically detect document types (W-2, 1099, K-1, etc.) and extract key fields
- ✅ **Personalized Checklists**: Generate forward-looking checklists based on last year's documents
- 📧 **Email Nudges**: Weekly reminders during tax season (January-April) for missing documents
- 💾 **One-Click Export**: Export everything as a ZIP with CSVs and originals for your CPA
- 🔒 **Secure**: Bank-level encryption with Supabase, Row Level Security (RLS) for data protection

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript, React Server Components)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth (Magic Link + Google OAuth)
- **AI**: OpenAI GPT-4o for document parsing and entity extraction
- **Storage**: Supabase Storage for document files
- **Payments**: Stripe (subscriptions with Free/Basic/Pro tiers)
- **Email**: Resend for transactional emails and nudges
- **Deploy**: Vercel with cron jobs for weekly nudges
- **UI**: shadcn/ui + Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Stripe account ([stripe.com](https://stripe.com))
- OpenAI API key ([platform.openai.com](https://platform.openai.com))
- Resend account for emails ([resend.com](https://resend.com))
- Vercel account for deployment ([vercel.com](https://vercel.com))

## Local Development Setup

### 1. Clone and Install Dependencies

\`\`\`bash
cd taxflow
npm install
\`\`\`

### 2. Set Up Supabase

#### Create a New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details and choose a strong database password
4. Wait for the project to be provisioned (~2 minutes)

#### Get Supabase Credentials

1. Go to **Settings** > **API** in your Supabase project
2. Copy your **Project URL** (starts with https://)
3. Copy your **anon/public key** (safe to use in browser)
4. Copy your **service_role key** (keep secret, server-side only)
5. Go to **Settings** > **Auth** and copy your **JWT Secret**

#### Run Database Migrations

\`\`\`bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project (you'll need to paste your project ref and database password)
npx supabase link

# Push the migration to your database
npx supabase db push
\`\`\`

This will create all the necessary tables (profiles, households, tax_years, documents, entities, checklist_items, nudges, billing) with Row Level Security policies.

#### Create Storage Bucket

In your Supabase dashboard:
1. Go to **Storage**
2. Click **New bucket**
3. Name: `docs`
4. Make it **Private** (not public)
5. Click **Create bucket**

The RLS policies in the migration will handle access control.

### 3. Set Up Stripe

#### Create Products and Prices

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top-right)
3. Go to **Products** > **Add product**

Create two subscription products:

**Basic Plan**:
- Name: "TaxFlow Basic"
- Pricing: $9.00 USD / month (recurring)
- Copy the **Price ID** (starts with `price_`)

**Pro Plan**:
- Name: "TaxFlow Pro"  
- Pricing: $19.00 USD / month (recurring)
- Copy the **Price ID** (starts with `price_`)

#### Get API Keys

1. Go to **Developers** > **API keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Note: Webhook secret will be configured after deployment

### 4. Set Up OpenAI

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Name it "TaxFlow Dev"
4. Copy the key (starts with `sk-`)

### 5. Set Up Resend

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Click **Create API Key**
3. Name it "TaxFlow"
4. Copy the key (starts with `re_`)

For the `from` email:
- If you have a domain: Add and verify your domain in Resend, then use `noreply@yourdomain.com`
- For testing: Use `onboarding@resend.dev` (provided by Resend)

### 6. Configure Environment Variables

Create `.env.local` file in the root directory:

\`\`\`bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Stripe Configuration  
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Leave empty for now, add after deployment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PRO=price_...

# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Resend Configuration
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# Cron Secret (for Vercel cron jobs)
CRON_SECRET=dev_secret_123
\`\`\`

### 7. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment to Vercel

### 1. Deploy to Vercel

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
\`\`\`

Follow the prompts to link your project to Vercel.

### 2. Configure Environment Variables in Vercel

Go to your Vercel project settings and add all the environment variables from `.env.local` (except `NEXT_PUBLIC_SITE_URL` - Vercel provides this automatically).

**Important**: Update `NEXT_PUBLIC_SITE_URL` to your production URL (e.g., `https://taxflow.vercel.app`)

### 3. Configure Stripe Webhook

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Endpoint URL: `https://your-vercel-url.vercel.app/api/stripe/webhook`
4. Events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add `STRIPE_WEBHOOK_SECRET` to your Vercel environment variables

### 4. Configure Supabase Auth Redirect URLs

In your Supabase project:
1. Go to **Authentication** > **URL Configuration**
2. Add to **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (for local dev)
   - `https://your-vercel-url.vercel.app/auth/callback` (for production)

### 5. Verify Cron Job

The weekly nudges cron job is configured in `vercel.json`:
- Schedule: Mondays at 2pm UTC (`0 14 * * 1`)
- Only runs January-April (tax season)

After deployment, you can test it by calling:
\`\`\`bash
curl -X GET https://your-vercel-url.vercel.app/api/cron/weekly-nudges \\
  -H "Authorization: Bearer YOUR_CRON_SECRET"
\`\`\`

## Usage Guide

### For Users

1. **Sign Up**: Use email magic link or Google OAuth
2. **Upload Documents**: Drag-and-drop PDFs of W-2s, 1099s, etc.
3. **Parse**: Click "Parse" on each document to extract data with AI
4. **Generate Checklist**: Based on last year's docs, get a personalized checklist
5. **Track Progress**: Mark items complete as you collect documents
6. **Export**: When ready, export everything as a ZIP for your CPA (Pro plan)

### Plan Limits

- **Free**: 1 household, 1 active tax year, 10 documents, manual upload only
- **Basic ($9/mo)**: 2 tax years, 100 documents, Gmail/Drive ingest, weekly nudges
- **Pro ($19/mo)**: Unlimited years, 1000 documents, priority parsing, export package

### MCP Integrations (Gmail/Drive)

Currently implemented as functional stubs that return mock data. To enable real integrations:
1. Set up OAuth 2.0 credentials in Google Cloud Console
2. Implement OAuth flow in the app
3. Replace stub functions in `lib/mcp.ts` with real MCP server calls
4. Set `MCP_GMAIL_CREDENTIALS_JSON_BASE64` and `MCP_GOOGLE_DRIVE_CREDENTIALS_JSON_BASE64` env vars

## Project Structure

\`\`\`
taxflow/
├── app/
│   ├── (marketing)/page.tsx          # Landing page
│   ├── dashboard/                    # Protected dashboard routes
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Overview
│   │   ├── documents/page.tsx
│   │   ├── checklist/page.tsx
│   │   ├── billing/page.tsx
│   │   └── settings/page.tsx
│   ├── api/                          # API routes
│   │   ├── upload/route.ts
│   │   ├── parse/route.ts
│   │   ├── checklist/generate/route.ts
│   │   ├── export/route.ts
│   │   ├── stripe/
│   │   └── cron/weekly-nudges/route.ts
│   └── auth/callback/route.ts
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── dashboard-nav.tsx
│   ├── upload-dropzone.tsx
│   ├── document-row.tsx
│   ├── entity-viewer.tsx
│   └── checklist-item.tsx
├── lib/
│   ├── supabase/                     # Supabase clients
│   ├── ai.ts                         # OpenAI parsing logic
│   ├── stripe.ts                     # Stripe utilities
│   ├── mcp.ts                        # MCP stub implementations
│   ├── email.ts                      # Resend email sender
│   └── auth-helpers.ts
├── supabase/
│   ├── migrations/001_init.sql       # Database schema
│   └── seed/001_demo.sql             # Demo data (commented)
└── types/database.ts                 # TypeScript types
\`\`\`

## Testing

### Manual Test Flow

1. **Sign Up**: Create account with email magic link
2. **Upload**: Upload a sample PDF (any PDF will work for testing)
3. **Parse**: Click parse button - should extract entities (may be generic if not a real tax doc)
4. **Checklist**: Navigate to checklist - should see standard items
5. **Billing**: Go to billing, upgrade to Pro (use Stripe test card `4242 4242 4242 4242`)
6. **Verify**: Check that plan updates and Pro features are enabled
7. **Export**: Try exporting package (Pro feature)
8. **Download**: Verify ZIP contains CSVs, JSON, and documents

### Stripe Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

## Troubleshooting

### Upload fails with "Document limit reached"
- Free plan allows only 10 documents
- Upgrade to Basic (100) or Pro (1000)

### Parse fails or extracts wrong data
- OpenAI works best with actual tax forms (W-2, 1099, etc.)
- Generic PDFs will be classified as "OTHER" type
- Check that `OPENAI_API_KEY` is valid and has credits

### Stripe webhook not working
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check webhook endpoint is accessible (not localhost in production)
- View webhook attempts in Stripe dashboard > Developers > Webhooks

### Email nudges not sending
- Verify `RESEND_API_KEY` is valid
- Check `RESEND_FROM_EMAIL` is verified (or using `onboarding@resend.dev`)
- Verify cron job is configured in Vercel
- Nudges only send January-April for Basic/Pro users with missing required items

### Auth callback fails
- Verify redirect URLs are configured in Supabase
- Check `NEXT_PUBLIC_SITE_URL` matches your domain
- For Google OAuth, ensure provider is enabled in Supabase Auth settings

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/upload` | POST | Upload document file |
| `/api/parse` | POST | Parse document with AI |
| `/api/checklist/generate` | POST | Generate personalized checklist |
| `/api/export` | POST | Export ZIP package (Pro) |
| `/api/stripe/create-checkout-session` | POST | Start subscription checkout |
| `/api/stripe/portal` | POST | Open billing portal |
| `/api/stripe/webhook` | POST | Handle Stripe events |
| `/api/ingest/gmail` | POST | List Gmail tax docs (stub) |
| `/api/ingest/drive` | POST | List Drive files (stub) |
| `/api/cron/weekly-nudges` | GET | Send weekly reminders |

## Security

- Row Level Security (RLS) enforced on all Supabase tables
- Server-side Supabase client used for sensitive operations
- Stripe webhook signatures verified
- Cron endpoints protected with secret bearer token
- File uploads validated (type, size, ownership)
- Signed URLs for document downloads (expire in 1 hour)

## Contributing

This is an MVP. Future enhancements:
- Real Gmail/Drive OAuth integration
- Image OCR for non-PDF documents
- Multi-user household support
- Mobile app
- CPA portal for shared access
- Tax estimation calculator
- More document types (state forms, schedules)

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- GitHub Issues: Create an issue in this repository
- Email: support@taxflow.app (if deployed)

---

Built with ❤️ using Next.js, Supabase, and OpenAI
