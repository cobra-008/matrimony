# 06 — Verification Flow

## Overview
Elite Tamil Matrimony has a 4-level verification system. Each level adds a badge and increases profile ranking in search results.

## Verification Levels

| Level | Badge | How | Status |
|---|---|---|---|
| Level 1 | 📱 Phone Verified | OTP at registration | ✅ Implemented (mocked) |
| Level 2 | ✉️ Email Verified | Click email link | ✅ Implemented (mocked) |
| Level 3 | 🪪 ID Verified | Upload ID → admin review | ⚙️ UI placeholder |
| Level 4 | 🤳 Photo Verified | Selfie liveness check | ⚙️ UI placeholder |
| Level 5 | 🏛️ Aadhaar | UIDAI API | ⏸️ SKIPPED - needs govt auth |

## OTP Flow (Currently Mocked)

### Mock behavior (dev)
- Any 6-digit code is accepted
- Console.log shows the OTP
- Real integration: add provider credentials

### To activate real OTP (Twilio):
1. Sign up at https://www.twilio.com/try-twilio (free trial: $15 credit)
2. Get: Account SID, Auth Token, Phone Number
3. Add to `backend/.env`:
   ```
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=+1...
   ```
4. In `backend/src/services/otp.ts`, uncomment the Twilio client block

### To activate real OTP (MSG91 - India-recommended):
1. Sign up at https://msg91.com
2. Create a "Flow" template for OTP
3. Get: Auth Key, Template ID
4. Add to `backend/.env`:
   ```
   MSG91_AUTH_KEY=...
   MSG91_TEMPLATE_ID=...
   ```

## Cloudinary Setup (Image Upload)

### Current state
- Photo uploads return a placeholder URL
- Images stored as `/placeholder/profile-{id}.jpg`

### To activate Cloudinary (free tier = 25GB):
1. Sign up at https://cloudinary.com (no credit card needed)
2. Go to Dashboard
3. Copy:
   - Cloud Name (e.g., `dxxxxx`)
   - API Key (e.g., `123456789012345`)
   - API Secret (e.g., `abc123...`)
4. Add to `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Add to `frontend/.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```
6. In `backend/src/services/storage.ts`, uncomment the Cloudinary upload block

## Document Verification Flow (Placeholder UI)

### User flow
1. User goes to `/verification`
2. Selects document type: Aadhaar | PAN | Passport | Voter ID
3. Uploads front + back of document
4. Submits → Status shows "Under Review"
5. Admin reviews in `/admin/verifications`
6. Admin approves/rejects → User notified

### Admin review flow
1. Admin sees queue in `/admin/verifications`
2. Views uploaded documents
3. Checks name matches profile
4. Clicks Approve → badge added to profile
5. Or Reject with reason → user can re-upload

## Aadhaar Verification (SKIPPED)

**Why skipped**: UIDAI requires businesses to register and get authorized API access. This cannot be done without a registered Indian company and formal approval process.

**When user is ready to activate**:
1. Register company with UIDAI at https://uidai.gov.in
2. Apply for API access (takes 4–8 weeks)
3. Get sandbox + production credentials
4. Implement in `backend/src/services/aadhaar.ts`
5. Update `/verification` page to show Aadhaar option

## Selfie / Face Verification (Placeholder)

### Current state
- UI exists (take photo → show preview → submit)
- No actual face matching — just stores the selfie
- Admin reviews selfie vs profile photo manually

### Future state (when ready)
- Use AWS Rekognition or Azure Face API for automated liveness + match check
- Add to `ai-service/face_verify.py`
