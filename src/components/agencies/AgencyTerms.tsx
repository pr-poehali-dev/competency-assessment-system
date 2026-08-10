import Icon from '@/components/ui/icon';
import {
  TERMS,
  TERMS_DATE,
  TERMS_COUNT,
  GUARANTEE_MAX,
  GUARANTEE_MIN,
  SPLIT_PAYMENT_COUNT,
} from '@/data/agencyTerms';

const priceLabel: Record<string, { text: string; cls: string }> = {
  fixed: { text: 'Фикс', cls: 'bg-sky-100 text-sky-700' },
  percent: { text: '% от дохода', cls: 'bg-violet-100 text-violet-700' },
  mixed: { text: 'Фикс + %', cls: 'bg-amber-100 text-amber-700' },
};

export default function AgencyTerms() {
  const sorted = [...TERMS].sort((a, b) => b.guaranteeMax - a.guaranteeMax);

  const cards = [
    { v: `${TERMS_COUNT}`, l: 'агентств в договорах', s: `актуально на ${TERMS_DATE}` },
    { v: `${GUARANTEE_MIN}–${GUARANTEE_MAX} мес.`, l: 'разброс гарантии замены', s: 'условия сильно отличаются' },
    { v: '15–18%', l: 'ставка от годового дохода', s: 'у большинства подрядчиков' },
    { v: `${SPLIT_PAYMENT_COUNT} из ${TERMS_COUNT}`, l: 'платят частями', s: 'остальные — 100% сразу' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.l} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-xl font-bold text-slate-900 tabular-nums">{c.v}</div>
            <div className="text-xs text-slate-600 mt-1 leading-snug">{c.l}</div>
            <div className="text-[11px] text-slate-400 mt-1">{c.s}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
        <div className="p-5 pb-3 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
            <Icon name="FileText" size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Условия сотрудничества по договорам</h3>
            <p className="text-sm text-slate-500">Стоимость, гарантия замены и порядок оплаты на {TERMS_DATE}</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {sorted.map((t) => {
            const pl = priceLabel[t.priceType];
            return (
              <div key={t.name} className="p-5 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="font-semibold text-slate-900">{t.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pl.cls}`}>{pl.text}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {t.vat}
                  </span>
                  {t.hired > 0 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      нанято {t.hired}
                    </span>
                  )}
                  {t.hired === 0 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">
                      наймов нет
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 ml-auto">
                    Договор {t.contract} · {t.entity}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Icon name="Banknote" size={13} className="text-slate-400" />
                      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                        Стоимость
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {t.price.map((p) => (
                        <li key={p} className="text-xs text-slate-700 leading-snug flex gap-1.5">
                          <span className="text-slate-300 shrink-0">·</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Icon name="ShieldCheck" size={13} className="text-emerald-500" />
                      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                        Гарантийная замена
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-1.5">
                      <span
                        className={`text-2xl font-bold tabular-nums ${
                          t.guaranteeMax >= 6
                            ? 'text-emerald-600'
                            : t.guaranteeMax >= 5
                              ? 'text-amber-600'
                              : 'text-rose-600'
                        }`}
                      >
                        {t.guaranteeMax}
                      </span>
                      <span className="text-xs text-slate-500">мес. максимум</span>
                    </div>
                    <ul className="space-y-1">
                      {t.guarantee.map((g) => (
                        <li key={g} className="text-xs text-slate-600 leading-snug flex gap-1.5">
                          <span className="text-slate-300 shrink-0">·</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Icon name="Wallet" size={13} className="text-slate-400" />
                      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                        Условия оплаты
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-snug">{t.payment}</p>
                    {t.paymentSplit && (
                      <div className="mt-2 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-1.5">
                        <p className="text-[11px] text-emerald-800 leading-snug">
                          Единственная схема с оплатой частями — компания рискует меньше
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 space-y-2">
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>Что показывают условия.</strong> Гарантия замены есть у всех подрядчиков, но разброс большой: от 3
            месяцев у A.N.T. и ПрофиСтафф до 8 месяцев у ИП Мухина. При этом основной объём найма идёт через КА ЭФИР,
            где гарантия зависит от позиции и составляет от 3 до 6 месяцев.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Почти все агентства получают 100% оплаты сразу после выхода кандидата. Исключение — Визави Консалт: 70%
            после выхода и 30% после испытательного срока. Такая схема напрямую связывает выплату с тем, задержался
            сотрудник или нет, и снижает риск компании при быстрых уходах.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <Icon name="Scale" size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Гарантия против реальных сроков ухода</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              В 2026 году средний срок работы до увольнения — 2 месяца, а 14 из 20 ушли, не отработав и трёх. Это
              значит, что почти все случаи попадают в гарантийный период даже по самым коротким договорам, и подбор
              должен закрываться бесплатно.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}