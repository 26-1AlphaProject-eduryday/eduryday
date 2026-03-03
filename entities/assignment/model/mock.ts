import type { RubricCriterion, TestResult } from './types';

export const MOCK_RUBRIC_CRITERIA: RubricCriterion[] = [
  { id: 1, weight: 30, description: '정렬이 올바르게 되었는지 확인해줘. 오름차순으로 정렬되어야 해.', aiResult: 'assert output == sorted(input)' },
  { id: 2, weight: 30, description: '시간 복잡도가 O(n log n) 이하인지 검사해줘. 대용량 데이터(10000개)에서 1초 이내.', aiResult: 'runtime_limit(1.0s), test_with(generate_random(10000))' },
  { id: 3, weight: 20, description: '변수명이 직관적이고 PEP8 규칙을 따르는지 확인해줘.', aiResult: 'static_analysis(naming_convention)' },
  { id: 4, weight: 20, description: '엣지 케이스를 처리했는지 확인해줘 (빈 배열, 단일 원소 등).', aiResult: 'test_cases([[], [1], [-1, 0, 1]])' },
];

export const MOCK_TEST_RESULTS: TestResult[] = [
  { label: '테스트 1: 기본 케이스', status: 'pass', detail: '12ms' },
  { label: '테스트 2: 빈 배열', status: 'pass', detail: '8ms' },
  { label: '테스트 3: 대용량 데이터', status: 'fail', detail: '시간 초과' },
];
