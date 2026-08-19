-- ============================================================
-- ELITE TAMIL MATRIMONY — Complete Supabase Schema (v2)
-- Safe to re-run: all statements use IF NOT EXISTS / OR REPLACE
-- Run in Supabase SQL Editor in the order shown.
-- ============================================================


-- ── 1. PROFILES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                     UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  profile_for            TEXT NOT NULL DEFAULT 'Myself',
  name                   TEXT NOT NULL,
  mobile                 TEXT UNIQUE,
  email                  TEXT,
  auth_email             TEXT,
  gender                 TEXT CHECK (gender IN ('male', 'female')),
  dob                    DATE,
  height                 TEXT,
  weight                 TEXT,
  physical_status        TEXT,
  marital_status         TEXT,
  religion               TEXT,
  caste                  TEXT,
  subcaste               TEXT,
  gothram                TEXT,
  mother_tongue          TEXT,
  education              TEXT,
  college                TEXT,
  occupation             TEXT,
  company                TEXT,
  employment_type        TEXT,
  income                 TEXT,
  country                TEXT NOT NULL DEFAULT 'India',
  state                  TEXT,
  city                   TEXT,
  native_place           TEXT,
  diet                   TEXT,
  smoking                TEXT,
  drinking               TEXT,
  disabilities           TEXT,
  star                   TEXT,
  rasi                   TEXT,
  dhosham                TEXT,
  languages              TEXT[] DEFAULT '{}',
  hobbies                TEXT[] DEFAULT '{}',
  interests              TEXT[] DEFAULT '{}',
  about                  TEXT CHECK (CHAR_LENGTH(about) <= 500),
  photo_url              TEXT,
  is_verified            BOOLEAN NOT NULL DEFAULT false,
  is_premium             BOOLEAN NOT NULL DEFAULT false,
  membership_plan        TEXT CHECK (membership_plan IN ('Gold', 'Diamond', 'Platinum')),
  membership_expiry      TIMESTAMPTZ,
  membership_activated   TIMESTAMPTZ,
  membership_price_paid  NUMERIC(10, 2),
  membership_plan_period TEXT,
  father_occupation      TEXT,
  mother_occupation      TEXT,
  family_status          TEXT,
  family_type            TEXT,
  brothers               INT DEFAULT 0,
  sisters                INT DEFAULT 0,
  partner_age_min        INT DEFAULT 22,
  partner_age_max        INT DEFAULT 35,
  partner_religion       TEXT,
  partner_caste          TEXT,
  partner_education      TEXT,
  partner_occupation     TEXT,
  partner_income         TEXT,
  partner_height_min     TEXT,
  partner_height_max     TEXT,
  partner_country        TEXT DEFAULT 'India',
  partner_marital_status TEXT[] DEFAULT '{}',
  partner_mother_tongue  TEXT[] DEFAULT '{}',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist on pre-existing tables
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auth_email             TEXT,
  ADD COLUMN IF NOT EXISTS is_premium             BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS membership_plan        TEXT CHECK (membership_plan IN ('Gold','Diamond','Platinum')),
  ADD COLUMN IF NOT EXISTS membership_expiry      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS membership_activated   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS membership_price_paid  NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS membership_plan_period TEXT,
  ADD COLUMN IF NOT EXISTS updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_active            TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS profiles_gender_idx      ON public.profiles(gender);
CREATE INDEX IF NOT EXISTS profiles_religion_idx    ON public.profiles(religion);
CREATE INDEX IF NOT EXISTS profiles_caste_idx       ON public.profiles(caste);
CREATE INDEX IF NOT EXISTS profiles_city_idx        ON public.profiles(city);
CREATE INDEX IF NOT EXISTS profiles_last_active_idx ON public.profiles(last_active DESC);
CREATE INDEX IF NOT EXISTS profiles_mobile_idx      ON public.profiles(mobile);
CREATE INDEX IF NOT EXISTS profiles_is_premium_idx  ON public.profiles(is_premium);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile"   ON public.profiles;
CREATE POLICY "Profiles are publicly readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"   ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"   ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete own profile"   ON public.profiles FOR DELETE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, auth_email, created_at, updated_at, last_active)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email,'@',1)),
          NEW.email, NEW.email, NOW(), NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.add_auth_email_column()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auth_email TEXT; END;
$$;
GRANT EXECUTE ON FUNCTION public.add_auth_email_column() TO anon, authenticated;


-- ── 2. PROFILE PHOTOS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profile_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS profile_photos_profile_idx ON public.profile_photos(profile_id);
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read profile photos" ON public.profile_photos;
DROP POLICY IF EXISTS "Users manage own photos"        ON public.profile_photos;
CREATE POLICY "Anyone can read profile photos" ON public.profile_photos FOR SELECT USING (true);
CREATE POLICY "Users manage own photos"        ON public.profile_photos FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());


