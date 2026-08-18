import type ExcelJS from 'exceljs';
import { REVIEWS_META, REVIEW_PLUSES, REVIEW_MINUSES, TOP3_MINUSES } from '@/data/reviews';

const DARK = 'FF1A1A2E';
const GREY = 'FF64748B';
const LINE = 'FFE2E8F0';
const RED = 'FFDC2626';
const GREEN = 'FF047857';

const thin = { style: 'thin' as const, color: { argb: LINE } };
const border = { top: thin, left: thin, bottom: thin, right: thin };

export function addReviewsSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Отзывы о компании', {
    properties: { tabColor: { argb: 'FFDC2626' } },
  });

  ws.columns = [
    { width: 5 },
    { width: 46 },
    { width: 11 },
    { width: 11 },
    { width: 62 },
    { width: 62 },
    { width: 52 },
  ];

  const title = ws.addRow(['Анализ отзывов о компании: плюсы, минусы и ТОП-3 проблемы']);
  ws.mergeCells(title.number, 1, title.number, 7);
  title.height = 34;
  title.getCell(1).font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  title.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  title.getCell(1).alignment = { vertical: 'middle' };

  const sub = ws.addRow([
    `Разобрано ${REVIEWS_META.total} отзывов сотрудников и соискателей. В ${REVIEWS_META.withPlus} указаны плюсы, в ${REVIEWS_META.withMinus} — содержательные минусы, в ${REVIEWS_META.noMinus} отзывах минусов нет («нет», «не заметила»). Доля считается от ${REVIEWS_META.withMinus} отзывов с минусами.`,
  ]);
  ws.mergeCells(sub.number, 1, sub.number, 7);
  sub.height = 32;
  sub.getCell(1).font = { size: 10, color: { argb: GREY } };
  sub.getCell(1).alignment = { vertical: 'middle', wrapText: true };

  ws.addRow([]);

  const sectionTitle = (text: string, color: string) => {
    const r = ws.addRow([text]);
    ws.mergeCells(r.number, 1, r.number, 7);
    r.height = 28;
    r.getCell(1).font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
    r.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    r.getCell(1).alignment = { vertical: 'middle' };
    return r;
  };

  const tableHead = (extra: string) => {
    const r = ws.addRow(['№', 'Тема', 'Упомин.', 'Доля', 'Что именно пишут', 'Цитаты из отзывов', extra]);
    r.height = 26;
    for (let i = 1; i <= 7; i += 1) {
      const c = r.getCell(i);
      c.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
      c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      c.border = border;
    }
    return r;
  };

  sectionTitle('ТОП-3 минуса — на что реагировать в первую очередь', RED);
  const topHead = tableHead('Что предлагается сделать');
  topHead.eachCell((c) => {
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: RED } };
  });

  TOP3_MINUSES.forEach((t, idx) => {
    const r = ws.addRow([idx + 1, t.title, t.count, t.share / 100, t.detail, t.quotes.map((q) => `«${q}»`).join('\n'), t.action || '']);
    r.height = 92;
    for (let i = 1; i <= 7; i += 1) {
      const c = r.getCell(i);
      c.border = border;
      c.alignment = { vertical: 'top', wrapText: true };
      c.font = { size: 10, color: { argb: DARK } };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } };
    }
    r.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(1).font = { size: 18, bold: true, color: { argb: RED } };
    r.getCell(2).font = { size: 11, bold: true, color: { argb: DARK } };
    r.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(3).font = { size: 13, bold: true, color: { argb: RED } };
    r.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(4).numFmt = '0%';
    r.getCell(4).font = { size: 13, bold: true, color: { argb: RED } };
    r.getCell(6).font = { size: 9, italic: true, color: { argb: GREY } };
    r.getCell(7).font = { size: 10, color: { argb: GREEN } };
  });

  ws.addRow([]);

  sectionTitle('Все минусы по темам', RED);
  tableHead('Наглядно');
  REVIEW_MINUSES.forEach((t, idx) => {
    const r = ws.addRow([
      idx + 1,
      t.title,
      t.count,
      t.share / 100,
      t.detail,
      t.quotes.map((q) => `«${q}»`).join('\n'),
      '█'.repeat(Math.max(1, Math.round(t.count))),
    ]);
    r.height = 58;
    for (let i = 1; i <= 7; i += 1) {
      const c = r.getCell(i);
      c.border = border;
      c.alignment = { vertical: 'top', wrapText: true };
      c.font = { size: 10, color: { argb: DARK } };
      if (idx < 3) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } };
    }
    r.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(3).font = { size: 11, bold: true, color: { argb: RED } };
    r.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(4).numFmt = '0%';
    r.getCell(6).font = { size: 9, italic: true, color: { argb: GREY } };
    r.getCell(7).font = { size: 10, color: { argb: RED } };
    r.getCell(7).alignment = { vertical: 'middle' };
    if (idx < 3) r.getCell(2).font = { size: 10, bold: true, color: { argb: DARK } };
  });

  const mNote = ws.addRow(['Один знак █ = 1 упоминание темы в отзывах']);
  ws.mergeCells(mNote.number, 1, mNote.number, 7);
  mNote.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };

  ws.addRow([]);

  sectionTitle('Плюсы по темам — на чём строить бренд работодателя', GREEN);
  const pHead = tableHead('Наглядно');
  pHead.eachCell((c) => {
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN } };
  });
  REVIEW_PLUSES.forEach((t, idx) => {
    const r = ws.addRow([
      idx + 1,
      t.title,
      t.count,
      t.share / 100,
      t.detail,
      t.quotes.map((q) => `«${q}»`).join('\n'),
      '█'.repeat(Math.max(1, Math.round(t.count / 2))),
    ]);
    r.height = 52;
    for (let i = 1; i <= 7; i += 1) {
      const c = r.getCell(i);
      c.border = border;
      c.alignment = { vertical: 'top', wrapText: true };
      c.font = { size: 10, color: { argb: DARK } };
      if (idx < 3) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } };
    }
    r.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(3).font = { size: 11, bold: true, color: { argb: GREEN } };
    r.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    r.getCell(4).numFmt = '0%';
    r.getCell(6).font = { size: 9, italic: true, color: { argb: GREY } };
    r.getCell(7).font = { size: 10, color: { argb: GREEN } };
    r.getCell(7).alignment = { vertical: 'middle' };
  });

  const pNote = ws.addRow([
    'Один знак █ = 2 упоминания. Доля плюсов считается от 33 отзывов, где плюсы указаны содержательно.',
  ]);
  ws.mergeCells(pNote.number, 1, pNote.number, 7);
  pNote.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };

  ws.addRow([]);

  const concl = sectionTitle('Вывод', DARK);
  concl.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };

  [
    'Компанию хвалят за деньги, людей и проекты — зарплата и коллектив упомянуты в двух третях положительных отзывов. Это работающая основа бренда работодателя.',
    'Негатив концентрируется не в зарплате, а в условиях вокруг неё: отсутствие соцпакета, переработки и отношение руководителей. Эти три темы дают более половины всех претензий.',
    'Отдельная зона риска для подбора — медкомиссия за счёт кандидата и расхождение вакансии с реальными условиями: это отсеивает людей ещё до выхода и разгоняет текучку в первые месяцы.',
    'Устранение ТОП-3 минусов напрямую снижает текучку, а значит и объём повторного подбора — то есть прямые затраты отдела подбора персонала.',
  ].forEach((text) => {
    const r = ws.addRow([`•  ${text}`]);
    ws.mergeCells(r.number, 1, r.number, 7);
    r.height = 30;
    r.getCell(1).font = { size: 11, color: { argb: DARK } };
    r.getCell(1).alignment = { vertical: 'middle', wrapText: true };
  });

  ws.addRow([]);
  const foot = ws.addRow([REVIEWS_META.source]);
  ws.mergeCells(foot.number, 1, foot.number, 7);
  foot.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };
}
