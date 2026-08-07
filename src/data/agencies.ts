export type AgencyRow = {
  name: string;
  short: string;
  hired2025: number;
  hired2026: number;
  fired2025: number;
  fired2026: number;
  color: string;
};

export const AGENCIES: AgencyRow[] = [
  { name: 'КА ЭФИР', short: 'ЭФИР', hired2025: 175, hired2026: 110, fired2025: 55, fired2026: 14, color: '#f59e0b' },
  { name: 'ИП Мухин А.В.', short: 'ИП Мухин', hired2025: 8, hired2026: 2, fired2025: 0, fired2026: 2, color: '#0ea5e9' },
  { name: 'АНТ-Групп', short: 'АНТ-Групп', hired2025: 3, hired2026: 0, fired2025: 1, fired2026: 2, color: '#8b5cf6' },
  {
    name: 'Вектор К / ИП Егорова',
    short: 'Вектор К',
    hired2025: 2,
    hired2026: 0,
    fired2025: 2,
    fired2026: 0,
    color: '#16a34a',
  },
  {
    name: 'Корнерстоун / Бизнес Солюшенз',
    short: 'Корнерстоун',
    hired2025: 1,
    hired2026: 0,
    fired2025: 0,
    fired2026: 0,
    color: '#ec4899',
  },
  {
    name: 'Визави Консалтинг',
    short: 'Визави',
    hired2025: 0,
    hired2026: 0,
    fired2025: 0,
    fired2026: 1,
    color: '#64748b',
  },
];

export const AG_TOTAL_2025 = AGENCIES.reduce((s, a) => s + a.hired2025, 0);
export const AG_TOTAL_2026 = AGENCIES.reduce((s, a) => s + a.hired2026, 0);
export const AG_FIRED_2025 = 58;
export const AG_FIRED_2026 = 20;

export const EFIR = AGENCIES[0];

export const MONTHLY = [
  { month: 'янв', y2025: 12, y2026: 7 },
  { month: 'фев', y2025: 12, y2026: 13 },
  { month: 'мар', y2025: 17, y2026: 17 },
  { month: 'апр', y2025: 24, y2026: 14 },
  { month: 'май', y2025: 15, y2026: 18 },
  { month: 'июн', y2025: 16, y2026: 28 },
  { month: 'июл', y2025: 11, y2026: 11 },
  { month: 'авг', y2025: 16, y2026: 4 },
  { month: 'сен', y2025: 11, y2026: null },
  { month: 'окт', y2025: 20, y2026: null },
  { month: 'ноя', y2025: 15, y2026: null },
  { month: 'дек', y2025: 20, y2026: null },
];

export const AGE_BANDS = [
  { band: 'до 30 лет', y2025: 36, y2026: 16, color: '#0ea5e9' },
  { band: '30–39 лет', y2025: 74, y2026: 44, color: '#16a34a' },
  { band: '40–49 лет', y2025: 62, y2026: 44, color: '#f59e0b' },
  { band: '50 лет и старше', y2025: 17, y2026: 8, color: '#8b5cf6' },
];

export const AGE_AVG_2025 = 38.2;
export const AGE_AVG_2026 = 38.4;

export const DEPTS = [
  { dept: 'Прочие объекты', y2025: 21, y2026: 14 },
  { dept: 'Отдел главных инженеров проектов', y2025: 13, y2026: 7 },
  { dept: 'Дирекция по строительству объектов фонда реновации', y2025: 6, y2026: 7 },
  { dept: 'Управление проектами реновации', y2025: 2, y2026: 6 },
  { dept: 'Отдел внутренних инженерных сетей', y2025: 5, y2026: 6 },
  { dept: 'Отдел ген. подрядных объектов', y2025: 3, y2026: 5 },
  { dept: 'Первый строительно-монтажный трест', y2025: 2, y2026: 5 },
  { dept: 'Отдел промышленных зданий', y2025: 6, y2026: 2 },
  { dept: 'Отдел главного геодезиста', y2025: 6, y2026: 1 },
  { dept: 'Управление каменных работ', y2025: 6, y2026: 0 },
];

export const POSITIONS = [
  { pos: 'Помощник руководителя', y2025: 16, y2026: 11 },
  { pos: 'ГИП', y2025: 11, y2026: 5 },
  { pos: 'Секретарь ОБУ', y2025: 8, y2026: 1 },
  { pos: 'Инженер ПТО', y2025: 6, y2026: 4 },
  { pos: 'Ст. производитель работ', y2025: 6, y2026: 4 },
  { pos: 'Помощник ГИП', y2025: 6, y2026: 2 },
  { pos: 'Ведущий архитектор', y2025: 6, y2026: 2 },
  { pos: 'Геодезист', y2025: 6, y2026: 1 },
  { pos: 'Начальник участка', y2025: 3, y2026: 6 },
  { pos: 'Ст. инженер', y2025: 4, y2026: 5 },
];

