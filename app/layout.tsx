import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EduRyday Mockup Frontend',
  description: 'PDF/Mockup 기반 페이지 구현',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
