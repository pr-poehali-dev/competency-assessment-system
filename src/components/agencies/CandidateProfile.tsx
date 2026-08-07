import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';
import {
  AGE_BANDS,
  AGE_AVG_2025,
  AGE_AVG_2026,
  AG_TOTAL_2026,
  POSITIONS,
  RECRUITERS_2025,
  RECRUITERS_2026,
  agPct,
} from '@/data/agencies';

const RAD = Math.PI / 180;
const pieData = AGE_BANDS.map((b) => ({ name: b.band, value: b.y2026, color: b.color }));

function label({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.07) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return (
    <text
      x={cx + r * Math.cos(-midAngle * RAD)}
      y={cy + r * Math.sin(-midAngle * RAD)}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function CandidateProfile() {
  const topPositions = [...POSITIONS].sort((a, b) => b.y2026 - a.y2026).slice(0, 7);
  const maxPos = topPositions[0].y2026;

  return (
    <div className="grid lg:grid-cols-2 gap-6 print-wide">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
        <h3 className="font-semibold text-slate-900 mb-1">Возраст нанятых кандидатов</h3>
        <p className="text-sm text-slate-500 mb-4">Распределение за 2026 год</p>

        <ResponsiveContainer width="100%" height={200}>
          <PieChart margin={{ top: 4, bottom: 4 }}>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={48}
              outerRadius={78}
              paddingAngle={2}
              labelLine={false}
              label={label}
            >
              {pieData.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
              formatter={(v: number) => [`${v} чел. (${agPct(v, AG_TOTAL_2026).toFixed(0)}%)`, '']}
            />
            <text
              x="50%"
              y="46%"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={20}
              fontWeight={800}
              fill="#1a1a2e"
            >
              {AGE_AVG_2026}
            </text>
            <text x="50%" y="58%" textAnchor="middle" dominantBaseline="central" fontSize={10} fill="#94a3b8">
              средний возраст
            </text>
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
          {AGE_BANDS.map((b) => (
            <div key={b.band} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: b.color }} />
              <span className="text-slate-600 flex-1">{b.band}</span>
              <span className="tabular-nums text-slate-400">{b.y2025}</span>
              <Icon name="ArrowRight" size={11} className="text-slate-300" />
              <span className="tabular-nums font-semibold text-slate-900 w-8 text-right">{b.y2026}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600 leading-relaxed">
          Портрет кандидата стабилен: средний возраст {AGE_AVG_2025} года в 2025 и {AGE_AVG_2026} в 2026. Основная масса
          — специалисты 30–49 лет с опытом.
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
        <h3 className="font-semibold text-slate-900 mb-1">Какие позиции закрывают агентства</h3>
        <p className="text-sm text-slate-500 mb-4">Топ должностей за 2026 год</p>

        <div className="space-y-2.5">
          {topPositions.map((p) => (
            <div key={p.pos}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-700 flex-1 truncate">{p.pos}</span>
                <span className="text-[11px] text-slate-400 tabular-nums">{p.y2025} в 2025</span>
                <span className="text-xs font-bold tabular-nums text-slate-900 w-6 text-right">{p.y2026}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#1a1a2e] rounded-full" style={{ width: `${(p.y2026 / maxPos) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 flex items-start gap-2">
          <Icon name="UsersRound" size={14} className="text-sky-600 mt-0.5 shrink-0" />
          <p className="text-xs text-sky-900 leading-relaxed">
            С заказами работали {RECRUITERS_2026} рекрутеров агентств в 2026 году против {RECRUITERS_2025} в 2025 —
            команда на стороне подрядчика расширилась.
          </p>
        </div>
      </div>
    </div>
  );
}
