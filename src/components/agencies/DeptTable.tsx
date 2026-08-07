import Icon from '@/components/ui/icon';
import { DEPTS, AG_TOTAL_2025, AG_TOTAL_2026, agPct } from '@/data/agencies';

export default function DeptTable() {
  const rows = [...DEPTS].sort((a, b) => b.y2026 - a.y2026);
  const sum2025 = rows.reduce((s, r) => s + r.y2025, 0);
  const sum2026 = rows.reduce((s, r) => s + r.y2026, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
      <div className="p-5 pb-4">
        <h3 className="font-semibold text-slate-900 mb-1">Куда шли сотрудники от агентств</h3>
        <p className="text-sm text-slate-500">Топ подразделений по объёму найма</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200 text-slate-500">
              <th className="text-left font-medium px-5 py-2.5">Подразделение</th>
              <th className="text-right font-medium px-3 py-2.5 whitespace-nowrap">2025</th>
              <th className="text-right font-medium px-3 py-2.5 whitespace-nowrap">2026</th>
              <th className="text-right font-medium px-5 py-2.5 whitespace-nowrap">Динамика</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const diff = r.y2026 - r.y2025;
              return (
                <tr key={r.dept} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-2.5 text-slate-700">{r.dept}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-400">{r.y2025}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-slate-900">{r.y2026}</td>
                  <td className="px-5 py-2.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
                        diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-rose-600' : 'text-slate-400'
                      }`}
                    >
                      {diff !== 0 && <Icon name={diff > 0 ? 'TrendingUp' : 'TrendingDown'} size={13} />}
                      {diff > 0 ? `+${diff}` : diff < 0 ? diff : '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-900">
              <td className="px-5 py-3">Показано в таблице</td>
              <td className="px-3 py-3 text-right tabular-nums">{sum2025}</td>
              <td className="px-3 py-3 text-right tabular-nums">{sum2026}</td>
              <td className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                {agPct(sum2026, AG_TOTAL_2026).toFixed(0)}% найма
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 text-xs text-slate-500 leading-relaxed">
        Остальной найм распределён мелкими группами по другим подразделениям: {AG_TOTAL_2025 - sum2025} человек в 2025
        году и {AG_TOTAL_2026 - sum2026} в 2026.
      </div>
    </div>
  );
}
