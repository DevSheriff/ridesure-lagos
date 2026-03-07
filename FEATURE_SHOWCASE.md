# RideSure — Feature Showcase & Presentation Document

**Project**: RideSure — Community-Driven Delivery Navigation for Lagos  
**Live App**: https://lovable.dev/projects/37dfb9ad-17b3-4172-ada0-6af1819bd088  
**GitHub**: https://github.com/DevSheriff/ridesure-lagos  
**Date**: March 2026

---

## Table of Contents

1. [Splash Screen & Branding](#1-splash-screen--branding)
2. [Interactive Map Interface](#2-interactive-map-interface)
3. [Community Pin System](#3-community-pin-system)
4. [Pin Category & Filtering System](#4-pin-category--filtering-system)
5. [Drop a Pin — Hazard Reporting Form](#5-drop-a-pin--hazard-reporting-form)
6. [Smart Search & Geocoding](#6-smart-search--geocoding)
7. [Bike-Optimized Route Navigation](#7-bike-optimized-route-navigation)
8. [Hazard Heatmap Overlay](#8-hazard-heatmap-overlay)
9. [Quick Pin — One-Tap Extortion Reporting](#9-quick-pin--one-tap-extortion-reporting)
10. [Community Voting System](#10-community-voting-system)
11. [Delivery Rating & Reliability Scores](#11-delivery-rating--reliability-scores)
12. [User Dashboard & Contribution Tracker](#12-user-dashboard--contribution-tracker)
13. [Pin Management & Deletion](#13-pin-management--deletion)
14. [Dark/Light Theme Toggle](#14-darklight-theme-toggle)
15. [Bottom Navigation System](#15-bottom-navigation-system)
16. [Auto-Expiry System for Temporary Pins](#16-auto-expiry-system-for-temporary-pins)
17. [Custom Category Creation](#17-custom-category-creation)
18. [Real-Time Database Sync](#18-real-time-database-sync)

---

## 1. Splash Screen & Branding

**What it does:**  
When the app launches, riders are greeted with an animated splash screen featuring the RideSure logo, the tagline *"No Stories, Just Deliveries..."*, and a loading progress bar. It auto-dismisses after ~2.5 seconds with a smooth fade-out transition.

**Why it matters:**  
Sets the tone and identity of the app immediately. The splash screen reinforces the brand — this isn't a generic maps app, it's built *by riders, for riders*. The loading bar provides visual feedback that the app is initializing data from the backend.

**Technical details:**  
- Component: `SplashScreen.tsx`
- Animated with CSS keyframes (`fadeInUp`, `loadBar`)
- Auto-completes via `useEffect` timers
- Overlays the entire viewport at `z-index: 9999`

---

## 2. Interactive Map Interface

**What it does:**  
The core of RideSure is a full-screen, interactive Leaflet map centered on Lagos, Nigeria (6.5244°N, 3.3792°E). Riders see community-reported hazard pins scattered across the map as color-coded circular markers. Each marker uses a distinct emoji and color to indicate its category at a glance.

**Why it matters:**  
Delivery riders spend 80%+ of their time navigating Lagos roads. A real-time, crowdsourced map gives them an information advantage — they can see checkpoints, bad roads, extortion zones, and estate gates *before* they encounter them.

**Technical details:**  
- Built with `react-leaflet` v4.2.1 + Leaflet.js
- Tile layers: CARTO Voyager (dark mode) / CARTO Light (light mode)
- Custom `L.divIcon` markers with inline-styled emojis
- Map interactions: click to add pin, click marker for details
- Component: `RideSureMap.tsx`

---

## 3. Community Pin System

**What it does:**  
Riders can report 8 built-in hazard categories across Lagos:

| Category | Icon | Color | Purpose |
|----------|------|-------|---------|
| Road Block | 🚧 | Red | Police/military checkpoints or closures |
| Estate Gate | 🚪 | Yellow | Gated estate entrances requiring ID |
| Bad Road | ⚠️ | Orange | Potholes, unpaved, or damaged roads |
| Speed Bump | 🔶 | Purple | Speed bumps or road humps |
| Flooding | 🌊 | Blue | Flooded roads or waterlogged areas |
| Police/LASTMA | 👮 | Green | LASTMA, police, or VIO checkpoints |
| Bike Entrance | 🏍️ | Teal | Bike/okada-only entrances |
| Extortion Zone | 🚨 | Crimson | Illegal collections or harassment spots |

**Why it matters:**  
Each pin category addresses a *real* pain point that Lagos riders face daily. From being stopped by LASTMA officers to navigating flooded roads during rainy season, these categories were chosen based on actual rider experiences.

**Technical details:**  
- Data model: `MapPin` interface with lat/lng, category, title, description, votes, active/permanent status
- Stored in PostgreSQL via Lovable Cloud
- 12 sample pins pre-populated across major Lagos areas
- Component: `RideSureMap.tsx` (rendering), `usePins.ts` (data management)

---

## 4. Pin Category & Filtering System

**What it does:**  
A toggleable filter panel appears below the search bar, showing pill-shaped buttons for each hazard category. Riders can tap one or more categories to filter the map — only showing, for example, "Police/LASTMA" and "Extortion Zone" pins while hiding everything else.

**Why it matters:**  
Different riders have different concerns. A rider worried about police checkpoints can filter to see only those pins, while another rider concerned about road quality can focus on "Bad Road" and "Flooding" pins. This makes the map actionable rather than overwhelming.

**Technical details:**  
- Component: `PinFilter.tsx`
- Toggles via `activeFilters` state array
- Includes both built-in and custom categories
- Animated slide-up entrance
- Multi-select: riders can combine filters

---

## 5. Drop a Pin — Hazard Reporting Form

**What it does:**  
When a rider taps "Drop a Pin", the app enters placement mode. Tapping anywhere on the map reveals a comprehensive reporting form with:
- **Category selection** — Visual grid of all hazard types
- **Duration toggle** — Temporary (expires in 24h without upvotes) or Permanent
- **Title & Description** — Rider-provided context
- **Reporter name** — Attribution for community credit
- **"+ New Type" button** — Create custom categories on the fly

**Why it matters:**  
This is how the community contributes intelligence. The temporary/permanent system ensures the map stays current — checkpoint pins from yesterday automatically expire unless other riders validate them with upvotes.

**Technical details:**  
- Component: `AddPinForm.tsx`
- Two-step flow: click "Drop a Pin" → tap map → fill form
- Coordinates auto-populated from map tap
- Submits to `pins` table via Supabase client
- Toast notifications confirm success with pin counter

---

## 6. Smart Search & Geocoding

**What it does:**  
The search bar at the top allows riders to type a delivery address. It provides two tiers of results:
1. **Known Locations** — Pre-indexed Lagos landmarks (30+ locations across Lekki, VI, Ikeja, Surulere, Yaba, etc.)
2. **Address Search** — Live geocoding via Nominatim API for any address in Lagos

Selecting a result automatically calculates a bike route to that destination.

**Why it matters:**  
Delivery riders receive addresses from customers that are often vague ("the house near Chevron roundabout"). The search bar with known landmarks helps riders quickly find common delivery zones, while the geocoder handles specific street addresses.

**Technical details:**  
- Component: `SearchBar.tsx`
- Local data: 30 `LagosLocation` entries with lat/lng coordinates
- External API: OpenStreetMap Nominatim for geocoding
- Debounced search with loading states
- Results grouped by "Known Locations" and "Addresses"

---

## 7. Bike-Optimized Route Navigation

**What it does:**  
After selecting a destination, the app calculates a bike-optimized route using OSRM (Open Source Routing Machine) and renders it as a blue polyline on the map. A turn-by-turn instruction panel appears at the bottom showing:
- Step-by-step directions with distance markers
- Total route distance and estimated ride time
- "Delivery Complete" button to end navigation
- "Cancel" button to abort

**Why it matters:**  
Standard navigation apps route for cars. Lagos bike riders take shortcuts through estates, service lanes, and paths that cars can't access. OSRM's bike profile accounts for these differences, giving riders more accurate ETAs and routes.

**Technical details:**  
- Routing engine: OSRM demo server (`router.project-osrm.org`) with bike profile
- Component: `TurnByTurn.tsx`
- Route rendered as `<Polyline>` with custom styling
- Map auto-zooms to fit route bounds with padding
- Falls back to Lagos center if GPS is unavailable
- Module: `lib/routing.ts`

---

## 8. Hazard Heatmap Overlay

**What it does:**  
Toggling the flame (🔥) icon activates a heatmap overlay that visualizes "seizure-heavy" zones. The heatmap clusters high-frequency hazard reports — particularly police checkpoints, roadblocks, and extortion zones — within recent timeframes, showing riders which areas have the highest concentration of reported incidents.

**Why it matters:**  
Individual pins tell you about specific spots, but the heatmap reveals *patterns*. A rider can glance at the heatmap and immediately see that a particular stretch of road has an unusually high density of police/extortion reports, suggesting they should find an alternative route entirely.

**Technical details:**  
- Component: `HeatmapOverlay.tsx`
- Filters pins by high-risk categories (police, roadblock, extortion)
- Visual intensity based on report density
- Toggleable via flame button in bottom controls
- Red glow effect on active button

---

## 9. Quick Pin — One-Tap Extortion Reporting

**What it does:**  
A floating red button (⚠️) on the right side of the screen allows riders to instantly report an extortion zone at their current GPS location with a single tap — no form, no typing. The app uses `navigator.geolocation` with high accuracy enabled to capture the rider's exact position and drops an "Extortion Zone" pin automatically.

**Why it matters:**  
When a rider is being harassed or sees an active extortion point, they don't have time to fill out a form. One tap captures the location and alerts other riders immediately. This is the fastest path from "I see a problem" to "everyone is warned."

**Technical details:**  
- Component: `QuickPinButton.tsx`
- Uses `navigator.geolocation.getCurrentPosition()` with 8-second timeout
- Auto-creates pin with category "extortion" and pre-filled title/description
- Loading spinner during GPS acquisition
- Error handling for denied permissions
- Positioned: fixed, right side, vertically centered

---

## 10. Community Voting System

**What it does:**  
Each pin has upvote (👍) and downvote (👎) buttons visible in the pin detail panel. The voting system serves two critical functions:
1. **Validation** — Temporary pins need 3+ upvotes within 24 hours to become permanent
2. **Accuracy** — Downvoted pins signal outdated or inaccurate reports
3. **Anti-spam** — One vote per pin per device (tracked via localStorage)

**Why it matters:**  
Without validation, the map would fill with outdated or false reports. The community voting system ensures that only reports confirmed by multiple riders persist on the map. A pin about a police checkpoint that was there yesterday but is gone today will naturally expire without upvotes.

**Technical details:**  
- Vote tracking: `useVoteTracker.ts` (localStorage-based per-device tracking)
- Threshold: `UPVOTE_THRESHOLD = 3` for permanent promotion
- Toast notifications for promotion events
- Duplicate vote prevention with user feedback
- Server-side: `upvotes`/`downvotes` columns on `pins` table

---

## 11. Delivery Rating & Reliability Scores

**What it does:**  
When a rider completes a delivery (taps "Delivery Complete"), a rating modal appears asking them to rate:
- **Address Accuracy** (1-5 stars) — How accurate was the destination address?
- **Route Accuracy** (1-5 stars) — How good was the suggested route?
- **Comment** — Optional free-text feedback

These ratings are aggregated into reliability scores displayed as colored circles on the map at delivery destinations.

**Why it matters:**  
Many Lagos addresses are notoriously imprecise. By crowdsourcing delivery accuracy ratings, RideSure builds a reliability database — riders can see if an area has historically accurate or inaccurate addresses, helping them manage customer expectations and plan extra time.

**Technical details:**  
- Components: `DeliveryRatingModal.tsx`
- Hook: `useReliabilityScores.ts`
- Score visualization: `<CircleMarker>` components with color coding (green ≥70%, yellow ≥40%, red <40%)
- Storage: `delivery_ratings` table in Lovable Cloud
- Permanent tooltip showing percentage score

---

## 12. User Dashboard & Contribution Tracker

**What it does:**  
Accessible via the bottom navigation, the Dashboard gives riders a comprehensive view of their contributions:

**Stats Cards:**
- 📍 **Total Pins** — Total number of pins contributed
- 👍 **Total Upvotes** — Cumulative upvotes across all pins  
- 🛡️ **Permanent Pins** — Pins that achieved permanent status
- 📈 **Active Pins** — Currently active temporary pins

**Top Category Badge:**  
Shows the rider's most-reported category (e.g., "🚪 Estate Gate — 24 pins"), recognizing their area of expertise.

**Full Pin List:**  
A scrollable, filterable list of all pins with:
- Category icon and color
- Title and description preview
- Upvote/downvote counts
- Time-ago timestamps
- "PERM" badge for permanent pins
- Delete button for pin management

**Why it matters:**  
Gamification and recognition drive engagement. Riders who see their contribution stats are motivated to keep reporting. The dashboard also serves as a management tool — riders can review and delete their pins.

**Technical details:**  
- Component: `Dashboard.tsx`
- Filter tabs: All / Active / Permanent
- Full-width, scrollable layout with `pb-20` for bottom nav clearance
- Sticky header with blur backdrop
- Real-time data from `usePins()` hook

---

## 13. Pin Management & Deletion

**What it does:**  
From the Dashboard, riders can delete any pin by tapping the trash icon (🗑️) next to it. A confirmation toast appears on success or failure.

**Why it matters:**  
Riders need the ability to remove pins they've reported that are no longer relevant — a checkpoint that's been cleared, a road that's been repaired, or a pin placed in error. This keeps the map accurate over time.

**Technical details:**  
- Direct Supabase delete: `supabase.from("pins").delete().eq("id", id)`
- Real-time UI update via React Query cache invalidation
- Toast feedback for success/error states

---

## 14. Dark/Light Theme Toggle

**What it does:**  
A sun/moon toggle button in the top-right corner switches between dark and light themes. The theme affects:
- App UI (backgrounds, text, cards, buttons)
- Map tiles (CARTO Voyager dark ↔ CARTO Light)
- All semantic design tokens update simultaneously

**Why it matters:**  
Delivery riders work at all hours — from early morning to late night. Dark mode reduces eye strain during night rides, while light mode provides better visibility during daytime. The map tiles also change to match, ensuring optimal contrast.

**Technical details:**  
- Component: `ThemeToggle.tsx`
- CSS: Semantic tokens in `index.css` (`:root` for light, `.dark` for dark)
- Map tiles switch between CARTO Voyager Labels and CARTO Light
- Theme persisted across the session

---

## 15. Bottom Navigation System

**What it does:**  
A persistent bottom navigation bar with two tabs:
- **Map** (🗺️) — The main interactive map view
- **Dashboard** (📊) — The contribution overview and pin management

The active tab is highlighted with the app's primary color.

**Why it matters:**  
Mobile-first design. Delivery riders use their phones one-handed while on the move. A bottom nav bar is thumb-accessible and follows the mobile UX conventions riders are already familiar with from apps like Instagram, Bolt, and Uber.

**Technical details:**  
- Component: `BottomNav.tsx`
- Fixed at bottom: `fixed bottom-0 left-0 right-0`
- Z-index layering above map but below modals
- Active state with primary color highlighting

---

## 16. Auto-Expiry System for Temporary Pins

**What it does:**  
Temporary pins (the default) automatically expire after 24 hours unless they receive enough community upvotes (3+) to become permanent. An edge function runs periodically to deactivate expired pins.

**Why it matters:**  
Lagos is a dynamic city. A police checkpoint active this morning may be gone by afternoon. The auto-expiry system ensures the map reflects *current* conditions, not historical ones. Only pins validated by multiple riders persist.

**Technical details:**  
- Edge Function: `supabase/functions/expire-pins/index.ts`
- Logic: Deactivates pins where `reported_at + 24h < now()` AND `permanent = false`
- Permanent promotion: Pin gets `permanent = true` when upvotes ≥ 3
- Deployed automatically via Lovable Cloud

---

## 17. Custom Category Creation

**What it does:**  
From the "Drop a Pin" form, riders can tap "+ New Type" to create entirely new hazard categories with:
- Custom label (e.g., "Traffic", "One-Way Street")
- Custom emoji icon
- Custom color
- Description

These custom categories then appear in the filter panel and are available for all future pin reports.

**Why it matters:**  
The 8 built-in categories cover the most common hazards, but Lagos is unpredictable. Riders may encounter situations we didn't anticipate — fuel queues, protests, market-day road closures. Custom categories let the community extend the system organically.

**Technical details:**  
- Hook: `useCustomCategories.ts`
- Storage: `custom_categories` table in Lovable Cloud
- Synced across all users via database
- Integrated into filter panel, map markers, and dashboard

---

## 18. Real-Time Database Sync

**What it does:**  
All pin data, custom categories, and delivery ratings are stored in a cloud PostgreSQL database (Lovable Cloud). When any rider adds a pin, upvotes, or modifies data, changes are immediately reflected for all users. The app uses React Query for efficient data fetching with caching and automatic refetching.

**Why it matters:**  
For a crowdsourced safety tool to work, data must be shared in real-time. A pin dropped by one rider at a checkpoint in Lekki needs to be visible to another rider approaching the same checkpoint minutes later. Lovable Cloud ensures this data persistence and synchronization.

**Technical details:**  
- Database: PostgreSQL (Lovable Cloud / Supabase)
- Tables: `pins`, `custom_categories`, `delivery_ratings`
- Client: `@supabase/supabase-js` with auto-generated TypeScript types
- Data fetching: React Query with `useQuery`/`useMutation`
- Realtime capability enabled on `pins` table

---

## Architecture Summary

```
┌──────────────────────────────────────────┐
│              Frontend (React)            │
├──────────────┬───────────────────────────┤
│  Map View    │  Dashboard View           │
│  ├ Leaflet   │  ├ Stats Cards            │
│  ├ Pins      │  ├ Pin List               │
│  ├ Routes    │  └ Filters                │
│  ├ Heatmap   │                           │
│  └ Search    │                           │
├──────────────┴───────────────────────────┤
│           State Management               │
│  ├ React Query (server state)            │
│  ├ useState (local UI state)             │
│  └ localStorage (vote tracking)          │
├──────────────────────────────────────────┤
│           External APIs                  │
│  ├ OSRM (bike routing)                   │
│  ├ Nominatim (geocoding)                 │
│  └ CARTO (map tiles)                     │
├──────────────────────────────────────────┤
│           Backend (Lovable Cloud)        │
│  ├ PostgreSQL (data storage)             │
│  ├ Edge Functions (pin expiry)           │
│  └ Realtime (live sync)                  │
└──────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Maps | Leaflet + react-leaflet v4.2.1 |
| Routing | OSRM (bike profile) |
| Geocoding | OpenStreetMap Nominatim |
| Map Tiles | CARTO (Voyager / Light) |
| Backend | Lovable Cloud (PostgreSQL) |
| Data Fetching | React Query (TanStack Query) |
| Notifications | Sonner toast library |
| Icons | Lucide React |

---

*Built with ❤️ for Lagos delivery riders. No stories, just deliveries.*
