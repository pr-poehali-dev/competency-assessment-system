import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import Icon from '@/components/ui/icon';
import {
  FIRED_TENURE,
  FIRED_POSITIONS,
  FIRED_AGE_AVG_2025,
  FIRED_AGE_AVG_2026,
  FAST_FIRED_2025,
  FAST_FIRED_2026,
  AG_FIRED_2025,
  AG_FIRED_2026,
  AG_TOTAL_2026,
  AG_TURNOVER_2025,
  AG_TURNOVER_2026,
  EFIR,
  EFIR_TURNOVER,
  EFIR_TURNOVER_2026,
  agPct,
} from '@/data/agencies';

const tenureData = FIRED_TENURE.map((f) => ({ name: f.band, y2025: f.y2025, y2026: f.y2026 }));

export default function AgencyQuality() {
  const topFired = [...FIRED_POSITIONS].sort((a, b) => b.y2025 + b.y2026 - (a.y2025 + a.y2026)).slice(0, 6);
  const maxFired = topFired[0].y2025 + topFired[0].y2026;
  const turnDiff = AG_TURNOVER_2026 - AG_TURNOVER_2025;

  const cards = [
    {
      label: 'Уволилось из нанятых',
      v2025: `${AG_FIRED_2025} чел.`,
      v2026: `${AG_FIRED_2026} чел.`,
      note: `из ${AG_TOTAL_2026} нанятых в 2026`,
    },
    {
      label: 'Текучесть найма',
      v2025: `${AG_TURNOVER_2025.toFixed(1)}%`,
      v2026: `${AG_TURNOVER_2026.toFixed(1)}%`,
      note: `${turnDiff < 0 ? 'снижение' : 'рост'} на ${Math.abs(turnDiff).toFixed(1)} п.п.`,
      good: turnDiff < 0,
    },
    {
      label: 'Ушли за первые полгода',
      v2025: `${agPct(FAST_FIRED_2025, AG_FIRED_2025).toFixed(0)}%`,
      v2026: `${agPct(FAST_FIRED_2026, AG_FIRED_2026).toFixed(0)}%`,
      note: `${FAST_FIRED_2026} из ${AG_FIRED_2026} уволившихся`,
    },
    {
      label: 'Текучесть КА ЭФИР',
      v2025: `${EFIR_TURNOVER.toFixed(1)}%`,
      v2026: `${EFIR_TURNOVER_2026.toFixed(1)}%`,
      note: `${EFIR.fired2026} из ${EFIR.hired2026} нанятых`,
      good: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
      <div className="p-5 pb-0 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
          <Icon name="UserMinus" size={18} className="text-rose-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Качество найма: кто не задержался</h3>
          <p className="text-sm text-slate-500">
            Сотрудники, которых наняли и уволили в течение одного и того же года
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 mt-5 border-y border-slate-200">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-4">
            <div className="text-[11px] text-slate-500 leading-snug h-8">{c.label}</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-semibold text-slate-400 tabular-nums">{c.v2025}</span>
              <Icon name="ArrowRight" size={12} className="text-slate-300" />
              <span className="text-2xl font-bold text-slate-900 tabular-nums">{c.v2026}</span>
            </div>
            <div className={`text-[11px] font-medium mt-1.5 ${c.good ? 'text-emerald-600' : 'text-slate-500'}`}>
              {c.note}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 grid lg:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-semibold text-slate-700 mb-1">Сколько проработали до увольнения</div>
          <p className="text-xs text-slate-500 mb-3">Чем левее столбик, тем быстрее ушёл сотрудник</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-300 shrink-0" />
              <span className="text-xs text-slate-600">2025 год</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#dc2626] shrink-0" />
              <span className="text-xs text-slate-600">2026 год</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tenureData} margin={{ top: 18, right: 8, left: -14, bottom: 4 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(v: number, n: string) => [`${v} чел.`, n === 'y2025' ? '2025 год' : '2026 год']}
              />
              <Bar dataKey="y2025" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="y2025">
                <LabelList dataKey="y2025" position="top" fontSize={10} fill="#94a3b8" />
              </Bar>
              <Bar dataKey="y2026" fill="#dc2626" radius={[4, 4, 0, 0]} name="y2026">
                <LabelList dataKey="y2026" position="top" fontSize={11} fontWeight={700} fill="#dc2626" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 flex items-start gap-2">
            <Icon name="Clock" size={14} className="text-rose-600 mt-0.5 shrink-0" />
            <p className="text-xs text-rose-900 leading-relaxed">
              Ни один из уволившихся не проработал больше года. В 2026 году{' '}
              {agPct(FIRED_TENURE[0].y2026, AG_FIRED_2026).toFixed(0)}% ушли, не отработав и трёх месяцев — подбор по
              этим позициям пришлось начинать заново почти сразу.
            </p>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-700 mb-1">Должности с наибольшими потерями</div>
          <p className="text-xs text-slate-500 mb-3">Где найм через агентство приходилось повторять</p>

          <div className="space-y-2.5">
            {topFired.map((p) => (
              <div key={p.pos}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-700 flex-1 truncate">{p.pos}</span>
                  <span className="text-[11px] text-slate-400 tabular-nums">{p.y2025} в 2025</span>
                  <span className="text-xs font-bold tabular-nums text-rose-600 w-5 text-right">{p.y2026}</span>
                </div>
                <div className="flex h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-300" style={{ width: `${(p.y2025 / maxFired) * 100}%` }} />
                  <div className="h-full bg-rose-500" style={{ width: `${(p.y2026 / maxFired) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 flex items-start gap-2">
            <Icon name="UserRound" size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Помощник руководителя — самая проблемная позиция оба года. Средний возраст уволившихся вырос с{' '}
              {FIRED_AGE_AVG_2025} до {FIRED_AGE_AVG_2026} года, при этом в 2026 году не ушёл ни один сотрудник моложе
              30 лет.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-5 py-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong>Вывод.</strong> Текучесть найма через агентства снизилась с {AG_TURNOVER_2025.toFixed(1)}% до{' '}
          {AG_TURNOVER_2026.toFixed(1)}% — прогресс есть, но природа потерь не изменилась: люди уходят в первые месяцы,
          а не после года работы. Это указывает не на квалификацию кандидатов, а на несовпадение ожиданий при найме.
          Гарантия замены в договоре покрывает финансовую часть, но не возвращает потерянное время на объектах —
          основной резерв в том, чтобы точнее описывать условия работы на этапе собеседования.
        </p>
      </div>
    </div>
  );
}