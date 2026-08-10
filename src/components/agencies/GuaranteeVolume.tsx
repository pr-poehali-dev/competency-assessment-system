import Icon from '@/components/ui/icon';
import {
  COST_ROWS,
  COST_2025,
  COST_2026,
  COST_TOTAL,
  COST_AVG,
  GUARANTEE_BANDS,
  COVERED_CASES,
  UNCOVERED_CASES,
  COVERED_SUM,
  UNCOVERED_SUM,
  COVERED_PCT,
  BASE_SALARY,
  money,
  moneyFull,
} from '@/data/agencyTerms';

export default function GuaranteeVolume() {
  const rows = COST_ROWS.filter((r) => r.fired2025 + r.fired2026 > 0);
  const maxSum = Math.max(...rows.map((r) => r.rate * (r.fired2025 + r.fired2026)));

  const kpis = [
    { v: money(COST_2025), l: 'подбор уволившихся в 2025', s: '58 человек', tone: 'text-slate-900' },
    { v: money(COST_2026), l: 'подбор уволившихся в 2026', s: '20 человек', tone: 'text-slate-900' },
    { v: money(COST_TOTAL), l: 'всего за два года', s: '78 человек', tone: 'text-rose-600' },
    { v: money(COVERED_SUM), l: 'покрыто гарантией', s: `${COVERED_PCT.toFixed(0)}% случаев`, tone: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.l} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className={`text-xl font-bold tabular-nums ${k.tone}`}>{k.v}</div>
            <div className="text-xs text-slate-600 mt-1 leading-snug">{k.l}</div>
            <div className="text-[11px] text-slate-400 mt-1">{k.s}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
        <div className="p-5 pb-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
            <Icon name="Receipt" size={18} className="text-rose-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Стоимость подбора по уволившимся</h3>
            <p className="text-sm text-slate-500">Расчёт по ставкам из действующих договоров</p>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-3">
          {rows.map((r) => {
            const total = r.rate * (r.fired2025 + r.fired2026);
            return (
              <div key={r.agency}>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-sm font-medium text-slate-800 truncate">{r.agency}</span>
                    <span className="text-[11px] text-slate-400 shrink-0">{r.rateLabel}</span>
                  </div>
                  <div className="flex items-baseline gap-3 shrink-0">
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {r.fired2025 + r.fired2026} чел.
                    </span>
                    <span className="text-sm font-semibold text-slate-900 tabular-nums">{money(total)}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(total / maxSum) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between gap-4">
          <div className="text-xs leading-snug">
            Общая стоимость подбора людей, которые уволились в год приёма
            <div className="text-white/50 mt-0.5">Средняя цена одного такого найма — {moneyFull(COST_AVG)}</div>
          </div>
          <div className="text-2xl font-bold tabular-nums shrink-0">{money(COST_TOTAL)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
        <div className="p-5 pb-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <Icon name="ShieldCheck" size={18} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Объём гарантийных обязательств</h3>
            <p className="text-sm text-slate-500">Сколько агентства должны закрыть бесплатной заменой</p>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="flex h-10 rounded-lg overflow-hidden mb-3">
            <div
              className="bg-emerald-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${COVERED_PCT}%` }}
            >
              {COVERED_PCT.toFixed(0)}% в гарантии
            </div>
            <div
              className="bg-slate-300 flex items-center justify-center text-slate-700 text-xs font-semibold"
              style={{ width: `${100 - COVERED_PCT}%` }}
            >
              {(100 - COVERED_PCT).toFixed(0)}%
            </div>
          </div>

          <div className="space-y-2">
            {GUARANTEE_BANDS.map((b) => (
              <div
                key={b.band}
                className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 ${
                  b.covered ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <Icon
                  name={b.covered ? 'CircleCheck' : 'CircleX'}
                  size={16}
                  className={b.covered ? 'text-emerald-600 shrink-0' : 'text-slate-400 shrink-0'}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800">{b.band}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{b.note}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-900 tabular-nums">{money(b.cases * COST_AVG)}</div>
                  <div className="text-[11px] text-slate-400 tabular-nums">{b.cases} чел.</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-slate-200 border-y border-slate-200">
          <div className="bg-emerald-50 p-4">
            <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-1">
              Агентства обязаны заменить бесплатно
            </div>
            <div className="text-2xl font-bold text-emerald-700 tabular-nums">{money(COVERED_SUM)}</div>
            <div className="text-[11px] text-emerald-800 mt-1 leading-snug">
              {COVERED_CASES} человек ушли в пределах гарантийного срока
            </div>
          </div>
          <div className="bg-white p-4">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Вне гарантии — деньги не вернуть
            </div>
            <div className="text-2xl font-bold text-slate-700 tabular-nums">{money(UNCOVERED_SUM)}</div>
            <div className="text-[11px] text-slate-500 mt-1 leading-snug">
              {UNCOVERED_CASES} человек проработали от 6 до 12 месяцев
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>Что это значит.</strong> Около {money(COVERED_SUM)} — это объём работ, который агентства должны
            выполнить повторно без оплаты. Гарантия срабатывает только при заявленной претензии в срок, поэтому важно
            фиксировать каждый случай. Если обращения не оформлялись, компания фактически оплатила подбор дважды.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm print-block">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <Icon name="Calculator" size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Как считали и что важно уточнить</h3>
            <ul className="space-y-1.5 text-xs text-slate-600 leading-snug">
              <li className="flex gap-1.5">
                <span className="text-amber-500 shrink-0">·</span>
                Ставки взяты из договоров: у ЭФИР и Вектор К — фиксированная сумма, у A.N.T. и Визави — 15% годового
                дохода, у ИП Мухина — тариф среднего уровня.
              </li>
              <li className="flex gap-1.5">
                <span className="text-amber-500 shrink-0">·</span>
                Зарплат уволившихся в отчётах нет. Для процентных ставок принята базовая зарплата{' '}
                {BASE_SALARY.toLocaleString('ru-RU')} ₽ в месяц — это допущение, а не факт.
              </li>
              <li className="flex gap-1.5">
                <span className="text-amber-500 shrink-0">·</span>
                Для ЭФИР взят тариф при зарплате до 200 000 ₽. По топовым позициям стоимость выше, поэтому реальная
                сумма, скорее всего, больше расчётной.
              </li>
              <li className="flex gap-1.5">
                <span className="text-amber-500 shrink-0">·</span>
                Суммы указаны без НДС. У ЭФИР и A.N.T. к стоимости добавляется 5%.
              </li>
            </ul>
            <p className="text-xs text-amber-800 mt-3 leading-snug bg-amber-50 rounded-md px-3 py-2">
              Чтобы получить точную цифру, нужны фактические суммы актов по каждому закрытому подбору. Расчёт выше
              показывает порядок величины.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
