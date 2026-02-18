import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Search, X, MapPin, Navigation2, Loader2 } from "lucide-react";
import { LagosLocation, LAGOS_LOCATIONS } from "@/data/lagos";

interface SearchBarProps {
  onLocationSelect: (location: LagosLocation) => void;
  isNavigating?: boolean;
}

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    neighbourhood?: string;
    county?: string;
  };
}

const SearchBar = ({ onLocationSelect, isNavigating }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Local results from hardcoded locations (instant)
  const localResults = useMemo(() => {
    if (query.length < 2) return [];
    const lower = query.toLowerCase();
    return LAGOS_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(lower) ||
        loc.area.toLowerCase().includes(lower)
    ).slice(0, 3);
  }, [query]);

  // Geocode with Nominatim (debounced)
  const searchGeo = useCallback(async (q: string) => {
    if (q.length < 3) {
      setGeoResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const searchQuery = q.toLowerCase().includes("lagos") ? q : `${q}, Lagos, Nigeria`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=ng&viewbox=2.7,6.2,4.4,6.9&bounded=1&limit=6&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      const results = Array.isArray(data) ? data : [];
      setGeoResults(results);
    } catch {
      setGeoResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 3) {
      debounceRef.current = setTimeout(() => searchGeo(query), 400);
    } else {
      setGeoResults([]);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchGeo]);

  const handleSelectLocal = (loc: LagosLocation) => {
    onLocationSelect(loc);
    setQuery(loc.name);
    setIsOpen(false);
    setGeoResults([]);
  };

  const handleSelectGeo = (result: GeoResult) => {
    const area = result.address?.suburb || result.address?.neighbourhood || result.address?.county || result.address?.city || "Lagos";
    const name = result.address?.road
      ? `${result.address.road}${result.address.suburb ? `, ${result.address.suburb}` : ""}`
      : result.display_name.split(",").slice(0, 2).join(",");

    const location: LagosLocation = {
      name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      area,
    };
    onLocationSelect(location);
    setQuery(name);
    setIsOpen(false);
    setGeoResults([]);
  };

  const hasResults = localResults.length > 0 || geoResults.length > 0;

  return (
    <div className="relative w-full max-w-md">
      <div className={`glass-panel flex items-center gap-2 px-4 py-3 rounded-xl ${isNavigating ? "border-blue-500/40" : ""}`}>
        {isNavigating ? (
          <Navigation2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
        <input
          type="text"
          placeholder="Which address are you delivering to?"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full text-sm"
        />
        {isSearching && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin flex-shrink-0" />}
        {query && !isSearching && (
          <button onClick={() => { setQuery(""); setIsOpen(false); setGeoResults([]); }}>
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>

      {isOpen && (hasResults || isSearching) && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden animate-slide-up z-50 max-h-72 overflow-y-auto">
          {/* Local known locations */}
          {localResults.length > 0 && (
            <>
              <div className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                Known Locations
              </div>
              {localResults.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => handleSelectLocal(loc)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">{loc.area}</p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Geocoded results */}
          {geoResults.length > 0 && (
            <>
              <div className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                Addresses
              </div>
              {geoResults.map((result, i) => {
                const label = result.display_name.split(",").slice(0, 3).join(", ");
                const area = result.address?.suburb || result.address?.city || "";
                return (
                  <button
                    key={`${result.lat}-${result.lon}-${i}`}
                    onClick={() => handleSelectGeo(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <Navigation2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{label}</p>
                      {area && <p className="text-xs text-muted-foreground">{area}</p>}
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {isSearching && geoResults.length === 0 && localResults.length === 0 && (
            <div className="px-4 py-4 text-center text-xs text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Searching addresses...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
