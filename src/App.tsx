import { useMemo, useState } from 'react';
import { AlertOctagon, AlertTriangle, Building2, LifeBuoy } from 'lucide-react';
import { EmergencyActivityFeed } from './components/dashboard/EmergencyActivityFeed';
import { FloodMonitoringMap } from './components/dashboard/FloodMonitoringMap';
import { FloodRiskChart } from './components/dashboard/FloodRiskChart';
import { RescueTeamPanel } from './components/dashboard/RescueTeamPanel';
import { ShelterCapacityChart } from './components/dashboard/ShelterCapacityChart';
import { StatCard } from './components/dashboard/StatCard';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import {
  AiRiskAnalysisView,
  AlertsNotificationsView,
  AnalyticsView,
  EmergencyReportsView,
  LiveFloodMapView,
  RescueCoordinationView,
  SettingsView,
  SheltersResourcesView,
  SoftwareTestingView,
} from './components/views/ModuleViews';
import {
  DEMO_ALERTS,
  DEMO_FLOOD_ZONES,
  DEMO_HYDRO_FORECAST,
  DEMO_INCIDENTS,
  DEMO_QA_TESTS,
  DEMO_RESCUE_TEAMS,
  DEMO_RISK_DISTRIBUTION,
  DEMO_SHELTERS,
} from './data/demoData';
import {
  AlertItem,
  FloodIncident,
  NavSectionId,
  RescueStatus,
  RescueTeam,
} from './types/flood';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highContrastNavy, setHighContrastNavy] = useState(true);

  const [incidents, setIncidents] = useState<FloodIncident[]>(DEMO_INCIDENTS);
  const [teams, setTeams] = useState<RescueTeam[]>(DEMO_RESCUE_TEAMS);
  const [alerts, setAlerts] = useState<AlertItem[]>(DEMO_ALERTS);
  const [selectedMapEntityId, setSelectedMapEntityId] = useState<string | null>(
    DEMO_INCIDENTS[0].id
  );

  const criticalCount = useMemo(
    () => incidents.filter((i) => i.severity === 'Critical' && i.status !== 'Resolved').length,
    [incidents]
  );

  const activeTeamsCount = useMemo(
    () => teams.filter((t) => t.status === 'Deployed' || t.status === 'En Route').length,
    [teams]
  );

  const availableSheltersCount = useMemo(
    () => DEMO_SHELTERS.filter((s) => s.status !== 'Full').length,
    []
  );

  const totalOpenBeds = useMemo(
    () => DEMO_SHELTERS.reduce((sum, s) => sum + (s.capacity - s.occupied), 0),
    []
  );

  const unreadAlertsCount = useMemo(
    () => alerts.filter((a) => !a.read).length,
    [alerts]
  );

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleMarkAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const handleAddIncident = (incident: FloodIncident) => {
    setIncidents((prev) => [incident, ...prev]);
    setSelectedMapEntityId(incident.id);
  };

  const handleCycleTeamStatus = (id: string) => {
    const nextStatus: Record<RescueStatus, RescueStatus> = {
      Deployed: 'Returning',
      'En Route': 'Deployed',
      Standby: 'Deployed',
      Returning: 'Standby',
    };
    setTeams((prev) =>
      prev.map((team) =>
        team.id === id ? { ...team, status: nextStatus[team.status], etaMinutes: undefined } : team
      )
    );
  };

  const handleLocateOnMap = (id: string) => {
    setSelectedMapEntityId(id);
    setActiveSection('overview');
  };

  const rootBg = highContrastNavy ? 'bg-[#07111F]' : 'bg-[#0A1628]';

  return (
    <div className={`min-h-screen flex ${rootBg} text-slate-100 transition-colors duration-200`}>
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        unreadAlertsCount={unreadAlertsCount}
        criticalCount={criticalCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alerts={alerts}
          onMarkAllRead={handleMarkAllRead}
          onMarkAlertRead={handleMarkAlertRead}
          onNavigate={setActiveSection}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          incidents={incidents}
          teams={teams}
          shelters={DEMO_SHELTERS}
          onSelectMapEntity={setSelectedMapEntityId}
          highContrastNavy={highContrastNavy}
          onToggleThemeMode={() => setHighContrastNavy((v) => !v)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Dashboard Page Title & Subtitle */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
                    Emergency Command Center
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-300">
                    Monitor incidents, analyze flood risks and coordinate emergency response.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                  <span className="font-mono text-cyan-400">DEMO DATA</span>
                  <span aria-hidden="true">·</span>
                  <span>Regional Basin Sector</span>
                </div>
              </div>

              {/* Four Statistics Cards */}
              <section
                aria-label="Key Emergency Statistics"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5"
              >
                <StatCard
                  label="Total Incidents"
                  value={incidents.length}
                  subtitle="6 sectors monitored"
                  deltaText="DEMO · +2 last hr"
                  accent="blue"
                  icon={AlertTriangle}
                  onClick={() => setActiveSection('reports')}
                />
                <StatCard
                  label="Critical Incidents"
                  value={criticalCount}
                  subtitle="Immediate life-safety tier"
                  deltaText="Priority Active"
                  accent="red"
                  icon={AlertOctagon}
                  onClick={() => setActiveSection('reports')}
                />
                <StatCard
                  label="Active Rescue Teams"
                  value={`${activeTeamsCount} / ${teams.length}`}
                  subtitle={`${teams.reduce((s, t) => s + t.personnel, 0)} field personnel`}
                  deltaText="1 Standby"
                  accent="cyan"
                  icon={LifeBuoy}
                  onClick={() => setActiveSection('rescue')}
                />
                <StatCard
                  label="Available Shelters"
                  value={availableSheltersCount}
                  subtitle={`${totalOpenBeds.toLocaleString()} beds open`}
                  deltaText="4 Med Units"
                  accent="green"
                  icon={Building2}
                  onClick={() => setActiveSection('shelters')}
                />
              </section>

              {/* Primary Geospatial Map + Emergency Activity Feed */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
                <div className="xl:col-span-8">
                  <FloodMonitoringMap
                    incidents={incidents}
                    teams={teams}
                    shelters={DEMO_SHELTERS}
                    floodZones={DEMO_FLOOD_ZONES}
                    selectedEntityId={selectedMapEntityId}
                    onSelectEntity={setSelectedMapEntityId}
                    onToggleExpand={() => setActiveSection('map')}
                  />
                </div>

                <div className="xl:col-span-4">
                  <EmergencyActivityFeed
                    incidents={incidents}
                    selectedIncidentId={selectedMapEntityId}
                    onSelectIncident={(id) => setSelectedMapEntityId(id)}
                    onViewAllReports={() => setActiveSection('reports')}
                  />
                </div>
              </div>

              {/* Secondary Analytics & Operations Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-4">
                  <FloodRiskChart data={DEMO_RISK_DISTRIBUTION} />
                </div>

                <div className="lg:col-span-4">
                  <RescueTeamPanel
                    teams={teams}
                    selectedTeamId={selectedMapEntityId}
                    onSelectTeam={(id) => setSelectedMapEntityId(id)}
                    onManageTeams={() => setActiveSection('rescue')}
                  />
                </div>

                <div className="lg:col-span-4">
                  <ShelterCapacityChart
                    shelters={DEMO_SHELTERS}
                    selectedShelterId={selectedMapEntityId}
                    onSelectShelter={(id) => setSelectedMapEntityId(id)}
                    onViewAllShelters={() => setActiveSection('shelters')}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <EmergencyReportsView
              incidents={incidents}
              onAddIncident={handleAddIncident}
              onFocusOnMap={handleLocateOnMap}
            />
          )}

          {activeSection === 'map' && (
            <LiveFloodMapView
              incidents={incidents}
              teams={teams}
              shelters={DEMO_SHELTERS}
              floodZones={DEMO_FLOOD_ZONES}
              selectedEntityId={selectedMapEntityId}
              onSelectEntity={setSelectedMapEntityId}
            />
          )}

          {activeSection === 'risk-analysis' && (
            <AiRiskAnalysisView
              riskData={DEMO_RISK_DISTRIBUTION}
              forecast={DEMO_HYDRO_FORECAST}
              zones={DEMO_FLOOD_ZONES}
            />
          )}

          {activeSection === 'rescue' && (
            <RescueCoordinationView
              teams={teams}
              onCycleTeamStatus={handleCycleTeamStatus}
            />
          )}

          {activeSection === 'shelters' && (
            <SheltersResourcesView shelters={DEMO_SHELTERS} />
          )}

          {activeSection === 'alerts' && (
            <AlertsNotificationsView
              alerts={alerts}
              onMarkAlertRead={handleMarkAlertRead}
              onMarkAllRead={handleMarkAllRead}
            />
          )}

          {activeSection === 'analytics' && (
            <AnalyticsView riskData={DEMO_RISK_DISTRIBUTION} shelters={DEMO_SHELTERS} />
          )}

          {activeSection === 'testing' && <SoftwareTestingView tests={DEMO_QA_TESTS} />}

          {activeSection === 'settings' && (
            <SettingsView
              highContrastNavy={highContrastNavy}
              onToggleThemeMode={() => setHighContrastNavy((v) => !v)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
