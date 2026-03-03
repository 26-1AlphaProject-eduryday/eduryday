import type { Submission } from './types';

export const MOCK_SUBMISSIONS: Submission[] = [
  { id: '1', name: '김철수', studentId: '20223045', submittedAt: '01.21 14:32', autoScore: '85/100', testsPassed: '테스트 17/20 통과', aiAnalysis: '정상', aiAnalysisVariant: 'green', finalScore: '85', status: 'complete' },
  { id: '2', name: '이영희', studentId: '20223067', submittedAt: '01.21 15:45', autoScore: '72/100', testsPassed: '테스트 14/20 통과', aiAnalysis: '검토 필요', aiAnalysisVariant: 'yellow', aiSubNote: '표절 의심', finalScore: '72', status: 'reviewing' },
  { id: '3', name: '박민수', studentId: '20223089', submittedAt: '01.22 09:12', autoScore: '100/100', testsPassed: '테스트 20/20 통과', aiAnalysis: '우수', aiAnalysisVariant: 'green', finalScore: '100', status: 'complete' },
  { id: '4', name: '최지원', studentId: '20223102', submittedAt: '-', autoScore: '-', testsPassed: '-', aiAnalysis: '-', aiAnalysisVariant: 'red', finalScore: '0', status: 'unsubmitted' },
];
