import type ExcelJS from 'exceljs';

const DARK = 'FF1A1A2E';
const GREY = 'FF64748B';
const LINE = 'FFE2E8F0';

const thin = { style: 'thin' as const, color: { argb: LINE } };
const border = { top: thin, left: thin, bottom: thin, right: thin };

type CostRow = {
  kind: 'Прямые' | 'Косвенные';
  stage: 'Подбор' | 'Прием';
  name: string;
  salary?: number;
  hours?: number;
  amount?: number;
  comment: string;
};

export const OPP_SALARIES = [
  { role: 'Специалист по подбору персонала', salary: 200000 },
  { role: 'Руководитель подразделения (интервью)', salary: 700000 },
  { role: 'Служба безопасности', salary: 100000 },
  { role: 'Специалист отдела кадров', salary: 180000 },
  { role: 'Специалист по расчёту заработной платы', salary: 180000 },
];

const HOURS_NORM = 164.42;

const ROWS: CostRow[] = [
  {
    kind: 'Прямые',
    stage: 'Подбор',
    name: 'Доступ к базе резюме',
    amount: 3000,
    comment: 'Подписка на работные сайты в расчёте на одну вакансию',
  },
  {
    kind: 'Прямые',
    stage: 'Подбор',
    name: 'Реклама вакансии',
    amount: 5196,
    comment: 'Публикация и продвижение объявления по фактическим расходам',
  },
  {
    kind: 'Прямые',
    stage: 'Подбор',
    name: 'Трудозатраты специалиста по подбору персонала',
    salary: 200000,
    hours: 40,
    comment: 'Поиск, звонки, интервью, сопровождение кандидата до выхода',
  },
  {
    kind: 'Косвенные',
    stage: 'Подбор',
    name: 'Трудозатраты руководителя на интервью',
    salary: 700000,
    hours: 4,
    comment: 'Собеседования с кандидатами, отобранными отделом подбора',
  },
  {
    kind: 'Косвенные',
    stage: 'Подбор',
    name: 'Собеседование в службе безопасности',
    salary: 100000,
    hours: 1,
    comment: 'Личная беседа с финальным кандидатом',
  },
  {
    kind: 'Косвенные',
    stage: 'Подбор',
    name: 'Проверка службой безопасности',
    amount: 500,
    comment: 'Запросы по базам и проверка документов',
  },
  {
    kind: 'Косвенные',
    stage: 'Прием',
    name: 'Медицинский осмотр',
    amount: 0,
    comment: 'Заполнить по фактическому договору с клиникой',
  },
  {
    kind: 'Косвенные',
    stage: 'Прием',
    name: 'Спецодежда',
    amount: 0,
    comment: 'Заполнить по нормам выдачи для должности',
  },
  {
    kind: 'Косвенные',
    stage: 'Прием',
    name: 'Оборудование рабочего места',
    amount: 0,
    comment: 'Техника, мебель, программное обеспечение',
  },
  {
    kind: 'Косвенные',
    stage: 'Прием',
    name: 'Трудозатраты на оформление приема на работу',
    salary: 180000,
    hours: 0.5,
    comment: 'Договор, приказ, личное дело, воинский учёт',
  },
  {
    kind: 'Косвенные',
    stage: 'Прием',
    name: 'Постановка на расчёт заработной платы',
    salary: 180000,
    hours: 0.5,
    comment: 'Ввод сотрудника в зарплатную систему и банковский проект',
  },
];

