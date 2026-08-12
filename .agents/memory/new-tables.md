---
name: Schema new tables
description: New DB tables added for auth-dependent features; all pushed to Postgres.
---

## Tables added to shared/schema.ts
- `userProfiles` — clerkUserId (unique), displayName, crewName, bio, role, foundingCrew (bool), language
- `missionProgress` — clerkUserId + missionId + status (started/completed) + notes
- `powerPings` — clerkUserId, projectTitle, recipientName/org/role, questions, status, responseNotes
- `evidenceReceipts` — clerkUserId, projectTitle, mainClaims, sources, verificationSteps, isPublic
- `rebootRoomResponses` — patchId, clerkUserId (nullable), action (verify/amplify/apply), comment, isAnonymous

## Founding Crew badge logic
First user to create a userProfile gets `foundingCrew: true`. Check: in `upsertUserProfile()` — if no existing profiles exist, set foundingCrew=true on insert.

**Why:** Honest zero-state design — the badge rewards genuinely first crew members.
