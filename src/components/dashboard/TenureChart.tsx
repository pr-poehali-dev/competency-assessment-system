import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { TENURE, TENURE_2025, TENURE_2026, pct } from '@/data/recruitment';

const data = TENURE.map((t) => ({ name: t.label, '2025': t.y2025, '2026': t.y2026 }));

export default function TenureChart() {
  const early2025 = pct(TENURE[0].y2025, TENURE_2025);
  const early2026 = pct(TENURE[0].y2026, TENURE_2026);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-1">Увольнения по стажу работы</h3>
      <p className="text-sm text-slate-500 mb-5">Сколько сотрудник проработал до увольнения</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 8 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            formatter={(v: number) => [`${v} чел.`, '']}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="2025" fill="#fca5a5" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="2025" position="top" fontSize={11} fill="#94a3b8" formatter={(v: number) => (v > 0 ? v : '')} />
          </Bar>
          <Bar dataKey="2026" fill="#dc2626" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="2026"
              position="top"
              fontSize={11}
              fontWeight={600}
              fill="#dc2626"
              formatter={(v: number) => (v > 0 ? v : '')}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 pt-4 border-t border-slate-100 bg-rose-50 -mx-5 -mb-5 px-5 py-4 rounded-b-xl">
        <p className="text-sm text-rose-800">
          <strong>{early2026.toFixed(0)}%</strong> увольнений в 2026 году — сотрудники со стажем менее года
          (в 2025 — {early2025.toFixed(0)}%). Основная зона риска — адаптация новичков.
        </p>
      </div>
    </div>
  );
}
