import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Play,
  XCircle,
} from 'lucide-react';
import {
  COHORT_DISTRIBUTION,
  EXAM_QUESTIONS,
  EXAM_SECTIONS,
} from '../data/mockAssessments';
import { Assessment, ExamSubmissionResult } from '../types/assessment';
import { formatDuration } from './CountdownTimer';
import { StatusBadge } from './StatusBadge';

interface AnalyticsReportProps {
  assessment: Assessment;
  submissionResult: ExamSubmissionResult | null;
  onRetakeExam: () => void;
}

export const AnalyticsReport: React.FC<AnalyticsReportProps> = ({
  assessment,
  submissionResult,
  onRetakeExam,
}) => {
  const [activeTab, setActiveTab] = useState<'attempt' | 'cohort'>(
    submissionResult ? 'attempt' : 'cohort'
  );
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');

  const sectionBreakdown = useMemo(() => {
    if (!submissionResult) return [];
    return EXAM_SECTIONS.map((sec) => {
      const qs = EXAM_QUESTIONS.filter((q) => q.sectionId === sec.id);
      const earned = qs.reduce(
        (sum, q) =>
          submissionResult.answers[q.id] === q.correctOptionId ? sum + q.points : sum,
        0
      );
      const total = qs.reduce((sum, q) => sum + q.points, 0);
      const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
      return { ...sec, earned, total, pct, count: qs.length };
    });
  }, [submissionResult]);

  const filteredReviewQuestions = useMemo(() => {
    if (!submissionResult) return [];
    return EXAM_QUESTIONS.filter((q) => {
      const userAns = submissionResult.answers[q.id];
      if (reviewFilter === 'incorrect') return userAns !== q.correctOptionId;
      if (reviewFilter === 'flagged') return submissionResult.flaggedIds.includes(q.id);
      return true;
    });
  }, [submissionResult, reviewFilter]);

  const maxDistCount = Math.max(...COHORT_DISTRIBUTION.map((d) => d.count));

  return (
    <div className="space-y-6">
      {/* Header & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#142B4D]">
            Assessment Analytics & Score Report
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            {assessment.code} · {assessment.title}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#E2E8F0]/70 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('attempt')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'attempt'
                  ? 'bg-white text-[#142B4D] shadow-xs'
                  : 'text-[#475569] hover:text-[#142B4D]'
              }`}
            >
              Candidate Score Report
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cohort')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'cohort'
                  ? 'bg-white text-[#142B4D] shadow-xs'
                  : 'text-[#475569] hover:text-[#142B4D]'
              }`}
            >
              Cohort Psychometrics
            </button>
          </div>

          <button
            type="button"
            onClick={onRetakeExam}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{submissionResult ? 'Retake Exam' : 'Launch Exam'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'attempt' ? (
        submissionResult ? (
          <div className="space-y-6">
            {/* Attempt Summary Strip */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]">
              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
                  Final Score
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-3xl font-bold font-mono tabular-nums text-[#142B4D]">
                    {submissionResult.percentage}%
                  </span>
                  <StatusBadge variant={submissionResult.passed ? 'passed' : 'failed'} />
                </div>
                <div className="mt-1 text-xs font-mono tabular-nums text-[#475569]">
                  {submissionResult.earnedPoints} / {submissionResult.totalPoints} pts (Passing{' '}
                  {assessment.passingScore}%)
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
                  Item Accuracy
                </div>
                <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-[#142B4D]">
                  {submissionResult.correctCount} / {submissionResult.totalQuestions}
                </div>
                <div className="mt-1 text-xs text-[#475569]">
                  Verified against master key
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
                  Elapsed Duration
                </div>
                <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-[#142B4D]">
                  {formatDuration(submissionResult.timeSpentSeconds)}
                </div>
                <div className="mt-1 text-xs font-mono text-[#475569]">
                  Submitted at {submissionResult.submittedAt}
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
                  Session Integrity
                </div>
                <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-[#142B4D]">
                  {submissionResult.tabSwitchesDetected}
                </div>
                <div className="mt-1 text-xs text-[#475569]">
                  Browser focus shifts logged
                </div>
              </div>
            </section>

            {/* Domain Mastery Breakdown */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05)] p-6">
              <h2 className="text-base font-bold text-[#142B4D] mb-4">
                Section Performance Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sectionBreakdown.map((sec) => (
                  <div key={sec.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0F172A]">{sec.title}</span>
                      <span className="font-mono tabular-nums font-bold text-[#142B4D]">
                        {sec.pct}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          sec.pct >= 70 ? 'bg-[#059669]' : 'bg-[#D97706]'
                        }`}
                        style={{ width: `${sec.pct}%` }}
                      />
                    </div>
                    <div className="text-xs font-mono tabular-nums text-[#64748B]">
                      {sec.earned} / {sec.total} pts across {sec.count} items
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Item-by-Item Answer Key Review */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[#142B4D]">
                  Question-by-Question Answer Key Review
                </h2>
                <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
                  {(
                    [
                      { id: 'all', label: 'All Items' },
                      { id: 'incorrect', label: 'Incorrect Only' },
                      { id: 'flagged', label: 'Flagged for Review' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setReviewFilter(t.id)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                        reviewFilter === t.id
                          ? 'bg-white text-[#142B4D] shadow-xs'
                          : 'text-[#475569] hover:text-[#142B4D]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {filteredReviewQuestions.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#475569]">
                    No items match this review filter.
                  </div>
                ) : (
                  filteredReviewQuestions.map((q) => {
                    const userAns = submissionResult.answers[q.id];
                    const isCorrect = userAns === q.correctOptionId;
                    return (
                      <div key={q.id} className="p-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs text-[#475569]">
                            <span className="font-mono font-bold text-[#142B4D]">
                              Item {String(q.id).padStart(2, '0')}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{q.sectionTitle}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{q.points} pts</span>
                          </div>

                          <StatusBadge
                            variant={isCorrect ? 'passed' : 'failed'}
                            label={isCorrect ? 'Correct' : userAns ? 'Incorrect' : 'Unanswered'}
                          />
                        </div>

                        <p className="text-[15px] leading-relaxed text-[#0F172A] font-medium">
                          {q.stem}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                          <div className="p-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                            )}
                            <span className="text-[#475569]">Your Response:</span>
                            <strong className="font-mono text-[#0F172A]">
                              {userAns ? `Option ${userAns}` : 'None'}
                            </strong>
                          </div>

                          <div className="p-3 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                            <span className="text-[#047857]">Keyed Answer:</span>
                            <strong className="font-mono text-[#047857]">
                              Option {q.correctOptionId}
                            </strong>
                          </div>
                        </div>

                        <p className="text-xs leading-relaxed text-[#475569] bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0]">
                          <strong className="text-[#142B4D]">Rationale: </strong>
                          {q.explanation}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-4">
            <h2 className="text-lg font-bold text-[#142B4D]">
              No Completed Attempt Recorded Yet
            </h2>
            <p className="text-sm text-[#475569] max-w-md mx-auto">
              Launch the Live Exam Console and submit your responses to generate a real-time graded score report and item-by-item answer review.
            </p>
            <button
              type="button"
              onClick={onRetakeExam}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold"
            >
              <Play className="w-4 h-4" />
              <span>Start Live Exam</span>
            </button>
          </div>
        )
      ) : (
        /* Cohort Psychometrics View */
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-base font-bold text-[#142B4D]">
                  Cohort Score Distribution (n = 142 Examinees)
                </h2>
                <p className="text-xs text-[#475569] mt-0.5">
                  Institutional passing threshold set at 70% · Mean 78.6% · Standard Deviation 9.4%
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-[#047857] font-semibold">
                79.6% Pass Rate
              </span>
            </div>

            {/* Clean SVG Bar Histogram */}
            <div className="grid grid-cols-6 gap-3 items-end h-52 pt-6 border-b border-[#CBD5E1] pb-2">
              {COHORT_DISTRIBUTION.map((bucket) => {
                const heightPct = Math.round((bucket.count / maxDistCount) * 100);
                const isPassing =
                  bucket.range.startsWith('70') ||
                  bucket.range.startsWith('80') ||
                  bucket.range.startsWith('90');
                return (
                  <div key={bucket.range} className="flex flex-col items-center h-full justify-end">
                    <span className="text-xs font-mono tabular-nums font-bold text-[#142B4D] mb-1.5">
                      {bucket.count}
                    </span>
                    <div
                      className={`w-full max-w-[68px] rounded-t-md transition-all ${
                        isPassing ? 'bg-[#2563EB]' : 'bg-[#94A3B8]'
                      }`}
                      style={{ height: `${Math.max(12, heightPct)}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-6 gap-3 pt-2 text-center">
              {COHORT_DISTRIBUTION.map((bucket) => (
                <div key={bucket.range}>
                  <div className="text-xs font-mono tabular-nums font-semibold text-[#0F172A]">
                    {bucket.range}
                  </div>
                  <div className="text-[11px] text-[#64748B] hidden sm:block">
                    {bucket.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Item Calibration Structured Data Table */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-base font-bold text-[#142B4D]">
                Item Psychometric Calibration Bank
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1]">
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                      Item
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                      Section
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569] text-right">
                      Difficulty (p)
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569] text-right">
                      Discrimination (r_pb)
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#475569]">
                      Calibration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {EXAM_QUESTIONS.slice(0, 8).map((q, idx) => {
                    const pVal = (0.84 - idx * 0.04).toFixed(2);
                    const rPb = (0.48 - (idx % 3) * 0.06).toFixed(2);
                    return (
                      <tr key={q.id} className="hover:bg-[#F1F5F9]/50">
                        <td className="py-3 px-4 text-sm font-semibold text-[#142B4D] font-mono tabular-nums">
                          Q{String(q.id).padStart(2, '0')}
                        </td>
                        <td className="py-3 px-4 text-sm text-[#475569]">
                          {q.sectionTitle}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono tabular-nums text-right text-[#0F172A]">
                          {pVal}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono tabular-nums text-right text-[#047857] font-semibold">
                          +{rPb}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge variant="nominal" label="Retain" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
