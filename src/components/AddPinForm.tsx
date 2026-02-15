import { useState } from "react";
import { X, MapPin, Send } from "lucide-react";
import { PIN_CATEGORIES } from "@/data/lagos";

interface AddPinFormProps {
  lat: number;
  lng: number;
  onSubmit: (data: { category: string; title: string; description: string; reportedBy: string }) => void;
  onCancel: () => void;
}

const AddPinForm = ({ lat, lng, onSubmit, onCancel }: AddPinFormProps) => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reportedBy, setReportedBy] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !title || !reportedBy) return;
    onSubmit({ category, title, description, reportedBy });
  };

  return (
    <div className="glass-panel rounded-2xl p-5 animate-slide-up w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Drop a Pin</h3>
        </div>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-4 font-mono">
        📍 {lat.toFixed(5)}, {lng.toFixed(5)}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
          <div className="grid grid-cols-3 gap-1.5">
            {PIN_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all ${
                  category === cat.id
                    ? "bg-primary/20 border border-primary/40 text-foreground"
                    : "bg-muted/30 border border-transparent text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span className="text-[10px] leading-tight text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Checkpoint on Allen Avenue"
            className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details to help other riders..."
            rows={2}
            className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Rider Name</label>
          <input
            type="text"
            value={reportedBy}
            onChange={(e) => setReportedBy(e.target.value)}
            placeholder="e.g. ChidiRider"
            className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!category || !title || !reportedBy}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed glow-primary"
        >
          <Send className="w-3.5 h-3.5" />
          Drop Pin
        </button>
      </form>
    </div>
  );
};

export default AddPinForm;
