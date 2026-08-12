import Icon from '@/components/ui/icon';

export type CoverSection = {
  id: string;
  title: string;
  sub: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  sections: CoverSection[];
  facts: { label: string; value: string }[];
  note: string;
};

export default function PrintCover({ eyebrow, title, subtitle, icon, accent, sections, facts, note }: Props) {
  const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="print-cover">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: accent }}>
            <Icon name={icon} size={24} className="text-white" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">{eyebrow}</div>
            <div className="text-sm font-semibold text-slate-700">Управление персоналом</div>
          </div>
        </div>

        <img
          src="/krost-logo.png"
          alt="Концерн КРОСТ"
          className="h-12 w-auto shrink-0 object-contain"
          crossOrigin="anonymous"
        />
      </div>

      <div className="mt-16">
        <div className="h-1.5 w-20 rounded-full" style={{ background: accent }} />
        <h1 className="text-[38px] leading-[1.15] font-bold text-slate-900 mt-6">{title}</h1>
        <p className="text-lg text-slate-500 mt-4 max-w-2xl leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-10">
        {facts.map((f) => (
          <div key={f.label} className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">{f.value}</div>
            <div className="text-xs text-slate-500 mt-1 leading-snug">{f.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm uppercase tracking-[0.15em] font-semibold text-slate-400">Содержание</h2>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <ol className="space-y-1">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex items-baseline gap-3 rounded-md px-2 py-1.5 -mx-2 no-underline hover:bg-slate-50 transition-colors group"
              >
                <span className="text-sm font-bold tabular-nums w-6 shrink-0" style={{ color: accent }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-semibold text-slate-900 shrink-0 group-hover:underline">{s.title}</span>
                <span className="flex-1 border-b border-dotted border-slate-300 translate-y-[-3px]" />
                <span className="text-xs text-slate-500 shrink-0 max-w-[45%] text-right">{s.sub}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-auto pt-10">
        <div className="border-t border-slate-200 pt-4 flex items-end justify-between gap-6">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">{note}</p>
          <div className="text-right shrink-0">
            <div className="text-[11px] text-slate-400">Дата формирования</div>
            <div className="text-sm font-semibold text-slate-700">{date}</div>
            <div className="text-[11px] text-slate-400 mt-1.5">Концерн КРОСТ</div>
          </div>
        </div>
      </div>
    </section>
  );
}