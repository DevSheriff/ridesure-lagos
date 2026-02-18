import { useState } from "react";
import { X, Star, Send } from "lucide-react";

interface DeliveryRatingModalProps {
  onSubmit: (rating: { addressAccuracy: number; routeAccuracy: number; comment: string }) => void;
  onClose: () => void;
}

const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= value ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  </div>
);

const DeliveryRatingModal = ({ onSubmit, onClose }: DeliveryRatingModalProps) => {
  const [addressAccuracy, setAddressAccuracy] = useState(0);
  const [routeAccuracy, setRouteAccuracy] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressAccuracy === 0 || routeAccuracy === 0) return;
    onSubmit({ addressAccuracy, routeAccuracy, comment });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-panel rounded-2xl p-6 w-full max-w-sm animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">Rate This Delivery</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <StarRating
            value={addressAccuracy}
            onChange={setAddressAccuracy}
            label="📍 How accurate was the address pinpoint?"
          />

          <StarRating
            value={routeAccuracy}
            onChange={setRouteAccuracy}
            label="🗺️ How good was the route/navigation?"
          />

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Any feedback? (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Route was great but last turn was confusing..."
              rows={2}
              className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={addressAccuracy === 0 || routeAccuracy === 0}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed glow-primary"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryRatingModal;
