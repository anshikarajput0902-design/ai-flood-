import { useState } from 'react';
import {
  AlertOctagon,
  Building2,
  Compass,
  Droplets,
  Layers,
  LifeBuoy,
  Maximize2,
  Minimize2,
  Plus,
  RotateCcw,
  Users,
} from 'lucide-react';
import {
  FloodIncident,
  FloodZonePolygon,
  RescueTeam,
  SeverityLevel,
  ShelterFacility,
} from '../../types/flood';
import { SeverityIndicator } from '../shared/SeverityIndicator';

interface FloodMonitoringMapProps {
  incidents: FloodIncident[];
  teams: RescueTeam[];
  shelters: ShelterFacility[];
  floodZones: FloodZonePolygon[];
  selectedEntityId: string | null;
  onSelectEntity: (id: string | null) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const ZONE_FILL: Record<SeverityLevel, { fill: string; stroke: string }> = {
  Critical: { fill: 'rgba(239, 68, 68, 0.22)', stroke: 'rgba(248, 113, 113, 0.72)' },
  High: { fill: 'rgba(249, 115, 22, 0.19)', stroke: 'rgba(251, 146, 60, 0.65)' },
  Moderate: { fill: 'rgba(6, 182, 212, 0.16)', stroke: 'rgba(34, 211, 238, 0.55)' },
  Low: { fill: 'rgba(34, 197, 94, 0.14)', stroke: 'rgba(74, 222, 128, 0.45)' },
};

export function FloodMonitoringMap({
  incidents,
  teams,
  shelters,
  floodZones,
  selectedEntityId,
  onSelectEntity,
  expanded = false,
  onToggleExpand,
}: FloodMonitoringMapProps) {
  const [showZones, setShowZones] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showTeams, setShowTeams] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [zoom, setZoom] = useState(1);

  const selectedIncident = incidents.find((i) => i.id === selectedEntityId);
  const selectedTeam = teams.find((t) => t.id === selectedEntityId);
  const selectedShelter = shelters.find((s) => s.id === selectedEntityId);

