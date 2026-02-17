import { useState } from "react";
import { X, MapPin, Send, Plus } from "lucide-react";
import { PIN_CATEGORIES, CustomCategory } from "@/data/lagos";

interface AddPinFormProps {
  lat: number;
  lng: number;
  onSubmit: (data: { category: string; title: string; description: string; reportedBy: string; permanent: boolean }) => void;
  onCancel: () => void;
  customCategories: CustomCategory[];
  onAddCustomCategory: (cat: CustomCategory) => void;
}

const EMOJI_OPTIONS = ["🔴", "🟡", "🟢", "🔵", "🟣", "⚪", "🟠", "🛑", "⛔", "🚨", "🏗️", "🚦", "🏍️", "🛣️", "🌉", "🚛"];
const COLOR_OPTIONS = [
  "hsl(0, 70%, 55%)",
  "hsl(30, 90%, 55%)",
  "hsl(60, 80%, 50%)",
  "hsl(120, 50%, 45%)",
  "hsl(180, 60%, 45%)",
  "hsl(210, 70%, 55%)",
  "hsl(270, 55%, 55%)",
  "hsl(330, 65%, 55%)",
];

const AddPinForm = ({ lat, lng, onSubmit, onCancel, customCategories, onAddCustomCategory }: AddPinFormProps) => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [isPermanent, setIsPermanent] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🔴");
  const [newCatColor, setNewCatColor] = useState(COLOR_OPTIONS[0]);
  const [newCatDesc, setNewCatDesc] = useState("");

  const allCategories = [...PIN_CATEGORIES, ...customCategories];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !title || !reportedBy) return;
    onSubmit({ category, title, description, reportedBy, permanent: isPermanent });
  };

  const handleCreateCategory = () => {
    if (!newCatLabel) return;
    const id = newCatLabel.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    const newCat: CustomCategory = {
      id,
      label: newCatLabel,
      icon: newCatIcon,
      color: newCatColor,
      description: newCatDesc || `Custom: ${newCatLabel}`,
    };
    onAddCustomCategory(newCat);
    setCategory(id);
    setShowCreateCategory(false);
    setNewCatLabel("");
    setNewCatDesc("");
  };

  return (
    <div className="glass-panel rounded-2xl p-5 animate-slide-up w-full max-w-sm max-h-[70vh] overflow-y-auto">
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
        {/* Category selector */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
          <div className="grid grid-cols-3 gap-1.5">
            {allCategories.map((cat) => (
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
            <button
              type="button"
              onClick={() => setShowCreateCategory(!showCreateCategory)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all border ${
                showCreateCategory
                  ? "border-accent/40 bg-accent/10 text-foreground"
                  : "border-dashed border-border text-muted-foreground hover:bg-muted/30"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-[10px] leading-tight text-center">New Type</span>
            </button>
          </div>
        </div>

        {showCreateCategory && (
          <div className="bg-muted/20 border border-border rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-foreground">Create New Category</p>
            <input
              type="text"
              value={newCatLabel}
              onChange={(e) => setNewCatLabel(e.target.value)}
              placeholder="Category name"
              className="w-full bg-muted/30 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Pick an icon</p>
              <div className="flex flex-wrap gap-1">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setNewCatIcon(e)}
                    className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-all ${
                      newCatIcon === e ? "bg-primary/30 border border-primary/50" : "bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Pick a color</p>
              <div className="flex gap-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCatColor(c)}
                    className={`w-6 h-6 rounded-full transition-all ${
                      newCatColor === c ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <input
              type="text"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Short description (optional)"
              className="w-full bg-muted/30 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={!newCatLabel}
              className="w-full bg-accent text-accent-foreground py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
            >
              Create "{newCatLabel || "..."}"
            </button>
          </div>
        )}

        {/* Duration toggle */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Duration</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsPermanent(false)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                !isPermanent
                  ? "bg-primary/20 border border-primary/40 text-foreground"
                  : "bg-muted/30 border border-transparent text-muted-foreground hover:bg-muted/50"
              }`}
            >
              ⏳ Temporary
              <span className="block text-[10px] opacity-70 mt-0.5">Expires in 24h without upvotes</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPermanent(true)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isPermanent
                  ? "bg-primary/20 border border-primary/40 text-foreground"
                  : "bg-muted/30 border border-transparent text-muted-foreground hover:bg-muted/50"
              }`}
            >
              🛡️ Permanent
              <span className="block text-[10px] opacity-70 mt-0.5">Stays on the map forever</span>
            </button>
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
