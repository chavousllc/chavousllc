"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { DailyCount } from "@/lib/analytics";

function formatDate(value: string) {
  const d = new Date(value);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PageViewsChart({ data }: { data: DailyCount[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-400">
        No page view data yet — traffic will appear here once the site goes live.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="pv-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dc2626" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#eeeef0" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: "#82828f" }}
          axisLine={{ stroke: "#eeeef0" }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#82828f" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          labelFormatter={(value) => formatDate(String(value))}
          formatter={(value) => [String(value), "Page views"]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #eeeef0",
            boxShadow: "0 8px 24px rgba(16,16,20,0.08)",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#dc2626"
          strokeWidth={2}
          fill="url(#pv-fill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
