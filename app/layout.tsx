import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EduRyday',
  description: 'AI 기반 통합 교육 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
