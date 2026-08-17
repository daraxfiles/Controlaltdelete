---
name: UArk Hub Architecture
description: Community hub system added for CTRL+ALT+MEDIA @ UArk — schema, routes, storage, and frontend pages.
---

## What was built

CTRL+ALT+MEDIA @ UArk is a localized community hub layered on top of the existing platform.

**Why:** The architecture was designed to be extensible — new communities (e.g. @ NWA, @ Another University) can be added by inserting a row into the `communities` table and creating new routes under `/community/<slug>`.

## New DB tables (all nullable-FK safe, no breaking migrations)
- `communities` — slug-keyed hub entities; seeded with `uark` (cardinal #9e1b32)
- `cohorts` — course/group within a community (not yet exposed in UI)
- `community_questions` — Razorback Questions; status flow: submitted → under_review → open_for_investigation → investigation_started → patch_published → closed
- `question_upvotes` — toggle upvotes per user per question

## Additive columns on existing tables
- `reboot_projects.hub_slug` (nullable) — link project to a community hub
- `media_patches.hub_slug` (nullable) — link patch to a community hub
- `power_pings.hub_slug` (nullable) — link ping to a community hub
- `power_pings.impact_outcome` / `impact_description` (nullable) — impact tracking

## New API routes
- GET /api/communities — list all active communities
- GET /api/communities/:slug — single community
- GET /api/community/:slug/stats — aggregated stats (patches, questions, pings, evidenceReceipts)
- GET /api/community/:slug/patches — hub-scoped media patches
- GET /api/community-questions/:slug — approved questions (public)
- GET /api/community-questions/:slug/my-upvotes — user's upvoted IDs (authenticated)
- POST /api/community-questions/:slug — submit question (authenticated)
- POST /api/community-questions/:id/upvote — toggle upvote (authenticated)
- PATCH /api/admin/community-questions/:id — moderate question
- GET /api/admin/community-questions — all questions for admin
- PATCH /api/power-pings/:id/impact — record impact outcome (owner only)

## New static data file
`shared/uark-missions.ts` — 8 UArk-specific missions (AI Said What About Arkansas?, Who Gets Quoted at UArk?, Razorback Rumor Trace, Algorithm Audit, Information Desert Map, Public Document Decoder, Search Yourself, Accessibility Audit)

## New frontend pages
- `/community/uark` — UArk landing page (uark.tsx)
- `/community/uark/questions` — Razorback Questions with submit form + upvoting (uark-questions.tsx)
- `/community/uark/patches` — UArk-scoped patch archive with topic/media filters (uark-patches.tsx)

## Navigation
- Desktop: `CommunitiesDropdown` component in header.tsx renders a dropdown from nav
- Mobile: Communities section added to mobile Sheet menu

## UArk-specific badges added to gamification.ts
razorback_investigator, ai_auditor, campus_fact_checker, information_mapper, community_listener, power_ping_uark, patch_the_campus, evidence_first

**How to apply:**
- To add a new community: INSERT into `communities` with a new slug; create pages under `/community/<slug>` following the uark.tsx pattern; add routes to App.tsx; add an entry to the COMMUNITIES array in header.tsx.
- Existing records without a hub_slug are unaffected — all new columns are nullable.
