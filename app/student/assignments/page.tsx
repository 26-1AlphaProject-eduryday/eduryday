import { StudentAssignmentsPage } from '@/_pages/student-assignments/ui/StudentAssignmentsPage';
import { demoStudentAssignments, isVideoDemoMode } from '@/entities/demo-video';

export default function StudentAssignmentsRoute() {
  if (isVideoDemoMode()) {
    return <StudentAssignmentsPage initialAssignments={demoStudentAssignments} />;
  }

  return <StudentAssignmentsPage />;
}
