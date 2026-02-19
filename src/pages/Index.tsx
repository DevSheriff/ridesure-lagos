import { useState, useCallback } from "react";
import { Plus, Navigation, Layers, CheckCircle, Flame } from "lucide-react";
import RideSureMap from "@/components/RideSureMap";
import SearchBar from "@/components/SearchBar";
import PinFilter from "@/components/PinFilter";
import PinDetail from "@/components/PinDetail";
import AddPinForm from "@/components/AddPinForm";
import ThemeToggle from "@/components/ThemeToggle";
import TurnByTurn from "@/components/TurnByTurn";
import DeliveryRatingModal from "@/components/DeliveryRatingModal";
import QuickPinButton from "@/components/QuickPinButton";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import { LagosLocation } from "@/data/lagos";
import { usePins } from "@/hooks/usePins";
import { useCustomCategories } from "@/hooks/useCustomCategories";
import { useReliabilityScores } from "@/hooks/useReliabilityScores";
import { hasVoted, recordVote } from "@/hooks/useVoteTracker";
import { fetchRoute, RouteData } from "@/lib/routing";
import { toast } from "sonner";

const UPVOTE_THRESHOLD = 3;
// Default rider position (Lagos center area)
const RIDER_POSITION: [number, number] = [6.5244, 3.3792];

