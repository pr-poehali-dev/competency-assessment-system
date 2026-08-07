import { retentionBySource, GROUP_META } from '@/data/recruitment';

export default function SourceQuality() {
  const rows = retentionBySource;
  const max = Math.max(...rows.map((r) => r.turnover), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-1">Качество источников: текучесть 2026</h3>
      <p className="text-sm text-slate-500 mb-5">
        Доля уволившихся от нанятых по каналу. Чем ниже — тем качественнее источник
      </p>
      <div className="space-y-4">
        {rows.map((r) => {
          const tone = r.turnover < 12 ? '#16a34a' : r.turnover < 20 ? '#f59e0b' : '#dc2626';
          return (
            <div key={r.source}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: GROUP_META[r.group].color }} />
                  <span className="text-slate-700">{r.short}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 tabular-nums">
                    {r.fired} из {r.hired}
                  </span>
                  <span className="font-semibold tabular-nums w-11 text-right" style={{ color: tone }}>
                    {r.turnover.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(r.turnover / max) * 100}%`, background: tone }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" /> до 12% — хорошо
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> 12–20% — норма
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" /> выше 20% — риск
        </span>
      </div>
    </div>
  );
}
