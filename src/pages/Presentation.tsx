import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Grid3X3, Navigation } from "lucide-react";

const slides = [
  {
    type: "title" as const,
    title: "RideSure",
    subtitle: "Community-Driven Delivery Navigation for Lagos",
    tagline: "No Stories, Just Deliveries...",
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
    description: "When you open the app, you see the RideSure logo, tagline, and a smooth loading bar. It fades away after about 2 seconds while the map loads in the background.",
    highlights: ["Smooth fade-in animation with the logo and tagline", "Loading progress bar shows the app is getting ready", "Automatically transitions to the main map screen"],
    screenshot: "/screenshots/01-splash.jpg",
  },
  {
    type: "feature" as const,
    number: "02",
    title: "Interactive Map Interface",
    icon: "🗺️",
    color: "hsl(210, 100%, 55%)",
    description: "A full-screen map centered on Lagos shows all reported hazards as colorful pin markers. Each color and emoji represents a different hazard type so riders can spot dangers at a glance.",
    highlights: ["Full-screen map covering all of Lagos", "Color-coded markers for each hazard type", "Tap any marker for details, tap the map to report"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "03",
    title: "Hazard Categories",
    icon: "📌",
    color: "hsl(0, 72%, 55%)",
    description: "8 built-in hazard types that Lagos riders face daily — from road blocks and bad roads to extortion zones and flooding. Each has a unique icon and color.",
    highlights: ["🚧 Road Block — Checkpoints", "🚪 Estate Gate — Gated entrances", "⚠️ Bad Road — Potholes & damage", "🚨 Extortion Zone — Illegal collection spots", "🌊 Flooding — Waterlogged streets", "👮 Police/LASTMA — Officer stops"],
    screenshot: "/screenshots/03-filters.jpg",
  },
  {
    type: "feature" as const,
    number: "04",
    title: "Category Filters",
    icon: "🔍",
    color: "hsl(280, 65%, 55%)",
    description: "The filter bar lets riders show only the hazard types they care about. Tap a category pill to toggle it — the map updates instantly.",
    highlights: ["Tap the layers icon to open the filter bar", "Select one or multiple categories", "Map updates in real-time as you toggle", "Includes custom categories too"],
    screenshot: "/screenshots/03-filters.jpg",
  },
  {
    type: "feature" as const,
    number: "05",
    title: "Drop a Pin — Report a Hazard",
    icon: "📍",
    color: "hsl(150, 60%, 45%)",
    description: "Two easy steps: tap the map to mark the spot, then fill a quick form — pick the hazard type, choose temporary or permanent, add a title and description.",
    highlights: ["Tap anywhere on the map to set location", "Pick from a visual grid of hazard types", "Choose 'Temporary' (24h) or 'Permanent'", "Option to create a brand new hazard type"],
    screenshot: "/screenshots/04-pin-form.jpg",
  },
  {
    type: "feature" as const,
    number: "06",
    title: "Smart Search & Address Lookup",
    icon: "🔎",
    color: "hsl(200, 80%, 50%)",
    description: "Type a destination and get instant results. 30+ popular Lagos landmarks are pre-loaded, and for anything else the app searches real addresses online. Pick a result and the bike route is planned automatically.",
    highlights: ["30+ pre-loaded Lagos locations", "Live address search for any location", "Results grouped into 'Known' and 'Addresses'", "Selecting a result plans your bike route"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "07",
    title: "Bike Route Navigation",
    icon: "🛣️",
    color: "hsl(210, 100%, 55%)",
    description: "After picking a destination, a blue route line is drawn on the map optimized for bikes. A directions panel shows step-by-step turns with distances and estimated ride time.",
    highlights: ["Blue route line from your area to destination", "Step-by-step turn directions with distances", "Total distance and estimated ride time", "'Delivery Complete' button to finish and rate"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "08",
    title: "Hazard Heatmap",
    icon: "🔥",
    color: "hsl(15, 90%, 55%)",
    description: "The heatmap highlights danger zones by clustering high-frequency hazard reports. Areas with many reports glow red, helping riders avoid dangerous neighborhoods.",
    highlights: ["Clusters reports to show high-risk zones", "Color intensity shows danger level", "Toggle on/off with the flame button", "Focuses on extortion and road blocks"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "09",
    title: "Quick Alert — One-Tap Extortion Report",
    icon: "⚠️",
    color: "hsl(0, 85%, 50%)",
    description: "The floating red button is for emergencies. If a rider encounters extortion, one tap instantly reports it using GPS — no forms, no typing, no delay.",
    highlights: ["Floating red warning button always visible", "Uses phone GPS for exact location", "Creates an 'Extortion Zone' pin automatically", "Alerts all nearby riders immediately"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "10",
    title: "Community Voting",
    icon: "👍",
    color: "hsl(45, 100%, 55%)",
    description: "Every pin can be upvoted or downvoted. If a temporary pin gets 3+ upvotes within 24 hours, it becomes permanent. The community validates which hazards are real.",
    highlights: ["Upvote to confirm a hazard is real", "Downvote if it's no longer there", "3+ upvotes promote temporary → permanent", "Each device can only vote once per pin"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "11",
    title: "Delivery Ratings & Reliability",
    icon: "⭐",
    color: "hsl(150, 60%, 45%)",
    description: "After completing a delivery, riders rate address accuracy and route quality. Ratings show as colored circles on the map — green means reliable, yellow is okay, red means unreliable.",
    highlights: ["Rate address accuracy 1-5 stars", "Rate route quality 1-5 stars", "Optional comment about the delivery", "Green / Yellow / Red circles on map"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "12",
    title: "Rider Dashboard",
    icon: "📊",
    color: "hsl(250, 65%, 55%)",
    description: "The Dashboard gives a bird's-eye view of all contributions — total pins, upvotes, permanent vs active, the most-reported category, and a filterable list of all pins.",
    highlights: ["4 stat cards: Total Pins, Upvotes, Permanent, Active", "Top Category badge for most-reported type", "Filter pins: All, Active, or Permanent", "Time stamps and delete option per pin"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "13",
    title: "Pin Management & Deletion",
    icon: "🗑️",
    color: "hsl(0, 60%, 50%)",
    description: "From the Dashboard, riders can delete pins they no longer need. Tap the trash icon and it's removed from the map and database instantly.",
    highlights: ["Trash icon next to each pin in the list", "Pin removed from map immediately", "Confirmation message after deletion", "Syncs across all users in real-time"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "14",
    title: "Dark & Light Mode",
    icon: "🌗",
    color: "hsl(260, 50%, 55%)",
    description: "Switch between dark and light themes with one tap. The map tiles, colors, and entire UI adapt. Dark mode is easier on the eyes for night rides.",
    highlights: ["Sun/Moon toggle in the top-right corner", "Map tiles switch between dark and light", "All UI elements adapt to the theme", "Great for night riding or bright sunlight"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "15",
    title: "Bottom Navigation",
    icon: "📱",
    color: "hsl(200, 70%, 50%)",
    description: "Simple two-tab navigation at the bottom: Map and Dashboard. Designed for one-handed phone use, easy to switch views while on the go.",
    highlights: ["Two tabs: Map and Dashboard", "Active tab highlighted with brand color", "Always visible at screen bottom", "Thumb-friendly for mobile use"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "16",
    title: "Auto-Expiry System",
    icon: "⏰",
    color: "hsl(30, 80%, 55%)",
    description: "Temporary pins disappear after 24 hours unless other riders upvote them. This keeps the map clean and ensures only verified hazards stay visible.",
    highlights: ["Temporary pins last 24 hours", "3+ upvotes make it permanent", "Expired pins removed automatically", "Keeps the map accurate and clean"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "17",
    title: "Custom Hazard Types",
    icon: "🎨",
    color: "hsl(320, 70%, 55%)",
    description: "Riders can create entirely new hazard categories if the built-in ones don't fit. Choose a name, emoji, color, and description — the new type appears for everyone.",
    highlights: ["Tap '+ New Type' in the pin form", "Pick any emoji, color, name, description", "New categories sync to all users", "Shows in filters, markers, and dashboard"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "feature" as const,
    number: "18",
    title: "Real-Time Data Sync",
    icon: "🔄",
    color: "hsl(170, 60%, 45%)",
    description: "Everything syncs in real-time across all riders. When someone drops a pin, votes, or rates a delivery, every user sees the update immediately.",
    highlights: ["All pins sync instantly across users", "Votes and ratings update live", "Cloud database with live subscriptions", "Works on slow connections with smart caching"],
    screenshot: "/screenshots/map-overview.png",
  },
  {
    type: "closing" as const,
    title: "Thank You",
    subtitle: "Built with ❤️ for Lagos Riders",
    tagline: "No Stories, Just Deliveries...",
    bullets: [
      "18 features built from the ground up",
      "Live map with 78+ community hazards",
      "Bike-optimized route planning",
      "Real-time sync for every rider",
    ],
  },
];

const Presentation = () => {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const total = slides.length;
  const slide = slides[current];

  const go = useCallback((dir: 1 | -1) => {
    setShowGrid(false);
    setCurrent((p) => Math.max(0, Math.min(total - 1, p + dir)));
  }, [total]);

  const goTo = useCallback((i: number) => { setCurrent(i); setShowGrid(false); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") { if (showGrid) setShowGrid(false); else if (document.fullscreenElement) document.exitFullscreen(); }
      if (e.key === "g" || e.key === "G") setShowGrid((p) => !p);
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, showGrid]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const progress = ((current + 1) / total) * 100;

  return (
    <div className="h-screen w-screen bg-[hsl(220,20%,8%)] text-white flex flex-col overflow-hidden select-none">
      <div className="h-1 w-full bg-white/10 shrink-0">
        <div className="h-full bg-[hsl(25,95%,53%)] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {showGrid && (
        <div className="absolute inset-0 z-50 bg-[hsl(220,20%,8%)]/95 p-8 overflow-auto">
          <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
            {slides.map((s, i) => (
              <button key={i} onClick={() => goTo(i)} className={`aspect-video rounded-lg border-2 p-4 text-left transition-all hover:scale-105 ${i === current ? "border-[hsl(25,95%,53%)] bg-white/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
                <div className="text-xs text-white/40 mb-1">{i + 1} / {total}</div>
                <div className="text-sm font-semibold truncate">{s.type === "feature" ? `${s.number}. ` : ""}{s.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 animate-[fadeInUp_0.4s_ease-out]" key={current}>
          {slide.type === "title" && <TitleSlide slide={slide} />}
          {slide.type === "feature" && <FeatureSlide slide={slide} />}
          {slide.type === "closing" && <ClosingSlide slide={slide} />}
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-between px-6 py-3 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowGrid((p) => !p)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Grid view (G)"><Grid3X3 className="w-4 h-4" /></button>
          <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Fullscreen (F)">{isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}</button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => go(-1)} disabled={current === 0} className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <span className="text-sm font-mono text-white/60 min-w-[60px] text-center">{current + 1} / {total}</span>
          <button onClick={() => go(1)} disabled={current === total - 1} className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="text-xs text-white/30 hidden md:block">← → navigate · G grid · F fullscreen</div>
      </div>
    </div>
  );
};

function TitleSlide({ slide }: { slide: (typeof slides)[0] }) {
  if (slide.type !== "title") return null;
  return (
    <div className="text-center space-y-8">
      <div className="flex items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-[hsl(25,95%,53%)]/15 flex items-center justify-center">
          <Navigation className="w-10 h-10 text-[hsl(25,95%,53%)]" />
        </div>
      </div>
      <h1 className="text-7xl md:text-8xl font-black tracking-tight">Ride<span className="text-[hsl(25,95%,53%)]">Sure</span></h1>
      <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto">{slide.subtitle}</p>
      <p className="text-lg text-white/30 tracking-[0.3em] uppercase">{slide.tagline}</p>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {slide.bullets.map((b, i) => <span key={i} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">{b}</span>)}
      </div>
    </div>
  );
}

function FeatureSlide({ slide }: { slide: (typeof slides)[number] }) {
  if (slide.type !== "feature") return null;
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center h-full">
      {/* Left — text */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: `${slide.color}20`, color: slide.color }}>Feature {slide.number}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: `${slide.color}15` }}>{slide.icon}</div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">{slide.title}</h2>
        </div>
        <p className="text-base text-white/60 leading-relaxed">{slide.description}</p>
        <div className="space-y-2 pt-2">
          {slide.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5" style={{ background: `${slide.color}25`, color: slide.color }}>✓</div>
              <span className="text-sm text-white/75">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — actual app screenshot */}
      <div className="relative flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl w-full max-h-[480px]">
          <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,60%,50%)]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(45,80%,50%)]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(130,60%,50%)]/60" />
            </div>
            <div className="flex-1 text-center text-[10px] text-white/30 font-mono">ride-sure.lovable.app</div>
          </div>
          <img
            src={slide.screenshot}
            alt={`Screenshot of ${slide.title}`}
            className="w-full object-cover object-top"
            style={{ maxHeight: "440px" }}
          />
        </div>
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
        {slide.bullets?.map((b, i) => <div key={i} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70">{b}</div>)}
      </div>
      <a href="https://ride-sure.lovable.app" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-8 py-3 rounded-full bg-[hsl(25,95%,53%)] text-white font-semibold hover:opacity-90 transition-opacity">
        Try RideSure Live →
      </a>
    </div>
  );
}

export default Presentation;
