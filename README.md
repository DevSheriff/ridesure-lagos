# 🏍️ RideSure — Community-Powered Navigation for Lagos Delivery Riders

> **"No Stories, Just Deliveries..."**

RideSure is a real-time, community-driven navigation and hazard-reporting web application built specifically for delivery riders in Lagos, Nigeria. Riders can crowdsource road intelligence — from police checkpoints and extortion zones to bad roads and flooded areas — helping each other navigate the city safely and efficiently.

**Live App**: [RideSure on Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)  
**GitHub Repository**: [github.com/YOUR_USERNAME/YOUR_REPO_NAME](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [Components Breakdown](#components-breakdown)
7. [Iteration History](#iteration-history)
8. [Getting Started](#getting-started)
9. [Project Structure](#project-structure)
10. [API & External Services](#api--external-services)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview

Lagos presents unique challenges for delivery riders: gated estates requiring ID checks, police/LASTMA checkpoints, flooded roads, extortion zones, and unpredictable road conditions. **RideSure** solves this by letting riders collectively map these obstacles in real time, so every rider benefits from the community's knowledge.

The app features an interactive Leaflet-based map centered on Lagos with real-time pin updates powered by a cloud backend, turn-by-turn bike navigation via OSRM, a hazard heatmap overlay, delivery rating system, and a personal dashboard for tracking contributions.

---

## Key Features

### 🗺️ Interactive Map
- Full-screen Leaflet map centered on Lagos (6.5244°N, 3.3792°E) with CARTO tile layers
- Dark and light theme support with different tile styles
- Smooth fly-to animations and route-fitting on navigation

### 📌 Community Pin System
- **8 built-in categories**: Road Block, Estate Gate, Bad Road, Speed Bump, Flooding, Police/LASTMA, Bike Entrance, Extortion Zone
- **Custom categories**: Riders can create their own pin categories with custom icons and colors
- **Crowdsourced validation**: Pins start as temporary and need **3 upvotes within 24 hours** to become permanent
- **Automatic expiry**: A backend function (`expire-pins`) removes temporary pins with 0 upvotes after 24 hours
- **Vote tracking**: Local storage-based duplicate vote prevention (one vote per pin per device)

### 🚨 Quick Extortion Report
- One-tap floating button to instantly report extortion zones at your current GPS location
- Uses device geolocation with high accuracy for precise pin placement

### 🔍 Smart Search & Navigation
- **Dual search**: Instant results from 30+ hardcoded Lagos locations + live geocoding via OpenStreetMap Nominatim
- **Debounced geocoding**: 400ms debounce with Lagos-bounded results for relevant suggestions
- **Bike routing**: Turn-by-turn directions via OSRM's free bike profile API
- **Route visualization**: Blue polyline overlay with distance and duration estimates

### 🔥 Seizure Heatmap
- Toggle overlay showing high-risk zones based on recent hazard pin density
- Groups pins into ~500m grid cells; zones with 2+ reports in the last hour are highlighted
- Color intensity scales with report density (red gradient)

### ⭐ Delivery Rating System
- Post-delivery feedback modal with star ratings for address accuracy and route quality
- Optional text comments stored in the database
- Reliability scores displayed on the map as colored circle markers (green/yellow/red)

### 📊 User Dashboard
- **Contribution stats**: Total pins, upvotes received, permanent pins, active temporary pins
- **Top category badge**: Dynamically calculated most-reported category
- **Pin management**: Filterable list (All/Active/Permanent) with delete functionality
- **Time-ago formatting**: Human-readable timestamps for all pins
- **Full-width scrollable layout** with sticky header

### 🔄 Real-Time Updates
- PostgreSQL real-time subscriptions via the cloud backend
- Instant pin additions, updates, and deletions reflected across all connected clients
- Optimistic UI updates with real-time sync fallback

### 🎨 Theming & UI
- Light/dark mode toggle persisted across sessions
- Glassmorphism-styled panels (`glass-panel` CSS class)
- Animated splash screen with branded loading bar
- Bottom navigation bar for Map ↔ Dashboard switching
- Fully responsive mobile-first design

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, CSS custom properties (HSL design tokens) |
| **Maps** | Leaflet 1.9, react-leaflet 4.2 |
| **Routing** | OSRM (Open Source Routing Machine) — bike profile |
| **Geocoding** | OpenStreetMap Nominatim |
| **Backend** | Lovable Cloud (Supabase) — PostgreSQL, Realtime, Edge Functions |
| **State** | React hooks, TanStack React Query |
| **Routing (App)** | React Router DOM v6 |
| **Notifications** | Sonner toast library |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   React App                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Map View │  │Dashboard │  │ Splash Screen│  │
│  │(Leaflet) │  │(Stats +  │  │  (Branded)   │  │
│  │          │  │ Pin Mgmt)│  │              │  │
│  └────┬─────┘  └────┬─────┘  └──────────────┘  │
│       │              │                           │
│  ┌────┴──────────────┴──────┐                   │
│  │     Custom Hooks          │                   │
│  │ usePins · useCustomCats   │                   │
│  │ useReliabilityScores      │                   │
│  │ useVoteTracker            │                   │
│  └────────────┬──────────────┘                   │
│               │                                  │
│  ┌────────────┴──────────────┐                   │
│  │  Supabase Client (Cloud)  │                   │
│  │  Realtime Subscriptions   │                   │
│  └────────────┬──────────────┘                   │
└───────────────┼──────────────────────────────────┘
                │
    ┌───────────┴───────────┐
    │   Lovable Cloud       │
    │  ┌─────────────────┐  │
    │  │  PostgreSQL DB   │  │
    │  │  - pins          │  │
    │  │  - custom_cats   │  │
    │  │  - delivery_rats │  │
    │  └─────────────────┘  │
    │  ┌─────────────────┐  │
    │  │ Edge Functions   │  │
    │  │ - expire-pins    │  │
    │  └─────────────────┘  │
    │  ┌─────────────────┐  │
    │  │ Realtime Engine  │  │
    │  └─────────────────┘  │
    └───────────────────────┘
```

---

## Database Schema

### `pins`
| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | UUID | `gen_random_uuid()` | Primary key |
| `lat` | float | — | Latitude |
| `lng` | float | — | Longitude |
| `category` | text | — | Pin category ID |
| `title` | text | — | Pin title |
| `description` | text | `""` | Details |
| `reported_by` | text | `""` | Reporter name |
| `reported_at` | timestamptz | `now()` | Created timestamp |
| `upvotes` | int | `0` | Community upvotes |
| `downvotes` | int | `0` | Community downvotes |
| `active` | boolean | `true` | Visibility status |
| `permanent` | boolean | `false` | Whether pin is permanent (≥3 upvotes) |

### `custom_categories`
| Column | Type | Description |
|--------|------|-------------|
| `id` | text | Category ID (PK) |
| `label` | text | Display name |
| `icon` | text | Emoji icon |
| `color` | text | HSL color string |
| `description` | text | Category description |

### `delivery_ratings`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `destination_lat` | float | Delivery latitude |
| `destination_lng` | float | Delivery longitude |
| `address_accuracy` | int | 1–5 star rating |
| `route_accuracy` | int | 1–5 star rating |
| `comment` | text | Optional feedback |
| `created_at` | timestamptz | Rating timestamp |

---

## Components Breakdown

| Component | Purpose |
|-----------|---------|
| `SplashScreen` | Branded loading animation with fade-out transition |
| `RideSureMap` | Leaflet map container with all overlays (pins, routes, heatmap, reliability scores) |
| `SearchBar` | Dual search (local + Nominatim geocoding) with debounced API calls |
| `PinFilter` | Category filter toggle chips |
| `PinDetail` | Selected pin info card with upvote/downvote actions |
| `AddPinForm` | New pin creation form with category selection and custom category support |
| `QuickPinButton` | Floating one-tap extortion zone reporter using GPS |
| `TurnByTurn` | Navigation step-by-step direction display |
| `HeatmapOverlay` | Grid-cell-based hazard density visualization |
| `DeliveryRatingModal` | Post-delivery star rating and feedback form |
| `ThemeToggle` | Dark/light mode switcher |
| `BottomNav` | Map ↔ Dashboard tab navigation |
| `Dashboard` | User contribution stats, pin list management, and analytics |

---

## Iteration History

Below is a chronological log of major iterations and enhancements made during development:

### Iteration 1 — Core Map & Pin System
- Set up React + Vite + TypeScript project with Tailwind CSS and shadcn/ui
- Implemented interactive Leaflet map centered on Lagos
- Created 8 default pin categories tailored to Lagos rider challenges
- Built pin drop workflow: tap map → fill form → submit
- Added pin detail view with category icons and descriptions

### Iteration 2 — Cloud Backend Integration
- Connected to Lovable Cloud (PostgreSQL) for persistent data storage
- Created `pins` table with full schema (lat, lng, category, votes, active, permanent)
- Implemented real-time subscriptions for instant cross-client pin updates
- Built `usePins` hook with CRUD operations and optimistic UI updates

### Iteration 3 — Community Voting & Pin Lifecycle
- Added upvote/downvote system with vote tracking via localStorage
- Implemented 3-upvote threshold for temporary → permanent pin promotion
- Created `expire-pins` edge function to auto-delete stale temporary pins (24h + 0 upvotes)
- Added toast notifications for vote actions and pin permanence milestones

### Iteration 4 — Search & Navigation
- Built smart SearchBar with instant local results (30+ hardcoded Lagos locations)
- Integrated OpenStreetMap Nominatim geocoding with Lagos-bounded, debounced queries
- Added OSRM bike routing with turn-by-turn directions
- Implemented route polyline overlay and destination marker with pulse animation

### Iteration 5 — Delivery Rating & Reliability Scores
- Created delivery completion flow with "Delivery Complete" button
- Built star-rating modal for address accuracy and route quality feedback
- Stored ratings in `delivery_ratings` table
- Displayed reliability scores as color-coded circle markers on the map

### Iteration 6 — Heatmap & Quick Report
- Implemented seizure/hazard heatmap overlay using grid-cell density analysis
- Built QuickPinButton for one-tap extortion zone reporting with GPS
- Added toggle button with flame icon for heatmap visibility

### Iteration 7 — Custom Categories
- Created `custom_categories` table in the database
- Built category creation flow within the AddPinForm
- Integrated custom categories across all components (map icons, filters, dashboard)

### Iteration 8 — Splash Screen & Theming
- Designed branded splash screen with animated loading bar
- Implemented dark/light theme toggle with CARTO tile switching
- Added glassmorphism-styled UI panels throughout the app

### Iteration 9 — User Dashboard & Bottom Navigation
- Created comprehensive Dashboard with contribution statistics cards
- Added pin management list with filter tabs (All/Active/Permanent) and delete functionality
- Built top category badge with dynamic calculation
- Implemented BottomNav component for Map ↔ Dashboard tab switching

### Iteration 10 — Dashboard UI Polish
- Made dashboard full-width (removed max-width constraints)
- Improved scroll behavior with proper overflow handling
- Ensured content remains accessible above bottom navigation bar

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm (or Bun)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Navigate to the project
cd YOUR_REPO_NAME

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

The following environment variables are configured automatically via Lovable Cloud:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Backend API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Backend public API key |
| `VITE_SUPABASE_PROJECT_ID` | Backend project identifier |

---

## Project Structure

```
src/
├── App.tsx                    # Root app with splash screen and routing
├── main.tsx                   # Entry point
├── index.css                  # Global styles, design tokens, animations
│
├── components/
│   ├── AddPinForm.tsx         # Pin creation form
│   ├── BottomNav.tsx          # Map/Dashboard tab bar
│   ├── DeliveryRatingModal.tsx # Post-delivery feedback
│   ├── HeatmapOverlay.tsx     # Hazard density visualization
│   ├── NavLink.tsx            # Navigation helper
│   ├── PinDetail.tsx          # Pin info & voting
│   ├── PinFilter.tsx          # Category filter chips
│   ├── QuickPinButton.tsx     # One-tap extortion reporter
│   ├── RideSureMap.tsx        # Main Leaflet map
│   ├── SearchBar.tsx          # Dual search component
│   ├── SplashScreen.tsx       # Branded splash animation
│   ├── ThemeToggle.tsx        # Dark/light mode
│   ├── TurnByTurn.tsx         # Navigation directions
│   └── ui/                    # shadcn/ui primitives
│
├── data/
│   ├── lagos.ts               # Lagos locations, pin categories, sample data
│   └── types.ts               # TypeScript type definitions
│
├── hooks/
│   ├── usePins.ts             # Pin CRUD + realtime subscriptions
│   ├── useCustomCategories.ts # Custom category management
│   ├── useReliabilityScores.ts # Delivery reliability data
│   ├── useVoteTracker.ts      # Vote deduplication (localStorage)
│   └── use-mobile.tsx         # Mobile detection hook
│
├── integrations/
│   └── supabase/
│       ├── client.ts          # Auto-generated backend client
│       └── types.ts           # Auto-generated TypeScript types
│
├── lib/
│   ├── routing.ts             # OSRM route fetching & parsing
│   └── utils.ts               # Utility functions (cn, etc.)
│
└── pages/
    ├── Index.tsx               # Main app page (map + dashboard)
    ├── Dashboard.tsx           # User contribution dashboard
    └── NotFound.tsx            # 404 page

supabase/
└── functions/
    └── expire-pins/
        └── index.ts           # Edge function: auto-expire stale pins
```

---

## API & External Services

| Service | Usage | Rate Limits |
|---------|-------|-------------|
| **OSRM** (`router.project-osrm.org`) | Bike routing & turn-by-turn directions | Free, best-effort (no SLA) |
| **Nominatim** (`nominatim.openstreetmap.org`) | Address geocoding within Lagos bounds | 1 req/sec (debounced at 400ms) |
| **CARTO Basemaps** | Map tile rendering (light & voyager themes) | Free tier |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Guidelines
- Follow the existing component structure and naming conventions
- Use Tailwind CSS semantic tokens — no hardcoded colors in components
- Test on mobile viewports (the app is mobile-first)
- Add new pin categories to `src/data/lagos.ts` or use the custom category system

---

## License

This project is open source. See the repository for license details.

---

<p align="center">
  Built with ❤️ for Lagos riders using <a href="https://lovable.dev">Lovable</a>
</p>
