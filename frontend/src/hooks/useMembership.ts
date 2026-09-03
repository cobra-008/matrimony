/**
 * useMembership — Central hook for plan-based feature gating.
 *
 * Plans (ascending):  Free → Gold → Diamond → Platinum
 *
 * Source of truth (priority order):
 *  1. user.membershipPlan from Supabase DB (read via fetchProfile)
 *  2. user.isPremium flag (fallback = at least Gold)
 *  3. localStorage "etm_plan" cache (survives refresh race conditions)
 *  4. Free (default)
 */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export type PlanLevel = 0 | 1 | 2 | 3; // Free=0, Gold=1, Diamond=2, Platinum=3
export type PlanName = "Free" | "Gold" | "PrimeGold" | "PrimeTillUMarry" | "Diamond" | "Platinum";

export type Feature =
  | "messages"        // Gold+
  | "contacts"        // Gold+ (30/mo for Gold, unlimited for Diamond+)
  | "interests"       // Free=10/mo, Gold+=unlimited
  | "who_viewed"      // Gold+
  | "ai_score"        // Gold+
  | "priority"        // Gold+
  | "video_call"      // Diamond+
  | "matchmaker"      // Platinum only
  | "advanced_search" // Gold+
  | "horoscope_view"  // Gold+
  | "unlimited_contacts" // Diamond+
  | "dedicated_manager"  // Diamond+
  | "human_matchmaker"   // Platinum only
  | "background_check"   // Platinum only
  | "astrology_check"    // Platinum only;

const PLAN_LEVEL: Record<string, PlanLevel> = {
  "":        0,
  Free:      0,
  Gold:      1,
  PrimeGold: 2,
  PrimeTillUMarry: 3,
  Diamond:   2,
  Platinum:  3,
};

const FEATURE_MIN_LEVEL: Record<Feature, PlanLevel> = {
  messages:           1,
  contacts:           1,
  interests:          0,  // free to send, but capped at 10/mo
  who_viewed:         1,
  ai_score:           1,
  priority:           1,
  video_call:         2,
  matchmaker:         3,
  advanced_search:    1,
  horoscope_view:     1,
  unlimited_contacts: 2,
  dedicated_manager:  2,
  human_matchmaker:   3,
  background_check:   3,
  astrology_check:    3,
};

// ── Plan features map (for displaying feature lists per plan) ───────────────
export const PLAN_FEATURES: Record<PlanName, string[]> = {
  Free: [
    "Browse limited profiles",
    "Send up to 10 interests/month",
    "Basic search filters",
    "View profile details",
  ],
  Gold: [
    "Valid for 3 months",
    "View 40 Phone Nos",
    "Send unlimited messages",
    "Unlimited horoscope views",
  ],
  PrimeGold: [
    "Valid for 3 months",
    "View unlimited Phone Nos*",
    "Send unlimited messages",
    "Unlimited horoscope views",
    "View verified profiles with photos",
  ],
  PrimeTillUMarry: [
    "Longest validity plan",
    "View unlimited Phone Nos*",
    "Send unlimited messages",
    "Unlimited horoscope views",
    "View verified profiles with photos",
  ],
  Diamond: [
    "Everything in Gold",
    "Unlimited contact reveals",
    "Unlimited interests",
    "First-page priority placement",
    "Verified badge prominence",
    "Video call request feature",
    "Exclusive Diamond-only matches",
    "Dedicated account manager",
  ],
  Platinum: [
    "Everything in Diamond",
    "Dedicated human matchmaker",
    "Hand-curated match recommendations",
    "Background verification assistance",
    "Profile video introduction (2 mins)",
    "Priority 24/7 support",
    "Astrology compatibility check",
    "Offline meetup coordination",
    "Guaranteed 100 curated introductions",
  ],
};

const LS_PLAN_KEY  = "etm_plan";
const LS_EXPIRY_KEY = "etm_plan_expiry";
const LS_USER_KEY  = "etm_plan_user";

