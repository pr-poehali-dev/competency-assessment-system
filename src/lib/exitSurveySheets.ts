import type ExcelJS from 'exceljs';
import { EXIT_SURVEYS, EXIT_ROUTER, EXIT_COMMON, type ExitSurveyKind } from '@/data/exitSurveys';

const DARK = 'FF1A1A2E';
const GREY = 'FF64748B';
const LINE = 'FFE2E8F0';

const thin = { style: 'thin' as const, color: { argb: LINE } };
const border = { top: thin, left: thin, bottom: thin, right: thin };

const HEAD: Record<ExitSurveyKind['color'], string> = {
  amber: 'FFD97706',
  rose: 'FFDC2626',
  sky: 'FF0284C7',
};

const SOFT: Record<ExitSurveyKind['color'], string> = {
  amber: 'FFFEF3C7',
  rose: 'FFFEE2E2',
  sky: 'FFE0F2FE',
};

const TAB: Record<ExitSurveyKind['color'], string> = {
  amber: 'FFF59E0B',
  rose: 'FFEF4444',
  sky: 'FF38BDF8',
};

function addRouterSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Выходное интервью — выбор', {
    properties: { tabColor: { argb: 'FF1A1A2E' } },
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  ws.columns = [{ width: 34 }, { width: 62 }, { width: 56 }, { width: 14 }];

  const h = ws.addRow(['Выходное интервью: три анкеты под разные типы текучести']);
  ws.mergeCells(h.number, 1, h.number, 4);
  h.height = 32;
  h.getCell(1).font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
  h.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  h.getCell(1).alignment = { vertical: 'middle' };

  const t = ws.addRow([EXIT_ROUTER.title]);
  ws.mergeCells(t.number, 1, t.number, 4);
  t.height = 22;
  t.getCell(1).font = { bold: true, size: 12, color: { argb: DARK } };
  t.getCell(1).alignment = { vertical: 'middle' };

  const intro = ws.addRow([EXIT_ROUTER.intro]);
  ws.mergeCells(intro.number, 1, intro.number, 4);
  intro.height = 34;
  intro.getCell(1).font = { size: 10, color: { argb: GREY } };
  intro.getCell(1).alignment = { wrapText: true, vertical: 'top' };

  ws.addRow([]);

  const head = ws.addRow(['Тип текучести', 'Когда выбирать этот тип', 'Что хотим узнать', 'Анкета']);
  head.height = 24;
  head.eachCell((c) => {
    c.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    c.border = border;
  });

  EXIT_ROUTER.rows.forEach((r, idx) => {
    const row = ws.addRow([r.kind, r.when, r.goal, r.form]);
    row.height = 54;
    for (let i = 1; i <= 4; i += 1) {
      const c = row.getCell(i);
      c.border = border;
      c.font = { size: 10, color: { argb: DARK } };
      c.alignment = { vertical: 'top', wrapText: true };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SOFT[EXIT_SURVEYS[idx].color] } };
    }
    row.getCell(1).font = { size: 11, bold: true, color: { argb: DARK } };
    row.getCell(4).font = { size: 11, bold: true, color: { argb: HEAD[EXIT_SURVEYS[idx].color] } };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
  });

  ws.addRow([]);

  const warn = ws.addRow([EXIT_ROUTER.warning]);
  ws.mergeCells(warn.number, 1, warn.number, 4);
  warn.height = 46;
  warn.getCell(1).font = { size: 10, bold: true, color: { argb: 'FFB45309' } };
  warn.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
  warn.getCell(1).alignment = { wrapText: true, vertical: 'middle' };
  for (let i = 1; i <= 4; i += 1) warn.getCell(i).border = border;

  ws.addRow([]);

  const ct = ws.addRow([EXIT_COMMON.title]);
  ws.mergeCells(ct.number, 1, ct.number, 4);
  ct.height = 24;
  ct.getCell(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  ct.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  ct.getCell(1).alignment = { vertical: 'middle' };

  EXIT_COMMON.fields.forEach((f) => {
    const r = ws.addRow([f, '____________________________________________', '', '']);
    ws.mergeCells(r.number, 2, r.number, 4);
    r.getCell(1).font = { size: 10, bold: true, color: { argb: DARK } };
    r.getCell(2).font = { size: 10, color: { argb: GREY } };
    for (let i = 1; i <= 4; i += 1) r.getCell(i).border = border;
  });

  const note = ws.addRow([EXIT_COMMON.note]);
  ws.mergeCells(note.number, 1, note.number, 4);
  note.height = 30;
  note.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };
  note.getCell(1).alignment = { wrapText: true, vertical: 'top' };

  ws.addRow([]);

  const sum = ws.addRow(['Состав анкет']);
  ws.mergeCells(sum.number, 1, sum.number, 4);
  sum.getCell(1).font = { bold: true, size: 11, color: { argb: DARK } };

  EXIT_SURVEYS.forEach((s) => {
    const r = ws.addRow([`${s.code}. ${s.title}`, s.definition, `${s.questions.length} вопросов`, '']);
    ws.mergeCells(r.number, 3, r.number, 4);
    r.height = 42;
    for (let i = 1; i <= 4; i += 1) {
      const c = r.getCell(i);
      c.border = border;
      c.alignment = { vertical: 'top', wrapText: true };
      c.font = { size: 10, color: { argb: DARK } };
    }
    r.getCell(1).font = { size: 10, bold: true, color: { argb: HEAD[s.color] } };
    r.getCell(2).font = { size: 9, color: { argb: GREY } };
    r.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(3).font = { size: 10, bold: true, color: { argb: DARK } };
  });
}

