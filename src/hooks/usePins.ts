import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "@/data/lagos";

const UPVOTE_THRESHOLD = 3;

export function usePins() {
  const [pins, setPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all pins on mount
  useEffect(() => {
    const fetchPins = async () => {
      const { data, error } = await supabase
        .from("pins")
        .select("*")
        .order("reported_at", { ascending: false });

      if (!error && data) {
        setPins(
          data.map((row: any) => ({
            id: row.id,
            lat: row.lat,
            lng: row.lng,
            category: row.category,
            title: row.title,
            description: row.description || "",
            reportedBy: row.reported_by || "Anonymous",
            reportedAt: new Date(row.reported_at),
            upvotes: row.upvotes,
            downvotes: row.downvotes,
            active: row.active,
            permanent: row.permanent,
          }))
        );
      }
      setLoading(false);
    };

    fetchPins();
  }, []);

  const addPin = useCallback(
    async (data: { category: string; title: string; description: string; reportedBy: string; lat: number; lng: number }) => {
      const { data: inserted, error } = await supabase
        .from("pins")
        .insert({
          lat: data.lat,
          lng: data.lng,
          category: data.category,
          title: data.title,
          description: data.description,
          reported_by: data.reportedBy,
        })
        .select()
        .single();

      if (!error && inserted) {
        const newPin: MapPin = {
          id: inserted.id,
          lat: inserted.lat,
          lng: inserted.lng,
          category: inserted.category,
          title: inserted.title,
          description: inserted.description || "",
          reportedBy: inserted.reported_by || "Anonymous",
          reportedAt: new Date(inserted.reported_at),
          upvotes: inserted.upvotes,
          downvotes: inserted.downvotes,
          active: inserted.active,
          permanent: inserted.permanent,
        };
        setPins((prev) => [newPin, ...prev]);
        return newPin;
      }
      return null;
    },
    []
  );

  const upvote = useCallback(async (id: string) => {
    const pin = pins.find((p) => p.id === id);
    if (!pin) return { becamePermanent: false, pin: null };

    const newUpvotes = pin.upvotes + 1;
    const becamePermanent = !pin.permanent && newUpvotes >= UPVOTE_THRESHOLD;
    const newPermanent = pin.permanent || newUpvotes >= UPVOTE_THRESHOLD;

    await supabase
      .from("pins")
      .update({ upvotes: newUpvotes, permanent: newPermanent })
      .eq("id", id);

    setPins((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, upvotes: newUpvotes, permanent: newPermanent } : p
      )
    );

    return { becamePermanent, pin };
  }, [pins]);

  const downvote = useCallback(async (id: string) => {
    const pin = pins.find((p) => p.id === id);
    if (!pin) return;

    const newDownvotes = pin.downvotes + 1;
    await supabase.from("pins").update({ downvotes: newDownvotes }).eq("id", id);

    setPins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, downvotes: newDownvotes } : p))
    );
  }, [pins]);

  return { pins, loading, addPin, upvote, downvote };
}
