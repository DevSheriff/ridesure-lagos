export interface RouteStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  maneuver: {
    type: string;
    modifier?: string;
    location: [number, number]; // [lng, lat]
  };
}

export interface RouteData {
  coordinates: [number, number][]; // [lat, lng] pairs
  distance: number; // total meters
  duration: number; // total seconds
  steps: RouteStep[];
}

export async function fetchRoute(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<RouteData | null> {
  try {
    // OSRM free routing API — bike profile
    const url = `https://router.project-osrm.org/route/v1/bike/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.code !== "Ok" || !json.routes?.length) return null;

    const route = json.routes[0];
    const coords: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] // GeoJSON is [lng, lat], Leaflet needs [lat, lng]
    );

    const steps: RouteStep[] = route.legs[0].steps.map((s: any) => ({
      instruction: s.maneuver.type + (s.maneuver.modifier ? ` ${s.maneuver.modifier}` : ""),
      distance: s.distance,
      duration: s.duration,
      maneuver: {
        type: s.maneuver.type,
        modifier: s.maneuver.modifier,
        location: s.maneuver.location,
      },
    }));

    return {
      coordinates: coords,
      distance: route.distance,
      duration: route.duration,
      steps,
    };
  } catch (e) {
    console.error("Route fetch failed:", e);
    return null;
  }
}
