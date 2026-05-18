import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';
import { runTestCases } from '@/shared/lib/grading/judge0';
import { gradeWithLLM } from '@/shared/lib/grading/llm-grader';
import { readFileContent } from '@/shared/lib/grading/file-reader';

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);
  const submissionId = body?.submissionId;

  if (!submissionId) return fail('VALIDATION_ERROR', 'submissionId는 필수입니다.');

  // Fetch submission with assignment data
  const { data: submission, error: subErr } = await client
    .from('submissions')
    .select('id, content, file_url, status, assignment_id, assignments(title, type, max_score, rubric, test_cases)')
    .eq('id', submissionId)
    .single();

  if (subErr || !submission) return fail('NOT_FOUND', '제출물을 찾을 수 없습니다.', 404);

  const assignment = Array.isArray(submission.assignments) ? submission.assignments[0] : submission.assignments;
  if (!assignment) return fail('NOT_FOUND', '과제 정보를 찾을 수 없습니다.', 404);

  // Update status to grading
  await client.from('submissions').update({ status: 'grading' }).eq('id', submissionId);

  let autoScore: number | null = null;
  let testsPassed: string | null = null;
  let aiAnalysis: string | null = null;
  let aiAnalysisVariant: string = 'default';
  let aiFeedback: string | null = null;

  const assignmentType = assignment.type as string;

  if (assignmentType === 'coding' || assignmentType === '코딩') {
    // Judge0 grading
    const testCases = (assignment.test_cases ?? []) as { input: string; expectedOutput: string; weight: number }[];
    const language = 'python'; // default, could be derived from assignment
    const code = submission.content ?? '';

    if (testCases.length > 0 && code) {
      const result = await runTestCases(code, language, testCases);
      autoScore = result.score;
      testsPassed = result.summary;
    }
  } else {
    // LLM grading for essays, reports, file submissions
    let answerText = submission.content ?? '';

    // If file submission, read file content
    if (submission.file_url && !answerText) {
      const fileResult = await readFileContent('submission-files', submission.file_url);
      if (fileResult.content) {
        answerText = fileResult.content;
      } else if (fileResult.error) {
        aiAnalysis = fileResult.error;
      }
    }

    if (answerText) {
      const rubric = (assignment.rubric ?? []) as { description: string; weight: number }[];
      const maxScore = (assignment.max_score as number) ?? 100;
      const result = await gradeWithLLM(answerText, rubric, maxScore, assignment.title);

      if (result) {
        autoScore = result.score;
        aiAnalysis = result.analysis;
        aiFeedback = result.feedback;
        aiAnalysisVariant = result.score >= 80 ? 'green' : result.score >= 60 ? 'yellow' : 'red';
      }
    }
  }

  // Save results
  const updatePayload: Record<string, unknown> = {
    status: 'graded',
    auto_score: autoScore,
    tests_passed: testsPassed,
    ai_analysis: aiAnalysis,
    ai_analysis_variant: aiAnalysisVariant,
  };

  if (aiFeedback) {
    updatePayload.feedback = aiFeedback;
  }

  await client.from('submissions').update(updatePayload).eq('id', submissionId);

  return ok({
    submissionId,
    autoScore,
    testsPassed,
    aiAnalysis,
    aiAnalysisVariant,
    feedback: aiFeedback,
  });
}
