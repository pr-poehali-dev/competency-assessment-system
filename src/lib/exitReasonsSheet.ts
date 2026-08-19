import type ExcelJS from 'exceljs';
import { EXIT_REASON_SETS, REASON_RULES, REASON_TOTAL, type ExitReasonSet } from '@/data/exitReasons';

const DARK = 'FF1A1A2E';
const GREY = 'FF64748B';
const LINE = 'FFE2E8F0';

const thin = { style: 'thin' as const, color: { argb: LINE } };
const border = { top: thin, left: thin, bottom: thin, right: thin };

const HEAD: Record<ExitReasonSet['color'], string> = {
  amber: 'FFD97706',
  rose: 'FFDC2626',
  sky: 'FF0284C7',
};

const SOFT: Record<ExitReasonSet['color'], string> = {
  amber: 'FFFEF3C7',
  rose: 'FFFEE2E2',
  sky: 'FFE0F2FE',
};

const TAB: Record<ExitReasonSet['color'], string> = {
  amber: 'FFF59E0B',
  rose: 'FFEF4444',
  sky: 'FF38BDF8',
};

function addOverview(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Причины — справочник', {
    properties: { tabColor: { argb: DARK } },
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  ws.columns = [{ width: 14 }, { width: 44 }, { width: 11 }, { width: 16 }, { width: 62 }];

  const h = ws.addRow(['Справочник причин увольнения для кадровой программы']);
  ws.mergeCells(h.number, 1, h.number, 5);
  h.height = 32;
  h.getCell(1).font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
  h.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  h.getCell(1).alignment = { vertical: 'middle' };

  const intro = ws.addRow([
    `Причина увольнения ставится кадровиком в программе при оформлении каждого увольнения. Список закрытый: ${REASON_TOTAL} причин, разбитых по трём типам текучести. Сначала выбирается тип увольнения — программа показывает только причины этого типа.`,
  ]);
  ws.mergeCells(intro.number, 1, intro.number, 5);
  intro.height = 36;
  intro.getCell(1).font = { size: 10, color: { argb: GREY } };
  intro.getCell(1).alignment = { wrapText: true, vertical: 'top' };

  ws.addRow([]);

  const head = ws.addRow(['Анкета', 'Тип текучести', 'Причин', 'Коды', 'Группы причин']);
  head.height = 24;
  head.eachCell((c) => {
    c.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    c.border = border;
  });

  EXIT_REASON_SETS.forEach((s) => {
    const groups = [...new Set(s.reasons.map((r) => r.group))].join(', ');
    const row = ws.addRow([
      s.form,
      s.title,
      s.reasons.length,
      `${s.reasons[0].code} — ${s.reasons[s.reasons.length - 1].code}`,
      groups,
    ]);
    row.height = 34;
    for (let i = 1; i <= 5; i += 1) {
      const c = row.getCell(i);
      c.border = border;
      c.alignment = { wrapText: true, vertical: 'middle', horizontal: i === 1 || i === 3 || i === 4 ? 'center' : 'left' };
      c.font = { size: 10, bold: i === 1 || i === 3 };
    }
    row.getCell(1).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEAD[s.color] } };
    row.getCell(3).font = { bold: true, size: 12, color: { argb: HEAD[s.color] } };
  });

  ws.addRow([]);

  const rt = ws.addRow(['Правила для кадровика и для программы']);
  ws.mergeCells(rt.number, 1, rt.number, 5);
  rt.height = 22;
  rt.getCell(1).font = { bold: true, size: 12, color: { argb: DARK } };

  REASON_RULES.forEach((rule, i) => {
    const r = ws.addRow([`${i + 1}.`, rule]);
    ws.mergeCells(r.number, 2, r.number, 5);
    r.height = 28;
    r.getCell(1).font = { bold: true, size: 10, color: { argb: DARK } };
    r.getCell(1).alignment = { horizontal: 'center', vertical: 'top' };
    r.getCell(2).font = { size: 10 };
    r.getCell(2).alignment = { wrapText: true, vertical: 'top' };
  });

  ws.addRow([]);

  const ft = ws.addRow(['Что программа должна хранить по каждому увольнению']);
  ws.mergeCells(ft.number, 1, ft.number, 5);
  ft.height = 22;
  ft.getCell(1).font = { bold: true, size: 12, color: { argb: DARK } };

  [
    ['Код причины', 'A-01, B-09, V-04 — не меняется и не переиспользуется никогда'],
    ['Тип текучести', 'А, Б или В — определяет доступный список причин'],
    ['Группа причины', 'Деньги, Руководитель, Здоровье и т.д. — для отчёта по блокам'],
    ['Комментарий', 'Обязателен для причин с пометкой «нужен комментарий»'],
    ['Кто и когда', 'ФИО кадровика и дата постановки причины'],
    ['История правок', 'Изменить причину может только начальник отдела кадров'],
  ].forEach(([k, v]) => {
    const r = ws.addRow(['', k, '', '', v]);
    ws.mergeCells(r.number, 2, r.number, 4);
    r.height = 20;
    r.getCell(2).font = { bold: true, size: 10 };
    r.getCell(2).border = border;
    r.getCell(5).font = { size: 10, color: { argb: GREY } };
    r.getCell(5).alignment = { wrapText: true, vertical: 'middle' };
    r.getCell(5).border = border;
  });

  ws.addRow([]);
  const w = ws.addRow([
    '⚠ Коды причин нельзя переименовывать: по ним сравнивается статистика год к году. Новую причину добавляют новым кодом, устаревшую скрывают от выбора, но оставляют в базе.',
  ]);
  ws.mergeCells(w.number, 1, w.number, 5);
  w.height = 32;
  w.getCell(1).font = { size: 10, bold: true, color: { argb: 'FF92400E' } };
  w.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
  w.getCell(1).alignment = { wrapText: true, vertical: 'middle' };
}

