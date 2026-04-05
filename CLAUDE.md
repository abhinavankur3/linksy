# CLAUDE.md

## Project Overview

Linksy is a self-hosted, open-source link-in-bio app (Linktree/LinkStack alternative). Sub-100ms page loads, zero JS on public pages, single Docker container with SQLite.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions, ISR)
- **Language**: JavaScript (no TypeScript — intentional choice)
- **Styling**: Tailwind CSS v4
- **Database**: SQLite via Prisma ORM (WAL mode)
- **Auth**: Auth.js v5 (credentials provider, JWT sessions)
- **Icons**: Font Awesome Free (auto-detected from URLs)
- **Drag & Drop**: @dnd-kit
- **Path alias**: `@/*` → `./src/*`

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build (runs migrations first)
npm run start        # Production server
npm run lint         # ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Prisma Studio GUI
```

## Architecture

```
src/
├── app/
│   ├── (admin)/         # Protected admin routes (links, profile, admin dashboard)
│   ├── [slug]/          # Public profile pages (ISR, 60s revalidation, zero JS)
│   ├── api/             # Auth endpoints, click tracking, file serving
│   └── login/           # Login page
├── actions/             # Server actions (auth, links, link-groups, profile, users, icons, qr)
├── components/
│   ├── admin/           # Admin shell, sidebar, header
│   ├── links/           # Link/group management (drag-and-drop, icon picker)
│   ├── profile/         # Profile editor, theme picker, QR code
│   └── public/          # Public page components + theme layouts
├── lib/                 # Utilities (auth, prisma, icons, themes, rate-limit, slug validation)
├── middleware.js        # Route protection
└── instrumentation.js   # Startup: admin seed + WAL mode
```

## Key Patterns

- **Server Components** by default; `"use client"` only when needed
- **Server Actions** in `src/actions/` for all mutations
- **Form state** via `useActionState()` hook
- **Cache invalidation** via `revalidatePath()`
- **Direct Prisma queries** in server components for reads
- **No component libraries** — raw Tailwind classes only

## Database (Prisma/SQLite)

Models: `User` → `Profile` (1:1) → `Link` (1:many), `LinkGroup` (1:many) → `Link`, `Click`

- Cascade deletes on profile/link relations
- Icon format: `"fab:instagram"`, `"fas:globe"`
- Positions are integer-based for drag-and-drop ordering

## Environment Variables

```
DATABASE_URL="file:../data/linksy.db"
AUTH_SECRET="..."
AUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="changeme"
UPLOAD_DIR="./uploads"
```

## Notable Details

- Click tracking uses SHA256-hashed IPs with daily rotating salt
- Rate limiting: 30 clicks/min/IP (in-memory)
- Slug validation: regex + reserved word list in `src/lib/slug.js`
- 9 built-in themes with layout variants (classic, card, cover, section-list)
- Avatar uploads stored locally in `UPLOAD_DIR`
- Admin auto-seeded from env vars on first startup
