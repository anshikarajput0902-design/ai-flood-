import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { SeverityLevel } from '../../types/flood';

interface SeverityIndicatorProps {
  severity: SeverityLevel;
  compact?: boolean;
}

export function SeverityIndicator({ severity, compact = false }: SeverityIndicatorProps) {
  const config: Record<
    SeverityLevel,
    { text: string; colorClass: string; Icon: typeof AlertOctagon }
  > = {
    Critical: {
      text: 'Critical',
      colorClass: 'text-red-400',
      Icon: AlertOctagon,
    },
    High: {
      text: 'High',
      colorClass: 'text-orange-400',
      Icon: AlertTriangle,
    },
    Moderate: {
      text: 'Moderate',
      colorClass: 'text-cyan-400',
      Icon: Info,
    },
    Low: {
      text: 'Low',
      colorClass: 'text-emerald-400',
      Icon: CheckCircle2,
    },
  };

  const { text, colorClass, Icon } = config[severity];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0 ${
        compact ? 'text-xs' : 'text-xs'
      } ${colorClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}
