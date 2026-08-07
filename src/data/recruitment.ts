export type SourceRow = {
  source: string;
  short: string;
  y2025: number;
  y2026: number;
  group: 'jobboard' | 'referral' | 'internal' | 'agency' | 'unknown' | 'other';
};

export const SOURCES: SourceRow[] = [
  { source: 'По рекомендации', short: 'Рекомендации', y2025: 414, y2026: 301, group: 'referral' },
  { source: 'HeadHunter.ru', short: 'HeadHunter', y2025: 290, y2026: 182, group: 'jobboard' },
  { source: 'ОПП (Отдел подбора персонала)', short: 'ОПП', y2025: 228, y2026: 106, group: 'internal' },
  { source: 'Кадровое агентство', short: 'Кадр. агентство', y2025: 189, y2026: 112, group: 'agency' },
  { source: 'Работал ранее', short: 'Работал ранее', y2025: 57, y2026: 50, group: 'referral' },
  { source: 'НЕ УКАЗАН', short: 'Не указан', y2025: 16, y2026: 15, group: 'unknown' },
  { source: 'Нет информации', short: 'Нет информации', y2025: 7, y2026: 14, group: 'unknown' },
  { source: 'Отдел кадров ОБУ Гагарин', short: 'ОК Гагарин', y2025: 10, y2026: 1, group: 'internal' },
  { source: 'Родственники', short: 'Родственники', y2025: 10, y2026: 2, group: 'referral' },
  { source: 'Перевод (из рабочих)', short: 'Перевод (рабочие)', y2025: 5, y2026: 2, group: 'internal' },
  { source: 'Авито', short: 'Авито', y2025: 4, y2026: 0, group: 'jobboard' },
  { source: 'Кастинг', short: 'Кастинг', y2025: 3, y2026: 1, group: 'other' },
  { source: 'Job-MO.ru', short: 'Job-MO', y2025: 3, y2026: 0, group: 'jobboard' },
  { source: 'SuperJob.ru', short: 'SuperJob', y2025: 1, y2026: 0, group: 'jobboard' },
  { source: 'Акция «Приведи друга»', short: 'Приведи друга', y2025: 0, y2026: 1, group: 'referral' },
];

export const GROUP_META: Record<SourceRow['group'], { label: string; color: string }> = {
  referral: { label: 'Рекомендации и связи', color: '#16a34a' },
  jobboard: { label: 'Job-сайты', color: '#0ea5e9' },
  internal: { label: 'Внутренние ресурсы', color: '#8b5cf6' },
  agency: { label: 'Кадровые агентства', color: '#f59e0b' },
  unknown: { label: 'Источник не указан', color: '#94a3b8' },
  other: { label: 'Прочее', color: '#ec4899' },
};

export const TOTAL_2025 = SOURCES.reduce((s, r) => s + r.y2025, 0);
export const TOTAL_2026 = SOURCES.reduce((s, r) => s + r.y2026, 0);

export const pct = (v: number, total: number) => (total ? (v / total) * 100 : 0);

export const GROUPED = (Object.keys(GROUP_META) as SourceRow['group'][])
  .map((g) => {
    const rows = SOURCES.filter((r) => r.group === g);
    return {
      group: g,
      label: GROUP_META[g].label,
      color: GROUP_META[g].color,
      y2025: rows.reduce((s, r) => s + r.y2025, 0),
      y2026: rows.reduce((s, r) => s + r.y2026, 0),
    };
  })
  .filter((g) => g.y2025 + g.y2026 > 0)
  .sort((a, b) => b.y2026 - a.y2026);

/* ─────────── УВОЛЬНЕНИЯ ─────────── */

export type DismissalRow = {
  source: string;
  short: string;
  y2025: number;
  y2026: number;
};

