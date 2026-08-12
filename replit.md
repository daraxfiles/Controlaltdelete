# CTRL+ALT+MEDIA

A youth-powered creative technology, AI literacy, civic media, and alternative journalism lab. Young people investigate failures in the information system, build verified alternatives, and take their work directly to the people with the power to respond.

**The public record has crashed. Youth reboot it.**

## Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Radix UI, TanStack Query, Wouter, React Hook Form
- **Backend:** Express (Node.js), TypeScript
- **Database:** PostgreSQL via Drizzle ORM + `@neondatabase/serverless`
- **Design:** Dark terminal-inspired UI, electric green primary, monospace typography

## Routes

| Path | Page |
|---|---|
| `/` | Homepage — hero, three keys, protocol, featured patches |
| `/reboot-protocol` | The Reboot Protocol — interactive 7-stage explainer |
| `/missions` | Missions Library — 10 guided investigations |
| `/reboot-crews` | Reboot Crews — team formation info |
| `/media-patches` | Media Patches — public archive of verified work |
| `/reboot-room` | Reboot Room — audience Verify / Amplify / Apply |
| `/resources` | Resource Vault — 20+ curated tools |
| `/about` | About — platform info, roles, values, safety |
| `/dashboard` | Dashboard — demo youth member control center |
| `/create` | Create — 4-step project creation form |
| `/sign-in` | Sign In — auth (demo mode) |
| `/sign-up` | Sign Up — invitation-based access request |

## Database Tables

- `media_patches` — public Media Patches with verification/response status
- `reboot_projects` — in-progress youth investigations
- `contacts` — contact/inquiry submissions
- `projects` — legacy table (kept for backward compat)

## Running

Requires `DATABASE_URL` (PostgreSQL) and `SESSION_SECRET` env vars.

```bash
npm install
npm run db:push   # create/update schema
npm run dev       # starts on port 5000
```

## Sample Data

Three fictional projects seed automatically on first run:
1. **The Bus Route Blackout** — multilingual transit route explainer
2. **What the Headline Left Out** — documentary on media framing
3. **AI Does Not Know Our History** — AI audit + verified digital archive

## User Preferences

- Use this project's design as the foundation for the CTRL+ALT+MEDIA platform
- Keep the dark terminal aesthetic, electric green (#00d452) primary, monospace font
- Do not go viral. Go verified.
