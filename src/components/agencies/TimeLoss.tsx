import Icon from '@/components/ui/icon';
import {
  AG_FIRED_2025,
  AG_FIRED_2026,
  AVG_TENURE_2025,
  AVG_TENURE_2026,
  SEARCH_DAYS,
  ONBOARDING_DAYS,
  MANAGER_HOURS,
  WORK_DAYS_MONTH,
  LOST_DAYS_2025,
  LOST_DAYS_2026,
  MANAGER_HOURS_2026,
} from '@/data/agencies';

export default function TimeLoss() {
  const months2026 = LOST_DAYS_2026 / WORK_DAYS_MONTH;
  const months2025 = LOST_DAYS_2025 / WORK_DAYS_MONTH;
  const yearsEquiv = months2026 / 12;
  const managerDays = MANAGER_HOURS_2026 / 8;

  const stages = [
    {
      icon: 'Search',
      title: 'Поиск замены',
      days: SEARCH_DAYS,
      text: 'Агентство подбирает нового кандидата, согласует и выводит его на работу. Вакансия открыта.',
    },
    {
      icon: 'GraduationCap',
      title: 'Выход на полную отдачу',
      days: ONBOARDING_DAYS,
      text: 'Новый сотрудник входит в проект и объекты. Работает, но ещё не в полном объёме.',
    },
  ];

  const cards = [
    {
      label: 'Потеряно рабочих дней',
      v2025: `${LOST_DAYS_2025}`,
      v2026: `${LOST_DAYS_2026}`,
      note: `${AG_FIRED_2026} случаев × ${SEARCH_DAYS + ONBOARDING_DAYS} дней`,
    },
    {
      label: 'В человеко-месяцах',
      v2025: `${months2025.toFixed(0)}`,
      v2026: `${months2026.toFixed(0)}`,
      note: `${yearsEquiv.toFixed(1)} года работы одного сотрудника`,
    },
    {
      label: 'Часов руководителей',
      v2025: `${AG_FIRED_2025 * MANAGER_HOURS}`,
      v2026: `${MANAGER_HOURS_2026}`,
      note: `${managerDays.toFixed(0)} полных рабочих дней на собеседования`,
    },
    {
      label: 'Средний срок до ухода',
      v2025: `${AVG_TENURE_2025} мес.`,
      v2026: `${AVG_TENURE_2026} мес.`,
      note: 'меньше, чем длится адаптация',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
      <div className="p-5 pb-0 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
          <Icon name="Hourglass" size={18} className="text-violet-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Сколько рабочего времени теряется</h3>
          <p className="text-sm text-slate-500">
            Гарантия возвращает деньги за подбор, но не потраченное время
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
              <span className="text-2xl font-bold text-violet-700 tabular-nums">{c.v2026}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 leading-snug">{c.note}</div>
          </div>
        ))}
      </div>

      <div className="p-5">
        <div className="text-sm font-semibold text-slate-700 mb-1">Из чего складывается потеря на одном уходе</div>
        <p className="text-xs text-slate-500 mb-4">
          Сотрудник ушёл через {AVG_TENURE_2026} месяца — дальше начинается цикл, который стоит времени
        </p>

        <div className="flex items-stretch gap-2 mb-4">
          <div className="flex-1 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Отработал</div>
            <div className="text-xl font-bold text-slate-700 mt-1">{AVG_TENURE_2026} мес.</div>
            <div className="text-[11px] text-slate-500 mt-1">и уволился</div>
          </div>
          {stages.map((s) => (
            <div key={s.title} className="flex-[1.4] rounded-lg border border-violet-200 bg-violet-50 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon name={s.icon} size={13} className="text-violet-600 shrink-0" />
                <div className="text-[11px] font-semibold text-violet-700 uppercase tracking-wide truncate">
                  {s.title}
                </div>
              </div>
              <div className="text-xl font-bold text-violet-900">≈{s.days} дней</div>
              <div className="text-[11px] text-violet-800 mt-1 leading-snug">{s.text}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-violet-900 text-white px-4 py-3 flex items-center justify-between gap-4">
          <div className="text-xs leading-snug">
            Итого на каждый быстрый уход теряется около{' '}
            <strong>{SEARCH_DAYS + ONBOARDING_DAYS} рабочих дней</strong>, когда позиция не даёт полной отдачи
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold tabular-nums">{months2026.toFixed(0)}</div>
            <div className="text-[10px] text-white/60 uppercase tracking-wide">человеко-месяцев в 2026</div>
          </div>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon name="Calculator" size={13} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-700">Как считали</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600 leading-snug">
              <li className="flex gap-1.5">
                <span className="text-slate-400">·</span>
                Поиск замены через агентство — {SEARCH_DAYS} дней
              </li>
              <li className="flex gap-1.5">
                <span className="text-slate-400">·</span>
                Выход нового сотрудника на полную отдачу — {ONBOARDING_DAYS} дней
              </li>
              <li className="flex gap-1.5">
                <span className="text-slate-400">·</span>
                Время руководителей на отбор — {MANAGER_HOURS} часов на одну вакансию
              </li>
              <li className="flex gap-1.5">
                <span className="text-slate-400">·</span>
                В месяце {WORK_DAYS_MONTH} рабочих дней
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon name="TriangleAlert" size={13} className="text-amber-600" />
              <span className="text-xs font-semibold text-amber-900">Что это значит для бизнеса</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              {months2026.toFixed(0)} человеко-месяцев — это как если бы один специалист{' '}
              {yearsEquiv >= 1 ? `${yearsEquiv.toFixed(1)} года` : `${months2026.toFixed(0)} месяцев`} получал зарплату
              и не выходил на работу. Плюс {managerDays.toFixed(0)} рабочих дней руководителей ушло на повторные
              собеседования вместо проектов и объектов.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-5 py-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong>Вывод.</strong> Средний срок до увольнения — {AVG_TENURE_2026} месяца, то есть человек уходит раньше,
          чем успевает войти в работу. Компания оплачивает адаптацию, но не получает отдачи. Снижение числа быстрых
          уходов даже на треть вернуло бы около {(months2026 / 3).toFixed(0)} человеко-месяцев рабочего времени в год —
          это ощутимее, чем возврат стоимости подбора по гарантии.
        </p>
      </div>
    </div>
  );
}
