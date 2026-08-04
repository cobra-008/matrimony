# 02 — Sitemap and User Flows

## Complete Sitemap

### Public Routes (No Auth Required)
| Route | Page | Description |
|---|---|---|
| `/` | Homepage | Hero, trust stats, search widget, success stories |
| `/register` | Registration Wizard | 8-step onboarding wizard |
| `/login` | Login | Mobile OTP + email/password |
| `/forgot-password` | Forgot Password | Password reset initiation |
| `/verify-otp` | OTP Verification | Mobile number OTP input |
| `/success-stories` | Success Stories | Couple testimonials |
| `/about` | About Us | Company story |
| `/safety` | Safety Center | User safety guide |
| `/privacy` | Privacy Policy | Legal policy |
| `/faq` | FAQ | Accordion FAQ |
| `/help` | Help Center | Support hub |
| `/contact` | Contact Us | Contact form |
| `/membership` | Membership Plans | Pricing comparison |
| `/community/[slug]` | Community Pages | Tamil sub-community landing |
| `/religion/[slug]` | Religion Pages | Religion-based landing |
| `/region/[slug]` | Regional Pages | City/state landing pages |
| `/profession/[slug]` | Profession Pages | Profession-based landing |
| `/nri` | NRI Section | NRI/abroad matchmaking |
| `/horoscope` | Horoscope Matching | Jathakam-based matching |
| `/report-abuse` | Report Abuse | Public reporting form |

### Protected Routes (Auth Required)
| Route | Page | Description |
|---|---|---|
| `/onboarding` | Onboarding | Post-registration profile setup |
| `/profile/create` | Create Profile | Complete profile creation |
| `/profile/edit` | Edit Profile | Edit profile sections |
| `/profile/[id]` | Profile Detail | View any profile |
| `/matches` | My Matches | AI-powered recommendations |
| `/search` | Search Hub | Search type selector |
| `/search/regular` | Regular Search | Basic filters |
| `/search/advanced` | Advanced Search | All filters |
| `/search/keyword` | Keyword Search | Text search |
| `/search/id` | Search by ID | Direct profile ID lookup |
| `/online` | Online Members | Currently active members |
| `/interest-sent` | Sent Interests | Track your interests |
| `/shortlisted` | Shortlisted | Saved profiles |
| `/chat` | Chat | Active conversations |
| `/messages` | Messages | All message threads |
| `/call-requests` | Call Requests | Incoming/outgoing call requests |
| `/upgrade` | Upgrade | Payment and tier upgrade |
| `/verification` | Verification | My verification status |
| `/settings` | Settings | Account + privacy controls |
| `/notifications` | Notifications | All notifications |

### Admin Routes (Admin Role Required)
| Route | Page | Description |
|---|---|---|
| `/admin` | Admin Dashboard | Overview metrics |
| `/admin/review` | Profile Review | Approve/reject profiles |
| `/admin/users` | User Management | All users list |
| `/admin/verifications` | Verifications | Document review queue |
| `/admin/reports` | Reports | Abuse report queue |
| `/admin/plans` | Plans | Membership plan management |
| `/admin/audit-logs` | Audit Logs | Security audit trail |

---

## User Journey Maps

### Journey 1: New User Registration
```
Landing on homepage
    ↓
Clicks "Register Free" CTA
    ↓
Step 1: Select "Profile for" (Myself / Son / Daughter / etc.)
    ↓
Step 2: Name + Gender + Date of Birth
    ↓
Step 3: Mobile number → OTP sent → OTP entered ✓
         Email entered
    ↓
Step 4: Religion + Mother Tongue + Community + Sub-caste
    ↓
Step 5: Education + Occupation + Income
    ↓
Step 6: Country + State + City
    ↓
Step 7: Diet + Smoking + Drinking + Horoscope star
    ↓
Step 8: Partner preferences + Photo upload + T&C consent
    ↓
Profile created → Redirect to /matches
    ↓
See first 5 AI-curated matches (immediate value!)
    ↓
Prompted: "Complete your profile to get better matches"
```

### Journey 2: Returning User (Daily Flow)
```
Login (OTP or password)
    ↓
Dashboard / Matches page
    ↓
Browse AI recommendations (with scores)
    ↓
Click profile → Profile detail page
    ↓
Express Interest / Shortlist / Message
    ↓
If premium: View contact / Request call
If free: Prompted to upgrade for contact
    ↓
Chat if interest accepted
    ↓
Offline contact
```

### Journey 3: Search Flow
```
Click Search in nav
    ↓
Choose: Regular / Advanced / Keyword / By ID
    ↓
Set filters (auto-populated from own preferences)
    ↓
Browse results (card grid)
    ↓
Shortlist interesting profiles
    ↓
Express interest on top choices
    ↓
Wait for interest acceptance
    ↓
Chat unlocked on acceptance
```

### Journey 4: Verification Flow
```
Go to /verification
    ↓
See verification status dashboard
    ↓
Step 1: Phone verified (done at registration)
Step 2: Email verification → click email link ✓
Step 3: ID verification → upload Aadhaar/PAN/Passport → admin review
Step 4: Photo verification → take selfie → auto-check ✓
    ↓
Verification badge appears on profile
    ↓
Profile ranked higher in search results
```
