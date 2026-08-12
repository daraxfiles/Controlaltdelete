# Running Locally

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | v20+ | Required for running the app |
| **npm** | v9+ | Comes bundled with Node.js |
| **PostgreSQL** | v14+ | Can use local install or cloud service like Neon |

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/bootcamp_db
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=bootcamp_db
SESSION_SECRET=any_random_string_here
```

## NPM Scripts (Commands)

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server (frontend + backend on port 5000) |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push database schema to PostgreSQL |

## Installation Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <project-folder>

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env file with DATABASE_URL pointing to your PostgreSQL

# 4. Push database schema
npm run db:push

# 5. Start development server
npm run dev
```

## Dependencies Summary

### Production Dependencies (32 packages)

- **React Stack:** react, react-dom, wouter (routing), @tanstack/react-query
- **UI Components:** 20+ @radix-ui packages, lucide-react, framer-motion, recharts
- **Forms:** react-hook-form, @hookform/resolvers, zod
- **Styling:** tailwind-merge, class-variance-authority, clsx
- **Backend:** express
- **Database:** drizzle-orm, drizzle-zod, @neondatabase/serverless
- **Utilities:** date-fns, ws, zod-validation-error

### Dev Dependencies (14 packages)

- **Build Tools:** vite, esbuild, tsx, typescript
- **Styling:** tailwindcss, postcss, autoprefixer, @tailwindcss/typography
- **Types:** @types/express, @types/node, @types/react, @types/react-dom, @types/ws
- **Database:** drizzle-kit
- **Replit-specific (can be removed locally):** @replit/vite-plugin-*

## Notes for Local Development

1. **Remove Replit plugins** - In `vite.config.ts`, you can remove or comment out the `@replit/vite-plugin-*` imports as they only work on Replit

2. **Database** - The app uses `@neondatabase/serverless` which works with any PostgreSQL database

3. **Port** - The app serves both frontend and backend on port 5000

4. **TypeScript paths** - The tsconfig.json uses these aliases:
   - `@/*` maps to `./client/src/*`
   - `@shared/*` maps to `./shared/*`
