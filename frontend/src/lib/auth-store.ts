// src/lib/auth-store.ts
// ── SUPABASE AUTH + PROFILES ──────────────────────────────────────────
// Replaces the old localStorage-based auth system.
// All data is now persisted in Supabase auth.users + public.profiles.

import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

// ── TYPE DEFINITIONS ──────────────────────────────────────────────────

export interface RegisteredUser {
  id: string;
  profileFor: string;
  name: string;
  mobile: string;
  email?: string;
  authEmail?: string;  // The Supabase auth email used for this account
  dob?: string;
  gender?: 'male' | 'female';
  height?: string;
  weight?: string;
  physicalStatus?: string;
  maritalStatus?: string;
  religion?: string;
  caste?: string;
  subcaste?: string;
  gothram?: string;
  motherTongue?: string;
  education?: string;
  college?: string;
  occupation?: string;
  company?: string;
  employmentType?: string;
  income?: string;
  country?: string;
  state?: string;
  city?: string;
  nativePlace?: string;
  diet?: string;
  smoking?: string;
  drinking?: string;
  disabilities?: string;
  star?: string;
  rasi?: string;
  dhosham?: string;
  languages?: string[];
  hobbies?: string[];
  interests?: string[];
  about?: string;
  photoUrl?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  partnerAgeMin?: number;
  partnerAgeMax?: number;
  partnerReligion?: string;
  partnerCaste?: string;
  partnerEducation?: string;
  partnerOccupation?: string;
  partnerIncome?: string;
  partnerHeightMin?: string;
  partnerHeightMax?: string;
  partnerCountry?: string;
  partnerMaritalStatus?: string[];
  partnerMotherTongue?: string[];
  fatherOccupation?: string;
  motherOccupation?: string;
  familyStatus?: string;
  familyType?: string;
  brothers?: number;
  sisters?: number;
  createdAt: string;
  lastActive?: string;
}

export type RegisterPayload = Omit<RegisteredUser, 'id' | 'createdAt' | 'isVerified' | 'isPremium'> & {
  password: string;
};

// ── DB ↔ APP SHAPE ADAPTERS ───────────────────────────────────────────

// Convert snake_case DB row → camelCase app object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToUser(row: Record<string, any>): RegisteredUser {
  return {
    id: row.id,
    profileFor: row.profile_for ?? '',
    name: row.name ?? '',
    mobile: row.mobile ?? '',
    email: row.email ?? undefined,
    authEmail: row.auth_email ?? undefined,
    dob: row.dob ?? undefined,
    gender: row.gender as 'male' | 'female' | undefined,
    height: row.height ?? undefined,
    weight: row.weight ?? undefined,
    physicalStatus: row.physical_status ?? undefined,
    maritalStatus: row.marital_status ?? undefined,
    religion: row.religion ?? undefined,
    caste: row.caste ?? undefined,
    subcaste: row.subcaste ?? undefined,
    gothram: row.gothram ?? undefined,
    motherTongue: row.mother_tongue ?? undefined,
    education: row.education ?? undefined,
    college: row.college ?? undefined,
    occupation: row.occupation ?? undefined,
    company: row.company ?? undefined,
    employmentType: row.employment_type ?? undefined,
    income: row.income ?? undefined,
    country: row.country ?? 'India',
    state: row.state ?? undefined,
    city: row.city ?? undefined,
    nativePlace: row.native_place ?? undefined,
    diet: row.diet ?? undefined,
    smoking: row.smoking ?? undefined,
    drinking: row.drinking ?? undefined,
    disabilities: row.disabilities ?? undefined,
    star: row.star ?? undefined,
    rasi: row.rasi ?? undefined,
    dhosham: row.dhosham ?? undefined,
    languages: row.languages ?? [],
    hobbies: row.hobbies ?? [],
    interests: row.interests ?? [],
    about: row.about ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    isVerified: row.is_verified ?? false,
    isPremium: row.is_premium ?? false,
    partnerAgeMin: row.partner_age_min ?? 22,
    partnerAgeMax: row.partner_age_max ?? 35,
    partnerReligion: row.partner_religion ?? undefined,
    partnerCaste: row.partner_caste ?? undefined,
    partnerEducation: row.partner_education ?? undefined,
    partnerOccupation: row.partner_occupation ?? undefined,
    partnerIncome: row.partner_income ?? undefined,
    partnerHeightMin: row.partner_height_min ?? undefined,
    partnerHeightMax: row.partner_height_max ?? undefined,
    partnerCountry: row.partner_country ?? 'India',
    partnerMaritalStatus: row.partner_marital_status ?? [],
    partnerMotherTongue: row.partner_mother_tongue ?? [],
    fatherOccupation: row.father_occupation ?? undefined,
    motherOccupation: row.mother_occupation ?? undefined,
    familyStatus: row.family_status ?? undefined,
    familyType: row.family_type ?? undefined,
    brothers: row.brothers ?? 0,
    sisters: row.sisters ?? 0,
    createdAt: row.created_at ?? new Date().toISOString(),
    lastActive: row.last_active ?? undefined,
  };
}

