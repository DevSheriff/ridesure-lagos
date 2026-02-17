import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "@/data/lagos";

const UPVOTE_THRESHOLD = 3;

function rowToPin(row: any): MapPin {
  return {
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
  };
}

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
        setPins(data.map(rowToPin));
      }
      setLoading(false);
    };

    fetchPins();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("pins-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pins" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newPin = rowToPin(payload.new);
            setPins((prev) => {
              if (prev.find((p) => p.id === newPin.id)) return prev;
              return [newPin, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = rowToPin(payload.new);
            setPins((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as any).id;
            setPins((prev) => prev.filter((p) => p.id !== oldId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addPin = useCallback(
    async (data: { category: string; title: string; description: string; reportedBy: string; lat: number; lng: number; permanent?: boolean }) => {
      const { data: inserted, error } = await supabase
        .from("pins")
        .insert({
          lat: data.lat,
          lng: data.lng,
          category: data.category,
          title: data.title,
          description: data.description,
          reported_by: data.reportedBy,
          permanent: data.permanent || false,
        })
        .select()
        .single();

      if (!error && inserted) {
        const newPin = rowToPin(inserted);
        // Realtime will handle adding it, but add optimistically too
        setPins((prev) => {
          if (prev.find((p) => p.id === newPin.id)) return prev;
          return [newPin, ...prev];
        });
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
