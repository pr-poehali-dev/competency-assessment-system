import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';
import { MONTHLY } from '@/data/agencies';

export default function MonthlyChart() {
  const done2026 = MONTHLY.filter((m) => m.y2026 !== null);
  const sum2026 = done2026.reduce((s, m) => s + (m.y2026 ?? 0), 0);
  const same2025 = MONTHLY.slice(0, done2026.length).reduce((s, m) => s + m.y2025, 0);
  const peak = [...done2026].sort((a, b) => (b.y2026 ?? 0) - (a.y2026 ?? 0))[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
      <h3 className="font-semibold text-slate-900 mb-1">Динамика найма по месяцам</h3>
      <p className="text-sm text-slate-500 mb-3">Сколько человек агентства приводили каждый месяц</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-5 border-t-2 border-slate-300 shrink-0" />
          <span className="text-xs text-slate-600">2025 год</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative w-5 shrink-0 border-t-2 border-[#f59e0b]">
            <span className="absolute left-1/2 -translate-x-1/2 -top-[3px] w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
          </span>
          <span className="text-xs text-slate-600">2026 год</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={MONTHLY} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" fontSize={11} interval={0} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            formatter={(v: number, n: string) => [`${v} чел.`, n === 'y2025' ? '2025 год' : '2026 год']}
          />
          <Line
            type="monotone"
            dataKey="y2025"
            stroke="#cbd5e1"
            strokeWidth={2}
            dot={{ r: 3, fill: '#cbd5e1' }}
            name="y2025"
          />
          <Line
            type="monotone"
            dataKey="y2026"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#f59e0b' }}
            connectNulls={false}
            name="y2026"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 flex items-start gap-2">
        <Icon name="Info" size={14} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">
          За {done2026.length} месяцев 2026 года агентства привели {sum2026} человек против {same2025} за тот же период
          2025 года. Пик найма — {peak.month} ({peak.y2026} чел.). Данные за 2026 год неполные: год ещё не закончился.
        </p>
      </div>
    </div>
  );
}
