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
