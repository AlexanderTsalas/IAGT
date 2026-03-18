import {
  BarChart2, Map, Crosshair, Handshake,
  UserCheck, TrendingUp, Search, FileText,
  Building2, MapPin, Package, Settings,
  Scale, FileCheck, Landmark, Shield,
  Network, Users, ClipboardList, BarChart,
  Lightbulb, Link2, UserPlus, Globe,
  type LucideIcon,
} from "lucide-react";
import type { ServiceId } from "./services";

export type { LucideIcon };

export interface SubregionPin {
  coordinates: [number, number];
  icon: LucideIcon;
  label: string;
  description: string;
}

// SVG connector direction per bullet index (SVG units from anchor dot)
export const PIN_DIRS = [
  { path: "M 0 0 L 4 -8 L 16 -13",   cx:  16, cy: -13 }, // 0 — up-right
  { path: "M 0 0 L 4 8 L 16 13",     cx:  16, cy:  13 }, // 1 — down-right
  { path: "M 0 0 L -4 -8 L -16 -13", cx: -16, cy: -13 }, // 2 — up-left
  { path: "M 0 0 L -4 8 L -16 13",   cx: -16, cy:  13 }, // 3 — down-left
] as const;

export const BULLET_ICONS: Record<string, LucideIcon[]> = {
  "market-entry":      [BarChart2, Map, Crosshair, Handshake],
  "commercial-rep":    [UserCheck, TrendingUp, Search, FileText],
  "operational-setup": [Building2, MapPin, Package, Settings],
  "regulatory":        [Scale, FileCheck, Landmark, Shield],
  "local-ops":         [Network, Users, ClipboardList, BarChart],
  "business-dev":      [Lightbulb, Link2, UserPlus, Globe],
};

export const SUBREGION_PINS: Record<ServiceId, SubregionPin[]> = {
  "market-entry": [
    { coordinates: [-120, 47], icon: BarChart2, label: "Market Assessment",  description: "Size the opportunity before committing capital" },
    { coordinates: [-75,  42], icon: Map,       label: "GTM Strategy",       description: "Route to market, partners and positioning"    },
    { coordinates: [-87,  32], icon: Crosshair, label: "Competitive Intel",  description: "Map the landscape and identify how to win"    },
    { coordinates: [-105, 35], icon: Handshake, label: "Partner ID",         description: "Qualify and engage the right local partners"  },
  ],
  "commercial-rep": [
    { coordinates: [10,  51], icon: UserCheck,  label: "Commercial Rep",     description: "Your credible face in the local market"       },
    { coordinates: [2,   46], icon: TrendingUp, label: "Sales Pipeline",     description: "Build and advance qualified opportunities"    },
    { coordinates: [12,  42], icon: Search,     label: "Lead Qualification", description: "Screen prospects and prioritize pipeline"     },
    { coordinates: [-4,  40], icon: FileText,   label: "Deal Facilitation",  description: "Support negotiations all the way to close"    },
  ],
  "operational-setup": [
    { coordinates: [44, 22], icon: Building2, label: "Entity Setup",    description: "Local company formation, end to end"        },
    { coordinates: [55, 25], icon: MapPin,    label: "Office & Infra",  description: "Physical presence and infra from day one"   },
    { coordinates: [35, 39], icon: Package,   label: "Vendor Sourcing", description: "Vet, contract and manage local suppliers"   },
    { coordinates: [44, 33], icon: Settings,  label: "Process Design",  description: "Operational workflows built to scale"       },
  ],
  "regulatory": [
    { coordinates: [-1,   51.5], icon: Scale,    label: "Legal Advisory",    description: "Coordinate legal, tax and compliance counsel" },
    { coordinates: [-4.5, 57],   icon: FileCheck, label: "Licensing Support", description: "Navigate permits and authority approvals"    },
    { coordinates: [-0.5, 54],   icon: Landmark,  label: "Gov't Liaison",     description: "Direct access to relevant institutions"     },
    { coordinates: [-3.5, 51.5], icon: Shield,    label: "Risk Assessment",   description: "Identify and mitigate regulatory exposure"  },
  ],
  "local-ops": [
    { coordinates: [18, 44],   icon: Network,       label: "Ops Partnership",   description: "Day-to-day execution as your local team"    },
    { coordinates: [23, 44],   icon: Users,         label: "Vendor Mgmt",       description: "Manage and oversee local vendor relations"  },
    { coordinates: [26, 46],   icon: ClipboardList, label: "Project Execution", description: "Coordinate delivery and track milestones"   },
    { coordinates: [16, 45.5], icon: BarChart,      label: "HQ Reporting",      description: "Structured visibility for the parent entity" },
  ],
  "business-dev": [
    { coordinates: [35,   31.5], icon: Lightbulb, label: "Opportunity ID",      description: "Surface new in-market revenue opportunities" },
    { coordinates: [36.5, 30.5], icon: Link2,     label: "Strategic Alliances", description: "Build partnerships that accelerate growth"   },
    { coordinates: [35.5, 33.8], icon: UserPlus,  label: "Client Acquisition",  description: "Convert qualified prospects into clients"    },
    { coordinates: [38,   36],   icon: Globe,     label: "Regional Expansion",  description: "Grow reach into Balkans, SEE and ME"        },
  ],
};
