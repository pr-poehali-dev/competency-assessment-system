import { PLAN_WAVES, STATUS_META, STATUS_ORDER } from '@/data/plan';

const MONTHS = [
  { key: '2026-09', label: 'сен', year: '2026' },
  { key: '2026-10', label: 'окт', year: '' },
  { key: '2026-11', label: 'ноя', year: '' },
  { key: '2026-12', label: 'дек', year: '' },
  { key: '2027-01', label: 'янв', year: '2027' },
  { key: '2027-02', label: 'фев', year: '' },
  { key: '2027-03', label: 'мар', year: '' },
  { key: '2027-04', label: 'апр', year: '' },
  { key: '2027-05', label: 'май', year: '' },
  { key: '2027-06', label: 'июн', year: '' },
];

const MONTH_NAMES = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

function deadlineIndex(deadline: string) {
  const m = MONTH_NAMES.findIndex((n) => deadline.includes(n));
  const year = deadline.includes('2027') ? 2027 : 2026;
  return MONTHS.findIndex((x) => x.key === `${year}-${String(m + 1).padStart(2, '0')}`);
}

const barTone: Record<string, string> = {
  red: 'bg-rose-500',
  amber: 'bg-amber-500',
  blue: 'bg-sky-500',
};

export default function PlanTimeline() {
  let cursor = 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 print-block">
      <h3 className="font-semibold text-slate-900 mb-1">Сроки на одной шкале</h3>
      <p className="text-sm text-slate-500 mb-5">Когда какая задача должна быть завершена</p>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="flex gap-2 pl-[38%] mb-2">
            {MONTHS.map((m) => (
              <div key={m.key} className="flex-1 text-center">
                <div className="text-[11px] text-slate-500 capitalize">{m.label}</div>
                <div className="text-[10px] text-slate-300 h-3">{m.year}</div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            {PLAN_WAVES.map((wave) =>
              wave.tasks.map((t) => {
                const end = deadlineIndex(t.deadline);
                const start = Math.min(cursor, end);
                cursor = Math.max(0, end - 1);
                const span = Math.max(1, end - start + 1);

                return (
                  <div key={t.id} className="flex items-center gap-2">
                    <div className="w-[38%] pr-3 shrink-0 flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_META[t.status].dot}`}
                        title={STATUS_META[t.status].label}
                      />
                      <span className="text-[11px] tabular-nums text-slate-400 shrink-0">{t.id}</span>
                      <span
                        className={`text-xs truncate ${
                          t.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>
                    <div className="flex-1 flex gap-2">
                      {MONTHS.map((m, i) => (
                        <div key={m.key} className="flex-1 h-5 relative">
                          <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
                          {i >= start && i < start + span && (
                            <div
                              className={`absolute inset-y-0.5 ${barTone[wave.tone]} ${
                                i === start ? 'rounded-l-full left-0' : '-left-2'
                              } ${i === start + span - 1 ? 'rounded-r-full right-0' : '-right-2'}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
        <div className="flex flex-wrap gap-4">
          {PLAN_WAVES.map((w) => (
            <div key={w.key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${barTone[w.tone]}`} />
              <span className="text-xs text-slate-600">
                {w.name} · {w.period}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <span className="text-xs text-slate-400">Отметка слева — статус:</span>
          {STATUS_ORDER.map((k) => (
            <div key={k} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${STATUS_META[k].dot}`} />
              <span className="text-xs text-slate-600">{STATUS_META[k].label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}