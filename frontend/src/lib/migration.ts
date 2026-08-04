// src/lib/migration.ts
// ── LOCAL STORAGE → SUPABASE MIGRATION ──────────────────────────────
// Run once per browser to move any legacy localStorage data into Supabase.
// Prevents duplicate imports using a "etm_migrated" flag.

import { supabase } from './supabase';

const MIGRATION_FLAG = 'etm_migrated_v2';
const OLD_USERS_KEY = 'etm_users';
const OLD_SESSION_KEY = 'etm_session';

interface LegacyUser {
  id: string;
  profileFor: string;
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  dob?: string;
  gender?: string;
  height?: string;
  physicalStatus?: string;
  maritalStatus?: string;
  religion?: string;
  caste?: string;
  subcaste?: string;
  motherTongue?: string;
  education?: string;
  occupation?: string;
  income?: string;
  country?: string;
  state?: string;
  city?: string;
  diet?: string;
  star?: string;
  rasi?: string;
  dhosham?: string;
  partnerAgeMin?: number;
  partnerAgeMax?: number;
  partnerReligion?: string;
  partnerCaste?: string;
  about?: string;
  photoUrl?: string;
  isVerified?: boolean;
  createdAt: string;
}

/**
 * Run the one-time migration. Safe to call on every app load —
 * it exits immediately if migration is already done.
 */
export async function runMigrationIfNeeded(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Skip if already migrated
  if (localStorage.getItem(MIGRATION_FLAG) === 'done') return;

  // Check if there's any legacy data
  const rawUsers = localStorage.getItem(OLD_USERS_KEY);
  if (!rawUsers) {
    // No legacy data — mark done immediately
    localStorage.setItem(MIGRATION_FLAG, 'done');
    return;
  }

  let legacyUsers: LegacyUser[] = [];
  try {
    legacyUsers = JSON.parse(rawUsers);
  } catch {
    console.warn('[Migration] Could not parse legacy users');
    localStorage.setItem(MIGRATION_FLAG, 'done');
    return;
  }

  if (!legacyUsers.length) {
    localStorage.setItem(MIGRATION_FLAG, 'done');
    return;
  }

  console.info(`[Migration] Found ${legacyUsers.length} legacy user(s). Starting migration…`);

  let migrated = 0;

  for (const legacy of legacyUsers) {
    try {
      await migrateSingleUser(legacy);
      migrated++;
    } catch (err) {
      console.warn(`[Migration] Failed to migrate user ${legacy.name}:`, err);
    }
  }

  console.info(`[Migration] Completed. ${migrated}/${legacyUsers.length} users migrated.`);

  // Clean up legacy keys (keep a backup just in case)
  localStorage.setItem('etm_users_backup', rawUsers);
  localStorage.removeItem(OLD_USERS_KEY);
  localStorage.removeItem(OLD_SESSION_KEY);
  localStorage.setItem(MIGRATION_FLAG, 'done');
}

async function migrateSingleUser(legacy: LegacyUser): Promise<void> {
  const emailToUse = legacy.email || `${legacy.mobile}@etm.app`;
  const defaultPassword = `ETM_${legacy.mobile}_2024`;

  // 1. Try to create the auth user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: emailToUse,
    password: legacy.password || defaultPassword,
    options: {
      data: { name: legacy.name },
    },
  });

  let userId: string;

  if (signUpError) {
    // User might already exist in Supabase — try to look up by email
    if (signUpError.message.includes('already registered')) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('mobile', legacy.mobile)
        .single();

      if (!existing) {
        console.warn(`[Migration] User ${legacy.name} already in auth but no profile found`);
        return;
      }
      userId = existing.id;
    } else {
      throw new Error(signUpError.message);
    }
  } else if (!signUpData.user) {
    throw new Error('No user returned from signUp');
  } else {
    userId = signUpData.user.id;
  }

  // 2. Upsert the profile row with legacy data
  // If the trigger already created a minimal row, we overwrite it.
  const photoUrl = legacy.photoUrl && legacy.photoUrl.startsWith('data:')
    ? undefined // Do NOT store base64 in DB — user must re-upload
    : legacy.photoUrl;

  await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        profile_for: legacy.profileFor || 'Myself',
        name: legacy.name,
        mobile: legacy.mobile,
        email: legacy.email,
        dob: legacy.dob,
        gender: legacy.gender,
        height: legacy.height,
        physical_status: legacy.physicalStatus,
        marital_status: legacy.maritalStatus,
        religion: legacy.religion,
        caste: legacy.caste,
        subcaste: legacy.subcaste,
        mother_tongue: legacy.motherTongue,
        education: legacy.education,
        occupation: legacy.occupation,
        income: legacy.income,
        country: legacy.country || 'India',
        state: legacy.state,
        city: legacy.city,
        diet: legacy.diet,
        star: legacy.star,
        rasi: legacy.rasi,
        dhosham: legacy.dhosham,
        about: legacy.about,
        photo_url: photoUrl,
        is_verified: legacy.isVerified ?? false,
        partner_age_min: legacy.partnerAgeMin ?? 22,
        partner_age_max: legacy.partnerAgeMax ?? 35,
        partner_religion: legacy.partnerReligion,
        partner_caste: legacy.partnerCaste,
        created_at: legacy.createdAt,
        updated_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
}
