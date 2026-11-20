import { useState } from 'react';
import { ArrowUpRight, HeartPulse } from 'lucide-react';
import { ShelterFacility } from '../../types/flood';

interface ShelterCapacityChartProps {
  shelters: ShelterFacility[];
  selectedShelterId: string | null;
  onSelectShelter: (id: string) => void;
  onViewAllShelters: () => void;
}

export function ShelterCapacityChart({
  shelters,
  selectedShelterId,
  onSelectShelter,
  onViewAllShelters,
}: ShelterCapacityChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);
  const totalOccupied = shelters.reduce((sum, s) => sum + s.occupied, 0);
  const totalAvailable = totalCapacity - totalOccupied;

  return (
    <section
      aria-label="Shelter Capacity Chart"
      className="command-card rounded-xl p-5 flex flex-col justify-between gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-white">
            Shelter Capacity Overview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {totalAvailable.toLocaleString()} beds open across {shelters.length} facilities · Demo
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAllShelters}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <span>Manage</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Horizontal Occupancy Bars */}
      <div className="space-y-3.5">
        {shelters.map((shelter) => {
          const pct = Math.round((shelter.occupied / shelter.capacity) * 100);
          const available = shelter.capacity - shelter.occupied;
          const isSelected = selectedShelterId === shelter.id;
          const isHovered = hoveredId === shelter.id;

          const barColor =
            pct >= 85
              ? 'bg-gradient-to-r from-orange-500 to-red-500'
              : pct >= 65
              ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
              : 'bg-gradient-to-r from-emerald-500 to-cyan-400';

          const statusTextColor =
            shelter.status === 'Near Full'
              ? 'text-orange-400'
              : shelter.status === 'Full'
              ? 'text-red-400'
              : 'text-emerald-400';

          return (
            <button
              key={shelter.id}
              type="button"
              onClick={() => onSelectShelter(shelter.id)}
              onMouseEnter={() => setHoveredId(shelter.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`w-full text-left p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isSelected
                  ? 'bg-blue-500/15'
                  : isHovered
                  ? 'bg-white/[0.04]'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-slate-100 truncate inline-flex items-center gap-1.5">
                  <span className="truncate">{shelter.name}</span>
                  {shelter.medicalUnit && (
                    <HeartPulse
                      className="w-3.5 h-3.5 text-cyan-400 shrink-0"
                      aria-label="Medical unit on site"
                    />
                  )}
                </span>

                <span className="font-mono tabular-nums text-slate-300 whitespace-nowrap shrink-0">
                  <span className={statusTextColor}>{pct}%</span>
                  <span className="text-slate-500 mx-1.5">/</span>
                  <span>
                    {shelter.occupied}/{shelter.capacity}
                  </span>
                </span>
              </div>

              <div className="mt-2 h-2.5 w-full rounded-full bg-[#07111F] border border-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>{shelter.district}</span>
                <span className="font-mono tabular-nums text-emerald-400">
                  {available} beds available
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Total Utilization Summary */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
        <span>Regional Occupancy Rate</span>
        <span className="font-mono tabular-nums font-semibold text-white">
          {Math.round((totalOccupied / totalCapacity) * 100)}% ({totalOccupied.toLocaleString()} /{' '}
          {totalCapacity.toLocaleString()})
        </span>
      </div>
    </section>
  );
}
