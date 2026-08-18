import type ExcelJS from 'exceljs';
import { OPP_TEAM, OPP_PARAMS } from '@/data/oppDept';

const DARK = 'FF1A1A2E';
const GREY = 'FF64748B';
const LINE = 'FFE2E8F0';
const ACCENT = 'FFEF4444';

const thin = { style: 'thin' as const, color: { argb: LINE } };
const border = { top: thin, left: thin, bottom: thin, right: thin };

const BASE_SALARY = OPP_PARAMS.salary;
const WORKPLACE = OPP_PARAMS.workplace;
const TAX_RATE = OPP_PARAMS.taxRate;
const HIRES_2025 = OPP_PARAMS.hires;

export function addOppDeptSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Стоимость ОПП', {
    properties: { tabColor: { argb: 'FF0EA5E9' } },
    views: [{ state: 'frozen', ySplit: 9 }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  ws.columns = [
    { key: 'n', width: 7 },
    { key: 'name', width: 40 },
    { key: 'role', width: 14 },
    { key: 'load', width: 13 },
    { key: 'salary', width: 15 },
    { key: 'month', width: 16 },
    { key: 'year', width: 18 },
    { key: 'yearTax', width: 20 },
    { key: 'place', width: 18 },
    { key: 'total', width: 22 },
  ];

  const title = ws.addRow(['Во сколько обходится отдел подбора персонала (ОПП)']);
  ws.mergeCells(title.number, 1, title.number, 10);
  title.height = 30;
  title.getCell(1).font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
  title.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  title.getCell(1).alignment = { vertical: 'middle' };

  const sub = ws.addRow([
    'Расчёт по фактическому составу отдела. Загрузка показывает долю ставки: 100% — полная занятость подбором, 200% — две ставки. Все параметры ниже можно менять — итоги пересчитаются.',
  ]);
  ws.mergeCells(sub.number, 1, sub.number, 10);
  sub.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };
  sub.getCell(1).alignment = { wrapText: true, vertical: 'top' };
  sub.height = 26;

  const param = (label: string, value: number, fmt: string, comment: string) => {
    const r = ws.addRow([label, '', '', value, '', comment]);
    ws.mergeCells(r.number, 1, r.number, 3);
    ws.mergeCells(r.number, 6, r.number, 10);
    r.getCell(1).font = { bold: true, size: 10, color: { argb: DARK } };
    r.getCell(4).font = { bold: true, size: 10 };
    r.getCell(4).numFmt = fmt;
    r.getCell(4).alignment = { horizontal: 'right' };
    r.getCell(6).font = { size: 9, italic: true, color: { argb: GREY } };
    for (let i = 1; i <= 4; i += 1) r.getCell(i).border = border;
    return `$D$${r.number}`;
  };

  const salaryRef = param('Средняя зарплата рекрутера, ₽/мес', BASE_SALARY, '#,##0 ₽', 'Базовый оклад на полную ставку');
  const taxRef = param('Налоги и взносы, %', TAX_RATE, '0"%"', 'Страховые взносы сверх фонда оплаты труда');
  const placeRef = param('Стоимость рабочего места в год, ₽', WORKPLACE, '#,##0 ₽', 'Техника, мебель, ПО, аренда места');
  const hiresRef = param('Количество нанятых за год, чел.', HIRES_2025, '#,##0', 'Факт найма за 2025 год');

  ws.addRow([]);

  const head = ws.addRow([
    '№',
    'ФИО',
    'Роль',
    'Загрузка, %',
    'Оклад, ₽',
    'Затраты в месяц, ₽',
    'Затраты в год, ₽',
    'Год с налогами, ₽',
    'Рабочее место, ₽',
    'Итого в год, ₽',
  ]);
  head.height = 30;
  head.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = border;
  });

  let first = 0;
  let last = 0;

  OPP_TEAM.forEach((p, i) => {
    const row = ws.addRow({
      n: i + 1,
      name: p.name,
      role: 'Рекрутер',
      load: p.load,
      salary: BASE_SALARY,
    });
    const n = row.number;
    if (i === 0) first = n;
    last = n;

    row.getCell('salary').value = { formula: `${salaryRef}` } as ExcelJS.CellValue;
    row.getCell('month').value = { formula: `E${n}*D${n}/100` } as ExcelJS.CellValue;
    row.getCell('year').value = { formula: `F${n}*12` } as ExcelJS.CellValue;
    row.getCell('yearTax').value = { formula: `G${n}*(1+${taxRef}/100)` } as ExcelJS.CellValue;
    row.getCell('place').value = { formula: `${placeRef}` } as ExcelJS.CellValue;
    row.getCell('total').value = { formula: `H${n}+I${n}` } as ExcelJS.CellValue;

    row.eachCell((cell) => {
      cell.font = { size: 10 };
      cell.border = border;
      cell.alignment = { vertical: 'middle' };
    });
    row.getCell('name').font = { size: 10, bold: true, color: { argb: DARK } };
    row.getCell('n').alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell('load').alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell('load').numFmt = '0"%"';
    ['salary', 'month', 'year', 'yearTax', 'place', 'total'].forEach((k) => {
      row.getCell(k).numFmt = '#,##0 ₽';
    });
    row.getCell('total').font = { size: 10, bold: true };
  });

  const totalRow = ws.addRow({ n: '', name: 'ИТОГО по отделу', role: '', load: '' });
  const tn = totalRow.number;
  ws.mergeCells(tn, 1, tn, 3);
  totalRow.getCell('load').value = { formula: `SUM(D${first}:D${last})/100` } as ExcelJS.CellValue;
  totalRow.getCell('load').numFmt = '0.0" ст."';
  totalRow.getCell('salary').value = '';
  ['month', 'year', 'yearTax', 'place', 'total'].forEach((k, idx) => {
    const col = ['F', 'G', 'H', 'I', 'J'][idx];
    totalRow.getCell(k).value = { formula: `SUM(${col}${first}:${col}${last})` } as ExcelJS.CellValue;
    totalRow.getCell(k).numFmt = '#,##0 ₽';
  });
  totalRow.height = 26;
  for (let i = 1; i <= 10; i += 1) {
    const c = totalRow.getCell(i);
    c.border = border;
    c.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    c.alignment = { vertical: 'middle' };
  }

  const monthTotal = `$F$${tn}`;
  const yearTotal = `$G$${tn}`;
  const taxTotal = `$H$${tn}`;
  const placeTotal = `$I$${tn}`;
  const grandTotal = `$J$${tn}`;
  const fteTotal = `$D$${tn}`;

  ws.addRow([]);

  const resTitle = ws.addRow(['Итоги: стоимость содержания ОПП']);
  ws.mergeCells(resTitle.number, 1, resTitle.number, 10);
  resTitle.height = 26;
  resTitle.getCell(1).font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
  resTitle.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  resTitle.getCell(1).alignment = { vertical: 'middle' };

  const resRow = (label: string, formula: string, comment: string, fmt = '#,##0 ₽', accent?: string) => {
    const r = ws.addRow([label, '', '', '', '', '', '', '', comment]);
    ws.mergeCells(r.number, 1, r.number, 7);
    ws.mergeCells(r.number, 9, r.number, 10);
    r.getCell(8).value = { formula } as ExcelJS.CellValue;
    r.getCell(8).numFmt = fmt;
    r.height = 22;
    for (let i = 1; i <= 10; i += 1) {
      const c = r.getCell(i);
      c.border = border;
      c.alignment = { vertical: 'middle', wrapText: true };
      c.font = { size: 10, bold: !!accent, color: { argb: accent ? 'FFFFFFFF' : DARK } };
      if (accent) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: accent } };
    }
    r.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' };
    r.getCell(9).font = { size: 9, color: { argb: accent ? 'FFFFFFFF' : GREY } };
    return `$H$${r.number}`;
  };

  resRow('Численность отдела, ставок', `${fteTotal}`, 'Суммарная загрузка сотрудников', '0.0" ст."');
  resRow('Фонд оплаты труда, ₽ в месяц', `${monthTotal}`, 'Без налогов и взносов');
  resRow('Фонд оплаты труда, ₽ в год', `${yearTotal}`, 'Без налогов и взносов');
  resRow('Фонд оплаты труда с налогами, ₽ в год', `${taxTotal}`, 'ФОТ плюс страховые взносы');
  resRow('Содержание рабочих мест, ₽ в год', `${placeTotal}`, 'Техника, мебель, ПО');
  const totalYearRef = resRow(
    'ИТОГО содержание ОПП, ₽ в год',
    `${grandTotal}`,
    'Полные затраты на отдел подбора за год',
    '#,##0 ₽',
    DARK,
  );
  const perHireRef = resRow(
    'СТОИМОСТЬ ОДНОГО НАЙМА, ₽',
    `IF(${hiresRef}=0,0,${totalYearRef}/${hiresRef})`,
    'Годовые затраты отдела ÷ количество нанятых',
    '#,##0 ₽',
    ACCENT,
  );
  resRow('Стоимость найма в месяц на одну ставку, ₽', `IF(${fteTotal}=0,0,${totalYearRef}/12/${fteTotal})`, 'Среднее содержание одной ставки рекрутера в месяц');
  resRow('Наймов на одного рекрутера в год, чел.', `IF(${fteTotal}=0,0,${hiresRef}/${fteTotal})`, 'Производительность отдела', '0.0');

  ws.addRow([]);

  const cmpTitle = ws.addRow(['Сравнение: свой отдел подбора или кадровое агентство']);
  ws.mergeCells(cmpTitle.number, 1, cmpTitle.number, 10);
  cmpTitle.height = 26;
  cmpTitle.getCell(1).font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
  cmpTitle.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  cmpTitle.getCell(1).alignment = { vertical: 'middle' };

  const inputRow = (label: string, value: number, comment: string, fmt = '#,##0 ₽') => {
    const r = ws.addRow([label, '', '', '', '', '', '', value, comment]);
    ws.mergeCells(r.number, 1, r.number, 7);
    ws.mergeCells(r.number, 9, r.number, 10);
    r.getCell(8).numFmt = fmt;
    r.height = 22;
    for (let i = 1; i <= 10; i += 1) {
      const c = r.getCell(i);
      c.border = border;
      c.alignment = { vertical: 'middle', wrapText: true };
      c.font = { size: 10, color: { argb: DARK } };
    }
    r.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' };
    r.getCell(9).font = { size: 9, color: { argb: GREY } };
    return `$H$${r.number}`;
  };

  const vacSalaryRef = inputRow('Средний оклад подбираемого сотрудника, ₽ в месяц', OPP_PARAMS.vacancySalary, 'От него считается гонорар агентства');
  const feeRef = inputRow('Гонорар агентства, % от годового дохода', OPP_PARAMS.agencyFee, 'Обычно 15–25%', '0"%"');

  const agencyOneRef = resRow(
    'Стоимость подбора одного сотрудника через агентство, ₽',
    `${vacSalaryRef}*12*${feeRef}/100`,
    'Гонорар агентства за одного закрытого кандидата',
  );
  const agencyYearRef = resRow(
    'Стоимость всего объёма найма через агентство, ₽ в год',
    `${agencyOneRef}*${hiresRef}`,
    'Если бы все наймы закрывало агентство',
  );
  resRow('ЭКОНОМИЯ отдела подбора, ₽ в год', `${agencyYearRef}-${totalYearRef}`, 'Агентство минус собственный отдел', '#,##0 ₽', DARK);
  resRow(
    'ЭКОНОМИЯ отдела подбора, %',
    `IF(${agencyYearRef}=0,0,(${agencyYearRef}-${totalYearRef})/${agencyYearRef}*100)`,
    'На столько процентов свой отдел дешевле',
    '0.0"%"',
    DARK,
  );
  resRow(
    'Свой отдел дешевле агентства, раз',
    `IF(${totalYearRef}=0,0,${agencyYearRef}/${totalYearRef})`,
    'Во сколько раз выгоднее держать свой отдел',
    '0.0" x"',
  );
  resRow(
    'Разница в стоимости одного найма, ₽',
    `${agencyOneRef}-${perHireRef}`,
    'Насколько дешевле обходится один наём своими силами',
  );

  ws.addRow([]);
  const foot = ws.addRow([
    'Источник данных: фактический список сотрудников отдела подбора и объём найма за год. Загрузка 200% означает две ставки, 30–50% — частичную занятость подбором.',
  ]);
  ws.mergeCells(foot.number, 1, foot.number, 10);
  foot.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };
}