import ExcelJS from 'exceljs';
import { PLAN_WAVES, STATUS_META, countByStatus, progressPercent, type PlanStatus } from '@/data/plan';
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
  ];

  const allTasks = PLAN_WAVES.flatMap((w) =>
    w.tasks.map((t) => ({ ...t, status: entries[t.id]?.status ?? t.status })),
  );
  const totals = countByStatus(allTasks);
  const progress = progressPercent(allTasks);
  const today = new Date().toLocaleDateString('ru-RU');

  const title = ws.addRow(['План работы по снижению текучести персонала']);
  ws.mergeCells(title.number, 1, title.number, 14);
  title.height = 30;
  title.getCell(1).font = { bold: true, size: 16, color: { argb: DARK } };
  title.getCell(1).alignment = { vertical: 'middle' };

  const sub = ws.addRow([`Концерн КРОСТ · выгружено ${today}`]);
  ws.mergeCells(sub.number, 1, sub.number, 14);
  sub.getCell(1).font = { size: 10, color: { argb: GREY } };

  const stat = ws.addRow([
    `Всего задач: ${totals.total}   ·   Выполнено: ${totals.done}   ·   В работе: ${totals.doing}   ·   Не начато: ${totals.todo}   ·   Прогресс: ${progress}%`,
  ]);
  ws.mergeCells(stat.number, 1, stat.number, 14);
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
    ws.mergeCells(wr.number, 1, wr.number, 14);
    wr.height = 22;
    wr.getCell(1).font = { bold: true, size: 11, color: { argb: DARK } };
    wr.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: WAVE_FILL[wave.tone] } };
    wr.getCell(1).alignment = { vertical: 'middle' };
    for (let i = 1; i <= 14; i += 1) wr.getCell(i).border = border;

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
    });
  });

  ws.addRow([]);
  const foot = ws.addRow([
    'Статусы и комментарии выгружены из общего хранилища отчёта. Задача «в работе» учитывается в прогрессе наполовину.',
  ]);
  ws.mergeCells(foot.number, 1, foot.number, 14);
  foot.getCell(1).font = { size: 9, italic: true, color: { argb: GREY } };

  ws.autoFilter = { from: { row: head.number, column: 1 }, to: { row: head.number, column: 14 } };

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
