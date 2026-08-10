export type Term = {
  name: string;
  short: string;
  contract: string;
  entity: string;
  priceType: 'fixed' | 'percent' | 'mixed';
  priceShort: string;
  price: string[];
  guaranteeMax: number;
  guarantee: string[];
  payment: string;
  paymentSplit: boolean;
  vat: string;
  hired: number;
  fired: number;
};

export const TERMS: Term[] = [
  {
    name: 'ИП Котегова / КА ЭФИР',
    short: 'ЭФИР',
    contract: '№564',
    entity: 'ПСФ Крост',
    priceType: 'mixed',
    priceShort: '157 500 – 346 500 ₽',
    price: [
      '346 500 ₽ — при зарплате кандидата от 200 000 ₽',
      '220 500 ₽ — при зарплате до 200 000 ₽',
      '157 500 ₽ — вакансия «секретарь на объект»',
      '15% годового дохода — топовый и эксклюзивный персонал (директора, начальники управлений и отделов, главный инженер, главный архитектор)',
    ],
    guaranteeMax: 6,
    guarantee: ['6 месяцев', '5 месяцев', '3 месяца'],
    payment: '100% после выхода на работу',
    paymentSplit: false,
    vat: 'НДС 5%',
    hired: 285,
    fired: 69,
  },
  {
    name: 'ИП Мухин / КА Команда мечты ИТ',
    short: 'ИП Мухин',
    contract: '№27',
    entity: 'АСП',
    priceType: 'fixed',
    priceShort: '150 000 – 250 000 ₽',
    price: [
      '150 000 ₽ — специалист начального уровня',
      '200 000 ₽ — специалист среднего уровня',
      '250 000 ₽ — специалист высокого уровня',
    ],
    guaranteeMax: 8,
    guarantee: ['8 месяцев'],
    payment: '100% после выхода на работу',
    paymentSplit: false,
    vat: 'без НДС',
    hired: 10,
    fired: 2,
  },
  {
    name: 'КА Визави Консалт',
    short: 'Визави',
    contract: '№ВК862-24/04',
    entity: 'ПСФ Крост',
    priceType: 'percent',
    priceShort: '15% годового дохода',
    price: ['15% от годового дохода кандидата'],
    guaranteeMax: 6,
    guarantee: [
      '6 месяцев — при зарплате более 1 300 000 ₽',
      '5 месяцев — при зарплате 501 000 – 1 300 000 ₽',
      '4 месяца — при зарплате до 500 000 ₽',
    ],
    payment: '70% после выхода, 30% после испытательного срока',
    paymentSplit: true,
    vat: 'без НДС',
    hired: 0,
    fired: 1,
  },
  {
    name: 'КА Вектор К / ИП Егорова',
    short: 'Вектор К',
    contract: 'без номера',
    entity: 'ПСФ Крост',
    priceType: 'mixed',
    priceShort: '200 000 – 330 000 ₽',
    price: [
      '330 000 ₽ — при зарплате от 200 000 ₽',
      '200 000 ₽ — при зарплате до 200 000 ₽',
      '15% годового дохода — топовый и эксклюзивный персонал',
    ],
    guaranteeMax: 5,
    guarantee: ['5 месяцев'],
    payment: '100% после выхода на работу',
    paymentSplit: false,
    vat: 'без НДС',
    hired: 2,
    fired: 2,
  },
  {
    name: 'КА Cornerstone / Бизнес Солюшенз',
    short: 'Cornerstone',
    contract: '№4488-КМ/1-23',
    entity: 'ПСФ Крост',
    priceType: 'percent',
    priceShort: '15% годового дохода',
    price: ['15% от годового дохода кандидата'],
    guaranteeMax: 5,
    guarantee: ['3 месяца', '5 месяцев — при зарплате более 200 000 ₽'],
    payment: '100% после выхода на работу',
    paymentSplit: false,
    vat: 'без НДС',
    hired: 1,
    fired: 0,
  },
  {
    name: 'КА A.N.T.',
    short: 'A.N.T.',
    contract: '№051-21/П',
    entity: 'Главкапстрой',
    priceType: 'percent',
    priceShort: '15% годового дохода',
    price: ['15% от годового дохода кандидата'],
    guaranteeMax: 3,
    guarantee: ['3 месяца'],
    payment: '100% после выхода на работу',
    paymentSplit: false,
    vat: 'НДС 5%',
    hired: 3,
    fired: 3,
  },
  {
    name: 'КА ПрофиСтафф',
    short: 'ПрофиСтафф',
    contract: '№3693',
    entity: 'ПСФ Крост',
    priceType: 'percent',
    priceShort: '18% годового дохода',
    price: ['18% от годового дохода кандидата — самая высокая ставка среди подрядчиков'],
    guaranteeMax: 3,
    guarantee: ['3 месяца'],
    payment: '100% после выхода на работу в течение 20 банковских дней',
    paymentSplit: false,
    vat: 'без НДС',
    hired: 0,
    fired: 0,
  },
];

