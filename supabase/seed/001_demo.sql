-- TaxFlow Demo Seed Data
-- Creates demo user, household, tax years, and sample documents

-- Note: This seed assumes you have a demo user created via Supabase Auth
-- You'll need to replace the user_id below with an actual auth.users id
-- For local development, sign up with demo@taxflow.app first, then run this seed

-- Variables (replace with actual user ID after creating demo user)
-- Example: \set demo_user_id 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

-- For this seed to work, create a user first via Supabase Auth UI or API:
-- Email: demo@taxflow.app
-- Then get the user_id and insert it below

-- Demo Profile (this will be created automatically by auth trigger in production)
-- INSERT INTO public.profiles (user_id, full_name, email, plan)
-- VALUES (
--   :demo_user_id,
--   'Demo User',
--   'demo@taxflow.app',
--   'pro'
-- );

-- Demo Household
-- INSERT INTO public.households (id, owner_id, name)
-- VALUES (
--   'demo-household-id'::uuid,
--   :demo_user_id,
--   'Demo Family'
-- );

-- Demo Membership
-- INSERT INTO public.memberships (household_id, user_id, role)
-- VALUES (
--   'demo-household-id'::uuid,
--   :demo_user_id,
--   'owner'
-- );

-- Demo Tax Years (2024 and 2025)
-- INSERT INTO public.tax_years (id, household_id, year, status)
-- VALUES 
--   ('demo-tax-year-2024'::uuid, 'demo-household-id'::uuid, 2024, 'reviewing'),
--   ('demo-tax-year-2025'::uuid, 'demo-household-id'::uuid, 2025, 'collecting');

-- Demo Documents for 2024
-- INSERT INTO public.documents (id, household_id, tax_year_id, source, filename, mime_type, storage_path, parsed, file_size)
-- VALUES
--   (
--     'demo-doc-w2'::uuid,
--     'demo-household-id'::uuid,
--     'demo-tax-year-2024'::uuid,
--     'upload',
--     'W-2_Acme_Corp_2024.pdf',
--     'application/pdf',
--     'demo-user-id/2024/w2-acme-corp.pdf',
--     true,
--     52480
--   ),
--   (
--     'demo-doc-1099'::uuid,
--     'demo-household-id'::uuid,
--     'demo-tax-year-2024'::uuid,
--     'upload',
--     '1099-NEC_Freelance_Platform_2024.pdf',
--     'application/pdf',
--     'demo-user-id/2024/1099-nec-freelance.pdf',
--     true,
--     38912
--   );

-- Demo Extracted Entities for W-2
-- INSERT INTO public.document_entities (document_id, entity_type, key, value, confidence)
-- VALUES
--   ('demo-doc-w2'::uuid, 'W2', 'employer_name', 'Acme Corporation', 95.5),
--   ('demo-doc-w2'::uuid, 'W2', 'employer_ein', '12-3456789', 98.0),
--   ('demo-doc-w2'::uuid, 'W2', 'employee_name', 'Demo User', 97.2),
--   ('demo-doc-w2'::uuid, 'W2', 'employee_ssn', '***-**-1234', 99.0),
--   ('demo-doc-w2'::uuid, 'W2', 'wages_tips_compensation', '85000.00', 96.8),
--   ('demo-doc-w2'::uuid, 'W2', 'federal_income_tax_withheld', '12750.00', 95.2),
--   ('demo-doc-w2'::uuid, 'W2', 'social_security_wages', '85000.00', 96.5),
--   ('demo-doc-w2'::uuid, 'W2', 'medicare_wages', '85000.00', 96.5),
--   ('demo-doc-w2'::uuid, 'W2', 'tax_year', '2024', 99.5);

-- Demo Extracted Entities for 1099-NEC
-- INSERT INTO public.document_entities (document_id, entity_type, key, value, confidence)
-- VALUES
--   ('demo-doc-1099'::uuid, '1099-NEC', 'payer_name', 'Freelance Platform Inc', 94.8),
--   ('demo-doc-1099'::uuid, '1099-NEC', 'payer_ein', '98-7654321', 97.5),
--   ('demo-doc-1099'::uuid, '1099-NEC', 'recipient_name', 'Demo User', 96.2),
--   ('demo-doc-1099'::uuid, '1099-NEC', 'recipient_tin', '***-**-1234', 98.5),
--   ('demo-doc-1099'::uuid, '1099-NEC', 'nonemployee_compensation', '15000.00', 95.8),
--   ('demo-doc-1099'::uuid, '1099-NEC', 'federal_income_tax_withheld', '0.00', 92.0),
--   ('demo-doc-1099'::uuid, '1099-NEC', 'tax_year', '2024', 99.5);

-- Demo Checklist Items for 2025
-- INSERT INTO public.checklist_items (tax_year_id, title, description, status, required, category)
-- VALUES
--   (
--     'demo-tax-year-2025'::uuid,
--     'Request W-2 from Acme Corporation',
--     'Contact HR to receive your W-2 form by January 31st',
--     'todo',
--     true,
--     'income'
--   ),
--   (
--     'demo-tax-year-2025'::uuid,
--     'Collect 1099-NEC from Freelance Platform Inc',
--     'Download from platform dashboard or wait for mailed copy',
--     'in_progress',
--     true,
--     'income'
--   ),
--   (
--     'demo-tax-year-2025'::uuid,
--     'Gather charitable donation receipts',
--     'Collect all receipts from charitable contributions made during the year',
--     'todo',
--     false,
--     'deductions'
--   ),
--   (
--     'demo-tax-year-2025'::uuid,
--     'HSA contribution statements',
--     'Request from your HSA provider if you made contributions',
--     'todo',
--     false,
--     'deductions'
--   ),
--   (
--     'demo-tax-year-2025'::uuid,
--     'Student loan interest statement (1098-E)',
--     'Lenders typically mail these by January 31st',
--     'done',
--     false,
--     'deductions'
--   ),
--   (
--     'demo-tax-year-2025'::uuid,
--     'Estimated tax payment records',
--     'Gather receipts for any quarterly estimated tax payments',
--     'todo',
--     false,
--     'other'
--   );

-- Demo Billing Record
-- INSERT INTO public.billing (user_id, stripe_customer_id, plan)
-- VALUES (
--   :demo_user_id,
--   'cus_demo123456789',
--   'pro'
-- );

-- Helper: To use this seed, first create a demo user, then run:
-- UPDATE this file with the actual user_id
-- Then execute: psql -f supabase/seed/001_demo.sql

COMMENT ON TABLE public.profiles IS 'User profiles mirrored from auth.users';
COMMENT ON TABLE public.households IS 'Family or organization grouping for tax documents';
COMMENT ON TABLE public.tax_years IS 'Tax years being tracked for each household';
COMMENT ON TABLE public.documents IS 'Uploaded or ingested tax documents';
COMMENT ON TABLE public.document_entities IS 'Extracted structured data from documents';
COMMENT ON TABLE public.checklist_items IS 'Tax collection checklist for each year';
COMMENT ON TABLE public.nudges IS 'Email reminder log';
COMMENT ON TABLE public.billing IS 'Stripe billing information';

