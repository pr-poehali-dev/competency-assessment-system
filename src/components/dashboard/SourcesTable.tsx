import Icon from '@/components/ui/icon';
import { SOURCES, TOTAL_2025, TOTAL_2026, GROUP_META, pct } from '@/data/recruitment';

const rows = [...SOURCES].sort((a, b) => b.y2026 - a.y2026 || b.y2025 - a.y2025);

export default function SourcesTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 pb-3">
        <h3 className="font-semibold text-slate-900">Детализация по источникам</h3>
        <p className="text-sm text-slate-500 mt-1">Динамика найма по каждому каналу</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
              <th className="text-left font-semibold px-5 py-3">Источник</th>
              <th className="text-right font-semibold px-3 py-3">2025</th>
              <th className="text-right font-semibold px-3 py-3">Доля</th>
              <th className="text-right font-semibold px-3 py-3">2026</th>
              <th className="text-right font-semibold px-3 py-3">Доля</th>
              <th className="text-right font-semibold px-5 py-3">Динамика</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const d = r.y2026 - r.y2025;
              return (
                <tr key={r.source} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: GROUP_META[r.group].color }} />
                      <span className="text-slate-800">{r.source}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-600">{r.y2025}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-400 text-xs">
                    {pct(r.y2025, TOTAL_2025).toFixed(1)}%
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums font-semibold text-slate-900">{r.y2026}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-400 text-xs">
                    {pct(r.y2026, TOTAL_2026).toFixed(1)}%
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
                        d > 0 ? 'text-emerald-600' : d < 0 ? 'text-rose-600' : 'text-slate-400'
                      }`}
                    >
                      {d !== 0 && <Icon name={d > 0 ? 'TrendingUp' : 'TrendingDown'} size={14} />}
                      {d > 0 ? '+' : ''}
                      {d}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-slate-900">
              <td className="px-5 py-3">Итого</td>
              <td className="px-3 py-3 text-right tabular-nums">{TOTAL_2025}</td>
              <td className="px-3 py-3 text-right text-xs text-slate-400">100%</td>
              <td className="px-3 py-3 text-right tabular-nums">{TOTAL_2026}</td>
              <td className="px-3 py-3 text-right text-xs text-slate-400">100%</td>
              <td className="px-5 py-3 text-right tabular-nums text-rose-600">{TOTAL_2026 - TOTAL_2025}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
