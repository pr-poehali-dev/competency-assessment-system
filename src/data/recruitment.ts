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
