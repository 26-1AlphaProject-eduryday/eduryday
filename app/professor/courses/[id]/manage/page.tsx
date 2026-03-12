import { ProfessorCourseManagePage } from '@/_pages/professor-course-manage/ui/ProfessorCourseManagePage';

export default async function ProfessorCourseManageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProfessorCourseManagePage courseId={id} />;
}
