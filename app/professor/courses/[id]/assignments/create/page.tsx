import { CreateAssignmentPage } from '@/_pages/create-assignment/ui/CreateAssignmentPage';
import {
  demoAssignmentDraft,
  demoProfessorCourses,
  isVideoDemoMode,
} from '@/entities/demo-video';

export default async function CreateAssignmentRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (isVideoDemoMode()) {
    return (
      <CreateAssignmentPage
        initialCourseId={id}
        initialCourses={demoProfessorCourses.map((course) => ({
          id: course.id,
          title: course.title,
        }))}
        initialDraft={demoAssignmentDraft}
      />
    );
  }

  return <CreateAssignmentPage initialCourseId={id} />;
}
