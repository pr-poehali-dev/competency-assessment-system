import Icon from '@/components/ui/icon';
import {
  VACANCIES,
  VAC_POSITIONS,
  VAC_PEOPLE,
  VAC_AGE_BANDS,
  VAC_DEPTS,
  VAC_SALARY_AVG,
  VAC_MONTHLY_BUDGET,
  VAC_OLD_PEOPLE,
  vacancyMonths,
} from '@/data/vacancies';

const ageTone = (m: number | null) => {
  if (m === null) return 'text-slate-400 bg-slate-50 border-slate-200';
  if (m < 3) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (m < 6) return 'text-amber-700 bg-amber-50 border-amber-200';
  if (m < 12) return 'text-orange-700 bg-orange-50 border-orange-200';
  return 'text-rose-700 bg-rose-50 border-rose-200';
};

export default function OpenVacancies() {
  const cards = [
    {
      icon: 'ClipboardList',
      tone: 'text-slate-700 bg-slate-100',
      value: String(VAC_PEOPLE),
      label: 'человек нужно закрыть',
      sub: `${VAC_POSITIONS} позиций в заявках`,
      subTone: 'text-slate-500',
    },
    {
      icon: 'CalendarClock',
      tone: 'text-rose-700 bg-rose-100',
      value: String(VAC_OLD_PEOPLE),
      label: 'вакансий висят больше полугода',
      sub: `${((VAC_OLD_PEOPLE / VAC_PEOPLE) * 100).toFixed(0)}% всего объёма`,
      subTone: 'text-rose-600',
    },
    {
      icon: 'Wallet',
      tone: 'text-amber-700 bg-amber-100',
      value: `${VAC_SALARY_AVG} тыс`,
      label: 'средний оклад по заявке',
      sub: 'по нижней границе вилки',
      subTone: 'text-amber-600',
    },
    {
      icon: 'Coins',
      tone: 'text-sky-700 bg-sky-100',
      value: `${VAC_MONTHLY_BUDGET} млн ₽`,
      label: 'месячный фонд при закрытии',
      sub: 'минимальная оценка',
      subTone: 'text-sky-600',
    },
  ];

  const sorted = [...VACANCIES].sort((a, b) => (vacancyMonths(b) ?? -1) - (vacancyMonths(a) ?? -1));

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 print-wide">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${c.tone}`}>
              <Icon name={c.icon} size={18} />
            </div>
            <div className="text-3xl font-bold text-slate-900 tabular-nums">{c.value}</div>
            <div className="text-sm text-slate-500 mt-1">{c.label}</div>
            <div className={`text-xs font-medium mt-2 ${c.subTone}`}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 print-wide">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 print-block">
          <h3 className="font-semibold text-slate-900 mb-1">Как долго вакансии в работе</h3>
          <p className="text-sm text-slate-500 mb-4">Срок с даты поступления заявки в агентство</p>
          <div className="space-y-3">
            {VAC_AGE_BANDS.map((b) => (
              <div key={b.band}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-sm text-slate-700">{b.band}</span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">
                    {b.people} чел.
                    <span className="text-xs font-normal text-slate-400 ml-2">
                      {((b.people / VAC_PEOPLE) * 100).toFixed(0)}%
                    </span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(b.people / VAC_PEOPLE) * 100}%`, background: b.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
            Самые старые заявки открыты с 2024 года — это ГАПы и ГИПы отдела проектирования объектов СИВ, 18 человек
            суммарно.
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 print-block">
          <h3 className="font-semibold text-slate-900 mb-1">Где нужны люди</h3>
          <p className="text-sm text-slate-500 mb-4">Потребность по подразделениям, человек</p>
          <div className="space-y-3">
            {VAC_DEPTS.map((d) => (
              <div key={d.dept}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-sm text-slate-700">{d.dept}</span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">{d.people}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#f59e0b]"
                    style={{ width: `${(d.people / VAC_DEPTS[0].people) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
            Проектный блок — ПТИ и отдел проектирования СИВ — даёт больше половины всей потребности.
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
        <div className="p-5 pb-4">
          <h3 className="font-semibold text-slate-900 mb-1">Полный список вакансий в работе</h3>
          <p className="text-sm text-slate-500">Данные КА ЭФИР на 10 августа 2026 года</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-500">
                <th className="text-left font-medium px-5 py-2.5">Вакансия</th>
                <th className="text-left font-medium px-3 py-2.5 whitespace-nowrap">Подразделение</th>
                <th className="text-center font-medium px-3 py-2.5 whitespace-nowrap">Чел.</th>
                <th className="text-right font-medium px-3 py-2.5 whitespace-nowrap">Оклад, ₽</th>
                <th className="text-right font-medium px-3 py-2.5 whitespace-nowrap">В работе с</th>
                <th className="text-right font-medium px-5 py-2.5 whitespace-nowrap">Срок</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((v, i) => {
                const m = vacancyMonths(v);
                return (
                  <tr key={`${v.title}-${v.dept}-${i}`} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-2.5 text-slate-700">{v.title}</td>
                    <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{v.dept}</td>
                    <td className="px-3 py-2.5 text-center tabular-nums font-semibold text-slate-900">{v.count}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700 whitespace-nowrap">{v.salary}</td>
                    <td className="px-3 py-2.5 text-right text-slate-500 whitespace-nowrap">{v.sinceLabel}</td>
                    <td className="px-5 py-2.5 text-right whitespace-nowrap">
                      <span
                        className={`inline-block text-xs font-medium border rounded-md px-2 py-0.5 tabular-nums ${ageTone(m)}`}
                      >
                        {m === null ? '—' : m >= 12 ? `${Math.floor(m / 12)} г.` : `${Math.round(m)} мес.`}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-900">
                <td className="px-5 py-3" colSpan={2}>
                  Всего в работе
                </td>
                <td className="px-3 py-3 text-center tabular-nums">{VAC_PEOPLE}</td>
                <td className="px-3 py-3 text-right text-xs font-medium text-slate-500" colSpan={3}>
                  {VAC_POSITIONS} позиций
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 text-xs text-slate-500 leading-relaxed">
          Для части заявок в исходном файле указан только год или месяц поступления — срок по ним рассчитан
          приблизительно. Оклад приведён так, как заявлен заказчиком.
        </div>
      </div>
    </>
  );
}
