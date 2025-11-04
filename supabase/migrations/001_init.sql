-- TaxFlow Database Schema
-- This migration creates all tables with Row Level Security (RLS) policies

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Mirror user profile data from auth.users
-- =====================================================
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  plan text default 'free' check (plan in ('free', 'basic', 'pro')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- HOUSEHOLDS TABLE
-- Organizations/families for multi-user support (MVP: single-user)
-- =====================================================
create table public.households (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text default 'My Household',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- MEMBERSHIPS TABLE
-- User-household relationships with roles
-- =====================================================
create table public.memberships (
  household_id uuid references public.households(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('owner','member')) default 'owner',
  primary key (household_id, user_id),
  created_at timestamptz default now()
);

-- =====================================================
-- TAX YEARS TABLE
-- Track tax years for each household
-- =====================================================
create table public.tax_years (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade,
  year int not null,
  status text check (status in ('collecting','reviewing','ready','exported')) default 'collecting',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (household_id, year)
);

-- =====================================================
-- DOCUMENTS TABLE
-- Uploaded or fetched documents via MCP (Drive/Gmail)
-- =====================================================
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade,
  tax_year_id uuid references public.tax_years(id) on delete cascade,
  source text check (source in ('upload','gmail','drive','manual')) default 'upload',
  provider_id text, -- external id (gmail msg id, drive file id)
  filename text not null,
  mime_type text,
  storage_path text, -- Supabase storage path
  file_size bigint, -- bytes
  parsed boolean default false,
  parse_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster queries
create index idx_documents_tax_year on public.documents(tax_year_id);
create index idx_documents_household on public.documents(household_id);
create index idx_documents_parsed on public.documents(parsed);

-- =====================================================
-- DOCUMENT ENTITIES TABLE
-- Extracted fields (normalized key/value pairs)
-- =====================================================
create table public.document_entities (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  entity_type text not null, -- e.g., 'W2', '1099-NEC', 'K1', 'RECEIPT'
  key text not null,
  value text,
  confidence numeric(5,2), -- 0-100 confidence score
  created_at timestamptz default now()
);

-- Index for faster queries
create index idx_entities_document on public.document_entities(document_id);
create index idx_entities_type on public.document_entities(entity_type);

-- =====================================================
-- CHECKLIST ITEMS TABLE
-- Generated and user-editable checklist items
-- =====================================================
create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  tax_year_id uuid references public.tax_years(id) on delete cascade,
  title text not null,
  description text,
  status text check (status in ('todo','in_progress','done')) default 'todo',
  required boolean default true,
  category text, -- 'income', 'deductions', 'credits', 'other'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster queries
create index idx_checklist_tax_year on public.checklist_items(tax_year_id);
create index idx_checklist_status on public.checklist_items(status);

-- =====================================================
-- NUDGES TABLE
-- Email notification log
-- =====================================================
create table public.nudges (
  id uuid primary key default gen_random_uuid(),
  tax_year_id uuid references public.tax_years(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  channel text check (channel in ('email')) default 'email',
  template text,
  subject text,
  sent_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Index for faster queries
create index idx_nudges_tax_year on public.nudges(tax_year_id);
create index idx_nudges_user on public.nudges(user_id);
create index idx_nudges_sent_at on public.nudges(sent_at);

-- =====================================================
-- BILLING TABLE
-- Stripe subscription linkage
-- =====================================================
create table public.billing (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  plan text default 'free' check (plan in ('free', 'basic', 'pro')),
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.memberships enable row level security;
alter table public.tax_years enable row level security;
alter table public.documents enable row level security;
alter table public.document_entities enable row level security;
alter table public.checklist_items enable row level security;
alter table public.nudges enable row level security;
alter table public.billing enable row level security;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- PROFILES: Users can only see and edit their own profile
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);

-- HOUSEHOLDS: Users can see households they're members of
create policy "households_select_member" on public.households
  for select using (
    exists (
      select 1 from public.memberships m 
      where m.household_id = households.id 
      and m.user_id = auth.uid()
    )
  );

create policy "households_insert_owner" on public.households
  for insert with check (auth.uid() = owner_id);

create policy "households_update_owner" on public.households
  for update using (auth.uid() = owner_id);

create policy "households_delete_owner" on public.households
  for delete using (auth.uid() = owner_id);

-- MEMBERSHIPS: Users can see memberships in their households
create policy "memberships_select" on public.memberships
  for select using (
    user_id = auth.uid() or 
    exists (
      select 1 from public.memberships m 
      where m.household_id = memberships.household_id 
      and m.user_id = auth.uid()
    )
  );

create policy "memberships_insert_owner" on public.memberships
  for insert with check (
    exists (
      select 1 from public.households h 
      where h.id = household_id 
      and h.owner_id = auth.uid()
    )
  );

create policy "memberships_delete_owner" on public.memberships
  for delete using (
    exists (
      select 1 from public.households h 
      where h.id = household_id 
      and h.owner_id = auth.uid()
    )
  );

-- TAX YEARS: Users can see tax years for their households
create policy "tax_years_select_member" on public.tax_years
  for select using (
    exists (
      select 1 from public.memberships m
      where m.household_id = tax_years.household_id 
      and m.user_id = auth.uid()
    )
  );

create policy "tax_years_insert_member" on public.tax_years
  for insert with check (
    exists (
      select 1 from public.memberships m
      where m.household_id = tax_years.household_id 
      and m.user_id = auth.uid()
    )
  );

create policy "tax_years_update_member" on public.tax_years
  for update using (
    exists (
      select 1 from public.memberships m
      where m.household_id = tax_years.household_id 
      and m.user_id = auth.uid()
    )
  );

create policy "tax_years_delete_member" on public.tax_years
  for delete using (
    exists (
      select 1 from public.memberships m
      where m.household_id = tax_years.household_id 
      and m.user_id = auth.uid()
    )
  );

-- DOCUMENTS: Users can see documents for their household's tax years
create policy "documents_select_member" on public.documents
  for select using (
    exists (
      select 1 from public.tax_years ty
      join public.memberships m on m.household_id = ty.household_id
      where documents.tax_year_id = ty.id 
      and m.user_id = auth.uid()
    )
  );

create policy "documents_insert_member" on public.documents
  for insert with check (
    exists (
      select 1 from public.tax_years ty
      join public.memberships m on m.household_id = ty.household_id
      where documents.tax_year_id = ty.id 
      and m.user_id = auth.uid()
    )
  );

create policy "documents_update_member" on public.documents
  for update using (
    exists (
      select 1 from public.tax_years ty
      join public.memberships m on m.household_id = ty.household_id
      where documents.tax_year_id = ty.id 
      and m.user_id = auth.uid()
    )
  );

create policy "documents_delete_member" on public.documents
  for delete using (
    exists (
      select 1 from public.tax_years ty
      join public.memberships m on m.household_id = ty.household_id
      where documents.tax_year_id = ty.id 
      and m.user_id = auth.uid()
    )
  );

-- DOCUMENT ENTITIES: Users can see entities for their documents
create policy "entities_select_member" on public.document_entities
  for select using (
    exists (
      select 1 from public.documents d
      join public.tax_years ty on ty.id = d.tax_year_id
      join public.memberships m on m.household_id = ty.household_id
      where d.id = document_entities.document_id 
      and m.user_id = auth.uid()
    )
  );

create policy "entities_insert_member" on public.document_entities
  for insert with check (
    exists (
      select 1 from public.documents d
      join public.tax_years ty on ty.id = d.tax_year_id
      join public.memberships m on m.household_id = ty.household_id
      where d.id = document_entities.document_id 
      and m.user_id = auth.uid()
    )
  );

create policy "entities_delete_member" on public.document_entities
  for delete using (
    exists (
      select 1 from public.documents d
      join public.tax_years ty on ty.id = d.tax_year_id
      join public.memberships m on m.household_id = ty.household_id
      where d.id = document_entities.document_id 
      and m.user_id = auth.uid()
    )
  );

-- CHECKLIST ITEMS: Users can see checklist items for their tax years
create policy "checklist_select_member" on public.checklist_items
  for select using (
    exists (
      select 1 from public.tax_years ty
      join public.memberships m on m.household_id = ty.household_id
      where checklist_items.tax_year_id = ty.id 
      and m.user_id = auth.uid()
    )
  );

create policy "checklist_insert_member" on public.checklist_items
  for insert with check (
    exists (
      select 1 from public.tax_years ty
      join public.memberships m on m.household_id = ty.household_id
      where checklist_items.tax_year_id = ty.id 
      and m.user_id = auth.uid()
    )
  );

create policy "checklist_update_member" on public.checklist_items
  for update using (
    exists (
      select 1 from public.tax_years ty
      join public.memberships m on m.household_id = ty.household_id
      where checklist_items.tax_year_id = ty.id 
      and m.user_id = auth.uid()
    )
  );

create policy "checklist_delete_member" on public.checklist_items
  for delete using (
    exists (
      select 1 from public.tax_years ty
      join public.memberships m on m.household_id = ty.household_id
      where checklist_items.tax_year_id = ty.id 
      and m.user_id = auth.uid()
    )
  );

-- NUDGES: Users can see their own nudges
create policy "nudges_select_own" on public.nudges
  for select using (auth.uid() = user_id);

create policy "nudges_insert_own" on public.nudges
  for insert with check (auth.uid() = user_id);

-- BILLING: Users can only see and edit their own billing info
create policy "billing_select_own" on public.billing
  for select using (auth.uid() = user_id);

create policy "billing_insert_own" on public.billing
  for insert with check (auth.uid() = user_id);

create policy "billing_update_own" on public.billing
  for update using (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers for updated_at
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger households_updated_at before update on public.households
  for each row execute function public.handle_updated_at();

create trigger tax_years_updated_at before update on public.tax_years
  for each row execute function public.handle_updated_at();

create trigger documents_updated_at before update on public.documents
  for each row execute function public.handle_updated_at();

create trigger checklist_items_updated_at before update on public.checklist_items
  for each row execute function public.handle_updated_at();

create trigger billing_updated_at before update on public.billing
  for each row execute function public.handle_updated_at();

-- =====================================================
-- STORAGE BUCKET SETUP
-- Note: This needs to be run manually in Supabase dashboard or via SQL
-- =====================================================

-- Create storage bucket for documents (if not exists)
-- insert into storage.buckets (id, name, public) 
-- values ('docs', 'docs', false);

-- Storage policies for documents bucket
-- create policy "Users can upload their own docs"
--   on storage.objects for insert
--   with check (bucket_id = 'docs' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "Users can read their own docs"
--   on storage.objects for select
--   using (bucket_id = 'docs' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "Users can delete their own docs"
--   on storage.objects for delete
--   using (bucket_id = 'docs' and auth.uid()::text = (storage.foldername(name))[1]);

