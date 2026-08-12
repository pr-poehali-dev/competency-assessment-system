import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';
import { REASON_TOP, REASONS_TOTAL, rPct } from '@/data/reasons';

const data = REASON_TOP.map((g) => ({
  name: g.short,
  full: g.label,
  value: g.total,
  color: g.color,
}));

export default function ReasonsChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
      <h3 className="font-semibold text-slate-900 mb-1">Причины увольнения — общая картина</h3>
      <p className="text-sm text-slate-500 mb-5">
        {REASONS_TOTAL.toLocaleString('ru-RU')} увольнений, сгруппированных по смыслу причины
      </p>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 48, top: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} />
          <YAxis type="category" dataKey="name" width={120} stroke="#64748b" fontSize={12} />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            formatter={(v: number, _n, p) => [`${v} чел. · ${rPct(v).toFixed(1)}%`, p.payload.full]}
          />
          <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={22}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              fontSize={11}
              fontWeight={600}
              fill="#475569"
              formatter={(v: number) => `${v} · ${rPct(v).toFixed(0)}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 pt-4 border-t border-slate-100 bg-rose-50 -mx-5 -mb-5 px-5 py-4 rounded-b-xl">
        <p className="text-sm text-rose-800">
          Главная причина ухода — <strong>переход к другому работодателю</strong> ({REASON_TOP[0].total} чел.,{' '}
          {rPct(REASON_TOP[0].total).toFixed(0)}%). Люди не уходят «в никуда» — их забирает рынок, а значит компания
          проигрывает конкуренцию за собственных сотрудников.
        </p>
      </div>
    </div>
  );
}
