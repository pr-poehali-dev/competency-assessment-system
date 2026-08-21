import type ExcelJS from 'exceljs';
import {
  AGENCIES,
  MONTHLY,
  AGE_BANDS,
  DEPTS,
  POSITIONS,
  FIRED_TENURE,
  FIRED_POSITIONS,
  FIRED_AGE,
  FIRED_DEPTS,
  AG_TOTAL_2025,
  AG_TOTAL_2026,
  AG_FIRED_2025,
  AG_FIRED_2026,
  AG_TURNOVER_2025,
  AG_TURNOVER_2026,
  EFIR_SHARE_2025,
  EFIR_SHARE_2026,
  EFIR_TURNOVER,
  EFIR_TURNOVER_2026,
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
  LOST_MONTHS_2026,
  MANAGER_HOURS_2026,
  agPct,
} from '@/data/agencies';
import {
  TERMS,
  TERMS_DATE,
  TERMS_COUNT,
  GUARANTEE_MAX,
  GUARANTEE_MIN,
  SPLIT_PAYMENT_COUNT,
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
import {
  PAYMENTS,
  PAID_2025,
  PAID_2026,
  PAID_TOTAL,
  EFIR_PAY_SHARE,
  EFIR_COST_2025,
  EFIR_COST_2026,
  EFIR_LOSS_TOTAL,
  COST_PER_HIRE,
  COST_MAX,
  COST_MIN,
} from '@/data/payments';
import {
  VACANCIES,
  VACANCY_REPORT_DATE,
  VAC_POSITIONS,
  VAC_PEOPLE,
  VAC_AGE_BANDS,
  VAC_DEPTS,
  VAC_OLD_PEOPLE,
  VAC_SALARY_AVG,
  VAC_MONTHLY_BUDGET,
  vacancyMonths,
} from '@/data/vacancies';

const DARK = 'FF1A1A2E';
const GREY = 'FF64748B';
const LINE = 'FFE2E8F0';
const AMBER = 'FFD97706';
const RED = 'FFDC2626';
const GREEN = 'FF16A34A';
const SOFT = 'FFF8FAFC';

const thin = { style: 'thin' as const, color: { argb: LINE } };
const border = { top: thin, left: thin, bottom: thin, right: thin };

const COLS = 8;

type Row = ExcelJS.Row;

const num = (v: number, d = 0) => Number(v.toFixed(d));

export function addAgencyDashboardSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Кадровые агентства', {
    properties: { tabColor: { argb: 'FFF59E0B' } },
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  ws.columns = [
    { width: 6 },
    { width: 46 },
    { width: 17 },
    { width: 17 },
    { width: 17 },
    { width: 17 },
    { width: 17 },
    { width: 44 },
  ];

  let section = 0;

  const full = (row: Row) => {
    ws.mergeCells(row.number, 1, row.number, COLS);
    return row.getCell(1);
  };

  const title = ws.addRow(['Подбор через кадровые агентства — единая таблица дашборда']);
  full(title);
  title.height = 34;
  title.getCell(1).font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  title.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  title.getCell(1).alignment = { vertical: 'middle' };

  const sub = ws.addRow([
    `Концерн КРОСТ · отдел кадров. Данные за 2025 и 2026 годы. Условия договоров на ${TERMS_DATE}, вакансии на ${VACANCY_REPORT_DATE.split('-').reverse().join('.')}. Все блоки дашборда собраны в один лист сверху вниз.`,
  ]);
  full(sub);
  sub.height = 32;
  sub.getCell(1).font = { size: 10, color: { argb: GREY } };
  sub.getCell(1).alignment = { wrapText: true, vertical: 'top' };

  ws.addRow([]);

  function head(text: string, note?: string) {
    section += 1;
    const r = ws.addRow([`${section}.`, text]);
    ws.mergeCells(r.number, 2, r.number, COLS);
    r.height = 26;
    r.getCell(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    r.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(2).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    r.getCell(2).alignment = { vertical: 'middle' };
    if (note) {
      const n = ws.addRow(['', note]);
      ws.mergeCells(n.number, 2, n.number, COLS);
      n.height = 26;
      n.getCell(2).font = { size: 10, color: { argb: GREY } };
      n.getCell(2).alignment = { wrapText: true, vertical: 'top' };
    }
  }

  function tableHead(cells: (string | null)[]) {
    const r = ws.addRow(['', ...cells.map((c) => c ?? '')]);
    r.height = 30;
    for (let i = 2; i <= COLS; i += 1) {
      const c = r.getCell(i);
      c.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
      c.alignment = { vertical: 'middle', horizontal: i === 2 ? 'left' : 'center', wrapText: true };
      c.border = border;
    }
    return r;
  }

  function dataRow(cells: (string | number | null)[], opts: { zebra?: boolean; bold?: boolean; height?: number } = {}) {
    const r = ws.addRow(['', ...cells.map((c) => (c === null ? '' : c))]);
    r.height = opts.height ?? 20;
    for (let i = 2; i <= COLS; i += 1) {
      const c = r.getCell(i);
      c.border = border;
      c.font = { size: 10, bold: opts.bold };
      c.alignment = { vertical: 'middle', horizontal: i === 2 || i === COLS ? 'left' : 'center', wrapText: true };
      if (opts.zebra) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SOFT } };
    }
    return r;
  }

  function totalRow(cells: (string | number | null)[]) {
    const r = dataRow(cells, { bold: true, height: 22 });
    for (let i = 2; i <= COLS; i += 1) {
      r.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    }
    return r;
  }

  function note(text: string, color = AMBER, bg = 'FFFEF3C7') {
    const r = ws.addRow(['', text]);
    ws.mergeCells(r.number, 2, r.number, COLS);
    r.height = 30;
    r.getCell(2).font = { size: 10, bold: true, color: { argb: color } };
    r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
    r.getCell(2).alignment = { wrapText: true, vertical: 'middle' };
    return r;
  }

  function gap() {
    ws.addRow([]);
  }

  head(
    'Главное за два года',
    'Ключевые цифры по всему объёму подбора через агентства. Каждая строка ниже раскрывается в отдельном разделе.',
  );
  tableHead(['Показатель', '2025', '2026', 'Итого / динамика', null, null, 'Что это значит']);
  ws.mergeCells(ws.lastRow!.number, 6, ws.lastRow!.number, 7);
  [
    [
      'Нанято через агентства, человек',
      AG_TOTAL_2025,
      AG_TOTAL_2026,
      AG_TOTAL_2025 + AG_TOTAL_2026,
      'Объём внешнего подбора за два года',
    ],
    [
      'Уволилось из них в том же году',
      AG_FIRED_2025,
      AG_FIRED_2026,
      AG_FIRED_2025 + AG_FIRED_2026,
      'Люди, за которых заплатили, но которые не остались',
    ],
    [
      'Текучесть среди нанятых агентствами, %',
      num(AG_TURNOVER_2025, 1),
      num(AG_TURNOVER_2026, 1),
      `${(AG_TURNOVER_2026 - AG_TURNOVER_2025).toFixed(1)} п.п.`,
      'Каждый третий нанятый в 2025 году ушёл в тот же год',
    ],
    [
      'Ушли в первые 6 месяцев, человек',
      FAST_FIRED_2025,
      FAST_FIRED_2026,
      FAST_FIRED_2025 + FAST_FIRED_2026,
      'Основная масса уходов приходится на первые месяцы',
    ],
    [
      'Средний срок работы до увольнения, мес.',
      AVG_TENURE_2025,
      AVG_TENURE_2026,
      `${(AVG_TENURE_2026 - AVG_TENURE_2025).toFixed(1)} мес.`,
      'Человек не доходит даже до конца испытательного срока',
    ],
    [
      'Доля КА ЭФИР в найме, %',
      num(EFIR_SHARE_2025, 1),
      num(EFIR_SHARE_2026, 1),
      `+${(EFIR_SHARE_2026 - EFIR_SHARE_2025).toFixed(1)} п.п.`,
      'Зависимость от одного подрядчика выросла',
    ],
    [
      'Оплачено агентствам, ₽',
      PAID_2025,
      PAID_2026,
      PAID_TOTAL,
      'Прямые расходы на внешний подбор',
    ],
    [
      'Стоимость подбора уволившихся, ₽',
      COST_2025,
      COST_2026,
      COST_TOTAL,
      'Деньги, потраченные на людей, которые ушли',
    ],
    [
      'Потеряно рабочих дней на замены',
      LOST_DAYS_2025,
      LOST_DAYS_2026,
      LOST_DAYS_2025 + LOST_DAYS_2026,
      'Время на поиск и адаптацию вместо работы',
    ],
    [
      'Рекрутеров работало с концерном',
      RECRUITERS_2025,
      RECRUITERS_2026,
      `+${RECRUITERS_2026 - RECRUITERS_2025}`,
      'Людей у подрядчика стало больше, качество не выросло',
    ],
  ].forEach((r, i) => {
    const row = dataRow([r[0] as string, r[1] as number, r[2] as number, r[3] as string | number, null, null, r[4] as string], {
      zebra: i % 2 === 1,
      height: 22,
    });
    ws.mergeCells(row.number, 5, row.number, 7);
    row.getCell(2).font = { size: 10, bold: true };
    [3, 4, 5].forEach((c) => {
      row.getCell(c).font = { size: 11, bold: true, color: { argb: DARK } };
      if (typeof r[c - 2] === 'number' && (r[c - 2] as number) > 100000) row.getCell(c).numFmt = '# ##0 ₽';
    });
  });
  note(
    'Главный вывод: проблема не в объёме подбора, а в том, что нанятые люди не остаются. Платим дважды — агентству и своим временем на замену.',
  );
  gap();

  head('Объём и структура найма по агентствам', 'Сколько человек привело каждое агентство и сколько из них ушло.');
  tableHead(['Агентство', 'Нанято 2025', 'Нанято 2026', 'Уволено 2025', 'Уволено 2026', 'Текучесть, %', 'Комментарий']);
  AGENCIES.forEach((a, i) => {
    const hired = a.hired2025 + a.hired2026;
    const fired = a.fired2025 + a.fired2026;
    const t = agPct(fired, hired);
    const row = dataRow(
      [
        a.name,
        a.hired2025,
        a.hired2026,
        a.fired2025,
        a.fired2026,
        hired ? num(t, 1) : '—',
        a.short === 'ЭФИР'
          ? 'Основной подрядчик — на нём держится почти весь объём'
          : hired === 0
            ? 'Найма нет, но есть увольнения прошлых лет'
            : fired >= hired
              ? 'Ушло столько же или больше, чем нанято'
              : 'Небольшой объём',
      ],
      { zebra: i % 2 === 1, height: 22 },
    );
    row.getCell(2).font = { size: 10, bold: true };
    if (hired && t >= 30) row.getCell(7).font = { size: 10, bold: true, color: { argb: RED } };
  });
  totalRow([
    'Итого по всем агентствам',
    AG_TOTAL_2025,
    AG_TOTAL_2026,
    AG_FIRED_2025,
    AG_FIRED_2026,
    num(agPct(AG_FIRED_2025 + AG_FIRED_2026, AG_TOTAL_2025 + AG_TOTAL_2026), 1),
    `Доля ЭФИР: ${EFIR_SHARE_2025.toFixed(0)}% в 2025 и ${EFIR_SHARE_2026.toFixed(0)}% в 2026`,
  ]);
  note(
    `Текучесть у КА ЭФИР: ${EFIR_TURNOVER.toFixed(1)}% в 2025 и ${EFIR_TURNOVER_2026.toFixed(1)}% в 2026. Концерн зависит от одного подрядчика, а качество его подбора задаёт общую цифру.`,
  );
  gap();

  head('Динамика найма по месяцам', 'Помесячный объём найма через агентства. 2026 год — данные по август включительно.');
  tableHead(['Месяц', '2025', '2026', 'Разница', null, null, 'Комментарий']);
  ws.mergeCells(ws.lastRow!.number, 5, ws.lastRow!.number, 7);
  MONTHLY.forEach((m, i) => {
    const diff = m.y2026 === null ? null : m.y2026 - m.y2025;
    const row = dataRow(
      [
        m.month,
        m.y2025,
        m.y2026 === null ? '—' : m.y2026,
        diff === null ? '—' : diff > 0 ? `+${diff}` : String(diff),
        null,
        null,
        m.y2026 === null ? 'Данных за 2026 год ещё нет' : '',
      ],
      { zebra: i % 2 === 1 },
    );
    ws.mergeCells(row.number, 5, row.number, 7);
    if (diff !== null) row.getCell(5).font = { size: 10, bold: true, color: { argb: diff >= 0 ? GREEN : RED } };
  });
  totalRow([
    'Итого за год',
    AG_TOTAL_2025,
    AG_TOTAL_2026,
    `${AG_TOTAL_2026 - AG_TOTAL_2025}`,
    null,
    null,
    '2026 год — неполный, только 8 месяцев',
  ]);
  ws.mergeCells(ws.lastRow!.number, 5, ws.lastRow!.number, 7);
  gap();

  head('Качество найма: срок работы до увольнения', 'Сколько человек и как быстро ушли после выхода на работу.');
  tableHead(['Срок работы до ухода', 'Ушло 2025', 'Ушло 2026', 'Всего', 'Доля от всех уходов, %', null, 'Что это значит']);
  ws.mergeCells(ws.lastRow!.number, 6, ws.lastRow!.number, 7);
  const firedAll = AG_FIRED_2025 + AG_FIRED_2026;
  FIRED_TENURE.forEach((t, i) => {
    const total = t.y2025 + t.y2026;
    const row = dataRow(
      [
        t.band,
        t.y2025,
        t.y2026,
        total,
        num(agPct(total, firedAll), 1),
        null,
        i === 0
          ? 'Не дошли до конца испытательного срока'
          : i === 1
            ? 'Ушли сразу после испытательного срока'
            : 'Гарантия большинства договоров уже не действует',
      ],
      { zebra: i % 2 === 1, height: 22 },
    );
    ws.mergeCells(row.number, 6, row.number, 7);
    row.getCell(2).font = { size: 10, bold: true };
  });
  totalRow(['Итого уволилось', AG_FIRED_2025, AG_FIRED_2026, firedAll, 100, null, `Средний срок: ${AVG_TENURE_2025} мес. в 2025, ${AVG_TENURE_2026} мес. в 2026`]);
  ws.mergeCells(ws.lastRow!.number, 6, ws.lastRow!.number, 7);
  note(
    `Из ${firedAll} уходов ${FAST_FIRED_2025 + FAST_FIRED_2026} пришлись на первые полгода. Это не текучесть коллектива, а ошибка подбора: людей берут не тех.`,
    RED,
    'FFFEE2E2',
  );
  gap();

  head('Должности с наибольшими потерями', 'По каким позициям агентства чаще всего приводят людей, которые не остаются.');
  tableHead(['Должность', 'Нанято 2025', 'Нанято 2026', 'Ушло 2025', 'Ушло 2026', 'Потери, %', 'Комментарий']);
  FIRED_POSITIONS.forEach((p, i) => {
    const hiredRow = POSITIONS.find((x) => x.pos === p.pos);
    const hired = (hiredRow?.y2025 ?? 0) + (hiredRow?.y2026 ?? 0);
    const fired = p.y2025 + p.y2026;
    const pct = hired ? agPct(fired, hired) : null;
    const row = dataRow(
      [
        p.pos,
        hiredRow?.y2025 ?? '—',
        hiredRow?.y2026 ?? '—',
        p.y2025,
        p.y2026,
        pct === null ? '—' : num(pct, 0),
        pct !== null && pct >= 50 ? 'Каждый второй нанятый уходит — пересмотреть профиль' : 'Точечные потери',
      ],
      { zebra: i % 2 === 1, height: 22 },
    );
    row.getCell(2).font = { size: 10, bold: true };
    if (pct !== null && pct >= 50) row.getCell(7).font = { size: 10, bold: true, color: { argb: RED } };
  });
  gap();

  head('Куда шли люди: подразделения', 'Распределение найма и увольнений по подразделениям концерна.');
  tableHead(['Подразделение', 'Нанято 2025', 'Нанято 2026', 'Ушло 2025', 'Ушло 2026', 'Динамика найма', 'Комментарий']);
  DEPTS.forEach((d, i) => {
    const f = FIRED_DEPTS.find((x) => x.dept === d.dept);
    const diff = d.y2026 - d.y2025;
    const row = dataRow(
      [
        d.dept,
        d.y2025,
        d.y2026,
        f?.y2025 ?? 0,
        f?.y2026 ?? 0,
        diff > 0 ? `+${diff}` : String(diff),
        f && f.y2025 + f.y2026 >= 3 ? 'Заметные потери — разобрать отдельно' : '',
      ],
      { zebra: i % 2 === 1, height: 22 },
    );
    row.getCell(2).font = { size: 10, bold: true };
    row.getCell(7).font = { size: 10, bold: true, color: { argb: diff >= 0 ? GREEN : RED } };
  });
  gap();

  head('Возраст кандидатов от агентств', 'Кого приводят агентства и кто из них не остаётся.');
  tableHead(['Возрастная группа', 'Нанято 2025', 'Нанято 2026', 'Ушло 2025', 'Ушло 2026', 'Текучесть в группе, %', 'Комментарий']);
  AGE_BANDS.forEach((b, i) => {
    const f = FIRED_AGE.find((x) => x.band === b.band);
    const hired = b.y2025 + b.y2026;
    const fired = (f?.y2025 ?? 0) + (f?.y2026 ?? 0);
    const row = dataRow(
      [b.band, b.y2025, b.y2026, f?.y2025 ?? 0, f?.y2026 ?? 0, num(agPct(fired, hired), 1), ''],
      { zebra: i % 2 === 1 },
    );
    row.getCell(2).font = { size: 10, bold: true };
  });
  totalRow([
    'Средний возраст, лет',
    AGE_AVG_2025,
    AGE_AVG_2026,
    FIRED_AGE_AVG_2025,
    FIRED_AGE_AVG_2026,
    '—',
    'Уходят в среднем люди чуть старше, чем приходят',
  ]);
  gap();

  head(
    'Цена быстрых уходов: потерянное время',
    `Расчёт: на каждую замену уходит ${SEARCH_DAYS} дней на поиск и ${ONBOARDING_DAYS} дней на адаптацию, плюс ${MANAGER_HOURS} часов руководителя. В месяце ${WORK_DAYS_MONTH} рабочих дней.`,
  );
  tableHead(['Показатель', '2025', '2026', 'Итого', null, null, 'Как считаем']);
  ws.mergeCells(ws.lastRow!.number, 5, ws.lastRow!.number, 7);
  [
    ['Замен потребовалось, человек', AG_FIRED_2025, AG_FIRED_2026, firedAll, 'Каждый ушедший = одна замена'],
    [
      'Потеряно рабочих дней',
      LOST_DAYS_2025,
      LOST_DAYS_2026,
      LOST_DAYS_2025 + LOST_DAYS_2026,
      `Замены × ${SEARCH_DAYS + ONBOARDING_DAYS} дней`,
    ],
    [
      'В человеко-месяцах',
      num(LOST_DAYS_2025 / WORK_DAYS_MONTH, 1),
      num(LOST_MONTHS_2026, 1),
      num((LOST_DAYS_2025 + LOST_DAYS_2026) / WORK_DAYS_MONTH, 1),
      `Дни ÷ ${WORK_DAYS_MONTH} рабочих дней`,
    ],
    [
      'Часов руководителей на собеседования',
      AG_FIRED_2025 * MANAGER_HOURS,
      MANAGER_HOURS_2026,
      firedAll * MANAGER_HOURS,
      `Замены × ${MANAGER_HOURS} часов`,
    ],
    ['Средний срок работы до ухода, мес.', AVG_TENURE_2025, AVG_TENURE_2026, '—', 'По данным кадрового учёта'],
  ].forEach((r, i) => {
    const row = dataRow([r[0] as string, r[1] as number, r[2] as number, r[3] as string | number, null, null, r[4] as string], {
      zebra: i % 2 === 1,
      height: 22,
    });
    ws.mergeCells(row.number, 5, row.number, 7);
    row.getCell(2).font = { size: 10, bold: true };
  });
  note(
    `Только за 2026 год потеряно ${LOST_MONTHS_2026.toFixed(0)} человеко-месяцев — это работа примерно пяти сотрудников в течение года, потраченная на замену тех, кто не остался.`,
  );
  gap();

  head('Условия договоров с агентствами', `Действующие договоры на ${TERMS_DATE}. Всего договоров: ${TERMS_COUNT}.`);
  tableHead(['Агентство и договор', 'Контрагент', 'Стоимость', 'НДС', 'Гарантия, мес.', 'Оплата', 'Нанято / уволено']);
  TERMS.forEach((t, i) => {
    const row = dataRow(
      [
        `${t.name}\n${t.contract}`,
        t.entity,
        t.priceShort,
        t.vat,
        t.guaranteeMax,
        t.paymentSplit ? 'частями' : '100% сразу',
        `${t.hired} / ${t.fired}`,
      ],
      { zebra: i % 2 === 1, height: 38 },
    );
    row.getCell(2).font = { size: 10, bold: true };
    row.getCell(2).alignment = { wrapText: true, vertical: 'middle' };
    row.getCell(6).font = {
      size: 10,
      bold: true,
      color: { argb: t.guaranteeMax >= 6 ? GREEN : t.guaranteeMax <= 3 ? RED : AMBER },
    };
  });
  note(
    `Разброс гарантии: от ${GUARANTEE_MIN} до ${GUARANTEE_MAX} месяцев. Частями платит только ${SPLIT_PAYMENT_COUNT} подрядчик — остальные получают всю сумму сразу, ещё до того, как станет ясно, останется ли человек.`,
  );
  gap();

  head('Стоимость подбора уволившихся', 'Во сколько обошёлся подбор людей, которые не остались, по ставкам договоров.');
  tableHead(['Агентство', 'Ставка', 'Ушло 2025', 'Ушло 2026', 'Сумма 2025, ₽', 'Сумма 2026, ₽', 'Всего, ₽']);
  COST_ROWS.forEach((c, i) => {
    const s25 = c.rate * c.fired2025;
    const s26 = c.rate * c.fired2026;
    const row = dataRow([c.agency, c.rateLabel, c.fired2025, c.fired2026, s25, s26, s25 + s26], {
      zebra: i % 2 === 1,
      height: 20,
    });
    row.getCell(2).font = { size: 10, bold: true };
    [6, 7, 8].forEach((n) => {
      row.getCell(n).numFmt = '# ##0 ₽';
      row.getCell(n).alignment = { horizontal: 'right', vertical: 'middle' };
    });
  });
  const tr = totalRow([
    'Итого потрачено на тех, кто ушёл',
    `в среднем ${Math.round(COST_AVG).toLocaleString('ru-RU')} ₽ за человека`,
    COST_ROWS.reduce((s, c) => s + c.fired2025, 0),
    COST_ROWS.reduce((s, c) => s + c.fired2026, 0),
    COST_2025,
    COST_2026,
    COST_TOTAL,
  ]);
  [6, 7, 8].forEach((n) => {
    tr.getCell(n).numFmt = '# ##0 ₽';
    tr.getCell(n).alignment = { horizontal: 'right', vertical: 'middle' };
  });
  gap();

  head('Гарантии: что покрыто, а что уже нет', 'Сопоставление сроков ухода с гарантийными обязательствами договоров.');
  tableHead(['Срок работы до ухода', 'Случаев', 'Покрыто гарантией', 'Сумма, ₽', null, null, 'Комментарий']);
  ws.mergeCells(ws.lastRow!.number, 6, ws.lastRow!.number, 7);
  GUARANTEE_BANDS.forEach((b, i) => {
    const row = dataRow(
      [b.band, b.cases, b.covered ? 'да' : 'нет', Math.round(b.cases * COST_AVG), null, null, b.note],
      { zebra: i % 2 === 1, height: 22 },
    );
    ws.mergeCells(row.number, 6, row.number, 7);
    row.getCell(2).font = { size: 10, bold: true };
    row.getCell(4).font = { size: 10, bold: true, color: { argb: b.covered ? GREEN : RED } };
    row.getCell(5).numFmt = '# ##0 ₽';
  });
  const gt = totalRow([
    'Итого',
    COVERED_CASES + UNCOVERED_CASES,
    `${COVERED_PCT.toFixed(0)}% покрыто`,
    Math.round(COVERED_SUM + UNCOVERED_SUM),
    null,
    null,
    `Вне гарантии: ${UNCOVERED_CASES} случаев на ${Math.round(UNCOVERED_SUM).toLocaleString('ru-RU')} ₽`,
  ]);
  ws.mergeCells(gt.number, 6, gt.number, 7);
  gt.getCell(5).numFmt = '# ##0 ₽';
  note(
    `${COVERED_CASES} уходов из ${COVERED_CASES + UNCOVERED_CASES} попадают в гарантийный срок — по ним можно требовать бесплатную замену или возврат. Это прямой резерв экономии, если претензии заявлять вовремя.`,
    GREEN,
    'FFDCFCE7',
  );
  gap();

  head('Сколько заплатили агентствам', 'Фактические платежи и цена одного найма по каждому подрядчику.');
  tableHead(['Агентство', 'Оплачено 2025, ₽', 'Оплачено 2026, ₽', 'Всего, ₽', 'Нанято, чел.', 'Цена найма, ₽', 'Примечание']);
  PAYMENTS.forEach((p, i) => {
    const total = (p.paid2025 ?? 0) + (p.paid2026 ?? 0);
    const hired = p.hired2025 + p.hired2026;
    const row = dataRow(
      [
        p.name,
        p.paid2025 ?? '—',
        p.paid2026 ?? '—',
        total || '—',
        hired || '—',
        total && hired ? Math.round(total / hired) : '—',
        p.note ?? '',
      ],
      { zebra: i % 2 === 1, height: 22 },
    );
    row.getCell(2).font = { size: 10, bold: true };
    [3, 4, 5, 7].forEach((n) => {
      if (typeof row.getCell(n).value === 'number') {
        row.getCell(n).numFmt = '# ##0 ₽';
        row.getCell(n).alignment = { horizontal: 'right', vertical: 'middle' };
      }
    });
  });
  const pt = totalRow([
    'Итого оплачено агентствам',
    PAID_2025,
    PAID_2026,
    PAID_TOTAL,
    AG_TOTAL_2025 + AG_TOTAL_2026,
    COST_PER_HIRE.length ? Math.round(PAID_TOTAL / COST_PER_HIRE.reduce((s, c) => s + c.hired, 0)) : '—',
    `Доля ЭФИР в оплатах: ${EFIR_PAY_SHARE.toFixed(0)}%`,
  ]);
  [3, 4, 5, 7].forEach((n) => {
    pt.getCell(n).numFmt = '# ##0 ₽';
    pt.getCell(n).alignment = { horizontal: 'right', vertical: 'middle' };
  });
  note(
    `Разброс цены найма: от ${COST_MIN.toLocaleString('ru-RU')} до ${COST_MAX.toLocaleString('ru-RU')} ₽ за человека. Цена найма у ЭФИР: ${EFIR_COST_2025.toLocaleString('ru-RU')} ₽ в 2025 и ${EFIR_COST_2026.toLocaleString('ru-RU')} ₽ в 2026. Потери на уволившихся от ЭФИР — ${Math.round(EFIR_LOSS_TOTAL).toLocaleString('ru-RU')} ₽.`,
  );
  gap();

  head(
    'Открытые вакансии в работе у КА ЭФИР',
    `Данные на ${VACANCY_REPORT_DATE.split('-').reverse().join('.')}: ${VAC_POSITIONS} позиций, ${VAC_PEOPLE} человек. Средний оклад ${VAC_SALARY_AVG} тыс. ₽, месячный фонд ${VAC_MONTHLY_BUDGET} млн ₽.`,
  );
  tableHead(['Срок открытия вакансии', 'Позиций', 'Человек', 'Доля от всех, %', null, null, 'Комментарий']);
  ws.mergeCells(ws.lastRow!.number, 6, ws.lastRow!.number, 7);
  VAC_AGE_BANDS.forEach((b, i) => {
    const row = dataRow(
      [
        b.band,
        b.positions,
        b.people,
        num(agPct(b.people, VAC_PEOPLE), 1),
        null,
        null,
        b.min >= 6 ? 'Вакансия висит слишком долго — подрядчик не закрывает' : 'В нормальном сроке подбора',
      ],
      { zebra: i % 2 === 1, height: 22 },
    );
    ws.mergeCells(row.number, 6, row.number, 7);
    row.getCell(2).font = { size: 10, bold: true };
    if (b.min >= 6) row.getCell(4).font = { size: 10, bold: true, color: { argb: RED } };
  });
  totalRow([
    'Итого в работе',
    VAC_POSITIONS,
    VAC_PEOPLE,
    100,
    null,
    null,
    `Старше полугода: ${VAC_OLD_PEOPLE} человек`,
  ]);
  ws.mergeCells(ws.lastRow!.number, 6, ws.lastRow!.number, 7);

  ws.addRow([]);
  const vd = ws.addRow(['', 'Где нужны люди — по подразделениям']);
  ws.mergeCells(vd.number, 2, vd.number, COLS);
  vd.height = 20;
  vd.getCell(2).font = { bold: true, size: 11, color: { argb: DARK } };
  tableHead(['Подразделение', 'Человек', 'Доля, %', null, null, null, null]);
  ws.mergeCells(ws.lastRow!.number, 5, ws.lastRow!.number, COLS);
  VAC_DEPTS.forEach((d, i) => {
    const row = dataRow([d.dept, d.people, num(agPct(d.people, VAC_PEOPLE), 1), null, null, null, null], {
      zebra: i % 2 === 1,
    });
    ws.mergeCells(row.number, 5, row.number, COLS);
    row.getCell(2).font = { size: 10, bold: true };
  });

  ws.addRow([]);
  const vl = ws.addRow(['', 'Полный список открытых вакансий']);
  ws.mergeCells(vl.number, 2, vl.number, COLS);
  vl.height = 20;
  vl.getCell(2).font = { bold: true, size: 11, color: { argb: DARK } };
  const vacHead = tableHead(['Вакансия', 'Подразделение', 'Человек', 'Оклад', 'В работе с', 'Месяцев в работе', 'Статус']);
  const vacHeadRow = vacHead.number;
  const sortedVac = [...VACANCIES].sort((a, b) => (vacancyMonths(b) ?? -1) - (vacancyMonths(a) ?? -1));
  sortedVac.forEach((v, i) => {
    const m = vacancyMonths(v);
    const row = dataRow(
      [
        v.title,
        v.dept,
        v.count,
        v.salary,
        v.sinceLabel,
        m === null ? '—' : num(m, 1),
        m === null ? 'Дата не указана' : m >= 6 ? 'Просрочена' : 'В работе',
      ],
      { zebra: i % 2 === 1, height: 22 },
    );
    row.getCell(2).font = { size: 10, bold: true };
    row.getCell(2).alignment = { wrapText: true, vertical: 'middle' };
    if (m !== null && m >= 6) row.getCell(8).font = { size: 10, bold: true, color: { argb: RED } };
  });
  ws.autoFilter = {
    from: { row: vacHeadRow, column: 2 },
    to: { row: vacHeadRow + sortedVac.length, column: COLS },
  };
  gap();

  head('Что делаем дальше', 'Решения, которые следуют из цифр выше.');
  [
    ['Заявить претензии по гарантии', `${COVERED_CASES} уходов попадают в гарантийный срок — требовать замену или возврат`],
    ['Перевести оплату на этапы', 'Платить частями: после выхода и после прохождения испытательного срока'],
    ['Пересмотреть договоры с гарантией 3 месяца', 'Основная масса уходов приходится ровно на этот срок'],
    ['Разобрать профили проблемных должностей', 'Позиции, где уходит каждый второй нанятый'],
    ['Снизить зависимость от одного подрядчика', `Доля ЭФИР в найме — ${EFIR_SHARE_2026.toFixed(0)}%`],
    ['Разобрать вакансии старше полугода', `${VAC_OLD_PEOPLE} человек не закрыты слишком долго`],
  ].forEach(([a, b], i) => {
    const row = dataRow([a as string, b as string, null, null, null, null, null], { zebra: i % 2 === 1, height: 22 });
    ws.mergeCells(row.number, 3, row.number, COLS);
    row.getCell(2).font = { size: 10, bold: true };
    row.getCell(3).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
  });

  ws.views = [{ state: 'frozen', ySplit: 2 }];
}

export async function exportAgencyDashboardToExcel() {
  const ExcelJSmod = (await import('exceljs')).default;
  const wb = new ExcelJSmod.Workbook();
  wb.creator = 'Концерн КРОСТ · отдел кадров';
  wb.created = new Date();
  addAgencyDashboardSheet(wb);

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Кадровые агентства ${stamp}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
