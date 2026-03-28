"use client";

import { memo, useRef, useCallback, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Line, Marker, Sphere } from "react-simple-maps";
import { services, type ServiceId } from "@/lib/services";
import { SUBREGION_PINS, PIN_DIRS } from "@/lib/mapPins";
const GEO_URL = "/countries-50m.json";

const REGION_MAP: Record<string, ServiceId> = {
  "840": "market-entry",
  "276": "commercial-rep", "250": "commercial-rep", "380": "commercial-rep",
  "724": "commercial-rep", "056": "commercial-rep", "528": "commercial-rep",
  "620": "commercial-rep", "040": "commercial-rep", "756": "commercial-rep",
  "442": "commercial-rep", "208": "commercial-rep", "203": "commercial-rep",
  "703": "commercial-rep", "348": "commercial-rep", "616": "commercial-rep",
  "752": "commercial-rep", "246": "commercial-rep", "578": "commercial-rep",
  "372": "commercial-rep", "233": "commercial-rep", "428": "commercial-rep",
  "440": "commercial-rep",
  "826": "regulatory",
  "682": "operational-setup", "784": "operational-setup", "414": "operational-setup",
  "792": "operational-setup", "368": "operational-setup", "634": "operational-setup",
  "048": "operational-setup", "512": "operational-setup", "887": "operational-setup",
  "100": "local-ops", "688": "local-ops", "642": "local-ops", "008": "local-ops",
  "807": "local-ops", "191": "local-ops", "705": "local-ops", "070": "local-ops",
  "499": "local-ops",
  "376": "business-dev", "422": "business-dev", "275": "business-dev",
  "400": "business-dev", "760": "business-dev",
};

const GREECE_CODE = "300";
const GREECE_CENTER: [number, number] = [22.0, 39.0];

interface WorldMapProps {
  activeService:  ServiceId | null;
  hoveredService: ServiceId | null;
  hoveredBullet:  number | null;
  mapScale:       number;
  heroVisible:    boolean;
  onRegionHover:  (serviceId: ServiceId | null) => void;
  onRegionClick:  (serviceId: ServiceId) => void;
}

interface StaticGeosProps {
  onEnter: (id: ServiceId) => void;
  onLeave: () => void;
  onRegionClick: (id: ServiceId) => void;
}

const StaticGeographies = memo(({ onEnter, onLeave, onRegionClick }: StaticGeosProps) => (
  <Geographies geography={GEO_URL}>
    {({ geographies }: { geographies: any[] }) =>
      geographies.map((geo: any) => {
        const code      = String(geo.id).padStart(3, "0");
        const serviceId = REGION_MAP[code] as ServiceId | undefined;
        const isGreece  = code === GREECE_CODE;
        return (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            className={[
              "map-region",
              isGreece               ? "greece"   : "",
              serviceId && !isGreece ? "hoverable" : "",
              serviceId              ? serviceId  : "",
            ].filter(Boolean).join(" ")}
            onMouseEnter={() => { if (serviceId) onEnter(serviceId); }}
            onMouseLeave={onLeave}
            onClick={() => { if (serviceId) onRegionClick(serviceId); }}
            style={{
              default: { outline: "none" },
              hover:   { outline: "none" },
              pressed: { outline: "none" },
            }}
          />
        );
      })
    }
  </Geographies>
));
StaticGeographies.displayName = "StaticGeographies";

interface DynamicLayerProps {
  highlighted:    ServiceId | null;
  hoveredService: ServiceId | null;
  activeService:  ServiceId | null;
  hoveredBullet:  number | null;
  mapScale:       number;
}

