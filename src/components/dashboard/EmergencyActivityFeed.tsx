import { useState } from 'react';
import { ArrowUpRight, Clock, Droplets } from 'lucide-react';
import { FloodIncident, SeverityLevel } from '../../types/flood';
import { SeverityIndicator } from '../shared/SeverityIndicator';

interface EmergencyActivityFeedProps {
  incidents: FloodIncident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  onViewAllReports: () => void;
}

type FilterOption = 'All' | SeverityLevel;

export function EmergencyActivityFeed({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onViewAllReports,
}: EmergencyActivityFeedProps) {
  const [filter, setFilter] = useState<FilterOption>('All');

  const filtered =
    filter === 'All' ? incidents : incidents.filter((inc) => inc.severity === filter);

  const filterTabs: FilterOption[] = ['All', 'Critical', 'High', 'Moderate'];

  return (
    <section
      aria-label="Emergency Activity Feed"
      className="command-card rounded-xl flex flex-col h-full"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-white">
            Emergency Activity Feed
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Recent incident dispatches · Demo stream
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAllReports}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Interactive Filter Tabs */}
      <div className="px-5 py-2.5 border-b border-white/[0.05] flex items-center gap-1.5 overflow-x-auto">
        {filterTabs.map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-blue-500/20 text-white border border-cyan-400/35'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.06] max-h-[430px]">
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">
            No {filter.toLowerCase()} incidents in the current feed.
          </div>
        ) : (
          filtered.map((item) => {
            const isSelected = selectedIncidentId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectIncident(item.id)}
                className={`w-full px-5 py-3.5 text-left transition-colors hover:bg-blue-500/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400 ${
                  isSelected ? 'bg-blue-500/[0.12]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SeverityIndicator severity={item.severity} compact />
                    <span className="font-mono text-xs text-slate-400">{item.id}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[11px] text-slate-400 inline-flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {item.reportedAt}
                  </span>
                </div>

                <p className="mt-1.5 text-sm font-medium text-slate-100 leading-snug">
                  {item.title}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span>{item.sector}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-cyan-300 inline-flex items-center gap-1">
                    <Droplets className="w-3 h-3" aria-hidden="true" />
                    {item.waterDepthMeters.toFixed(1)}m depth
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.status}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
