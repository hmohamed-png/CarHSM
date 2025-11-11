# UCarX – Car Ownership Command Center

UCarX is a multi-page React (CDN) experience that helps Egyptian drivers stay on top of vehicles, maintenance, reminders, fines, marketplace listings, and more—all without needing a complex backend to get started.

This repository now ships a fully working front-end backed by an Express API (`server/`) that talks to a PostgreSQL database through Prisma. Run the stack locally to explore the product end-to-end, then scale the same schema into your managed database when you are ready for production.

## Feature Highlights

- Vehicle garage with maintenance history & upcoming reminders.
- Fuel tracking with rolling stats and sparkline chart.
- Traffic fines dashboard including Fawry-style payment flow simulation.
- Marketplace listings & multi-step listing creation wizard.
- Secure document locker, notifications center, WhatsApp template manager, AI assistant shell, and more.
- Global styling (`styles.css`) supplying shared button + card treatments for brand consistency.

## Tech Stack

- **React 18** via CDN + Babel (per-page mounting).
- **TailwindCSS** CDN utility layer, plus handcrafted CSS for shared UI primitives.
- **Chart.js** (via CDN) for analytics/fuel visualisations (auto-fallback when CDN fails).
- **Express API + Prisma + PostgreSQL** exposing the familiar `trickleListObjects` / `trickleCreateObject` helpers backed by a relational datastore.

## Running Locally

### 1. Start the API

1. Provision PostgreSQL (local Docker, Supabase, Neon, etc.).
2. Configure your connection string:
   ```bash
   cd server
   cp .env.example .env
   # edit DATABASE_URL=... to point at your database
   ```
3. Install dependencies and prepare the schema + seed data:
   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:push   # creates tables from prisma/schema.prisma
   npm run prisma:seed   # loads server/seed.json into the database
   npm run dev           # or npm start for production mode
   # → http://localhost:4000
   ```

The server exposes RESTful endpoints under `/api/*` and also serves the compiled client (when `client/dist` exists).

After evolving the schema, generate a migration and commit it alongside your changes:

```bash
npm run prisma:migrate -- --name meaningful-change
```

### 2. Run the client (Vite)

```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies `/api` calls to the Express backend. Browse via the in-app navigation (e.g., `http://localhost:5173/dashboard`, `/fuel-tracking`, etc.).

> ⚠️ For a single origin experience (no Vite dev server), run `npm run build` inside `client/`; the Express server will automatically serve the compiled assets from `client/dist`.

### Resetting Demo Data

Two options:

- Re-run the seed script: `cd server && npm run prisma:seed`
- Or hit the API reset endpoint (shown below) which truncates the tables and reloads `seed.json`:

  ```js
  fetch('/api/reset', { method: 'POST' }).then(() => window.location.reload());
  ```

## Deploying

1. Build the client:
   ```bash
   cd client
   npm run build
   ```
2. The Express server automatically serves `client/dist` when it exists. Deploy the `server/` directory (plus the generated `client/dist`) to your Node hosting provider of choice (Vercel, Render, Fly.io, etc.).

> Tip: set `VITE_API_BASE_URL` during the Vite build if your API is hosted on a different origin.

## Project Structure

- `client/` – Vite + React app (components, pages, routes, styles).
- `server/` – Express + Prisma API (PostgreSQL schema, seed data, routes).
- `prisma/` – Prisma schema, migrations, and the reusable seed tooling.
- `utils/` (legacy) – Kept for reference while migrating from the static prototype.
- `styles.css` – Shared styles (buttons, cards, animations) mirrored in the Vite app.
- `trickle/` – Notes, schema references, and future back-end documentation.

## Continuous Integration

- GitHub Actions workflow (`.github/workflows/ci.yml`) provisions Postgres 16, installs server dependencies, runs Prisma migrations, seeds demo data, and smoke tests the REST API on every push or pull request.
- Override `DATABASE_URL` with repository/environment secrets in CI when targeting hosted databases.

## Next Steps / Enhancement Roadmap

1. **Authentication & payments** – integrate real OTP, Fawry gateway (or alternative) and secure document storage.
2. **Observability & QA** – add unit tests (Jest/RTL), Playwright smoke tests, plus CI (GitHub Actions) to lint/build before deployment.
3. **UX polish** – add skeleton states, accessibility passes (focus outlines, aria labels), Arabic localisation, dark mode toggle, and PWA capabilities.
4. **AI Assistant backend** – connect `invokeAIAgent` to your preferred LLM provider and maintain conversation history per user session.

## Contributing

1. Fork & clone.
2. Branch off `main` (or your feature branch).
3. Update the relevant HTML/JS/CSS.
4. Test locally via a static server.
5. Submit a pull request describing the improvement.

Enjoy building with UCarX! If you run into issues or have enhancement ideas, open an issue or start a discussion. 🚗💨