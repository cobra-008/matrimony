-- ============================================================
-- SQL MIGRATION — ETM Admin & Notifications
-- Date: 2026-09-03
-- Description:
--   1. notifications table
--   2. success_stories table
--   3. ALTER profiles — admin columns (is_banned, ban_reason, verification_status,
--      verification_document, admin_notes, membership_* columns)
--   4. RLS policies for new tables
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. NOTIFICATIONS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL DEFAULT 'system'
              CHECK (type IN (
                'interest_received','interest_accepted','interest_declined',
                'profile_view','shortlisted','message_received',
                'verification_approved','verification_rejected',
                'admin_message','system','membership_expiry'
              )),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  read_at     TIMESTAMP WITH TIME ZONE,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own notifications
DROP POLICY IF EXISTS "Users see own notifications" ON notifications;
CREATE POLICY "Users see own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users mark notifications read" ON notifications;
CREATE POLICY "Users mark notifications read"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role (admin) can insert for any user
DROP POLICY IF EXISTS "Service role can insert notifications" ON notifications;
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (TRUE);  -- controlled by service_role key on server


-- ── 2. SUCCESS STORIES TABLE ────────────────────────────────
CREATE TABLE IF NOT EXISTS success_stories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,          -- e.g. "Priya & Karthik"
  city       TEXT,
  married    TEXT,                   -- e.g. "March 2025"
  story      TEXT NOT NULL,
  photo_url  TEXT,                   -- optional couple photo
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- RLS — public read, service-role write
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view success stories" ON success_stories;
CREATE POLICY "Public can view success stories"
  ON success_stories FOR SELECT
  USING (is_visible = TRUE);

DROP POLICY IF EXISTS "Service role manages success stories" ON success_stories;
CREATE POLICY "Service role manages success stories"
  ON success_stories FOR ALL
  WITH CHECK (TRUE);


-- ── 3. ALTER profiles — add admin & membership columns ──────

-- Admin columns
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_banned            BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ban_reason           TEXT,
  ADD COLUMN IF NOT EXISTS verification_status  TEXT DEFAULT 'unsubmitted'
                           CHECK (verification_status IN ('unsubmitted','pending','approved','rejected')),
  ADD COLUMN IF NOT EXISTS verification_document TEXT,
  ADD COLUMN IF NOT EXISTS admin_notes          TEXT;

-- Membership columns (if not already present from earlier migrations)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS membership_plan          TEXT,
  ADD COLUMN IF NOT EXISTS membership_plan_period   TEXT,
  ADD COLUMN IF NOT EXISTS membership_expiry        TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS membership_activated     TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS membership_price_paid    INTEGER;

-- Index for admin ban filter
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON profiles(is_banned);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_membership_plan ON profiles(membership_plan);


-- ── 4. HELPER: auto-update updated_at ───────────────────────

-- (Only if trigger doesn't already exist)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_success_stories_updated_at'
  ) THEN
    CREATE TRIGGER set_success_stories_updated_at
    BEFORE UPDATE ON success_stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END;
$$;


-- ── 5. SEED: initial notification types reference ────────────
-- No seed data required — notifications are created dynamically by the app.
-- Run a quick check after migration:

-- SELECT COUNT(*) FROM notifications;     -- should be 0 initially
-- SELECT COUNT(*) FROM success_stories;   -- should be 0 initially
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_banned';

-- ============================================================
-- END OF MIGRATION
-- ============================================================