const DynamicLayer = memo(({ highlighted, hoveredService, activeService, hoveredBullet, mapScale }: DynamicLayerProps) => (
  <g>
    {/* Connector lines + region endpoint dots */}
    {services.map((service) => {
      const isActive = service.id === highlighted;
      return (
        <g key={`connector-${service.id}`}>
          <Line
            from={GREECE_CENTER}
            to={service.coordinates}
            stroke={isActive ? "var(--pink)" : "rgba(255,31,142,0.18)"}
            strokeWidth={(isActive ? 1.5 : 0.7) / mapScale}
            strokeLinecap="round"
            strokeDasharray={isActive ? `${6 / mapScale} ${4 / mapScale}` : `${4 / mapScale} ${8 / mapScale}`}
            className={isActive ? "connector-animated" : ""}
          />
          <Marker coordinates={service.coordinates}>
            <circle
              r={(isActive ? 5 : 3) / mapScale}
              fill={isActive ? "var(--pink)" : "rgba(255,31,142,0.35)"}
              stroke={isActive ? "var(--pink-light)" : "transparent"}
              strokeWidth={(isActive ? 1.5 : 0) / mapScale}
              className={isActive ? "endpoint-dot" : ""}
            />
          </Marker>
        </g>
      );
    })}

    {/* Greece hub */}
    <Marker coordinates={GREECE_CENTER}>
      <circle r={16} fill="white" fillOpacity={0.03}
        stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} className="endpoint-dot"
      />
      <circle r={2.5} fill="rgba(255,255,255,0.6)" />
      <path d="M 0 0 L -12 38 L -50 58"
        stroke="rgba(255,255,255,0.2)" strokeWidth={0.75}
        fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx={-50} cy={58} r={1.2} fill="rgba(255,255,255,0.25)" />
      <g transform="translate(-136, 50)" pointerEvents="none">
        <rect x={0} y={0} width={86} height={16} rx={8}
          fill="rgba(17,17,19,0.92)" stroke="rgba(255,255,255,0.1)" strokeWidth={0.6}
        />
        <circle cx={12} cy={8} r={2.5} fill="var(--pink)" className="endpoint-dot" />
        <text x={21} y={9} dominantBaseline="middle"
          fill="rgba(255,255,255,0.65)" fontSize={6}
          fontFamily="Inter, Helvetica Neue, Arial, sans-serif"
          fontWeight={500} letterSpacing={0.9}
        >
          CENTRAL HUB
        </text>
      </g>
    </Marker>

    {/* Subregion anchor dots + connector paths — info boxes rendered as HTML overlay in ServicesScroll */}
    {activeService && (SUBREGION_PINS[activeService] ?? []).map((pin, i) => {
      const dir       = PIN_DIRS[i];
      const isHovered = hoveredBullet === i;
      return (
        <Marker key={`subpin-${activeService}-${i}`} coordinates={pin.coordinates}>
          <g pointerEvents="none">
            <path
              d={dir.path}
              stroke={isHovered ? "var(--pink)" : "rgba(255,31,142,0.3)"}
              strokeWidth={(isHovered ? 1.0 : 0.6) / mapScale}
              strokeDasharray={isHovered ? "none" : `${2.5 / mapScale} ${2.5 / mapScale}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "all 0.3s ease",
                filter: isHovered ? "drop-shadow(0 0 4px rgba(255,31,142,0.7))" : "none",
              }}
            />
            <circle 
              r={(isHovered ? 2.5 : 1.5) / mapScale} 
              fill={isHovered ? "var(--pink)" : "rgba(255,31,142,0.4)"} 
              stroke={isHovered ? "white" : "transparent"}
              strokeWidth={(isHovered ? 0.6 : 0) / mapScale}
              style={{
                transition: "all 0.3s ease",
                filter: isHovered ? "drop-shadow(0 0 4px var(--pink))" : "none",
              }}
            />
            <circle 
              cx={dir.cx} 
              cy={dir.cy} 
              r={(isHovered ? 1.5 : 1.0) / mapScale}
              fill={isHovered ? "white" : "rgba(255,31,142,0.3)"}
              style={{ transition: "all 0.3s ease" }}
            />
          </g>
        </Marker>
      );
    })}

    {/* Info pins — hero hover only */}
    {services.map((service) => {
      const isVisible = service.id === hoveredService;
      return (
        <Marker key={`pin-${service.id}`} coordinates={service.coordinates}>
          <g style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0px)" : "translateY(6px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
            pointerEvents: "none",
          }}>
            <foreignObject x={14} y={-40} width={240} height={110}>
              <div 
                className="flex flex-col justify-center h-full w-full px-4"
              >
                <div style={{
                  background: "linear-gradient(135deg, rgba(35,35,40,0.6) 0%, rgba(17,17,19,0.85) 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}>
                  <div className="flex items-start gap-2 mb-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--pink)] shadow-[0_0_8px_var(--pink)] shrink-0 mt-[4px]" />
                    <p style={{ color: "var(--pink)", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", margin: 0, lineHeight: 1.3 }}>
                      {service.title}
                    </p>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.7rem", fontWeight: 300, margin: 0, lineHeight: 1.45 }}>
                    {service.shortDescription}
                  </p>
                </div>
              </div>
            </foreignObject>
            <path 
              d="M 0 0 L 10 -15 L 14 -15" 
              stroke="rgba(255,255,255,0.2)" 
              strokeWidth={1} 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </g>
        </Marker>
      );
    })}
  </g>
));
DynamicLayer.displayName = "DynamicLayer";

const WorldMap = memo(({ activeService, hoveredService, hoveredBullet, mapScale, heroVisible, onRegionHover, onRegionClick }: WorldMapProps) => {
  const highlighted  = hoveredService ?? activeService;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    [...el.classList].filter((c) => c.startsWith("active-")).forEach((c) => el.classList.remove(c));
    if (highlighted) el.classList.add(`active-${highlighted}`);
  }, [highlighted]);

  const clearTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeHoverRef = useRef<ServiceId | null>(null);

  // Reset hover cache the moment hero becomes visible so the first mouseover
  // always fires — even if the cursor is still over the same region as before.
  useEffect(() => {
    if (!heroVisible) return;
    if (clearTimer.current) clearTimeout(clearTimer.current);
    activeHoverRef.current = null;
  }, [heroVisible]);

  const handleEnter = useCallback((serviceId: ServiceId) => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    if (activeHoverRef.current === serviceId) return;
    activeHoverRef.current = serviceId;
    onRegionHover(serviceId);
  }, [onRegionHover]);

  const handleLeave = useCallback(() => {
    clearTimer.current = setTimeout(() => {
      activeHoverRef.current = null;
      onRegionHover(null);
    }, 250);
  }, [onRegionHover]);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [22, 38], scale: 780 }}
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <filter id="greeceGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0.15  0 1 0 0 0.15  0 0 1 0 0.15  0 0 0 5 -3"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="regionGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Global ocean water hue differentiating the map canvas from the deep-dark DOM body */}
        <Sphere stroke="transparent" fill="#18181e" strokeWidth={0} />

        <StaticGeographies onEnter={handleEnter} onLeave={handleLeave} onRegionClick={onRegionClick} />

        <DynamicLayer
          highlighted={highlighted}
          hoveredService={hoveredService}
          activeService={activeService}
          hoveredBullet={hoveredBullet}
          mapScale={mapScale}
        />
      </ComposableMap>
    </div>
  );
});

WorldMap.displayName = "WorldMap";
export default WorldMap;
