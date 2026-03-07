import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Grid3X3, Navigation } from "lucide-react";

/* ─── Slide data ─── */
const slides = [
  {
    type: "title" as const,
    title: "RideSure",
    subtitle: "Community-Driven Delivery Navigation for Lagos",
    tagline: "No Stories, Just Deliveries...",
    icon: "🏍️",
    bullets: [
      "18 core features built",
      "Real-time crowdsourced hazard reporting",
      "Bike-optimized navigation for Lagos riders",
    ],
  },
  {
    type: "feature" as const,
    number: "01",
    title: "Splash Screen & Branding",
    icon: "🎬",
    color: "hsl(25, 95%, 53%)",
    description:
      "Animated launch screen with the RideSure logo, tagline, and loading bar. Auto-dismisses after ~2.5 seconds with a smooth fade-out transition.",
    bullets: [
      "CSS keyframe animations (fadeInUp, loadBar)",
      "z-index 9999 overlay",
      "useEffect-based auto-complete timers",
    ],
    component: "SplashScreen.tsx",
  },
  {
    type: "feature" as const,
    number: "02",
    title: "Interactive Map Interface",
    icon: "🗺️",
    color: "hsl(210, 100%, 55%)",
    description:
      "Full-screen Leaflet map centered on Lagos (6.5244°N, 3.3792°E). Color-coded circular markers indicate hazard categories at a glance.",
    bullets: [
      "react-leaflet v4.2.1 + Leaflet.js",
      "CARTO Voyager (dark) / CARTO Light tiles",
      "Custom L.divIcon markers with emojis",
      "Click-to-add-pin & click-marker-for-details",
    ],
    component: "RideSureMap.tsx",
  },
  {
    type: "feature" as const,
    number: "03",
    title: "Community Pin System",
    icon: "📌",
    color: "hsl(0, 72%, 55%)",
    description:
      "8 built-in hazard categories: Road Block, Estate Gate, Bad Road, Speed Bump, Flooding, Police/LASTMA, Bike Entrance, Extortion Zone.",
    bullets: [
      "🚧 Road Block — Police/military checkpoints",
      "🚪 Estate Gate — Gated estate entrances",
      "⚠️ Bad Road — Potholes & damaged roads",
      "🚨 Extortion Zone — Illegal collection spots",
      "🌊 Flooding — Waterlogged areas",
      "👮 Police/LASTMA — Officer checkpoints",
    ],
    component: "usePins.ts + RideSureMap.tsx",
  },
  {
    type: "feature" as const,
    number: "04",
    title: "Pin Category & Filtering",
    icon: "🔍",
    color: "hsl(280, 65%, 55%)",
    description:
      "Toggleable filter panel with pill-shaped buttons for each category. Multi-select lets riders focus on only the hazards they care about.",
    bullets: [
      "Multi-select category filter",
      "Includes built-in + custom categories",
      "Animated slide-up entrance",
      "Real-time map updates",
    ],
    component: "PinFilter.tsx",
  },
  {
    type: "feature" as const,
    number: "05",
    title: "Drop a Pin — Hazard Reporting",
    icon: "📍",
    color: "hsl(150, 60%, 45%)",
    description:
      "Two-step reporting flow: tap map to place coordinates, then fill a form with category, duration (temp/permanent), title, description, and reporter name.",
    bullets: [
      "Visual category grid selection",
      "Temporary (24h) vs Permanent toggle",
      "Auto-populated lat/lng from map tap",
      "'+ New Type' for custom categories",
    ],
    component: "AddPinForm.tsx",
  },
  {
    type: "feature" as const,
    number: "06",
    title: "Smart Search & Geocoding",
    icon: "🔎",
    color: "hsl(200, 80%, 50%)",
    description:
      "Two-tier search: 30+ pre-indexed Lagos landmarks plus live Nominatim geocoding for any address. Auto-calculates bike route on selection.",
    bullets: [
      "30 LagosLocation entries with coordinates",
      "OpenStreetMap Nominatim API integration",
      "Debounced search with loading states",
      "Results grouped by Known / Address",
    ],
    component: "SearchBar.tsx",
  },
  {
    type: "feature" as const,
    number: "07",
    title: "Bike-Optimized Route Navigation",
    icon: "🛣️",
    color: "hsl(210, 100%, 55%)",
    description:
      "OSRM bike-profile routing with turn-by-turn instructions, distance markers, and ETA. Riders see a blue polyline overlay on the map.",
    bullets: [
      "OSRM demo server with bike profile",
      "Step-by-step direction panel",
      "Auto-zoom to fit route bounds",
      "'Delivery Complete' & 'Cancel' actions",
    ],
    component: "TurnByTurn.tsx + routing.ts",
  },
  {
    type: "feature" as const,
    number: "08",
    title: "Hazard Heatmap Overlay",
    icon: "🔥",
    color: "hsl(15, 90%, 55%)",
    description:
      "Visualizes seizure-heavy zones by clustering high-frequency hazard reports. Reveals dangerous patterns that individual pins cannot.",
    bullets: [
      "Filters by high-risk categories",
      "Intensity based on report density",
      "Toggle via flame button",
      "Red glow effect when active",
    ],
    component: "HeatmapOverlay.tsx",
  },
  {
    type: "feature" as const,
    number: "09",
    title: "Quick Pin — One-Tap Extortion Alert",
    icon: "⚠️",
    color: "hsl(0, 85%, 50%)",
    description:
      "Floating red button for instant extortion reporting using GPS. One tap — no form, no typing. Captures exact position and alerts all riders.",
    bullets: [
      "navigator.geolocation with high accuracy",
      "Auto-created 'Extortion Zone' pin",
      "8-second GPS timeout with fallback",
      "Loading spinner during acquisition",
    ],
    component: "QuickPinButton.tsx",
  },
  {
    type: "feature" as const,
    number: "10",
    title: "Community Voting System",
    icon: "👍",
    color: "hsl(45, 100%, 55%)",
    description:
      "Upvote/downvote system that validates temporary pins. 3+ upvotes within 24h promotes a pin to permanent status. One vote per device.",
    bullets: [
      "UPVOTE_THRESHOLD = 3 for promotion",
      "localStorage-based vote tracking",
      "Duplicate vote prevention",
      "Toast notifications for promotions",
    ],
    component: "useVoteTracker.ts",
  },
  {
    type: "feature" as const,
    number: "11",
    title: "Delivery Rating & Reliability Scores",
    icon: "⭐",
    color: "hsl(150, 60%, 45%)",
    description:
      "Post-delivery rating modal for address & route accuracy. Ratings aggregate into colored reliability circles on the map.",
    bullets: [
      "1-5 star rating for address & route",
      "Optional comment field",
      "Green (≥70%) / Yellow (≥40%) / Red (<40%)",
      "Permanent tooltip with percentage",
    ],
    component: "DeliveryRatingModal.tsx",
  },
  {
    type: "feature" as const,
    number: "12",
    title: "User Dashboard & Contributions",
    icon: "📊",
    color: "hsl(250, 65%, 55%)",
    description:
      "Full-width dashboard with stat cards (Total Pins, Upvotes, Permanent, Active), top category badge, and a scrollable filterable pin list.",
    bullets: [
      "4 stat cards with live data",
      "Top category recognition badge",
      "Filter tabs: All / Active / Permanent",
      "Time-ago timestamps & delete actions",
    ],
    component: "Dashboard.tsx",
  },
  {
    type: "feature" as const,
    number: "13",
    title: "Pin Management & Deletion",
    icon: "🗑️",
    color: "hsl(0, 60%, 50%)",
    description:
      "Riders can delete their pins from the Dashboard. Direct database delete with real-time UI update via React Query cache invalidation.",
    bullets: [
      "Supabase delete by pin ID",
      "React Query cache invalidation",
      "Toast feedback for success/error",
    ],
    component: "Dashboard.tsx + usePins.ts",
  },
  {
    type: "feature" as const,
    number: "14",
    title: "Dark / Light Theme Toggle",
    icon: "🌗",
    color: "hsl(260, 50%, 55%)",
    description:
      "Sun/moon toggle that switches the entire UI and map tiles between dark and light themes using CSS semantic tokens.",
    bullets: [
      "CARTO Voyager Dark ↔ CARTO Light tiles",
      "Semantic CSS tokens in :root / .dark",
      "All components respect theme tokens",
    ],
    component: "ThemeToggle.tsx",
  },
  {
    type: "feature" as const,
    number: "15",
    title: "Bottom Navigation System",
    icon: "📱",
    color: "hsl(200, 70%, 50%)",
    description:
      "Persistent bottom nav with Map & Dashboard tabs. Mobile-first, thumb-accessible design following standard mobile UX conventions.",
    bullets: [
      "Fixed position at viewport bottom",
      "Active tab highlighting with primary color",
      "Z-index layering: above map, below modals",
    ],
    component: "BottomNav.tsx",
  },
  {
    type: "feature" as const,
    number: "16",
    title: "Auto-Expiry System",
    icon: "⏰",
    color: "hsl(30, 80%, 55%)",
    description:
      "Temporary pins auto-expire after 24 hours unless validated by community upvotes. Edge function handles periodic deactivation.",
    bullets: [
      "24h expiry for non-permanent pins",
      "3+ upvotes → permanent promotion",
      "Edge Function: expire-pins/index.ts",
      "Auto-deployed via Lovable Cloud",
    ],
    component: "expire-pins Edge Function",
  },
  {
    type: "feature" as const,
    number: "17",
    title: "Custom Category Creation",
    icon: "🎨",
    color: "hsl(320, 70%, 55%)",
    description:
      "Riders can create new hazard categories with custom label, emoji, color, and description — extending the system organically.",
    bullets: [
      "Custom label, icon, color, description",
      "Synced across all users via database",
      "Integrated into filters, map, dashboard",
    ],
    component: "useCustomCategories.ts",
  },
  {
    type: "feature" as const,
    number: "18",
    title: "Real-Time Database Sync",
    icon: "🔄",
    color: "hsl(170, 60%, 45%)",
    description:
      "All pins, ratings, and categories sync in real-time via Lovable Cloud (PostgreSQL + Realtime). Multiple riders see updates instantly.",
    bullets: [
      "PostgreSQL with Row-Level Security",
      "React Query for client-side caching",
      "Real-time subscriptions for live updates",
      "Edge Functions for server-side logic",
    ],
    component: "Supabase integration layer",
  },
  {
    type: "closing" as const,
    title: "Thank You",
    subtitle: "Built with ❤️ for Lagos Riders",
    tagline: "No Stories, Just Deliveries...",
    bullets: [
      "React 18 + TypeScript + Tailwind CSS",
      "Leaflet + OSRM + Nominatim",
      "Lovable Cloud (PostgreSQL + Realtime + Edge Functions)",
      "18 features · 30+ components · Production-ready",
    ],
  },
];

