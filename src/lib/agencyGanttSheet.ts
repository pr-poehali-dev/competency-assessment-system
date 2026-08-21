import type ExcelJS from 'exceljs';
import {
  AGENCIES,
  MONTHLY,
  AG_TOTAL_2025,
  AG_TOTAL_2026,
  AG_FIRED_2025,
  AG_FIRED_2026,
  agPct,
} from '@/data/agencies';
import { TERMS, COST_ROWS } from '@/data/agencyTerms';
import { PAYMENTS, PAID_TOTAL } from '@/data/payments';
import { VACANCIES, VACANCY_REPORT_DATE, VAC_PEOPLE, vacancyMonths, type Vacancy } from '@/data/vacancies';

const YELLOW = 'FFFFFF00';
const CREAM = 'FFFFFF99';
const IVORY = 'FFFFFFD2';
const WHITE = 'FFFFFFFF';
const GREY_F5 = 'FFF5F5F5';
const BLUE = 'FF9EB9E4';
const BLUE_DARK = 'FF3264B8';
const SILVER = 'FFC0C0C0';
const BLACK = 'FF000000';

const thin = { style: 'thin' as const, color: { argb: BLACK } };
const medium = { style: 'medium' as const, color: { argb: BLACK } };

const START = new Date(Date.UTC(2025, 0, 1));
const END = new Date(Date.UTC(2026, 11, 31));
const DAY = 24 * 60 * 60 * 1000;
const DAYS = Math.round((END.getTime() - START.getTime()) / DAY) + 1;

const LEFT = 9;
const CAL_FROM = LEFT + 1;
const CAL_TO = LEFT + DAYS;
const RIGHT_FROM = CAL_TO + 1;
const TOTAL_COLS = CAL_TO + 4;

const MONTH_NAMES = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

const dayCol = (d: Date) => LEFT + 1 + Math.round((d.getTime() - START.getTime()) / DAY);

const monthStarts: { col: number; label: string; year: number; month: number }[] = [];
for (let y = 2025; y <= 2026; y += 1) {
  for (let m = 0; m < 12; m += 1) {
    monthStarts.push({
      col: dayCol(new Date(Date.UTC(y, m, 1))),
      label: MONTH_NAMES[m],
      year: y,
      month: m,
    });
  }
}
const monthEndCol = (i: number) => (i + 1 < monthStarts.length ? monthStarts[i + 1].col - 1 : CAL_TO);

const REPORT = new Date(`${VACANCY_REPORT_DATE}T00:00:00Z`);

function deptGroup(v: Vacancy) {
  if (v.dept.startsWith('ПТИ')) return 'ПТИ';
  if (v.dept.includes('СМТ')) return 'СМТ';
  if (v.dept.includes('СИВ')) return 'Отдел проектирования СИВ';
  if (v.dept === 'УГП') return 'УГП';
  if (v.dept === 'Не указано') return 'Без подразделения';
  return 'Прочие подразделения';
}

const rateByAgency: Record<string, number> = {};
COST_ROWS.forEach((c) => {
  rateByAgency[c.agency] = c.rate;
});

