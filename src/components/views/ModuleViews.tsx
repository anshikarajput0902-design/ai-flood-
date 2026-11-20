import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  Droplets,
  FlaskConical,
  LifeBuoy,
  Play,
  Plus,
  Settings as SettingsIcon,
  ShieldCheck,
  Sliders,
  Users,
} from 'lucide-react';
import {
  AlertItem,
  FloodIncident,
  FloodZonePolygon,
  HydroForecastPoint,
  QaTestCase,
  RescueStatus,
  RescueTeam,
  RiskDistributionItem,
  SeverityLevel,
  ShelterFacility,
} from '../../types/flood';
import { FloodMonitoringMap } from '../dashboard/FloodMonitoringMap';
import { FloodRiskChart } from '../dashboard/FloodRiskChart';
import { ShelterCapacityChart } from '../dashboard/ShelterCapacityChart';
import { SeverityIndicator } from '../shared/SeverityIndicator';

interface ReportsViewProps {
  incidents: FloodIncident[];
  onAddIncident: (incident: FloodIncident) => void;
  onFocusOnMap: (id: string) => void;
}

export function EmergencyReportsView({
  incidents,
  onAddIncident,
  onFocusOnMap,
}: ReportsViewProps) {
  const [severityFilter, setSeverityFilter] = useState<'All' | SeverityLevel>('All');
  const [showNewForm, setShowNewForm] = useState(false);
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('Sector 04 · Cedar Basin');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [depth, setDepth] = useState('1.4');

  const filtered =
    severityFilter === 'All'
      ? incidents
      : incidents.filter((i) => i.severity === severityFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newIncident: FloodIncident = {
      id: `INC-${4092 + incidents.length}`,
      title: title.trim(),
      sector,
      coordinates: '37.8012° N, 122.2650° W',
      mapX: 40 + (incidents.length * 7) % 40,
      mapY: 30 + (incidents.length * 9) % 45,
      severity,
      status: 'Active',
      waterDepthMeters: Number(depth) || 1.0,
      affectedPeople: 28,
      reportedAt: 'Just now',
      summary: 'Submitted via Command Center Demo Report intake.',
    };
    onAddIncident(newIncident);
    setTitle('');
    setShowNewForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Emergency Reports
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Active incident intake, severity triage, and dispatch verification · Demo Data
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewForm((v) => !v)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{showNewForm ? 'Close Form' : 'Log Demo Incident'}</span>
        </button>
      </div>

      {showNewForm && (
        <form
          onSubmit={handleSubmit}
          className="command-card rounded-xl p-5 grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Incident Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Elm Street Storm Drain Overflow"
              className="w-full h-10 px-3 rounded-lg bg-[#07111F] border border-blue-500/25 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#07111F] border border-blue-500/25 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Sector 04 · Cedar Basin">Cedar Basin</option>
              <option value="Sector 02 · Port District">Port District</option>
              <option value="Sector 07 · Central Arterial">Central Arterial</option>
              <option value="Sector 05 · East Meadow">East Meadow</option>
              <option value="Sector 09 · South Delta">South Delta</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
              className="w-full h-10 px-3 rounded-lg bg-[#07111F] border border-blue-500/25 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Depth (m)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#07111F] border border-blue-500/25 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors self-end whitespace-nowrap"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Critical', 'High', 'Moderate', 'Low'] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setSeverityFilter(level)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              severityFilter === level
                ? 'bg-blue-500/20 text-white border border-cyan-400/40'
                : 'bg-[#111F32] text-slate-400 border border-blue-500/15 hover:text-white'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Incident Table */}
      <div className="command-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-medium text-slate-400 bg-[#0B1728]/70">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Incident & Sector</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4 text-right">Water Depth</th>
                <th className="py-3 px-4 text-right">At Risk</th>
                <th className="py-3 px-4">Assigned Team</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              {filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-blue-500/[0.06] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-cyan-300 whitespace-nowrap">
                    {inc.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-white">{inc.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {inc.sector} · {inc.reportedAt}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <SeverityIndicator severity={inc.severity} compact />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-cyan-300">
                    {inc.waterDepthMeters.toFixed(1)}m
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200">
                    {inc.affectedPeople}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-300">
                    {inc.assignedTeam ?? 'Pending Assignment'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onFocusOnMap(inc.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0B1728] border border-blue-500/25 hover:border-cyan-400/50 text-xs font-medium text-cyan-300 transition-colors whitespace-nowrap"
                    >
                      Locate on Map
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface LiveMapViewProps {
  incidents: FloodIncident[];
  teams: RescueTeam[];
  shelters: ShelterFacility[];
  floodZones: FloodZonePolygon[];
  selectedEntityId: string | null;
  onSelectEntity: (id: string | null) => void;
}

export function LiveFloodMapView(props: LiveMapViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Live Flood Map
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Expanded geospatial basin telemetry, active inundation overlays, and unit tracking · Demo Data
        </p>
      </div>
      <FloodMonitoringMap {...props} expanded />
    </div>
  );
}

interface RiskAnalysisViewProps {
  riskData: RiskDistributionItem[];
  forecast: HydroForecastPoint[];
  zones: FloodZonePolygon[];
}

export function AiRiskAnalysisView({ riskData, forecast, zones }: RiskAnalysisViewProps) {
  const maxVal = 7.5;
  const chartHeight = 200;
  const chartWidth = 640;

  const pointsPredicted = forecast
    .map((pt, idx) => {
      const x = 40 + (idx / (forecast.length - 1)) * (chartWidth - 80);
      const y = chartHeight - (pt.predictedLevel / maxVal) * (chartHeight - 35);
      return `${x},${y}`;
    })
    .join(' ');

  const actualPoints = forecast
    .filter((pt) => pt.actualLevel !== null)
    .map((pt, idx) => {
      const x = 40 + (idx / (forecast.length - 1)) * (chartWidth - 80);
      const y = chartHeight - ((pt.actualLevel ?? 0) / maxVal) * (chartHeight - 35);
      return `${x},${y}`;
    })
    .join(' ');

  const thresholdY = chartHeight - (5.5 / maxVal) * (chartHeight - 35);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          AI Risk Analysis
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Predictive hydrograph modeling and watershed surge projections · Demo Model Output
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Hydrograph Forecast Curve */}
        <section className="xl:col-span-7 command-card rounded-xl p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold text-white">
                Cedar Basin Crest Projection (Next 4 Hours)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Observed gauge vs. AI surge model curve (meters above datum)
              </p>
            </div>
            <span className="font-mono text-xs text-red-400">Threshold: 5.5m</span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 25}`} className="w-full min-w-[460px] h-56">
              {/* Threshold Line */}
              <line
                x1="40"
                y1={thresholdY}
                x2={chartWidth - 40}
                y2={thresholdY}
                stroke="rgba(239, 68, 68, 0.55)"
                strokeDasharray="6 4"
                strokeWidth="1.5"
              />
              {/* Predicted Curve */}
              <polyline
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2.5"
                strokeDasharray="5 4"
                points={pointsPredicted}
              />
              {/* Actual Observed Curve */}
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                points={actualPoints}
              />
              {forecast.map((pt, idx) => {
                const x = 40 + (idx / (forecast.length - 1)) * (chartWidth - 80);
                const y = chartHeight - (pt.predictedLevel / maxVal) * (chartHeight - 35);
                return (
                  <g key={pt.hour}>
                    <circle cx={x} cy={y} r="3.5" fill="#22D3EE" />
                    <text
                      x={x}
                      y={chartHeight + 16}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {pt.hour}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-0.5 bg-blue-500 inline-block" /> Observed Sensor Level
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-0.5 bg-cyan-400 inline-block border-b border-dashed" /> Predicted Surge
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-0.5 bg-red-500 inline-block" /> Critical Levee Threshold
            </span>
          </div>
        </section>

        <div className="xl:col-span-5">
          <FloodRiskChart data={riskData} />
        </div>
      </div>

      {/* Zone Rate Table */}
      <section className="command-card rounded-xl p-5">
        <h2 className="font-display text-base font-semibold text-white mb-4">
          Active Watershed Rise Rates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {zones.map((z) => (
            <div
              key={z.id}
              className="p-4 rounded-lg bg-[#0B1728] border border-blue-500/15 flex flex-col justify-between gap-2"
            >
              <SeverityIndicator severity={z.severity} compact />
              <p className="text-sm font-semibold text-white">{z.name}</p>
              <p className="font-mono tabular-nums text-xs text-cyan-300 inline-flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" aria-hidden="true" />+{z.waterRiseRateCmHr} cm/hr
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

interface RescueCoordinationViewProps {
  teams: RescueTeam[];
  onCycleTeamStatus: (id: string) => void;
}

export function RescueCoordinationView({ teams, onCycleTeamStatus }: RescueCoordinationViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Rescue Coordination
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Task force deployment, aviation & swift-water readiness, and sector assignments · Demo Data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {teams.map((team) => {
          const nextLabel: Record<RescueStatus, string> = {
            Deployed: 'Mark Returning',
            'En Route': 'Mark Deployed',
            Standby: 'Deploy Unit',
            Returning: 'Set Standby',
          };
          return (
            <div key={team.id} className="command-card rounded-xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-cyan-300">{team.specialty}</span>
                  <span className="text-xs font-semibold text-emerald-400">{team.status}</span>
                </div>
                <h2 className="mt-1.5 font-display text-lg font-semibold text-white">
                  {team.callSign}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{team.sector}</p>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{team.missionNote}</p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <div className="text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums text-slate-200">
                    <Users className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                    {team.personnel} crew
                  </span>
                  <span className="mx-1.5">·</span>
                  <span>{team.vehicles}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onCycleTeamStatus(team.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/35 border border-cyan-400/30 text-xs font-medium text-cyan-200 transition-colors whitespace-nowrap shrink-0"
                >
                  {nextLabel[team.status]}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SheltersViewProps {
  shelters: ShelterFacility[];
}

export function SheltersResourcesView({ shelters }: SheltersViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Shelters & Resources
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Emergency shelter bed inventory, medical staffing, and relief supply reserves · Demo Data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ShelterCapacityChart
            shelters={shelters}
            selectedShelterId={null}
            onSelectShelter={() => {}}
            onViewAllShelters={() => {}}
          />
        </div>

        <section className="lg:col-span-6 command-card rounded-xl p-5 space-y-4">
          <h2 className="font-display text-base font-semibold text-white">
            Facility Resource Readiness
          </h2>
          <div className="divide-y divide-white/[0.06]">
            {shelters.map((s) => (
              <div key={s.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {s.district} · {s.medicalUnit ? 'Medical Triage Active' : 'General Shelter'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono tabular-nums text-xs text-cyan-300">
                    Supplies {s.suppliesPercent}%
                  </p>
                  <p className="font-mono tabular-nums text-xs text-emerald-400 mt-0.5">
                    {s.capacity - s.occupied} beds open
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

interface AlertsViewProps {
  alerts: AlertItem[];
  onMarkAlertRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function AlertsNotificationsView({
  alerts,
  onMarkAlertRead,
  onMarkAllRead,
}: AlertsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Alerts & Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Automated sensor threshold triggers and emergency broadcast log · Demo Data
          </p>
        </div>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="px-4 py-2 rounded-lg bg-[#111F32] border border-blue-500/25 hover:border-cyan-400/50 text-sm font-medium text-cyan-300 inline-flex items-center gap-2 transition-colors"
        >
          <Check className="w-4 h-4" aria-hidden="true" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="command-card rounded-xl divide-y divide-white/[0.06]">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              alert.read ? 'opacity-65' : ''
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <SeverityIndicator severity={alert.severity} compact />
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">{alert.channel}</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-slate-400">{alert.timestamp}</span>
              </div>
              <h2 className="text-base font-semibold text-white">{alert.title}</h2>
              <p className="text-sm text-slate-300">{alert.message}</p>
            </div>
            {!alert.read && (
              <button
                type="button"
                onClick={() => onMarkAlertRead(alert.id)}
                className="px-3.5 py-2 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-cyan-400/35 text-xs font-medium text-cyan-200 whitespace-nowrap shrink-0 self-start sm:self-center"
              >
                Acknowledge
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsView({
  riskData,
  shelters,
}: {
  riskData: RiskDistributionItem[];
  shelters: ShelterFacility[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Response latency benchmarks, evacuation throughput, and sector exposure · Demo Data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="command-card rounded-xl p-5">
          <p className="text-xs text-slate-400">Median Dispatch Time</p>
          <p className="mt-2 font-display text-3xl font-bold text-white tabular-nums">4.2 min</p>
          <p className="mt-2 text-xs text-emerald-400">18% faster than baseline drill</p>
        </div>
        <div className="command-card rounded-xl p-5">
          <p className="text-xs text-slate-400">Evacuees Assisted (24h)</p>
          <p className="mt-2 font-display text-3xl font-bold text-white tabular-nums">1,210</p>
          <p className="mt-2 text-xs text-cyan-300">Across 5 active relief corridors</p>
        </div>
        <div className="command-card rounded-xl p-5">
          <p className="text-xs text-slate-400">Active River Gauges</p>
          <p className="mt-2 font-display text-3xl font-bold text-white tabular-nums">48 / 50</p>
          <p className="mt-2 text-xs text-slate-300">96% telemetry array uptime</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FloodRiskChart data={riskData} />
        <ShelterCapacityChart
          shelters={shelters}
          selectedShelterId={null}
          onSelectShelter={() => {}}
          onViewAllShelters={() => {}}
        />
      </div>
    </div>
  );
}

export function SoftwareTestingView({ tests }: { tests: QaTestCase[] }) {
  const [results, setResults] = useState<QaTestCase[]>(tests);
  const [running, setRunning] = useState(false);

  const handleRunSuite = () => {
    setRunning(true);
    setTimeout(() => {
      setResults((prev) =>
        prev.map((t) => ({
          ...t,
          lastResult: 'Passed',
        }))
      );
      setRunning(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Software Testing
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Command system verification, failover simulation, and latency assertions · Demo QA Suite
          </p>
        </div>
        <button
          type="button"
          onClick={handleRunSuite}
          disabled={running}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4" aria-hidden="true" />
          <span>{running ? 'Running Verification...' : 'Run Demo Test Suite'}</span>
        </button>
      </div>

      <div className="command-card rounded-xl divide-y divide-white/[0.06]">
        {results.map((tc) => (
          <div key={tc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 text-xs">
                <span className="font-mono text-cyan-300">{tc.id}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300">{tc.suite}</span>
              </div>
              <p className="mt-1 text-base font-medium text-white">{tc.name}</p>
              <p className="mt-0.5 text-sm text-slate-400">{tc.description}</p>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Target Latency</span>
                <span className="font-mono tabular-nums text-sm text-slate-200">
                  {tc.expectedLatencyMs}ms
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Coverage</span>
                <span className="font-mono tabular-nums text-sm text-cyan-300">
                  {tc.coveragePercent}%
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  tc.lastResult === 'Passed' ? 'text-emerald-400' : 'text-orange-400'
                }`}
              >
                {tc.lastResult === 'Passed' ? (
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{tc.lastResult}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsView({
  highContrastNavy,
  onToggleThemeMode,
}: {
  highContrastNavy: boolean;
  onToggleThemeMode: () => void;
}) {
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [smsFailover, setSmsFailover] = useState(true);
  const [crestThreshold, setCrestThreshold] = useState('5.5');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Command center alert thresholds, display profile, and module readiness · Demo Preferences
        </p>
      </div>

      <div className="command-card rounded-xl divide-y divide-white/[0.06]">
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">Critical River Crest Threshold</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Triggers automated Red alert escalation when gauge exceeds level (meters).
              </p>
            </div>
          </div>
          <input
            type="number"
            step="0.1"
            value={crestThreshold}
            onChange={(e) => setCrestThreshold(e.target.value)}
            className="w-24 h-10 px-3 rounded-lg bg-[#07111F] border border-blue-500/25 font-mono text-sm text-white text-right focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">Auto-Recommend Nearest Rescue Unit</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre-selects closest available swift-water or amphibious crew for new reports.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoDispatch}
            onClick={() => setAutoDispatch((v) => !v)}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 ${
              autoDispatch ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                autoDispatch ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">Mesh & SMS Alert Failover</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Routes priority citizen evacuations over low-bandwidth relays during outage.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={smsFailover}
            onClick={() => setSmsFailover((v) => !v)}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 ${
              smsFailover ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                smsFailover ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <SettingsIcon className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">Command Dark Theme Profile</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {highContrastNavy
                  ? 'Deep Navy (#07111F) active for low-light operations'
                  : 'Tactical Slate Navy active'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleThemeMode}
            className="px-3.5 py-2 rounded-lg bg-[#0B1728] border border-blue-500/25 hover:border-cyan-400/50 text-xs font-medium text-cyan-300 transition-colors"
          >
            Toggle Contrast
          </button>
        </div>
      </div>
    </div>
  );
}

// Keep unused icon exports clean if referenced externally
export { Activity, BarChart3, Building2, FlaskConical, LifeBuoy };
