import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  MessageSquareWarning,
  Pause,
  Play,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { IntegrityEvent, ProctorCandidate, ProctorStatus } from '../types/assessment';
import { formatDuration } from './CountdownTimer';
import { SafeImage } from './SafeImage';
import { StatusBadge } from './StatusBadge';

interface ProctoringMonitorProps {
  candidates: ProctorCandidate[];
  events: IntegrityEvent[];
  onUpdateCandidateStatus: (
    candidateId: string,
    newStatus: ProctorStatus,
    eventType: IntegrityEvent['eventType'],
    severity: IntegrityEvent['severity'],
    detail: string
  ) => void;
}

export const ProctoringMonitor: React.FC<ProctoringMonitorProps> = ({
  candidates,
  events,
  onUpdateCandidateStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'issues' | 'nominal'>('all');
  const [search, setSearch] = useState('');
  const [tickOffset, setTickOffset] = useState(0);
  const [warningModalCandidate, setWarningModalCandidate] = useState<ProctorCandidate | null>(null);
  const [warningMessage, setWarningMessage] = useState(
    'Please keep your browser window focused on the examination console and ensure no external materials are on your desk.'
  );

  // Subtle live 1-second timer tick for active stations
  useEffect(() => {
    const id = window.setInterval(() => {
      setTickOffset((t) => t + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const filteredCandidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return candidates.filter((c) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'nominal' && c.status === 'nominal') ||
        (filter === 'issues' && (c.status === 'attention' || c.status === 'flagged' || c.status === 'paused'));
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.studentId.toLowerCase().includes(q) ||
        c.seatCode.toLowerCase().includes(q) ||
        c.assessmentCode.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [candidates, filter, search]);

  const handleSendWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningModalCandidate) return;
    onUpdateCandidateStatus(
      warningModalCandidate.id,
      'attention',
      'Proctor Warning',
      'warning',
      `Proctor notice dispatched: "${warningMessage.trim()}"`
    );
    setWarningModalCandidate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#142B4D]">
            Live Proctoring Telemetry
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Supervise active candidate stations, inspect focus events, and dispatch real-time proctor interventions.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#475569] bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5">
          <span className="font-semibold text-[#142B4D]">Active Feeds:</span>
          <span className="font-mono tabular-nums font-bold text-[#0F172A]">
            {candidates.length}
          </span>
          <span aria-hidden="true" className="text-[#CBD5E1]">|</span>
          <span className="font-semibold text-[#B45309]">
            Requires Review:{' '}
            <span className="font-mono tabular-nums">
              {candidates.filter((c) => c.status === 'flagged' || c.status === 'attention').length}
            </span>
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#E2E8F0]/60 rounded-lg self-start">
          {(
            [
              { id: 'all', label: 'All Stations' },
              { id: 'issues', label: 'Attention & Flagged' },
              { id: 'nominal', label: 'Nominal Only' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-[#142B4D] shadow-xs'
                  : 'text-[#475569] hover:text-[#142B4D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by candidate, ID, seat..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* Candidate Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCandidates.map((cand) => {
          const liveRemaining =
            cand.status === 'paused'
              ? cand.remainingSeconds
              : Math.max(0, cand.remainingSeconds - tickOffset);

          return (
            <article
              key={cand.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05)] overflow-hidden flex flex-col"
            >
              {/* Webcam Feed with Proctor Glass Overlay */}
              <div className="relative aspect-[4/3] bg-[#0F172A] overflow-hidden">
                <SafeImage
                  src={cand.avatarUrl}
                  alt={`Proctor feed for ${cand.name}`}
                  className={`w-full h-full object-cover ${
                    cand.status === 'paused' ? 'opacity-50 grayscale' : ''
                  }`}
                  fallbackLabel={cand.name}
                />

                {/* Top Glass Overlay */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                  <div className="px-2.5 py-1 rounded-md backdrop-blur-md bg-white/85 border border-[#E2E8F0] text-xs font-mono font-semibold text-[#142B4D] tabular-nums">
                    {cand.assessmentCode} · {cand.seatCode}
                  </div>
                  <StatusBadge variant={cand.status} />
                </div>

                {/* Bottom Glass Telemetry Overlay */}
                <div className="absolute bottom-3 inset-x-3 px-3 py-2 rounded-md backdrop-blur-md bg-white/85 border border-[#E2E8F0] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0F172A] truncate">
                      {cand.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#475569] tabular-nums">
                      {cand.studentId}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-[#142B4D] tabular-nums">
                      {formatDuration(liveRemaining)}
                    </div>
                    <div className="text-[11px] font-mono text-[#475569] tabular-nums">
                      Q{cand.progressCurrent}/{cand.progressTotal}
                    </div>
                  </div>
                </div>
              </div>

              {/* Station Metadata & Controls */}
              <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                <div className="flex items-center justify-between text-xs text-[#475569]">
                  <span>
                    Focus shifts:{' '}
                    <strong
                      className={`font-mono tabular-nums ${
                        cand.tabSwitches > 0 ? 'text-[#B91C1C]' : 'text-[#0F172A]'
                      }`}
                    >
                      {cand.tabSwitches}
                    </strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Audio:{' '}
                    <strong
                      className={
                        cand.audioAnomaly ? 'text-[#B45309] font-semibold' : 'text-[#047857]'
                      }
                    >
                      {cand.audioAnomaly ? 'Spike Detected' : 'Quiet'}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setWarningModalCandidate(cand)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#142B4D] transition-colors whitespace-nowrap"
                  >
                    <MessageSquareWarning className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Warn</span>
                  </button>

                  {cand.status === 'paused' ? (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateCandidateStatus(
                          cand.id,
                          'nominal',
                          'Flag Cleared',
                          'info',
                          'Session resumed by supervising proctor.'
                        )
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] hover:bg-[#D1FAE5] text-xs font-semibold text-[#047857] transition-colors whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateCandidateStatus(
                          cand.id,
                          'paused',
                          'Session Paused',
                          'critical',
                          'Exam timer paused by proctor for live station verification.'
                        )
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#CBD5E1] bg-white hover:bg-[#FEF2F2] hover:border-[#FECACA] hover:text-[#B91C1C] text-xs font-semibold text-[#475569] transition-colors whitespace-nowrap"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  )}

                  {(cand.status === 'flagged' || cand.status === 'attention') && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateCandidateStatus(
                          cand.id,
                          'nominal',
                          'Flag Cleared',
                          'info',
                          'Integrity flag reviewed and cleared by proctor.'
                        )
                      }
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      title="Clear integrity flag"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Integrity Event Log Table */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#142B4D]" />
            <h2 className="text-base font-bold text-[#142B4D]">
              Integrity & Intervention Audit Log
            </h2>
          </div>
          <span className="text-xs font-mono tabular-nums text-[#475569]">
            {events.length} recorded events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1]">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                  Timestamp
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                  Candidate
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                  Event
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                  Observation Detail
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#F1F5F9]/50 transition-colors">
                  <td className="py-3 px-4 text-xs font-mono tabular-nums text-[#475569] whitespace-nowrap">
                    {evt.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {evt.candidateName}
                    </span>
                    <span className="ml-2 text-xs font-mono text-[#64748B]">
                      {evt.studentId}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge
                      variant={
                        evt.severity === 'critical'
                          ? 'flagged'
                          : evt.severity === 'warning'
                          ? 'attention'
                          : 'nominal'
                      }
                      label={evt.eventType}
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-[#475569]">{evt.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Send Proctor Warning Modal */}
      {warningModalCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/45"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#CBD5E1] shadow-[0_20px_25px_-5px_rgba(20,43,77,0.12)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-sm font-bold text-[#142B4D]">
                Dispatch Proctor Notice — {warningModalCandidate.name}
              </h3>
            </div>
            <form onSubmit={handleSendWarning} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                  Message displayed on candidate console
                </label>
                <textarea
                  rows={3}
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  className="w-full p-3 rounded-md border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setWarningModalCandidate(null)}
                  className="px-4 py-2 rounded-md border border-[#CBD5E1] bg-white text-xs font-semibold text-[#142B4D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold"
                >
                  Send Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
