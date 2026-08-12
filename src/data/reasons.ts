export type ReasonGroup = {
  key: string;
  label: string;
  short: string;
  color: string;
  total: number;
  emp: number;
  empr: number;
  manageable: boolean;
  examples: { text: string; n: number }[];
  comment: string;
};

export const REASONS_TOTAL = 1205;
export const REASONS_BY_EMPLOYEE = 1071;
export const REASONS_BY_EMPLOYER = 134;

export const REASON_GROUPS: ReasonGroup[] = [
  {
    key: 'other_job',
    label: 'Ушёл к другому работодателю',
    short: 'Другая работа',
    color: '#dc2626',
    total: 338,
    emp: 334,
    empr: 4,
    manageable: true,
    examples: [
      { text: 'Нашёл другую работу', n: 334 },
      { text: 'Возврат на предыдущее место работы', n: 1 },
    ],
    comment:
      'Человека переманили. За формулировкой всегда стоит конкретный мотив — деньги, дорога, график, руководитель, — но при увольнении его не выясняют.',
  },
  {
    key: 'nospec',
    label: 'Причина не выяснена',
    short: 'Не выяснено',
    color: '#94a3b8',
    total: 202,
    emp: 132,
    empr: 70,
    manageable: true,
    examples: [
      { text: 'Собственное желание', n: 91 },
      { text: 'Инициатива руководства', n: 72 },
      { text: 'Решение руководства', n: 24 },
      { text: 'Соглашение сторон / передумал', n: 8 },
    ],
    comment:
      'Пустая запись в кадрах: юридическая формулировка вместо причины. Каждый шестой уход не даёт компании никакой информации.',
  },
  {
    key: 'life',
    label: 'Личные и жизненные обстоятельства',
    short: 'Личные',
    color: '#64748b',
    total: 185,
    emp: 184,
    empr: 1,
    manageable: false,
    examples: [
      { text: 'Семейные обстоятельства', n: 67 },
      { text: 'Переезд в другой регион', n: 45 },
      { text: 'Состояние здоровья', n: 29 },
      { text: 'Смерть работника', n: 12 },
      { text: 'Пенсия, декрет, армия, уход за родственником', n: 22 },
    ],
    comment: 'Компания на это повлиять не может. Это естественный фон текучести.',
  },
  {
    key: 'conditions',
    label: 'Условия труда и нагрузка',
    short: 'Условия труда',
    color: '#f97316',
    total: 125,
    emp: 123,
    empr: 2,
    manageable: true,
    examples: [
      { text: 'График работы', n: 44 },
      { text: 'Устал', n: 19 },
      { text: 'Большой объём выполняемой работы', n: 25 },
      { text: 'Нарушен баланс «семья / работа»', n: 16 },
      { text: 'Интенсивность работы, монотонность', n: 19 },
    ],
    comment:
      'Самая управляемая группа: график, объём задач и переработки регулируются внутри компании без роста фонда оплаты труда.',
  },
  {
    key: 'perf',
    label: 'Не справился с работой',
    short: 'Не справился',
    color: '#7c3aed',
    total: 95,
    emp: 65,
    empr: 30,
    manageable: true,
    examples: [
      { text: 'Не справляется с работой', n: 52 },
      { text: 'Несоответствие занимаемой должности', n: 13 },
      { text: 'Отсутствие компетенций, навыков, знаний', n: 6 },
      { text: 'Не прошёл испытательный срок', n: 7 },
    ],
    comment:
      'Это брак подбора и адаптации: человека взяли не под задачу или не ввели в работу. Сюда же попадают гарантийные случаи по агентствам.',
  },
  {
    key: 'org',
    label: 'Организационные причины компании',
    short: 'Оргпричины',
    color: '#0ea5e9',
    total: 80,
    emp: 77,
    empr: 3,
    manageable: false,
    examples: [
      { text: 'Закрытие предприятия', n: 43 },
      { text: 'Окончание практики / стажировки', n: 22 },
      { text: 'Расформирование подразделения', n: 9 },
      { text: 'Реорганизация, окончание сезона', n: 6 },
    ],
    comment:
      'Плановые уходы: закрытие объектов и завершение практики. Их корректно исключать при расчёте реальной текучести.',
  },
  {
    key: 'money',
    label: 'Заработная плата',
    short: 'Деньги',
    color: '#16a34a',
    total: 46,
    emp: 46,
    empr: 0,
    manageable: true,
    examples: [
      { text: 'Заработная плата', n: 31 },
      { text: 'Зарплата + нашёл другую работу', n: 9 },
      { text: 'Несоответствие результата работы уровню ЗП', n: 4 },
    ],
    comment:
      'Явно про деньги говорят лишь 4% уходящих — но часть «нашёл другую работу» на деле тоже про доход. Реальный вес выше заявленного.',
  },
  {
    key: 'mgmt',
    label: 'Руководитель и коллектив',
    short: 'Руководство',
    color: '#e11d48',
    total: 40,
    emp: 32,
    empr: 8,
    manageable: true,
    examples: [
      { text: 'Отношения с руководством', n: 13 },
      { text: 'Конфликтная ситуация', n: 13 },
      { text: 'Отношения в коллективе', n: 10 },
      { text: 'Не устраивает руководство', n: 4 },
    ],
    comment:
      'Признаются в этом редко — на выходе о конфликте с начальником говорить не принято. Реальная доля выше в разы.',
  },
  {
    key: 'discipline',
    label: 'Дисциплина и нарушения',
    short: 'Дисциплина',
    color: '#b91c1c',
    total: 33,
    emp: 18,
    empr: 15,
    manageable: true,
    examples: [
      { text: 'Дисциплина', n: 11 },
      { text: 'Пьянство, алкоголь на рабочем месте', n: 11 },
      { text: 'Чёрный список', n: 7 },
      { text: 'Прогул, фальсификация данных', n: 4 },
    ],
    comment:
      'Каждое такое увольнение — пропущенный сигнал на входе. Проверка на этапе подбора дешевле, чем расставание.',
  },
  {
    key: 'growth',
    label: 'Нет роста и развития',
    short: 'Нет роста',
    color: '#a855f7',
    total: 32,
    emp: 31,
    empr: 1,
    manageable: true,
    examples: [
      { text: 'Смена сферы деятельности', n: 15 },
      { text: 'Отсутствие профессионального роста', n: 9 },
      { text: 'Нет развития', n: 8 },
    ],
    comment: 'Уходят те, кого компания уже обучила. Самая дорогая по замещению группа.',
  },
  {
    key: 'commute',
    label: 'Дорога до работы',
    short: 'Дорога',
    color: '#0d9488',
    total: 29,
    emp: 29,
    empr: 0,
    manageable: true,
    examples: [
      { text: 'Не устраивает местоположение', n: 23 },
      { text: 'Нашёл работу ближе к дому', n: 6 },
    ],
    comment: 'Отсекается на этапе подбора одним вопросом о времени в пути. Такие уходы предсказуемы заранее.',
  },
];

