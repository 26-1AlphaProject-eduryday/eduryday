const JUDGE0_URL = process.env.JUDGE0_API_URL ?? 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.JUDGE0_API_KEY ?? '';

const LANGUAGE_IDS: Record<string, number> = {
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  javascript: 63,
  typescript: 74,
};

interface Judge0Submission {
  stdout: string | null;
  stderr: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
}

export function getLanguageId(language: string): number {
  return LANGUAGE_IDS[language.toLowerCase()] ?? 71;
}

export async function submitCode(
  sourceCode: string,
  languageId: number,
  stdin: string,
  timeLimit = 5,
  memoryLimit = 256000,
): Promise<Judge0Submission | null> {
  if (!JUDGE0_KEY) return null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': JUDGE0_KEY,
    'X-RapidAPI-Host': new URL(JUDGE0_URL).host,
  };

  // Submit
  const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: sourceCode,
      language_id: languageId,
      stdin,
      cpu_time_limit: timeLimit,
      memory_limit: memoryLimit,
    }),
  });

  if (!submitRes.ok) return null;
  return submitRes.json();
}

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  passed: boolean;
  error: string | null;
}

export async function runTestCases(
  sourceCode: string,
  language: string,
  testCases: { input: string; expectedOutput: string; weight: number }[],
): Promise<{ results: TestCaseResult[]; score: number; summary: string }> {
  const languageId = getLanguageId(language);
  const results: TestCaseResult[] = [];
  let totalWeight = 0;
  let passedWeight = 0;

  for (const tc of testCases) {
    totalWeight += tc.weight;
    const submission = await submitCode(sourceCode, languageId, tc.input);

    if (!submission) {
      results.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: null,
        passed: false,
        error: 'Judge0 API 연결 실패',
      });
      continue;
    }

    const stdout = (submission.stdout ?? '').trim();
    const expected = tc.expectedOutput.trim();
    const passed = stdout === expected;

    if (passed) passedWeight += tc.weight;

    results.push({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: stdout || null,
      passed,
      error: submission.stderr || (submission.status.id !== 3 ? submission.status.description : null),
    });
  }

  const score = totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 100) : 0;
  const passedCount = results.filter(r => r.passed).length;
  const summary = `${passedCount}/${results.length} 통과`;

  return { results, score, summary };
}
