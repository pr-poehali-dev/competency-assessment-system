import { useState } from 'react';
import Icon from '@/components/ui/icon';

const HIRES_2026 = 787;
const REF_2026 = 354;
const REF_SHARE = 45.0;
const TARGET_SHARE = 50;
const TARGET_HIRES = Math.round((HIRES_2026 * TARGET_SHARE) / 100);
const EXTRA = TARGET_HIRES - REF_2026;

const AGENCY_COST = 237696;
const CHURN_REF = 7.9;
const CHURN_AGENCY = 17.9;
const SALARY = 200000;
const WORK_DAYS = 21;
const LOST_DAYS = 60;

const DAY_COST = SALARY / WORK_DAYS;
const SAVE_HIRING = EXTRA * AGENCY_COST;
const LESS_QUITS = (EXTRA * (CHURN_AGENCY - CHURN_REF)) / 100;
const SAVE_CHURN = LESS_QUITS * LOST_DAYS * DAY_COST;
const BENEFIT = SAVE_HIRING + SAVE_CHURN;

const PAID_PEOPLE = Math.round(TARGET_HIRES * (1 - CHURN_REF / 100));
const BREAK_EVEN = Math.round(BENEFIT / PAID_PEOPLE / 1000) * 1000;

const money = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} млн ₽`;
  if (Math.abs(v) >= 1000) return `${Math.round(v / 1000)} тыс. ₽`;
  return `${Math.round(v)} ₽`;
};

const full = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`;

const BONUS_STEPS = [10000, 20000, 30000, 40000, 50000, 75000, 100000];

