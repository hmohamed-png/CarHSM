# UCarX – Car Ownership Command Center

UCarX is a multi-page React (CDN) experience that helps Egyptian drivers stay on top of vehicles, maintenance, reminders, fines, marketplace listings, and more—all without needing a complex backend to get started.

This repository ships a fully working front-end backed by a lightweight storage layer that runs entirely in the browser (via `localStorage`). You can deploy it statically (e.g., on Vercel) and immediately explore the product, then swap the mock data layer with your own APIs when you are ready for production integrations.

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
- **Mock Trickle client** (`utils/trickleMock.js`) that emulates `trickleListObjects`, `trickleCreateObject`, etc. using `localStorage` so the UI works end-to-end without external services.

## Running Locally

1. **Serve the project** from the repo root:
   ```bash
   # Option A – Python
   python3 -m http.server 4173

   # Option B – Vercel CLI or any static server works too
   npx serve .
   ```
2. Visit `http://localhost:4173/index.html` (or the port your server printed).
3. Navigate the app via the top navigation or direct URLs (e.g., `/dashboard.html`, `/fuel-tracking.html`, etc.).

> ⚠️ Opening the HTML files via `file://` will block `localStorage` on some browsers. Always use a local web server.

### Resetting Demo Data

The mock data is persisted per browser profile. To restore the seeded sample content open DevTools and run:

```js
trickleResetStore();
window.location.reload();
```

## Deploying

Because every page is self-contained, you can deploy straight to Vercel/Netlify/GitHub Pages. The included `vercel.json` simply sets `version: 2`, allowing Vercel’s static host to serve each HTML file directly.

```
vercel --prod
```

## Project Structure

- `*.html` – Individual entry pages loading shared components via CDN React+Babel.
- `components/` – UI components shared across pages.
- `utils/trickleMock.js` – In-browser data store & AIAgent mock.
- `utils/carData.js` – Egyptian market brand/model/year reference data.
- `styles.css` – Shared styles (buttons, cards, animations).
- `trickle/` – Notes, schema references, and future back-end documentation.

## Next Steps / Enhancement Roadmap

1. **Replace the mock data layer** with a real backend (REST/GraphQL). Start by porting `trickleMock` to API calls so the UI code stays intact.
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