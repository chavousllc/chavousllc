"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import statesGeo from "us-atlas/states-10m.json";
import { FIPS_TO_STATE } from "@/lib/us-states";

export function CoverageMap({ coverageStates }: { coverageStates: string[] }) {
  const [hovered, setHovered] = useState<{ name: string; covered: boolean } | null>(null);
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
                  onMouseEnter={() => state && setHovered({ name: state.name, covered: isCovered })}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer transition-[fill] duration-150 ease-out outline-none"
                  style={{
                    default: {
                      fill: isCovered ? "#dc2626" : "#e4e4e7",
                      stroke: "#ffffff",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: isCovered ? "#991b1b" : "#a1a1aa",
                      stroke: "#ffffff",
                      strokeWidth: 1,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#7f1d1d",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div
        className={clsx(
          "pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold shadow-md transition-all duration-150",
          hovered ? "translate-y-0 opacity-100" : "translate-y-0.5 opacity-90"
        )}
      >
        {hovered && (
          <span
            className={clsx(
              "h-2 w-2 flex-shrink-0 rounded-full",
              hovered.covered ? "bg-brand-600" : "bg-ink-300"
            )}
          />
        )}
        <span className="text-ink-800">{hovered?.name ?? "Hover a state"}</span>
        {hovered && (
          <span className="text-xs font-medium text-ink-400">
            {hovered.covered ? "Served" : "Not currently served"}
          </span>
        )}
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
