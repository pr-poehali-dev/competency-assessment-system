import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { SOURCES, DISMISSALS } from '@/data/recruitment';

const data = [...SOURCES]
  .filter((s) => s.y2026 >= 10)
  .sort((a, b) => b.y2026 - a.y2026)
  .map((s) => {
    const fired = DISMISSALS.find((d) => d.source === s.source)?.y2026 ?? 0;
    return {
      name: s.short,
      Принято: s.y2026,
      Уволено: fired,
      Осталось: s.y2026 - fired,
    };
  });

export default function HireVsFire() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-1">Найм и увольнения по каналам, 2026</h3>
      <p className="text-sm text-slate-500 mb-5">Сколько человек пришло, ушло и осталось работать</p>
      <ResponsiveContainer width="100%" height={290}>
        <ComposedChart data={data} margin={{ top: 22, right: 8 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            formatter={(v: number) => [`${v} чел.`, '']}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="Принято" fill="#1a1a2e" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="Принято" position="top" fontSize={11} fontWeight={600} fill="#1a1a2e" />
          </Bar>
          <Bar dataKey="Уволено" fill="#dc2626" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="Уволено" position="top" fontSize={11} fontWeight={600} fill="#dc2626" />
          </Bar>
          <Line type="monotone" dataKey="Осталось" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: '#16a34a' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
