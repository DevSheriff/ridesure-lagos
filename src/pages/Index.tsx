import { useState, useCallback } from "react";
import { Plus, Navigation, Layers } from "lucide-react";
import RideSureMap from "@/components/RideSureMap";
import SearchBar from "@/components/SearchBar";
import PinFilter from "@/components/PinFilter";
import PinDetail from "@/components/PinDetail";
import AddPinForm from "@/components/AddPinForm";
import { INITIAL_PINS, MapPin, LagosLocation } from "@/data/lagos";
import { toast } from "sonner";

const Index = () => {
  const [pins, setPins] = useState<MapPin[]>(INITIAL_PINS);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addPinCoords, setAddPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [centerOn, setCenterOn] = useState<[number, number] | undefined>();

  const handlePinClick = useCallback((pin: MapPin) => {
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
    setActiveFilters((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  }, []);

  const handleAddPin = useCallback(
    (data: { category: string; title: string; description: string; reportedBy: string }) => {
      if (!addPinCoords) return;
      const newPin: MapPin = {
        id: Date.now().toString(),
        lat: addPinCoords.lat,
        lng: addPinCoords.lng,
        ...data,
        reportedAt: new Date(),
        upvotes: 0,
        downvotes: 0,
        active: true,
      };
      setPins((prev) => [...prev, newPin]);
      setShowAddForm(false);
      setAddPinCoords(null);
      toast.success("Pin dropped!", { description: `${data.title} has been added to the map.` });
    },
    [addPinCoords]
  );

  const handleUpvote = useCallback((id: string) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p)));
  }, []);

  const handleDownvote = useCallback((id: string) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, downvotes: p.downvotes + 1 } : p)));
  }, []);

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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Map */}
      <RideSureMap
        pins={pins}
        onPinClick={handlePinClick}
        onMapClick={handleMapClick}
        selectedPin={selectedPin}
        filterCategories={activeFilters}
        centerOn={centerOn}
      />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          {/* Logo */}
          <div className="glass-panel px-4 py-3 rounded-xl flex items-center gap-2 flex-shrink-0">
            <Navigation className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground text-sm tracking-tight">
              Ride<span className="text-primary">Sure</span>
            </span>
          </div>

          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 max-w-2xl mx-auto animate-slide-up">
            <PinFilter activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="max-w-sm mx-auto space-y-3">
          {/* Pin Detail */}
          {selectedPin && !showAddForm && (
            <PinDetail
              pin={selectedPin}
              onClose={() => setSelectedPin(null)}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
            />
          )}

          {/* Add Pin Form */}
          {showAddForm && addPinCoords && (
            <AddPinForm
              lat={addPinCoords.lat}
              lng={addPinCoords.lng}
              onSubmit={handleAddPin}
              onCancel={() => {
                setShowAddForm(false);
                setAddPinCoords(null);
              }}
            />
          )}

          {/* Action Buttons */}
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
              <span className="text-xs text-muted-foreground font-mono">{pins.length} pins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