// Convert camelCase app object → snake_case DB fields
// IMPORTANT: Empty strings are treated as null (skipped) to prevent
// Postgres type errors on date/check-constrained columns.
function userToDb(data: Partial<RegisteredUser>): Record<string, unknown> {
  const db: Record<string, unknown> = {};

  // Helper: skip undefined OR empty string values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (col: string, val: any) => {
    if (val !== undefined && val !== null && val !== '') {
      db[col] = val;
    }
  };

  // Text fields — safe to skip empty string
  set('profile_for',    data.profileFor);
  set('name',          data.name);
  set('mobile',        data.mobile);
  set('email',         data.email);
  // auth_email is written separately (see registerUser step 5 and loginToProfile)
  set('gender',        data.gender);
  set('height',        data.height);
  set('weight',        data.weight);
  set('physical_status', data.physicalStatus);
  set('marital_status',  data.maritalStatus);
  set('religion',      data.religion);
  set('caste',         data.caste);
  set('subcaste',      data.subcaste);
  set('gothram',       data.gothram);
  set('mother_tongue', data.motherTongue);
  set('education',     data.education);
  set('college',       data.college);
  set('occupation',    data.occupation);
  set('company',       data.company);
  set('employment_type', data.employmentType);
  set('income',        data.income);
  set('country',       data.country);
  set('state',         data.state);
  set('city',          data.city);
  set('native_place',  data.nativePlace);
  set('diet',          data.diet);
  set('smoking',       data.smoking);
  set('drinking',      data.drinking);
  set('disabilities',  data.disabilities);
  set('star',          data.star);
  set('rasi',          data.rasi);
  set('dhosham',       data.dhosham);
  set('about',         data.about);
  set('photo_url',     data.photoUrl);
  set('partner_religion',       data.partnerReligion);
  set('partner_caste',          data.partnerCaste);
  set('partner_education',      data.partnerEducation);
  set('partner_occupation',     data.partnerOccupation);
  set('partner_income',         data.partnerIncome);
  set('partner_height_min',     data.partnerHeightMin);
  set('partner_height_max',     data.partnerHeightMax);
  set('partner_country',        data.partnerCountry);
  set('father_occupation',      data.fatherOccupation);
  set('mother_occupation',      data.motherOccupation);
  set('family_status',          data.familyStatus);
  set('family_type',            data.familyType);

  // Date field — MUST be a valid ISO date string or omitted entirely
  // An empty string "" would cause: invalid input syntax for type date: ""
  if (data.dob && data.dob.trim() !== '') {
    db.dob = data.dob;
  }

  // Array fields — send empty arrays rather than skipping
  if (data.languages !== undefined)           db.languages = data.languages;
  if (data.hobbies !== undefined)             db.hobbies = data.hobbies;
  if (data.interests !== undefined)           db.interests = data.interests;
  if (data.partnerMaritalStatus !== undefined) db.partner_marital_status = data.partnerMaritalStatus;
  if (data.partnerMotherTongue !== undefined)  db.partner_mother_tongue = data.partnerMotherTongue;

  // Numeric fields — only include if they are actual numbers
  if (typeof data.partnerAgeMin === 'number') db.partner_age_min = data.partnerAgeMin;
  if (typeof data.partnerAgeMax === 'number') db.partner_age_max = data.partnerAgeMax;
  if (typeof data.brothers === 'number')      db.brothers = data.brothers;
  if (typeof data.sisters === 'number')       db.sisters = data.sisters;

  return db;
}