export default function ReferralEconomics() {
  const [bonus, setBonus] = useState(30000);

  const cost = PAID_PEOPLE * bonus;
  const result = BENEFIT - cost;
  const positive = result >= 0;
  const roi = cost > 0 ? (result / cost) * 100 : 0;
  const costPerHire = Math.round(bonus / (1 - CHURN_REF / 100));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 print-block">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#1a1a2e] flex items-center justify-center shrink-0">
            <Icon name="Calculator" size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">Расчёт премии за приведённого сотрудника</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Задача 2.3 плана: поднять долю найма по рекомендациям с {REF_SHARE}% до {TARGET_SHARE}%. Расчёт при
              средней зарплате {full(SALARY)} в месяц.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { v: String(HIRES_2026), l: 'наймов в 2026 году', s: 'база расчёта' },
            { v: `${REF_2026}`, l: `по рекомендациям — ${REF_SHARE}%`, s: 'факт сегодня' },
            { v: `${TARGET_HIRES}`, l: `цель — ${TARGET_SHARE}% найма`, s: 'по задаче 2.3' },
            { v: `+${EXTRA}`, l: 'человек нужно добавить', s: 'прирост за год', accent: true },
          ].map((k) => (
            <div
              key={k.l}
              className={`rounded-lg border p-3 ${k.accent ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}
            >
              <div className={`text-2xl font-bold ${k.accent ? 'text-emerald-700' : 'text-slate-900'}`}>{k.v}</div>
              <div className="text-xs text-slate-600 mt-1 leading-snug">{k.l}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{k.s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 print-block">
        <h4 className="font-semibold text-slate-900 mb-1">Что компания выигрывает от 40 дополнительных рекомендаций</h4>
        <p className="text-xs text-slate-500 mb-4">
          Эти 40 человек иначе пришли бы через агентства — самый дорогой канал с худшим удержанием.
        </p>

        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2">
                  <Icon name="Wallet" size={15} className="text-emerald-600" />
                  <span className="font-semibold text-slate-900 text-sm">Не платим агентствам за подбор</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Фактическая стоимость найма через агентства в 2026 году — {full(AGENCY_COST)} за человека
                  (26,1 млн ₽ за 110 нанятых). Умножаем на {EXTRA} человек.
                </p>
              </div>
              <div className="text-xl font-bold text-emerald-700 tabular-nums">{money(SAVE_HIRING)}</div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2">
                  <Icon name="UserCheck" size={15} className="text-emerald-600" />
                  <span className="font-semibold text-slate-900 text-sm">Меньше быстрых уходов</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  По рекомендациям увольняется {CHURN_REF}%, через агентства — {CHURN_AGENCY}%. Разница в 10 пунктов на{' '}
                  {EXTRA} человек — это {LESS_QUITS.toFixed(1)} несостоявшихся увольнения. Каждое стоит {LOST_DAYS} дней
                  простоя: {full(Math.round(LOST_DAYS * DAY_COST))}.
                </p>
              </div>
              <div className="text-xl font-bold text-emerald-700 tabular-nums">{money(SAVE_CHURN)}</div>
            </div>
          </div>

          <div className="rounded-lg bg-[#1a1a2e] p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-white font-semibold">Итого выгода за год</div>
              <div className="text-xs text-slate-400 mt-0.5">Столько можно потратить на премии, не уйдя в минус</div>
            </div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{money(BENEFIT)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 print-block">
        <h4 className="font-semibold text-slate-900 mb-1">Сколько платить за рекомендацию</h4>
        <p className="text-xs text-slate-500 mb-4">
          Премия платится за всех принятых по рекомендации, а не только за прирост — иначе программа не будет понятна
          сотрудникам. Выплата после испытательного срока, поэтому платим {PAID_PEOPLE} раз из {TARGET_HIRES}: часть
          новичков не доработает.
        </p>

        <div className="no-print flex flex-wrap gap-2 mb-4">
          {BONUS_STEPS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBonus(b)}
              className={`text-sm rounded-lg px-3 py-2 border transition-colors ${
                bonus === b
                  ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {b.toLocaleString('ru-RU')} ₽
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500 mb-1">Премия за одного</div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">{full(bonus)}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              с учётом невыплат — {full(costPerHire)} за оставшегося
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500 mb-1">Затраты на премии за год</div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">{money(cost)}</div>
            <div className="text-[11px] text-slate-400 mt-1">{PAID_PEOPLE} выплат по итогам испытательного срока</div>
          </div>

          <div
            className={`rounded-lg border p-4 ${positive ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}
          >
            <div className={`text-xs mb-1 ${positive ? 'text-emerald-700' : 'text-rose-700'}`}>
              {positive ? 'Чистая выгода' : 'Убыток'}
            </div>
            <div className={`text-2xl font-bold tabular-nums ${positive ? 'text-emerald-700' : 'text-rose-700'}`}>
              {positive ? '+' : ''}
              {money(result)}
            </div>
            <div className={`text-[11px] mt-1 ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              возврат на вложенный рубль {roi > 0 ? '+' : ''}
              {roi.toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 flex gap-3">
          <Icon name="TriangleAlert" size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 leading-relaxed">
            <span className="font-semibold">Точка безубыточности — около {full(BREAK_EVEN)}.</span> Премия выше этой
            суммы съедает всю экономию: платить придётся за все {TARGET_HIRES} рекомендаций, а экономим мы только на{' '}
            {EXTRA} дополнительных. Премия в размере оклада ({full(SALARY)}) обошлась бы в{' '}
            {money(PAID_PEOPLE * SALARY)} — это в шесть раз больше всей выгоды.
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 print-block">
        <div className="flex items-start gap-3">
          <Icon name="CircleCheckBig" size={20} className="text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-900 mb-2">Рекомендация: премия 20–30 тысяч рублей</h4>
            <ul className="space-y-1.5 text-sm text-emerald-900/90">
              <li className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>
                  При 20 000 ₽ программа приносит около {money(BENEFIT - PAID_PEOPLE * 20000)} чистой выгоды в год —
                  каждый вложенный рубль возвращает примерно 1,6 рубля.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>
                  Это 10–15% месячной зарплаты — заметная сумма для рабочего, чтобы привести знакомого, и вшестеро
                  дешевле агентского найма.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>
                  Платить только после испытательного срока: сотрудник заинтересован приводить тех, кто останется, а не
                  любого знакомого.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>
                  Выше {full(BREAK_EVEN)} программа уходит в минус. Если нужна более крупная сумма — платить повышенную премию
                  только за дефицитные специальности, а не за всех.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        В расчёте не учтены: экономия на времени рекрутеров, эффект от роста лояльности сотрудников-рекомендателей и
        налоги с премии. Стоимость агентского найма взята фактическая за 2026 год; по договорам с агентствами при
        зарплате 200 000 ₽ ставка выше — от 330 000 до 346 500 ₽ за человека, то есть реальная экономия может оказаться
        больше.
      </p>
    </div>
  );
}
