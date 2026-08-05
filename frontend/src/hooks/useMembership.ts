/**
 * useMembership — Central hook for plan-based feature gating.
 *
 * Plans (ascending):  Free → Gold → Diamond → Platinum
 *
 * Usage:
 *   const { can, planLevel, planName } = useMembership();
 *   if (!can('messages'))  { // show upgrade prompt }
 */

"use client";

import { useAuth } from "@/context/AuthContext";

export type PlanLevel = 0 | 1 | 2 | 3; // Free=0, Gold=1, Diamond=2, Platinum=3

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
  | "horoscope_view"; // Gold+

const PLAN_ORDER: Record<string, PlanLevel> = {
  "": 0,
  Free: 0,
  Gold: 1,
  Diamond: 2,
  Platinum: 3,
};

const FEATURE_MIN_LEVEL: Record<Feature, PlanLevel> = {
  messages:       1,
  contacts:       1,
  interests:      0,  // free to send, but capped at 10
  who_viewed:     1,
  ai_score:       1,
  priority:       1,
  video_call:     2,
  matchmaker:     3,
  advanced_search:1,
  horoscope_view: 1,
};

export function useMembership() {
  const { user } = useAuth();

  // Derive plan name: explicit plan > isPremium fallback > Free
  const rawPlan = user?.membershipPlan;
  const planName: string = rawPlan ?? (user?.isPremium ? "Gold" : "Free");

  // Resolve numeric level — guarantee min level 1 when isPremium flag is set
  let planLevel: PlanLevel = (PLAN_ORDER[planName] ?? 0) as PlanLevel;
  if (user?.isPremium && planLevel < 1) planLevel = 1;  // at least Gold

  /**
   * Returns true if current plan supports the feature.
   */
  const can = (feature: Feature): boolean => {
    return planLevel >= FEATURE_MIN_LEVEL[feature];
  };

  /**
   * Monthly contact reveals (Gold=30, Diamond/Platinum=unlimited)
   */
  const contactLimit = planLevel >= 2 ? Infinity : planLevel === 1 ? 30 : 0;

  /**
   * Monthly interest limit (Free=10, Gold+=unlimited)
   */
  const interestLimit = planLevel >= 1 ? Infinity : 10;

  return {
    planName,
    planLevel,
    isPremium: planLevel > 0,
    can,
    contactLimit,
    interestLimit,
  };
}
