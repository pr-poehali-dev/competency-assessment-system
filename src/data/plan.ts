export type PlanOwner = 'Отдел подбора' | 'HR-дирекция' | 'Руководители подразделений' | 'Отдел кадров';

export type PlanStatus = 'todo' | 'doing' | 'done';

export const STATUS_META: Record<
  PlanStatus,
  { label: string; short: string; dot: string; chip: string; bar: string; text: string; icon: string }
> = {
  todo: {
    label: 'Не начата',
    short: 'Не начата',
    dot: 'bg-slate-300',
    chip: 'bg-slate-100 text-slate-600 border-slate-200',
    bar: 'bg-slate-300',
    text: 'text-slate-400',
    icon: 'Circle',
  },
  doing: {
    label: 'В работе',
    short: 'В работе',
    dot: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'bg-amber-500',
    text: 'text-amber-600',
    icon: 'CircleDashed',
  },
  done: {
    label: 'Выполнена',
    short: 'Выполнена',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-500',
    text: 'text-emerald-600',
    icon: 'CircleCheck',
  },
};

export const STATUS_ORDER: PlanStatus[] = ['todo', 'doing', 'done'];

export type PlanTask = {
  id: string;
  title: string;
  what: string;
  owner: PlanOwner;
  support: string;
  deadline: string;
  metric: string;
  target: string;
  effort: 'Низкие' | 'Средние' | 'Высокие';
  priority: 1 | 2 | 3;
  status: PlanStatus;
};

export type PlanWave = {
  key: string;
  name: string;
  period: string;
  goal: string;
  tone: 'red' | 'amber' | 'blue';
  tasks: PlanTask[];
};

export const PLAN_START = 'сентябрь 2026';

export const PLAN_WAVES: PlanWave[] = [
  {
    key: 'now',
    name: 'Этап 1. Быстрые меры',
    period: 'сентябрь — октябрь 2026',
    goal: 'Закрыть «слепые зоны» в данных и остановить самые дешёвые в исправлении потери',
    tone: 'red',
    tasks: [
      {
        id: '1.1',
        title: 'Ввести выходное интервью',
        what: 'Анкета из 5 вопросов при расчёте: что стало решающим, что предложил новый работодатель, что могло удержать, оценка руководителя, готовность вернуться. Заполняется до выдачи документов.',
        owner: 'Отдел кадров',
        support: 'Отдел подбора — сбор и свод ответов',
        deadline: '30 сентября 2026',
        metric: 'Доля увольнений с невыясненной причиной',
        target: 'с 17% до 5% за квартал',
        effort: 'Низкие',
        priority: 1,
        status: 'doing',
      },
      {
        id: '1.2',
        title: 'Спрашивать про дорогу до объекта',
        what: 'Добавить в анкету кандидата фактическое время в пути и способ добраться. При дороге дольше 1,5 часов — обсуждать риск сразу или предлагать другой объект.',
        owner: 'Отдел подбора',
        support: 'Кадровые агентства — то же требование в заявке',
        deadline: '15 сентября 2026',
        metric: 'Увольнения с причиной «дорога до работы»',
        target: 'снизить вдвое к концу года',
        effort: 'Низкие',
        priority: 2,
        status: 'done',
      },
      {
        id: '1.3',
        title: 'Ужесточить условия по агентствам',
        what: 'Гарантийный срок замены — не менее 3 месяцев в договоре. Оплата второй частью после того, как кандидат отработал испытательный срок.',
        owner: 'HR-дирекция',
        support: 'Юридическая служба, отдел подбора',
        deadline: '31 октября 2026',
        metric: 'Уходы агентских кандидатов в первые 3 месяца',
        target: 'с 14 человек за год до 5',
        effort: 'Средние',
        priority: 1,
        status: 'doing',
      },
      {
        id: '1.4',
        title: 'Запустить контрольные точки новичка',
        what: 'Разговор с новым сотрудником на 2-й, 6-й и 12-й неделе по короткому чек-листу. Тревожные сигналы передаются в отдел подбора в тот же день.',
        owner: 'Руководители подразделений',
        support: 'HR-дирекция — шаблон и напоминания',
        deadline: '30 сентября 2026',
        metric: 'Охват новичков контрольными точками',
        target: '100% принятых с октября',
        effort: 'Низкие',
        priority: 1,
        status: 'todo',
      },
    ],
  },
  {
    key: 'next',
    name: 'Этап 2. Системные изменения',
    period: 'ноябрь 2026 — февраль 2027',
    goal: 'Убрать причины, которые дают самый большой объём управляемых уходов',
    tone: 'amber',
    tasks: [
      {
        id: '2.1',
        title: 'Пересмотреть графики и нагрузку',
        what: 'Выделить подразделения-лидеры по уходам из-за графика, проверить фактические переработки и сменность, скорректировать нормативы нагрузки.',
        owner: 'Руководители подразделений',
        support: 'HR-дирекция — расчёт текучести по подразделениям',
        deadline: '31 декабря 2026',
        metric: 'Уходы по причине «условия труда и нагрузка»',
        target: 'с 125 случаев на треть меньше за год',
        effort: 'Средние',
        priority: 1,
        status: 'todo',
      },
      {
        id: '2.2',
        title: 'Закрепить наставников за новичками',
        what: 'На первые 3 месяца за каждым новым рабочим и линейным специалистом закрепляется наставник с доплатой за результат — сотрудник дошёл до конца испытательного срока.',
        owner: 'Руководители подразделений',
        support: 'HR-дирекция — положение и доплаты',
        deadline: '31 января 2027',
        metric: 'Увольнения со стажем менее года',
        target: 'с 95% до 80% от всех увольнений',
        effort: 'Высокие',
        priority: 1,
        status: 'todo',
      },
      {
        id: '2.3',
        title: 'Усилить реферальную программу',
        what: 'Рекомендации дают лучшее удержание при минимальной стоимости. Ввести понятную премию за приведённого сотрудника с выплатой после испытательного срока.',
        owner: 'HR-дирекция',
        support: 'Отдел подбора — учёт и выплаты',
        deadline: '30 ноября 2026',
        metric: 'Доля найма по рекомендациям',
        target: 'с 39% до 50% найма',
        effort: 'Средние',
        priority: 2,
        status: 'doing',
      },
      {
        id: '2.4',
        title: 'Считать текучесть по руководителям',
        what: 'Ежемесячный отчёт по текучести в разрезе руководителей. Там, где из одного подразделения ушли трое и более, — отдельный разбор с HR-дирекцией.',
        owner: 'HR-дирекция',
        support: 'Отдел кадров — выгрузка данных',
        deadline: '31 декабря 2026',
        metric: 'Подразделения с текучестью выше средней',
        target: 'разбор по каждому в течение месяца',
        effort: 'Низкие',
        priority: 2,
        status: 'todo',
      },
    ],
  },
  {
    key: 'later',
    name: 'Этап 3. Удержание и развитие',
    period: 'март — июнь 2027',
    goal: 'Удержать обученных сотрудников и снизить зависимость от платных каналов',
    tone: 'blue',
    tasks: [
      {
        id: '3.1',
        title: 'Дать перспективу ключевым сотрудникам',
        what: 'Определить ключевые роли и зафиксировать понятный горизонт: пересмотр оплаты, расширение зоны ответственности, обучение.',
        owner: 'HR-дирекция',
        support: 'Руководители подразделений — список ролей',
        deadline: '31 марта 2027',
        metric: 'Уходы из-за отсутствия роста и зарплаты',
        target: 'с 78 случаев вдвое меньше',
        effort: 'Высокие',
        priority: 2,
        status: 'todo',
      },
      {
        id: '3.2',
        title: 'Возвращать бывших сотрудников',
        what: 'Канал «работал ранее» показал нулевую текучесть. Вести базу уволившихся без нареканий и предлагать вакансии в первую очередь им.',
        owner: 'Отдел подбора',
        support: 'Отдел кадров — база и характеристики',
        deadline: '30 апреля 2027',
        metric: 'Наймы через возврат бывших сотрудников',
        target: 'не менее 30 человек за год',
        effort: 'Низкие',
        priority: 3,
        status: 'todo',
      },
      {
        id: '3.3',
        title: 'Сократить расходы на агентства',
        what: 'По мере роста реферального канала и возврата бывших сотрудников снижать объём заказов агентствам, оставив их для редких и срочных позиций.',
        owner: 'HR-дирекция',
        support: 'Отдел подбора — план замещения канала',
        deadline: '30 июня 2027',
        metric: 'Доля найма через агентства',
        target: 'с 16% до 10% найма',
        effort: 'Средние',
        priority: 3,
        status: 'todo',
      },
    ],
  },
];

