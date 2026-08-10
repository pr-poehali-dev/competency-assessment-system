export type PaymentRow = {
  name: string;
  short: string;
  paid2025: number | null;
  paid2026: number | null;
  hired2025: number;
  hired2026: number;
  color: string;
  note?: string;
};

export const PAYMENTS: PaymentRow[] = [
  {
    name: "ИП Котегова / КА ЭФИР",
    short: "КА ЭФИР",
    paid2025: 73940850,
    paid2026: 26146575,
    hired2025: 175,
    hired2026: 110,
    color: "#f59e0b",
  },
  {
    name: "КА Вектор К / ИП Егорова",
    short: "Вектор К",
    paid2025: 4806000,
    paid2026: null,
    hired2025: 2,
    hired2026: 0,
    color: "#16a34a",
  },
  {
    name: "КА A.N.T. (АНТ-Групп)",
    short: "A.N.T.",
    paid2025: 1128600,
    paid2026: 505080,
    hired2025: 3,
    hired2026: 0,
    color: "#8b5cf6",
  },
  {
    name: "КА Cornerstone / Бизнес Солюшенз",
    short: "Cornerstone",
    paid2025: 900000,
    paid2026: null,
    hired2025: 1,
    hired2026: 0,
    color: "#ec4899",
  },
  {
    name: "КА Визави Консалт",
    short: "Визави",
    paid2025: 810000,
    paid2026: 659080,
    hired2025: 1,
    hired2026: 1,
    color: "#64748b",
  },
  {
    name: "КА ПрофиСтафф",
    short: "ПрофиСтафф",
    paid2025: 422069,
    paid2026: null,
    hired2025: 1,
    hired2026: 0,
    color: "#0ea5e9",
  },
  {
    name: "ИП Мухин / КА Команда мечты ИТ",
    short: "ИП Мухин",
    paid2025: null,
    paid2026: null,
    hired2025: 8,
    hired2026: 2,
    color: "#14b8a6",
    note: "Суммы оплат не предоставлены",
  },
];

export const PAID_2025 = PAYMENTS.reduce((s, p) => s + (p.paid2025 ?? 0), 0);
export const PAID_2026 = PAYMENTS.reduce((s, p) => s + (p.paid2026 ?? 0), 0);
export const PAID_TOTAL = PAID_2025 + PAID_2026;

export const EFIR_PAY = PAYMENTS[0];
export const EFIR_PAID_TOTAL =
  (EFIR_PAY.paid2025 ?? 0) + (EFIR_PAY.paid2026 ?? 0);
export const EFIR_PAY_SHARE = (EFIR_PAID_TOTAL / PAID_TOTAL) * 100;

export const EFIR_COST_2025 = Math.round(
  (EFIR_PAY.paid2025 ?? 0) / EFIR_PAY.hired2025,
);
export const EFIR_COST_2026 = Math.round(
  (EFIR_PAY.paid2026 ?? 0) / EFIR_PAY.hired2026,
);

export const EFIR_FIRED_2025 = 55;
export const EFIR_FIRED_2026 = 14;
export const EFIR_LOSS_2025 = EFIR_COST_2025 * EFIR_FIRED_2025;
export const EFIR_LOSS_2026 = EFIR_COST_2026 * EFIR_FIRED_2026;
export const EFIR_LOSS_TOTAL = EFIR_LOSS_2025 + EFIR_LOSS_2026;

export const HIRED_TOTAL = PAYMENTS.reduce(
  (s, p) => s + p.hired2025 + p.hired2026,
  0,
);

export const SMALL_AGENCIES = PAYMENTS.filter(
  (p) => p.short !== "КА ЭФИР" && (p.paid2025 ?? 0) + (p.paid2026 ?? 0) > 0,
);
export const SMALL_PAID = SMALL_AGENCIES.reduce(
  (s, p) => s + (p.paid2025 ?? 0) + (p.paid2026 ?? 0),
  0,
);
export const SMALL_HIRED = SMALL_AGENCIES.reduce(
  (s, p) => s + p.hired2025 + p.hired2026,
  0,
);
export const SMALL_COST = Math.round(SMALL_PAID / SMALL_HIRED);

export const COST_PER_HIRE = PAYMENTS.filter((p) => {
  const total = (p.paid2025 ?? 0) + (p.paid2026 ?? 0);
  return total > 0 && p.hired2025 + p.hired2026 > 0;
})
  .map((p) => {
    const total = (p.paid2025 ?? 0) + (p.paid2026 ?? 0);
    const hired = p.hired2025 + p.hired2026;
    return {
      name: p.short,
      full: p.name,
      color: p.color,
      hired,
      total,
      cost: Math.round(total / hired),
    };
  })
  .sort((a, b) => b.cost - a.cost);

export const COST_MAX = COST_PER_HIRE[0].cost;
export const COST_MIN = COST_PER_HIRE[COST_PER_HIRE.length - 1].cost;
export const COST_AVG = Math.round(
  PAID_TOTAL / COST_PER_HIRE.reduce((s, c) => s + c.hired, 0),
);

export const money = (v: number) => v.toLocaleString("ru-RU");
export const mln = (v: number) => (v / 1000000).toFixed(1);
