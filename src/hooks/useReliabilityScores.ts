import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ReliabilityScore {
  lat: number;
  lng: number;
  score: number; // 0-100
  totalRatings: number;
}

const RADIUS = 0.002; // ~200m grouping radius

export function useReliabilityScores() {
  const [scores, setScores] = useState<ReliabilityScore[]>([]);

  const fetchScores = useCallback(async () => {
    const { data, error } = await supabase
      .from("delivery_ratings")
      .select("destination_lat, destination_lng, address_accuracy, route_accuracy");

    if (error || !data) return;

    // Group ratings by approximate location
    const groups: Record<string, { lats: number[]; lngs: number[]; ratings: number[] }> = {};

    data.forEach((r: any) => {
      const key = `${Math.round(r.destination_lat / RADIUS) * RADIUS},${Math.round(r.destination_lng / RADIUS) * RADIUS}`;
      if (!groups[key]) groups[key] = { lats: [], lngs: [], ratings: [] };
      groups[key].lats.push(r.destination_lat);
      groups[key].lngs.push(r.destination_lng);
      // Average of address + route accuracy, scaled to 0-100
      groups[key].ratings.push(((r.address_accuracy + r.route_accuracy) / 10) * 100);
    });

    const result: ReliabilityScore[] = Object.values(groups).map((g) => ({
      lat: g.lats.reduce((a, b) => a + b, 0) / g.lats.length,
      lng: g.lngs.reduce((a, b) => a + b, 0) / g.lngs.length,
      score: Math.round(g.ratings.reduce((a, b) => a + b, 0) / g.ratings.length),
      totalRatings: g.ratings.length,
    }));

    setScores(result);
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const saveRating = useCallback(async (destLat: number, destLng: number, addressAccuracy: number, routeAccuracy: number, comment: string) => {
    await supabase.from("delivery_ratings").insert({
      destination_lat: destLat,
      destination_lng: destLng,
      address_accuracy: addressAccuracy,
      route_accuracy: routeAccuracy,
      comment,
    });
    await fetchScores();
  }, [fetchScores]);

  return { scores, saveRating };
}
