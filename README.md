# UCarX – Car Ownership Command Center

UCarX is a multi-page React (CDN) experience that helps Egyptian drivers stay on top of vehicles, maintenance, reminders, fines, marketplace listings, and more—all without needing a complex backend to get started.

This repository ships a fully working front-end backed by a lightweight Express API (`server/`) that persists data to JSON files. Run the server locally to explore the product end-to-end, then replace the storage layer with your own infrastructure when ready.

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
- **Express API + `utils/apiClient.js`** exposing the familiar `trickleListObjects` / `trickleCreateObject` helpers backed by JSON persistence.

## Running Locally

### 1. Start the API

```bash
cd server
npm install
npm run start
# → http://localhost:4000
```

The server exposes RESTful endpoints under `/api/*` and also serves the static front-end files from the repository root.

### 2. Browse the UI

Open `http://localhost:4000/index.html` and navigate via the header (e.g., `/dashboard.html`, `/fuel-tracking.html`, etc.).

> ⚠️ If you prefer a separate static dev server, keep the API running on port 4000 and serve the front end elsewhere. The browser scripts default to the same origin, so either proxy `/api` through your static server or set `window.API_BASE_URL` before loading `utils/apiClient.js`.

### Resetting Demo Data

POST to `/api/reset` (or run the snippet below in DevTools) to restore the seeded dataset:

```js
fetch('/api/reset', { method: 'POST' }).then(() => window.location.reload());
```

## Deploying

Because every page is self-contained, you can deploy straight to Vercel/Netlify/GitHub Pages. The included `vercel.json` simply sets `version: 2`, allowing Vercel’s static host to serve each HTML file directly.

```
vercel --prod
```

## Project Structure

- `*.html` – Individual entry pages loading shared components via CDN React+Babel.
- `components/` – UI components shared across pages.
- `server/` – Express API with JSON persistence (development data layer).
- `utils/apiClient.js` – Browser helpers that call the API (mirrors the legacy Trickle helper signatures).
- `utils/carData.js` – Egyptian market brand/model/year reference data.
- `styles.css` – Shared styles (buttons, cards, animations).
- `trickle/` – Notes, schema references, and future back-end documentation.

## Next Steps / Enhancement Roadmap

1. **Swap JSON persistence for a production datastore** (Postgres, Supabase, Firebase, etc.). Keep the existing REST contract or evolve it behind `utils/apiClient.js`.
2. **Production bundling** – migrate the multi-page setup to Vite or Next.js for tree-shaking, code splitting, and asset optimisation.
3. **Authentication & payments** – integrate real OTP, Fawry gateway (or alternative) and secure document storage.
4. **Observability & QA** – add unit tests (Jest/RTL), Playwright smoke tests, plus CI (GitHub Actions) to lint/build before deployment.
5. **UX polish** – add skeleton states, accessibility passes (focus outlines, aria labels), Arabic localisation, dark mode toggle, and PWA capabilities.
6. **AI Assistant backend** – connect `invokeAIAgent` to your preferred LLM provider and maintain conversation history per user session.

## Contributing

1. Fork & clone.
2. Branch off `main` (or your feature branch).
3. Update the relevant HTML/JS/CSS.
4. Test locally via a static server.
5. Submit a pull request describing the improvement.

Enjoy building with UCarX! If you run into issues or have enhancement ideas, open an issue or start a discussion. 🚗💨