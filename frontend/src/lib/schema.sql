-- ============================================================
-- ELITE TAMIL MATRIMONY — Complete Supabase Schema
-- Run this in Supabase SQL Editor in the order shown.
-- ============================================================

-- ── 1. PROFILES ────────────────────────────────────────────────────────
-- Core user profile table. Extends auth.users via the id FK.
-- RLS: Anyone can read (for matching). Only owner can write.

create table if not exists public.profiles (
  id                    uuid references auth.users(id) on delete cascade primary key,
  profile_for           text not null default 'Myself',
  name                  text not null,
  mobile                text unique,
  email                 text,
  gender                text check (gender in ('male', 'female')),
  dob                   date,
  height                text,
  weight                text,
  physical_status       text,
  marital_status        text,
  religion              text,
  caste                 text,
  subcaste              text,
  gothram               text,
  mother_tongue         text,
  education             text,
  college               text,
  occupation            text,
  company               text,
  employment_type       text,
  income                text,
  country               text not null default 'India',
  state                 text,
  city                  text,
  native_place          text,
  diet                  text,
  smoking               text,
  drinking              text,
  disabilities          text,
  star                  text,
  rasi                  text,
  dhosham               text,
  languages             text[] default '{}',
  hobbies               text[] default '{}',
  interests             text[] default '{}',
  about                 text check (char_length(about) <= 500),
  photo_url             text,
  is_verified           boolean not null default false,
  is_premium            boolean not null default false,
  -- Family
  father_occupation     text,
  mother_occupation     text,
  family_status         text,
  family_type           text,
  brothers              int default 0,
  sisters               int default 0,
  -- Partner preferences
  partner_age_min       int default 22,
  partner_age_max       int default 35,
  partner_religion      text,
  partner_caste         text,
  partner_education     text,
  partner_occupation    text,
  partner_income        text,
  partner_height_min    text,
  partner_height_max    text,
  partner_country       text default 'India',
  partner_marital_status text[] default '{}',
  partner_mother_tongue text[] default '{}',
  -- Auth email (the Supabase auth email used during registration)
  -- Stored so that login can directly use it without probing
  auth_email            text,
  -- Timestamps
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  last_active           timestamptz not null default now()
);

-- Auto-update updated_at on any change
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Indexes for common lookups
create index if not exists profiles_gender_idx on public.profiles(gender);
create index if not exists profiles_religion_idx on public.profiles(religion);
create index if not exists profiles_caste_idx on public.profiles(caste);
create index if not exists profiles_city_idx on public.profiles(city);
create index if not exists profiles_last_active_idx on public.profiles(last_active desc);
create index if not exists profiles_mobile_idx on public.profiles(mobile);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policy: Anyone (authenticated or anon) can read profiles for matching
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Policy: Users can only insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Policy: Users can only update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policy: Users can delete their own profile
create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);


-- ── 2. SHORTLISTS ─────────────────────────────────────────────────────

create table if not exists public.shortlists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  target_id   uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_id, target_id)
);

create index if not exists shortlists_user_idx on public.shortlists(user_id);
create index if not exists shortlists_target_idx on public.shortlists(target_id);

alter table public.shortlists enable row level security;

create policy "Users manage own shortlists"
  on public.shortlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Others can see if their profile was shortlisted
create policy "Users can see who shortlisted them"
  on public.shortlists for select
  using (auth.uid() = target_id);


-- ── 3. PROFILE VIEWS ──────────────────────────────────────────────────

create table if not exists public.profile_views (
  id          uuid primary key default gen_random_uuid(),
  viewer_id   uuid not null references public.profiles(id) on delete cascade,
  viewed_id   uuid not null references public.profiles(id) on delete cascade,
  viewed_at   timestamptz not null default now()
);

create index if not exists views_viewer_idx on public.profile_views(viewer_id);
create index if not exists views_viewed_idx on public.profile_views(viewed_id);

alter table public.profile_views enable row level security;

-- Authenticated users can record a view
create policy "Auth users can insert views"
  on public.profile_views for insert
  with check (auth.uid() = viewer_id);

-- Users can see who viewed them
create policy "Users can see their own views"
  on public.profile_views for select
  using (auth.uid() = viewer_id or auth.uid() = viewed_id);