const Index = () => {
  const [activeTab, setActiveTab] = useState<"map" | "dashboard">("map");
  const { pins, loading, addPin, upvote, downvote } = usePins();
  const { customCategories, addCustomCategory } = useCustomCategories();
  const { scores: reliabilityScores, saveRating } = useReliabilityScores();

  const [selectedPin, setSelectedPin] = useState<typeof pins[0] | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addPinCoords, setAddPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [centerOn, setCenterOn] = useState<[number, number] | undefined>();
  const [isDark, setIsDark] = useState(() => !document.documentElement.classList.contains("light"));
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Navigation state
  const [route, setRoute] = useState<RouteData | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<[number, number] | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);

  const handleThemeCheck = useCallback(() => {
    setIsDark(!document.documentElement.classList.contains("light"));
  }, []);

  const handlePinClick = useCallback((pin: typeof pins[0]) => {
    setSelectedPin(pin);
    setShowAddForm(false);
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (showAddForm) {
      setAddPinCoords({ lat, lng });
    } else {
      setSelectedPin(null);
    }
  }, [showAddForm]);

  const handleToggleFilter = useCallback((categoryId: string) => {
    setActiveFilters((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  }, []);

  const handleAddPin = useCallback(
    async (data: { category: string; title: string; description: string; reportedBy: string; permanent: boolean }) => {
      if (!addPinCoords) return;
      const newPin = await addPin({ ...data, lat: addPinCoords.lat, lng: addPinCoords.lng });
      if (newPin) {
        setShowAddForm(false);
        setAddPinCoords(null);
        if (data.permanent) {
          toast.success("Permanent pin dropped!", { description: `${data.title} has been added permanently.` });
        } else {
          toast.success("Pin dropped!", { description: `${data.title} has been added. It needs ${UPVOTE_THRESHOLD} 👍 in 24h to stay.` });
        }
      }
    },
    [addPinCoords, addPin]
  );

  const handleUpvote = useCallback(async (id: string) => {
    if (hasVoted(id)) {
      toast.error("Already voted", { description: "You can only vote once per pin from this device." });
      return;
    }
    recordVote(id, "up");
    const result = await upvote(id);
    if (result.becamePermanent && result.pin) {
      toast.success("Pin is now permanent! 🎉", { description: `"${result.pin.title}" reached ${UPVOTE_THRESHOLD} upvotes.` });
    }
  }, [upvote]);

  const handleDownvote = useCallback(async (id: string) => {
    if (hasVoted(id)) {
      toast.error("Already voted", { description: "You can only vote once per pin from this device." });
      return;
    }
    recordVote(id, "down");
    await downvote(id);
  }, [downvote]);

  const handleLocationSelect = useCallback(async (location: LagosLocation) => {
    const dest: [number, number] = [location.lat, location.lng];
    setDestinationMarker(dest);
    setCenterOn(dest);
    setSelectedPin(null);
    setRouteLoading(true);

    // Try to get user's real location, fallback to Lagos center
    let from = RIDER_POSITION;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      from = [pos.coords.latitude, pos.coords.longitude];
    } catch {
      // Use default
    }

    const routeData = await fetchRoute(from[0], from[1], dest[0], dest[1]);
    setRouteLoading(false);

    if (routeData) {
      setRoute(routeData);
      setIsNavigating(true);
      toast.success("Route found!", {
        description: `${(routeData.distance / 1000).toFixed(1)}km · ~${Math.round(routeData.duration / 60)} min ride`,
      });
    } else {
      toast.error("Could not find route", { description: "Try a different address." });
    }
  }, []);

  const handleDeliveryComplete = () => {
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating: { addressAccuracy: number; routeAccuracy: number; comment: string }) => {
    setShowRatingModal(false);
    if (destinationMarker) {
      await saveRating(destinationMarker[0], destinationMarker[1], rating.addressAccuracy, rating.routeAccuracy, rating.comment);
    }
    setRoute(null);
    setDestinationMarker(null);
    setIsNavigating(false);
    toast.success("Thank you for your feedback! 🙏", {
      description: `Address: ${rating.addressAccuracy}⭐ · Route: ${rating.routeAccuracy}⭐`,
    });
  };

  const handleQuickPin = useCallback(async (lat: number, lng: number) => {
    return await addPin({
      category: "extortion",
      title: "⚠️ Extortion Zone",
      description: "Rider-reported extortion or illegal checkpoint at this location. Be alert!",
      reportedBy: "QuickReport",
      lat,
      lng,
      permanent: false,
    });
  }, [addPin]);

  const handleCancelNavigation = () => {
    setRoute(null);
    setDestinationMarker(null);
    setIsNavigating(false);
  };

  const handleStartAddPin = () => {
    setShowAddForm(true);
    setSelectedPin(null);
    setAddPinCoords(null);
    toast.info("Tap the map to drop a pin", { description: "Click anywhere on the map to set the pin location." });
  };

  const handleAddCustomCategory = useCallback(async (cat: Parameters<typeof addCustomCategory>[0]) => {
    await addCustomCategory(cat);
    toast.success(`New category "${cat.label}" created!`);
  }, [addCustomCategory]);

  const currentSelectedPin = selectedPin ? pins.find((p) => p.id === selectedPin.id) || selectedPin : null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background" onClick={handleThemeCheck}>
      {activeTab === "map" ? (
        <>
          <RideSureMap
            pins={pins}
            onPinClick={handlePinClick}
            onMapClick={handleMapClick}
            selectedPin={currentSelectedPin}
            filterCategories={activeFilters}
            centerOn={centerOn}
            customCategories={customCategories}
            isDark={isDark}
            route={route}
            destinationMarker={destinationMarker}
            reliabilityScores={reliabilityScores}
            showHeatmap={showHeatmap}
          />

          {/* Quick Pin Floating Button */}
          <QuickPinButton onQuickPin={handleQuickPin} />

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4">
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
              <div className="glass-panel px-4 py-3 rounded-xl flex items-center gap-2 flex-shrink-0">
                <Navigation className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground text-sm tracking-tight">
                  Ride<span className="text-primary">Sure</span>
                </span>
              </div>
              <SearchBar onLocationSelect={handleLocationSelect} isNavigating={isNavigating} />
              <ThemeToggle />
            </div>

            {showFilters && (
              <div className="mt-3 max-w-2xl mx-auto animate-slide-up">
                <PinFilter activeFilters={activeFilters} onToggleFilter={handleToggleFilter} customCategories={customCategories} />
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-14 left-0 right-0 z-10 p-4">
            <div className="max-w-sm mx-auto space-y-3">
              {/* Turn by turn directions */}
              {isNavigating && route && !showAddForm && !currentSelectedPin && (
                <TurnByTurn route={route} />
              )}

              {currentSelectedPin && !showAddForm && (
                <PinDetail
                  pin={currentSelectedPin}
                  onClose={() => setSelectedPin(null)}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  customCategories={customCategories}
                />
              )}

              {showAddForm && addPinCoords && (
                <AddPinForm
                  lat={addPinCoords.lat}
                  lng={addPinCoords.lng}
                  onSubmit={handleAddPin}
                  onCancel={() => {
                    setShowAddForm(false);
                    setAddPinCoords(null);
                  }}
                  customCategories={customCategories}
                  onAddCustomCategory={handleAddCustomCategory}
                />
              )}

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`glass-panel p-3 rounded-xl transition-all ${
                    showFilters ? "border-primary/40 glow-primary" : "hover:border-primary/20"
                  }`}
                >
                  <Layers className="w-5 h-5 text-foreground" />
                </button>

                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`glass-panel p-3 rounded-xl transition-all ${
                    showHeatmap ? "border-destructive/40 shadow-[0_0_12px_hsl(0,72%,55%/0.3)]" : "hover:border-destructive/20"
                  }`}
                  title="Toggle seizure heatmap"
                >
                  <Flame className={`w-5 h-5 ${showHeatmap ? "text-destructive" : "text-foreground"}`} />
                </button>

                {isNavigating ? (
                  <>
                    <button
                      onClick={handleDeliveryComplete}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all bg-secondary text-secondary-foreground hover:opacity-90 shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Delivery Complete
                    </button>
                    <button
                      onClick={handleCancelNavigation}
                      className="glass-panel px-3 py-3 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartAddPin}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                      showAddForm
                        ? "bg-primary text-primary-foreground glow-primary"
                        : "glass-panel text-foreground hover:border-primary/20"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    {showAddForm ? "Tap map to place" : "Drop a Pin"}
                  </button>
                )}

                <div className="glass-panel px-3 py-3 rounded-xl">
                  <span className="text-xs text-muted-foreground font-mono">
                    {routeLoading ? "routing..." : loading ? "..." : `${pins.length} pins`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Dashboard />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Rating Modal */}
      {showRatingModal && (
        <DeliveryRatingModal
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
};

export default Index;
