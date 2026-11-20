import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, Navigation, Radio, Users } from 'lucide-react';
import { RescueStatus, RescueTeam } from '../../types/flood';

interface RescueTeamPanelProps {
  teams: RescueTeam[];
  selectedTeamId: string | null;
  onSelectTeam: (id: string) => void;
  onManageTeams: () => void;
}

type StatusFilter = 'All' | RescueStatus;

export function RescueTeamPanel({
  teams,
  selectedTeamId,
  onSelectTeam,
  onManageTeams,
}: RescueTeamPanelProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const filtered =
    statusFilter === 'All' ? teams : teams.filter((t) => t.status === statusFilter);

  const statusMeta: Record<RescueStatus, { color: string; Icon: typeof Radio }> = {
    Deployed: { color: 'text-emerald-400', Icon: Radio },
    'En Route': { color: 'text-orange-400', Icon: Navigation },
    Standby: { color: 'text-cyan-400', Icon: CheckCircle2 },
    Returning: { color: 'text-slate-300', Icon: Clock },
  };

  return (
    <section
      aria-label="Rescue Team Status"
      className="command-card rounded-xl flex flex-col justify-between"
    >
      <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-white">
            Rescue Team Status
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Field task forces · Demo readiness
          </p>
        </div>

        <button
          type="button"
          onClick={onManageTeams}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <span>Dispatch</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-2.5 border-b border-white/[0.05] flex items-center gap-1.5 overflow-x-auto">
        {(['All', 'Deployed', 'En Route', 'Standby'] as StatusFilter[]).map((tab) => {
          const active = statusFilter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
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

      {/* Team Rows */}
      <div className="divide-y divide-white/[0.06] flex-1">
        {filtered.map((team) => {
          const meta = statusMeta[team.status];
          const Icon = meta.Icon;
          const isSelected = selectedTeamId === team.id;

          return (
            <button
              key={team.id}
              type="button"
              onClick={() => onSelectTeam(team.id)}
              className={`w-full px-5 py-3 text-left flex items-center justify-between gap-3 transition-colors hover:bg-blue-500/[0.07] ${
                isSelected ? 'bg-blue-500/[0.12]' : ''
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">
                    {team.callSign}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    · {team.specialty}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {team.sector} · {team.vehicles}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${meta.color}`}>
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{team.status}</span>
                  {team.etaMinutes ? (
                    <span className="font-mono tabular-nums">({team.etaMinutes}m)</span>
                  ) : null}
                </span>
                <p className="text-[11px] font-mono tabular-nums text-slate-400 mt-0.5 inline-flex items-center justify-end gap-1 w-full">
                  <Users className="w-3 h-3" aria-hidden="true" />
                  <span>{team.personnel}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
