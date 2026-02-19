import { Map, LayoutDashboard } from "lucide-react";

interface BottomNavProps {
  activeTab: "map" | "dashboard";
  onTabChange: (tab: "map" | "dashboard") => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-card/95 backdrop-blur-xl border-t border-border/50">
      <div className="max-w-lg mx-auto flex">
        <button
          onClick={() => onTabChange("map")}
          className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
            activeTab === "map" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wide">Map</span>
          {activeTab === "map" && <div className="w-5 h-0.5 rounded-full bg-primary" />}
        </button>
        <button
          onClick={() => onTabChange("dashboard")}
          className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
            activeTab === "dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wide">Dashboard</span>
          {activeTab === "dashboard" && <div className="w-5 h-0.5 rounded-full bg-primary" />}
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