export const REASON_TOP = [...REASON_GROUPS].sort((a, b) => b.total - a.total);

export const MANAGEABLE_TOTAL = REASON_GROUPS.filter((g) => g.manageable).reduce((s, g) => s + g.total, 0);
export const UNMANAGEABLE_TOTAL = REASON_GROUPS.filter((g) => !g.manageable).reduce((s, g) => s + g.total, 0);

export const rPct = (v: number) => (v / REASONS_TOTAL) * 100;

export type InitiatorRow = { name: string; value: number; color: string };

export const INITIATOR: InitiatorRow[] = [
  { name: 'Инициатива сотрудника', value: REASONS_BY_EMPLOYEE, color: '#dc2626' },
  { name: 'Инициатива работодателя', value: REASONS_BY_EMPLOYER, color: '#0ea5e9' },
];

export type TenureBand = {
  key: string;
  label: string;
  full: string;
  total: number;
  emp: number;
  empr: number;
  reasons: Record<string, number>;
};

export const TENURE_REASONS_TOTAL = 405;

export const TENURE_BANDS: TenureBand[] = [
  {
    key: 'b0',
    label: 'до 3 мес.',
    full: 'Первые 3 месяца',
    total: 74,
    emp: 67,
    empr: 7,
    reasons: {
      nospec: 20,
      life: 13,
      other_job: 11,
      conditions: 9,
      perf: 8,
      commute: 6,
      mgmt: 4,
      org: 2,
      growth: 1,
      money: 0,
      discipline: 0,
    },
  },
  {
    key: 'b1',
    label: '3–6 мес.',
    full: 'От 3 до 6 месяцев',
    total: 49,
    emp: 43,
    empr: 6,
    reasons: {
      nospec: 17,
      life: 8,
      other_job: 7,
      conditions: 6,
      perf: 4,
      discipline: 2,
      growth: 2,
      mgmt: 2,
      commute: 1,
      money: 0,
      org: 0,
    },
  },
  {
    key: 'b2',
    label: '6–12 мес.',
    full: 'От 6 до 12 месяцев',
    total: 88,
    emp: 78,
    empr: 10,
    reasons: {
      other_job: 33,
      nospec: 16,
      life: 14,
      conditions: 6,
      perf: 5,
      mgmt: 4,
      money: 4,
      commute: 3,
      growth: 3,
      discipline: 0,
      org: 0,
    },
  },
  {
    key: 'b3',
    label: '1–3 года',
    full: 'От 1 до 3 лет',
    total: 138,
    emp: 121,
    empr: 17,
    reasons: {
      other_job: 47,
      nospec: 32,
      life: 23,
      conditions: 10,
      mgmt: 7,
      discipline: 6,
      money: 5,
      perf: 4,
      commute: 2,
      growth: 2,
      org: 0,
    },
  },
  {
    key: 'b4',
    label: 'более 3 лет',
    full: 'Более 3 лет',
    total: 56,
    emp: 52,
    empr: 4,
    reasons: {
      nospec: 18,
      other_job: 13,
      life: 12,
      conditions: 4,
      commute: 3,
      discipline: 2,
      growth: 2,
      mgmt: 2,
      money: 0,
      org: 0,
      perf: 0,
    },
  },
];

export const TENURE_MEDIAN_MONTHS = 11;

export const bandPct = (band: TenureBand, key: string) => ((band.reasons[key] ?? 0) / band.total) * 100;

export const CONTROLLABLE = [
  { name: 'Компания может влиять', value: MANAGEABLE_TOTAL, color: '#dc2626' },
  { name: 'Вне контроля компании', value: UNMANAGEABLE_TOTAL, color: '#94a3b8' },
];