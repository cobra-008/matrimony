# 05 — API Contracts

## Base URL
- Development: `http://localhost:4000/api`
- Production: `https://api.elite-tamil-matrimony.com/api`

## Authentication
All protected routes require:
```
Authorization: Bearer <jwt_token>
```

## Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "error": null
}
```

---

## Auth Endpoints

### POST /auth/register
Register new user (Step 1 of wizard)
```json
// Request
{ "mobile": "+919876543210", "profile_for": "self" }
// Response
{ "success": true, "data": { "otp_sent": true, "session_id": "..." } }
```

### POST /auth/verify-otp
```json
// Request
{ "session_id": "...", "otp": "123456" }
// Response
{ "success": true, "data": { "token": "jwt...", "user_id": "uuid..." } }
```

### POST /auth/login
```json
// Request
{ "mobile": "+919876543210", "password": "..." }
// OR OTP flow:
{ "mobile": "+919876543210", "otp": "123456" }
// Response
{ "success": true, "data": { "token": "jwt...", "profile": { ... } } }
```

### POST /auth/forgot-password
```json
{ "email": "user@example.com" }
```

---

## Profile Endpoints

### POST /profile/create
Create full profile (multi-step, autosaved per step)
```json
// Body: any subset of profile fields
{ "full_name": "...", "gender": "male", "date_of_birth": "1995-05-15", ... }
```

### GET /profile/:id
Get public profile by ID
```json
// Response
{
  "data": {
    "id": "uuid",
    "display_name": "Karthik S.",
    "age": 29,
    "city": "Chennai",
    "community": "Vellalar",
    "education": "B.Tech",
    "occupation": "Software Engineer",
    "photos": [...],
    "verification": { "phone": true, "email": true, "id": false },
    "compatibility": { "score": 87, "reasons": [...] },
    "contact_visible": false
  }
}
```

### PUT /profile/:id
Update profile (section-by-section)

### DELETE /profile/:id
Soft-delete profile

---

## Search Endpoints

### GET /search/regular
```
Query params: gender, age_min, age_max, religion, mother_tongue, country, state, city, page, limit
```

### GET /search/advanced
```
All regular params + height_min, height_max, marital_status, education, occupation, income_min, diet, with_photo, verified_only, active_within
```

### GET /search/keyword
```
Query params: q (text), page, limit
```

### GET /search/id
```
Query params: profile_id
```

### GET /members/online
```
Returns profiles active in the last 30 minutes
```

---

## Match / Interest Endpoints

### GET /matches
AI-ranked match recommendations for authenticated user

### POST /interests
Send interest to a profile
```json
{ "receiver_id": "uuid", "message": "Optional intro message" }
```

### PATCH /interests/:id
Accept or decline interest
```json
{ "status": "accepted" }
```

### GET /interests/sent
Get all interests sent by user

### POST /shortlists
Shortlist a profile
```json
{ "profile_id": "uuid" }
```

### DELETE /shortlists/:id
Remove from shortlist

---

## Messaging Endpoints

### GET /messages
Get all chat threads

### GET /messages/:threadId
Get messages in a thread

### POST /messages/:threadId
Send a message
```json
{ "content": "Hello..." }
```

---

## AI Service Endpoints (FastAPI at :8000)

### POST /ai/match-score
```json
// Request
{ "profile_id": "uuid", "candidate_id": "uuid" }
// Response
{
  "score": 87,
  "grade": "Excellent",
  "reasons": ["Shared community values", "Lives in Chennai", "Similar education"],
  "breakdown": { "community": 25, "education": 18, "age": 15, ... }
}
```

### GET /ai/recommendations/:profileId
Get top 20 recommended matches with scores

---

## Admin Endpoints

### GET /admin/users (Admin only)
### GET /admin/profiles/pending (Admin only)
### PATCH /admin/profiles/:id/status (Admin only)
### GET /admin/reports (Admin only)
### PATCH /admin/reports/:id (Admin only)
### GET /admin/audit-logs (Admin only)
