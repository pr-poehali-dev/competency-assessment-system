import Icon from "@/components/ui/icon";
import {
  PAYMENTS,
  PAID_2025,
  PAID_2026,
  PAID_TOTAL,
  EFIR_PAY_SHARE,
  EFIR_COST_2025,
  EFIR_COST_2026,
  EFIR_LOSS_2025,
  EFIR_LOSS_2026,
  EFIR_LOSS_TOTAL,
  HIRED_TOTAL,
  SMALL_PAID,
  SMALL_HIRED,
  SMALL_COST,
  money,
  mln,
} from "@/data/payments";

export default function AgencyPayments() {
  const rows = [...PAYMENTS].sort(
    (a, b) =>
      (b.paid2025 ?? 0) +
      (b.paid2026 ?? 0) -
      ((a.paid2025 ?? 0) + (a.paid2026 ?? 0)),
  );
  const max = Math.max(
    ...PAYMENTS.map((p) => (p.paid2025 ?? 0) + (p.paid2026 ?? 0)),
  );
  const costDiff = EFIR_COST_2025 - EFIR_COST_2026;

  const cards = [
    {
      icon: "Banknote",
      tone: "text-slate-700 bg-slate-100",
      value: `${mln(PAID_TOTAL)} млн ₽`,
      label: "оплачено агентствам за два года",
      sub: `${mln(PAID_2025)} млн в 2025 · ${mln(PAID_2026)} млн в 2026`,
      subTone: "text-slate-500",
    },
    {
      icon: "Crown",
      tone: "text-amber-700 bg-amber-100",
      value: `${EFIR_PAY_SHARE.toFixed(0)}%`,
      label: "всех выплат ушло в КА ЭФИР",
      sub: `${mln(PAID_TOTAL * (EFIR_PAY_SHARE / 100))} млн ₽ из ${mln(PAID_TOTAL)} млн`,
      subTone: "text-amber-600",
    },
    {
      icon: "Receipt",
      tone: "text-sky-700 bg-sky-100",
      value: `${Math.round(EFIR_COST_2026 / 1000)} тыс ₽`,
      label: "стоимость одного найма в 2026",
      sub: `было ${Math.round(EFIR_COST_2025 / 1000)} тыс ₽ — дешевле на ${Math.round((costDiff / EFIR_COST_2025) * 100)}%`,
      subTone: "text-emerald-600",
    },
    {
      icon: "TrendingDown",
      tone: "text-rose-700 bg-rose-100",
      value: `${mln(EFIR_LOSS_TOTAL)} млн ₽`,
      label: "оплачено за уволившихся",
      sub: "подбор оплачен, человек не остался",
      subTone: "text-rose-600",
    },
  ];

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 print-wide">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${c.tone}`}
            >
              <Icon name={c.icon} size={18} />
            </div>
            <div className="text-3xl font-bold text-slate-900 tabular-nums">
              {c.value}
            </div>
            <div className="text-sm text-slate-500 mt-1">{c.label}</div>
            <div className={`text-xs font-medium mt-2 ${c.subTone}`}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
        <div className="p-5 pb-4">
          <h3 className="font-semibold text-slate-900 mb-1">
            Сколько заплатили каждому агентству
          </h3>
          <p className="text-sm text-slate-500">
            Суммы оплат за оказанные услуги подбора, ₽
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-500">
                <th className="text-left font-medium px-5 py-2.5">Агентство</th>
                <th className="text-right font-medium px-3 py-2.5 whitespace-nowrap">
                  2025
                </th>
                <th className="text-right font-medium px-3 py-2.5 whitespace-nowrap">
                  2026
                </th>
                <th className="text-right font-medium px-3 py-2.5 whitespace-nowrap">
                  Всего
                </th>
                <th className="text-right font-medium px-3 py-2.5 whitespace-nowrap">
                  Нанято
                </th>
                <th className="text-right font-medium px-5 py-2.5 whitespace-nowrap">
                  Цена найма
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const total = (p.paid2025 ?? 0) + (p.paid2026 ?? 0);
                const hired = p.hired2025 + p.hired2026;
                return (
                  <tr
                    key={p.name}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: p.color }}
                        />
                        <span className="text-slate-700">{p.name}</span>
                      </div>
                      {total > 0 && (
                        <div className="mt-1.5 ml-4 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[220px]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(total / max) * 100}%`,
                              background: p.color,
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-400 whitespace-nowrap">
                      {p.paid2025 === null ? "—" : money(p.paid2025)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700 whitespace-nowrap">
                      {p.paid2026 === null ? "—" : money(p.paid2026)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                      {total > 0 ? money(total) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                      {hired || "—"}
                    </td>
                    <td className="px-5 py-2.5 text-right tabular-nums whitespace-nowrap">
                      {total > 0 && hired > 0 ? (
                        <span className="text-slate-700">
                          {money(Math.round(total / hired))}
                        </span>
                      ) : total > 0 ? (
                        <span className="text-rose-600 font-medium">
                          найма нет
                        </span>
                      ) : (
                        <span className="text-slate-300">нет данных</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-900">
                <td className="px-5 py-3">Итого</td>
                <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                  {money(PAID_2025)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                  {money(PAID_2026)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                  {money(PAID_TOTAL)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{HIRED_TOTAL}</td>
                <td className="px-5 py-3" />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 text-xs text-slate-500 leading-relaxed">
          По ИП Мухин / КА «Команда мечты ИТ» суммы оплат не предоставлены, хотя
          через агентство нанято 10 человек. Данные 2026 года — за неполный год.
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 print-wide">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 print-block">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Icon
                name="ArrowDownRight"
                size={18}
                className="text-emerald-600"
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Подбор стал дешевле
              </h3>
              <p className="text-sm text-slate-500">
                Средняя цена одного найма у КА ЭФИР
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                year: "2025 год",
                cost: EFIR_COST_2025,
                hired: 175,
                color: "#94a3b8",
              },
              {
                year: "2026 год",
                cost: EFIR_COST_2026,
                hired: 110,
                color: "#16a34a",
              },
            ].map((r) => (
              <div key={r.year}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-sm text-slate-700">{r.year}</span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">
                    {money(r.cost)} ₽
                    <span className="text-xs font-normal text-slate-400 ml-2">
                      {r.hired} чел.
                    </span>
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(r.cost / EFIR_COST_2025) * 100}%`,
                      background: r.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
            Один найм в 2026 году обходится на {money(costDiff)} ₽ дешевле, чем
            в 2025-м. При тех же 175 наймах экономия составила бы порядка{" "}
            {mln(costDiff * 175)} млн ₽ в год.
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 print-block">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
              <Icon name="CircleAlert" size={18} className="text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Деньги, потраченные впустую
              </h3>
              <p className="text-sm text-slate-500">
                Оплаченный подбор людей, которые уволились
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { l: "2025 год · 55 уволенных", v: EFIR_LOSS_2025 },
              { l: "2026 год · 14 уволенных", v: EFIR_LOSS_2026 },
            ].map((r) => (
              <div
                key={r.l}
                className="flex items-baseline justify-between border-b border-slate-100 pb-2"
              >
                <span className="text-sm text-slate-600">{r.l}</span>
                <span className="text-sm font-semibold text-rose-600 tabular-nums">
                  {money(r.v)} ₽
                </span>
              </div>
            ))}
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-semibold text-slate-900">
                Всего за два года
              </span>
              <span className="text-xl font-bold text-rose-600 tabular-nums">
                {mln(EFIR_LOSS_TOTAL)} млн ₽
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
            <p className="text-xs text-amber-900 leading-relaxed">
              Отдельно: остальные агентства получили {money(SMALL_PAID)} ₽ за{' '}
              {SMALL_HIRED} человек — это {money(SMALL_COST)} ₽ за найм, почти
              втрое дороже среднего по КА ЭФИР. Небольшой разовый подбор
              обходится компании заметно дороже.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}