import { useState, useMemo } from "react";
import { Search, X, MapPin, Navigation2 } from "lucide-react";
import { LAGOS_LOCATIONS, LagosLocation } from "@/data/lagos";

interface SearchBarProps {
  onLocationSelect: (location: LagosLocation) => void;
  isNavigating?: boolean;
}

const SearchBar = ({ onLocationSelect, isNavigating }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const lower = query.toLowerCase();
    return LAGOS_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(lower) ||
        loc.area.toLowerCase().includes(lower)
    ).slice(0, 6);
  }, [query]);

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
        {query && (
          <button onClick={() => { setQuery(""); setIsOpen(false); }}>
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden animate-slide-up z-50">
          {results.map((loc) => (
            <button
              key={loc.name}
              onClick={() => {
                onLocationSelect(loc);
                setQuery(loc.name);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{loc.name}</p>
                <p className="text-xs text-muted-foreground">{loc.area}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
