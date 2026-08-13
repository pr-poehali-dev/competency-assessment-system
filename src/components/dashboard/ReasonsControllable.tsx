import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';
import {
  CONTROLLABLE,
  INITIATOR,
  MANAGEABLE_TOTAL,
  REASONS_TOTAL,
  REASONS_BY_EMPLOYEE,
  REASON_GROUPS,
  rPct,
} from '@/data/reasons';

function Donut({
  title,
  sub,
  data,
  center,
  centerLabel,
}: {
  title: string;
  sub: string;
  data: { name: string; value: number; color: string }[];
  center: string;
  centerLabel: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-3">{sub}</p>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={58} outerRadius={86} paddingAngle={2} stroke="none">
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
              formatter={(v: number, n) => [`${v} чел. · ${rPct(v).toFixed(0)}%`, n]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-2xl font-bold text-slate-900">{center}</div>
          <div className="text-[11px] text-slate-500 text-center px-8 leading-tight">{centerLabel}</div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
            <span className="text-slate-600 flex-1">{d.name}</span>
            <span className="font-semibold text-slate-900">{d.value}</span>
            <span className="text-slate-400 text-xs w-11 text-right">{rPct(d.value).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReasonsControllable() {
  const manageable = REASON_GROUPS.filter((g) => g.manageable).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6 print-pair">
        <Donut
          title="Кто был инициатором увольнения"
          sub="Сотрудник уходит сам или компания расстаётся с ним"
          data={INITIATOR}
          center={`${rPct(REASONS_BY_EMPLOYEE).toFixed(0)}%`}
          centerLabel="уходят по своей инициативе"
        />
        <Donut
          title="Что компания может изменить"
          sub="Управляемые причины против объективных обстоятельств"
          data={CONTROLLABLE}
          center={`${rPct(MANAGEABLE_TOTAL).toFixed(0)}%`}
          centerLabel="уходов можно было предотвратить"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
        <h3 className="font-semibold text-slate-900 mb-1">Зона управляемых потерь</h3>
        <p className="text-sm text-slate-500 mb-4">
          {MANAGEABLE_TOTAL} из {REASONS_TOTAL.toLocaleString('ru-RU')} увольнений связаны с тем, на что компания
          влияет напрямую
        </p>
        <div className="space-y-2.5">
          {manageable.map((g) => (
            <div key={g.key}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium text-slate-800 flex-1">{g.label}</span>
                <span className="text-sm font-semibold text-slate-900">{g.total}</span>
                <span className="text-xs text-slate-400 w-11 text-right">{rPct(g.total).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(g.total / manageable[0].total) * 100}%`, background: g.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2.5 bg-amber-50 -mx-5 -mb-5 px-5 py-4 rounded-b-xl">
          <Icon name="TriangleAlert" size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900">
            Только {rPct(REASONS_TOTAL - MANAGEABLE_TOTAL).toFixed(0)}% уходов действительно вне контроля компании —
            здоровье, переезд, завершение проекта. Остальные {rPct(MANAGEABLE_TOTAL).toFixed(0)}% — результат условий
            труда, подбора, работы руководителей и оплаты.
          </p>
        </div>
      </div>
    </div>
  );
}