-- ── 3. OTP STORE ─────────────────────────────────────────────────────
-- Accessed only via server-side API routes → RLS disabled.
CREATE TABLE IF NOT EXISTS public.otp_store (
  identifier TEXT PRIMARY KEY,
  otp        TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts   INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS otp_store_expires_idx ON public.otp_store(expires_at);
ALTER TABLE public.otp_store DISABLE ROW LEVEL SECURITY;


-- ── 4. PROFILE VIEWS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profile_views (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS views_viewer_idx ON public.profile_views(viewer_id);
CREATE INDEX IF NOT EXISTS views_viewed_idx ON public.profile_views(viewed_id);
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth users can insert views"   ON public.profile_views;
DROP POLICY IF EXISTS "Users can see their own views" ON public.profile_views;
CREATE POLICY "Auth users can insert views"   ON public.profile_views FOR INSERT WITH CHECK (auth.uid() = viewer_id);
CREATE POLICY "Users can see their own views" ON public.profile_views FOR SELECT USING (auth.uid() = viewer_id OR auth.uid() = viewed_id);


-- ── 5. SHORTLISTS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shortlists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_id)
);
CREATE INDEX IF NOT EXISTS shortlists_user_idx   ON public.shortlists(user_id);
CREATE INDEX IF NOT EXISTS shortlists_target_idx ON public.shortlists(target_id);
ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own shortlists"        ON public.shortlists;
DROP POLICY IF EXISTS "Users can see who shortlisted them" ON public.shortlists;
CREATE POLICY "Users manage own shortlists"        ON public.shortlists FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can see who shortlisted them" ON public.shortlists FOR SELECT USING (auth.uid() = target_id);


-- ── 6. INTERESTS SENT ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.interests_sent (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  message     TEXT,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);
CREATE INDEX IF NOT EXISTS interests_sender_idx   ON public.interests_sent(sender_id);
CREATE INDEX IF NOT EXISTS interests_receiver_idx ON public.interests_sent(receiver_id);
ALTER TABLE public.interests_sent ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sender can insert interest"             ON public.interests_sent;
DROP POLICY IF EXISTS "Sender or receiver can view interest"   ON public.interests_sent;
DROP POLICY IF EXISTS "Receiver can update (accept/decline)"   ON public.interests_sent;
DROP POLICY IF EXISTS "Sender can delete interest"             ON public.interests_sent;
CREATE POLICY "Sender can insert interest"           ON public.interests_sent FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Sender or receiver can view interest" ON public.interests_sent FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Receiver can update (accept/decline)" ON public.interests_sent FOR UPDATE USING (auth.uid() = receiver_id) WITH CHECK (auth.uid() = receiver_id);
CREATE POLICY "Sender can delete interest"           ON public.interests_sent FOR DELETE USING (auth.uid() = sender_id);


-- ── 7. MESSAGES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  read_at     TIMESTAMPTZ,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS messages_sender_idx   ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_receiver_idx ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS messages_sent_at_idx  ON public.messages(sent_at DESC);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sender can insert message"            ON public.messages;
DROP POLICY IF EXISTS "Sender or receiver can view messages" ON public.messages;
DROP POLICY IF EXISTS "Receiver can mark as read"            ON public.messages;
CREATE POLICY "Sender can insert message"            ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Sender or receiver can view messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Receiver can mark as read"            ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);


-- ── 8. HOROSCOPES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.horoscopes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  file_url    TEXT NOT NULL,
  file_name   TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.horoscopes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owner can manage horoscope" ON public.horoscopes;
CREATE POLICY "Owner can manage horoscope" ON public.horoscopes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ── 9. VERIFICATION REQUESTS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_path TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ
);
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owner manages own verification requests" ON public.verification_requests;
CREATE POLICY "Owner manages own verification requests" ON public.verification_requests FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ── 10. NOTIFICATIONS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('interest','view','shortlist','message','match','system')),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  href       TEXT,
  read       BOOLEAN NOT NULL DEFAULT false,
  data       JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS notifications_user_idx       ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ── 11. COMPATIBILITY ANSWERS ────────────────────────────────────────
-- Stores 22-question questionnaire responses from registration.
-- Used to compute answer-based compatibility scores between profiles.
CREATE TABLE IF NOT EXISTS public.compatibility_answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,   -- e.g. 'lifestyle_1', 'family_2'
  answer      TEXT NOT NULL,   -- e.g. 'home_family', 'flexible'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_compat_answers_profile ON public.compatibility_answers(profile_id);
ALTER TABLE public.compatibility_answers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "compat_answers_owner_all"          ON public.compatibility_answers;
DROP POLICY IF EXISTS "compat_answers_read_authenticated" ON public.compatibility_answers;
CREATE POLICY "compat_answers_owner_all"          ON public.compatibility_answers FOR ALL    USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());
CREATE POLICY "compat_answers_read_authenticated" ON public.compatibility_answers FOR SELECT USING (auth.role() = 'authenticated');


-- ── 12. STORAGE BUCKETS ──────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public profile photo reads"            ON storage.objects;
DROP POLICY IF EXISTS "Auth users upload own profile photos"  ON storage.objects;
DROP POLICY IF EXISTS "Auth users update own profile photos"  ON storage.objects;
DROP POLICY IF EXISTS "Auth users delete own profile photos"  ON storage.objects;
CREATE POLICY "Public profile photo reads"           ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Auth users upload own profile photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
CREATE POLICY "Auth users update own profile photos" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-photos' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
CREATE POLICY "Auth users delete own profile photos" ON storage.objects FOR DELETE USING (bucket_id = 'profile-photos' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

INSERT INTO storage.buckets (id, name, public) VALUES ('verification-documents', 'verification-documents', false) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Owners access own verification docs" ON storage.objects;
CREATE POLICY "Owners access own verification docs" ON storage.objects FOR ALL USING (bucket_id = 'verification-documents' AND auth.uid()::TEXT = (storage.foldername(name))[1]) WITH CHECK (bucket_id = 'verification-documents' AND auth.uid()::TEXT = (storage.foldername(name))[1]);


-- ── 13. VERIFY ───────────────────────────────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles','profile_photos','otp_store','profile_views',
                     'shortlists','interests_sent','messages','horoscopes',
                     'verification_requests','notifications','compatibility_answers')
ORDER BY table_name;

SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('is_premium','membership_plan','membership_expiry',
                      'membership_activated','membership_price_paid',
                      'membership_plan_period','updated_at','auth_email')
ORDER BY column_name;

