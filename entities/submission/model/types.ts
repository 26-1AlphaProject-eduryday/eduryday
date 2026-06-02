export type SubmissionStatus = 'submitted' | 'grading' | 'graded' | 'unsubmitted';
export type AiAnalysisVariant = 'green' | 'yellow' | 'red';

export interface Submission {
  id: string;
  name: string;
  studentId: string;
  submittedAt: string;
  autoScore: string;
  testsPassed: string;
  aiAnalysis: string;
  aiAnalysisVariant: AiAnalysisVariant;
  aiSubNote?: string;
  finalScore: string;
  status: SubmissionStatus;
}
