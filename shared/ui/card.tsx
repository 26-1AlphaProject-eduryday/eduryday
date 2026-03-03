import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className = '' }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`.trim()}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
