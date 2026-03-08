import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Grid3X3, Navigation, Map, Filter, MapPin, Search, Route, Flame, AlertTriangle, ThumbsUp, Star, LayoutDashboard, Trash2, Moon, Sun, Smartphone, Clock, Palette, RefreshCw } from "lucide-react";

/* ─── Slide data — plain language, no jargon ─── */
const slides = [
  {
    type: "title" as const,
    title: "RideSure",
    subtitle: "Community-Driven Delivery Navigation for Lagos",
    tagline: "No Stories, Just Deliveries...",
    icon: "🏍️",
    bullets: [
      "18 features built from scratch",
      "Live hazard reporting by riders",
      "Bike-friendly navigation across Lagos",
    ],
  },
  {
    type: "feature" as const,
    number: "01",
    title: "Splash Screen & Branding",
    icon: "🎬",
    color: "hsl(25, 95%, 53%)",
    lucideIcon: "navigation",
    description:
      "When you open the app, you're greeted with the RideSure logo, our tagline, and a smooth loading bar. It fades away after about 2 seconds, giving the map time to load in the background.",
    highlights: [
      "Smooth fade-in animation with the logo and tagline",
      "Loading progress bar shows the app is getting ready",
      "Automatically transitions to the main map screen",
    ],
    screenshotDesc: "The RideSure splash screen showing the navigation logo, 'RideSure' branding, the tagline 'No Stories, Just Deliveries...', and a loading bar at the bottom.",
  },
  {
    type: "feature" as const,
    number: "02",
    title: "Interactive Map Interface",
    icon: "🗺️",
    color: "hsl(210, 100%, 55%)",
    lucideIcon: "map",
    description:
      "The full-screen map is centered on Lagos and shows all reported hazards as colorful pin markers. Each color represents a different hazard type, so riders can spot dangers at a glance.",
    highlights: [
      "Full-screen map covering all of Lagos",
      "Color-coded markers — each hazard type has its own color and emoji",
      "Tap any marker to see details about that hazard",
      "Tap anywhere on the map to report a new hazard",
    ],
    screenshotDesc: "Full-screen map of Lagos with dozens of colorful pin markers scattered across the city. The top bar shows the RideSure logo, search bar, and theme toggle. Bottom toolbar shows filter, heatmap, 'Drop a Pin' button, and pin count (78 pins).",
  },
  {
    type: "feature" as const,
    number: "03",
    title: "Hazard Categories",
    icon: "📌",
    color: "hsl(0, 72%, 55%)",
    lucideIcon: "mapPin",
    description:
      "We built 8 hazard types that Lagos riders face daily — from road blocks and bad roads to extortion zones and flooding. Each one has a unique icon and color so you can tell them apart instantly.",
    highlights: [
      "🚧 Road Block — Police or military checkpoints",
      "🚪 Estate Gate — Gated community entrances",
      "⚠️ Bad Road — Potholes and damaged roads",
      "🚨 Extortion Zone — Places where riders get taxed illegally",
      "🌊 Flooding — Waterlogged streets",
      "👮 Police/LASTMA — Law enforcement stops",
    ],
    screenshotDesc: "The 'Drop a Pin' form showing a 3x3 grid of hazard categories: Road Block, Estate Gate, Bad Road, Speed Bump, Flooding, Police/LASTMA, Bike Entrance, Extortion Zone, and Traffic — each with its unique emoji icon.",
  },
  {
    type: "feature" as const,
    number: "04",
    title: "Category Filters",
    icon: "🔍",
    color: "hsl(280, 65%, 55%)",
    lucideIcon: "filter",
    description:
      "The filter bar lets riders show only the hazard types they care about. Tap a category to toggle it — the map updates instantly to show or hide those markers.",
    highlights: [
      "Tap the layers icon to open the filter bar",
      "Select one or multiple categories to filter",
      "Map updates in real-time as you toggle filters",
      "Includes both built-in and custom categories",
    ],
    screenshotDesc: "Filter bar shown below the search bar with pill-shaped buttons for each category: Road Block, Estate Gate, Bad Road, Speed Bump, Flooding, Police/LASTMA, Bike Entrance, Extortion Zone, and Traffic.",
  },
  {
    type: "feature" as const,
    number: "05",
    title: "Drop a Pin — Report a Hazard",
    icon: "📍",
    color: "hsl(150, 60%, 45%)",
    lucideIcon: "mapPin",
    description:
      "Reporting a hazard takes two easy steps: tap the map to mark the spot, then fill a quick form choosing the hazard type, whether it's temporary or permanent, a title, and a short description.",
    highlights: [
      "Tap anywhere on the map to set the location",
      "Pick from a visual grid of hazard types",
      "Choose 'Temporary' (expires in 24 hours) or 'Permanent'",
      "Add a title and description to help other riders",
      "Option to create a brand new hazard type",
    ],
    screenshotDesc: "The 'Drop a Pin' form showing coordinates at the top, a category selection grid, duration toggle between 'Temporary' and 'Permanent', and input fields for title and description.",
  },
  {
    type: "feature" as const,
    number: "06",
    title: "Smart Search & Address Lookup",
    icon: "🔎",
    color: "hsl(200, 80%, 50%)",
    lucideIcon: "search",
    description:
      "Type a destination in the search bar and get instant results. We pre-loaded 30+ popular Lagos landmarks, and for anything else, the app searches real addresses online. Pick a result and the app automatically plans your bike route.",
    highlights: [
      "30+ pre-loaded Lagos locations for instant results",
      "Live address search for any location in Nigeria",
      "Results grouped into 'Known Locations' and 'Addresses'",
      "Selecting a result automatically calculates your bike route",
    ],
    screenshotDesc: "Search bar with 'Lekki' typed in, showing a dropdown with 'Known Locations' (Lekki Phase 1 Gate, Admiralty Way Lekki, Chevron Roundabout) and 'Addresses' (Ibeju Lekki, Lagos State, Nigeria).",
  },
  {
    type: "feature" as const,
    number: "07",
    title: "Bike Route Navigation",
    icon: "🛣️",
    color: "hsl(210, 100%, 55%)",
    lucideIcon: "route",
    description:
      "After picking a destination, the app draws a blue route line on the map optimized for bikes. A directions panel shows step-by-step turns with distances. When you arrive, tap 'Delivery Complete' to finish the trip.",
    highlights: [
      "Blue route line drawn on the map from your area to destination",
      "Step-by-step directions: 'Turn left (35m)', 'Turn right (323m)'",
      "Shows total distance and estimated ride time",
      "'Delivery Complete' button to end the trip and rate the delivery",
    ],
    screenshotDesc: "Map showing a blue route line from mainland Lagos to Lekki. A 'Route Directions' panel shows turn-by-turn instructions (21 min · 22.0km). Bottom shows 'Delivery Complete' and 'Cancel' buttons.",
  },
  {
    type: "feature" as const,
    number: "08",
    title: "Hazard Heatmap",
    icon: "🔥",
    color: "hsl(15, 90%, 55%)",
    lucideIcon: "flame",
    description:
      "The heatmap highlights danger zones by showing where hazards are concentrated. Areas with many reports glow red, helping riders spot dangerous neighborhoods they might want to avoid.",
    highlights: [
      "Clusters hazard reports to show high-risk zones",
      "Color intensity shows how dangerous an area is",
      "Toggle on/off with the flame button in the toolbar",
      "Focuses on high-risk categories like extortion and road blocks",
    ],
    screenshotDesc: "Map with semi-transparent red/orange circles overlaid on areas with concentrated hazard reports, showing danger hotspots across Lagos.",
  },
  {
    type: "feature" as const,
    number: "09",
    title: "Quick Alert — One-Tap Extortion Report",
    icon: "⚠️",
    color: "hsl(0, 85%, 50%)",
    lucideIcon: "alertTriangle",
    description:
      "The floating red button in the corner is for emergencies. If a rider encounters extortion, one tap instantly reports it using their GPS location — no forms, no typing, no delay.",
    highlights: [
      "Floating red warning button always visible on the map",
      "Uses your phone's GPS to get your exact location",
      "Creates an 'Extortion Zone' pin automatically",
      "Alerts all nearby riders immediately",
    ],
    screenshotDesc: "Red circular warning button (⚠️) floating on the right side of the map screen, ready for one-tap emergency reporting.",
  },
  {
    type: "feature" as const,
    number: "10",
    title: "Community Voting",
    icon: "👍",
    color: "hsl(45, 100%, 55%)",
    lucideIcon: "thumbsUp",
    description:
      "Every pin can be upvoted or downvoted by other riders. If a temporary pin gets 3 or more upvotes within 24 hours, it becomes permanent. This way, the community validates which hazards are real.",
    highlights: [
      "Upvote to confirm a hazard is real",
      "Downvote if the hazard is no longer there",
      "3+ upvotes promote a temporary pin to permanent",
      "Each device can only vote once per pin",
    ],
    screenshotDesc: "Pin detail card showing 'Pedro Estate Gate (Shomolu)' with upvote (26) and downvote (0) buttons, reporter name 'RideSure_Admin', and '18 days ago' timestamp.",
  },
  {
    type: "feature" as const,
    number: "11",
    title: "Delivery Ratings & Reliability Scores",
    icon: "⭐",
    color: "hsl(150, 60%, 45%)",
    lucideIcon: "star",
    description:
      "After completing a delivery, riders rate the address accuracy and route quality. These ratings show up as colored circles on the map — green means reliable, yellow is okay, red means the address is unreliable.",
    highlights: [
      "Rate address accuracy from 1 to 5 stars",
      "Rate route quality from 1 to 5 stars",
      "Add an optional comment about the delivery",
      "Green (good) / Yellow (okay) / Red (poor) circles on the map",
    ],
    screenshotDesc: "Delivery rating modal with two 5-star rating rows for 'Address Accuracy' and 'Route Quality', plus an optional comment field and 'Submit Rating' button.",
  },
  {
    type: "feature" as const,
    number: "12",
    title: "Rider Dashboard",
    icon: "📊",
    color: "hsl(250, 65%, 55%)",
    lucideIcon: "layoutDashboard",
    description:
      "The Dashboard gives riders a bird's-eye view of all community contributions. It shows total pins, upvotes, how many are permanent vs active, the most-reported category, and a scrollable list of all pins with filter options.",
    highlights: [
      "4 stat cards: Total Pins, Total Upvotes, Permanent, Active",
      "Top Category badge showing the most-reported hazard type",
      "Filter pins by: All, Active only, or Permanent only",
      "Each pin shows time since reported and a delete option",
    ],
    screenshotDesc: "Dashboard screen with 4 stat cards (78 Total Pins, 1750 Total Upvotes, 56 Permanent, 78 Active), Top Category badge showing 'Estate Gate — 24 pins', and a scrollable list of pins with filter tabs.",
  },
  {
    type: "feature" as const,
    number: "13",
    title: "Pin Management & Deletion",
    icon: "🗑️",
    color: "hsl(0, 60%, 50%)",
    lucideIcon: "trash2",
    description:
      "From the Dashboard, riders can delete pins they no longer need. Tap the trash icon next to any pin and it's removed from the map and database instantly.",
    highlights: [
      "Delete button (trash icon) next to each pin in the list",
      "Pin is removed from the map immediately",
      "Confirmation message after successful deletion",
      "Data syncs across all users in real-time",
    ],
    screenshotDesc: "Dashboard pin list showing entries like 'Oshodi Market Extortion' and 'Mile 2 Roundabout Extortion' with red trash can icons on the right side for deletion.",
  },
  {
    type: "feature" as const,
    number: "14",
    title: "Dark & Light Mode",
    icon: "🌗",
    color: "hsl(260, 50%, 55%)",
    lucideIcon: "moon",
    description:
      "Switch between dark and light themes with one tap. The map tiles, colors, and entire UI adapt to your preference. Dark mode is easier on the eyes during night rides.",
    highlights: [
      "Sun/Moon toggle in the top-right corner",
      "Map tiles switch between dark and light styles",
      "All buttons, cards, and text adapt to the theme",
      "Great for riding at night or in bright sunlight",
    ],
    screenshotDesc: "Side-by-side comparison showing the map in dark mode (dark background, light text) and light mode (white background, dark text) with the theme toggle button highlighted.",
  },
  {
    type: "feature" as const,
    number: "15",
    title: "Bottom Navigation",
    icon: "📱",
    color: "hsl(200, 70%, 50%)",
    lucideIcon: "smartphone",
    description:
      "The app has a simple two-tab navigation at the bottom: Map and Dashboard. It's designed for one-handed use on a phone, making it easy to switch between views while on the go.",
    highlights: [
      "Two tabs: Map and Dashboard",
      "Active tab is highlighted with the brand color",
      "Always visible at the bottom of the screen",
      "Designed for easy thumb access on mobile",
    ],
    screenshotDesc: "Bottom navigation bar with two tabs: 'Map' (with map icon) and 'Dashboard' (with grid icon). The active tab shows an orange underline.",
  },
  {
    type: "feature" as const,
    number: "16",
    title: "Auto-Expiry System",
    icon: "⏰",
    color: "hsl(30, 80%, 55%)",
    lucideIcon: "clock",
    description:
      "Temporary pins automatically disappear after 24 hours unless other riders upvote them. This keeps the map clean and ensures only verified hazards stay visible long-term.",
    highlights: [
      "Temporary pins last 24 hours by default",
      "If 3+ riders upvote it, it becomes permanent",
      "Expired pins are removed automatically in the background",
      "Keeps the map accurate and clutter-free",
    ],
    screenshotDesc: "The 'Drop a Pin' form showing the Duration section with two options: 'Temporary — Expires in 24h without upvotes' and 'Permanent — Stays on the map forever'.",
  },
  {
    type: "feature" as const,
    number: "17",
    title: "Custom Hazard Types",
    icon: "🎨",
    color: "hsl(320, 70%, 55%)",
    lucideIcon: "palette",
    description:
      "Riders can create entirely new hazard categories if the built-in ones don't fit. Choose a name, emoji, color, and description — your new type appears for everyone to use.",
    highlights: [
      "Tap '+ New Type' in the pin form to create a category",
      "Pick any emoji, color, name, and description",
      "New categories sync to all users automatically",
      "Shows up in filters, map markers, and the dashboard",
    ],
    screenshotDesc: "The '+ New Type' button at the bottom of the category grid in the Drop a Pin form, allowing riders to create custom hazard types.",
  },
  {
    type: "feature" as const,
    number: "18",
    title: "Real-Time Data Sync",
    icon: "🔄",
    color: "hsl(170, 60%, 45%)",
    lucideIcon: "refreshCw",
    description:
      "Everything in RideSure syncs in real-time across all riders. When someone drops a pin, votes, or rates a delivery, every other user sees the update immediately — no refresh needed.",
    highlights: [
      "All pins sync instantly across every user's map",
      "Votes and ratings update in real-time",
      "Powered by a cloud database with live subscriptions",
      "Works even on slow connections with smart caching",
    ],
    screenshotDesc: "Map view showing 78 pins with real-time data from the cloud database, demonstrating live synchronization across all connected riders.",
  },
  {
    type: "closing" as const,
    title: "Thank You",
    subtitle: "Built with ❤️ for Lagos Riders",
    tagline: "No Stories, Just Deliveries...",
    bullets: [
      "18 features built from the ground up",
      "Live map with 78+ community-reported hazards",
      "Bike-optimized route planning across Lagos",
      "Real-time sync so every rider stays informed",
    ],
  },
];

