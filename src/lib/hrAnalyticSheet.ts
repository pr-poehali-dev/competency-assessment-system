import type ExcelJS from 'exceljs';
import {
  SOURCES,
  GROUPED,
  GROUP_META,
  TOTAL_2025,
  TOTAL_2026,
  DISMISSALS,
  DISM_2025,
  DISM_2026,
  TENURE,
  TENURE_2025,
  TENURE_2026,
  channelRisk,
  retentionBySource,
  pct,
} from '@/data/recruitment';
import {
  REASON_TOP,
  REASONS_TOTAL,
  REASONS_BY_EMPLOYEE,
  REASONS_BY_EMPLOYER,
  MANAGEABLE_TOTAL,
  UNMANAGEABLE_TOTAL,
  TENURE_BANDS,
  TENURE_REASONS_TOTAL,
  TENURE_MEDIAN_MONTHS,
  DEPARTMENTS,
  POSITIONS,
  DEPT_TOTAL,
  DEPT_LT3,
  DEPT_LT12,
  REASON_GROUPS,
  rPct,
} from '@/data/reasons';

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

const LEFT = 9;
const BAR_COL = LEFT + 1;
const RIGHT_FROM = LEFT + 2;
const RIGHT_COLS = 3;
const TOTAL_COLS = RIGHT_FROM + RIGHT_COLS - 1;

const reasonLabel: Record<string, string> = {};
REASON_GROUPS.forEach((g) => {
  reasonLabel[g.key] = g.short;
});

