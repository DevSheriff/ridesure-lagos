import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapPin } from "@/data/lagos";

interface HeatmapOverlayProps {
  pins: MapPin[];
  enabled: boolean;
}

const HAZARD_CATEGORIES = ["roadblock", "police", "extortion", "gate"];
const ONE_HOUR_MS = 60 * 60 * 1000;

function HeatmapOverlay({ pins, enabled }: HeatmapOverlayProps) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!enabled) return;

    const now = Date.now();
    const recentHazards = pins.filter(
      (p) =>
        p.active &&
        HAZARD_CATEGORIES.includes(p.category) &&
        now - new Date(p.reportedAt).getTime() < ONE_HOUR_MS
    );

    // Group by approximate grid cells (~500m)
    const CELL = 0.005;
    const cells: Record<string, { lat: number; lng: number; count: number }> = {};

    recentHazards.forEach((p) => {
      const key = `${Math.round(p.lat / CELL)},${Math.round(p.lng / CELL)}`;
      if (!cells[key]) {
        cells[key] = { lat: p.lat, lng: p.lng, count: 0 };
      }
      cells[key].count++;
    });

    const group = L.layerGroup();

    Object.values(cells).forEach((cell) => {
      if (cell.count < 2) return; // Only show zones with 2+ reports
      const intensity = Math.min(cell.count / 5, 1);
      const radius = 300 + cell.count * 100;

      L.circle([cell.lat, cell.lng], {
        radius,
        color: "transparent",
        fillColor: `hsl(0, 80%, ${55 - intensity * 15}%)`,
        fillOpacity: 0.2 + intensity * 0.25,
        interactive: false,
      }).addTo(group);
    });

    // If no zones, show a note
    if (Object.values(cells).filter((c) => c.count >= 2).length === 0) {
      // No seizure zones in the last hour — that's good
    }

    group.addTo(map);
    layerRef.current = group;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [pins, enabled, map]);

  return null;
}

export default HeatmapOverlay;
