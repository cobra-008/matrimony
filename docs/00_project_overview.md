# 00 — Project Overview: Elite Tamil Matrimony

## Product Name
**Elite Tamil Matrimony** (ETM)

## Tagline
*"Find Your Perfect Tamil Match — Trusted, Verified, Intelligent"*

## Product Vision
Elite Tamil Matrimony is a premium, full-scale matrimonial platform built specifically for Tamil users across India and the Tamil diaspora worldwide. It combines the trust-first information architecture of established matrimony platforms with original Tamil cultural identity, psychology-based AI matchmaking, and a modern premium UI/UX that feels significantly more sophisticated than any existing Tamil matrimony product.

## Target Audience
- Tamil-speaking singles (ages 20–45) seeking marriage
- Parents, siblings, and guardians creating profiles on behalf of family members
- Tamil diaspora (NRI users in the US, UK, Canada, Australia, Singapore, UAE)
- All religions within Tamil culture: Hindu, Christian, Muslim, Jain, Buddhist

## Core Value Propositions
1. **Trust-first**: Every profile is verified. Badges signal verification level clearly.
2. **AI-powered**: Psychology-based compatibility scoring explains *why* a match is good.
3. **Tamil-first**: Platform speaks Tamil culture — communities, regions, traditions, and language (Phase 7).
4. **Privacy-centered**: Phone numbers hidden by default. Women's safety is a design principle, not an afterthought.
5. **Premium UX**: Does not look or feel like a 2010-era matrimony site. Modern, warm, alive.

## Business Model
| Tier | Price Model | Key Features |
|---|---|---|
| Free | Free forever | 10 interests/month, browse profiles, no contact reveal |
| Gold | ₹999/month | Unlimited interests, 30 contact reveals, AI match score |
| Diamond | ₹1,999/month | Unlimited everything, priority listing, advanced filters |
| Platinum Concierge | ₹9,999/3 months | Human matchmaker, curated recommendations, background check |

## Project Owner (Intern)
First project — learning production-grade full-stack development.

## Tech Stack Summary
| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js (Express + Prisma) — built after frontend |
| AI Service | FastAPI (Python) — psychology-based scoring |
| Database | PostgreSQL via Supabase |
| Storage | Cloudinary (images) — mocked initially |
| Auth | JWT + Mobile OTP (mocked, real provider later) |
| Deployment | Vercel (frontend) + Railway (backend + AI) |

## Key Design Decisions
- **Color Palette**: Warm Rose-Gold + Bright Amber (positive, festive, not dark red)
- **Typography**: Playfair Display (headings) + Inter (body text)
- **Motion**: Framer Motion for page transitions and micro-interactions
- **Dropdowns**: Full real data (all Indian religions, Tamil castes, occupations, locations)
- **Mobile-first**: Designed for mobile, enhanced for desktop

## Intentionally Skipped (logged for later)
- Aadhaar/DigiLocker verification → requires government API authorization
- Real OTP provider → mocked for development; add Twilio/MSG91 when ready
- Cloudinary → mocked initially; setup guide in `06_verification_flow.md`
- Tamil language UI → Phase 7

## Project Directory Structure
```
elite matrimony/
├── docs/                    # All 12 documentation files
├── frontend/                # Next.js 14 App Router project
│   ├── src/app/             # All routes (App Router)
│   ├── src/components/      # Reusable components
│   ├── src/lib/             # Utilities and helpers
│   ├── src/hooks/           # Custom React hooks
│   ├── src/data/            # Static data (dropdowns, mock data)
│   ├── src/types/           # TypeScript types
│   └── public/              # Static assets
├── backend/                 # Node.js Express + Prisma (Phase 2 backend)
└── ai-service/              # FastAPI Python service (Phase 2 backend)
```

## Document Index
| File | Purpose |
|---|---|
| 00_project_overview.md | This file — big picture |
| 01_research_and_reference.md | BharatMatrimony UX analysis |
| 02_sitemap_and_user_flows.md | All routes + user journey maps |
| 03_design_system.md | Colors, typography, components |
| 04_database_schema.md | Full PostgreSQL schema |
| 05_api_contracts.md | All API endpoint definitions |
| 06_verification_flow.md | Verification + OTP + storage setup guides |
| 07_ai_matchmaking.md | Scoring algorithm and psychology framework |
| 08_implementation_plan.md | Phased execution plan |
| 09_progress_log.md | Living log of all changes (update after every milestone) |
| 10_risks_and_assumptions.md | Known gaps, blockers, and assumptions |
| 11_testing_checklist.md | Test coverage checklist |
| 12_handoff.md | Handoff document for the next Claude session |
