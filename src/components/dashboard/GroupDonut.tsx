import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';
import { GROUPED, TOTAL_2025, TOTAL_2026 } from '@/data/recruitment';

const RAD = Math.PI / 180;

function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function outerLabel({ cx, cy, midAngle, outerRadius, value, percent }: any) {
  if (percent < 0.03) return null;
  const r = outerRadius + 14;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text
      x={x}
      y={y}
      fill="#475569"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {value}
    </text>
  );
}

function Donut({ year, total }: { year: 'y2025' | 'y2026'; total: number }) {
  const data = GROUPED.filter((g) => g[year] > 0).map((g) => ({
    name: g.label,
    value: g[year],
    color: g.color,
    isOpp: g.group === 'opp',
  }));
  const opp = data.find((d) => d.isOpp);

  return (
    <div className="flex-1">
      <div className="text-center text-sm font-semibold text-slate-700 mb-1">
        {year === 'y2025' ? '2025 год' : '2026 год'}
      </div>
      <div className="text-center text-xs text-slate-400 mb-1">{total} чел.</div>
      <ResponsiveContainer width="100%" height={210}>
        <PieChart margin={{ top: 8, bottom: 8 }}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={46}
            outerRadius={72}
            paddingAngle={2}
            labelLine={false}
            label={renderLabel}
          >
            {data.map((d) => (
              <Cell
                key={d.name}
                fill={d.color}
                stroke={d.isOpp ? '#4c1d95' : 'none'}
                strokeWidth={d.isOpp ? 2.5 : 0}
                fillOpacity={opp && !d.isOpp ? 0.75 : 1}
              />
            ))}
          </Pie>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={46}
            outerRadius={72}
            paddingAngle={2}
            fill="transparent"
            stroke="none"
            labelLine={false}
            label={outerLabel}
            isAnimationActive={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            formatter={(v: number) => [`${v} чел. (${((v / total) * 100).toFixed(0)}%)`, '']}
          />
          {opp && (
            <>
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={18}
                fontWeight={800}
                fill="#7c3aed"
              >
                {`${((opp.value / total) * 100).toFixed(0)}%`}
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="central" fontSize={10} fill="#94a3b8">
                ОПП
              </text>
            </>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function GroupDonut() {
  const oppRow = GROUPED.find((g) => g.group === 'opp');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
      <h3 className="font-semibold text-slate-900 mb-1">Структура каналов подбора</h3>
      <p className="text-sm text-slate-500 mb-4">Распределение по типам источников</p>
      <div className="flex gap-2">
        <Donut year="y2025" total={TOTAL_2025} />
        <Donut year="y2026" total={TOTAL_2026} />
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
        {GROUPED.map((g) => {
          const isOpp = g.group === 'opp';
          return (
            <div
              key={g.group}
              className={`flex items-center gap-2 text-xs ${
                isOpp ? 'bg-violet-50 border border-violet-200 rounded-md px-2 py-1.5 -mx-2' : ''
              }`}
            >
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ background: g.color, boxShadow: isOpp ? '0 0 0 1.5px #4c1d95' : undefined }}
              />
              <span className={`flex-1 ${isOpp ? 'font-semibold text-violet-900' : 'text-slate-600'}`}>{g.label}</span>
              <span className="tabular-nums text-slate-400">{g.y2025}</span>
              <Icon name="ArrowRight" size={11} className="text-slate-300" />
              <span
                className={`tabular-nums font-semibold w-8 text-right ${isOpp ? 'text-violet-900' : 'text-slate-900'}`}
              >
                {g.y2026}
              </span>
            </div>
          );
        })}
      </div>

      {oppRow && (
        <div className="mt-3 bg-violet-50 border border-violet-200 rounded-lg px-3 py-2.5 flex items-start gap-2">
          <Icon name="Building2" size={14} className="text-violet-600 mt-0.5 shrink-0" />
          <p className="text-xs text-violet-900 leading-relaxed">
            Собственный отдел подбора закрыл <strong>{oppRow.y2026}</strong> вакансий (
            {((oppRow.y2026 / TOTAL_2026) * 100).toFixed(0)}% от найма) против {oppRow.y2025} в 2025 году — доля
            снизилась с {((oppRow.y2025 / TOTAL_2025) * 100).toFixed(0)}%.
          </p>
        </div>
      )}
    </div>
  );
}