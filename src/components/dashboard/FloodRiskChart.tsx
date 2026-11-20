import { useState } from 'react';
import { RiskDistributionItem, SeverityLevel } from '../../types/flood';

interface FloodRiskChartProps {
  data: RiskDistributionItem[];
}

export function FloodRiskChart({ data }: FloodRiskChartProps) {
  const [hoveredLevel, setHoveredLevel] = useState<SeverityLevel | null>(null);

  const totalSectors = data.reduce((sum, item) => sum + item.sectors, 0);
  const totalPopulation = data.reduce((sum, item) => sum + item.populationAtRisk, 0);

  const activeItem = hoveredLevel ? data.find((d) => d.level === hoveredLevel) : null;

  // SVG Donut geometry
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <section
      aria-label="Flood Risk Distribution"
      className="command-card rounded-xl p-5 flex flex-col justify-between gap-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-base font-semibold text-white">
            Flood Risk Distribution
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            12 hydrological sectors · Demo risk index
          </p>
        </div>
        <span className="font-mono tabular-nums text-xs text-cyan-300">
          {(totalPopulation / 1000).toFixed(1)}k at risk
        </span>
      </div>

      {/* Ring Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 150 150"
            className="w-full h-full -rotate-90"
            role="img"
            aria-label="Flood risk distribution donut chart"
          >
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="16"
            />
            {data.map((segment) => {
              const strokeLength = (segment.percentage / 100) * circumference;
              const gapLength = circumference - strokeLength;
              const offset = -(cumulativePercent / 100) * circumference;
              cumulativePercent += segment.percentage;

              const isDimmed = hoveredLevel !== null && hoveredLevel !== segment.level;

              return (
                <circle
                  key={segment.level}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke={segment.colorHex}
                  strokeWidth={hoveredLevel === segment.level ? 19 : 16}
                  strokeDasharray={`${Math.max(0, strokeLength - 3)} ${gapLength + 3}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                  onMouseEnter={() => setHoveredLevel(segment.level)}
                  onMouseLeave={() => setHoveredLevel(null)}
                  className="cursor-pointer transition-all duration-150"
                  style={{ opacity: isDimmed ? 0.35 : 1 }}
                />
              );
            })}
          </svg>

          {/* Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3">
            <span className="font-display text-2xl font-bold text-white tabular-nums">
              {activeItem ? activeItem.sectors : totalSectors}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {activeItem ? `${activeItem.level} Sectors` : 'Total Sectors'}
            </span>
          </div>
        </div>

        {/* Breakdown Rows */}
        <div className="flex-1 w-full space-y-3">
          {data.map((item) => {
            const isHovered = hoveredLevel === item.level;
            return (
              <div
                key={item.level}
                onMouseEnter={() => setHoveredLevel(item.level)}
                onMouseLeave={() => setHoveredLevel(null)}
                className={`p-2 rounded-lg transition-colors cursor-default ${
                  isHovered ? 'bg-white/[0.05]' : ''
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-200">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: item.colorHex }}
                      aria-hidden="true"
                    />
                    <span>{item.level}</span>
                  </span>
                  <span className="font-mono tabular-nums text-slate-300">
                    {item.sectors} sectors · {item.percentage}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800/90 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.colorHex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contextual Summary Footer */}
      <div className="pt-3 border-t border-white/[0.06] text-xs text-slate-400 flex items-center justify-between gap-2">
        <span className="truncate">
          {activeItem
            ? activeItem.description
            : 'Hover a risk tier to inspect affected sectors and population.'}
        </span>
        {activeItem && (
          <span className="font-mono tabular-nums text-white shrink-0">
            {activeItem.populationAtRisk.toLocaleString()} residents
          </span>
        )}
      </div>
    </section>
  );
}
