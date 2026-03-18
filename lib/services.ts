import {
  Target,
  Users,
  Building2,
  ShieldCheck,
  Settings,
  TrendingUp,
} from "lucide-react";

export type ServiceId =
  | "market-entry"
  | "commercial-rep"
  | "operational-setup"
  | "regulatory"
  | "local-ops"
  | "business-dev";

export interface Service {
  id: ServiceId;
  region: string;
  regionKey: string; // ISO country code or custom key
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: React.ElementType;
  // Approximate lat/lng center of the region for connector endpoints
  coordinates: [number, number]; // [lng, lat]
  // GSAP map transform when this service is active
  mapTransform: {
    x: number; // translate X (% of map width)
    y: number; // translate Y (% of map height)
    scale: number;
  };
}

export const services: Service[] = [
  {
    id: "market-entry",
    region: "United States",
    regionKey: "USA",
    title: "Market Entry & Strategy",
    shortDescription: "Map the opportunity before you commit",
    fullDescription:
      "Market assessment, go-to-market strategy, competitive landscape analysis, and partner identification for international companies entering Greece and Southeast Europe.",
    icon: Target,
    coordinates: [-95, 37],
    mapTransform: { x: 28, y: 5, scale: 1.0 },
  },
  {
    id: "commercial-rep",
    region: "European Union",
    regionKey: "EU",
    title: "Commercial Representation",
    shortDescription: "Your local face, from day one",
    fullDescription:
      "Acting as your local commercial representative — business development, customer identification, engagement, negotiation support and contract facilitation.",
    icon: Users,
    coordinates: [5, 46],
    mapTransform: { x: 18, y: 8, scale: 1.3 },
  },
  {
    id: "operational-setup",
    region: "Middle East",
    regionKey: "ME",
    title: "Operational Setup Support",
    shortDescription: "Office, vendors, infrastructure — handled",
    fullDescription:
      "Local entity setup, office and infrastructure coordination, vendor and supplier identification, and operational process design and implementation.",
    icon: Building2,
    coordinates: [44, 29],
    mapTransform: { x: 8, y: 2, scale: 1.4 },
  },
  {
    id: "regulatory",
    region: "United Kingdom",
    regionKey: "GBR",
    title: "Regulatory & Administrative Coordination",
    shortDescription: "Navigate compliance without the friction",
    fullDescription:
      "Coordination with legal, tax, and regulatory advisors. Licensing and compliance support, and direct liaison with government authorities and institutions.",
    icon: ShieldCheck,
    coordinates: [-2, 54],
    mapTransform: { x: 20, y: 10, scale: 1.3 },
  },
  {
    id: "local-ops",
    region: "Balkans / SEE",
    regionKey: "BALKANS",
    title: "Local Operations Management",
    shortDescription: "We run it, you scale it",
    fullDescription:
      "Acting as your local operational partner — managing local vendors and partners, project coordination, execution support, and direct reporting to the parent company.",
    icon: Settings,
    coordinates: [22, 44],
    mapTransform: { x: 14, y: 6, scale: 1.6 },
  },
  {
    id: "business-dev",
    region: "Israel & Middle East",
    regionKey: "ISR",
    title: "Business Development & Expansion",
    shortDescription: "Greece first. Balkans next.",
    fullDescription:
      "Identification of new business opportunities, strategic partnership development, customer acquisition support, and expansion into regional markets across Balkans, Southeast Europe, and the Middle East.",
    icon: TrendingUp,
    coordinates: [35, 31],
    mapTransform: { x: 10, y: 4, scale: 1.5 },
  },
];
