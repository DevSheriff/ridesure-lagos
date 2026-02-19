import { useState, useMemo } from "react";
import { Navigation, MapPin, ThumbsUp, ThumbsDown, Clock, Shield, TrendingUp, Award, ChevronRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePins } from "@/hooks/usePins";
import { PIN_CATEGORIES } from "@/data/lagos";
import { useCustomCategories } from "@/hooks/useCustomCategories";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const { pins, loading } = usePins();
  const { customCategories } = useCustomCategories();
  const [filter, setFilter] = useState<"all" | "active" | "permanent">("all");

  const allCategories = useMemo(() => {
    const map: Record<string, { label: string; icon: string; color: string }> = {};
    PIN_CATEGORIES.forEach((c) => (map[c.id] = c));
    customCategories.forEach((c) => (map[c.id] = c));
    return map;
  }, [customCategories]);

  const stats = useMemo(() => {
    const totalUpvotes = pins.reduce((s, p) => s + p.upvotes, 0);
    const totalDownvotes = pins.reduce((s, p) => s + p.downvotes, 0);
    const activePins = pins.filter((p) => p.active).length;
    const permanentPins = pins.filter((p) => p.permanent).length;

    const categoryCounts: Record<string, number> = {};
    pins.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

    return { totalUpvotes, totalDownvotes, activePins, permanentPins, topCategory, total: pins.length };
  }, [pins]);

  const filteredPins = useMemo(() => {
    if (filter === "active") return pins.filter((p) => p.active && !p.permanent);
    if (filter === "permanent") return pins.filter((p) => p.permanent);
    return pins;
  }, [pins, filter]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("pins").delete().eq("id", id);
    if (!error) {
      toast.success("Pin deleted");
    } else {
      toast.error("Failed to delete pin");
    }
  };

  const getCategoryInfo = (catId: string) => allCategories[catId] || { label: catId, icon: "📍", color: "hsl(var(--muted-foreground))" };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex items-center gap-3 animate-pulse">
          <Navigation className="w-6 h-6 text-primary" />
          <span className="text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              Ride<span className="text-primary">Sure</span> Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">Your contribution overview</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Pins</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4 text-secondary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalUpvotes}</p>
              <p className="text-xs text-muted-foreground">Total Upvotes</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-accent" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.permanentPins}</p>
              <p className="text-xs text-muted-foreground">Permanent Pins</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-destructive/15 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-destructive" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.activePins}</p>
              <p className="text-xs text-muted-foreground">Active Pins</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Category Badge */}
        {stats.topCategory && (
          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Top Category</p>
                <p className="text-xs text-muted-foreground">
                  {getCategoryInfo(stats.topCategory[0]).icon} {getCategoryInfo(stats.topCategory[0]).label} — {stats.topCategory[1]} pins
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </CardContent>
          </Card>
        )}

        {/* Pins List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">All Pins</h2>
            <div className="flex gap-1">
              {(["all", "active", "permanent"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredPins.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">No pins found</p>
            )}
            {filteredPins.map((pin) => {
              const cat = getCategoryInfo(pin.category);
              return (
                <Card key={pin.id} className="bg-card/80 backdrop-blur border-border/50 overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${cat.color}22` }}
                      >
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground truncate">{pin.title}</h3>
                          {pin.permanent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary/20 text-secondary flex-shrink-0">
                              PERM
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{pin.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" /> {pin.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="w-3 h-3" /> {pin.downvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatTimeAgo(pin.reportedAt)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(pin.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
