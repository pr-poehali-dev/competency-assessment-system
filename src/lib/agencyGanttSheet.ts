import type ExcelJS from 'exceljs';
import {
  AGENCIES,
  MONTHLY,
  AGE_BANDS,
  POSITIONS,
  FIRED_TENURE,
  FIRED_POSITIONS,
  FIRED_AGE,
  AG_TOTAL_2025,
  AG_TOTAL_2026,
  AG_FIRED_2025,
  AG_FIRED_2026,
  AG_TURNOVER_2025,
  AG_TURNOVER_2026,
  EFIR_SHARE_2025,
  EFIR_SHARE_2026,
  FAST_FIRED_2025,
  FAST_FIRED_2026,
  AVG_TENURE_2025,
  AVG_TENURE_2026,
  AGE_AVG_2025,
  AGE_AVG_2026,
  FIRED_AGE_AVG_2025,
  FIRED_AGE_AVG_2026,
  RECRUITERS_2025,
  RECRUITERS_2026,
  SEARCH_DAYS,
  ONBOARDING_DAYS,
  MANAGER_HOURS,
  WORK_DAYS_MONTH,
  LOST_DAYS_2025,
  LOST_DAYS_2026,
  agPct,
} from '@/data/agencies';
import {
  TERMS,
  TERMS_DATE,
  COST_ROWS,
  COST_2025,
  COST_2026,
  COST_TOTAL,
  COST_AVG,
  GUARANTEE_BANDS,
  COVERED_CASES,
  UNCOVERED_CASES,
  COVERED_SUM,
  UNCOVERED_SUM,
  COVERED_PCT,
} from '@/data/agencyTerms';
import { PAYMENTS, PAID_2025, PAID_2026, PAID_TOTAL, EFIR_PAY_SHARE } from '@/data/payments';

const YELLOW = 'FFFFFF00';
const CREAM = 'FFFFFF99';
const IVORY = 'FFFFFFD2';
const WHITE = 'FFFFFFFF';
const GREY_F5 = 'FFF5F5F5';
const BLUE = 'FF9EB9E4';
const BLUE_DARK = 'FF3264B8';
const RED_SOFT = 'FFE49E9E';
const GREEN_SOFT = 'FFA9D08E';
const BLACK = 'FF000000';
const RED_TXT = 'FFC00000';

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
const RIGHT_COLS = 3;
const TOTAL_COLS = CAL_TO + RIGHT_COLS;

const MONTH_NAMES = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

const dayCol = (d: Date) => LEFT + 1 + Math.round((d.getTime() - START.getTime()) / DAY);

const monthStarts: { col: number; label: string; year: number; month: number }[] = [];
for (let y = 2025; y <= 2026; y += 1) {
  for (let m = 0; m < 12; m += 1) {
    monthStarts.push({ col: dayCol(new Date(Date.UTC(y, m, 1))), label: MONTH_NAMES[m], year: y, month: m });
  }
}
const monthEnd = (i: number) => (i + 1 < monthStarts.length ? monthStarts[i + 1].col - 1 : CAL_TO);

const rateByAgency: Record<string, number> = {};
COST_ROWS.forEach((c) => {
  rateByAgency[c.agency] = c.rate;
});

const th = (v: number) => Math.round(v / 1000);