// ── AUTH FUNCTIONS ─────────────────────────────────────────────────────

/**
 * Register a new user with Supabase Auth and create their profile row.
 * Uses synthetic email (mobile@etm.app) — email confirmation is disabled
 * in Supabase Dashboard so no confirmation email is sent.
 */
export async function registerUser(payload: RegisterPayload): Promise<RegisteredUser> {
  const baseEmail = payload.email || `${payload.mobile}@etm.app`;
  const passwordToUse = payload.password || `ETM_${payload.mobile}_2024`;

  // Try signing up; if the email is taken, append _2, _3, etc.
  let emailToUse = baseEmail;
  let authData;
  let authError;

  // First attempt with the base email
  const firstAttempt = await supabase.auth.signUp({
    email: emailToUse,
    password: passwordToUse,
    options: {
      emailRedirectTo: undefined,
      data: {
        name: payload.name,
        mobile: payload.mobile,
        profile_for: payload.profileFor,
      },
    },
  });

  authData = firstAttempt.data;
  authError = firstAttempt.error;

  // If "User already registered" — try suffixed emails
  if (authError && (authError.message.includes('already registered') || authError.message.includes('already been registered'))) {
    for (let suffix = 2; suffix <= 20; suffix++) {
      emailToUse = baseEmail.includes('@etm.app')
        ? `${payload.mobile}_${suffix}@etm.app`
        : `${baseEmail.replace('@', `_${suffix}@`)}`;

      const passwordSuffixed = `ETM_${payload.mobile}_${suffix}_2024`;

      const attempt = await supabase.auth.signUp({
        email: emailToUse,
        password: passwordSuffixed,
        options: {
          emailRedirectTo: undefined,
          data: {
            name: payload.name,
            mobile: payload.mobile,
            profile_for: payload.profileFor,
          },
        },
      });

      if (!attempt.error && attempt.data.user) {
        authData = attempt.data;
        authError = null;
        break;
      }
      // If still "already registered", continue trying next suffix
      if (attempt.error && !attempt.error.message.includes('already registered') && !attempt.error.message.includes('already been registered')) {
        throw new Error(attempt.error.message);
      }
    }
  }

  if (authError) throw new Error(authError.message);
  if (!authData?.user) throw new Error('Registration failed — no user returned');

  const userId = authData.user.id;

  // 2. If session is null (email confirmation pending), immediately sign in
  if (!authData.session) {
    // Derive the correct password for this email
    const pw = emailToUse === baseEmail
      ? passwordToUse
      : `ETM_${payload.mobile}_${emailToUse.match(/_([0-9]+)@/)?.[1] || '2'}_2024`;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: pw,
    });
    if (signInError) throw new Error(`Could not sign in after registration: ${signInError.message}`);
  }

  // 3. Build the full profile payload (without auth_email — handled separately below)
  const realEmail = payload.email && !payload.email.includes('@etm.app') ? payload.email : undefined;

  const profilePayload = userToDb({
    profileFor: payload.profileFor,
    name: payload.name,
    mobile: payload.mobile,
    email: realEmail,
    // auth_email is NOT included here — see step 5 below
    dob: payload.dob,
    gender: payload.gender,
    height: payload.height,
    physicalStatus: payload.physicalStatus,
    maritalStatus: payload.maritalStatus,
    religion: payload.religion,
    caste: payload.caste,
    subcaste: payload.subcaste,
    motherTongue: payload.motherTongue,
    education: payload.education,
    occupation: payload.occupation,
    income: payload.income,
    country: payload.country || 'India',
    state: payload.state,
    city: payload.city,
    diet: payload.diet,
    star: payload.star,
    rasi: payload.rasi,
    about: payload.about,
    photoUrl: payload.photoUrl,
  });

  // 4. Upsert profile (core fields only)
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .upsert(
      { id: userId, ...profilePayload },
      {
        onConflict: 'id',
        ignoreDuplicates: false,
      }
    )
    .select()
    .single();

  if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`);

  // 5. Write auth_email in a separate, non-blocking update.
  //    This gracefully handles the case where the auth_email column hasn't been
  //    added to the DB yet (older deployments). If it fails, login will fall
  //    back to the sequential probe — not ideal but not fatal.
  void supabase
    .from('profiles')
    .update({ auth_email: emailToUse })
    .eq('id', userId);

  return dbToUser(profileData);
}


/**
 * Sign in with email/phone and password.
 */
export async function loginWithPassword(
  identifier: string,
  password: string
): Promise<RegisteredUser | null> {
  // identifier can be email or mobile — for mobile, try base synthetic email first
  const emailToUse = identifier.includes('@')
    ? identifier
    : `${identifier}@etm.app`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password,
  });

  if (error || !data.user) return null;

  return fetchProfile(data.user.id);
}

/**
 * Get ALL profiles for a mobile number (supports multi-account).
 */
export async function getProfilesByMobile(mobile: string): Promise<RegisteredUser[]> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('mobile', mobile)
    .order('created_at', { ascending: false });

  return (data || []).map(dbToUser);
}

/**
 * Sign in with mobile number only (OTP-less, for demo / easy login).
 * Returns the first matching profile (for backward compat).
 */
export async function loginWithMobile(mobile: string): Promise<RegisteredUser | null> {
  const profiles = await getProfilesByMobile(mobile);
  return profiles.length > 0 ? profiles[0] : null;
}

// ── Auth email suffix cache (localStorage) ────────────────────────────
// Key: `etm_auth_email_${profileId}` → full auth email string

function getCachedAuthEmail(profileId: string): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(`etm_auth_email_${profileId}`);
}

function setCachedAuthEmail(profileId: string, email: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`etm_auth_email_${profileId}`, email);
}

/**
 * Derive password from an auth email.
 * Base email `mobile@etm.app` → `ETM_mobile_2024`
 * Suffixed email `mobile_N@etm.app` → `ETM_mobile_N_2024`
 */
function emailToPassword(email: string, mobile: string): string {
  const suffix = email.match(/_([0-9]+)@/)?.[1];
  return suffix ? `ETM_${mobile}_${suffix}_2024` : `ETM_${mobile}_2024`;
}

/**
 * Sign into a specific profile by its profile ID.
 * Fast path: uses auth_email stored on the profile row (set during registration).
 * Fast path 2: uses localStorage cache for repeat logins.
 * Sequential fallback: probes all 20 possible emails one by one (legacy accounts).
 * NOTE: Never runs auth sign-ins in parallel — Supabase only supports one
 * active session per client, and parallel calls cause race conditions.
 */
export async function loginToProfile(profileId: string): Promise<RegisteredUser | null> {
  // Fetch profile row
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (!profile) return null;

  const mobile = profile.mobile;

  // Helper: attempt sign-in with a specific email
  const tryEmail = async (email: string): Promise<boolean> => {
    const password = emailToPassword(email, mobile);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return !error && !!data.user && data.user.id === profileId;
  };

  // ── Fast path 1: auth_email stored on the profile row (new accounts) ──
  if (profile.auth_email) {
    const ok = await tryEmail(profile.auth_email);
    if (ok) {
      setCachedAuthEmail(profileId, profile.auth_email);
      return dbToUser(profile);
    }
  }

  // ── Fast path 2: localStorage cache (repeat logins for legacy accounts) ──
  const cached = getCachedAuthEmail(profileId);
  if (cached && cached !== profile.auth_email) {
    const ok = await tryEmail(cached);
    if (ok) return dbToUser(profile);
  }

  // ── Sequential probe: try base email then suffixed emails one by one ──
  // IMPORTANT: Sequential — never parallel — to avoid Supabase session race conditions.
  const candidateEmails = [
    `${mobile}@etm.app`,
    ...Array.from({ length: 19 }, (_, i) => `${mobile}_${i + 2}@etm.app`),
  ];

  for (const email of candidateEmails) {
    const ok = await tryEmail(email);
    if (ok) {
      // Cache it and also update the profile row so future logins skip this probe
      setCachedAuthEmail(profileId, email);
      // Fire-and-forget: persist auth_email to profile row for next time
      void supabase
        .from('profiles')
        .update({ auth_email: email })
        .eq('id', profileId);
      return dbToUser(profile);

    }
  }

  // ── Nothing worked: no valid Supabase auth found ──
  // This means the account was created outside the normal registration flow
  // (e.g., directly inserted into the DB). We cannot sign in.
  console.error(`[loginToProfile] Could not find auth credentials for profile ${profileId} (mobile: ${mobile}). Profile exists in DB but has no matching Supabase auth user.`);
  return null;  // Return null instead of silently succeeding — callers must handle this
}


/**
 * Get the current Supabase session.
 */
export async function getSession(): Promise<{ user: User; session: Session } | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  return { user: data.session.user, session: data.session };
}

/**
 * Fetch a profile row by auth user id.
 */
export async function fetchProfile(userId: string): Promise<RegisteredUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return dbToUser(data);
}

/**
 * Fetch a profile by any user id (for viewing other profiles).
 */
export async function getUserById(id: string): Promise<RegisteredUser | null> {
  return fetchProfile(id);
}

/**
 * Sign out.
 */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Update the current user's profile.
 */
export async function updateProfile(
  userId: string,
  updates: Partial<RegisteredUser>
): Promise<RegisteredUser> {
  const dbUpdates = {
    ...userToDb(updates),
    updated_at: new Date().toISOString(),
    last_active: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(`Profile update failed: ${error.message}`);
  return dbToUser(data);
}

/**
 * Fetch all profiles for the matches page (excludes current user).
 * Returns top 50 by last_active descending.
 */
export async function fetchMatchProfiles(
  currentUserId?: string,
  currentUserGender?: 'male' | 'female'
): Promise<RegisteredUser[]> {
  // Determine the opposite gender to show
  const oppositeGender = currentUserGender === 'male' ? 'female'
    : currentUserGender === 'female' ? 'male'
    : null;

  let query = supabase
    .from('profiles')
    .select('*')
    .order('last_active', { ascending: false })
    .limit(50);

  if (currentUserId) {
    query = query.neq('id', currentUserId);
  }

  // Filter by opposite gender if known
  if (oppositeGender) {
    query = query.eq('gender', oppositeGender);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data || []).map(dbToUser);
}

/**
 * Shortlist a profile.
 */
export async function shortlistProfile(
  userId: string,
  targetId: string
): Promise<void> {
  await supabase
    .from('shortlists')
    .upsert({ user_id: userId, target_id: targetId });
}

/**
 * Remove shortlist.
 */
export async function removeShortlist(
  userId: string,
  targetId: string
): Promise<void> {
  await supabase
    .from('shortlists')
    .delete()
    .eq('user_id', userId)
    .eq('target_id', targetId);
}

/**
 * Get shortlisted profiles for the current user.
 */
export async function getShortlistedProfiles(
  userId: string
): Promise<RegisteredUser[]> {
  const { data } = await supabase
    .from('shortlists')
    .select('target_id, profiles!shortlists_target_id_fkey(*)')
    .eq('user_id', userId);

  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => dbToUser(row.profiles)).filter(Boolean);
}

/**
 * Record a profile view.
 */
export async function recordProfileView(
  viewerId: string,
  viewedId: string
): Promise<void> {
  await supabase
    .from('profile_views')
    .insert({ viewer_id: viewerId, viewed_id: viewedId });
}

// ── INTEREST ROW TYPE ─────────────────────────────────────────────────
export interface InterestRow {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
  updatedAt: string;
  profile?: RegisteredUser; // populated by join queries
}

function dbToInterest(row: Record<string, unknown>): InterestRow {
  return {
    id:         row.id as string,
    senderId:   row.sender_id as string,
    receiverId: row.receiver_id as string,
    status:     (row.status as 'pending' | 'accepted' | 'declined') || 'pending',
    message:    row.message as string | undefined,
    createdAt:  row.created_at as string,
    updatedAt:  row.updated_at as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile:    row.profiles ? dbToUser(row.profiles as any) : undefined,
  };
}

/**
 * Send interest to another profile.
 * Uses the `interests` table (new schema). Idempotent — won't create duplicates.
 */
export async function sendInterest(
  senderId: string,
  receiverId: string,
  message?: string
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('interests')
    .upsert(
      { sender_id: senderId, receiver_id: receiverId, status: 'pending', message: message || null },
      { onConflict: 'sender_id,receiver_id', ignoreDuplicates: false }
    );
  return { error: error?.message };
}

/**
 * Accept an interest (receiver calls this).
 */
export async function acceptInterest(interestId: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('interests')
    .update({ status: 'accepted' })
    .eq('id', interestId);
  return { error: error?.message };
}

/**
 * Decline an interest (receiver calls this).
 */
export async function declineInterest(interestId: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('interests')
    .update({ status: 'declined' })
    .eq('id', interestId);
  return { error: error?.message };
}

/**
 * Withdraw / delete an interest the current user sent.
 */
export async function withdrawInterest(interestId: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('interests')
    .delete()
    .eq('id', interestId);
  return { error: error?.message };
}

/**
 * Get interests RECEIVED by userId. Joins sender profile.
 * filter: 'all' | 'pending' | 'accepted' | 'declined'
 */
export async function getInterestsReceived(
  userId: string,
  filter: 'all' | 'pending' | 'accepted' | 'declined' = 'all'
): Promise<InterestRow[]> {
  let query = supabase
    .from('interests')
    .select('*, profiles!interests_sender_id_fkey(*)')
    .eq('receiver_id', userId)
    .order('created_at', { ascending: false });

  if (filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => ({
    ...dbToInterest(row as Record<string, unknown>),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: row.profiles ? dbToUser(row.profiles as any) : undefined,
  }));
}

/**
 * Get interests SENT by userId. Joins receiver profile.
 * filter: 'all' | 'pending' | 'accepted' | 'declined'
 */
export async function getInterestsSent(
  userId: string,
  filter: 'all' | 'pending' | 'accepted' | 'declined' = 'all'
): Promise<InterestRow[]> {
  let query = supabase
    .from('interests')
    .select('*, profiles!interests_receiver_id_fkey(*)')
    .eq('sender_id', userId)
    .order('created_at', { ascending: false });

  if (filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => ({
    ...dbToInterest(row as Record<string, unknown>),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: row.profiles ? dbToUser(row.profiles as any) : undefined,
  }));
}

/**
 * Get the interest status between two users (if any).
 */
export async function getInterestStatus(
  senderId: string,
  receiverId: string
): Promise<InterestRow | null> {
  const { data } = await supabase
    .from('interests')
    .select('*')
    .eq('sender_id', senderId)
    .eq('receiver_id', receiverId)
    .maybeSingle();
  return data ? dbToInterest(data as Record<string, unknown>) : null;
}

/**
 * Check if userId has shortlisted targetId.
 */
export async function isShortlisted(userId: string, targetId: string): Promise<boolean> {
  const { data } = await supabase
    .from('shortlists')
    .select('id')
    .eq('user_id', userId)
    .eq('target_id', targetId)
    .maybeSingle();
  return !!data;
}

/**
 * Get today's daily recommendations for a user.
 * Returns 10 profiles from the opposite gender, seeded by today's date so they're
 * consistent all day but change each morning.
 */
export async function getDailyRecommendations(
  userId: string,
  gender?: string
): Promise<RegisteredUser[]> {
  const oppositeGender = gender === 'male' ? 'female' : gender === 'female' ? 'male' : null;

  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (oppositeGender) {
    query = query.eq('gender', oppositeGender);
  }

  const { data } = await query;
  if (!data || data.length === 0) return [];

  // Seed shuffle by today's date so recommendations change daily
  const today = new Date().toISOString().slice(0, 10); // "2026-08-04"
  const seed = today.split('-').reduce((acc, n) => acc + parseInt(n), 0);
  const shuffled = [...data].sort((a, b) => {
    const ha = (parseInt(a.id.replace(/-/g, '').slice(0, 8), 16) + seed) % 997;
    const hb = (parseInt(b.id.replace(/-/g, '').slice(0, 8), 16) + seed) % 997;
    return ha - hb;
  });

  return shuffled.slice(0, 10).map(dbToUser);
}

// ── BACKWARD-COMPAT SHIMS ─────────────────────────────────────────────
export function setSession(_user: RegisteredUser): void {
  // Noop — Supabase handles session automatically
}

// ── MOBILE CHECK ──────────────────────────────────────────────────────

/**
 * Check if a mobile number is already registered.
 * Returns true if a profile with that mobile exists.
 */
export async function checkMobileExists(mobile: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('mobile', mobile)
    .maybeSingle();
  return !!data;
}

// ── MATCHES SIDEBAR FILTER FUNCTIONS ─────────────────────────────────

/**
 * Profiles viewed BY the current user (distinct).
 */
export async function getViewedByMe(
  userId: string,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  const { data: views } = await supabase
    .from('profile_views')
    .select('viewed_id')
    .eq('viewer_id', userId);

  if (!views || views.length === 0) return [];

  // Deduplicate IDs
  const ids = [...new Set(views.map((v: { viewed_id: string }) => v.viewed_id))];

  let query = supabase.from('profiles').select('*').in('id', ids);
  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles that viewed the current user.
 */
export async function getViewedMe(
  userId: string,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  const { data: views } = await supabase
    .from('profile_views')
    .select('viewer_id')
    .eq('viewed_id', userId);

  if (!views || views.length === 0) return [];

  const ids = [...new Set(views.map((v: { viewer_id: string }) => v.viewer_id))];

  let query = supabase.from('profiles').select('*').in('id', ids);
  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles that shortlisted the current user.
 */
export async function getShortlistedMe(
  userId: string,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  const { data: sl } = await supabase
    .from('shortlists')
    .select('user_id')
    .eq('target_id', userId);

  if (!sl || sl.length === 0) return [];

  const ids = sl.map((s: { user_id: string }) => s.user_id);

  let query = supabase.from('profiles').select('*').in('id', ids);
  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles that joined in the last 30 days (opposite gender, excluding self).
 */
export async function getNewlyJoined(
  currentUserId: string,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles in the same state (nearby).
 */
export async function getNearbyMatches(
  currentUserId: string,
  state: string | undefined,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  if (!state) return [];

  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .eq('state', state)
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles with a photo uploaded.
 */
export async function getWithPhotos(
  currentUserId: string,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .not('photo_url', 'is', null)
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles with horoscope details (star + rasi filled).
 */
export async function getWithHoroscope(
  currentUserId: string,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .not('star', 'is', null)
    .not('rasi', 'is', null)
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles with at least one hobby in common.
 */
export async function getSimilarHobbies(
  currentUserId: string,
  myHobbies: string[],
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  if (!myHobbies || myHobbies.length === 0) {
    // Fall back to profiles with any hobbies
    return getWithPhotos(currentUserId, oppositeGender);
  }

  // Postgres array overlap operator: hobbies && ARRAY[...]
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .overlaps('hobbies', myHobbies)
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles whose partner preferences match the current user's profile,
 * AND whose profile matches current user's partner preferences — mutual match.
 */
export async function getMutualMatches(
  currentUser: RegisteredUser
): Promise<RegisteredUser[]> {
  const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male';

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUser.id)
    .eq('gender', oppositeGender)
    .order('last_active', { ascending: false })
    .limit(100);

  if (!data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map(dbToUser).filter((p: RegisteredUser) => {
    // Check if p's partner age range includes current user's age
    const myAge = currentUser.dob
      ? Math.floor((Date.now() - new Date(currentUser.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null;

    const ageOk = myAge
      ? (!p.partnerAgeMin || myAge >= p.partnerAgeMin) &&
        (!p.partnerAgeMax || myAge <= p.partnerAgeMax)
      : true;

    // Check if current user's partner religion preference matches p's religion
    const religionOk =
      !currentUser.partnerReligion || !p.religion ||
      currentUser.partnerReligion === p.religion;

    // Check reverse: p prefers current user's religion
    const reverseReligionOk =
      !p.partnerReligion || !currentUser.religion ||
      p.partnerReligion === currentUser.religion;

    return ageOk && religionOk && reverseReligionOk;
  });
}

/**
 * Profiles whose partner preferences match the current user's attributes
 * (they are looking for someone like you).
 */
export async function getLookingForMe(
  currentUser: RegisteredUser
): Promise<RegisteredUser[]> {
  const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male';

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUser.id)
    .eq('gender', oppositeGender)
    .order('last_active', { ascending: false })
    .limit(100);

  if (!data) return [];

  const myAge = currentUser.dob
    ? Math.floor((Date.now() - new Date(currentUser.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return data.map(dbToUser).filter((p: RegisteredUser) => {
    const ageOk = myAge
      ? (!p.partnerAgeMin || myAge >= p.partnerAgeMin) &&
        (!p.partnerAgeMax || myAge <= p.partnerAgeMax)
      : true;

    const religionOk =
      !p.partnerReligion || !currentUser.religion ||
      p.partnerReligion === currentUser.religion;

    const educationOk =
      !p.partnerEducation || !currentUser.education ||
      currentUser.education.toLowerCase().includes(p.partnerEducation.toLowerCase());

    return ageOk && religionOk && educationOk;
  });
}

/**
 * Profiles matching current user's preferred education.
 */
export async function getByEducationPref(
  currentUserId: string,
  preferredEducation: string | undefined,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  if (!preferredEducation) return fetchMatchProfiles(currentUserId, oppositeGender || undefined);

  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .ilike('education', `%${preferredEducation}%`)
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles matching current user's preferred occupation.
 */
export async function getByProfessionPref(
  currentUserId: string,
  preferredOccupation: string | undefined,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  if (!preferredOccupation) return fetchMatchProfiles(currentUserId, oppositeGender || undefined);

  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .ilike('occupation', `%${preferredOccupation}%`)
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles in the same preferred city/state.
 */
export async function getByLocationPref(
  currentUserId: string,
  preferredCity: string | undefined,
  state: string | undefined,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);
  if (preferredCity) query = query.ilike('city', `%${preferredCity}%`);
  else if (state) query = query.eq('state', state);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * NRI profiles — profiles with country !== 'India'.
 */
export async function getNRIMatches(
  currentUserId: string,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .neq('country', 'India')
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  return (data || []).map(dbToUser);
}

/**
 * Profiles with the same star sign (nakshatra compatibility).
 */
export async function getStarMatches(
  currentUserId: string,
  star: string | undefined,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  if (!star) return getWithHoroscope(currentUserId, oppositeGender);

  // Compatible stars (basic grouping — can be expanded with full Jyotish logic)
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .eq('star', star)
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  if (data && data.length > 0) return data.map(dbToUser);

  // Fallback: profiles with any star set
  return getWithHoroscope(currentUserId, oppositeGender);
}

/**
 * Profiles with matching rasi (horoscope sign).
 */
export async function getHoroscopeMatches(
  currentUserId: string,
  rasi: string | undefined,
  oppositeGender: 'male' | 'female' | null
): Promise<RegisteredUser[]> {
  if (!rasi) return getWithHoroscope(currentUserId, oppositeGender);

  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)
    .eq('rasi', rasi)
    .order('last_active', { ascending: false })
    .limit(50);

  if (oppositeGender) query = query.eq('gender', oppositeGender);

  const { data } = await query;
  if (data && data.length > 0) return data.map(dbToUser);

  return getWithHoroscope(currentUserId, oppositeGender);
}