/* ─── Icon mapping ─── */
const iconMap: Record<string, any> = {
  navigation: Navigation, map: Map, filter: Filter, mapPin: MapPin,
  search: Search, route: Route, flame: Flame, alertTriangle: AlertTriangle,
  thumbsUp: ThumbsUp, star: Star, layoutDashboard: LayoutDashboard,
  trash2: Trash2, moon: Moon, smartphone: Smartphone, clock: Clock,
  palette: Palette, refreshCw: RefreshCw,
};

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") {
        if (showGrid) setShowGrid(false);
        else if (document.fullscreenElement) document.exitFullscreen();
      }
      if (e.key === "g" || e.key === "G") setShowGrid((p) => !p);
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, showGrid]);

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
                <div className="text-xs text-white/40 mb-1">{i + 1} / {total}</div>
                <div className="text-sm font-semibold truncate">
                  {s.type === "feature" ? `${s.number}. ` : ""}{s.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Slide canvas */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 animate-[fadeInUp_0.4s_ease-out]" key={current}>
          {slide.type === "title" && <TitleSlide slide={slide} />}
          {slide.type === "feature" && <FeatureSlide slide={slide} />}
          {slide.type === "closing" && <ClosingSlide slide={slide} />}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowGrid((p) => !p)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Grid view (G)">
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Fullscreen (F)">
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => go(-1)} disabled={current === 0} className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-mono text-white/60 min-w-[60px] text-center">{current + 1} / {total}</span>
          <button onClick={() => go(1)} disabled={current === total - 1} className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-white/30 hidden md:block">← → navigate · G grid · F fullscreen</div>
      </div>
    </div>
  );
};

