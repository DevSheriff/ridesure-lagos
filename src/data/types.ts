export interface PinCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export type PinCategoryId = "roadblock" | "gate" | "badroad" | "speedbump" | "flooding" | "police";
