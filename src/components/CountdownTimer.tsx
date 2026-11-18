import React from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  compact?: boolean;
  onSimulateTime?: (seconds: number) => void;
}

export function formatDuration(totalSec: number): string {
  const clamped = Math.max(0, totalSec);
  const hours = Math.floor(clamped / 3600);
  const mins = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  remainingSeconds,
  totalSeconds,
  compact = false,
  onSimulateTime,
}) => {
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, remainingSeconds / totalSeconds)) : 0;
  const isCritical = remainingSeconds <= 120; // < 2 minutes
  const isWarning = !isCritical && remainingSeconds <= 600; // < 10 minutes

  const strokeColor = isCritical ? '#DC2626' : isWarning ? '#D97706' : '#06B6D4';
  const textColor = isCritical ? 'text-[#DC2626]' : isWarning ? 'text-[#D97706]' : 'text-[#142B4D]';
  const borderClass = isCritical
    ? 'border-[#FECACA] bg-[#FEF2F2]'
    : isWarning
    ? 'border-[#FDE68A] bg-[#FFFBEB]'
    : 'border-[#E2E8F0] bg-[#FFFFFF]';

  const size = compact ? 32 : 40;
  const strokeWidth = compact ? 3 : 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md border transition-colors duration-200 ${borderClass}`}
        aria-live="polite"
        aria-label={`Time remaining: ${formatDuration(remainingSeconds)}`}
      >
        <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <Clock
            className={`w-3.5 h-3.5 absolute ${
              isCritical ? 'text-[#DC2626] motion-safe:animate-pulse' : isWarning ? 'text-[#D97706]' : 'text-[#06B6D4]'
            }`}
          />
        </div>

        <div className="flex flex-col">
          {!compact && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#475569] leading-none mb-0.5">
              {isCritical ? 'Final 2 Min' : isWarning ? 'Under 10 Min' : 'Time Remaining'}
            </span>
          )}
          <span
            className={`font-mono tabular-nums font-bold tracking-[0.04em] leading-tight ${
              compact ? 'text-base' : 'text-[22px]'
            } ${textColor}`}
          >
            {formatDuration(remainingSeconds)}
          </span>
        </div>
      </div>

      {onSimulateTime && !compact && (
        <div className="hidden xl:flex items-center gap-1 border border-[#E2E8F0] bg-[#FFFFFF] rounded-md p-1">
          <button
            type="button"
            onClick={() => onSimulateTime(2700)}
            title="Reset timer to 45:00"
            className="px-2 py-1 text-[11px] font-semibold text-[#475569] hover:text-[#142B4D] hover:bg-[#F8FAFC] rounded transition-colors whitespace-nowrap"
          >
            45m
          </button>
          <button
            type="button"
            onClick={() => onSimulateTime(540)}
            title="Preview warning state (<10m)"
            className="px-2 py-1 text-[11px] font-semibold text-[#B45309] hover:bg-[#FFFBEB] rounded transition-colors whitespace-nowrap"
          >
            9m
          </button>
          <button
            type="button"
            onClick={() => onSimulateTime(95)}
            title="Preview critical state (<2m)"
            className="px-2 py-1 text-[11px] font-semibold text-[#B91C1C] hover:bg-[#FEF2F2] rounded transition-colors whitespace-nowrap"
          >
            1m35s
          </button>
        </div>
      )}
    </div>
  );
};
