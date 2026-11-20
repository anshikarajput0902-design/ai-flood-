import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Shield,
  Sun,
  X,
} from 'lucide-react';
import { AlertItem, FloodIncident, NavSectionId, RescueTeam, ShelterFacility } from '../../types/flood';
import { SeverityIndicator } from '../shared/SeverityIndicator';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  alerts: AlertItem[];
  onMarkAllRead: () => void;
  onMarkAlertRead: (id: string) => void;
  onNavigate: (section: NavSectionId) => void;
  onOpenMobileMenu: () => void;
  incidents: FloodIncident[];
  teams: RescueTeam[];
  shelters: ShelterFacility[];
  onSelectMapEntity: (entityId: string) => void;
  highContrastNavy: boolean;
  onToggleThemeMode: () => void;
}

export function TopNav({
  searchQuery,
  onSearchChange,
  alerts,
  onMarkAllRead,
  onMarkAlertRead,
  onNavigate,
  onOpenMobileMenu,
  incidents,
  teams,
  shelters,
  onSelectMapEntity,
  highContrastNavy,
  onToggleThemeMode,
}: TopNavProps) {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const alertsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = alerts.filter((a) => !a.read).length;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setAlertsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const trimmed = searchQuery.trim().toLowerCase();
  const matchedIncidents = trimmed
    ? incidents.filter(
        (i) =>
          i.title.toLowerCase().includes(trimmed) ||
          i.sector.toLowerCase().includes(trimmed) ||
          i.id.toLowerCase().includes(trimmed)
      )
    : [];
  const matchedTeams = trimmed
    ? teams.filter(
        (t) =>
          t.callSign.toLowerCase().includes(trimmed) ||
          t.sector.toLowerCase().includes(trimmed) ||
          t.specialty.toLowerCase().includes(trimmed)
      )
    : [];
  const matchedShelters = trimmed
    ? shelters.filter(
        (s) =>
          s.name.toLowerCase().includes(trimmed) ||
          s.district.toLowerCase().includes(trimmed)
      )
    : [];

  const hasSearchResults =
    matchedIncidents.length > 0 || matchedTeams.length > 0 || matchedShelters.length > 0;

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#07111F]/90 backdrop-blur-md border-b border-blue-500/20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2.5 rounded-lg border border-blue-500/20 bg-[#0B1728] text-slate-200 hover:text-white hover:border-cyan-400/40 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div ref={searchRef} className="relative flex-1">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search incidents, sectors, rescue units, or shelters..."
            aria-label="Search command center"
            className="w-full h-10 pl-10 pr-9 rounded-lg bg-[#0B1728] border border-blue-500/20 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Jump Search Results */}
          {searchFocused && trimmed.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 rounded-xl bg-[#0B1728] border border-blue-500/30 shadow-2xl overflow-hidden z-40 max-h-80 overflow-y-auto">
              {!hasSearchResults ? (
                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  No matching incidents, teams, or shelters for "{searchQuery}".
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {matchedIncidents.map((inc) => (
                    <button
                      key={inc.id}
                      type="button"
                      onClick={() => {
                        onSelectMapEntity(inc.id);
                        onNavigate('overview');
                        setSearchFocused(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-500/10 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">{inc.title}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {inc.id} · {inc.sector}
                        </p>
                      </div>
                      <SeverityIndicator severity={inc.severity} compact />
                    </button>
                  ))}
                  {matchedTeams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => {
                        onSelectMapEntity(team.id);
                        onNavigate('rescue');
                        setSearchFocused(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-500/10 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">
                          {team.callSign}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          Rescue Unit · {team.sector}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-cyan-400 shrink-0">
                        {team.status}
                      </span>
                    </button>
                  ))}
                  {matchedShelters.map((shelter) => (
                    <button
                      key={shelter.id}
                      type="button"
                      onClick={() => {
                        onSelectMapEntity(shelter.id);
                        onNavigate('shelters');
                        setSearchFocused(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-500/10 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">
                          {shelter.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          Shelter · {shelter.district}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-emerald-400 shrink-0">
                        {shelter.capacity - shelter.occupied} beds free
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Date, Dark Theme Control, Notification Bell, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Current Date */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1728] border border-blue-500/15 text-xs text-slate-300 whitespace-nowrap shrink-0">
          <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
          <span className="font-mono tabular-nums">{formattedDate}</span>
        </div>

        {/* Dark Theme Mode Button */}
        <button
          type="button"
          onClick={onToggleThemeMode}
          aria-label={highContrastNavy ? 'Switch to deep midnight navy' : 'Switch to tactical slate navy'}
          title={highContrastNavy ? 'Dark Theme: Deep Navy' : 'Dark Theme: Tactical Navy'}
          className="h-10 px-3 rounded-lg bg-[#0B1728] border border-blue-500/20 hover:border-cyan-400/40 text-slate-200 hover:text-white flex items-center gap-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
        >
          {highContrastNavy ? (
            <Moon className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
          ) : (
            <Sun className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
          )}
          <span className="hidden xl:inline">Dark Theme</span>
        </button>

        {/* Notifications */}
        <div ref={alertsRef} className="relative">
          <button
            type="button"
            onClick={() => setAlertsOpen((prev) => !prev)}
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={alertsOpen}
            className="relative h-10 w-10 rounded-lg bg-[#0B1728] border border-blue-500/20 hover:border-cyan-400/40 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white font-mono text-[10px] font-semibold flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {alertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0B1728] border border-blue-500/30 shadow-2xl overflow-hidden z-40">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Alert Feed (Demo)</span>
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Mark all read</span>
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {alerts.map((alert) => (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => onMarkAlertRead(alert.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-500/10 transition-colors ${
                      alert.read ? 'opacity-65' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <SeverityIndicator severity={alert.severity} compact />
                      <span className="font-mono text-[11px] text-slate-400">{alert.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-100">{alert.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{alert.message}</p>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-white/10 bg-[#07111F]/60">
                <button
                  type="button"
                  onClick={() => {
                    setAlertsOpen(false);
                    onNavigate('alerts');
                  }}
                  className="w-full text-center text-xs font-medium text-cyan-400 hover:text-cyan-300 py-1"
                >
                  Open Alerts & Notifications Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            className="h-10 pl-1.5 pr-2.5 rounded-lg bg-[#0B1728] border border-blue-500/20 hover:border-cyan-400/40 flex items-center gap-2.5 transition-colors shrink-0"
          >
            <img
              src="/src/assets/images/avatar_command_director_1795157848094.jpg"
              alt="Commander Elena Vance"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-md object-cover border border-cyan-400/30 shrink-0"
            />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-semibold text-white whitespace-nowrap">Elena Vance</p>
              <p className="text-[11px] text-slate-400 whitespace-nowrap">Ops Director</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" aria-hidden="true" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-[#0B1728] border border-blue-500/30 shadow-2xl overflow-hidden z-40">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-semibold text-white">Elena Vance</p>
                <p className="text-xs text-slate-400">Regional Flood Operations</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate('settings');
                  }}
                  className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-200 hover:bg-blue-500/15 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>Command Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
