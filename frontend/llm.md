# Elite Tamil Matrimony — LLM Codebase Guide

> **For Claude/AI agents**: Read this file first. It maps the entire codebase so you don't need to re-explore everything from scratch each session.

---

## Project Overview
- **Framework**: Next.js 14 (App Router), TypeScript, Vanilla CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **OTP SMS**: MSG91 widget (exposeMethods mode) via `useMSG91` hook
- **Email**: Resend API via `/api/send-email-otp`
- **Styling**: Global CSS vars in `src/app/globals.css` — `var(--primary)` = #6B1A2A (maroon), `var(--secondary)` = #C8973A (gold)
- **Root**: `c:\Users\cobra\OneDrive\Documents\Project\matrimony\frontend\`

---

## Directory Map

```
frontend/
+-- src/
¦   +-- app/                          # Next.js App Router pages
¦   ¦   +-- page.tsx                  # Homepage (landing + latest profiles carousel)
¦   ¦   +-- login/page.tsx            # Login page — OTP (MSG91 phone, Resend email) + password
¦   ¦   +-- register/page.tsx         # Registration wizard (5 steps)
¦   ¦   +-- matches/page.tsx          # Main matches page with sidebar (1699 lines)
¦   ¦   +-- daily-recs/page.tsx       # Daily recommendations carousel (478 lines)
¦   ¦   +-- profile/
¦   ¦   ¦   +-- [id]/page.tsx         # Profile view (1440 lines)
¦   ¦   ¦   +-- edit/page.tsx         # Profile edit wizard (1185 lines)
¦   ¦   +-- settings/page.tsx         # Settings page (815 lines)
¦   ¦   +-- interests/page.tsx        # Interests sent/received
¦   ¦   +-- membership/page.tsx       # Membership upgrade
¦   ¦   +-- search/page.tsx           # Advanced search
¦   ¦   +-- notifications/page.tsx    # Notifications
¦   ¦   +-- messages/page.tsx         # Messaging (premium)
¦   ¦   +-- shortlisted/page.tsx      # Shortlisted profiles
¦   ¦   +-- api/                      # API routes
¦   ¦       +-- otp-login/route.ts    # Exchange profileId for Supabase tokens
¦   ¦       +-- send-email-otp/route.ts
¦   ¦       +-- verify-email-otp/route.ts
¦   ¦       +-- verify-msg91-token/route.ts
¦   ¦
¦   +-- components/
¦   ¦   +-- layout/
¦   ¦   ¦   +-- Navbar.tsx            # Top nav (986 lines) — switch account via etm_profiles localStorage
¦   ¦   ¦   +-- BottomNav.tsx         # Mobile bottom nav
¦   ¦   ¦   +-- Footer.tsx
¦   ¦   +-- ui/
¦   ¦       +-- Skeleton.tsx          # Loading skeletons
¦   ¦       +-- SearchableSelect.tsx
¦   ¦
¦   +-- context/
¦   ¦   +-- AuthContext.tsx           # useAuth() — user, setUser, logout, refresh
¦   ¦
¦   +-- data/
¦   ¦   +-- matrimony-data.ts         # All dropdowns: RELIGIONS, HEIGHTS, DHOSHAM_OPTIONS, etc.
¦   ¦   +-- mock-profiles.ts          # Demo profiles (MOCK_PROFILES + MOCK_GROOM_PROFILES)
¦   ¦   +-- compatibility-questions.ts # COMPATIBILITY_QUESTIONS + COMPATIBLE_PAIRS
¦   ¦   +-- cities.json               # Cities with state mapping
¦   ¦
¦   +-- hooks/
¦   ¦   +-- useMSG91.ts               # MSG91 OTP hook — sendOtp(phone), verifyOtp(otp), retryOtp(channel)
¦   ¦   +-- useMembership.ts          # can, isPremium, planName, contactLimit
¦   ¦
¦   +-- lib/
¦       +-- supabase.ts               # Supabase client + uploadProfilePhoto()
¦       +-- auth-store.ts             # ALL DB functions (2284 lines)
¦       +-- rate-limit.ts             # Password login rate limiting
```

---

## Auth Flow Summary

### Synthetic Email Auth
- Mobile users get email: `${mobile}@etm.app` (password: `ETM_${mobile}_2024`)
- Multiple profiles same mobile: `mobile_2@etm.app`, ..., `mobile_20@etm.app`
- `auth_email` column on profiles table caches the exact email used
- OTP login: verify OTP ? `/api/otp-login` ? get tokens ? `loginWithOtpSession()`

### Key auth-store.ts Functions
- `registerUser(payload)` — creates Supabase auth + profile
- `fetchProfile(userId)` — gets profile with photos
- `getProfilesByMobile(mobile)` — all profiles for a mobile
- `loginToProfile(profileId)` — fast-path login via auth_email column
- `loginWithOtpSession(at, rt)` — sets Supabase session from tokens
- `fetchMatchProfiles(user)` — top 50 matches (70% prefs + 30% questionnaire)
- `computeMatchScore(user, candidate)` — age(25) + religion(20) + maritalStatus(20) + education(15) + location(20) = 100pts
- `updateProfile(userId, updates)` — partial update via userToDb() snake_case adapter

### DB Tables
profiles, profile_photos, interests, shortlists, profile_views, compatibility_answers, contact_reveals, membership_transactions, notifications

---

## Field Naming: App (camelCase) ? DB (snake_case)
| App field | DB column |
|-----------|-----------|
| partnerAgeMin | partner_age_min |
| partnerReligion | partner_religion |
| partnerMaritalStatus | partner_marital_status (text[]) |
| partnerMotherTongue | partner_mother_tongue (text[]) |
| dhosham | dhosham |
| authEmail | auth_email |
| casteChangeCount | caste_change_count |

---

## Switch Account (Navbar.tsx)
- `localStorage` key: `etm_profiles` ? `StoredProfile[]` = `{id, name, photoUrl, mobile}`
- BUGFIX APPLIED: Filter changed to `p.id !== user?.id` (removed mobile equality check)
- Clicking a profile ? redirects to `/login?mobile=...`

---

## OTP Login Page (login/page.tsx)
- `OTP_SESSION_KEY = etm_otp_resend_${otpIdentifier.trim()}` — per-identifier cooldown in sessionStorage
- Cooldown useEffect runs on `[otpSent]` — BUGFIX: only init cooldown when `otpSent === true`
- Form: `<form onSubmit={handleSendOtp}>` — e.preventDefault() is correctly called

---

## Register Page (register/page.tsx)
- Step 0 DOB: 3 dropdowns (day/month/year) ? `updateDobPart()` ? `form.dob` string
- BUGFIX APPLIED: `validateStep0` now replaces errors instead of merging to clear stale errors

---

## Daily Recs (daily-recs/page.tsx)
- BUGFIX APPLIED: "View Full Profile" button added linking to `/profile/${activeProfile.id}?from=daily-recs`

---

## Profile View Page (profile/[id]/page.tsx)
- BUGFIX APPLIED: Back button uses `router.back()` for consistency when coming from daily-recs

---

## Partner Preferences
- Edit Profile section § 9: pAgeMin/pAgeMax/pReligion/pCaste/pEducation/pOccupation/pIncome/pHeightMin/pHeightMax/pMotherTongue/pMaritalStatus/pCountry
- All saved/loaded correctly in profile/edit/page.tsx (hydratedRef pattern)
- Scoring applied in fetchMatchProfiles via computeMatchScore

---

## Dosham Options
DHOSHAM_OPTIONS in matrimony-data.ts already includes: None, Chevvai, Kethu, Rahu, Rahu and Kethu, Chevvai+Kethu, etc.

---

## Instructions for Next Agent
1. Read this file FIRST before exploring code
2. After making fixes, update the relevant section in this file
3. Dev server: `npm run dev` in the `frontend/` directory
4. Never use localStorage for auth state — use Supabase + AuthContext
5. When editing auth-store.ts, update BOTH dbToUser() and userToDb() for new fields
6. MSG91 requires CAPTCHA_DIV_ID div present in DOM
