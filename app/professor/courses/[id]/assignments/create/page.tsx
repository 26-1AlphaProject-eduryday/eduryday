import { CreateAssignmentPage } from '@/_pages/create-assignment/ui/CreateAssignmentPage';

export default async function CreateAssignmentRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CreateAssignmentPage initialCourseId={id} />;
}
