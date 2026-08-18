export type Recruiter = { name: string; load: number };

export const OPP_TEAM: Recruiter[] = [
  { name: 'Алексанова Татьяна Викторовна', load: 100 },
  { name: 'Алешин Сергей Николаевич', load: 100 },
  { name: 'Баршина Татьяна Юрьевна', load: 100 },
  { name: 'Бурцева Татьяна Яковлевна', load: 95 },
  { name: 'Ванагс Оксана Олеговна', load: 100 },
  { name: 'Волынец Полина Владимировна', load: 100 },
  { name: 'Горностаева Надежда Васильевна', load: 30 },
  { name: 'Гурбанова Анна Сергеевна', load: 100 },
  { name: 'Зайнетдинов Александр Зарифович', load: 50 },
  { name: 'Замчалко Анастасия Владимировна', load: 100 },
  { name: 'Игнатьева Надежда Вячеславовна', load: 50 },
  { name: 'Киреева Елена Николаевна', load: 100 },
  { name: 'Корина Елена Анатольевна', load: 100 },
  { name: 'Куватова Ольга Александровна', load: 100 },
  { name: 'Ланкевич Анастасия Васильевна', load: 100 },
  { name: 'Львова Анна Игоревна', load: 100 },
  { name: 'Мананкова Гелнур Фаритовна', load: 200 },
  { name: 'Матвеева Ксения Андреевна', load: 100 },
  { name: 'Москвичева Мария Владимировна', load: 100 },
  { name: 'Назарук Юлия Александровна', load: 50 },
  { name: 'Некрасова Эльвира Сергеевна', load: 100 },
  { name: 'Полубоярова Ирина Витальевна', load: 50 },
  { name: 'Расулов Роман Саитович', load: 30 },
  { name: 'Сиворакша Елена Васильевна', load: 30 },
  { name: 'Шеина Дарья Алексеевна', load: 100 },
];

export const OPP_PARAMS = {
  salary: 220000,
  taxRate: 30,
  workplace: 60000,
  hires: 228,
  vacancySalary: 280000,
  agencyFee: 15,
};

const fotMonth = OPP_TEAM.reduce((s, p) => s + (OPP_PARAMS.salary * p.load) / 100, 0);
const fotYear = fotMonth * 12;
const fotWithTax = fotYear * (1 + OPP_PARAMS.taxRate / 100);
const workplacesYear = OPP_PARAMS.workplace * OPP_TEAM.length;
const totalYear = fotWithTax + workplacesYear;
const fte = OPP_TEAM.reduce((s, p) => s + p.load, 0) / 100;

export const OPP_DEPT = {
  ...OPP_PARAMS,
  people: OPP_TEAM.length,
  fte,
  fotMonth,
  fotYear,
  fotWithTax,
  workplacesYear,
  totalYear,
  perHire: totalYear / OPP_PARAMS.hires,
};
