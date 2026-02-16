import { useState, useCallback } from "react";
import { Plus, Navigation, Layers } from "lucide-react";
import RideSureMap from "@/components/RideSureMap";
import SearchBar from "@/components/SearchBar";
import PinFilter from "@/components/PinFilter";
import PinDetail from "@/components/PinDetail";
import AddPinForm from "@/components/AddPinForm";
import ThemeToggle from "@/components/ThemeToggle";
import { LagosLocation } from "@/data/lagos";
import { usePins } from "@/hooks/usePins";
import { useCustomCategories } from "@/hooks/useCustomCategories";
import { toast } from "sonner";

const UPVOTE_THRESHOLD = 3;

const Index = () => {
  const { pins, loading, addPin, upvote, downvote } = usePins();
  const { customCategories, addCustomCategory } = useCustomCategories();

  const [selectedPin, setSelectedPin] = useState<typeof pins[0] | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addPinCoords, setAddPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [centerOn, setCenterOn] = useState<[number, number] | undefined>();
  const [isDark, setIsDark] = useState(() => !document.documentElement.classList.contains("light"));

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
    async (data: { category: string; title: string; description: string; reportedBy: string }) => {
      if (!addPinCoords) return;
      const newPin = await addPin({ ...data, lat: addPinCoords.lat, lng: addPinCoords.lng });
      if (newPin) {
        setShowAddForm(false);
        setAddPinCoords(null);
        toast.success("Pin dropped!", { description: `${data.title} has been added. It needs ${UPVOTE_THRESHOLD} 👍 to become permanent.` });
      }
    },
    [addPinCoords, addPin]
  );

  const handleUpvote = useCallback(async (id: string) => {
    const result = await upvote(id);
    if (result.becamePermanent && result.pin) {
      toast.success("Pin is now permanent! 🎉", { description: `"${result.pin.title}" reached ${UPVOTE_THRESHOLD} upvotes.` });
    }
  }, [upvote]);

  const handleDownvote = useCallback(async (id: string) => {
    await downvote(id);
  }, [downvote]);

  const handleLocationSelect = useCallback((location: LagosLocation) => {
    setCenterOn([location.lat, location.lng]);
    setSelectedPin(null);
  }, []);

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

  // Keep selectedPin in sync with latest pin data (for upvote/downvote updates)
  const currentSelectedPin = selectedPin ? pins.find((p) => p.id === selectedPin.id) || selectedPin : null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background" onClick={handleThemeCheck}>
      <RideSureMap
        pins={pins}
        onPinClick={handlePinClick}
        onMapClick={handleMapClick}
        selectedPin={currentSelectedPin}
        filterCategories={activeFilters}
        centerOn={centerOn}
        customCategories={customCategories}
        isDark={isDark}
      />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="glass-panel px-4 py-3 rounded-xl flex items-center gap-2 flex-shrink-0">
            <Navigation className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground text-sm tracking-tight">
              Ride<span className="text-primary">Sure</span>
            </span>
          </div>
          <SearchBar onLocationSelect={handleLocationSelect} />
          <ThemeToggle />
        </div>

        {showFilters && (
          <div className="mt-3 max-w-2xl mx-auto animate-slide-up">
            <PinFilter activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="max-w-sm mx-auto space-y-3">
          {currentSelectedPin && !showAddForm && (
            <PinDetail
              pin={currentSelectedPin}
              onClose={() => setSelectedPin(null)}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
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

            <div className="glass-panel px-3 py-3 rounded-xl">
              <span className="text-xs text-muted-foreground font-mono">
                {loading ? "..." : `${pins.length} pins`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
