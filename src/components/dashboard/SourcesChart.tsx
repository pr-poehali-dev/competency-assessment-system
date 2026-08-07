import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { SOURCES } from '@/data/recruitment';

const data = [...SOURCES]
  .filter((s) => s.y2025 + s.y2026 > 0)
  .sort((a, b) => b.y2025 + b.y2026 - (a.y2025 + a.y2026))
  .map((s) => ({ name: s.short, '2025': s.y2025, '2026': s.y2026 }));

export default function SourcesChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-1">Источники подбора: 2025 vs 2026</h3>
      <p className="text-sm text-slate-500 mb-5">Количество нанятых сотрудников по каждому каналу</p>
      <ResponsiveContainer width="100%" height={430}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 44 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} domain={[0, 460]} />
          <YAxis type="category" dataKey="name" width={120} stroke="#64748b" fontSize={12} />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            formatter={(v: number) => [`${v} чел.`, '']}
          />
          <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
          <Bar dataKey="2025" fill="#cbd5e1" radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="2025"
              position="right"
              fontSize={11}
              fill="#94a3b8"
              formatter={(v: number) => (v > 0 ? v : '')}
            />
          </Bar>
          <Bar dataKey="2026" fill="#1a1a2e" radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="2026"
              position="right"
              fontSize={11}
              fontWeight={600}
              fill="#1a1a2e"
              formatter={(v: number) => (v > 0 ? v : '')}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}