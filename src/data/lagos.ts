import { PinCategory } from "./types";

// Lagos center coordinates
export const LAGOS_CENTER: [number, number] = [6.5244, 3.3792];
export const DEFAULT_ZOOM = 13;

export const PIN_CATEGORIES: PinCategory[] = [
  {
    id: "roadblock",
    label: "Road Block",
    icon: "🚧",
    color: "hsl(0, 72%, 55%)",
    description: "Police/military checkpoint or road closure",
  },
  {
    id: "gate",
    label: "Estate Gate",
    icon: "🚪",
    color: "hsl(45, 100%, 55%)",
    description: "Gated estate entrance - may require ID",
  },
  {
    id: "badroad",
    label: "Bad Road",
    icon: "⚠️",
    color: "hsl(25, 95%, 55%)",
    description: "Potholes, unpaved, or damaged road",
  },
  {
    id: "speedbump",
    label: "Speed Bump",
    icon: "🔶",
    color: "hsl(280, 60%, 55%)",
    description: "Speed bumps or road humps ahead",
  },
  {
    id: "flooding",
    label: "Flooding",
    icon: "🌊",
    color: "hsl(200, 80%, 50%)",
    description: "Flooded road or waterlogged area",
  },
  {
    id: "police",
    label: "Police/LASTMA",
    icon: "👮",
    color: "hsl(150, 60%, 45%)",
    description: "LASTMA, police, or VIO checkpoint",
  },
];

export interface LagosLocation {
  name: string;
  lat: number;
  lng: number;
  area: string;
}

export const LAGOS_LOCATIONS: LagosLocation[] = [
  { name: "Lekki Phase 1 Gate", lat: 6.4412, lng: 3.4745, area: "Lekki" },
  { name: "Admiralty Way, Lekki", lat: 6.4325, lng: 3.4523, area: "Lekki" },
  { name: "Chevron Roundabout", lat: 6.4310, lng: 3.5015, area: "Lekki" },
  { name: "Ajah Under Bridge", lat: 6.4685, lng: 3.5700, area: "Ajah" },
  { name: "Sangotedo Junction", lat: 6.4720, lng: 3.5950, area: "Ajah" },
  { name: "Victoria Island Roundabout", lat: 6.4281, lng: 3.4219, area: "Victoria Island" },
  { name: "Ozumba Mbadiwe Ave", lat: 6.4350, lng: 3.4300, area: "Victoria Island" },
  { name: "Adeola Odeku Street", lat: 6.4310, lng: 3.4180, area: "Victoria Island" },
  { name: "Allen Avenue, Ikeja", lat: 6.6018, lng: 3.3515, area: "Ikeja" },
  { name: "Opebi Link Bridge", lat: 6.5920, lng: 3.3600, area: "Ikeja" },
  { name: "Computer Village, Ikeja", lat: 6.5965, lng: 3.3485, area: "Ikeja" },
  { name: "Surulere Stadium", lat: 6.4990, lng: 3.3580, area: "Surulere" },
  { name: "Adeniran Ogunsanya, Surulere", lat: 6.4950, lng: 3.3530, area: "Surulere" },
  { name: "Yaba Tech Roundabout", lat: 6.5150, lng: 3.3750, area: "Yaba" },
  { name: "Herbert Macaulay Way, Yaba", lat: 6.5175, lng: 3.3815, area: "Yaba" },
  { name: "Ojuelegba Bridge", lat: 6.5080, lng: 3.3680, area: "Surulere" },
  { name: "Third Mainland Bridge (Herbert Macaulay)", lat: 6.4990, lng: 3.3880, area: "Lagos Island" },
  { name: "CMS Bus Stop", lat: 6.4530, lng: 3.4070, area: "Lagos Island" },
  { name: "Ikorodu Road, Maryland", lat: 6.5660, lng: 3.3680, area: "Maryland" },
  { name: "Gbagada Expressway", lat: 6.5530, lng: 3.3870, area: "Gbagada" },
  { name: "Magodo Estate Gate", lat: 6.6150, lng: 3.3910, area: "Magodo" },
  { name: "Berger Bus Stop", lat: 6.6170, lng: 3.3420, area: "Ojodu" },
  { name: "Iyana Ipaja Junction", lat: 6.6120, lng: 3.2630, area: "Iyana Ipaja" },
  { name: "Oshodi Under Bridge", lat: 6.5560, lng: 3.3410, area: "Oshodi" },
  { name: "Mile 2 Expressway", lat: 6.4620, lng: 3.3100, area: "Mile 2" },
  { name: "Festac Link Bridge", lat: 6.4660, lng: 3.2830, area: "Festac" },
  { name: "Banana Island Gate", lat: 6.4540, lng: 3.4280, area: "Ikoyi" },
  { name: "Falomo Bridge", lat: 6.4400, lng: 3.4200, area: "Ikoyi" },
  { name: "Apapa Wharf Road", lat: 6.4470, lng: 3.3650, area: "Apapa" },
  { name: "Iganmu Bridge", lat: 6.4700, lng: 3.3650, area: "Iganmu" },
];

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  category: string;
  title: string;
  description: string;
  reportedBy: string;
  reportedAt: Date;
  upvotes: number;
  downvotes: number;
  active: boolean;
}

