import ExcelJS from 'exceljs';
import {
  PLAN_WAVES,
  STATUS_META,
  countByStatus,
  progressPercent,
  isOverdue,
  daysOverdue,
  overdueLabel,
  type PlanStatus,
} from '@/data/plan';
import type { PlanState } from '@/lib/planNotes';

const DARK = 'FF1A1A2E';
const GREY = 'FF64748B';
const LINE = 'FFE2E8F0';

const STATUS_FILL: Record<PlanStatus, string> = {
  todo: 'FFF1F5F9',
  doing: 'FFFEF3C7',
  done: 'FFD1FAE5',
};

const STATUS_FONT: Record<PlanStatus, string> = {
  todo: 'FF64748B',
  doing: 'FFB45309',
  done: 'FF047857',
};

const WAVE_FILL: Record<string, string> = {
  red: 'FFFFE4E6',
  amber: 'FFFEF3C7',
  blue: 'FFE0F2FE',
};

const thin = { style: 'thin' as const, color: { argb: LINE } };
const border = { top: thin, left: thin, bottom: thin, right: thin };

export async function exportPlanToExcel(entries: PlanState) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Концерн КРОСТ';
  wb.created = new Date();

  const ws = wb.addWorksheet('План работы', {
    views: [{ state: 'frozen', ySplit: 5 }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  ws.columns = [
    { key: 'id', width: 7 },
    { key: 'title', width: 34 },
    { key: 'what', width: 52 },
    { key: 'owner', width: 24 },
    { key: 'support', width: 26 },
    { key: 'deadline', width: 17 },
    { key: 'status', width: 14 },
    { key: 'note', width: 44 },
    { key: 'author', width: 16 },
    { key: 'updated', width: 15 },
    { key: 'metric', width: 34 },
    { key: 'target', width: 26 },
    { key: 'priority', width: 12 },
    { key: 'effort', width: 12 },
    { key: 'overdue', width: 22 },
  ];

  const allTasks = PLAN_WAVES.flatMap((w) =>
    w.tasks.map((t) => ({ ...t, status: entries[t.id]?.status ?? t.status })),
  );
  const totals = countByStatus(allTasks);
  const progress = progressPercent(allTasks);
  const overdueCount = allTasks.filter((t) => isOverdue(t)).length;
  const today = new Date().toLocaleDateString('ru-RU');

  const title = ws.addRow(['План работы по снижению текучести персонала']);
  ws.mergeCells(title.number, 1, title.number, 15);
  title.height = 30;
  title.getCell(1).font = { bold: true, size: 16, color: { argb: DARK } };
  title.getCell(1).alignment = { vertical: 'middle' };

  const sub = ws.addRow([`Концерн КРОСТ · выгружено ${today}`]);
  ws.mergeCells(sub.number, 1, sub.number, 15);
  sub.getCell(1).font = { size: 10, color: { argb: GREY } };

  const stat = ws.addRow([
    `Всего задач: ${totals.total}   ·   Выполнено: ${totals.done}   ·   В работе: ${totals.doing}   ·   Не начато: ${totals.todo}   ·   Прогресс: ${progress}%   ·   Просрочено: ${overdueCount}`,
  ]);
  ws.mergeCells(stat.number, 1, stat.number, 15);
  stat.getCell(1).font = { size: 10, bold: true, color: { argb: DARK } };
  ws.addRow([]);

  const head = ws.addRow([
    '№',
    'Задача',
    'Что сделать',
    'Ответственный',
    'Кто помогает',
    'Срок',
    'Статус',
    'Ход выполнения',
    'Кто отметил',
    'Обновлено',
    'Показатель',
    'Целевое значение',
    'Приоритет',
    'Затраты',
    'Просрочка',
  ]);
  head.height = 26;
  head.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = border;
  });

  const priorityLabel: Record<number, string> = { 1: 'Высокий', 2: 'Средний', 3: 'Можно позже' };

  PLAN_WAVES.forEach((wave) => {
    const waveTasks = wave.tasks.map((t) => ({ ...t, status: entries[t.id]?.status ?? t.status }));
    const wc = countByStatus(waveTasks);

    const wr = ws.addRow([
      `${wave.name} · ${wave.period} — выполнено ${wc.done} из ${wc.total} (${progressPercent(waveTasks)}%)`,
    ]);
    ws.mergeCells(wr.number, 1, wr.number, 15);
    wr.height = 22;
    wr.getCell(1).font = { bold: true, size: 11, color: { argb: DARK } };
    wr.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: WAVE_FILL[wave.tone] } };
    wr.getCell(1).alignment = { vertical: 'middle' };
    for (let i = 1; i <= 15; i += 1) wr.getCell(i).border = border;

    waveTasks.forEach((t) => {
      const e = entries[t.id];
      const row = ws.addRow({
        id: t.id,
        title: t.title,
        what: t.what,
        owner: t.owner,
        support: t.support,
        deadline: t.deadline,
        status: STATUS_META[t.status].label,
        note: e?.note ?? '',
        author: e?.author ?? '',
        updated: e?.updatedAt ? new Date(e.updatedAt).toLocaleDateString('ru-RU') : '',
        metric: t.metric,
        target: t.target,
        priority: priorityLabel[t.priority],
        effort: t.effort,
        overdue: isOverdue(t) ? overdueLabel(daysOverdue(t)) : '',
      });

      row.eachCell((cell) => {
        cell.alignment = { vertical: 'top', wrapText: true };
        cell.font = { size: 10 };
        cell.border = border;
      });

      row.getCell('id').alignment = { vertical: 'top', horizontal: 'center' };
      row.getCell('title').font = { size: 10, bold: true, color: { argb: DARK } };

      const sc = row.getCell('status');
      sc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: STATUS_FILL[t.status] } };
      sc.font = { size: 10, bold: true, color: { argb: STATUS_FONT[t.status] } };
      sc.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

      if (e?.note) {
        row.getCell('note').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFBEB' } };
      }

      if (isOverdue(t)) {
        const oc = row.getCell('overdue');
        oc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
        oc.font = { size: 10, bold: true, color: { argb: 'FFB91C1C' } };
        row.getCell('deadline').font = { size: 10, bold: true, color: { argb: 'FFB91C1C' } };
        row.getCell('title').font = { size: 10, bold: true, color: { argb: 'FFB91C1C' } };
      }
    });
  });

  ws.addRow([]);
  const foot = ws.addRow([
    'Статусы и комментарии выгружены из общего хранилища отчёта. Задача «в работе» учитывается в прогрессе наполовину.',
  ]);
  ws.mergeCells(foot.number, 1, foot.number, 15);
  foot.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };

  ws.autoFilter = { from: { row: head.number, column: 1 }, to: { row: head.number, column: 15 } };

  const withChecklist = PLAN_WAVES.flatMap((w) => w.tasks).filter((t) => t.checklist?.length);

  if (withChecklist.length) {
    const cs = wb.addWorksheet('Чек-листы', {
      views: [{ state: 'frozen', ySplit: 2 }],
      pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    });
    cs.columns = [
      { key: 'point', width: 16 },
      { key: 'num', width: 6 },
      { key: 'question', width: 88 },
    ];

    withChecklist.forEach((task) => {
      const th = cs.addRow([`Задача ${task.id}. ${task.title}`]);
      cs.mergeCells(th.number, 1, th.number, 3);
      th.height = 26;
      th.getCell(1).font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
      th.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
      th.getCell(1).alignment = { vertical: 'middle' };

      const sh = cs.addRow(['Точка', '№', 'Вопрос']);
      sh.eachCell((cell) => {
        cell.font = { bold: true, size: 10, color: { argb: DARK } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = border;
      });

      task.checklist?.forEach((point) => {
        const pr = cs.addRow([`${point.when} — ${point.focus}`]);
        cs.mergeCells(pr.number, 1, pr.number, 3);
        pr.getCell(1).font = { bold: true, size: 11, color: { argb: DARK } };
        pr.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
        for (let i = 1; i <= 3; i += 1) pr.getCell(i).border = border;

        point.questions.forEach((q, i) => {
          const qr = cs.addRow({ point: '', num: i + 1, question: q });
          qr.eachCell((cell) => {
            cell.alignment = { vertical: 'top', wrapText: true };
            cell.font = { size: 10 };
            cell.border = border;
          });
          qr.getCell('num').alignment = { vertical: 'top', horizontal: 'center' };
        });

        const fr = cs.addRow(['', '', `Тревожный сигнал: ${point.redFlag}`]);
        fr.getCell(3).font = { size: 10, italic: true, color: { argb: 'FFB91C1C' } };
        fr.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
        fr.getCell(3).alignment = { vertical: 'top', wrapText: true };
        for (let i = 1; i <= 3; i += 1) fr.getCell(i).border = border;
      });

      cs.addRow([]);
    });
  }

  const withSurvey = PLAN_WAVES.flatMap((w) => w.tasks).filter((t) => t.survey);

  withSurvey.forEach((task) => {
    const survey = task.survey;
    if (!survey) return;

    const sv = wb.addWorksheet('Выходное интервью', {
      views: [{ state: 'frozen', ySplit: 1 }],
      pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    });
    sv.columns = [
      { key: 'mark', width: 8 },
      { key: 'text', width: 96 },
    ];

    const h = sv.addRow([survey.title]);
    sv.mergeCells(h.number, 1, h.number, 2);
    h.height = 30;
    h.getCell(1).font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
    h.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    h.getCell(1).alignment = { vertical: 'middle' };

    const fio = sv.addRow(['', 'ФИО сотрудника: _______________________    Подразделение: _______________________']);
    sv.mergeCells(fio.number, 1, fio.number, 2);
    fio.getCell(1).font = { size: 10 };
    const dt = sv.addRow(['', 'Дата увольнения: ______________    Стаж работы: ______________    Заполнил: ______________']);
    sv.mergeCells(dt.number, 1, dt.number, 2);
    dt.getCell(1).font = { size: 10 };

    const intro = sv.addRow(['', survey.intro]);
    sv.mergeCells(intro.number, 1, intro.number, 2);
    intro.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };
    intro.getCell(1).alignment = { wrapText: true, vertical: 'top' };
    intro.height = 30;

    const rule = sv.addRow(['', survey.rule]);
    sv.mergeCells(rule.number, 1, rule.number, 2);
    rule.getCell(1).font = { size: 9, bold: true, color: { argb: 'FFB45309' } };
    rule.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
    rule.getCell(1).alignment = { wrapText: true, vertical: 'top' };
    rule.height = 28;
    sv.addRow([]);

    survey.questions.forEach((q) => {
      const qr = sv.addRow(['', `${q.n}. ${q.question}`]);
      sv.mergeCells(qr.number, 1, qr.number, 2);
      qr.height = 22;
      qr.getCell(1).font = { bold: true, size: 11, color: { argb: DARK } };
      qr.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
      qr.getCell(1).alignment = { vertical: 'middle', wrapText: true };

      const hr = sv.addRow(['', `${q.type}. ${q.hint}`]);
      sv.mergeCells(hr.number, 1, hr.number, 2);
      hr.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };
      hr.getCell(1).alignment = { wrapText: true, vertical: 'top' };

      q.options.forEach((o) => {
        const orow = sv.addRow({ mark: '☐', text: o });
        orow.getCell('mark').alignment = { horizontal: 'center', vertical: 'top' };
        orow.getCell('mark').font = { size: 12 };
        orow.getCell('text').font = { size: 10 };
        orow.getCell('text').alignment = { wrapText: true, vertical: 'top' };
        orow.getCell('mark').border = border;
        orow.getCell('text').border = border;
      });

      sv.addRow([]);
    });

    const sign = sv.addRow(['', 'Подпись сотрудника: ______________        Подпись специалиста отдела кадров: ______________']);
    sv.mergeCells(sign.number, 1, sign.number, 2);
    sign.getCell(1).font = { size: 10 };
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `План работы ${stamp}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
