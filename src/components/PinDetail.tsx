import { X, ThumbsUp, ThumbsDown, Clock, User, Shield } from "lucide-react";
import { MapPin, PIN_CATEGORIES, CustomCategory } from "@/data/lagos";
import { formatDistanceToNow } from "date-fns";
import { hasVoted } from "@/hooks/useVoteTracker";

interface PinDetailProps {
  pin: MapPin;
  onClose: () => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  customCategories: CustomCategory[];
}

const PinDetail = ({ pin, onClose, onUpvote, onDownvote, customCategories }: PinDetailProps) => {
  const allCategories = [...PIN_CATEGORIES, ...customCategories];
  const category = allCategories.find((c) => c.id === pin.category);
  const voted = hasVoted(pin.id);

  return (
    <div className="glass-panel rounded-2xl p-5 animate-slide-up w-full max-w-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: category?.color }}
          >
            {category?.icon}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">{category?.label}</span>
              {pin.permanent && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-secondary bg-secondary/20 px-1.5 py-0.5 rounded-full">
                  <Shield className="w-2.5 h-2.5" />
                  Permanent
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">{pin.title}</h3>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{pin.description}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {pin.reportedBy}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(pin.reportedAt, { addSuffix: true })}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpvote(pin.id)}
          disabled={voted !== null}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            voted === "up"
              ? "bg-secondary/30 text-secondary cursor-default"
              : voted !== null
              ? "bg-muted/30 text-muted-foreground cursor-not-allowed opacity-50"
              : "bg-secondary/20 hover:bg-secondary/30 text-secondary"
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{pin.upvotes}</span>
        </button>
        <button
          onClick={() => onDownvote(pin.id)}
          disabled={voted !== null}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            voted === "down"
              ? "bg-destructive/30 text-destructive cursor-default"
              : voted !== null
              ? "bg-muted/30 text-muted-foreground cursor-not-allowed opacity-50"
              : "bg-destructive/20 hover:bg-destructive/30 text-destructive"
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>{pin.downvotes}</span>
        </button>
        {voted && (
          <span className="text-[10px] text-muted-foreground italic">Already voted</span>
        )}
        {!voted && !pin.permanent && (
          <span className="ml-auto text-[10px] text-muted-foreground">
            {Math.max(0, 3 - pin.upvotes)} more 👍 to permanent
          </span>
        )}
        {pin.permanent && (
          <div className="ml-auto text-mono text-xs text-muted-foreground">
            {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PinDetail;