// Sample pins across Lagos
export const INITIAL_PINS: MapPin[] = [
  {
    id: "1",
    lat: 6.4412,
    lng: 3.4745,
    category: "gate",
    title: "Lekki Phase 1 Main Gate",
    description: "Estate gate - riders must show delivery order to security before entry. Usually 2-5 min wait.",
    reportedBy: "Chidi_Rider",
    reportedAt: new Date("2026-02-15T08:00:00"),
    upvotes: 45,
    downvotes: 2,
    active: true,
  },
  {
    id: "2",
    lat: 6.4310,
    lng: 3.5015,
    category: "roadblock",
    title: "Chevron Roundabout Checkpoint",
    description: "LASTMA officers checking vehicle papers. Avoid if your bike papers aren't complete.",
    reportedBy: "Lagos_Express",
    reportedAt: new Date("2026-02-15T07:30:00"),
    upvotes: 32,
    downvotes: 5,
    active: true,
  },
  {
    id: "3",
    lat: 6.4685,
    lng: 3.5700,
    category: "badroad",
    title: "Ajah Under Bridge Potholes",
    description: "Massive potholes under the bridge. Ride slowly, especially during rain. Left lane is slightly better.",
    reportedBy: "Bolt_Rider_22",
    reportedAt: new Date("2026-02-14T16:00:00"),
    upvotes: 67,
    downvotes: 1,
    active: true,
  },
  {
    id: "4",
    lat: 6.6018,
    lng: 3.3515,
    category: "police",
    title: "Allen Avenue LASTMA Post",
    description: "Permanent LASTMA post. They stop bikes frequently. Keep all documents ready.",
    reportedBy: "IkejaRider",
    reportedAt: new Date("2026-02-15T06:00:00"),
    upvotes: 28,
    downvotes: 3,
    active: true,
  },
  {
    id: "5",
    lat: 6.5080,
    lng: 3.3680,
    category: "speedbump",
    title: "Ojuelegba Speed Bumps",
    description: "3 consecutive speed bumps. Go slow or you'll damage your delivery items.",
    reportedBy: "GidiRider",
    reportedAt: new Date("2026-02-14T14:00:00"),
    upvotes: 19,
    downvotes: 0,
    active: true,
  },
  {
    id: "6",
    lat: 6.5150,
    lng: 3.3750,
    category: "flooding",
    title: "Yaba Tech Area - Flooding",
    description: "Road floods heavily when it rains. Water can reach knee level. Find alternative route via Jibowu.",
    reportedBy: "YabaRider",
    reportedAt: new Date("2026-02-13T18:00:00"),
    upvotes: 54,
    downvotes: 8,
    active: true,
  },
  {
    id: "7",
    lat: 6.4540,
    lng: 3.4280,
    category: "gate",
    title: "Banana Island Security Gate",
    description: "Very strict security. You MUST have the recipient's name and flat number. They will call to confirm. 5-15 min wait.",
    reportedBy: "VIP_Dispatch",
    reportedAt: new Date("2026-02-15T09:30:00"),
    upvotes: 72,
    downvotes: 0,
    active: true,
  },
  {
    id: "8",
    lat: 6.6150,
    lng: 3.3910,
    category: "gate",
    title: "Magodo GRA Phase 2 Gate",
    description: "Gate closes by 10pm. After hours delivery nearly impossible. Plan accordingly.",
    reportedBy: "NightRider_LG",
    reportedAt: new Date("2026-02-14T22:00:00"),
    upvotes: 38,
    downvotes: 1,
    active: true,
  },
  {
    id: "9",
    lat: 6.5560,
    lng: 3.3410,
    category: "roadblock",
    title: "Oshodi Overhead Bridge Diversion",
    description: "Construction work causing traffic diversion. Use the service lane on the left.",
    reportedBy: "OshodiKing",
    reportedAt: new Date("2026-02-15T05:45:00"),
    upvotes: 41,
    downvotes: 6,
    active: true,
  },
  {
    id: "10",
    lat: 6.4470,
    lng: 3.3650,
    category: "badroad",
    title: "Apapa Wharf Road Craters",
    description: "Road is in terrible condition. Trucks have created deep craters. Only navigate during daytime.",
    reportedBy: "ApapaDispatch",
    reportedAt: new Date("2026-02-12T11:00:00"),
    upvotes: 89,
    downvotes: 2,
    active: true,
  },
  {
    id: "11",
    lat: 6.4350,
    lng: 3.4300,
    category: "police",
    title: "Ozumba Mbadiwe - Task Force",
    description: "Mobile police task force stopping commercial bikes. Have your delivery app open as proof.",
    reportedBy: "VI_Rider",
    reportedAt: new Date("2026-02-15T10:15:00"),
    upvotes: 55,
    downvotes: 4,
    active: true,
  },
  {
    id: "12",
    lat: 6.4620,
    lng: 3.3100,
    category: "flooding",
    title: "Mile 2 Underpass Flooding",
    description: "Perennial flooding spot. Even light rain causes water accumulation. Use the overhead bridge alternative.",
    reportedBy: "Mile2_Rider",
    reportedAt: new Date("2026-02-13T15:30:00"),
    upvotes: 63,
    downvotes: 3,
    active: true,
  },
];
