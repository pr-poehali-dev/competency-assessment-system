import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import Icon from '@/components/ui/icon';
import {
  FIRED_TENURE,
  FIRED_POSITIONS,
  EARLY_FIRED,
  AG_FIRED_2025,
  AG_TOTAL_2025,
  AG_TURNOVER_2025,
  EFIR,
  EFIR_TURNOVER,
  agPct,
} from '@/data/agencies';

const tenureData = FIRED_TENURE.map((f) => ({ name: f.band, count: f.count, color: f.color }));

export default function AgencyQuality() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
      <div className="p-5 pb-0 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
          <Icon name="UserMinus" size={18} className="text-rose-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Качество найма: кто не задержался</h3>
          <p className="text-sm text-slate-500">
            Из {AG_TOTAL_2025} человек, нанятых через агентства в 2025 году, уволилось {AG_FIRED_2025}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-px bg-slate-200 mt-5 border-y border-slate-200">
        <div className="bg-white p-4">
          <div className="text-sm text-slate-500">Текучесть найма 2025</div>
          <div className="text-2xl font-bold text-rose-600 mt-1 tabular-nums">{AG_TURNOVER_2025.toFixed(1)}%</div>
          <div className="text-xs text-slate-500 mt-1">
            {AG_FIRED_2025} из {AG_TOTAL_2025} нанятых
          </div>
        </div>
        <div className="bg-white p-4">
          <div className="text-sm text-slate-500">Текучесть КА ЭФИР</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">{EFIR_TURNOVER.toFixed(1)}%</div>
          <div className="text-xs text-slate-500 mt-1">
            {EFIR.fired2025} из {EFIR.hired2025} нанятых
          </div>
        </div>
        <div className="bg-white p-4">
          <div className="text-sm text-slate-500">Ушли в первый год</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {agPct(EARLY_FIRED, AG_FIRED_2025).toFixed(0)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {EARLY_FIRED} из {AG_FIRED_2025} уволившихся
          </div>
        </div>
      </div>

      <div className="p-5 grid lg:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-semibold text-slate-700 mb-1">Сколько проработали до увольнения</div>
          <p className="text-xs text-slate-500 mb-3">Чем левее столбик, тем быстрее ушёл сотрудник</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tenureData} margin={{ top: 18, right: 8, left: -14, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(v: number) => [`${v} чел.`, 'Уволилось']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {tenureData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
                <LabelList dataKey="count" position="top" fontSize={11} fontWeight={700} fill="#475569" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-700 mb-1">Должности с наибольшими потерями</div>
          <p className="text-xs text-slate-500 mb-3">Где найм через агентство приходилось повторять</p>
          <div className="space-y-2">
            {FIRED_POSITIONS.map((p) => (
              <div key={p.pos} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 flex-1 truncate">{p.pos}</span>
                <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden shrink-0">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(p.count / 3) * 100}%` }} />
                </div>
                <span className="text-xs font-bold tabular-nums text-slate-900 w-6 text-right">{p.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 flex items-start gap-2">
            <Icon name="TriangleAlert" size={14} className="text-rose-600 mt-0.5 shrink-0" />
            <p className="text-xs text-rose-900 leading-relaxed">
              Больше всего теряем на инженерных и ассистентских ролях — ГИП, помощник ГИП и помощник руководителя. По
              этим позициям стоит пересмотреть требования к кандидатам от агентства.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-5 py-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong>Вывод.</strong> Каждый шестой нанятый через агентство сотрудник уходит, причём{' '}
          {agPct(EARLY_FIRED, AG_FIRED_2025).toFixed(0)}% увольнений происходит в первый год работы. Основные потери
          сосредоточены в первые 6–12 месяцев — это зона, где стоит усилить адаптацию и договориться с агентством о
          гарантийной замене кандидата.
        </p>
      </div>
    </div>
  );
}
