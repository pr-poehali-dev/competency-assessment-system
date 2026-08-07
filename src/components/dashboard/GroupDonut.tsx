import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { GROUPED, TOTAL_2025, TOTAL_2026 } from '@/data/recruitment';

function Donut({ year, total }: { year: 'y2025' | 'y2026'; total: number }) {
  const data = GROUPED.filter((g) => g[year] > 0).map((g) => ({ name: g.label, value: g[year], color: g.color }));
  return (
    <div className="flex-1">
      <div className="text-center text-sm font-semibold text-slate-700 mb-2">
        {year === 'y2025' ? '2025 год' : '2026 год'}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            formatter={(v: number) => [`${v} чел. (${((v / total) * 100).toFixed(0)}%)`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function GroupDonut() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-1">Структура каналов подбора</h3>
      <p className="text-sm text-slate-500 mb-4">Распределение по типам источников</p>
      <div className="flex gap-2">
        <Donut year="y2025" total={TOTAL_2025} />
        <Donut year="y2026" total={TOTAL_2026} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-slate-100">
        {GROUPED.map((g) => (
          <div key={g.group} className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: g.color }} />
            {g.label}
          </div>
        ))}
      </div>
    </div>
  );
}