  const handleZoomIn = () => setZoom((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))));
  const handleReset = () => {
    setZoom(1);
    onSelectEntity(incidents[0]?.id ?? null);
  };

  return (
    <section
      aria-label="Live Flood Monitoring Map"
      className="command-card rounded-xl overflow-hidden flex flex-col"
    >
      {/* Map Header Controls */}
      <div className="px-5 py-4 border-b border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-base font-semibold text-white">
              Regional Basin Flood Telemetry Map
            </h2>
            <span className="text-xs text-cyan-400 font-mono">DEMO DATA</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hydrological inundation zones · Active rescue corridors · High-ground shelters
          </p>
        </div>

        {/* Layer Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowZones((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
              showZones
                ? 'bg-blue-500/20 border-cyan-400/45 text-cyan-200'
                : 'bg-[#0B1728] border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Flood Zones</span>
          </button>

          <button
            type="button"
            onClick={() => setShowIncidents((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
              showIncidents
                ? 'bg-red-500/15 border-red-400/40 text-red-200'
                : 'bg-[#0B1728] border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Incidents ({incidents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTeams((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
              showTeams
                ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200'
                : 'bg-[#0B1728] border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Teams ({teams.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShelters((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
              showShelters
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
                : 'bg-[#0B1728] border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Shelters ({shelters.length})</span>
          </button>
        </div>
      </div>

      {/* Interactive Geospatial Viewport */}
      <div
        className={`relative w-full bg-[#060F1C] overflow-hidden select-none ${
          expanded ? 'h-[580px] sm:h-[640px]' : 'h-[410px] sm:h-[460px]'
        }`}
      >
        {/* Zoomable Tactical Canvas */}
        <div
          className="absolute inset-0 transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Base Topographic & Hydrological SVG Layer */}
          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
            aria-hidden="true"
          >
            <defs>
              <pattern id="tacticalGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.08)"
                  strokeWidth="1"
                />
              </pattern>
              <linearGradient id="riverFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
                <stop offset="55%" stopColor="#06B6D4" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.5" />
              </linearGradient>
              <radialGradient id="basinGlow" cx="48%" cy="48%" r="55%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#060F1C" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base Fill + Grid */}
            <rect width="1000" height="600" fill="#060F1C" />
            <rect width="1000" height="600" fill="url(#basinGlow)" />
            <rect width="1000" height="600" fill="url(#tacticalGrid)" />

            {/* Topographic Elevation Contours */}
            <path
              d="M 0 120 Q 180 75 340 135 T 710 95 T 1000 140"
              fill="none"
              stroke="rgba(148, 163, 184, 0.09)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
            />
            <path
              d="M 0 510 Q 220 455 420 520 T 800 475 T 1000 530"
              fill="none"
              stroke="rgba(148, 163, 184, 0.09)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
            />

            {/* Primary Arterial Road Grid */}
            <g stroke="rgba(148, 163, 184, 0.14)" strokeWidth="1.5" fill="none">
              <path d="M 80 0 L 210 600" />
              <path d="M 480 0 L 505 600" />
              <path d="M 830 0 L 795 600" />
              <path d="M 0 165 L 1000 185" />
              <path d="M 0 360 L 1000 345" />
            </g>

            {/* Primary River & Estuary Channel */}
            <path
              d="M 110 -10 C 175 110, 295 160, 345 255 C 395 350, 485 375, 585 435 C 675 490, 745 540, 860 615"
              fill="none"
              stroke="url(#riverFlow)"
              strokeWidth="36"
              strokeLinecap="round"
            />
            <path
              d="M 110 -10 C 175 110, 295 160, 345 255 C 395 350, 485 375, 585 435 C 675 490, 745 540, 860 615"
              fill="none"
              stroke="rgba(34, 211, 238, 0.55)"
              strokeWidth="2"
              strokeDasharray="10 8"
            />

            {/* Tributary Stream */}
            <path
              d="M 865 65 C 770 155, 695 210, 620 275 C 555 330, 475 335, 395 315"
              fill="none"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Harbor Bay Inlet */}
            <path
              d="M 660 600 C 690 480, 780 415, 1000 400 L 1000 600 Z"
              fill="rgba(14, 165, 233, 0.1)"
              stroke="rgba(56, 189, 248, 0.22)"
              strokeWidth="1.2"
            />

            {/* Flood Inundation Polygon Overlays */}
            {showZones &&
              floodZones.map((zone) => {
                const palette = ZONE_FILL[zone.severity];
                return (
                  <g key={zone.id}>
                    <polygon
                      points={zone.points}
                      fill={palette.fill}
                      stroke={palette.stroke}
                      strokeWidth="1.6"
                      strokeDasharray="6 4"
                    />
                    <text
                      x={zone.labelX}
                      y={zone.labelY}
                      textAnchor="middle"
                      fill="rgba(226, 232, 240, 0.72)"
                      fontSize="11"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      fontWeight="600"
                    >
                      {zone.name}
                    </text>
                  </g>
                );
              })}

            {/* Sector Labels */}
            <g
              fill="rgba(148, 163, 184, 0.52)"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
            >
              <text x="48" y="42">NORTH RIDGE · ELEV +42m</text>
              <text x="745" y="42">EAST MEADOW · ELEV +9m</text>
              <text x="48" y="574">WEST PLATEAU · ELEV +38m</text>
              <text x="770" y="574">PORT HARBOR · ELEV +2m</text>
            </g>
          </svg>

          {/* Interactive Shelter Markers */}
          {showShelters &&
            shelters.map((shelter) => {
              const isSelected = selectedEntityId === shelter.id;
              return (
                <button
                  key={shelter.id}
                  type="button"
                  onClick={() => onSelectEntity(shelter.id)}
                  style={{ left: `${shelter.mapX}%`, top: `${shelter.mapY}%` }}
                  title={`${shelter.name} (${shelter.capacity - shelter.occupied} beds available)`}
                  aria-label={`Shelter: ${shelter.name}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-white scale-110 shadow-[0_0_18px_rgba(16,185,129,0.75)] z-20'
                      : 'bg-[#0B1728]/95 text-emerald-400 border-emerald-400/50 hover:scale-105 hover:border-emerald-300 z-10'
                  }`}
                >
                  <Building2 className="w-4 h-4" aria-hidden="true" />
                </button>
              );
            })}

          {/* Interactive Rescue Team Markers */}
          {showTeams &&
            teams.map((team) => {
              const isSelected = selectedEntityId === team.id;
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => onSelectEntity(team.id)}
                  style={{ left: `${team.mapX}%`, top: `${team.mapY}%` }}
                  title={`${team.callSign} · ${team.status}`}
                  aria-label={`Rescue Team: ${team.callSign}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 border-white scale-110 shadow-[0_0_20px_rgba(34,211,238,0.85)] z-20'
                      : 'bg-[#0B1728]/95 text-cyan-300 border-cyan-400/60 hover:scale-105 hover:border-cyan-200 z-10'
                  }`}
                >
                  <LifeBuoy className="w-4 h-4" aria-hidden="true" />
                </button>
              );
            })}

          {/* Interactive Incident Markers */}
          {showIncidents &&
            incidents.map((incident) => {
              const isSelected = selectedEntityId === incident.id;
              const markerColor =
                incident.severity === 'Critical'
                  ? 'border-red-400 text-red-400 bg-red-950/90 shadow-[0_0_14px_rgba(239,68,68,0.45)]'
                  : incident.severity === 'High'
                  ? 'border-orange-400 text-orange-300 bg-orange-950/90 shadow-[0_0_12px_rgba(249,115,22,0.35)]'
                  : incident.severity === 'Moderate'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/90'
                  : 'border-emerald-400 text-emerald-300 bg-emerald-950/90';

              return (
                <button
                  key={incident.id}
                  type="button"
                  onClick={() => onSelectEntity(incident.id)}
                  style={{ left: `${incident.mapX}%`, top: `${incident.mapY}%` }}
                  title={`${incident.id}: ${incident.title}`}
                  aria-label={`Incident ${incident.id}: ${incident.title}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-md border flex items-center gap-1 text-[11px] font-mono font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${markerColor} ${
                    isSelected ? 'scale-110 ring-2 ring-white z-30' : 'hover:scale-105 z-20'
                  }`}
                >
                  <AlertOctagon className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span>{incident.id.replace('INC-', '#')}</span>
                </button>
              );
            })}
        </div>

        {/* Top-Left Compass & Scale Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#07111F]/85 backdrop-blur-md border border-blue-500/20 text-xs text-slate-300 pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
          <span className="font-mono tabular-nums">37.80°N · 122.26°W</span>
        </div>

        {/* Top-Right Zoom & Expand Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-30">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in map"
            className="w-8 h-8 rounded-lg bg-[#0B1728]/90 backdrop-blur border border-blue-500/25 hover:border-cyan-400/50 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out map"
            className="w-8 h-8 rounded-lg bg-[#0B1728]/90 backdrop-blur border border-blue-500/25 hover:border-cyan-400/50 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="text-base leading-none font-semibold">−</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset map view"
            title="Reset map view"
            className="w-8 h-8 rounded-lg bg-[#0B1728]/90 backdrop-blur border border-blue-500/25 hover:border-cyan-400/50 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={expanded ? 'Collapse map' : 'Expand map'}
              title={expanded ? 'Collapse map' : 'Expand map'}
              className="w-8 h-8 rounded-lg bg-[#0B1728]/90 backdrop-blur border border-blue-500/25 hover:border-cyan-400/50 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
            >
              {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Bottom-Left Selected Entity Inspector Overlay */}
        {(selectedIncident || selectedTeam || selectedShelter) && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-96 rounded-xl bg-[#0B1728]/92 backdrop-blur-md border border-cyan-400/35 p-3.5 shadow-2xl z-30">
            {selectedIncident && (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-cyan-300">{selectedIncident.id}</span>
                  <SeverityIndicator severity={selectedIncident.severity} compact />
                </div>
                <p className="mt-1 text-sm font-semibold text-white">{selectedIncident.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{selectedIncident.sector}</p>
                <div className="mt-2.5 pt-2.5 border-t border-white/10 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Water Depth</span>
                    <span className="font-mono tabular-nums font-semibold text-cyan-300 inline-flex items-center gap-1 mt-0.5">
                      <Droplets className="w-3 h-3" aria-hidden="true" />
                      {selectedIncident.waterDepthMeters.toFixed(1)}m
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">At Risk</span>
                    <span className="font-mono tabular-nums font-semibold text-white inline-flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-slate-400" aria-hidden="true" />
                      {selectedIncident.affectedPeople}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned</span>
                    <span className="font-medium text-slate-200 truncate block mt-0.5">
                      {selectedIncident.assignedTeam ?? 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedTeam && (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-cyan-300">{selectedTeam.specialty} Unit</span>
                  <span className="text-xs font-medium text-emerald-400">{selectedTeam.status}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">{selectedTeam.callSign}</p>
                <p className="mt-0.5 text-xs text-slate-400">{selectedTeam.missionNote}</p>
                <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>{selectedTeam.vehicles}</span>
                  <span className="font-mono tabular-nums text-cyan-300">
                    {selectedTeam.personnel} personnel
                  </span>
                </div>
              </div>
            )}

            {selectedShelter && (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-emerald-400">Emergency Shelter</span>
                  <span className="text-xs font-medium text-slate-200">{selectedShelter.status}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">{selectedShelter.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">{selectedShelter.district}</p>
                <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    Available Beds:{' '}
                    <strong className="font-mono tabular-nums text-emerald-400">
                      {selectedShelter.capacity - selectedShelter.occupied}
                    </strong>{' '}
                    / {selectedShelter.capacity}
                  </span>
                  <span className="font-mono tabular-nums text-cyan-300">
                    Supplies {selectedShelter.suppliesPercent}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom-Right Map Legend */}
        <div className="hidden md:flex absolute bottom-3 right-3 items-center gap-4 px-3.5 py-2 rounded-lg bg-[#07111F]/85 backdrop-blur-md border border-blue-500/20 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500/80 border border-red-300" aria-hidden="true" />
            Critical Zone
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/80 border border-orange-300" aria-hidden="true" />
            High Risk
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" aria-hidden="true" />
            Rescue Team
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" aria-hidden="true" />
            Shelter
          </span>
        </div>
      </div>
    </section>
  );
}