function addSetSheet(wb: ExcelJS.Workbook, s: ExitReasonSet) {
  const ws = wb.addWorksheet(`Причины ${s.form.replace('Анкета ', '')}`, {
    properties: { tabColor: { argb: TAB[s.color] } },
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  ws.columns = [
    { key: 'code', width: 10 },
    { key: 'group', width: 20 },
    { key: 'name', width: 46 },
    { key: 'when', width: 44 },
    { key: 'comment', width: 14 },
    { key: 'action', width: 50 },
  ];

  const h = ws.addRow([`${s.form}. ${s.title}`]);
  ws.mergeCells(h.number, 1, h.number, 6);
  h.height = 30;
  h.getCell(1).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  h.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEAD[s.color] } };
  h.getCell(1).alignment = { vertical: 'middle' };

  const intro = ws.addRow([`${s.intro} Всего причин: ${s.reasons.length}.`]);
  ws.mergeCells(intro.number, 1, intro.number, 6);
  intro.height = 32;
  intro.getCell(1).font = { size: 10, color: { argb: GREY } };
  intro.getCell(1).alignment = { wrapText: true, vertical: 'top' };

  ws.addRow([]);

  const head = ws.addRow([
    'Код',
    'Группа',
    'Причина увольнения',
    'Когда ставить эту причину',
    'Комментарий',
    'Что делает компания по этой причине',
  ]);
  head.height = 26;
  head.eachCell((c) => {
    c.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    c.border = border;
  });
  const headRow = head.number;

  s.reasons.forEach((r, i) => {
    const row = ws.addRow([r.code, r.group, r.name, r.when, r.comment ? 'обязателен' : '—', r.action]);
    row.height = 32;
    for (let c = 1; c <= 6; c += 1) {
      const cell = row.getCell(c);
      cell.border = border;
      cell.alignment = { wrapText: true, vertical: 'middle', horizontal: c === 1 || c === 5 ? 'center' : 'left' };
      cell.font = { size: 10 };
      if (i % 2) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SOFT[s.color] } };
    }
    row.getCell(1).font = { bold: true, size: 10, color: { argb: HEAD[s.color] } };
    row.getCell(3).font = { bold: true, size: 10 };
    if (r.comment) row.getCell(5).font = { bold: true, size: 9, color: { argb: 'FFB91C1C' } };
    else row.getCell(5).font = { size: 10, color: { argb: GREY } };
  });

  ws.autoFilter = { from: { row: headRow, column: 1 }, to: { row: headRow + s.reasons.length, column: 6 } };
  ws.views = [{ state: 'frozen', ySplit: headRow }];
}

function addImportSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Причины — выгрузка в 1С', {
    properties: { tabColor: { argb: 'FF64748B' } },
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  ws.columns = [
    { key: 'code', width: 10 },
    { key: 'type', width: 10 },
    { key: 'form', width: 12 },
    { key: 'kind', width: 40 },
    { key: 'group', width: 20 },
    { key: 'name', width: 46 },
    { key: 'comment', width: 14 },
    { key: 'active', width: 10 },
    { key: 'sort', width: 10 },
  ];

  const head = ws.addRow([
    'code',
    'type',
    'form',
    'turnover_type',
    'group',
    'reason_name',
    'comment_required',
    'is_active',
    'sort',
  ]);
  head.height = 24;
  head.eachCell((c) => {
    c.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    c.border = border;
  });

  let sort = 0;
  EXIT_REASON_SETS.forEach((s) => {
    const letter = s.form.replace('Анкета ', '');
    s.reasons.forEach((r) => {
      sort += 10;
      const row = ws.addRow([
        r.code,
        letter,
        s.form,
        s.title,
        r.group,
        r.name,
        r.comment ? 1 : 0,
        1,
        sort,
      ]);
      row.height = 18;
      for (let c = 1; c <= 9; c += 1) {
        const cell = row.getCell(c);
        cell.border = border;
        cell.font = { size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: c >= 7 || c <= 3 ? 'center' : 'left' };
      }
      row.getCell(1).font = { bold: true, size: 10 };
      row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SOFT[s.color] } };
      row.getCell(2).font = { bold: true, size: 10, color: { argb: HEAD[s.color] } };
    });
  });

  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1 + REASON_TOTAL, column: 9 } };
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  ws.addRow([]);
  const n = ws.addRow([
    'Технический лист для загрузки в кадровую программу. Заголовки на латинице — колонки соответствуют полям справочника. comment_required: 1 — комментарий обязателен. is_active: 1 — причина доступна для выбора, 0 — скрыта, но сохранена в базе для старой статистики.',
  ]);
  ws.mergeCells(n.number, 1, n.number, 9);
  n.height = 34;
  n.getCell(1).font = { size: 10, italic: true, color: { argb: GREY } };
  n.getCell(1).alignment = { wrapText: true, vertical: 'top' };
}

export function addExitReasonSheets(wb: ExcelJS.Workbook) {
  addOverview(wb);
  EXIT_REASON_SETS.forEach((s) => addSetSheet(wb, s));
  addImportSheet(wb);
}

export async function exportExitReasonsToExcel() {
  const ExcelJSmod = (await import('exceljs')).default;
  const wb = new ExcelJSmod.Workbook();
  wb.creator = 'Концерн КРОСТ · отдел кадров';
  wb.created = new Date();
  addExitReasonSheets(wb);

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Справочник причин увольнения ${stamp}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
