<p align="center">
  <h1 align="center">Linksy</h1>
  <p align="center">
    A fast, self-hosted, open-source alternative to Linktree and LinkStack.
    <br />
    Built with Next.js + SQLite. No magic. No bloat.
  </p>
</p>

<p align="center">
  <a href="#features">Features</a> &middot;
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#docker">Docker</a> &middot;
  <a href="#configuration">Configuration</a> &middot;
  <a href="#contributing">Contributing</a>
</p>

---

## Why Linksy?

Existing self-hosted link-in-bio tools are slow, break behind reverse proxies, and have complex dependency chains. Linksy is different:

- **Fast** &mdash; Sub-100ms page loads. Static generation with ISR. Public pages require zero JavaScript.
- **Simple** &mdash; One container, one SQLite file, a handful of env vars. That's it.
- **Hackable** &mdash; Clean codebase, no abstractions for abstractions. Read it, fork it, make it yours.

## Features

- **Public profile pages** &mdash; Clean, mobile-first link pages at `yourdomain.com/username`
- **Link management** &mdash; Add, edit, reorder (drag-and-drop), and toggle links
- **Platform icons** &mdash; Auto-detected from URL (Instagram, YouTube, LinkedIn, Amazon, 60+ platforms) or searchable from 2500+ icons via Font Awesome
- **Click tracking** &mdash; Privacy-safe analytics with hashed IPs and daily rotating salts
- **Admin dashboard** &mdash; Create users, disable accounts, view stats
- **Avatar uploads** &mdash; Local file storage, no external services
- **Reverse proxy ready** &mdash; Works behind Traefik, Nginx, Cloudflare. No hardcoded protocols.
- **One-command deploy** &mdash; Single Docker container with two volumes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org) (App Router, Server Actions) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Database | [SQLite](https://sqlite.org) via [Prisma](https://prisma.io) (WAL mode) |
| Auth | [Auth.js v5](https://authjs.dev) (credentials, JWT) |
| Icons | [Font Awesome Free](https://fontawesome.com) (CC BY 4.0) |
| Drag & Drop | [@dnd-kit](https://dndkit.com) |

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/linksy.git
cd linksy

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your values (at minimum, change AUTH_SECRET)
# Generate a secret: openssl rand -base64 32

# Run database migrations
DATABASE_URL="file:../data/linksy.db" npx prisma migrate dev

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the admin credentials from your `.env.local`.

## Docker

### One-command deploy

```bash
# Create a .env file for Docker
cat > .env << 'EOF'
AUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
AUTH_URL=https://links.yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=changeme
EOF

# Build and run
docker compose up -d
```

### Docker Compose

```yaml
services:
  linksy:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:/app/data/linksy.db
      - AUTH_SECRET=${AUTH_SECRET}
      - AUTH_URL=${AUTH_URL:-http://localhost:3000}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - UPLOAD_DIR=/app/uploads
    volumes:
      - linksy-data:/app/data
      - linksy-uploads:/app/uploads
    restart: unless-stopped

volumes:
  linksy-data:
  linksy-uploads:
```

### Behind Traefik

```yaml
services:
  linksy:
    build: .
    environment:
      - DATABASE_URL=file:/app/data/linksy.db
      - AUTH_SECRET=${AUTH_SECRET}
      - AUTH_URL=https://links.yourdomain.com
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - UPLOAD_DIR=/app/uploads
    volumes:
      - linksy-data:/app/data
      - linksy-uploads:/app/uploads
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.linksy.rule=Host(`links.yourdomain.com`)"
      - "traefik.http.routers.linksy.tls.certresolver=letsencrypt"
      - "traefik.http.services.linksy.loadbalancer.server.port=3000"
    restart: unless-stopped

volumes:
  linksy-data:
  linksy-uploads:
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite connection string | `file:../data/linksy.db` |
| `AUTH_SECRET` | Secret for signing JWT tokens. **Must be set in production.** | &mdash; |
| `AUTH_URL` | Public URL of your Linksy instance | `http://localhost:3000` |
| `ADMIN_EMAIL` | Email for the auto-created admin user | &mdash; |
| `ADMIN_PASSWORD` | Password for the auto-created admin user | &mdash; |
| `UPLOAD_DIR` | Directory for avatar uploads | `./uploads` |

The admin user is created automatically on first boot if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set. Subsequent boots skip creation if the user already exists.

## Project Structure

```
src/
├── app/
│   ├── page.js                        # Landing page
│   ├── login/page.jsx                 # Login
│   ├── (admin)/                       # Admin area (shared layout)
│   │   ├── links/page.jsx             # Link management (drag-and-drop)
│   │   ├── profile/page.jsx           # Profile editor
│   │   └── admin/                     # Admin-only pages
│   │       ├── page.jsx               # Dashboard stats
│   │       └── users/                 # User management
│   ├── [slug]/page.jsx                # Public profile (ISR, zero JS)
│   └── api/
│       ├── auth/[...nextauth]/        # Auth.js endpoints
│       ├── click/                     # Click tracking + redirect
│       └── uploads/[filename]/        # Avatar serving
├── actions/                           # Server actions
├── components/                        # React components
└── lib/                               # Utilities (auth, prisma, icons, etc.)
```

## Development

```bash
# Start dev server
npm run dev

# Run database migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Lint
npm run lint
```

## Roadmap

- [ ] Themes (custom colors, dark mode)
- [ ] Import/export links
- [ ] Custom CSS per profile
- [ ] Link groups/sections
- [ ] QR code generation

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Keep PRs focused &mdash; one feature or fix per PR
- Follow existing code patterns
- Test your changes locally before submitting
- No TypeScript &mdash; this project uses JavaScript intentionally

## License

MIT License. See [LICENSE](LICENSE) for details.

Icons provided by [Font Awesome Free](https://fontawesome.com) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

---

<p align="center">
  Built with care. Self-host everything.
</p>
