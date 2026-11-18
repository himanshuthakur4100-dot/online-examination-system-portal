import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Eye,
  Play,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { Assessment, AssessmentStatus } from '../types/assessment';
import { StatusBadge } from './StatusBadge';

interface AdminDashboardProps {
  assessments: Assessment[];
  activeFlagsCount: number;
  onLaunchExam: (assessment: Assessment) => void;
  onOpenProctoring: () => void;
  onOpenResults: () => void;
  onCreateAssessment: (newAssessment: Assessment) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  assessments,
  activeFlagsCount,
  onLaunchExam,
  onOpenProctoring,
  onOpenResults,
  onCreateAssessment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AssessmentStatus>('all');
  const [createOpen, setCreateOpen] = useState(false);

  // Modal form fields
  const [code, setCode] = useState('DAT-410');
  const [title, setTitle] = useState('Statistical Inference & Experimental Design');
  const [department, setDepartment] = useState('Data Science');
  const [cohort, setCohort] = useState('Fall 2026 · Section 01');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [enrolledCandidates, setEnrolledCandidates] = useState(72);

  const filteredAssessments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return assessments.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.cohort.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [assessments, searchQuery, statusFilter]);

  const kpis = useMemo(() => {
    const totalActive = assessments.reduce((sum, a) => sum + a.activeCandidates, 0);
    const liveCount = assessments.filter((a) => a.status === 'live').length;
    const completedWithScores = assessments.filter((a) => a.medianScore !== null);
    const avgMedian =
      completedWithScores.length > 0
        ? (
            completedWithScores.reduce((sum, a) => sum + (a.medianScore ?? 0), 0) /
            completedWithScores.length
          ).toFixed(1)
        : '—';

    return { totalActive, liveCount, avgMedian };
  }, [assessments]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const newItem: Assessment = {
      id: `asm-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      department: department.trim() || 'General Studies',
      cohort: cohort.trim() || 'Fall 2026',
      questionCount: 15,
      durationMinutes: Number(durationMinutes) || 45,
      scheduledDate: 'Nov 21, 2026 · 10:00 PST',
      activeCandidates: 0,
      enrolledCandidates: Number(enrolledCandidates) || 40,
      completionRate: null,
      medianScore: null,
      passingScore: 70,
      status: 'scheduled',
      proctoringEnabled: true,
    };
    onCreateAssessment(newItem);
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Primary Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#142B4D]">
            Assessment Administration
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Monitor active cohorts, launch live examination consoles, and review integrity telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onLaunchExam(assessments[0])}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-sm font-semibold text-[#142B4D] transition-colors whitespace-nowrap"
          >
            <Play className="w-4 h-4 text-[#2563EB]" />
            <span>Preview Exam Console</span>
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Assessment</span>
          </button>
        </div>
      </div>

      {/* Flat 4-Column KPI Strip (Single elevation, clean hairlines, tabular-nums) */}
      <section
        aria-label="Key institutional metrics"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05),0_1px_2px_-1px_rgba(20,43,77,0.03)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]"
      >
        <div className="p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
            Active Examinees
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-[#142B4D]">
              {kpis.totalActive}
            </span>
            <span className="text-xs font-medium text-[#047857]">
              {kpis.liveCount} live sessions
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
            Median Cohort Score
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-[#142B4D]">
              {kpis.avgMedian}%
            </span>
            <span className="text-xs font-medium text-[#475569]">Cutoff 70.0%</span>
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
            Proctoring Uptime
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-[#142B4D]">
              99.94%
            </span>
            <span className="text-xs font-medium text-[#0284C7]">Telemetry synced</span>
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
            Open Integrity Flags
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span
              className={`text-3xl font-bold font-mono tabular-nums ${
                activeFlagsCount > 0 ? 'text-[#B45309]' : 'text-[#047857]'
              }`}
            >
              {activeFlagsCount}
            </span>
            <button
              type="button"
              onClick={onOpenProctoring}
              className="text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
            >
              Review feed →
            </button>
          </div>
        </div>
      </section>

      {/* Assessments Directory Table */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05),0_1px_2px_-1px_rgba(20,43,77,0.03)] overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg self-start">
            {(
              [
                { id: 'all', label: 'All Exams' },
                { id: 'live', label: 'Live Now' },
                { id: 'scheduled', label: 'Scheduled' },
                { id: 'completed', label: 'Completed' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, title, department..."
              className="w-full pl-9 pr-3 py-2 rounded-md border border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Structured Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1]">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                  Assessment
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                  Schedule
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569] text-right">
                  Examinees
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569] text-right">
                  Median
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <p className="text-sm font-semibold text-[#142B4D]">
                      No assessments match your current filter.
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                      Clear the search query or schedule a new examination cohort.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F1F5F9]/60 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs font-bold text-[#2563EB]">
                          {item.code}
                        </span>
                        <span className="text-sm font-semibold text-[#0F172A]">
                          {item.title}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-[#475569] flex flex-wrap items-center gap-1.5">
                        <span>{item.department}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.cohort}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {item.questionCount} Qs / {item.durationMinutes}m
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono tabular-nums text-[#475569] whitespace-nowrap">
                      {item.scheduledDate}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-sm text-[#0F172A] whitespace-nowrap">
                      {item.status === 'live' ? (
                        <span>
                          <strong className="font-semibold">{item.activeCandidates}</strong>
                          <span className="text-[#64748B]"> / {item.enrolledCandidates}</span>
                        </span>
                      ) : (
                        <span className="text-[#475569]">{item.enrolledCandidates}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-sm font-semibold text-[#142B4D] whitespace-nowrap">
                      {item.medianScore !== null ? `${item.medianScore.toFixed(1)}%` : '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge variant={item.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onLaunchExam(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#CBD5E1] bg-white hover:bg-[#EFF6FF] hover:border-[#2563EB] text-xs font-semibold text-[#142B4D] hover:text-[#2563EB] transition-colors"
                        >
                          <Play className="w-3 h-3" />
                          <span>Console</span>
                        </button>
                        {item.status === 'live' && (
                          <button
                            type="button"
                            onClick={onOpenProctoring}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#475569] hover:text-[#142B4D] transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Proctor</span>
                          </button>
                        )}
                        {item.status === 'completed' && (
                          <button
                            type="button"
                            onClick={onOpenResults}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#475569] hover:text-[#142B4D] transition-colors"
                          >
                            <BarChart3 className="w-3 h-3" />
                            <span>Results</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Schedule Assessment Modal */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/45"
          role="dialog"
          aria-modal="true"
          aria-labelledby="schedule-modal-title"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#CBD5E1] shadow-[0_20px_25px_-5px_rgba(20,43,77,0.12)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <h2 id="schedule-modal-title" className="text-base font-bold text-[#142B4D]">
                Schedule New Assessment
              </h2>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="p-1.5 rounded-md text-[#475569] hover:bg-[#E2E8F0]/60"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#CBD5E1] text-sm font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  Assessment Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Cohort
                  </label>
                  <input
                    type="text"
                    value={cohort}
                    onChange={(e) => setCohort(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={240}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md border border-[#CBD5E1] text-sm font-mono tabular-nums focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Enrolled
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={enrolledCandidates}
                    onChange={(e) => setEnrolledCandidates(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md border border-[#CBD5E1] text-sm font-mono tabular-nums focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-md border border-[#CBD5E1] bg-white text-sm font-semibold text-[#142B4D] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
