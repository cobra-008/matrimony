# 10 — Risks and Assumptions

## Known Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| Aadhaar API requires govt authorization | High | ⏸️ Skipped | Placeholder UI + placeholder endpoint |
| DigiLocker requires MeitY authorization | High | ⏸️ Skipped | Placeholder UI + placeholder endpoint |
| Real OTP costs money (Twilio ₹0.04/SMS) | Medium | ⏸️ Mocked | Use mocked OTP (dev) → integrate provider when ready |
| Cloudinary not set up | Low | ⏸️ Mocked | Photos served as placeholder; setup guide in `09_progress_log.md` |
| No user data for AI training | Medium | Accepted | Psychology scoring works without training data |
| Supabase account not created | Low | Accepted | Step-by-step guide in `09_progress_log.md` |
| Payment gateway not configured | Medium | ⏸️ Skipped | Razorpay/Stripe UI placeholder; activate when user sets up merchant account |

## Assumptions

1. **Frontend first**: User confirmed that all frontend pages must be complete before backend starts
2. **Tamil content**: All dropdown data (castes, communities, etc.) is in English for Phase 1. Tamil text in Phase 7.
3. **Photos**: Profile photos use placeholder images (Unsplash) in frontend. Real upload when Cloudinary is configured.
4. **Auth**: JWT tokens are mocked in frontend (localStorage). Real auth added with backend.
5. **Deployment**: Vercel for frontend is free tier (sufficient for development). Railway for backend (free tier has limitations — user should upgrade if production traffic expected).
6. **SEO**: Meta tags + structured data added to all pages. Google indexing requires public deployment.

## OTP Provider Options When Ready

| Provider | Free Tier | Monthly Cost | Notes |
|---|---|---|---|
| Twilio | 1 free trial number | ~₹3/SMS | Most reliable, best docs |
| MSG91 | 100 free SMS | ~₹0.18/SMS | India-focused, cheap |
| Fast2SMS | 1000 free credits | ~₹0.15/SMS | Good for India dev |
| Firebase Auth | Free for auth | Generous free tier | Includes Google Sign-In too |

**Recommendation**: Start with **Firebase Auth** (free, includes phone OTP) → migrate to MSG91 for production India traffic.

## Payment Gateway Options When Ready

| Provider | Integration | Notes |
|---|---|---|
| Razorpay | 2% transaction fee | Best for India INR payments |
| Stripe | 2.9% + ₹0.30 | Good for NRI/international payments |

**Recommendation**: Use **Razorpay** for India + **Stripe** for NRI users.

## Activation Checklist (When User Is Ready)

### Activate OTP (Firebase Auth)
1. Go to https://console.firebase.google.com
2. Create project "elite-tamil-matrimony"
3. Enable Authentication → Phone Number
4. Add your domain to Authorized Domains
5. Copy Firebase config to `frontend/.env.local`

### Activate Cloudinary
1. Sign up at https://cloudinary.com (free)
2. Copy Cloud Name, API Key, API Secret
3. Add to `backend/.env` and `frontend/.env.local`
4. Remove mock storage and uncomment real Cloudinary calls in upload service

### Activate Supabase (PostgreSQL)
1. Sign up at https://supabase.com
2. Create project "elite-tamil-matrimony" (Singapore region)
3. Copy Project URL + anon key
4. Run `npx prisma migrate deploy` from backend/ folder

### Activate Aadhaar Verification (Future)
1. Apply for UIDAI Aadhaar API access at https://uidai.gov.in
2. Complete business verification (requires registered Indian company)
3. Get sandbox credentials
4. Implement `backend/src/services/aadhaar.ts`
