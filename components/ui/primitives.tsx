import { ReactNode } from 'react';

export function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">{title}</h1>
        {children}
      </div>
    </main>
  );
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {title ? <h2 className="mb-3 text-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}

export function Button({ children, kind = 'primary' }: { children: ReactNode; kind?: 'primary'|'secondary'|'danger' }) {
  const cls = kind === 'primary'
    ? 'bg-slate-900 text-white'
    : kind === 'danger'
    ? 'bg-rose-600 text-white'
    : 'border border-slate-300 bg-white text-slate-800';
  return <button className={`rounded-lg px-4 py-2 text-sm font-medium ${cls}`}>{children}</button>;
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