/* ─── Title Slide ─── */
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
      <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto">{slide.subtitle}</p>
      <p className="text-lg text-white/30 tracking-[0.3em] uppercase">{slide.tagline}</p>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {slide.bullets.map((b, i) => (
          <span key={i} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">{b}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature Slide with Screenshot Preview ─── */
function FeatureSlide({ slide }: { slide: (typeof slides)[number] }) {
  if (slide.type !== "feature") return null;
  const LucideIcon = iconMap[slide.lucideIcon || "mapPin"] || MapPin;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Left — text content */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ background: `${slide.color}20`, color: slide.color }}
          >
            Feature {slide.number}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `${slide.color}15` }}
          >
            <LucideIcon className="w-7 h-7" style={{ color: slide.color }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">{slide.title}</h2>
        </div>
        <p className="text-base text-white/60 leading-relaxed">{slide.description}</p>
        
        {/* Highlights */}
        <div className="space-y-2 pt-2">
          {slide.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                style={{ background: `${slide.color}25`, color: slide.color }}
              >
                ✓
              </div>
              <span className="text-sm text-white/75">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Screenshot preview area */}
      <div className="relative">
        <div
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${slide.color}08, ${slide.color}03)` }}
        >
          {/* Phone mockup frame */}
          <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center text-[10px] text-white/30 font-mono">ride-sure.lovable.app</div>
          </div>
          
          {/* Screenshot description area */}
          <div className="p-6 min-h-[280px] flex flex-col items-center justify-center text-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: `${slide.color}20` }}
            >
              {slide.icon}
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm italic">
              📸 {slide.screenshotDesc}
            </p>
            <a
              href="https://ride-sure.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs px-4 py-2 rounded-full border border-white/15 text-white/40 hover:text-white/70 hover:border-white/30 transition-colors"
            >
              View Live →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Closing Slide ─── */
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
          <div key={i} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70">{b}</div>
        ))}
      </div>
      <a
        href="https://ride-sure.lovable.app"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 px-8 py-3 rounded-full bg-[hsl(25,95%,53%)] text-white font-semibold hover:opacity-90 transition-opacity"
      >
        Try RideSure Live →
      </a>
    </div>
  );
}

export default Presentation;
