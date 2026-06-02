import type { SupabaseClient } from '@supabase/supabase-js';

interface SubmissionStatusRow {
  status: string;
}

export async function refreshAssignmentSubmissionCounts(
  client: SupabaseClient,
  assignmentId: string,
) {
  const { data, error } = await client
    .from('submissions')
    .select('status')
    .eq('assignment_id', assignmentId);

  if (error) {
    return;
  }

  const rows = (data ?? []) as SubmissionStatusRow[];
  const submittedCount = rows.filter((row) => row.status !== 'unsubmitted').length;
  const gradedCount = rows.filter((row) => row.status === 'graded').length;

  await client
    .from('assignments')
    .update({ submitted_count: submittedCount, graded_count: gradedCount })
    .eq('id', assignmentId);
}
