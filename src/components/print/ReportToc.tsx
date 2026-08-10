import type { CoverSection } from '@/components/print/PrintCover';

type Props = {
  sections: CoverSection[];
  accent: string;
};

export default function ReportToc({ sections, accent }: Props) {
  return (
    <nav className="no-print rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xs uppercase tracking-[0.15em] font-semibold text-slate-400">Содержание отчёта</h2>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <ol className="grid sm:grid-cols-2 gap-x-6">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="flex items-baseline gap-3 rounded-md px-2 py-2 -mx-2 no-underline hover:bg-slate-50 transition-colors group"
            >
              <span className="text-xs font-bold tabular-nums w-5 shrink-0" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium text-slate-900 group-hover:underline">{s.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
