import {
  Truck,
  Boxes,
  Layers,
  Zap,
  Route,
  Package,
  Radar,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  truck: Truck,
  boxes: Boxes,
  layers: Layers,
  zap: Zap,
  route: Route,
  package: Package,
  radar: Radar,
};

export function getIcon(key: string): LucideIcon {
  return ICONS[key] ?? Package;
}
