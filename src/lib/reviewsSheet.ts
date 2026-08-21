import type ExcelJS from 'exceljs';
import {
  REVIEWS_META,
  REVIEW_PLUSES,
  REVIEW_MINUSES,
  TOP3_MINUSES,
  PLUS_MENTIONS,
  MINUS_MENTIONS,
  TOP3_MENTIONS,
  TOP3_SHARE,
  AVG_MINUS_PER_REVIEW,
  AVG_PLUS_PER_REVIEW,
} from '@/data/reviews';

const pctOf = (v: number, base: number) => Math.round((v / base) * 100);

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
const GREEN_TXT = 'FF375623';

const thin = { style: 'thin' as const, color: { argb: BLACK } };

const LEFT = 9;
const BAR_COL = LEFT + 1;
const RIGHT_FROM = LEFT + 2;
const RIGHT_COLS = 3;
const TOTAL_COLS = RIGHT_FROM + RIGHT_COLS - 1;

export function addReviewsSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Отзывы о компании', {
    properties: { tabColor: { argb: 'FFDC2626' } },
    pageSetup: {
      paperSize: 8 as ExcelJS.PaperSize,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  const widths = [5.5, 4, 4.5, 42, 22, 10, 10, 10, 12];
  widths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });
  ws.getColumn(BAR_COL).width = 30;
  [52, 12, 13].forEach((w, i) => {
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
    italic?: boolean;
  };

  const paint = (row: ExcelJS.Row, col: number, o: PaintOpts = {}) => {
    const c = row.getCell(col);
    if (o.value !== undefined) c.value = o.value;
    c.font = {
      size: o.size ?? 8,
      bold: o.bold,
      italic: o.italic,
      color: { argb: o.color ?? BLACK },
      name: 'Arial',
    };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: o.fill ?? WHITE } };
    c.alignment = { horizontal: o.align ?? 'left', vertical: 'middle', wrapText: o.wrap };
    if (o.box) c.border = { top: thin, left: thin, bottom: thin, right: thin };
    return c;
  };

  const fillRow = (row: ExcelJS.Row, from: number, to: number, argb: string) => {
    for (let c = from; c <= to; c += 1) {
      row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
      row.getCell(c).font = { size: 8, name: 'Arial' };
    }
  };

  const bar = (row: ExcelJS.Row, share: number, color: string, label?: string) => {
    const filled = Math.max(1, Math.min(20, Math.round(share * 20)));
    const c = row.getCell(BAR_COL);
    c.value = `${'█'.repeat(filled)}${'░'.repeat(20 - filled)}${label ? `  ${label}` : ''}`;
    c.font = { size: 8, name: 'Arial', color: { argb: BLACK } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    c.alignment = { horizontal: 'left', vertical: 'middle' };
    c.border = { top: thin, left: thin, bottom: thin, right: thin };
  };

  const r1 = ws.addRow([]);
  r1.height = 20;
  fillRow(r1, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(r1.number, 1, r1.number, 5);
  paint(r1, 1, { value: 'Отзывы о компании', fill: CREAM, size: 14, bold: true, align: 'center' });
  ws.mergeCells(r1.number, 6, r1.number, 9);
  paint(r1, 6, { value: 'Концерн КРОСТ', fill: CREAM, size: 12, bold: true, align: 'center' });
  ws.mergeCells(r1.number, BAR_COL, r1.number, TOTAL_COLS);
  paint(r1, BAR_COL, {
    value: `${REVIEWS_META.total} отзывов сотрудников и соискателей`,
    size: 12,
    bold: true,
    color: 'FF3366FF',
  });

  const r2 = ws.addRow([]);
  r2.height = 16;
  fillRow(r2, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(r2.number, 1, r2.number, 9);
  paint(r2, 1, { value: 'Плюсы, минусы и ТОП-3 проблемы бренда работодателя', size: 9, bold: true });

  const r3 = ws.addRow([]);
  r3.height = 15;
  fillRow(r3, 1, TOTAL_COLS, WHITE);
  const legend: [string, string][] = [
    [YELLOW, 'итоги'],
    [CREAM, 'темы'],
    [IVORY, 'блоки'],
    [GREEN_SOFT, 'плюсы'],
    [RED_SOFT, 'минусы'],
    [BLUE_DARK, 'ТОП-3'],
    [BLUE, 'цитаты'],
  ];
  legend.forEach(([color, label], i) => {
    paint(r3, i + 1, { value: label, fill: color, size: 8, align: 'center', box: true });
  });

  ws.addRow([]).height = 6;

  const rNum = ws.addRow([]);
  rNum.height = 11;
  fillRow(rNum, 1, TOTAL_COLS, WHITE);
  for (let c = 1; c <= TOTAL_COLS; c += 1) paint(rNum, c, { value: c, size: 7, align: 'center', color: 'FF808080' });

  const head = ws.addRow([]);
  head.height = 30;
  ['№\nп/п', '№\nбл.', '№\nскв.', 'Тема', 'Категория', 'Упомин.', 'База', 'Доля от\nотзывов', 'Тональность'].forEach((h, i) =>
    paint(head, i + 1, { value: h, bold: true, align: 'center', wrap: true, box: true }),
  );
  paint(head, BAR_COL, { value: 'Наглядно', bold: true, align: 'center', wrap: true, box: true });
  ['Что это значит', 'Доля от\nупомин.', 'Оценка'].forEach((h, i) =>
    paint(head, RIGHT_FROM + i, { value: h, bold: true, align: 'center', wrap: true, box: true }),
  );

  ws.views = [{ state: 'frozen', xSplit: 5, ySplit: head.number }];

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
    ws.mergeCells(r.number, BAR_COL, r.number, TOTAL_COLS);
    paint(r, BAR_COL, { value: hint, fill: IVORY, size: 9, color: 'FF404040', box: true });
    return r;
  }

  type LineOpts = {
    cat?: string;
    count?: string | number;
    share?: string | number;
    total?: string | number;
    tone?: string;
    hint?: string;
    pctCol?: string | number;
    mark?: string;
    fill?: string;
    bold?: boolean;
    idx?: number;
    danger?: boolean;
    good?: boolean;
    height?: number;
  };

  function line(name: string, o: LineOpts = {}) {
    seq += 1;
    const fill = o.fill ?? WHITE;
    const numFill = fill === WHITE ? GREY_F5 : fill;
    const color = o.danger ? RED_TXT : o.good ? GREEN_TXT : BLACK;
    const r = ws.addRow([]);
    r.height = o.height ?? (name.length > 46 ? 24 : 15);
    fillRow(r, 1, TOTAL_COLS, fill);
    paint(r, 1, { value: seq, fill: numFill, align: 'center', box: true });
    paint(r, 2, { value: block, fill: numFill, align: 'center', box: true });
    paint(r, 3, { value: o.idx ?? '', fill: numFill, align: 'center', box: true });
    paint(r, 4, { value: name, fill: fill === WHITE ? IVORY : fill, bold: true, box: true, wrap: true });
    paint(r, 5, { value: o.cat ?? '', fill, box: true, wrap: true });
    paint(r, 6, { value: o.count ?? '', fill, align: 'center', box: true, bold: true, color });
    paint(r, 7, { value: o.share ?? '', fill, align: 'center', box: true, bold: true, color });
    paint(r, 8, { value: o.total ?? '', fill, align: 'center', box: true });
    paint(r, 9, { value: o.tone ?? '', fill, align: 'center', box: true, bold: true, color });
    paint(r, BAR_COL, { fill, box: true });
    paint(r, RIGHT_FROM, { value: o.hint ?? '', fill, box: true, wrap: true });
    paint(r, RIGHT_FROM + 1, { value: o.pctCol ?? '', fill, align: 'center', box: true, bold: true, color });
    paint(r, RIGHT_FROM + 2, { value: o.mark ?? '', fill, align: 'center', box: true, color, wrap: true });
    return r;
  }

  function detail(label: string, lines: string[], italic = false, color = BLACK) {
    const r = ws.addRow([]);
    r.height = Math.max(14, lines.length * 12 + 2);
    fillRow(r, 1, TOTAL_COLS, WHITE);
    for (let c = 1; c <= 3; c += 1) paint(r, c, { fill: GREY_F5, box: true });
    paint(r, 4, { value: label, size: 8, bold: true, color: 'FF606060', box: true, wrap: true });
    ws.mergeCells(r.number, 5, r.number, TOTAL_COLS);
    const c = paint(r, 5, { value: lines.join('\n'), size: 8, box: true, italic, color });
    c.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    return r;
  }

  /* ── 1. Главное по отзывам ── */
  const minusTotal = MINUS_MENTIONS;
  const plusTotal = PLUS_MENTIONS;
  const top3Sum = TOP3_MENTIONS;

  blockRow('Главное по отзывам', 'Сколько отзывов разобрано и что в них преобладает.');
  const t1 = line('Всего отзывов разобрано', {
    cat: 'выборка',
    count: REVIEWS_META.total,
    share: REVIEWS_META.total,
    total: '100%',
    hint: 'Отзывы сотрудников и соискателей с открытых площадок',
    pctCol: '100%',
    fill: YELLOW,
    bold: true,
  });
  bar(t1, 1, YELLOW, `${REVIEWS_META.total} отзывов`);

  const t2 = line('Отзывы с указанными плюсами', {
    cat: 'позитив',
    count: REVIEWS_META.withPlus,
    share: REVIEWS_META.total,
    total: `${pctOf(REVIEWS_META.withPlus, REVIEWS_META.total)}%`,
    tone: 'плюс',
    hint: `База для долей плюсов: проценты в блоке плюсов считаются от ${REVIEWS_META.withPlus} отзывов`,
    pctCol: `${pctOf(REVIEWS_META.withPlus, REVIEWS_META.total)}%`,
    mark: 'основа бренда',
    fill: YELLOW,
    bold: true,
    good: true,
  });
  bar(t2, REVIEWS_META.withPlus / REVIEWS_META.total, GREEN_SOFT, `${REVIEWS_META.withPlus} из ${REVIEWS_META.total}`);

  const t3 = line('Отзывы с содержательными минусами', {
    cat: 'негатив',
    count: REVIEWS_META.withMinus,
    share: REVIEWS_META.total,
    total: `${pctOf(REVIEWS_META.withMinus, REVIEWS_META.total)}%`,
    tone: 'минус',
    hint: `База для долей минусов: проценты в блоке минусов считаются от ${REVIEWS_META.withMinus} отзывов`,
    pctCol: `${pctOf(REVIEWS_META.withMinus, REVIEWS_META.total)}%`,
    mark: 'зона работы',
    fill: YELLOW,
    bold: true,
    danger: true,
  });
  bar(t3, REVIEWS_META.withMinus / REVIEWS_META.total, RED_SOFT, `${REVIEWS_META.withMinus} из ${REVIEWS_META.total}`);

  line('Отзывы без минусов', {
    cat: 'нейтрально',
    idx: 1,
    count: REVIEWS_META.noMinus,
    share: REVIEWS_META.total,
    total: `${pctOf(REVIEWS_META.noMinus, REVIEWS_META.total)}%`,
    hint: 'В графе минусов написано «нет», «не заметила» или пусто',
    pctCol: `${pctOf(REVIEWS_META.noMinus, REVIEWS_META.total)}%`,
    good: true,
  });
  line('Уникальных тем в минусах', {
    cat: 'структура',
    idx: 2,
    count: REVIEWS_META.uniqueMinus,
    share: `${REVIEW_MINUSES.length} групп`,
    total: minusTotal,
    hint: `${REVIEWS_META.uniqueMinus} разных формулировок сведены в ${REVIEW_MINUSES.length} тем, всего ${minusTotal} упоминаний`,
    pctCol: '100%',
  });
  line('Доля ТОП-3 минусов', {
    cat: 'концентрация',
    idx: 3,
    count: top3Sum,
    share: minusTotal,
    total: `${TOP3_SHARE}%`,
    tone: 'минус',
    hint: `Три темы дают ${TOP3_SHARE}% всех упоминаний минусов — точка приложения усилий`,
    pctCol: `${TOP3_SHARE}%`,
    mark: 'приоритет',
    danger: true,
  });

  /* ── 2. ТОП-3 минуса ── */
  blockRow('ТОП-3 минуса — на что реагировать в первую очередь', 'Темы с наибольшим числом упоминаний и планом действий.');
  TOP3_MINUSES.forEach((t, idx) => {
    const r = line(t.title, {
      cat: 'критичный минус',
      idx: idx + 1,
      count: t.count,
      share: REVIEWS_META.withMinus,
      total: `${t.share}%`,
      tone: 'минус',
      hint: t.detail,
      pctCol: `${t.mentionShare}%`,
      mark: `приоритет ${idx + 1}`,
      fill: CREAM,
      danger: true,
      height: 34,
    });
    bar(r, t.share / 100, RED_SOFT, `${t.count} из ${REVIEWS_META.withMinus} отзывов`);
    detail('Цитаты из отзывов', t.quotes.map((q) => `«${q}»`), true, 'FF606060');
    if (t.action) detail('Что предлагается сделать', [t.action], false, GREEN_TXT);
  });

  /* ── 3. Все минусы по темам ── */
  blockRow('Все минусы по темам', `Полный разбор претензий. Столбец «Доля от отзывов» — от ${REVIEWS_META.withMinus} отзывов с минусами, «Доля от упомин.» — от ${minusTotal} упоминаний.`);
  REVIEW_MINUSES.forEach((t, idx) => {
    const r = line(t.title, {
      cat: idx < 3 ? 'критичный минус' : t.count >= 3 ? 'заметный минус' : 'единичный минус',
      idx: idx + 1,
      count: t.count,
      share: REVIEWS_META.withMinus,
      total: `${t.share}%`,
      tone: 'минус',
      hint: t.detail,
      pctCol: `${t.mentionShare}%`,
      mark: idx < 3 ? 'высокий' : t.count >= 3 ? 'средний' : 'низкий',
      danger: idx < 3,
      height: 34,
    });
    bar(r, t.share / 100, idx < 3 ? RED_SOFT : t.count >= 3 ? BLUE_DARK : BLUE, `${t.count} упоминаний`);
    detail('Цитаты из отзывов', t.quotes.map((q) => `«${q}»`), true, 'FF606060');
  });
  const mTotal = line('ИТОГО упоминаний минусов', {
    cat: 'итог',
    count: minusTotal,
    share: REVIEWS_META.withMinus,
    total: '100%',
    hint: `${minusTotal} упоминаний в ${REVIEWS_META.withMinus} отзывах — в среднем ${AVG_MINUS_PER_REVIEW} претензии на отзыв`,
    pctCol: '100%',
    fill: YELLOW,
    bold: true,
    danger: true,
  });
  bar(mTotal, 1, YELLOW, `${minusTotal} упоминаний`);

  /* ── 4. Плюсы по темам ── */
  blockRow('Плюсы по темам — на чём строить бренд работодателя', `Столбец «Доля от отзывов» — от ${REVIEWS_META.withPlus} отзывов с плюсами, «Доля от упомин.» — от ${plusTotal} упоминаний.`);
  REVIEW_PLUSES.forEach((t, idx) => {
    const r = line(t.title, {
      cat: idx < 3 ? 'сильная сторона' : 'дополнительный плюс',
      idx: idx + 1,
      count: t.count,
      share: REVIEWS_META.withPlus,
      total: `${t.share}%`,
      tone: 'плюс',
      hint: t.detail,
      pctCol: `${t.mentionShare}%`,
      mark: idx < 3 ? 'ключевой' : 'поддерживающий',
      good: true,
      height: 26,
    });
    bar(r, t.share / 100, idx < 3 ? GREEN_SOFT : BLUE, `${t.count} упоминаний`);
    detail('Цитаты из отзывов', t.quotes.map((q) => `«${q}»`), true, 'FF606060');
  });
  const pTotal = line('ИТОГО упоминаний плюсов', {
    cat: 'итог',
    count: plusTotal,
    share: REVIEWS_META.withPlus,
    total: '100%',
    hint: `${plusTotal} упоминаний в ${REVIEWS_META.withPlus} отзывах — в среднем ${AVG_PLUS_PER_REVIEW} плюса на отзыв`,
    pctCol: '100%',
    fill: YELLOW,
    bold: true,
    good: true,
  });
  bar(pTotal, 1, YELLOW, `${plusTotal} упоминаний`);

  /* ── 5. Выводы ── */
  blockRow('Ключевые выводы', 'Что показывают отзывы и как это связано с подбором и текучестью.');
  const insights: [string, string, string][] = [
    [
      'Деньги, люди и проекты — работающая основа',
      `${REVIEW_PLUSES[0].share}% и ${REVIEW_PLUSES[1].share}%`,
      `Зарплата названа в ${REVIEW_PLUSES[0].share}% положительных отзывов, коллектив — в ${REVIEW_PLUSES[1].share}%. На этом строится бренд работодателя`,
    ],
    [
      'Негатив не в зарплате, а в условиях вокруг неё',
      `${TOP3_SHARE}% упоминаний`,
      `Соцпакет, переработки и отношение руководителей дают ${top3Sum} из ${minusTotal} упоминаний минусов`,
    ],
    [
      'Зона риска для подбора',
      `${REVIEW_MINUSES[3].share}% отзывов`,
      'Медкомиссия за счёт кандидата и расхождение вакансии с реальностью отсеивают людей ещё до выхода',
    ],
    [
      'Прямая связь с затратами на подбор',
      `${REVIEWS_META.withMinus} из ${REVIEWS_META.total}`,
      'Устранение ТОП-3 минусов снижает текучку, а значит и объём повторного подбора',
    ],
  ];
  insights.forEach(([title, val, text], idx) => {
    line(title, {
      cat: 'вывод',
      idx: idx + 1,
      total: val,
      hint: text,
      fill: YELLOW,
      bold: true,
      height: 22,
    });
  });

  const src = ws.addRow([]);
  src.height = 22;
  fillRow(src, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(src.number, 1, src.number, TOTAL_COLS);
  paint(src, 1, { value: `Источник: ${REVIEWS_META.source}`, size: 8, color: 'FF808080' });

  return ws;
}