export const TERMS_DATE = '10.08.2026';
export const TERMS_COUNT = TERMS.length;
export const GUARANTEE_MAX = Math.max(...TERMS.map((t) => t.guaranteeMax));
export const GUARANTEE_MIN = Math.min(...TERMS.map((t) => t.guaranteeMax));
export const SPLIT_PAYMENT_COUNT = TERMS.filter((t) => t.paymentSplit).length;
export const EFIR_TERM = TERMS[0];

export const BASE_SALARY = 150_000;
export const BASE_YEAR_INCOME = BASE_SALARY * 12;

export type CostRow = {
  agency: string;
  rateLabel: string;
  rate: number;
  fired2025: number;
  fired2026: number;
};

export const COST_ROWS: CostRow[] = [
  { agency: 'КА ЭФИР', rateLabel: '220 500 ₽ фикс', rate: 220_500, fired2025: 55, fired2026: 14 },
  { agency: 'КА A.N.T.', rateLabel: '15% дохода', rate: BASE_YEAR_INCOME * 0.15, fired2025: 1, fired2026: 2 },
  { agency: 'КА Вектор К', rateLabel: '200 000 ₽ фикс', rate: 200_000, fired2025: 2, fired2026: 0 },
  { agency: 'ИП Мухин', rateLabel: '200 000 ₽ фикс', rate: 200_000, fired2025: 0, fired2026: 2 },
  { agency: 'КА Визави Консалт', rateLabel: '15% дохода', rate: BASE_YEAR_INCOME * 0.15, fired2025: 0, fired2026: 1 },
  { agency: 'Агентство не указано', rateLabel: 'по средней ставке', rate: 220_500, fired2025: 0, fired2026: 1 },
];

export const COST_2025 = COST_ROWS.reduce((s, r) => s + r.rate * r.fired2025, 0);
export const COST_2026 = COST_ROWS.reduce((s, r) => s + r.rate * r.fired2026, 0);
export const COST_TOTAL = COST_2025 + COST_2026;
export const COST_AVG = COST_TOTAL / 78;

export const GUARANTEE_BANDS = [
  { band: 'до 3 месяцев', cases: 46, covered: true, note: 'покрыто гарантией любого договора' },
  { band: '3–6 месяцев', cases: 23, covered: true, note: 'покрыто у большинства подрядчиков' },
  { band: '6–12 месяцев', cases: 8, covered: false, note: 'вне гарантии, кроме ИП Мухина' },
];

export const COVERED_CASES = 69;
export const UNCOVERED_CASES = 8;
export const COVERED_SUM = COVERED_CASES * COST_AVG;
export const UNCOVERED_SUM = UNCOVERED_CASES * COST_AVG;
export const COVERED_PCT = (COVERED_CASES / 77) * 100;

export const money = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} млн ₽`;
  if (v >= 1_000) return `${Math.round(v / 1000)} тыс. ₽`;
  return `${Math.round(v)} ₽`;
};

export const moneyFull = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`;