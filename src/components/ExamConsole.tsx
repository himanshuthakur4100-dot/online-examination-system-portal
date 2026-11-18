import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  ChevronLeft,
  Eraser,
  Flag,
  LayoutGrid,
  ShieldCheck,
  X,
} from 'lucide-react';
import { EXAM_QUESTIONS, EXAM_SECTIONS } from '../data/mockAssessments';
import { Assessment, ExamSubmissionResult, QuestionTileState } from '../types/assessment';
import { CountdownTimer, formatDuration } from './CountdownTimer';
import { RaftQuorumDiagram } from './ExamDiagrams';
import { SafeImage } from './SafeImage';

interface ExamConsoleProps {
  assessment: Assessment;
  onExitToAdmin: () => void;
  onSubmitExam: (result: ExamSubmissionResult) => void;
}

export const ExamConsole: React.FC<ExamConsoleProps> = ({
  assessment,
  onExitToAdmin,
  onSubmitExam,
}) => {
  const totalDurationSeconds = assessment.durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalDurationSeconds);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: 'C',
    2: 'A',
  });
  const [flaggedIds, setFlaggedIds] = useState<number[]>([3]);
  const [visitedIds, setVisitedIds] = useState<number[]>([1, 2, 3, 4]);
  const [tabSwitches, setTabSwitches] = useState<number>(0);

  // Responsive drawer & utility modals
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [scratchpadText, setScratchpadText] = useState(
    'M/M/1: T(p) = T0 * (1 - p0)/(1 - p)\nRaft quorum for N=5 requires 3 nodes.'
  );

  // Double confirmation modal state
  const [finishModalStep, setFinishModalStep] = useState<0 | 1 | 2>(0);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const currentQuestion = EXAM_QUESTIONS[currentIndex];

  // Countdown tick
  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Auto-submit if timer hits zero
  useEffect(() => {
    if (remainingSeconds === 0) {
      finalizeSubmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds]);

  // Real browser visibility integrity detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Keyboard shortcuts (1-4 / A-D, ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (finishModalStep > 0 || referenceOpen) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) return;

      const key = e.key.toUpperCase();
      const optionMap: Record<string, string> = {
        '1': 'A',
        '2': 'B',
        '3': 'C',
        '4': 'D',
        A: 'A',
        B: 'B',
        C: 'C',
        D: 'D',
      };

      if (optionMap[key]) {
        selectOption(currentQuestion.id, optionMap[key]);
      } else if (e.key === 'ArrowRight') {
        goToIndex(Math.min(EXAM_QUESTIONS.length - 1, currentIndex + 1));
      } else if (e.key === 'ArrowLeft') {
        goToIndex(Math.max(0, currentIndex - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentQuestion.id, finishModalStep, referenceOpen]);

  const markVisited = (questionId: number) => {
    setVisitedIds((prev) => (prev.includes(questionId) ? prev : [...prev, questionId]));
  };

  const goToIndex = (index: number) => {
    const q = EXAM_QUESTIONS[index];
    if (q) {
      markVisited(q.id);
      setCurrentIndex(index);
      setMobilePaletteOpen(false);
    }
  };

  const selectOption = (questionId: number, optionId: string) => {
    markVisited(questionId);
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const clearResponse = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const handleMarkAndNext = () => {
    if (!flaggedIds.includes(currentQuestion.id)) {
      setFlaggedIds((prev) => [...prev, currentQuestion.id]);
    }
    if (currentIndex < EXAM_QUESTIONS.length - 1) {
      goToIndex(currentIndex + 1);
    }
  };

  const handleSaveAndNext = () => {
    if (currentIndex < EXAM_QUESTIONS.length - 1) {
      goToIndex(currentIndex + 1);
    } else {
      setFinishModalStep(1);
    }
  };

  const getTileState = (questionId: number): QuestionTileState => {
    const isAnswered = Boolean(answers[questionId]);
    const isFlagged = flaggedIds.includes(questionId);
    const isVisited = visitedIds.includes(questionId);

    if (isAnswered && isFlagged) return 'answered_review';
    if (isFlagged) return 'review';
    if (isAnswered) return 'answered';
    if (isVisited) return 'visited';
    return 'unvisited';
  };

  const counts = useMemo(() => {
    let answered = 0;
    let reviewOnly = 0;
    let answeredReview = 0;
    let unvisited = 0;

    for (const q of EXAM_QUESTIONS) {
      const state = getTileState(q.id);
      if (state === 'answered') answered++;
      else if (state === 'review') reviewOnly++;
      else if (state === 'answered_review') answeredReview++;
      else unvisited++;
    }
    return {
      answered,
      reviewTotal: reviewOnly + answeredReview,
      answeredTotal: answered + answeredReview,
      unansweredTotal: EXAM_QUESTIONS.length - (answered + answeredReview),
      unvisited,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, flaggedIds, visitedIds]);

  const finalizeSubmission = () => {
    let correctCount = 0;
    let earnedPoints = 0;
    let totalPoints = 0;

    for (const q of EXAM_QUESTIONS) {
      totalPoints += q.points;
      if (answers[q.id] === q.correctOptionId) {
        correctCount++;
        earnedPoints += q.points;
      }
    }

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const result: ExamSubmissionResult = {
      assessmentTitle: assessment.title,
      assessmentCode: assessment.code,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' PST',
      timeSpentSeconds: Math.max(15, totalDurationSeconds - remainingSeconds),
      totalDurationSeconds,
      answers,
      flaggedIds,
      tabSwitchesDetected: tabSwitches,
      totalQuestions: EXAM_QUESTIONS.length,
      correctCount,
      earnedPoints,
      totalPoints,
      percentage,
      passed: percentage >= assessment.passingScore,
    };
    onSubmitExam(result);
  };

  const jumpToSection = (sectionId: 'quant' | 'systems' | 'ethics') => {
    const idx = EXAM_QUESTIONS.findIndex((q) => q.sectionId === sectionId);
    if (idx !== -1) {
      goToIndex(idx);
    }
  };

  const isFlaggedCurrent = flaggedIds.includes(currentQuestion.id);

  // Reusable Palette Panel Body (used in fixed desktop sidebar and mobile/tablet drawer)
  const renderPaletteContent = () => (
    <div className="flex flex-col h-full">
      {/* Proctor Glass Camera Widget */}
      <div className="p-4 border-b border-[#E2E8F0]">
        <div className="relative rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#0F172A] aspect-[4/3]">
          <SafeImage
            src="/src/assets/images/proctor_candidate_one_1795016241935.jpg"
            alt="Live candidate webcam feed"
            className="w-full h-full object-cover"
            fallbackLabel="Webcam Feed"
          />
          <div className="absolute inset-x-2 bottom-2 px-2.5 py-1.5 rounded-md backdrop-blur-md bg-white/85 border border-[#E2E8F0] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Camera className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span className="text-[11px] font-semibold text-[#0F172A] truncate">
                Recording Active
              </span>
            </div>
            <span className="text-[11px] font-mono tabular-nums text-[#475569] shrink-0">
              {tabSwitches === 0 ? 'Focus OK' : `${tabSwitches} Focus Shift`}
            </span>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#475569]">
          <span className="font-medium text-[#0F172A]">Clara Lindqvist</span>
          <span className="font-mono tabular-nums">ID: NB-2026-4418</span>
        </div>
      </div>

      {/* Status Summary Counts */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#059669] shrink-0" />
            <span className="text-[#475569]">Answered:</span>
            <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
              {counts.answeredTotal}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#D97706] shrink-0" />
            <span className="text-[#475569]">Flagged:</span>
            <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
              {counts.reviewTotal}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1] shrink-0" />
            <span className="text-[#475569]">Remaining:</span>
            <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
              {counts.unansweredTotal}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative w-3 h-3 rounded-sm bg-[#D97706] shrink-0">
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#059669]" />
            </span>
            <span className="text-[#475569]">Ans + Flag</span>
          </div>
        </div>
      </div>

      {/* Question Grid Palette */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
            Question Palette
          </h3>
          <span className="text-xs font-mono tabular-nums text-[#475569]">
            {currentIndex + 1} / {EXAM_QUESTIONS.length}
          </span>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-2">
          {EXAM_QUESTIONS.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const tileState = getTileState(q.id);

            let tileClasses =
              'bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] hover:border-[#94A3B8] hover:text-[#142B4D]';
            if (isCurrent) {
              tileClasses =
                'border-2 border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold';
            } else if (tileState === 'answered') {
              tileClasses = 'bg-[#059669] text-[#FFFFFF] border border-[#059669]';
            } else if (tileState === 'review' || tileState === 'answered_review') {
              tileClasses = 'bg-[#D97706] text-[#FFFFFF] border border-[#D97706]';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => goToIndex(idx)}
                aria-label={`Question ${q.id}, ${tileState}`}
                className={`relative w-10 h-10 rounded-md flex items-center justify-center text-xs font-semibold font-mono tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] ${tileClasses}`}
              >
                {q.id}
                {tileState === 'answered_review' && (
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#059669] ring-2 ring-white"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Destructive Submit Action */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#FFFFFF]">
        <button
          type="button"
          onClick={() => {
            setConfirmChecked(false);
            setFinishModalStep(1);
          }}
          className="w-full py-2.5 px-4 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2 whitespace-nowrap"
        >
          Finish & Submit Exam
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Master Exam Chrome Header */}
      <header className="sticky top-0 z-30 bg-[#142B4D] text-white border-b border-[#001635] shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Return + Exam Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onExitToAdmin}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#DBE1FF] hover:text-white hover:bg-[#1E3A63] transition-colors whitespace-nowrap shrink-0"
              title="Return to Admin Workspace"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Workspace</span>
            </button>
            <div className="h-5 w-px bg-white/15 hidden sm:block" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[#4CD7F6] shrink-0">
                  {assessment.code}
                </span>
                <h1 className="text-sm md:text-base font-semibold text-white truncate">
                  {assessment.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Center: Section Switcher (Desktop) */}
          <nav
            aria-label="Exam sections"
            className="hidden lg:flex items-center gap-1 bg-[#001635]/60 p-1 rounded-md border border-white/10"
          >
            {EXAM_SECTIONS.map((sec) => {
              const isActive = currentQuestion.sectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => jumpToSection(sec.id)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'text-[#B4C5FF] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sec.shortTitle}
                </button>
              );
            })}
          </nav>

          {/* Right: Formula Sheet + Countdown Timer */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setReferenceOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#4CD7F6]" />
              <span>Formula Sheet</span>
            </button>

            <CountdownTimer
              remainingSeconds={remainingSeconds}
              totalSeconds={totalDurationSeconds}
              compact={false}
              onSimulateTime={(sec) => setRemainingSeconds(sec)}
            />
          </div>
        </div>
      </header>

      {/* Main Split Body */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex relative">
        {/* Primary Question Stage (8-9 columns equivalent) */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Section Breadcrumb & Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="font-semibold text-[#142B4D]">
                  {currentQuestion.sectionTitle}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  Question {currentQuestion.id} of {EXAM_QUESTIONS.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {currentQuestion.points} pts
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReferenceOpen(true)}
                  className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#CBD5E1] bg-white text-xs font-semibold text-[#142B4D]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Formulas</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors whitespace-nowrap ${
                    isFlaggedCurrent
                      ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]'
                      : 'bg-white border-[#CBD5E1] text-[#475569] hover:text-[#142B4D] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isFlaggedCurrent ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>
            </div>

            {/* Question Surface Card */}
            <section
              aria-labelledby="question-stem"
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(20,43,77,0.05),0_1px_2px_-1px_rgba(20,43,77,0.03)] p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E2E8F0]">
                <h2 className="text-base font-bold text-[#142B4D] font-mono tabular-nums">
                  Item {String(currentQuestion.id).padStart(2, '0')}
                </h2>
                <span className="text-xs font-medium text-[#475569]">
                  Single Choice · {currentQuestion.difficulty}
                </span>
              </div>

              {/* Exam Content Body (body-lg 18px per Academic Precision spec) */}
              <p
                id="question-stem"
                className="text-[18px] leading-[28px] text-[#0F172A] font-normal max-w-[70ch]"
              >
                {currentQuestion.stem}
              </p>

              {/* Optional Formula Display */}
              {currentQuestion.formula && (
                <div className="my-5 px-4 py-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-sm text-[#142B4D] overflow-x-auto">
                  {currentQuestion.formula}
                </div>
              )}

              {/* Optional Technical Diagram */}
              {currentQuestion.hasDiagram === 'raft_quorum' && <RaftQuorumDiagram />}

              {/* MCQ Option Cards */}
              <div className="mt-7 space-y-3" role="radiogroup" aria-label="Answer options">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => selectOption(currentQuestion.id, opt.id)}
                      className={`w-full text-left p-4 rounded-lg border-[1.5px] transition-all duration-150 flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-1 ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#EFF6FF]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {/* 20px Custom Radio Glyph */}
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-[#2563EB] border-[#2563EB]'
                            : 'bg-white border-[#CBD5E1]'
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </span>

                      <div className="flex-1 min-w-0 flex items-baseline gap-3">
                        <span
                          className={`font-mono text-sm font-bold shrink-0 ${
                            isSelected ? 'text-[#2563EB]' : 'text-[#475569]'
                          }`}
                        >
                          {opt.label}.
                        </span>
                        <span className="text-[15px] leading-[24px] text-[#0F172A]">
                          {opt.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Bar inside Stage Footer */}
              <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => goToIndex(currentIndex - 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#CBD5E1] bg-white text-sm font-semibold text-[#142B4D] hover:bg-[#F8FAFC] disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    disabled={!answers[currentQuestion.id]}
                    onClick={clearResponse}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#CBD5E1] bg-white text-sm font-medium text-[#475569] hover:text-[#142B4D] hover:bg-[#F8FAFC] disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap"
                  >
                    <Eraser className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear Response</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleMarkAndNext}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#FDE68A] bg-[#FFFBEB] text-sm font-semibold text-[#B45309] hover:bg-[#FEF3C7] transition-colors whitespace-nowrap"
                  >
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline">Mark & Next</span>
                    <span className="sm:hidden">Flag</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAndNext}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 whitespace-nowrap"
                  >
                    <span>
                      {currentIndex === EXAM_QUESTIONS.length - 1 ? 'Review & Submit' : 'Save & Next'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Keyboard Shortcut Hint */}
            <p className="mt-3 text-xs text-[#64748B] flex items-center justify-between">
              <span>Keyboard shortcuts: Press A–D or 1–4 to select an option, Arrow keys to navigate.</span>
              <span className="hidden sm:inline font-mono">Autosaved locally</span>
            </p>
          </div>
        </main>

        {/* Fixed 320px Right-Hand Panel on Desktop (lg+) */}
        <aside
          aria-label="Question palette and proctoring telemetry"
          className="hidden lg:flex lg:flex-col w-[320px] shrink-0 bg-white border-l border-[#E2E8F0] sticky top-16 h-[calc(100vh-4rem)]"
        >
          {renderPaletteContent()}
        </aside>
      </div>

      {/* Compact Mobile/Tablet Bottom Status Bar (strictly <= 15% mobile viewport height) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-[#CBD5E1] px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-4px_6px_-1px_rgba(20,43,77,0.06)]">
        <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
          <span className="font-semibold text-[#047857]">{counts.answeredTotal} Ans</span>
          <span className="text-[#CBD5E1]">|</span>
          <span className="font-semibold text-[#B45309]">{counts.reviewTotal} Flag</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobilePaletteOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-semibold text-[#142B4D]"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Palette</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmChecked(false);
              setFinishModalStep(1);
            }}
            className="px-3 py-2 rounded-md bg-[#DC2626] text-white text-xs font-semibold whitespace-nowrap"
          >
            Finish
          </button>
        </div>
      </div>

      {/* Tablet/Mobile Slide-over Palette Drawer */}
      {mobilePaletteOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#0F172A]/40"
            onClick={() => setMobilePaletteOpen(false)}
          />
          <div className="relative w-full max-w-[340px] bg-white h-full shadow-xl flex flex-col z-10">
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-sm font-bold text-[#142B4D]">Question Navigator</span>
              <button
                type="button"
                onClick={() => setMobilePaletteOpen(false)}
                className="p-1.5 rounded-md text-[#475569] hover:bg-[#F1F5F9]"
                aria-label="Close palette"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{renderPaletteContent()}</div>
          </div>
        </div>
      )}

      {/* Formula Sheet & Scratchpad Slide-Over Drawer */}
      {referenceOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#0F172A]/35"
            onClick={() => setReferenceOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full border-l border-[#E2E8F0] shadow-xl flex flex-col z-10">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-[#142B4D]">
                  Approved Reference & Scratchpad
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setReferenceOpen(false)}
                className="p-1.5 rounded-md text-[#475569] hover:bg-[#E2E8F0]/60"
                aria-label="Close reference sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569] mb-2.5">
                  Core Mathematical & Distributed Identities
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="font-semibold text-[#142B4D] mb-1">M/M/1 Queue Scaling</div>
                    <code className="font-mono text-[#0F172A]">
                      T(ρ) ≈ T₀ · (1 - ρ₀) / (1 - ρ)
                    </code>
                  </div>
                  <div className="p-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="font-semibold text-[#142B4D] mb-1">Quorum Intersection</div>
                    <code className="font-mono text-[#0F172A]">R + W &gt; N</code>
                  </div>
                  <div className="p-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="font-semibold text-[#142B4D] mb-1">
                      Positive Predictive Value (Bayes)
                    </div>
                    <code className="font-mono text-[#0F172A]">
                      PPV = TP / (TP + FP)
                    </code>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="exam-scratchpad"
                  className="block text-xs font-semibold uppercase tracking-[0.05em] text-[#475569] mb-2"
                >
                  Candidate Scratchpad (Non-Graded)
                </label>
                <textarea
                  id="exam-scratchpad"
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  rows={8}
                  className="w-full rounded-md border border-[#CBD5E1] p-3 text-sm font-mono text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  placeholder="Type intermediate calculations here..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Double Confirmation Finish Exam Modal */}
      {finishModalStep > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="finish-modal-title"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#CBD5E1] shadow-[0_20px_25px_-5px_rgba(20,43,77,0.12),0_8px_10px_-6px_rgba(20,43,77,0.08)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                {finishModalStep === 1 ? (
                  <ShieldCheck className="w-5 h-5 text-[#142B4D]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                )}
                <h2 id="finish-modal-title" className="text-base font-bold text-[#142B4D]">
                  {finishModalStep === 1
                    ? 'Review Submission Summary (Step 1 of 2)'
                    : 'Final Confirmation Required (Step 2 of 2)'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFinishModalStep(0)}
                className="p-1.5 rounded-md text-[#475569] hover:bg-[#E2E8F0]/60"
                aria-label="Cancel submission"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {finishModalStep === 1 ? (
              <div className="p-6 space-y-5">
                <p className="text-sm text-[#475569]">
                  Please verify your response counts across all sections before proceeding to final submission.
                </p>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5]">
                    <div className="text-2xl font-bold font-mono tabular-nums text-[#047857]">
                      {counts.answeredTotal}
                    </div>
                    <div className="text-xs font-semibold text-[#047857] mt-0.5">Answered</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB]">
                    <div className="text-2xl font-bold font-mono tabular-nums text-[#B45309]">
                      {counts.reviewTotal}
                    </div>
                    <div className="text-xs font-semibold text-[#B45309] mt-0.5">Flagged</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="text-2xl font-bold font-mono tabular-nums text-[#475569]">
                      {counts.unansweredTotal}
                    </div>
                    <div className="text-xs font-semibold text-[#475569] mt-0.5">Unanswered</div>
                  </div>
                </div>

                {counts.unansweredTotal > 0 && (
                  <div className="p-3.5 rounded-md border border-[#FDE68A] bg-[#FFFBEB] text-xs text-[#B45309] flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      You still have <strong className="font-mono">{counts.unansweredTotal}</strong>{' '}
                      unanswered item(s). Unanswered items receive zero points upon grading.
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFinishModalStep(0)}
                    className="px-4 py-2 rounded-md border border-[#CBD5E1] bg-white text-sm font-semibold text-[#142B4D] hover:bg-[#F8FAFC]"
                  >
                    Return to Exam
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinishModalStep(2)}
                    className="px-4 py-2 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold"
                  >
                    Proceed to Final Step
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="p-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">
                  Once submitted, your answers are locked and transmitted for immediate scoring. You cannot re-enter this attempt.
                </div>

                <div className="text-xs text-[#475569] flex items-center justify-between border-y border-[#E2E8F0] py-2.5">
                  <span>Time Remaining at Submission:</span>
                  <span className="font-mono tabular-nums font-bold text-[#142B4D]">
                    {formatDuration(remainingSeconds)}
                  </span>
                </div>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span className="text-sm text-[#0F172A]">
                    I confirm these responses represent my own independent work and I am ready to submit my exam for final grading.
                  </span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFinishModalStep(1)}
                    className="px-4 py-2 rounded-md border border-[#CBD5E1] bg-white text-sm font-semibold text-[#142B4D] hover:bg-[#F8FAFC]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!confirmChecked}
                    onClick={finalizeSubmission}
                    className="px-5 py-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-45 disabled:pointer-events-none text-white text-sm font-semibold transition-colors"
                  >
                    Confirm & Submit Exam
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
