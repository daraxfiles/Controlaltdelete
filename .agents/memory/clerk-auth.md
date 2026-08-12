---
name: Clerk auth setup
description: How Clerk is wired into CTRL+ALT+MEDIA — key pitfalls and confirmed decisions.
---

## Rule
This is a Tailwind 3 (PostCSS) project — do NOT include `cssLayerName: "clerk"` in the appearance object and do NOT add `@layer theme, base, clerk, ...` to index.css. That is Tailwind v4 only.

**Why:** The project has both tailwindcss@3 and @tailwindcss/vite@4 in package.json but index.css uses `@tailwind base/components/utilities` directives — confirmed Tailwind 3 path.

## How to apply
- Clerk appearance object: use `theme: shadcn` (imported from `@clerk/themes`), no `cssLayerName`.
- Sign-in/sign-up routes: must use `path="/sign-in/*?"` and `path="/sign-up/*?"` (/*? wildcard required).
- `publishableKey`: always `publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)` from `@clerk/react/internal`.
- `proxyUrl`: `import.meta.env.VITE_CLERK_PROXY_URL` — unconditional, empty in dev is correct.
- Auth state: use `<Show when="signed-in">` / `<Show when="signed-out">` from `@clerk/react`.
- Server protection: `getAuth(req)` from `@clerk/express`; check `auth?.userId`.
- Clerk colors used: colorPrimary `hsl(145,85%,48%)`, colorBackground `hsl(0,0%,5%)`.