export function addAgencyGanttSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Подбор КА', {
    properties: { tabColor: { argb: 'FFF59E0B' }, defaultColWidth: 0.5 },
    pageSetup: {
      paperSize: 8 as ExcelJS.PaperSize,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  const widths = [5.5, 3.7, 4.2, 40, 20, 8.5, 8.5, 9, 9];
  widths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });
  for (let c = CAL_FROM; c <= CAL_TO; c += 1) ws.getColumn(c).width = 0.42;
  [46, 14, 14].forEach((w, i) => {
    ws.getColumn(RIGHT_FROM + i).width = w;
  });

  type PaintOpts = {
    value?: string | number;
    fill?: string;
    size?: number;
    bold?: boolean;
    color?: string;
    align?: 'left' | 'center' | 'right';
    wrap?: boolean;
    box?: boolean;
    numFmt?: string;
  };

  const paint = (row: ExcelJS.Row, col: number, o: PaintOpts = {}) => {
    const c = row.getCell(col);
    if (o.value !== undefined) c.value = o.value;
    c.font = { size: o.size ?? 8, bold: o.bold, color: { argb: o.color ?? BLACK }, name: 'Arial' };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: o.fill ?? WHITE } };
    c.alignment = { horizontal: o.align ?? 'left', vertical: 'middle', wrapText: o.wrap };
    if (o.box) c.border = { top: thin, left: thin, bottom: thin, right: thin };
    if (o.numFmt) c.numFmt = o.numFmt;
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

  const bar = (row: ExcelJS.Row, months: number, color: string, label?: string) => {
    const from = monthStarts[0].col;
    const to = Math.min(CAL_TO, from + Math.round(months * 30.44) - 1);
    for (let c = from; c <= to; c += 1) {
      row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    }
    row.getCell(from).border = { ...(row.getCell(from).border ?? {}), left: medium };
    row.getCell(to).border = { ...(row.getCell(to).border ?? {}), right: medium };
    if (label) {
      const lab = Math.min(CAL_TO - 60, to + 3);
      ws.mergeCells(row.number, lab, row.number, Math.min(CAL_TO, lab + 55));
      paint(row, lab, { value: label, size: 8, bold: true });
    }
  };

  const r1 = ws.addRow([]);
  r1.height = 20;
  fillRow(r1, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(r1.number, 1, r1.number, 5);
  paint(r1, 1, { value: 'Подбор через кадровые агентства', fill: CREAM, size: 14, bold: true, align: 'center' });
  ws.mergeCells(r1.number, 6, r1.number, 9);
  paint(r1, 6, { value: 'Концерн КРОСТ', fill: CREAM, size: 12, bold: true, align: 'center' });
  ws.mergeCells(r1.number, CAL_FROM, r1.number, CAL_FROM + 130);
  paint(r1, CAL_FROM, {
    value: `2025 – 2026 гг.                    условия договоров на ${TERMS_DATE}`,
    size: 14,
    bold: true,
    color: 'FF3366FF',
  });

  const r2 = ws.addRow([]);
  r2.height = 16;
  fillRow(r2, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(r2.number, 1, r2.number, 9);
  paint(r2, 1, { value: 'Аналитика найма, качества подбора, договоров и расходов', size: 9, bold: true });

  const r3 = ws.addRow([]);
  r3.height = 15;
  fillRow(r3, 1, TOTAL_COLS, WHITE);
  const legend: [string, string][] = [
    [YELLOW, '— итоги по концерну'],
    [CREAM, '— строки агентств'],
    [IVORY, '— заголовки блоков'],
    [BLUE, '— длительность в месяцах'],
    [BLUE_DARK, '— гарантия по договору'],
    [RED_SOFT, '— зона потерь'],
    [GREEN_SOFT, '— покрыто гарантией'],
  ];
  let lc = CAL_FROM;
  legend.forEach(([color, label]) => {
    paint(r3, lc, { fill: color, box: true });
    ws.mergeCells(r3.number, lc + 2, r3.number, lc + 36);
    paint(r3, lc + 2, { value: label, size: 9 });
    lc += 42;
  });

  ws.addRow([]).height = 6;

  const rNum = ws.addRow([]);
  rNum.height = 11;
  fillRow(rNum, 1, TOTAL_COLS, WHITE);
  for (let c = 1; c <= 9; c += 1) paint(rNum, c, { value: c, size: 7, align: 'center', color: 'FF808080' });
  monthStarts.forEach((m, i) => {
    ws.mergeCells(rNum.number, m.col, rNum.number, monthEnd(i));
    paint(rNum, m.col, { value: i + 10, size: 7, align: 'center', color: 'FF808080' });
  });
  for (let i = 0; i < RIGHT_COLS; i += 1)
    paint(rNum, RIGHT_FROM + i, { value: 34 + i, size: 7, align: 'center', color: 'FF808080' });

  const head = ws.addRow([]);
  head.height = 30;
  ['№\nп/п', '№\nбл.', '№\nскв.', 'Показатель', 'Категория', '2025', '2026', 'Всего', 'Доля /\nдинамика'].forEach(
    (h, i) => paint(head, i + 1, { value: h, bold: true, align: 'center', wrap: true, box: true }),
  );
  ['Что это значит', 'Сумма\n(тыс. руб)', 'Гарантия\n(мес.)'].forEach((h, i) =>
    paint(head, RIGHT_FROM + i, { value: h, bold: true, align: 'center', wrap: true, box: true }),
  );
  [2025, 2026].forEach((y) => {
    const from = dayCol(new Date(Date.UTC(y, 0, 1)));
    const to = dayCol(new Date(Date.UTC(y, 11, 31)));
    ws.mergeCells(head.number, from, head.number, to);
    paint(head, from, { value: `${y} год`, bold: true, align: 'center', size: 10, box: true });
  });

  const mrow = ws.addRow([]);
  mrow.height = 16;
  fillRow(mrow, 1, TOTAL_COLS, WHITE);
  paint(mrow, 4, { value: 'Помесячная шкала', bold: true, align: 'center', box: true });
  monthStarts.forEach((m, i) => {
    ws.mergeCells(mrow.number, m.col, mrow.number, monthEnd(i));
    paint(mrow, m.col, { value: m.label, bold: true, align: 'center', box: true });
  });

  ws.views = [{ state: 'frozen', xSplit: LEFT, ySplit: mrow.number }];

  let block = 0;
  let seq = 0;

  function blockRow(title: string, hint: string) {
    block += 1;
    const r = ws.addRow([]);
    r.height = 17;
    fillRow(r, 1, TOTAL_COLS, IVORY);
    paint(r, 1, { value: block, fill: IVORY, bold: true, align: 'center', box: true, size: 9 });
    paint(r, 2, { fill: IVORY, box: true });
    paint(r, 3, { fill: IVORY, box: true });
    ws.mergeCells(r.number, 4, r.number, 5);
    paint(r, 4, { value: title, fill: IVORY, bold: true, size: 10, box: true });
    for (let c = 6; c <= 9; c += 1) paint(r, c, { fill: IVORY, box: true });
    ws.mergeCells(r.number, CAL_FROM, r.number, CAL_FROM + 150);
    paint(r, CAL_FROM, { value: hint, fill: IVORY, size: 9, color: 'FF404040' });
    for (let c = CAL_FROM + 151; c <= TOTAL_COLS; c += 1) paint(r, c, { fill: IVORY });
    monthGrid(r);
    return r;
  }

  type LineOpts = {
    cat?: string;
    v2025?: string | number;
    v2026?: string | number;
    total?: string | number;
    share?: string | number;
    hint?: string;
    sum?: number | string;
    guar?: number | string;
    fill?: string;
    bold?: boolean;
    idx?: number;
    danger?: boolean;
  };

  function line(name: string, o: LineOpts = {}) {
    seq += 1;
    const fill = o.fill ?? WHITE;
    const numFill = fill === WHITE ? GREY_F5 : fill;
    const r = ws.addRow([]);
    r.height = 15;
    fillRow(r, 1, TOTAL_COLS, fill);
    paint(r, 1, { value: seq, fill: numFill, align: 'center', box: true });
    paint(r, 2, { value: block, fill: numFill, align: 'center', box: true });
    paint(r, 3, { value: o.idx ?? '', fill: numFill, align: 'center', box: true });
    paint(r, 4, { value: name, fill: fill === WHITE ? IVORY : fill, bold: true, box: true });
    paint(r, 5, { value: o.cat ?? '', fill, box: true });
    paint(r, 6, { value: o.v2025 ?? '', fill, align: 'center', box: true, bold: true });
    paint(r, 7, { value: o.v2026 ?? '', fill, align: 'center', box: true, bold: true });
    paint(r, 8, { value: o.total ?? '', fill, align: 'center', box: true, bold: o.bold });
    paint(r, 9, {
      value: o.share ?? '',
      fill,
      align: 'center',
      box: true,
      bold: true,
      color: o.danger ? RED_TXT : BLACK,
    });
    monthGrid(r);
    paint(r, RIGHT_FROM, { value: o.hint ?? '', fill, box: true });
    paint(r, RIGHT_FROM + 1, { value: o.sum ?? '', fill, align: 'center', box: true, numFmt: '# ##0', bold: true });
    paint(r, RIGHT_FROM + 2, { value: o.guar ?? '', fill, align: 'center', box: true });
    return r;
  }

  function months(row: ExcelJS.Row, get: (i: number) => string | number, fill: string, bold = false) {
    monthStarts.forEach((m, i) => {
      ws.mergeCells(row.number, m.col, row.number, monthEnd(i));
      paint(row, m.col, { value: get(i), fill, align: 'center', box: true, bold });
    });
  }

  const hiredMonth = (i: number) => {
    const m = monthStarts[i];
    const v = m.year === 2025 ? MONTHLY[m.month].y2025 : MONTHLY[m.month].y2026;
    return v === null ? '' : v;
  };

  blockRow('Итоги по концерну', 'Помесячный объём найма через агентства и увольнения из числа принятых.');
  const t1 = line('ИТОГО принято через КА', {
    cat: 'найм',
    v2025: AG_TOTAL_2025,
    v2026: AG_TOTAL_2026,
    total: AG_TOTAL_2025 + AG_TOTAL_2026,
    share: '100%',
    hint: 'Объём внешнего подбора за два года',
    sum: th(PAID_TOTAL),
    fill: YELLOW,
    bold: true,
  });
  months(t1, hiredMonth, YELLOW, true);

  const t2 = line('Уволено из принятых', {
    cat: 'потери',
    v2025: AG_FIRED_2025,
    v2026: AG_FIRED_2026,
    total: AG_FIRED_2025 + AG_FIRED_2026,
    share: `${agPct(AG_FIRED_2025 + AG_FIRED_2026, AG_TOTAL_2025 + AG_TOTAL_2026).toFixed(0)}%`,
    hint: 'Люди, за которых заплатили, но которые не остались',
    sum: th(COST_TOTAL),
    fill: YELLOW,
    bold: true,
    danger: true,
  });
  months(
    t2,
    (i) => {
      const m = monthStarts[i];
      const h = hiredMonth(i);
      if (h === '') return '';
      const k = m.year === 2025 ? AG_FIRED_2025 / AG_TOTAL_2025 : AG_FIRED_2026 / AG_TOTAL_2026;
      return Math.round((h as number) * k) || '';
    },
    YELLOW,
    true,
  );

  line('Текучесть среди нанятых, %', {
    cat: 'качество',
    v2025: Number(AG_TURNOVER_2025.toFixed(1)),
    v2026: Number(AG_TURNOVER_2026.toFixed(1)),
    total: '—',
    share: `${(AG_TURNOVER_2026 - AG_TURNOVER_2025).toFixed(1)} п.п.`,
    hint: 'Каждый третий нанятый в 2025 году ушёл в тот же год',
  });
  line('Ушли в первые 6 месяцев, чел.', {
    cat: 'качество',
    v2025: FAST_FIRED_2025,
    v2026: FAST_FIRED_2026,
    total: FAST_FIRED_2025 + FAST_FIRED_2026,
    share: `${agPct(FAST_FIRED_2025 + FAST_FIRED_2026, AG_FIRED_2025 + AG_FIRED_2026).toFixed(0)}%`,
    hint: 'Основная масса уходов — на первые месяцы работы',
    danger: true,
  });
  line('Доля КА ЭФИР в найме, %', {
    cat: 'структура',
    v2025: Number(EFIR_SHARE_2025.toFixed(1)),
    v2026: Number(EFIR_SHARE_2026.toFixed(1)),
    total: '—',
    share: `+${(EFIR_SHARE_2026 - EFIR_SHARE_2025).toFixed(1)} п.п.`,
    hint: 'Зависимость от одного подрядчика выросла',
  });
  line('Рекрутеров работало с концерном', {
    cat: 'ресурс КА',
    v2025: RECRUITERS_2025,
    v2026: RECRUITERS_2026,
    total: '—',
    share: `+${RECRUITERS_2026 - RECRUITERS_2025}`,
    hint: 'Людей у подрядчика стало больше, качество не выросло',
  });

  blockRow('Объём найма по агентствам', 'Распределение найма по месяцам, увольнения и текучесть каждого подрядчика.');
  AGENCIES.forEach((a, idx) => {
    const hired = a.hired2025 + a.hired2026;
    const fired = a.fired2025 + a.fired2026;
    const pay = PAYMENTS.find((p) => p.short === a.short || p.name.includes(a.short));
    const term = TERMS.find((t) => t.short === a.short || t.name.includes(a.short));
    const paid = (pay?.paid2025 ?? 0) + (pay?.paid2026 ?? 0);
    const r = line(a.name, {
      cat: 'агентство',
      idx: idx + 1,
      v2025: a.hired2025,
      v2026: a.hired2026,
      total: hired,
      share: hired ? `${agPct(fired, hired).toFixed(0)}%` : '—',
      hint:
        a.short === 'ЭФИР'
          ? 'Основной подрядчик — на нём держится весь объём'
          : hired === 0
            ? 'Найма нет, но есть увольнения прошлых лет'
            : fired >= hired
              ? 'Ушло столько же или больше, чем нанято'
              : 'Небольшой объём',
      sum: paid ? th(paid) : '—',
      guar: term?.guaranteeMax ?? '—',
      fill: CREAM,
      danger: hired > 0 && agPct(fired, hired) >= 30,
    });
    months(
      r,
      (i) => {
        const m = monthStarts[i];
        const total = m.year === 2025 ? AG_TOTAL_2025 : AG_TOTAL_2026;
        const own = m.year === 2025 ? a.hired2025 : a.hired2026;
        const h = hiredMonth(i);
        if (h === '' || !total) return '';
        return Math.round((h as number) * (own / total)) || '';
      },
      CREAM,
    );
  });

  const firedAll = AG_FIRED_2025 + AG_FIRED_2026;

  blockRow(
    'Качество найма: сколько отработали до ухода',
    'Длина полосы — фактический срок работы до увольнения. Красная зона — уходы внутри испытательного срока.',
  );
  FIRED_TENURE.forEach((t, idx) => {
    const total = t.y2025 + t.y2026;
    const r = line(`Отработали ${t.band}`, {
      cat: 'срок работы',
      idx: idx + 1,
      v2025: t.y2025,
      v2026: t.y2026,
      total,
      share: `${agPct(total, firedAll).toFixed(0)}%`,
      hint:
        idx === 0
          ? 'Не дошли до конца испытательного срока'
          : idx === 1
            ? 'Ушли сразу после испытательного срока'
            : 'Гарантия большинства договоров уже не действует',
      sum: th(total * COST_AVG),
      danger: idx === 0,
    });
    const len = idx === 0 ? 3 : idx === 1 ? 6 : 12;
    bar(r, len, idx === 0 ? RED_SOFT : idx === 1 ? BLUE : BLUE_DARK, `${total} чел. ушли за ${t.band}`);
  });
  line('Средний срок работы до ухода, мес.', {
    cat: 'итог',
    v2025: AVG_TENURE_2025,
    v2026: AVG_TENURE_2026,
    total: '—',
    share: `${(AVG_TENURE_2026 - AVG_TENURE_2025).toFixed(1)}`,
    hint: 'Человек не доходит даже до конца испытательного срока',
    fill: YELLOW,
    bold: true,
    danger: true,
  });

  blockRow('Должности с наибольшими потерями', 'Длина полосы — доля ушедших от числа нанятых на эту должность.');
  FIRED_POSITIONS.forEach((p, idx) => {
    const h = POSITIONS.find((x) => x.pos === p.pos);
    const hired = (h?.y2025 ?? 0) + (h?.y2026 ?? 0);
    const fired = p.y2025 + p.y2026;
    const pct = hired ? agPct(fired, hired) : null;
    const r = line(p.pos, {
      cat: 'должность',
      idx: idx + 1,
      v2025: p.y2025,
      v2026: p.y2026,
      total: fired,
      share: pct === null ? '—' : `${pct.toFixed(0)}%`,
      hint:
        pct !== null && pct >= 50
          ? 'Каждый второй нанятый уходит — пересмотреть профиль'
          : `Нанято за два года: ${hired || '—'}`,
      sum: th(fired * COST_AVG),
      danger: pct !== null && pct >= 50,
    });
    if (hired) {
      bar(
        r,
        Math.max(1, Math.round((fired / hired) * 24)),
        pct !== null && pct >= 50 ? RED_SOFT : BLUE,
        `ушло ${fired} из ${hired} нанятых`,
      );
    }
  });

  blockRow('Возраст кандидатов от агентств', 'Кого приводят агентства и кто из них не остаётся.');
  AGE_BANDS.forEach((b, idx) => {
    const f = FIRED_AGE.find((x) => x.band === b.band);
    const hired = b.y2025 + b.y2026;
    const fired = (f?.y2025 ?? 0) + (f?.y2026 ?? 0);
    const r = line(b.band, {
      cat: 'возраст',
      idx: idx + 1,
      v2025: b.y2025,
      v2026: b.y2026,
      total: hired,
      share: `${agPct(fired, hired).toFixed(0)}%`,
      hint: `Ушло ${fired} человек из ${hired} нанятых`,
      sum: fired ? th(fired * COST_AVG) : '—',
      danger: agPct(fired, hired) >= 30,
    });
    bar(r, Math.max(1, Math.round((hired / 120) * 24)), BLUE, `нанято ${hired} чел.`);
  });
  line('Средний возраст, лет', {
    cat: 'итог',
    v2025: AGE_AVG_2025,
    v2026: AGE_AVG_2026,
    total: '—',
    share: `ушли: ${FIRED_AGE_AVG_2025} / ${FIRED_AGE_AVG_2026}`,
    hint: 'Уходят в среднем люди чуть старше, чем приходят',
    fill: YELLOW,
    bold: true,
  });

  blockRow(
    'Цена быстрых уходов: потерянное время',
    `На каждую замену уходит ${SEARCH_DAYS} дней поиска и ${ONBOARDING_DAYS} дней адаптации, плюс ${MANAGER_HOURS} часов руководителя.`,
  );
  const cycle = line('Цикл одной замены', {
    cat: 'расчёт',
    idx: 1,
    v2025: `${SEARCH_DAYS} дн.`,
    v2026: `${ONBOARDING_DAYS} дн.`,
    total: `${SEARCH_DAYS + ONBOARDING_DAYS} дн.`,
    share: `${((SEARCH_DAYS + ONBOARDING_DAYS) / WORK_DAYS_MONTH).toFixed(1)} мес.`,
    hint: 'Поиск замены плюс адаптация новичка на каждого ушедшего',
  });
  const cStart = monthStarts[0].col;
  for (let c = cStart; c < cStart + SEARCH_DAYS; c += 1)
    cycle.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: RED_SOFT } };
  for (let c = cStart + SEARCH_DAYS; c < cStart + SEARCH_DAYS + ONBOARDING_DAYS; c += 1)
    cycle.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE } };
  ws.mergeCells(cycle.number, cStart + 63, cycle.number, cStart + 130);
  paint(cycle, cStart + 63, { value: 'поиск 30 дней + адаптация 30 дней', size: 8, bold: true });

  const lostDaysAll = LOST_DAYS_2025 + LOST_DAYS_2026;
  const l1 = line('Потеряно рабочих дней', {
    cat: 'потери',
    idx: 2,
    v2025: LOST_DAYS_2025,
    v2026: LOST_DAYS_2026,
    total: lostDaysAll,
    share: `${(lostDaysAll / WORK_DAYS_MONTH).toFixed(0)} чел.-мес.`,
    hint: 'Время на поиск и адаптацию вместо работы',
    danger: true,
  });
  bar(l1, 22, RED_SOFT, `${(lostDaysAll / WORK_DAYS_MONTH / 12).toFixed(1)} человеко-лет`);
  line('Часов руководителей на собеседования', {
    cat: 'потери',
    idx: 3,
    v2025: AG_FIRED_2025 * MANAGER_HOURS,
    v2026: AG_FIRED_2026 * MANAGER_HOURS,
    total: firedAll * MANAGER_HOURS,
    share: `${Math.round((firedAll * MANAGER_HOURS) / 8)} раб. дней`,
    hint: 'Время руководителей на собеседования по заменам',
  });

  blockRow('Условия договоров с агентствами', 'Длина полосы — срок гарантии по договору. Красная — гарантия всего 3 месяца.');
  TERMS.forEach((t, idx) => {
    const rate = rateByAgency[t.name] ?? rateByAgency[`КА ${t.short}`];
    const r = line(`${t.name} · ${t.contract}`, {
      cat: t.entity,
      idx: idx + 1,
      v2025: t.priceShort,
      v2026: t.vat,
      total: t.hired,
      share: t.paymentSplit ? 'частями' : '100% сразу',
      hint: `Нанято ${t.hired}, уволилось ${t.fired}. ${t.paymentSplit ? 'Платим частями' : 'Вся сумма вперёд'}`,
      sum: rate ? th(rate) : '—',
      guar: t.guaranteeMax,
      fill: CREAM,
      danger: t.guaranteeMax <= 3,
    });
    bar(
      r,
      t.guaranteeMax,
      t.guaranteeMax >= 6 ? BLUE_DARK : t.guaranteeMax >= 5 ? BLUE : RED_SOFT,
      `гарантия ${t.guaranteeMax} мес., дальше замена за наш счёт`,
    );
  });

  blockRow('Стоимость подбора уволившихся', 'Длина полосы — доля агентства в общей сумме потерь на уволившихся.');
  COST_ROWS.forEach((c, idx) => {
    const s25 = c.rate * c.fired2025;
    const s26 = c.rate * c.fired2026;
    const sum = s25 + s26;
    const r = line(c.agency, {
      cat: c.rateLabel,
      idx: idx + 1,
      v2025: c.fired2025,
      v2026: c.fired2026,
      total: c.fired2025 + c.fired2026,
      share: `${th(c.rate)} т.р.`,
      hint: `Потрачено на тех, кто ушёл: ${th(sum).toLocaleString('ru-RU')} тыс. руб`,
      sum: th(sum),
      fill: CREAM,
      danger: sum > 1_000_000,
    });
    if (sum) bar(r, Math.max(1, Math.round((sum / COST_TOTAL) * 24)), RED_SOFT);
  });
  line('ИТОГО потрачено на тех, кто ушёл', {
    cat: `в среднем ${th(COST_AVG)} т.р. / чел.`,
    v2025: th(COST_2025),
    v2026: th(COST_2026),
    total: firedAll,
    share: 'тыс. руб',
    hint: 'Прямые деньги за подбор людей, которые не остались',
    sum: th(COST_TOTAL),
    fill: YELLOW,
    bold: true,
    danger: true,
  });

  blockRow('Гарантии: что покрыто, а что уже нет', 'Зелёная полоса — попадает в гарантию, красная — платим повторно сами.');
  GUARANTEE_BANDS.forEach((b, idx) => {
    const r = line(`Ушли ${b.band}`, {
      cat: b.covered ? 'в гарантии' : 'вне гарантии',
      idx: idx + 1,
      v2025: b.cases,
      v2026: b.covered ? 'да' : 'нет',
      total: b.cases,
      share: `${agPct(b.cases, COVERED_CASES + UNCOVERED_CASES).toFixed(0)}%`,
      hint: b.note,
      sum: th(b.cases * COST_AVG),
      danger: !b.covered,
    });
    const len = idx === 0 ? 3 : idx === 1 ? 6 : 12;
    bar(r, len, b.covered ? GREEN_SOFT : RED_SOFT, b.covered ? 'можно требовать замену' : 'замена за наш счёт');
  });
  line('ИТОГО по гарантиям', {
    cat: 'резерв экономии',
    v2025: COVERED_CASES,
    v2026: UNCOVERED_CASES,
    total: COVERED_CASES + UNCOVERED_CASES,
    share: `${COVERED_PCT.toFixed(0)}% покрыто`,
    hint: `Покрыто ${th(COVERED_SUM)} т.р., вне гарантии ${th(UNCOVERED_SUM)} т.р.`,
    sum: th(COVERED_SUM),
    fill: YELLOW,
    bold: true,
  });

  blockRow('Сколько заплатили агентствам', 'Длина полосы — доля подрядчика в общей сумме оплат.');
  PAYMENTS.forEach((p, idx) => {
    const total = (p.paid2025 ?? 0) + (p.paid2026 ?? 0);
    const hired = p.hired2025 + p.hired2026;
    const cost = total && hired ? Math.round(total / hired) : null;
    const r = line(p.name, {
      cat: 'платежи',
      idx: idx + 1,
      v2025: p.paid2025 ? th(p.paid2025) : '—',
      v2026: p.paid2026 ? th(p.paid2026) : '—',
      total: hired || '—',
      share: cost ? `${th(cost)} т.р.` : '—',
      hint: p.note ?? (cost ? `Цена одного найма: ${th(cost)} тыс. руб` : 'Данных по оплатам нет'),
      sum: total ? th(total) : '—',
      fill: CREAM,
      danger: cost !== null && cost > 500_000,
    });
    if (total) bar(r, Math.max(1, Math.round((total / PAID_TOTAL) * 24)), BLUE_DARK);
  });
  line('ИТОГО оплачено агентствам', {
    cat: 'все подрядчики',
    v2025: th(PAID_2025),
    v2026: th(PAID_2026),
    total: AG_TOTAL_2025 + AG_TOTAL_2026,
    share: `ЭФИР ${EFIR_PAY_SHARE.toFixed(0)}%`,
    hint: 'Прямые расходы концерна на внешний подбор за два года',
    sum: th(PAID_TOTAL),
    fill: YELLOW,
    bold: true,
  });

  blockRow('Что делаем дальше', 'Решения, которые следуют из цифр выше.');
  (
    [
      ['Заявить претензии по гарантии', `${COVERED_CASES} уходов в гарантийном сроке`, th(COVERED_SUM)],
      ['Перевести оплату на этапы', 'Платить после выхода и после испытательного срока', '—'],
      ['Пересмотреть договоры с гарантией 3 месяца', 'Основная масса уходов — ровно этот срок', '—'],
      ['Разобрать профили проблемных должностей', 'Позиции, где уходит каждый второй нанятый', '—'],
      ['Снизить зависимость от одного подрядчика', `Доля ЭФИР в найме — ${EFIR_SHARE_2026.toFixed(0)}%`, '—'],
    ] as [string, string, number | string][]
  ).forEach(([name, hint, sum], idx) => {
    line(name, { cat: 'решение', idx: idx + 1, hint, sum });
  });

  ws.addRow([]).height = 8;
  const src = ws.addRow([]);
  fillRow(src, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(src.number, 1, src.number, 60);
  paint(src, 1, {
    value:
      'Источник: отчёты «Принятые» и «Уволенные сотрудники» за 2025–2026 годы, договоры с кадровыми агентствами, данные бухгалтерии по оплатам.',
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