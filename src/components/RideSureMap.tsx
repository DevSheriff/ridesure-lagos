import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LAGOS_CENTER, DEFAULT_ZOOM, PIN_CATEGORIES, MapPin } from "@/data/lagos";
import { useEffect } from "react";

interface RideSureMapProps {
  pins: MapPin[];
  onPinClick: (pin: MapPin) => void;
  onMapClick: (lat: number, lng: number) => void;
  selectedPin: MapPin | null;
  filterCategories: string[];
  centerOn?: [number, number];
}

function createPinIcon(category: string) {
  const cat = PIN_CATEGORIES.find((c) => c.id === category);
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

const RideSureMap = ({ pins, onPinClick, onMapClick, selectedPin, filterCategories, centerOn }: RideSureMapProps) => {
  const filteredPins = pins.filter(
    (pin) => pin.active && (filterCategories.length === 0 || filterCategories.includes(pin.category))
  );

  return (
    <MapContainer
      center={LAGOS_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />
      <CenterHandler centerOn={centerOn} />
      {filteredPins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={createPinIcon(pin.category)}
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