export function addOppCostSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Стоимость подбора ОПП', {
    views: [{ state: 'frozen', ySplit: 8 }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  ws.columns = [
    { key: 'kind', width: 14 },
    { key: 'stage', width: 12 },
    { key: 'name', width: 52 },
    { key: 'salary', width: 18 },
    { key: 'unit', width: 14 },
    { key: 'hours', width: 10 },
    { key: 'sum', width: 16 },
    { key: 'comment', width: 54 },
  ];

  const title = ws.addRow(['Стоимость подбора одного сотрудника силами отдела подбора персонала']);
  ws.mergeCells(title.number, 1, title.number, 8);
  title.height = 30;
  title.getCell(1).font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
  title.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  title.getCell(1).alignment = { vertical: 'middle' };

  const sub = ws.addRow([
    'Собственный подбор. Услуги кадровых агентств, аутсорсинга и реферальные выплаты в расчёт не входят. Затраты на увольнение, обучение и адаптацию считаются отдельно.',
  ]);
  ws.mergeCells(sub.number, 1, sub.number, 8);
  sub.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };
  sub.getCell(1).alignment = { wrapText: true, vertical: 'top' };
  sub.height = 26;

  const normRow = ws.addRow(['Норма часов в месяц', HOURS_NORM]);
  normRow.getCell(1).font = { bold: true, size: 10, color: { argb: DARK } };
  normRow.getCell(2).font = { bold: true, size: 10 };
  normRow.getCell(2).numFmt = '0.00';
  normRow.getCell(1).border = border;
  normRow.getCell(2).border = border;
  const normRef = `$B$${normRow.number}`;

  const formulaNote = ws.addRow([
    '',
    '',
    'Стоимость часа = оклад ÷ норма часов. Меняйте оклады и количество часов — суммы пересчитаются автоматически.',
  ]);
  formulaNote.getCell(3).font = { size: 9, italic: true, color: { argb: GREY } };
  ws.addRow([]);

  const salHead = ws.addRow(['Оклады для расчёта', '', '', 'Оклад, ₽']);
  ws.mergeCells(salHead.number, 1, salHead.number, 3);
  salHead.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: DARK } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    cell.border = border;
  });

  OPP_SALARIES.forEach((s) => {
    const r = ws.addRow([s.role, '', '', s.salary]);
    ws.mergeCells(r.number, 1, r.number, 3);
    r.getCell(1).font = { size: 10 };
    r.getCell(4).numFmt = '#,##0 ₽';
    r.getCell(4).font = { size: 10, bold: true };
    for (let i = 1; i <= 4; i += 1) r.getCell(i).border = border;
  });

  ws.addRow([]);

  const head = ws.addRow([
    'Вид затрат',
    'Этап',
    'Перечень затрат',
    'Оклад для расчёта',
    'Единица измерения',
    'Часов',
    'Сумма, ₽',
    'Комментарий',
  ]);
  head.height = 28;
  head.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = border;
  });

  const sumCells: string[] = [];

  ROWS.forEach((r) => {
    const isHours = r.hours !== undefined;
    const row = ws.addRow({
      kind: r.kind,
      stage: r.stage,
      name: r.name,
      salary: isHours ? r.salary : '',
      unit: isHours ? 'часы' : '₽',
      hours: isHours ? r.hours : '',
      sum: isHours ? '' : (r.amount ?? 0),
      comment: r.comment,
    });

    if (isHours) {
      row.getCell('sum').value = { formula: `D${row.number}/${normRef}*F${row.number}` } as ExcelJS.CellValue;
      row.getCell('salary').numFmt = '#,##0 ₽';
    }

    row.eachCell((cell) => {
      cell.font = { size: 10 };
      cell.alignment = { vertical: 'top', wrapText: true };
      cell.border = border;
    });
    row.getCell('name').font = { size: 10, bold: true, color: { argb: DARK } };
    row.getCell('sum').numFmt = '#,##0 ₽';
    row.getCell('sum').font = { size: 10, bold: true };
    row.getCell('hours').alignment = { vertical: 'top', horizontal: 'center' };
    row.getCell('comment').font = { size: 9, color: { argb: GREY } };

    sumCells.push(`G${row.number}`);
  });

  const firstSum = sumCells[0];
  const lastSum = sumCells[sumCells.length - 1];
  const firstRowNum = Number(firstSum.slice(1));
  const lastRowNum = Number(lastSum.slice(1));

  ws.addRow([]);

  const totalRefs: Record<string, string> = {};

  const addTotal = (label: string, formula: string, strong = false) => {
    const r = ws.addRow([label, '', '', '', '', '', '']);
    totalRefs[label] = `G${r.number}`;
    ws.mergeCells(r.number, 1, r.number, 6);
    r.getCell(7).value = { formula } as ExcelJS.CellValue;
    r.getCell(7).numFmt = '#,##0 ₽';
    r.height = strong ? 26 : 20;
    for (let i = 1; i <= 7; i += 1) {
      const c = r.getCell(i);
      c.border = border;
      c.font = { bold: true, size: strong ? 12 : 10, color: { argb: strong ? 'FFFFFFFF' : DARK } };
      c.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: strong ? DARK : 'FFF1F5F9' },
      };
      c.alignment = { vertical: 'middle' };
    }
    r.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' };
  };

  const rangeStage = `B${firstRowNum}:B${lastRowNum}`;
  const rangeKind = `A${firstRowNum}:A${lastRowNum}`;
  const rangeSum = `G${firstRowNum}:G${lastRowNum}`;

  addTotal('ПОДБОР', `SUMIF(${rangeStage},"Подбор",${rangeSum})`);
  addTotal('ПРИЕМ', `SUMIF(${rangeStage},"Прием",${rangeSum})`);
  addTotal('ПРЯМЫЕ ЗАТРАТЫ', `SUMIF(${rangeKind},"Прямые",${rangeSum})`);
  addTotal('КОСВЕННЫЕ ЗАТРАТЫ', `SUMIF(${rangeKind},"Косвенные",${rangeSum})`);
  addTotal('ИТОГО стоимость подбора одного сотрудника', `SUM(${rangeSum})`, true);

  const ownRef = totalRefs['ИТОГО стоимость подбора одного сотрудника'];

  ws.addRow([]);

  const cmpTitle = ws.addRow(['Сравнение: свой подбор или кадровое агентство']);
  ws.mergeCells(cmpTitle.number, 1, cmpTitle.number, 8);
  cmpTitle.height = 26;
  cmpTitle.getCell(1).font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
  cmpTitle.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  cmpTitle.getCell(1).alignment = { vertical: 'middle' };

  const cmpHead = ws.addRow(['Показатель', '', '', '', '', '', 'Значение', 'Комментарий']);
  ws.mergeCells(cmpHead.number, 1, cmpHead.number, 6);
  cmpHead.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: DARK } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    cell.border = border;
    cell.alignment = { vertical: 'middle' };
  });

  const cmpRow = (
    label: string,
    value: number | { formula: string },
    comment: string,
    fmt = '#,##0 ₽',
    accent?: string,
  ) => {
    const r = ws.addRow([label, '', '', '', '', '', '', comment]);
    ws.mergeCells(r.number, 1, r.number, 6);
    r.getCell(7).value = (typeof value === 'number' ? value : value) as ExcelJS.CellValue;
    r.getCell(7).numFmt = fmt;
    r.height = 20;
    for (let i = 1; i <= 8; i += 1) {
      const c = r.getCell(i);
      c.border = border;
      c.alignment = { vertical: 'middle', wrapText: true };
      c.font = { size: 10, bold: !!accent, color: { argb: accent ? 'FFFFFFFF' : DARK } };
      if (accent) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: accent } };
    }
    r.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' };
    r.getCell(8).font = { size: 9, color: { argb: accent ? 'FFFFFFFF' : GREY } };
    return `G${r.number}`;
  };

  const salaryRef = cmpRow(
    'Оклад подбираемого сотрудника, ₽ в месяц',
    280000,
    'Введите оклад вакансии — от него считается гонорар агентства',
  );
  const feeRef = cmpRow(
    'Гонорар агентства, % от годового дохода',
    20,
    'Обычно 15–25%. Измените процент под свой договор',
    '0"%"',
  );
  const agencyRef = cmpRow(
    'Стоимость подбора через кадровое агентство',
    { formula: `${salaryRef}*12*${feeRef}/100` },
    'Гонорар агентства за одного закрытого кандидата',
  );
  const ownCmpRef = cmpRow(
    'Стоимость подбора своими силами',
    { formula: `${ownRef}` },
    'Итог расчёта из таблицы выше',
  );
  const innerRef = cmpRow(
    'Внутренние затраты, которые остаются при работе с агентством',
    { formula: `SUMIF(${rangeKind},"Косвенные",${rangeSum})` },
    'Интервью руководителя, проверка СБ, оформление и приём выполняются в любом случае',
  );
  const agencyTotalRef = cmpRow(
    'Итого стоимость подбора через агентство',
    { formula: `${agencyRef}+${innerRef}` },
    'Гонорар агентства плюс внутренние затраты компании',
  );

  cmpRow(
    'ЭКОНОМИЯ на одном сотруднике (агентство минус свой подбор)',
    { formula: `${agencyTotalRef}-${ownCmpRef}` },
    'Положительное значение — свой подбор дешевле',
    '#,##0 ₽',
    DARK,
  );
  cmpRow(
    'Свой подбор дешевле агентства, раз',
    { formula: `IF(${ownCmpRef}=0,0,${agencyTotalRef}/${ownCmpRef})` },
    'Во сколько раз собственный подбор выгоднее',
    '0.0" x"',
  );
  cmpRow(
    'Экономия на 10 сотрудниках',
    { formula: `(${agencyTotalRef}-${ownCmpRef})*10` },
    'Умножьте на свой годовой план найма',
  );

  ws.addRow([]);
  const foot = ws.addRow([
    'Расчёт по методике калькулятора затрат на подбор. Стоимость часа сотрудника = оклад ÷ норма часов в месяц. Все оклады и часы можно менять прямо в таблице.',
  ]);
  ws.mergeCells(foot.number, 1, foot.number, 8);
  foot.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };
}