export function addHrAnalyticSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Подбор и текучесть', {
    properties: { tabColor: { argb: 'FF1A1A2E' } },
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
  paint(r1, 1, { value: 'Подбор и текучесть персонала', fill: CREAM, size: 14, bold: true, align: 'center' });
  ws.mergeCells(r1.number, 6, r1.number, 9);
  paint(r1, 6, { value: 'Концерн КРОСТ', fill: CREAM, size: 12, bold: true, align: 'center' });
  ws.mergeCells(r1.number, BAR_COL, r1.number, TOTAL_COLS);
  paint(r1, BAR_COL, { value: '2025 – 2026 гг.', size: 12, bold: true, color: 'FF3366FF' });

  const r2 = ws.addRow([]);
  r2.height = 16;
  fillRow(r2, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(r2.number, 1, r2.number, 9);
  paint(r2, 1, {
    value: 'Эффективность каналов найма, удержание сотрудников и причины увольнений',
    size: 9,
    bold: true,
  });

  const r3 = ws.addRow([]);
  r3.height = 15;
  fillRow(r3, 1, TOTAL_COLS, WHITE);
  const legend: [string, string][] = [
    [YELLOW, 'итоги'],
    [CREAM, 'каналы'],
    [IVORY, 'блоки'],
    [BLUE, 'объём'],
    [GREEN_SOFT, 'низкий риск'],
    [BLUE_DARK, 'средний'],
    [RED_SOFT, 'высокий риск'],
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
  ['№\nп/п', '№\nбл.', '№\nскв.', 'Показатель', 'Категория', '2025', '2026', 'Всего', 'Доля /\nдинамика'].forEach(
    (h, i) => paint(head, i + 1, { value: h, bold: true, align: 'center', wrap: true, box: true }),
  );
  paint(head, BAR_COL, { value: 'Наглядно', bold: true, align: 'center', wrap: true, box: true });
  ['Что это значит', 'Доля,\n%', 'Оценка'].forEach((h, i) =>
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
    v2025?: string | number;
    v2026?: string | number;
    total?: string | number;
    share?: string | number;
    hint?: string;
    pctCol?: number | string;
    mark?: string;
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
    paint(r, BAR_COL, { fill, box: true });
    paint(r, RIGHT_FROM, { value: o.hint ?? '', fill, box: true });
    paint(r, RIGHT_FROM + 1, { value: o.pctCol ?? '', fill, align: 'center', box: true, bold: true });
    paint(r, RIGHT_FROM + 2, {
      value: o.mark ?? '',
      fill,
      align: 'center',
      box: true,
      color: o.danger ? RED_TXT : BLACK,
    });
    return r;
  }

  /* ── 1. Главное за два года ── */
  const turn2025 = pct(DISM_2025, TOTAL_2025);
  const turn2026 = pct(DISM_2026, TOTAL_2026);
  const freeGroups = GROUPED.filter((g) => ['referral', 'internal', 'opp'].includes(g.group));
  const free2026 = freeGroups.reduce((s, g) => s + g.y2026, 0);
  const free2025 = freeGroups.reduce((s, g) => s + g.y2025, 0);
  const real = channelRisk.filter((c) => c.hired >= 10 && c.group !== 'unknown');
  const worst = real[0];
  const bestCh = real[real.length - 1];

  blockRow('Главное за два года', 'Ключевые цифры подбора и удержания. Каждая строка раскрывается ниже.');
  const m1 = line('Нанято сотрудников', {
    cat: 'найм',
    v2025: TOTAL_2025,
    v2026: TOTAL_2026,
    total: TOTAL_2025 + TOTAL_2026,
    share: `${TOTAL_2026 - TOTAL_2025} чел.`,
    hint: 'Общий объём найма по всем каналам',
    pctCol: '100%',
    fill: YELLOW,
    bold: true,
  });
  bar(m1, 1, YELLOW, `${TOTAL_2025 + TOTAL_2026} человек`);

  const m2 = line('Уволилось сотрудников', {
    cat: 'потери',
    v2025: DISM_2025,
    v2026: DISM_2026,
    total: DISM_2025 + DISM_2026,
    share: `${DISM_2026 - DISM_2025} чел.`,
    hint: 'Ушли из числа работающих за тот же период',
    pctCol: `${pct(DISM_2025 + DISM_2026, TOTAL_2025 + TOTAL_2026).toFixed(0)}%`,
    fill: YELLOW,
    bold: true,
    danger: true,
  });
  bar(m2, (DISM_2025 + DISM_2026) / (TOTAL_2025 + TOTAL_2026), YELLOW, `${DISM_2025 + DISM_2026} чел.`);

  line('Текучесть кадров, %', {
    cat: 'качество',
    idx: 1,
    v2025: Number(turn2025.toFixed(1)),
    v2026: Number(turn2026.toFixed(1)),
    total: '—',
    share: `${(turn2026 - turn2025).toFixed(1)} п.п.`,
    hint: 'Отношение уволившихся к нанятым — показатель снижается',
    mark: turn2026 < turn2025 ? 'улучшение' : 'ухудшение',
  });
  line('Доля бесплатных каналов, %', {
    cat: 'структура',
    idx: 2,
    v2025: Number(pct(free2025, TOTAL_2025).toFixed(1)),
    v2026: Number(pct(free2026, TOTAL_2026).toFixed(1)),
    total: free2025 + free2026,
    share: `${(pct(free2026, TOTAL_2026) - pct(free2025, TOTAL_2025)).toFixed(1)} п.п.`,
    hint: 'Рекомендации, ОПП и внутренние ресурсы — без затрат на подбор',
    pctCol: `${pct(free2026, TOTAL_2026).toFixed(0)}%`,
  });
  line('Уходы в первый год работы, %', {
    cat: 'качество',
    idx: 3,
    v2025: Number(pct(TENURE[0].y2025, TENURE_2025).toFixed(1)),
    v2026: Number(pct(TENURE[0].y2026, TENURE_2026).toFixed(1)),
    total: TENURE[0].y2025 + TENURE[0].y2026,
    share: 'критическая зона',
    hint: 'Основная масса увольнений — сотрудники со стажем менее года',
    danger: true,
    mark: 'риск',
  });
  line('Самый устойчивый канал', {
    cat: 'канал',
    idx: 4,
    v2025: bestCh.short,
    v2026: `${bestCh.turnover.toFixed(1)}%`,
    total: bestCh.hired,
    share: `ушло ${bestCh.fired}`,
    hint: 'Минимальная текучесть — стоит наращивать объём найма',
    mark: 'низкий риск',
  });
  line('Самый проблемный канал', {
    cat: 'канал',
    idx: 5,
    v2025: worst.short,
    v2026: `${worst.turnover.toFixed(1)}%`,
    total: worst.hired,
    share: `ушло ${worst.fired}`,
    hint: 'Максимальная текучесть при высокой цене подбора',
    danger: true,
    mark: 'высокий риск',
  });

  /* ── 2. Источники найма ── */
  blockRow('Источники найма', 'Откуда приходят сотрудники. Длина полосы — доля источника в найме 2026 года.');
  [...SOURCES]
    .sort((a, b) => b.y2026 + b.y2025 - (a.y2026 + a.y2025))
    .forEach((s, idx) => {
      const total = s.y2025 + s.y2026;
      const diff = s.y2026 - s.y2025;
      const r = line(s.source, {
        cat: GROUP_META[s.group].label,
        idx: idx + 1,
        v2025: s.y2025,
        v2026: s.y2026,
        total,
        share: `${diff > 0 ? '+' : ''}${diff}`,
        hint:
          s.group === 'referral'
            ? 'Бесплатный канал — рекомендации сотрудников'
            : s.group === 'agency'
              ? 'Платный канал — оплата агентству за каждого'
              : s.group === 'unknown'
                ? 'Источник не заполнен в кадровом учёте'
                : 'Собственный или внешний канал подбора',
        pctCol: `${pct(s.y2026, TOTAL_2026).toFixed(1)}%`,
        fill: CREAM,
        danger: s.group === 'unknown',
      });
      bar(r, total / (TOTAL_2025 + TOTAL_2026), CREAM, `${total} чел. за два года`);
    });

  /* ── 3. Группы каналов ── */
  blockRow('Группы каналов подбора', 'Укрупнённая структура найма: бесплатные каналы против платных.');
  GROUPED.forEach((g, idx) => {
    const total = g.y2025 + g.y2026;
    const free = ['referral', 'internal', 'opp'].includes(g.group);
    const r = line(g.label, {
      cat: free ? 'бесплатный' : 'платный / прочее',
      idx: idx + 1,
      v2025: g.y2025,
      v2026: g.y2026,
      total,
      share: `${g.y2026 - g.y2025}`,
      hint: free ? 'Не требует прямых расходов на подбор' : 'Требует оплаты подрядчику или размещения',
      pctCol: `${pct(g.y2026, TOTAL_2026).toFixed(1)}%`,
      mark: free ? 'бесплатно' : 'платно',
    });
    bar(r, g.y2026 / TOTAL_2026, free ? GREEN_SOFT : BLUE, `${pct(g.y2026, TOTAL_2026).toFixed(0)}% найма 2026`);
  });
  line('ИТОГО нанято', {
    cat: 'итог',
    v2025: TOTAL_2025,
    v2026: TOTAL_2026,
    total: TOTAL_2025 + TOTAL_2026,
    share: `${pct(free2026, TOTAL_2026).toFixed(0)}% бесплатно`,
    hint: 'Больше половины найма закрывается без расходов на подбор',
    fill: YELLOW,
    bold: true,
  });

  /* ── 4. Текучесть по каналам ── */
  blockRow('Текучесть по каналам подбора', 'Сколько нанятых через канал ушло в 2026 году. Красный — риск от 20%.');
  channelRisk.forEach((c, idx) => {
    const color = c.level === 'high' ? RED_SOFT : c.level === 'mid' ? BLUE_DARK : GREEN_SOFT;
    const r = line(c.source, {
      cat: GROUP_META[c.group].label,
      idx: idx + 1,
      v2025: `${c.hired} нанято`,
      v2026: `${c.fired} ушло`,
      total: c.retained,
      share: `${c.turnover.toFixed(1)}%`,
      hint:
        c.level === 'high'
          ? 'Каждый пятый и более уходит — канал требует пересмотра'
          : c.level === 'mid'
            ? 'Текучесть выше средней, стоит следить'
            : 'Канал даёт устойчивых сотрудников',
      pctCol: `${c.turnover.toFixed(0)}%`,
      mark: c.level === 'high' ? 'высокий' : c.level === 'mid' ? 'средний' : 'низкий',
      danger: c.level === 'high',
    });
    bar(r, c.turnover / 100, color, `ушло ${c.fired} из ${c.hired}`);
  });

  /* ── 5. Удержание по источникам ── */
  blockRow('Удержание по источникам', 'Каналы с объёмом от 10 человек, отсортированы по качеству удержания.');
  retentionBySource.forEach((s, idx) => {
    const keep = 100 - s.turnover;
    const r = line(s.source, {
      cat: 'удержание',
      idx: idx + 1,
      v2025: `${s.hired} нанято`,
      v2026: `${s.fired} ушло`,
      total: s.hired - s.fired,
      share: `${keep.toFixed(1)}%`,
      hint: `Осталось работать ${s.hired - s.fired} из ${s.hired} нанятых`,
      pctCol: `${keep.toFixed(0)}%`,
      mark: keep >= 88 ? 'лучший' : keep >= 80 ? 'норма' : 'слабый',
      danger: keep < 80,
    });
    bar(r, keep / 100, keep >= 88 ? GREEN_SOFT : keep >= 80 ? BLUE : RED_SOFT, `удержано ${keep.toFixed(0)}%`);
  });

  /* ── 6. Увольнения по источникам ── */
  blockRow('Увольнения по источникам найма', 'Кто уходит чаще всего в абсолютных цифрах.');
  [...DISMISSALS]
    .sort((a, b) => b.y2025 + b.y2026 - (a.y2025 + a.y2026))
    .forEach((d, idx) => {
      const total = d.y2025 + d.y2026;
      const r = line(d.source, {
        cat: 'увольнения',
        idx: idx + 1,
        v2025: d.y2025,
        v2026: d.y2026,
        total,
        share: `${d.y2026 - d.y2025}`,
        hint: `Всего ушло ${total} человек за два года`,
        pctCol: `${pct(total, DISM_2025 + DISM_2026).toFixed(1)}%`,
      });
      bar(r, total / (DISM_2025 + DISM_2026), RED_SOFT, `${total} чел.`);
    });
  line('ИТОГО уволилось', {
    cat: 'итог',
    v2025: DISM_2025,
    v2026: DISM_2026,
    total: DISM_2025 + DISM_2026,
    share: `${(turn2026 - turn2025).toFixed(1)} п.п.`,
    hint: 'Текучесть снижается второй год подряд',
    fill: YELLOW,
    bold: true,
  });

  /* ── 7. Стаж на момент увольнения ── */
  blockRow('Стаж на момент увольнения', 'Сколько отработали те, кто ушёл. Красная зона — первый год.');
  TENURE.forEach((t, idx) => {
    const total = t.y2025 + t.y2026;
    const r = line(t.full, {
      cat: 'стаж',
      idx: idx + 1,
      v2025: t.y2025,
      v2026: t.y2026,
      total,
      share: `${pct(t.y2026, TENURE_2026).toFixed(0)}%`,
      hint:
        idx === 0
          ? 'Критическая зона — адаптация не сработала'
          : idx === 1
            ? 'Ушли, уже освоившись в компании'
            : 'Опытные сотрудники, уходы единичны',
      pctCol: `${pct(total, TENURE_2025 + TENURE_2026).toFixed(1)}%`,
      danger: idx === 0,
      mark: idx === 0 ? 'риск' : '',
    });
    bar(r, total / (TENURE_2025 + TENURE_2026), idx === 0 ? RED_SOFT : idx === 1 ? BLUE : BLUE_DARK, `${total} чел.`);
  });
  line('Медианный стаж до увольнения, мес.', {
    cat: 'итог',
    v2025: '—',
    v2026: `${TENURE_MEDIAN_MONTHS} мес.`,
    total: '—',
    share: 'меньше года',
    hint: 'Половина ушедших не отработала и года',
    fill: YELLOW,
    bold: true,
    danger: true,
  });

  /* ── 8. Причины увольнения ── */
  blockRow(
    'Причины увольнения',
    `Всего разобрано ${REASONS_TOTAL} случаев. Управляемые причины — те, на которые компания может влиять.`,
  );
  REASON_TOP.forEach((g, idx) => {
    const r = line(g.label, {
      cat: g.manageable ? 'управляемая' : 'вне контроля',
      idx: idx + 1,
      v2025: `${g.emp} сотр.`,
      v2026: `${g.empr} работ.`,
      total: g.total,
      share: `${rPct(g.total).toFixed(1)}%`,
      hint: g.comment,
      pctCol: `${rPct(g.total).toFixed(0)}%`,
      mark: g.manageable ? 'можем влиять' : 'не влияем',
      fill: CREAM,
      danger: g.manageable && rPct(g.total) >= 10,
    });
    bar(r, g.total / REASON_TOP[0].total, g.manageable ? RED_SOFT : BLUE, `${g.total} случаев`);
  });
  const initRow = line('Инициатива увольнения', {
    cat: 'итог',
    v2025: `${REASONS_BY_EMPLOYEE} сотр.`,
    v2026: `${REASONS_BY_EMPLOYER} работ.`,
    total: REASONS_TOTAL,
    share: `${rPct(REASONS_BY_EMPLOYEE).toFixed(0)}% — сотрудник`,
    hint: 'Почти все уходы — по собственному желанию сотрудника',
    fill: YELLOW,
    bold: true,
  });
  bar(initRow, REASONS_BY_EMPLOYEE / REASONS_TOTAL, YELLOW, 'по инициативе сотрудника');

  const mngRow = line('Управляемость причин', {
    cat: 'итог',
    v2025: `${MANAGEABLE_TOTAL} упр.`,
    v2026: `${UNMANAGEABLE_TOTAL} вне`,
    total: REASONS_TOTAL,
    share: `${rPct(MANAGEABLE_TOTAL).toFixed(0)}% управляемо`,
    hint: 'Основную часть уходов можно предотвратить силами компании',
    fill: YELLOW,
    bold: true,
  });
  bar(mngRow, MANAGEABLE_TOTAL / REASONS_TOTAL, YELLOW, `${MANAGEABLE_TOTAL} из ${REASONS_TOTAL}`);

  /* ── 9. Причины по стажу ── */
  blockRow(
    'Причины увольнения по стажу',
    `Разобрано ${TENURE_REASONS_TOTAL} случаев: что выталкивает людей на разных сроках работы.`,
  );
  TENURE_BANDS.forEach((b, idx) => {
    const top = Object.entries(b.reasons)
      .sort((a, c) => c[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${reasonLabel[k] ?? k} — ${v}`)
      .join(', ');
    const r = line(b.full, {
      cat: 'стаж',
      idx: idx + 1,
      v2025: `${b.emp} сотр.`,
      v2026: `${b.empr} работ.`,
      total: b.total,
      share: `${pct(b.total, TENURE_REASONS_TOTAL).toFixed(0)}%`,
      hint: top,
      pctCol: `${pct(b.total, TENURE_REASONS_TOTAL).toFixed(0)}%`,
      danger: idx <= 1,
    });
    bar(r, b.total / TENURE_REASONS_TOTAL, idx <= 1 ? RED_SOFT : BLUE, `${b.total} чел.`);
  });

  /* ── 10. Подразделения ── */
  blockRow('Подразделения с коротким стажем', 'Медианный стаж до ухода и доля уходов в первый год по подразделениям.');
  DEPARTMENTS.forEach((d, idx) => {
    const early = pct(d.lt12, d.n);
    const r = line(d.name, {
      cat: 'подразделение',
      idx: idx + 1,
      v2025: `${d.n} чел.`,
      v2026: `${d.median} мес.`,
      total: d.lt12,
      share: `${early.toFixed(0)}%`,
      hint: `Основные причины: ${d.top.map((k) => reasonLabel[k] ?? k).join(', ')}`,
      pctCol: `${early.toFixed(0)}%`,
      mark: d.median <= 6 ? 'короткий стаж' : d.median >= 13 ? 'устойчиво' : 'средне',
      danger: d.median <= 6,
    });
    bar(r, d.median / 24, d.median <= 6 ? RED_SOFT : d.median >= 13 ? GREEN_SOFT : BLUE, `медиана ${d.median} мес.`);
  });
  line('ИТОГО по подразделениям', {
    cat: 'итог',
    v2025: `${DEPT_TOTAL} чел.`,
    v2026: `${TENURE_MEDIAN_MONTHS} мес.`,
    total: DEPT_LT12,
    share: `${pct(DEPT_LT12, DEPT_TOTAL).toFixed(0)}% в первый год`,
    hint: `Из ${DEPT_TOTAL} случаев ${DEPT_LT3} ушли в первые три месяца`,
    fill: YELLOW,
    bold: true,
    danger: true,
  });

  /* ── 11. Должности ── */
  blockRow('Должности с коротким стажем', 'Где люди уходят быстрее всего — точки для пересмотра профиля вакансии.');
  POSITIONS.forEach((p, idx) => {
    const early = pct(p.lt12, p.n);
    const r = line(p.name, {
      cat: 'должность',
      idx: idx + 1,
      v2025: `${p.n} чел.`,
      v2026: `${p.median} мес.`,
      total: p.lt12,
      share: `${early.toFixed(0)}%`,
      hint: `Основные причины: ${p.top.map((k) => reasonLabel[k] ?? k).join(', ')}`,
      pctCol: `${early.toFixed(0)}%`,
      mark: p.median <= 7 ? 'короткий стаж' : p.median >= 14 ? 'устойчиво' : 'средне',
      danger: p.median <= 7,
    });
    bar(r, p.median / 24, p.median <= 7 ? RED_SOFT : p.median >= 14 ? GREEN_SOFT : BLUE, `медиана ${p.median} мес.`);
  });

  /* ── 12. Ключевые выводы ── */
  blockRow('Ключевые выводы', 'Что показывают цифры и на что направить усилия.');
  const referral = GROUPED.find((g) => g.group === 'referral')!;
  const agency = GROUPED.find((g) => g.group === 'agency')!;
  const insights: [string, string, string][] = [
    [
      'Рекомендации — главный канал',
      `${pct(referral.y2026, TOTAL_2026).toFixed(0)}% найма`,
      'Самый дешёвый и качественный источник, даёт минимальную текучесть',
    ],
    [
      'Кадровые агентства — зона экономии',
      `${pct(agency.y2026, TOTAL_2026).toFixed(0)}% найма`,
      'Усиление реферальной программы позволит сократить расходы на подбор',
    ],
    [
      'Первый год — критическая зона',
      `${pct(TENURE[0].y2026, TENURE_2026).toFixed(0)}% уходов`,
      'Программа адаптации новичков даст максимальный эффект',
    ],
    [
      'Причина не выясняется',
      `${rPct(REASON_GROUPS.find((g) => g.key === 'nospec')!.total).toFixed(0)}% случаев`,
      'Нужны выходные интервью — без них не видно реальных мотивов',
    ],
    [
      'Текучесть снижается',
      `${turn2026.toFixed(1)}% против ${turn2025.toFixed(1)}%`,
      'Динамика положительная, но абсолютные потери остаются высокими',
    ],
    [
      'Больше половины уходов управляемы',
      `${rPct(MANAGEABLE_TOTAL).toFixed(0)}% причин`,
      'Условия труда, руководитель, зарплата и рост — зона прямого влияния компании',
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
    });
  });

  const src = ws.addRow([]);
  src.height = 22;
  fillRow(src, 1, TOTAL_COLS, WHITE);
  ws.mergeCells(src.number, 1, src.number, TOTAL_COLS);
  paint(src, 1, {
    value:
      'Источник: внутренняя отчётность отдела подбора персонала, отчёты «Принятые» и «Уволенные сотрудники» за 2025–2026 годы.',
    size: 8,
    color: 'FF808080',
  });

  return ws;
}

export async function exportHrAnalyticToExcel() {
  const ExcelJSmod = (await import('exceljs')).default;
  const wb = new ExcelJSmod.Workbook();
  wb.creator = 'Концерн КРОСТ · отдел кадров';
  wb.created = new Date();
  addHrAnalyticSheet(wb);

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Подбор и текучесть ${stamp}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
