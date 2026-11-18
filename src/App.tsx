/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  Eye,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Play,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalyticsReport } from './components/AnalyticsReport';
import { ExamConsole } from './components/ExamConsole';
import { ProctoringMonitor } from './components/ProctoringMonitor';
import { SafeImage } from './components/SafeImage';
import {
  ADMIN_PROFILE,
  INITIAL_ASSESSMENTS,
  INITIAL_INTEGRITY_EVENTS,
  INITIAL_PROCTOR_CANDIDATES,
} from './data/mockAssessments';
import {
  AppView,
  Assessment,
  ExamSubmissionResult,
  IntegrityEvent,
  ProctorCandidate,
  ProctorStatus,
} from './types/assessment';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('admin');
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment>(INITIAL_ASSESSMENTS[0]);
  const [proctorCandidates, setProctorCandidates] = useState<ProctorCandidate[]>(
    INITIAL_PROCTOR_CANDIDATES
  );
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>(
    INITIAL_INTEGRITY_EVENTS
  );
  const [submissionResult, setSubmissionResult] = useState<ExamSubmissionResult | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeFlagsCount = proctorCandidates.filter(
    (c) => c.status === 'flagged' || c.status === 'attention'
  ).length;

  const handleLaunchExam = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setActiveView('exam');
    setMobileNavOpen(false);
  };

  const handleCreateAssessment = (newAssessment: Assessment) => {
    setAssessments((prev) => [newAssessment, ...prev]);
  };

  const handleUpdateCandidateStatus = (
    candidateId: string,
    newStatus: ProctorStatus,
    eventType: IntegrityEvent['eventType'],
    severity: IntegrityEvent['severity'],
    detail: string
  ) => {
    const target = proctorCandidates.find((c) => c.id === candidateId);
    if (!target) return;

    setProctorCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );

    const newEvent: IntegrityEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' PST',
      candidateId: target.id,
      candidateName: target.name,
      studentId: target.studentId,
      eventType,
      severity,
      detail,
    };

    setIntegrityEvents((prev) => [newEvent, ...prev]);
  };

  const handleExamSubmitted = (result: ExamSubmissionResult) => {
    setSubmissionResult(result);
    setActiveView('results');
  };

  // Full-bleed Live Exam Console renders outside the admin sidebar chrome
  if (activeView === 'exam') {
    return (
      <ExamConsole
        assessment={selectedAssessment}
        onExitToAdmin={() => setActiveView('admin')}
        onSubmitExam={handleExamSubmitted}
      />
    );
  }

  const navItems: Array<{
    id: AppView;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'admin', label: 'Assessments', Icon: LayoutDashboard },
    {
      id: 'proctoring',
      label: 'Live Proctoring',
      Icon: Eye,
      badge: activeFlagsCount > 0 ? activeFlagsCount : undefined,
    },
    { id: 'results', label: 'Score Reports', Icon: BarChart3 },
    { id: 'exam', label: 'Exam Console', Icon: ShieldCheck },
  ];

  const breadcrumbLabel =
    activeView === 'admin'
      ? 'Assessments Overview'
      : activeView === 'proctoring'
      ? 'Live Proctoring Monitor'
      : 'Analytics & Score Report';

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#142B4D] text-white">
      {/* Brand Mark */}
      <div className="px-5 h-16 flex items-center gap-3 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-md bg-[#2563EB] flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
          Meridian Assess
        </span>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Administrative navigation" className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.Icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'exam') {
                  handleLaunchExam(selectedAssessment);
                } else {
                  setActiveView(item.id);
                  setMobileNavOpen(false);
                }
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#DBE1FF] hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </span>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono tabular-nums font-bold bg-[#D97706] text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Institution & User Profile Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <SafeImage
            src={ADMIN_PROFILE.avatarUrl}
            alt={ADMIN_PROFILE.name}
            className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
            fallbackLabel="EV"
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {ADMIN_PROFILE.name}
            </div>
            <div className="text-[11px] text-[#B4C5FF] truncate">
              {ADMIN_PROFILE.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A]">
      {/* Fixed 260px Administrative Sidebar (Desktop lg+) */}
      <aside className="hidden lg:block w-[260px] shrink-0 sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile / Tablet Slide-Over Sidebar */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#0F172A]/45"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-[260px] max-w-[80vw] h-full z-10 shadow-xl">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-md text-[#DBE1FF] hover:text-white"
              aria-label="Close navigation menu"
            >
              <X className="w-4 h-4" />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Workspace Header (Breadcrumbs + 1 Primary Action) */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E2E8F0] px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-md border border-[#CBD5E1] text-[#142B4D] hover:bg-[#F8FAFC]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-[#64748B] hidden sm:inline whitespace-nowrap">
                {ADMIN_PROFILE.institution}
              </span>
              <span className="text-[#CBD5E1] hidden sm:inline" aria-hidden="true">
                /
              </span>
              <span className="font-semibold text-[#142B4D] truncate">
                {breadcrumbLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleLaunchExam(selectedAssessment)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Launch Live Exam</span>
          </button>
        </header>

        {/* Fluid 12-Column Content Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {activeView === 'admin' && (
            <AdminDashboard
              assessments={assessments}
              activeFlagsCount={activeFlagsCount}
              onLaunchExam={handleLaunchExam}
              onOpenProctoring={() => setActiveView('proctoring')}
              onOpenResults={() => setActiveView('results')}
              onCreateAssessment={handleCreateAssessment}
            />
          )}

          {activeView === 'proctoring' && (
            <ProctoringMonitor
              candidates={proctorCandidates}
              events={integrityEvents}
              onUpdateCandidateStatus={handleUpdateCandidateStatus}
            />
          )}

          {activeView === 'results' && (
            <AnalyticsReport
              assessment={selectedAssessment}
              submissionResult={submissionResult}
              onRetakeExam={() => handleLaunchExam(selectedAssessment)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

