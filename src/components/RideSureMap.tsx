/* react-leaflet v4.2.1 — compatible with React 18 */
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LAGOS_CENTER, DEFAULT_ZOOM, PIN_CATEGORIES, MapPin, CustomCategory } from "@/data/lagos";
import { useEffect } from "react";
import { RouteData } from "@/lib/routing";

interface RideSureMapProps {
  pins: MapPin[];
  onPinClick: (pin: MapPin) => void;
  onMapClick: (lat: number, lng: number) => void;
  selectedPin: MapPin | null;
  filterCategories: string[];
  centerOn?: [number, number];
  customCategories: CustomCategory[];
  isDark: boolean;
  route?: RouteData | null;
  destinationMarker?: [number, number] | null;
}

function createPinIcon(category: string, allCategories: (typeof PIN_CATEGORIES[0])[]) {
  const cat = allCategories.find((c) => c.id === category);
  if (!cat) return L.divIcon({ className: "custom-pin-icon", html: "📍", iconSize: [32, 32], iconAnchor: [16, 16] });

  return L.divIcon({
    className: "custom-pin-icon",
    html: `<div style="
      width:32px;height:32px;
      background:${cat.color};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:2px solid rgba(255,255,255,0.9);
      box-shadow:0 2px 12px rgba(0,0,0,0.4);
      font-size:16px;
      cursor:pointer;
    ">${cat.icon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function createDestinationIcon() {
  return L.divIcon({
    className: "custom-pin-icon",
    html: `<div style="
      width:36px;height:36px;
      background:hsl(210, 100%, 55%);
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:3px solid white;
      box-shadow:0 2px 16px rgba(59,130,246,0.6);
      font-size:18px;
      animation: pulse 2s infinite;
    ">📦</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function CenterHandler({ centerOn }: { centerOn?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (centerOn) {
      map.flyTo(centerOn, 16, { duration: 1 });
    }
  }, [centerOn, map]);
  return null;
}

function RouteFitHandler({ route }: { route?: RouteData | null }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.coordinates.length > 1) {
      const bounds = L.latLngBounds(route.coordinates.map(c => L.latLng(c[0], c[1])));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [route, map]);
  return null;
}

const RideSureMap = ({ pins, onPinClick, onMapClick, selectedPin, filterCategories, centerOn, customCategories, isDark, route, destinationMarker }: RideSureMapProps) => {
  const allCategories = [...PIN_CATEGORIES, ...customCategories];
  const filteredPins = pins.filter(
    (pin) => pin.active && (filterCategories.length === 0 || filterCategories.includes(pin.category))
  );

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer
      center={LAGOS_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url={tileUrl}
      />
      <MapClickHandler onMapClick={onMapClick} />
      <CenterHandler centerOn={centerOn} />
      <RouteFitHandler route={route} />

      {/* Route polyline */}
      {route && route.coordinates.length > 1 && (
        <Polyline
          positions={route.coordinates}
          pathOptions={{
            color: "hsl(210, 100%, 55%)",
            weight: 5,
            opacity: 0.85,
            dashArray: undefined,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      )}

      {/* Destination marker */}
      {destinationMarker && (
        <Marker
          position={destinationMarker}
          icon={createDestinationIcon()}
        >
          <Popup>
            <div className="text-sm font-semibold">📦 Delivery Destination</div>
          </Popup>
        </Marker>
      )}

      {filteredPins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={createPinIcon(pin.category, allCategories)}
          eventHandlers={{ click: () => onPinClick(pin) }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{pin.title}</strong>
              <p className="mt-1 opacity-80">{pin.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RideSureMap;
