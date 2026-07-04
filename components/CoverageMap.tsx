"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import statesGeo from "us-atlas/states-10m.json";
import { FIPS_TO_STATE } from "@/lib/us-states";

export function CoverageMap({ coverageStates }: { coverageStates: string[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const covered = new Set(coverageStates);

  return (
    <div className="relative">
      <ComposableMap projection="geoAlbersUsa" className="w-full">
        <Geographies geography={statesGeo}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const fips = String(geo.id).padStart(2, "0");
              const state = FIPS_TO_STATE[fips];
              const isCovered = state ? covered.has(state.abbr) : false;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHovered(state?.name ?? null)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    default: {
                      fill: isCovered ? "#dc2626" : "#e4e4e7",
                      stroke: "#ffffff",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: isCovered ? "#b91c1c" : "#d4d4d8",
                      stroke: "#ffffff",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#991b1b",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-ink-800 shadow-md">
        {hovered ?? "Hover a state"}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-brand-600" /> Served
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-ink-200" /> Not currently served
        </span>
      </div>
    </div>
  );
}
