# Food Diversity Tracker

A mobile-first PWA for tracking the diversity of plant foods you eat each week to improve gut microbiome diversity, inspired by research from the American Gut Project.

Built with React, TypeScript, Tailwind CSS, and Vite. All data is stored locally on your device via localStorage — no accounts, no servers, no tracking.

## How It Works

Each unique plant food you log counts as **1 point**. Herbs and spices count as **¼ point** each. The default goal is 30 points per week, but you can set your own target in Settings with friendly tiers (Seedling 20, Blooming 30, Thriving 40) or a custom value.

### What counts

- **Fruits & vegetables** — each variety counts separately (e.g. red and green bell peppers are 2 points)
- **Whole grains** — oats, quinoa, brown rice, etc.
- **Legumes & pulses** — beans, lentils, chickpeas, tofu
- **Nuts & seeds** — almonds, chia seeds, flax, etc.
- **Herbs & spices** — ¼ point each (basil, cumin, turmeric, etc.)
- **Other plant foods** — coffee, tea, dark chocolate (70%+)

### What doesn't count

- Meat, fish, dairy (unless plant-based)
- Ultra-processed foods (chips, white bread, fruit juice)

### Fermented foods

Kimchi, sauerkraut, miso, and other fermented foods are tracked as a bonus category but don't contribute to your plant score. They're recommended separately for adding beneficial bacteria.

## Features

- **Progress ring** showing your weekly score with color-coded thresholds
- **Configurable weekly goal** — choose a preset tier or set a custom target
- **300+ built-in foods** organized by category, searchable and filterable
- **Multi-select logging** — tap several foods at once after a meal
- **Saved meals** — save common food combos and log them in one tap
- **Custom foods** — add anything not in the database; it's remembered for next time
- **Recent foods** — quickly re-log foods from previous weeks
- **Weekly history** with streak tracking, averages, and per-week drill-down
- **First-time welcome modal** with how-it-works guide and scoring breakdown
- **Data export/import** for manual backups (JSON) — save to your cloud for safekeeping
- **Offline support** — works without internet once installed as a PWA
- **Configurable week start** — Monday (default) or Sunday

## Data & Privacy

All data lives in your browser's localStorage on your device. Nothing is sent to any server. This means:

- Your data stays completely private
- If you clear browser data or switch devices, your history is lost
- **Back up regularly** — use Settings → Export JSON and save the file to iCloud, Google Drive, Dropbox, or wherever you keep important files. You can restore anytime via Import JSON.

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```
git clone https://github.com/yourusername/food-tracker.git
cd food-tracker
npm install
```

### Dev server

```
npm run dev
```

Opens at `http://localhost:5173/food-tracker/`.

### Run tests

```
npm test
```

Unit tests cover storage, week scoring/streak logic, the food database, and the React context layer. Uses Vitest with jsdom and React Testing Library.

### Build

```
npm run build
```

Outputs to `dist/`. Includes service worker generation for offline PWA support.

### Preview production build

```
npm run preview
```

## Deployment

Deployed automatically to GitHub Pages on push to `main` via the workflow in `.github/workflows/deploy.yml`. The app is served from the `/food-tracker/` base path.

To set up GitHub Pages for your fork: go to **Settings → Pages → Source** and select **GitHub Actions**.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for dev/build tooling
- **Tailwind CSS** for styling
- **vite-plugin-pwa** for service worker and manifest generation
- **Vitest** + React Testing Library for tests
- **localStorage** for data persistence
