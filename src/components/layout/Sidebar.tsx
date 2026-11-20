import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  FlaskConical,
  LayoutDashboard,
  LifeBuoy,
  Map,
  Settings,
  X,
} from 'lucide-react';
import { NavSectionId } from '../../types/flood';

export interface NavItem {
  id: NavSectionId;
  label: string;
  icon: typeof LayoutDashboard;
  badgeCount?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'reports', label: 'Emergency Reports', icon: AlertTriangle },
  { id: 'map', label: 'Live Flood Map', icon: Map },
  { id: 'risk-analysis', label: 'AI Risk Analysis', icon: Activity },
  { id: 'rescue', label: 'Rescue Coordination', icon: LifeBuoy },
  { id: 'shelters', label: 'Shelters & Resources', icon: Building2 },
  { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'testing', label: 'Software Testing', icon: FlaskConical },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeSection: NavSectionId;
  onSelectSection: (section: NavSectionId) => void;
  unreadAlertsCount: number;
  criticalCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeSection,
  onSelectSection,
  unreadAlertsCount,
  criticalCount,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const handleNavClick = (id: NavSectionId) => {
    onSelectSection(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0B1728] border-r border-blue-500/20 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-blue-500/15 shrink-0">
        <button
          type="button"
          onClick={() => handleNavClick('overview')}
          className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg py-1"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_16px_rgba(6,182,212,0.2)] shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-cyan-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2L4 6v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V6l-8-4z" />
              <path d="M7.5 13.5c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0" />
              <path d="M8.5 10.2c1.2-.9 2.3-.9 3.5 0s2.3.9 3.5 0" />
            </svg>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            AI-FLOOD
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Primary Navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          let counter: number | undefined;
          if (item.id === 'alerts' && unreadAlertsCount > 0) counter = unreadAlertsCount;
          if (item.id === 'reports' && criticalCount > 0) counter = criticalCount;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isActive
                  ? 'bg-blue-500/15 text-white border border-cyan-400/35 shadow-[0_0_18px_rgba(37,99,235,0.22)]'
                  : 'text-slate-300 border border-transparent hover:text-white hover:bg-white/[0.04] hover:border-blue-500/15'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate whitespace-nowrap">{item.label}</span>
              </span>

              {counter !== undefined && (
                <span
                  className={`font-mono tabular-nums text-xs px-1.5 py-0.5 rounded shrink-0 ${
                    item.id === 'reports'
                      ? 'text-red-300 bg-red-500/15'
                      : 'text-cyan-300 bg-cyan-500/15'
                  }`}
                >
                  {counter}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Clean Demo Notice Footer */}
      <div className="px-5 py-4 border-t border-blue-500/15 text-xs text-slate-400 shrink-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-300">Demo Dataset</span>
          <span className="font-mono text-cyan-400">Stage 1</span>
        </div>
        <p className="mt-1 text-slate-400/80 leading-relaxed">
          Simulated telemetry for command UI preview.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[82vw] h-full z-10 shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