/** Persist plan to localStorage so Navbar stays correct even if refresh() races */
export function cacheActivePlan(userId: string, plan: PlanName, expiryIso?: string) {
  try {
    localStorage.setItem(LS_PLAN_KEY,   plan);
    localStorage.setItem(LS_USER_KEY,   userId);
    if (expiryIso) localStorage.setItem(LS_EXPIRY_KEY, expiryIso);
  } catch { /* localStorage may be blocked in private mode */ }
}

/** Clear cached plan (on logout or plan expiry) */
export function clearCachedPlan() {
  try {
    localStorage.removeItem(LS_PLAN_KEY);
    localStorage.removeItem(LS_EXPIRY_KEY);
    localStorage.removeItem(LS_USER_KEY);
  } catch { /* ignore */ }
}

/** Read cached plan — only valid if userId matches and plan not expired */
function readCachedPlan(userId?: string): PlanName | null {
  try {
    const cachedUser = localStorage.getItem(LS_USER_KEY);
    if (!userId || cachedUser !== userId) return null;

    const expiry = localStorage.getItem(LS_EXPIRY_KEY);
    if (expiry && new Date(expiry) < new Date()) {
      clearCachedPlan();
      return null;
    }

    const plan = localStorage.getItem(LS_PLAN_KEY) as PlanName | null;
    if (plan && plan in PLAN_LEVEL) return plan;
  } catch { /* ignore */ }
  return null;
}

export function useMembership() {
  const { user } = useAuth();
  const [localPlan, setLocalPlan] = useState<PlanName | null>(null);

  // Read localStorage cache once on mount (client-only)
  useEffect(() => {
    if (user?.id) {
      setLocalPlan(readCachedPlan(user.id));
    }
  }, [user?.id]);

  // ── Resolve authoritative plan name ───────────────────────────────────────
  // Priority: DB plan > isPremium flag > localStorage cache > Free
  const dbPlan = user?.membershipPlan as PlanName | null | undefined;
  const dbPlanValid = dbPlan && dbPlan !== "Free" && dbPlan in PLAN_LEVEL;

  let planName: PlanName;
  if (dbPlanValid) {
    planName = dbPlan as PlanName;
  } else if (user?.isPremium) {
    // isPremium=true but membership_plan column may be null → treat as Gold minimum
    planName = (localPlan && localPlan !== "Free") ? localPlan : "Gold";
  } else if (localPlan && localPlan !== "Free") {
    // localStorage cache (handles the refresh() race condition post-payment)
    planName = localPlan;
  } else {
    planName = "Free";
  }

  // Sync localStorage when DB data arrives
  useEffect(() => {
    if (user?.id && dbPlanValid) {
      cacheActivePlan(user.id, dbPlan as PlanName, user.membershipExpiry);
      setLocalPlan(dbPlan as PlanName);
    } else if (!user) {
      clearCachedPlan();
      setLocalPlan(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, dbPlan, user?.membershipExpiry]);

  const planLevel: PlanLevel = (PLAN_LEVEL[planName] ?? 0) as PlanLevel;

  /** Returns true if current plan supports the feature */
  const can = (feature: Feature): boolean => planLevel >= FEATURE_MIN_LEVEL[feature];

  /** Monthly contact reveals: Gold=30, Diamond/Platinum=unlimited */
  const contactLimit = planLevel >= 2 ? Infinity : planLevel === 1 ? 30 : 0;

  /** Monthly interest limit: Free=10, Gold+=unlimited */
  const interestLimit = planLevel >= 1 ? Infinity : 10;

  /** Whether the plan is active and not expired */
  const isPremium = planLevel > 0;

  return {
    planName,
    planLevel,
    isPremium,
    can,
    contactLimit,
    interestLimit,
    planFeatures: PLAN_FEATURES[planName],
  };
}
