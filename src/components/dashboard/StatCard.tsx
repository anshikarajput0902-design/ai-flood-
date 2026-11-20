import { LucideIcon } from 'lucide-react';

export type StatAccent = 'blue' | 'red' | 'cyan' | 'green';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  deltaText: string;
  accent: StatAccent;
  icon: LucideIcon;
  onClick?: () => void;
}

const ACCENT_STYLES: Record<
  StatAccent,
  { iconBg: string; iconColor: string; deltaColor: string; ringHover: string }
> = {
  blue: {
    iconBg: 'bg-blue-500/15 border-blue-400/30',
    iconColor: 'text-blue-400',
    deltaColor: 'text-blue-300',
    ringHover: 'hover:border-blue-400/50',
  },
  red: {
    iconBg: 'bg-red-500/15 border-red-400/30',
    iconColor: 'text-red-400',
    deltaColor: 'text-red-300',
    ringHover: 'hover:border-red-400/50',
  },
  cyan: {
    iconBg: 'bg-cyan-500/15 border-cyan-400/30',
    iconColor: 'text-cyan-400',
    deltaColor: 'text-cyan-300',
    ringHover: 'hover:border-cyan-400/50',
  },
  green: {
    iconBg: 'bg-emerald-500/15 border-emerald-400/30',
    iconColor: 'text-emerald-400',
    deltaColor: 'text-emerald-300',
    ringHover: 'hover:border-emerald-400/50',
  },
};

export function StatCard({
  label,
  value,
  subtitle,
  deltaText,
  accent,
  icon: Icon,
  onClick,
}: StatCardProps) {
  const style = ACCENT_STYLES[accent];
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`command-card w-full text-left rounded-xl p-5 flex flex-col justify-between gap-4 ${style.ringHover} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-white tabular-nums tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${style.iconBg}`}
        >
          <Icon className={`w-5 h-5 ${style.iconColor}`} aria-hidden="true" />
        </div>
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-400 truncate">{subtitle}</span>
        <span className={`font-mono tabular-nums font-medium whitespace-nowrap shrink-0 ${style.deltaColor}`}>
          {deltaText}
        </span>
      </div>
    </Wrapper>
  );
}
