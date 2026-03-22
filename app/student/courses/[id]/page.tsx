import { CourseDetailPage } from '@/_pages/course-detail/ui/CourseDetailPage';

interface CourseDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailRoute({ params }: CourseDetailRouteProps) {
  const { id } = await params;
  return <CourseDetailPage courseId={id} />;
}
