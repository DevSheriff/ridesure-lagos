import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QuickPinButtonProps {
  onQuickPin: (lat: number, lng: number) => Promise<any>;
}

const QuickPinButton = ({ onQuickPin }: QuickPinButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleTap = async () => {
    setLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, enableHighAccuracy: true })
      );
      const result = await onQuickPin(pos.coords.latitude, pos.coords.longitude);
      if (result) {
        toast.success("🚨 Extortion zone pinned!", { description: "Other riders will be alerted." });
      }
    } catch {
      toast.error("Couldn't get your location", { description: "Please enable GPS and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTap}
      disabled={loading}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-60"
      title="Report extortion zone at your location"
    >
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <AlertTriangle className="w-6 h-6" />
      )}
    </button>
  );
};

export default QuickPinButton;
