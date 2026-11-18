import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flag,
  PauseCircle,
  Radio,
  ShieldAlert,
  XCircle,
} from 'lucide-react';

type BadgeVariant =
  | 'live'
  | 'scheduled'
  | 'completed'
  | 'passed'
  | 'failed'
  | 'nominal'
  | 'attention'
  | 'flagged'
  | 'paused'
  | 'answered'
  | 'review'
  | 'unvisited';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const VARIANT_CONFIG: Record<
  BadgeVariant,
  {
    bg: string;
    text: string;
    border: string;
    defaultLabel: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  live: {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#047857]',
    border: 'border-[#A7F3D0]',
    defaultLabel: 'Live Session',
    Icon: Radio,
  },
  scheduled: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#BFDBFE]',
    defaultLabel: 'Scheduled',
    Icon: Clock,
  },
  completed: {
    bg: 'bg-[#F1F5F9]',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
    defaultLabel: 'Completed',
    Icon: CheckCircle2,
  },
  passed: {
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#15803D]',
    border: 'border-[#BBF7D0]',
    defaultLabel: 'Passed',
    Icon: CheckCircle2,
  },
  failed: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FECACA]',
    defaultLabel: 'Failed',
    Icon: XCircle,
  },
  nominal: {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#047857]',
    border: 'border-[#A7F3D0]',
    defaultLabel: 'Nominal',
    Icon: CheckCircle2,
  },
  attention: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    defaultLabel: 'Attention',
    Icon: AlertTriangle,
  },
  flagged: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#FECACA]',
    defaultLabel: 'Flagged',
    Icon: ShieldAlert,
  },
  paused: {
    bg: 'bg-[#F1F5F9]',
    text: 'text-[#475569]',
    border: 'border-[#CBD5E1]',
    defaultLabel: 'Paused',
    Icon: PauseCircle,
  },
  answered: {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#047857]',
    border: 'border-[#A7F3D0]',
    defaultLabel: 'Answered',
    Icon: CheckCircle2,
  },
  review: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    defaultLabel: 'Marked for Review',
    Icon: Flag,
  },
  unvisited: {
    bg: 'bg-[#F1F5F9]',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
    defaultLabel: 'Unvisited',
    Icon: Clock,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label }) => {
  const cfg = VARIANT_CONFIG[variant];
  const Icon = cfg.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold whitespace-nowrap shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label ?? cfg.defaultLabel}</span>
    </span>
  );
};
