import type { ReactNode } from 'react';
import { ExternalLink, FileText } from 'lucide-react';

interface ResourceDownloadCardProps {
  title: string;
  description: string;
  href: string;
  fileType: string;
  fileSize?: string;
  icon: ReactNode;
  category?: string;
  features?: string[];
  gradient?: string;
  delay?: number;
}

export default function ResourceDownloadCard({
  title, description, href, fileType, icon, category, features,
}: ResourceDownloadCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-7">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700" aria-hidden="true">
          {icon}
        </div>
        <div className="min-w-0">
          {category && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600">{category}</p>}
          <h3 className="text-xl font-semibold leading-snug text-gray-900">{title}</h3>
        </div>
      </div>
      <p className="mb-5 text-base leading-relaxed text-gray-600">{description}</p>
      {features && (
        <ul className="mb-6 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
          {features.map(feature => <li key={feature} className="flex items-start gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />{feature}</li>)}
        </ul>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
        <span className="inline-flex items-center gap-2 text-sm text-gray-500"><FileText size={16} aria-hidden="true" />{fileType}</span>
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600" aria-label={`Abrir ${title} em nova aba`}>
          Abrir material<ExternalLink size={17} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