export const DISMISSALS: DismissalRow[] = [
  { source: 'По рекомендации', short: 'Рекомендации', y2025: 61, y2026: 24 },
  { source: 'HeadHunter.ru', short: 'HeadHunter', y2025: 69, y2026: 21 },
  { source: 'Кадровое агентство', short: 'Кадр. агентство', y2025: 58, y2026: 20 },
  { source: 'ОПП (Отдел подбора персонала)', short: 'ОПП', y2025: 72, y2026: 9 },
  { source: 'НЕ УКАЗАН', short: 'Не указан', y2025: 59, y2026: 5 },
  { source: 'Нет информации', short: 'Нет информации', y2025: 5, y2026: 4 },
  { source: 'Работал ранее', short: 'Работал ранее', y2025: 5, y2026: 4 },
  { source: 'Отдел кадров ОБУ Гагарин', short: 'ОК Гагарин', y2025: 3, y2026: 1 },
  { source: 'Перевод (из др. подразделения)', short: 'Перевод (др. подр.)', y2025: 33, y2026: 0 },
  { source: 'Перевод (из рабочих)', short: 'Перевод (рабочие)', y2025: 1, y2026: 0 },
  { source: 'Кастинг', short: 'Кастинг', y2025: 1, y2026: 0 },
  { source: 'Наружная реклама', short: 'Наружная реклама', y2025: 1, y2026: 0 },
];

export const DISM_2025 = DISMISSALS.reduce((s, r) => s + r.y2025, 0);
export const DISM_2026 = DISMISSALS.reduce((s, r) => s + r.y2026, 0);

export type TenureRow = { label: string; full: string; y2025: number; y2026: number };

export const TENURE: TenureRow[] = [
  { label: 'до 1 года', full: 'Менее 1 года', y2025: 314, y2026: 84 },
  { label: '1–3 года', full: 'От 1 до 3 лет', y2025: 29, y2026: 1 },
  { label: '3–5 лет', full: 'От 3 до 5 лет', y2025: 7, y2026: 1 },
  { label: '5–10 лет', full: 'От 5 до 10 лет', y2025: 16, y2026: 1 },
  { label: '10–20 лет', full: 'От 10 до 20 лет', y2025: 2, y2026: 1 },
  { label: '20+ лет', full: 'Более 20 лет', y2025: 0, y2026: 0 },
];

export const TENURE_2025 = TENURE.reduce((s, r) => s + r.y2025, 0);
export const TENURE_2026 = TENURE.reduce((s, r) => s + r.y2026, 0);

export const retentionBySource = SOURCES.map((s) => {
  const d = DISMISSALS.find((x) => x.source === s.source);
  const hired = s.y2026;
  const fired = d?.y2026 ?? 0;
  return {
    source: s.source,
    short: s.short,
    hired,
    fired,
    turnover: hired > 0 ? (fired / hired) * 100 : 0,
    group: s.group,
  };
})
  .filter((r) => r.hired >= 10)
  .sort((a, b) => a.turnover - b.turnover);

export const EARLY_SHARE = TENURE[0].y2026 / TENURE.reduce((s, r) => s + r.y2026, 0);

export const channelRisk = SOURCES.map((s) => {
  const fired = DISMISSALS.find((x) => x.source === s.source)?.y2026 ?? 0;
  const hired = s.y2026;
  const turnover = hired > 0 ? (fired / hired) * 100 : 0;
  const earlyFired = Math.round(fired * EARLY_SHARE);
  return {
    source: s.source,
    short: s.short,
    group: s.group,
    hired,
    fired,
    earlyFired,
    turnover,
    retained: hired - fired,
    lostRate: turnover,
    level: (turnover >= 20 ? 'high' : turnover >= 12 ? 'mid' : 'low') as 'high' | 'mid' | 'low',
  };
})
  .filter((r) => r.hired > 0)
  .sort((a, b) => b.turnover - a.turnover);

export const RISK_META = {
  high: { label: 'Высокий риск', color: '#dc2626', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  mid: { label: 'Средний риск', color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  low: { label: 'Низкий риск', color: '#16a34a', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
} as const;