/* ─── Component ─── */
const Presentation = () => {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const total = slides.length;
  const slide = slides[current];

  const go = useCallback(
    (dir: 1 | -1) => {
      setShowGrid(false);
      setCurrent((p) => Math.max(0, Math.min(total - 1, p + dir)));
    },
    [total]
  );

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setShowGrid(false);
  }, []);

  /* Keyboard nav */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") {
        if (showGrid) setShowGrid(false);
        else if (document.fullscreenElement) document.exitFullscreen();
      }
      if (e.key === "g" || e.key === "G") setShowGrid((p) => !p);
      if (e.key === "f" || e.key === "F5") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, showGrid]);

  /* Fullscreen */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* Progress */
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="h-screen w-screen bg-[hsl(220,20%,8%)] text-white flex flex-col overflow-hidden select-none">
      {/* Progress bar */}
      <div className="h-1 w-full bg-white/10 shrink-0">
        <div
          className="h-full bg-[hsl(25,95%,53%)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 z-50 bg-[hsl(220,20%,8%)]/95 p-8 overflow-auto">
          <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`aspect-video rounded-lg border-2 p-4 text-left transition-all hover:scale-105 ${
                  i === current
                    ? "border-[hsl(25,95%,53%)] bg-white/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="text-xs text-white/40 mb-1">
                  {i + 1} / {total}
                </div>
                <div className="text-sm font-semibold truncate">
                  {s.type === "feature" ? `${s.number}. ` : ""}
                  {s.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Slide canvas */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Slide content */}
        <div className="w-full max-w-5xl mx-auto px-8 md:px-16 animate-[fadeInUp_0.4s_ease-out]" key={current}>
          {slide.type === "title" && <TitleSlide slide={slide} />}
          {slide.type === "feature" && <FeatureSlide slide={slide} />}
          {slide.type === "closing" && <ClosingSlide slide={slide} />}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid((p) => !p)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Grid view (G)"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => go(-1)}
            disabled={current === 0}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-mono text-white/60 min-w-[60px] text-center">
            {current + 1} / {total}
          </span>
          <button
            onClick={() => go(1)}
            disabled={current === total - 1}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-white/30 hidden md:block">
          ← → navigate · G grid · F fullscreen
        </div>
      </div>
    </div>
  );
};

/* ─── Slide templates ─── */
function TitleSlide({ slide }: { slide: (typeof slides)[0] }) {
  if (slide.type !== "title") return null;
  return (
    <div className="text-center space-y-8">
      <div className="flex items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-[hsl(25,95%,53%)]/15 flex items-center justify-center">
          <Navigation className="w-10 h-10 text-[hsl(25,95%,53%)]" />
        </div>
      </div>
      <h1 className="text-7xl md:text-8xl font-black tracking-tight">
        Ride<span className="text-[hsl(25,95%,53%)]">Sure</span>
      </h1>
      <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto">
        {slide.subtitle}
      </p>
      <p className="text-lg text-white/30 tracking-[0.3em] uppercase">{slide.tagline}</p>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {slide.bullets.map((b, i) => (
          <span
            key={i}
            className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70"
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeatureSlide({ slide }: { slide: (typeof slides)[number] }) {
  if (slide.type !== "feature") return null;
  return (
    <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
      {/* Left — header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ background: `${slide.color}20`, color: slide.color }}
          >
            Feature {slide.number}
          </span>
          <span className="text-xs text-white/30 font-mono">{slide.component}</span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: `${slide.color}15` }}
          >
            {slide.icon}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">{slide.title}</h2>
        </div>
        <p className="text-lg text-white/60 leading-relaxed">{slide.description}</p>
      </div>

      {/* Right — bullets */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-8 space-y-4">
        <div className="text-xs uppercase tracking-widest text-white/30 mb-4">Implementation Details</div>
        {slide.bullets.map((b, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
              style={{ background: `${slide.color}25`, color: slide.color }}
            >
              {i + 1}
            </div>
            <span className="text-white/80">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClosingSlide({ slide }: { slide: (typeof slides)[number] }) {
  if (slide.type !== "closing") return null;
  return (
    <div className="text-center space-y-8">
      <div className="text-6xl mb-4">🏍️</div>
      <h2 className="text-6xl md:text-7xl font-black">{slide.title}</h2>
      <p className="text-xl text-white/60">{slide.subtitle}</p>
      <p className="text-lg text-white/30 tracking-[0.3em] uppercase">{slide.tagline}</p>
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto pt-6">
        {slide.bullets?.map((b, i) => (
          <div
            key={i}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70"
          >
            {b}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Presentation;
