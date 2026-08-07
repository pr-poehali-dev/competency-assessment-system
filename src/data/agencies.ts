export type AgencyRow = {
  name: string;
  short: string;
  hired2025: number;
  hired2026: number;
  fired2025: number;
  color: string;
};

export const AGENCIES: AgencyRow[] = [
  { name: 'КА ЭФИР', short: 'ЭФИР', hired2025: 175, hired2026: 110, fired2025: 31, color: '#f59e0b' },
  { name: 'ИП Мухин А.В.', short: 'ИП Мухин', hired2025: 8, hired2026: 2, fired2025: 0, color: '#0ea5e9' },
  { name: 'АНТ-Групп', short: 'АНТ-Групп', hired2025: 3, hired2026: 0, fired2025: 2, color: '#8b5cf6' },
  { name: 'Вектор К / ИП Егорова', short: 'Вектор К', hired2025: 2, hired2026: 0, fired2025: 0, color: '#16a34a' },
  {
    name: 'Корнерстоун / Бизнес Солюшенз',
    short: 'Корнерстоун',
    hired2025: 1,
    hired2026: 0,
    fired2025: 1,
    color: '#ec4899',
  },
];

export const AG_TOTAL_2025 = AGENCIES.reduce((s, a) => s + a.hired2025, 0);
export const AG_TOTAL_2026 = AGENCIES.reduce((s, a) => s + a.hired2026, 0);
export const AG_FIRED_2025 = AGENCIES.reduce((s, a) => s + a.fired2025, 0);

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
  { band: 'до 3 месяцев', count: 3, color: '#dc2626' },
  { band: '3–6 месяцев', count: 9, color: '#f97316' },
  { band: '6–12 месяцев', count: 13, color: '#f59e0b' },
  { band: 'более года', count: 9, color: '#94a3b8' },
];

export const FIRED_POSITIONS = [
  { pos: 'Помощник ГИП', count: 3 },
  { pos: 'ГИП', count: 3 },
  { pos: 'Помощник руководителя', count: 3 },
  { pos: 'Секретарь ОБУ', count: 2 },
  { pos: 'Ст. производитель работ', count: 2 },
];

export const RECRUITERS_2025 = 13;
export const RECRUITERS_2026 = 17;

export const agPct = (part: number, whole: number) => (whole ? (part / whole) * 100 : 0);

export const AG_TURNOVER_2025 = agPct(AG_FIRED_2025, AG_TOTAL_2025);
export const EFIR_TURNOVER = agPct(EFIR.fired2025, EFIR.hired2025);
export const EFIR_SHARE_2025 = agPct(EFIR.hired2025, AG_TOTAL_2025);
export const EFIR_SHARE_2026 = agPct(EFIR.hired2026, AG_TOTAL_2026);

export const EARLY_FIRED = FIRED_TENURE.filter((f) => f.band !== 'более года').reduce((s, f) => s + f.count, 0);
