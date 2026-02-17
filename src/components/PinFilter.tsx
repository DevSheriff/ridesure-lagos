import { PIN_CATEGORIES, CustomCategory } from "@/data/lagos";

interface PinFilterProps {
  activeFilters: string[];
  onToggleFilter: (categoryId: string) => void;
  customCategories: CustomCategory[];
}

const PinFilter = ({ activeFilters, onToggleFilter, customCategories }: PinFilterProps) => {
  const allCategories = [...PIN_CATEGORIES, ...customCategories];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((cat) => {
        const isActive = activeFilters.length === 0 || activeFilters.includes(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() => onToggleFilter(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? "glass-panel border-primary/30 text-foreground shadow-lg"
                : "bg-muted/30 text-muted-foreground border border-transparent hover:bg-muted/50"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PinFilter;