export const PLAN_TASKS = PLAN_WAVES.flatMap((w) => w.tasks);

const OWNER_ROLES: { owner: PlanOwner; role: string }[] = [
  { owner: 'HR-дирекция', role: 'Правила, бюджеты, контроль исполнения' },
  { owner: 'Отдел подбора', role: 'Каналы найма, работа с агентствами' },
  { owner: 'Руководители подразделений', role: 'Адаптация, нагрузка, наставничество' },
  { owner: 'Отдел кадров', role: 'Данные об увольнениях и документы' },
];

export const PLAN_OWNERS = OWNER_ROLES.map((o) => ({
  ...o,
  count: PLAN_TASKS.filter((t) => t.owner === o.owner).length,
}));

export const countByStatus = (tasks: PlanTask[]) => ({
  todo: tasks.filter((t) => t.status === 'todo').length,
  doing: tasks.filter((t) => t.status === 'doing').length,
  done: tasks.filter((t) => t.status === 'done').length,
  total: tasks.length,
});

export const progressPercent = (tasks: PlanTask[]) => {
  if (!tasks.length) return 0;
  const score = tasks.reduce((s, t) => s + (t.status === 'done' ? 1 : t.status === 'doing' ? 0.5 : 0), 0);
  return Math.round((score / tasks.length) * 100);
};

export const PLAN_TOTALS = countByStatus(PLAN_TASKS);
export const PLAN_PROGRESS = progressPercent(PLAN_TASKS);

export const PLAN_STATUS_NOTE =
  'Задача считается выполненной, когда работает на практике, а не когда согласован документ. Задача в работе учитывается в прогрессе наполовину.';

export const PLAN_CONTROL = [
  {
    title: 'Ежемесячно',
    text: 'Отдел кадров передаёт свод увольнений с причинами и стажем. HR-дирекция сверяет с планом и отмечает отклонения.',
  },
  {
    title: 'Ежеквартально',
    text: 'Разбор текучести по подразделениям и руководителям, пересмотр приоритетов плана на следующий квартал.',
  },
  {
    title: 'Через год',
    text: 'Сравнение показателей с базой 2026 года: доля уходов в первый год, структура причин, стоимость найма.',
  },
];