export function addAgencyGanttSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Подбор КА', {
    properties: { tabColor: { argb: 'FFF59E0B' }, defaultColWidth: 0.5 },
    pageSetup: { paperSize: 8 as ExcelJS.PaperSize, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    views: [{ state: 'frozen', xSplit: LEFT, ySplit: 11 }],
  });

  const widths = [6.7, 3.7, 4.2, 36, 18, 4.5, 13, 9.5, 6.5];
  widths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });
  for (let c = CAL_FROM; c <= CAL_TO; c += 1) ws.getColumn(c).width = 0.42;
  [14, 12, 12, 12].forEach((w, i) => {
    ws.getColumn(RIGHT_FROM + i).width = w;
  });

  const paint = (
    row: ExcelJS.Row,
    col: number,
    opts: {
      value?: string | number;
      fill?: string;
      size?: number;
      bold?: boolean;
      color?: string;
      align?: 'left' | 'center' | 'right';
      wrap?: boolean;
      box?: boolean;
      numFmt?: string;
    } = {},
  ) => {
    const c = row.getCell(col);
    if (opts.value !== undefined) c.value = opts.value;
    c.font = { size: opts.size ?? 8, bold: opts.bold, color: { argb: opts.color ?? BLACK }, name: 'Arial' };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.fill ?? WHITE } };
    c.alignment = { horizontal: opts.align ?? 'left', vertical: 'middle', wrapText: opts.wrap };
    if (opts.box) c.border = { top: thin, left: thin, bottom: thin, right: thin };
    if (opts.numFmt) c.numFmt = opts.numFmt;
    return c;
  };

  const fillRow = (row: ExcelJS.Row, from: number, to: number, argb: string) => {
    for (let c = from; c <= to; c += 1) {
      row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
      row.getCell(c).font = { size: 8, name: 'Arial' };
    }
  };

  const monthGrid = (row: ExcelJS.Row) => {
    monthStarts.forEach((m) => {
      row.getCell(m.col).border = { ...(row.getCell(m.col).border ?? {}), left: thin };
    });
    row.getCell(CAL_TO).border = { ...(row.getCell(CAL_TO).border ?? {}), right: thin };
  };

  const r1 = ws.addRow([]);
  r1.height = 20;
  fillRow(r1, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(r1.number, 1, r1.number, 5);
  paint(r1, 1, { value: 'Подбор через кадровые агентства', fill: CREAM, size: 14, bold: true, align: 'center' });
  ws.mergeCells(r1.number, 6, r1.number, 9);
  paint(r1, 6, { value: 'Концерн КРОСТ', fill: CREAM, size: 12, bold: true, align: 'center' });
  ws.mergeCells(r1.number, CAL_FROM, r1.number, CAL_FROM + 120);
  paint(r1, CAL_FROM, {
    value: `2025 – 2026 гг.                    данные на ${VACANCY_REPORT_DATE.split('-').reverse().join('.')}`,
    size: 14,
    bold: true,
    color: 'FF3366FF',
    align: 'left',
  });

  const r2 = ws.addRow([]);
  r2.height = 16;
  fillRow(r2, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(r2.number, 1, r2.number, 9);
  paint(r2, 1, {
    value: `Список вакансий и объёмов найма, переданных кадровым агентствам`,
    size: 9,
    bold: true,
  });

  const r3 = ws.addRow([]);
  r3.height = 15;
  fillRow(r3, 1, TOTAL_COLS, WHITE);
  const legend: [string, string][] = [
    [BLUE, '— вакансия открыта'],
    [BLUE_DARK, '— просрочена больше года'],
    [SILVER, '— дата открытия не указана'],
    [CREAM, '— итоги по агентству'],
    [YELLOW, '— итоги по концерну'],
  ];
  let lc = CAL_FROM;
  legend.forEach(([color, label]) => {
    paint(r3, lc, { fill: color, box: true });
    ws.mergeCells(r3.number, lc + 2, r3.number, lc + 34);
    paint(r3, lc + 2, { value: label, size: 9 });
    lc += 40;
  });

  ws.addRow([]).height = 6;

  const rNum = ws.addRow([]);
  rNum.height = 11;
  fillRow(rNum, 1, TOTAL_COLS, WHITE);
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((c, i) => {
    paint(rNum, c, { value: i + 1, size: 7, align: 'center', color: 'FF808080' });
  });
  monthStarts.forEach((m, i) => {
    ws.mergeCells(rNum.number, m.col, rNum.number, monthEndCol(i));
    paint(rNum, m.col, { value: i + 10, size: 7, align: 'center', color: 'FF808080' });
  });
  [0, 1, 2, 3].forEach((i) => {
    paint(rNum, RIGHT_FROM + i, { value: 34 + i, size: 7, align: 'center', color: 'FF808080' });
  });

  const head = ws.addRow([]);
  head.height = 30;
  const heads = [
    '№\nп/п',
    '№\nотд.',
    '№\nсквоз.',
    'Вакансия / позиция',
    'Подразделение',
    'Чел.',
    'Оклад, ₽',
    'Открыта',
    'Мес. в\nработе',
  ];
  heads.forEach((h, i) => paint(head, i + 1, { value: h, bold: true, align: 'center', wrap: true, box: true }));
  ['Источник подбора', 'Ставка КА\n(тыс. руб)', 'Оплачено КА\n(тыс. руб)', 'Гарантия\n(мес.)'].forEach((h, i) =>
    paint(head, RIGHT_FROM + i, { value: h, bold: true, align: 'center', wrap: true, box: true }),
  );
  const years = [2025, 2026];
  years.forEach((y) => {
    const from = dayCol(new Date(Date.UTC(y, 0, 1)));
    const to = dayCol(new Date(Date.UTC(y, 11, 31)));
    ws.mergeCells(head.number, from, head.number, to);
    paint(head, from, { value: `${y} год`, bold: true, align: 'center', size: 10, box: true });
  });

  const mrow = ws.addRow([]);
  mrow.height = 16;
  fillRow(mrow, 1, TOTAL_COLS, WHITE);
  paint(mrow, 4, { value: 'Месяц', bold: true, align: 'center', box: true });
  monthStarts.forEach((m, i) => {
    ws.mergeCells(mrow.number, m.col, mrow.number, monthEndCol(i));
    paint(mrow, m.col, { value: m.label, bold: true, align: 'center', box: true, size: 8 });
  });

  const statRow = (label: string, get: (i: number) => number | string, fill: string, note: string | number) => {
    const r = ws.addRow([]);
    r.height = 16;
    fillRow(r, 1, TOTAL_COLS, fill);
    ws.mergeCells(r.number, 4, r.number, 5);
    paint(r, 4, { value: label, fill, bold: true, size: 10, box: true });
    paint(r, 6, { value: typeof note === 'number' ? note : note, fill, bold: true, size: 10, align: 'center', box: true });
    monthStarts.forEach((m, i) => {
      ws.mergeCells(r.number, m.col, r.number, monthEndCol(i));
      paint(r, m.col, { value: get(i), fill, bold: true, size: 9, align: 'center', box: true });
    });
    for (let c = RIGHT_FROM; c < RIGHT_FROM + 4; c += 1) paint(r, c, { fill, box: true });
    return r;
  };

  const hiredByMonth = (i: number) => {
    const m = monthStarts[i];
    const rec = MONTHLY[m.month];
    const v = m.year === 2025 ? rec.y2025 : rec.y2026;
    return v === null ? '' : v;
  };

  const totalHired = statRow('ИТОГО принято через КА', hiredByMonth, YELLOW, AG_TOTAL_2025 + AG_TOTAL_2026);
  paint(totalHired, RIGHT_FROM + 2, {
    value: Math.round(PAID_TOTAL / 1000),
    fill: YELLOW,
    bold: true,
    size: 10,
    align: 'center',
    box: true,
    numFmt: '# ##0',
  });

  const firedShare = (i: number) => {
    const m = monthStarts[i];
    const year = m.year === 2025 ? AG_FIRED_2025 : AG_FIRED_2026;
    const hired = m.year === 2025 ? AG_TOTAL_2025 : AG_TOTAL_2026;
    const h = hiredByMonth(i);
    if (h === '' || !hired) return '';
    return Math.round((h as number) * (year / hired));
  };
  statRow('Уволено из принятых', firedShare, YELLOW, AG_FIRED_2025 + AG_FIRED_2026);

  ws.addRow([]).height = 5;

  const agencyHead = ws.addRow([]);
  agencyHead.height = 16;
  fillRow(agencyHead, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(agencyHead.number, 4, agencyHead.number, 9);
  paint(agencyHead, 4, { value: 'Итоги по агентствам за 2025–2026 годы', bold: true, size: 10 });

  AGENCIES.forEach((a, idx) => {
    const r = ws.addRow([]);
    r.height = 15;
    fillRow(r, 1, TOTAL_COLS, CREAM);
    paint(r, 1, { value: idx + 1, fill: CREAM, align: 'center', box: true });
    ws.mergeCells(r.number, 4, r.number, 5);
    paint(r, 4, { value: a.name, fill: CREAM, bold: true, size: 10, box: true });
    paint(r, 6, { value: a.hired2025 + a.hired2026, fill: CREAM, bold: true, align: 'center', box: true });
    ws.mergeCells(r.number, 7, r.number, 8);
    paint(r, 7, {
      value: `уволено ${a.fired2025 + a.fired2026}`,
      fill: CREAM,
      align: 'center',
      box: true,
    });
    const hired = a.hired2025 + a.hired2026;
    paint(r, 9, {
      value: hired ? `${agPct(a.fired2025 + a.fired2026, hired).toFixed(0)}%` : '—',
      fill: CREAM,
      bold: true,
      align: 'center',
      box: true,
    });

    monthStarts.forEach((m, i) => {
      const total = m.year === 2025 ? AG_TOTAL_2025 : AG_TOTAL_2026;
      const own = m.year === 2025 ? a.hired2025 : a.hired2026;
      const h = hiredByMonth(i);
      const v = h === '' || !total ? '' : Math.round((h as number) * (own / total));
      ws.mergeCells(r.number, m.col, r.number, monthEndCol(i));
      paint(r, m.col, { value: v || '', fill: CREAM, size: 8, align: 'center', box: true });
    });

    const pay = PAYMENTS.find((p) => p.short === a.short || p.name.includes(a.short));
    const term = TERMS.find((t) => t.short === a.short || t.name.includes(a.short));
    const rate = rateByAgency[a.name] ?? rateByAgency[`КА ${a.short}`];
    paint(r, RIGHT_FROM, { value: a.name, fill: CREAM, size: 8, box: true });
    paint(r, RIGHT_FROM + 1, {
      value: rate ? Math.round(rate / 1000) : '—',
      fill: CREAM,
      align: 'center',
      box: true,
      numFmt: '# ##0',
    });
    const paid = (pay?.paid2025 ?? 0) + (pay?.paid2026 ?? 0);
    paint(r, RIGHT_FROM + 2, {
      value: paid ? Math.round(paid / 1000) : '—',
      fill: CREAM,
      bold: true,
      align: 'center',
      box: true,
      numFmt: '# ##0',
    });
    paint(r, RIGHT_FROM + 3, { value: term?.guaranteeMax ?? '—', fill: CREAM, align: 'center', box: true });
  });

  ws.addRow([]).height = 8;

  const vacTitle = ws.addRow([]);
  vacTitle.height = 16;
  fillRow(vacTitle, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(vacTitle.number, 4, vacTitle.number, 9);
  paint(vacTitle, 4, {
    value: `Вакансии в работе у кадровых агентств — ${VACANCIES.length} позиций, ${VAC_PEOPLE} человек`,
    bold: true,
    size: 10,
  });

  const groups = new Map<string, Vacancy[]>();
  VACANCIES.forEach((v) => {
    const g = deptGroup(v);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(v);
  });
  const ordered = [...groups.entries()].sort(
    (a, b) => b[1].reduce((s, v) => s + v.count, 0) - a[1].reduce((s, v) => s + v.count, 0),
  );

  let seq = 0;
  ordered.forEach(([group, items]) => {
    const g = ws.addRow([]);
    g.height = 15;
    fillRow(g, 1, TOTAL_COLS, IVORY);
    paint(g, 2, { value: items.length, fill: IVORY, align: 'center', box: true });
    ws.mergeCells(g.number, 4, g.number, 5);
    paint(g, 4, { value: group, fill: IVORY, bold: true, size: 10, box: true });
    paint(g, 6, {
      value: items.reduce((s, v) => s + v.count, 0),
      fill: IVORY,
      bold: true,
      align: 'center',
      box: true,
    });
    for (let c = 7; c <= 9; c += 1) paint(g, c, { fill: IVORY, box: true });
    for (let c = CAL_FROM; c <= TOTAL_COLS; c += 1) paint(g, c, { fill: IVORY });
    monthGrid(g);

    const sorted = [...items].sort((a, b) => (vacancyMonths(b) ?? -1) - (vacancyMonths(a) ?? -1));
    sorted.forEach((v, idx) => {
      seq += 1;
      const r = ws.addRow([]);
      r.height = 14;
      fillRow(r, 1, TOTAL_COLS, WHITE);
      const months = vacancyMonths(v);

      paint(r, 1, { value: seq, fill: GREY_F5, align: 'center', box: true });
      paint(r, 2, { value: idx + 1, fill: GREY_F5, align: 'center', box: true });
      paint(r, 3, { value: seq, fill: GREY_F5, align: 'center', box: true });
      paint(r, 4, { value: v.title, fill: IVORY, bold: true, box: true });
      paint(r, 5, { value: v.dept, box: true });
      paint(r, 6, { value: v.count, align: 'center', box: true, bold: true });
      paint(r, 7, { value: v.salary, align: 'center', box: true });
      paint(r, 8, { value: v.sinceLabel, align: 'center', box: true });
      paint(r, 9, {
        value: months === null ? '—' : Number(months.toFixed(1)),
        align: 'center',
        box: true,
        bold: true,
        color: months !== null && months >= 6 ? 'FFC00000' : BLACK,
      });

      monthGrid(r);

      if (v.since) {
        const from = Math.max(CAL_FROM, dayCol(new Date(`${v.since}T00:00:00Z`)));
        const to = Math.min(CAL_TO, dayCol(REPORT));
        const color = months !== null && months >= 12 ? BLUE_DARK : BLUE;
        for (let c = from; c <= to; c += 1) {
          r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
        }
        if (from <= to) {
          r.getCell(from).border = { ...(r.getCell(from).border ?? {}), left: medium };
          r.getCell(to).border = { ...(r.getCell(to).border ?? {}), right: medium };
        }
      } else {
        for (let c = CAL_FROM; c <= CAL_FROM + 20; c += 1) {
          r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SILVER } };
        }
      }

      paint(r, RIGHT_FROM, { value: 'КА ЭФИР', box: true });
      paint(r, RIGHT_FROM + 1, { value: 220.5, align: 'center', box: true, numFmt: '# ##0.0' });
      paint(r, RIGHT_FROM + 2, { value: '—', align: 'center', box: true });
      paint(r, RIGHT_FROM + 3, { value: 6, align: 'center', box: true });
    });
  });

  const foot = ws.addRow([]);
  foot.height = 16;
  fillRow(foot, 1, TOTAL_COLS, YELLOW);
  ws.mergeCells(foot.number, 4, foot.number, 5);
  paint(foot, 4, { value: 'ИТОГО вакансий в работе', fill: YELLOW, bold: true, size: 10, box: true });
  paint(foot, 6, { value: VAC_PEOPLE, fill: YELLOW, bold: true, align: 'center', box: true });
  for (let c = 7; c <= 9; c += 1) paint(foot, c, { fill: YELLOW, box: true });
  for (let c = CAL_FROM; c <= TOTAL_COLS; c += 1) paint(foot, c, { fill: YELLOW });
  monthGrid(foot);
  paint(foot, RIGHT_FROM, { value: 'все агентства', fill: YELLOW, bold: true, box: true });
  for (let c = RIGHT_FROM + 1; c < RIGHT_FROM + 4; c += 1) paint(foot, c, { fill: YELLOW, box: true });

  ws.addRow([]).height = 8;
  const src = ws.addRow([]);
  fillRow(src, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(src.number, 1, src.number, 40);
  paint(src, 1, {
    value:
      'Источник: отчёты «Принятые» и «Уволенные сотрудники» за 2025–2026 годы, список кадровых агентств с условиями сотрудничества, перечень вакансий в работе у КА ЭФИР.',
    size: 8,
    color: 'FF808080',
  });
}

export async function exportAgencyGanttToExcel() {
  const ExcelJSmod = (await import('exceljs')).default;
  const wb = new ExcelJSmod.Workbook();
  wb.creator = 'Концерн КРОСТ · отдел кадров';
  wb.created = new Date();
  addAgencyGanttSheet(wb);

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Подбор КА ${stamp}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
