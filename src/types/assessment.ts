export type AppView = 'admin' | 'proctoring' | 'exam' | 'results';

export type AssessmentStatus = 'live' | 'scheduled' | 'completed';

export interface Assessment {
  id: string;
  code: string;
  title: string;
  department: string;
  cohort: string;
  questionCount: number;
  durationMinutes: number;
  scheduledDate: string;
  activeCandidates: number;
  enrolledCandidates: number;
  completionRate: number | null;
  medianScore: number | null;
  passingScore: number;
  status: AssessmentStatus;
  proctoringEnabled: boolean;
}

export interface ExamOption {
  id: string;
  label: string;
  text: string;
}

export interface ExamQuestion {
  id: number;
  sectionId: 'quant' | 'systems' | 'ethics';
  sectionTitle: string;
  points: number;
  stem: string;
  formula?: string;
  hasDiagram?: 'raft_quorum' | 'latency_curve';
  options: ExamOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'Core' | 'Analytical' | 'Synthesis';
}

export type QuestionTileState =
  | 'unvisited'
  | 'visited'
  | 'answered'
  | 'review'
  | 'answered_review';

export type ProctorStatus = 'nominal' | 'attention' | 'flagged' | 'paused';

export interface ProctorCandidate {
  id: string;
  name: string;
  studentId: string;
  seatCode: string;
  assessmentCode: string;
  avatarUrl: string;
  status: ProctorStatus;
  progressCurrent: number;
  progressTotal: number;
  remainingSeconds: number;
  tabSwitches: number;
  audioAnomaly: boolean;
  lastHeartbeat: string;
}

export interface IntegrityEvent {
  id: string;
  timestamp: string;
  candidateId: string;
  candidateName: string;
  studentId: string;
  eventType: 'Tab Switch' | 'Audio Spike' | 'Gaze Away' | 'Proctor Warning' | 'Session Paused' | 'Flag Cleared';
  severity: 'info' | 'warning' | 'critical';
  detail: string;
}

export interface ExamSubmissionResult {
  assessmentTitle: string;
  assessmentCode: string;
  submittedAt: string;
  timeSpentSeconds: number;
  totalDurationSeconds: number;
  answers: Record<number, string>;
  flaggedIds: number[];
  tabSwitchesDetected: number;
  totalQuestions: number;
  correctCount: number;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
}
