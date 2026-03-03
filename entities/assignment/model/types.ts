export interface RubricCriterion {
  id: number;
  weight: number;
  description: string;
  aiResult: string;
}

export interface Assignment {
  id: string;
  title: string;
  type: 'coding' | 'essay' | 'multiple-choice' | 'file';
  deadline: string;
  totalScore: number;
}

export type TestResultStatus = 'pass' | 'fail' | 'pending';

export interface TestResult {
  label: string;
  status: TestResultStatus;
  detail: string;
}
