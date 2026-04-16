import fs from 'fs';
import path from 'path';

export default function PrivacyPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'docs/PRIVACY_POLICY.md'), 'utf-8');

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
        {content}
      </pre>
    </main>
  );
}
