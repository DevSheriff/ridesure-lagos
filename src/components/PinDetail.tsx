import { X, ThumbsUp, ThumbsDown, Clock, User } from "lucide-react";
import { MapPin, PIN_CATEGORIES } from "@/data/lagos";
import { formatDistanceToNow } from "date-fns";

interface PinDetailProps {
  pin: MapPin;
  onClose: () => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
}

const PinDetail = ({ pin, onClose, onUpvote, onDownvote }: PinDetailProps) => {
  const category = PIN_CATEGORIES.find((c) => c.id === pin.category);

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
            <span className="text-xs font-medium text-muted-foreground">{category?.label}</span>
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/20 hover:bg-secondary/30 text-secondary transition-colors text-xs font-medium"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{pin.upvotes}</span>
        </button>
        <button
          onClick={() => onDownvote(pin.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors text-xs font-medium"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>{pin.downvotes}</span>
        </button>
        <div className="ml-auto text-mono text-xs text-muted-foreground">
          {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
};

export default PinDetail;
