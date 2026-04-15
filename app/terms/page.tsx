import fs from 'fs';
import path from 'path';

export default function TermsPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'docs/TERMS_OF_SERVICE.md'), 'utf-8');

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
        {content}
      </pre>
    </main>
  );
}