function addSurveySheet(wb: ExcelJS.Workbook, s: ExitSurveyKind) {
  const ws = wb.addWorksheet(`${s.code} — ${s.short}`, {
    properties: { tabColor: { argb: TAB[s.color] } },
    views: [{ state: 'frozen', ySplit: 1 }],
    pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  ws.columns = [
    { key: 'mark', width: 8 },
    { key: 'text', width: 96 },
  ];

  const line = (text: string, opts: Partial<{ size: number; bold: boolean; color: string; fill: string; height: number; italic: boolean }> = {}) => {
    const r = ws.addRow([text]);
    ws.mergeCells(r.number, 1, r.number, 2);
    if (opts.height) r.height = opts.height;
    r.getCell(1).font = {
      size: opts.size ?? 10,
      bold: opts.bold,
      italic: opts.italic,
      color: { argb: opts.color ?? DARK },
    };
    if (opts.fill) r.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.fill } };
    r.getCell(1).alignment = { wrapText: true, vertical: opts.height ? 'middle' : 'top' };
    return r;
  };

  line(`${s.code}. ${s.title}`, { size: 15, bold: true, color: 'FFFFFFFF', fill: HEAD[s.color], height: 32 });
  line(s.definition, { size: 10, color: DARK, fill: SOFT[s.color], height: 40 });

  ws.addRow([]);

  const info = (label: string, text: string) => {
    const r = ws.addRow({ mark: label, text });
    r.getCell('mark').font = { size: 9, bold: true, color: { argb: GREY } };
    r.getCell('mark').alignment = { vertical: 'top', wrapText: true };
    r.getCell('text').font = { size: 10, color: { argb: DARK } };
    r.getCell('text').alignment = { vertical: 'top', wrapText: true };
    r.getCell('mark').border = border;
    r.getCell('text').border = border;
    r.height = 26;
  };
  info('Кого', s.who);
  info('Цель', s.goal);
  info('Время', s.duration);
  info('Кто ведёт', s.interviewer);

  ws.addRow([]);

  line('ФИО сотрудника: ___________________________    Подразделение: ___________________________');
  line('Должность: ___________________    Дата приёма: ___________    Дата увольнения: ___________');
  line('Стаж работы: ___________    Источник найма: ___________    Руководитель: ___________________');
  line('Интервью провёл: ___________________________________________________________________');

  ws.addRow([]);

  line(s.rule, { size: 10, bold: true, color: 'FFB45309', fill: 'FFFEF3C7', height: 46 });
  ws.addRow([]);

  s.questions.forEach((q) => {
    const qr = ws.addRow([`${q.n}. ${q.question}`]);
    ws.mergeCells(qr.number, 1, qr.number, 2);
    qr.height = 24;
    qr.getCell(1).font = { bold: true, size: 11, color: { argb: DARK } };
    qr.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    qr.getCell(1).alignment = { vertical: 'middle', wrapText: true };

    const hr = ws.addRow([`${q.type}. ${q.hint}`]);
    ws.mergeCells(hr.number, 1, hr.number, 2);
    hr.height = 24;
    hr.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };
    hr.getCell(1).alignment = { wrapText: true, vertical: 'top' };

    q.options.forEach((o) => {
      const orow = ws.addRow({ mark: '☐', text: o });
      orow.getCell('mark').alignment = { horizontal: 'center', vertical: 'top' };
      orow.getCell('mark').font = { size: 12 };
      orow.getCell('text').font = { size: 10 };
      orow.getCell('text').alignment = { wrapText: true, vertical: 'top' };
      orow.getCell('mark').border = border;
      orow.getCell('text').border = border;
    });

    ws.addRow([]);
  });

  line('Комментарий специалиста, проводившего интервью:', { bold: true });
  for (let i = 0; i < 3; i += 1) {
    const r = ws.addRow(['', '']);
    r.getCell(1).border = border;
    r.getCell(2).border = border;
    r.height = 18;
  }

  ws.addRow([]);
  line('Подпись сотрудника: ______________        Подпись специалиста отдела кадров: ______________');
  ws.addRow([]);
  line(`Как используются ответы: ${s.useData}`, { size: 9, italic: true, color: GREY, height: 32 });
}

export function addExitSurveySheets(wb: ExcelJS.Workbook) {
  addRouterSheet(wb);
  EXIT_SURVEYS.forEach((s) => addSurveySheet(wb, s));
}