-- ── 4. INTERESTS SENT ─────────────────────────────────────────────────

create table if not exists public.interests_sent (
  id            uuid primary key default gen_random_uuid(),
  sender_id     uuid not null references public.profiles(id) on delete cascade,
  receiver_id   uuid not null references public.profiles(id) on delete cascade,
  status        text not null default 'pending'
                  check (status in ('pending', 'accepted', 'declined')),
  sent_at       timestamptz not null default now(),
  responded_at  timestamptz,
  unique(sender_id, receiver_id)
);

create index if not exists interests_sender_idx on public.interests_sent(sender_id);
create index if not exists interests_receiver_idx on public.interests_sent(receiver_id);

alter table public.interests_sent enable row level security;

create policy "Sender can insert interest"
  on public.interests_sent for insert
  with check (auth.uid() = sender_id);

create policy "Sender or receiver can view interest"
  on public.interests_sent for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Receiver can update (accept/decline) interest"
  on public.interests_sent for update
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);


-- ── 5. MESSAGES ───────────────────────────────────────────────────────

create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references public.profiles(id) on delete cascade,
  receiver_id  uuid not null references public.profiles(id) on delete cascade,
  content      text not null,
  read_at      timestamptz,
  sent_at      timestamptz not null default now()
);

create index if not exists messages_sender_idx on public.messages(sender_id);
create index if not exists messages_receiver_idx on public.messages(receiver_id);
create index if not exists messages_sent_at_idx on public.messages(sent_at desc);

alter table public.messages enable row level security;

create policy "Sender can insert message"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Sender or receiver can view messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Receiver can mark as read"
  on public.messages for update
  using (auth.uid() = receiver_id);


-- ── 6. HOROSCOPES ─────────────────────────────────────────────────────

create table if not exists public.horoscopes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade unique,
  file_url     text not null,
  file_name    text,
  uploaded_at  timestamptz not null default now()
);

alter table public.horoscopes enable row level security;

create policy "Owner can manage horoscope"
  on public.horoscopes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 7. VERIFICATION REQUESTS ──────────────────────────────────────────

create table if not exists public.verification_requests (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  document_type  text not null,
  document_path  text not null,
  status         text not null default 'pending'
                   check (status in ('pending', 'approved', 'rejected')),
  submitted_at   timestamptz not null default now(),
  reviewed_at    timestamptz
);

alter table public.verification_requests enable row level security;

create policy "Owner manages own verification requests"
  on public.verification_requests for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 8. STORAGE POLICIES ───────────────────────────────────────────────
-- Run these AFTER creating the buckets in Supabase Dashboard.

-- Profile Photos bucket (public reads)
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

create policy "Public profile photo reads"
  on storage.objects for select
  using (bucket_id = 'profile-photos');

create policy "Auth users upload own profile photos"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Auth users update own profile photos"
  on storage.objects for update
  using (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Auth users delete own profile photos"
  on storage.objects for delete
  using (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Verification Documents bucket (private)
insert into storage.buckets (id, name, public)
values ('verification-documents', 'verification-documents', false)
on conflict (id) do nothing;

create policy "Owners access own verification docs"
  on storage.objects for all
  using (
    bucket_id = 'verification-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'verification-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


-- ── 9. HELPER FUNCTION: Auto-create profile on sign-up ────────────────
-- IMPORTANT: Uses ON CONFLICT DO UPDATE so that our registerUser upsert
-- can overwrite this placeholder row with the full profile data.
-- 'on conflict do nothing' would silently block the real data from saving.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, mobile, email, profile_for, created_at, updated_at, last_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Member'),
    new.raw_user_meta_data->>'mobile',
    -- Only store real emails — synthetic @etm.app emails go to null
    case when new.email not like '%@etm.app' then new.email else null end,
    coalesce(new.raw_user_meta_data->>'profile_for', 'Myself'),
    now(), now(), now()
  )
  on conflict (id) do update set
    name        = excluded.name,
    mobile      = coalesce(excluded.mobile, public.profiles.mobile),
    profile_for = coalesce(excluded.profile_for, public.profiles.profile_for),
    updated_at  = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