export const FIRED_TENURE = [
  { band: 'до 3 месяцев', y2025: 32, y2026: 14, color: '#dc2626' },
  { band: '3–6 месяцев', y2025: 18, y2026: 5, color: '#f97316' },
  { band: '6–12 месяцев', y2025: 8, y2026: 0, color: '#f59e0b' },
];

export const FIRED_POSITIONS = [
  { pos: 'Помощник руководителя', y2025: 9, y2026: 3 },
  { pos: 'ГИП', y2025: 4, y2026: 0 },
  { pos: 'Вед. инженер-конструктор', y2025: 3, y2026: 0 },
  { pos: 'Секретарь ОБУ', y2025: 3, y2026: 0 },
  { pos: 'Ст. производитель работ', y2025: 2, y2026: 0 },
  { pos: 'Производитель работ', y2025: 1, y2026: 2 },
  { pos: 'Прораб', y2025: 2, y2026: 0 },
  { pos: 'Инженер', y2025: 2, y2026: 0 },
];

export const FIRED_AGE = [
  { band: 'до 30 лет', y2025: 9, y2026: 0, color: '#0ea5e9' },
  { band: '30–39 лет', y2025: 23, y2026: 10, color: '#16a34a' },
  { band: '40–49 лет', y2025: 20, y2026: 6, color: '#f59e0b' },
  { band: '50 лет и старше', y2025: 6, y2026: 3, color: '#8b5cf6' },
];

export const FIRED_AGE_AVG_2025 = 39.0;
export const FIRED_AGE_AVG_2026 = 40.8;

export const FIRED_DEPTS = [
  { dept: 'Прочие объекты', y2025: 9, y2026: 0 },
  { dept: 'Отдел главных инженеров проектов', y2025: 4, y2026: 1 },
  { dept: 'Отдел проектирования объектов СИВ', y2025: 4, y2026: 0 },
  { dept: 'Договорной отдел', y2025: 1, y2026: 2 },
  { dept: 'Дирекция по строительству объектов фонда реновации', y2025: 1, y2026: 2 },
  { dept: 'Управление по перспективным проектам', y2025: 2, y2026: 0 },
  { dept: 'Приёмная', y2025: 2, y2026: 0 },
  { dept: 'Департамент строительства', y2025: 2, y2026: 0 },
];

export const RECRUITERS_2025 = 13;
export const RECRUITERS_2026 = 17;

export const agPct = (part: number, whole: number) => (whole ? (part / whole) * 100 : 0);

export const AG_TURNOVER_2025 = agPct(AG_FIRED_2025, AG_TOTAL_2025);
export const AG_TURNOVER_2026 = agPct(AG_FIRED_2026, AG_TOTAL_2026);
export const EFIR_TURNOVER = agPct(EFIR.fired2025, EFIR.hired2025);
export const EFIR_TURNOVER_2026 = agPct(EFIR.fired2026, EFIR.hired2026);
export const EFIR_SHARE_2025 = agPct(EFIR.hired2025, AG_TOTAL_2025);
export const EFIR_SHARE_2026 = agPct(EFIR.hired2026, AG_TOTAL_2026);

export const AVG_TENURE_2025 = 2.9;
export const AVG_TENURE_2026 = 2.0;

export const SEARCH_DAYS = 30;
export const ONBOARDING_DAYS = 30;
export const MANAGER_HOURS = 8;
export const WORK_DAYS_MONTH = 21;

export const lostDays = (cases: number) => cases * (SEARCH_DAYS + ONBOARDING_DAYS);
export const LOST_DAYS_2025 = lostDays(58);
export const LOST_DAYS_2026 = lostDays(20);
export const LOST_MONTHS_2026 = LOST_DAYS_2026 / WORK_DAYS_MONTH;
export const MANAGER_HOURS_2026 = 20 * MANAGER_HOURS;

export const FAST_FIRED_2025 = FIRED_TENURE[0].y2025 + FIRED_TENURE[1].y2025;
export const FAST_FIRED_2026 = FIRED_TENURE[0].y2026 + FIRED_TENURE[1].y2026;
export const EARLY_FIRED = AG_FIRED_2025;