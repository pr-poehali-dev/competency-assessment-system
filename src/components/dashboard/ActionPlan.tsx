import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { exportPlanToExcel } from '@/lib/planExport';
import TaskNote from '@/components/dashboard/TaskNote';
import ExitSurveys from '@/components/dashboard/ExitSurveys';
import { usePlanState, type PlanEntry, type SyncState } from '@/lib/planNotes';
import {
  PLAN_WAVES,
  PLAN_OWNERS,
  PLAN_CONTROL,
  PLAN_TASKS,
  PLAN_STATUS_NOTE,
  STATUS_META,
  STATUS_ORDER,
  countByStatus,
  progressPercent,
  isOverdue,
  daysOverdue,
  overdueLabel,
  type PlanTask,
  type PlanStatus,
  type PlanChecklistPoint,
} from '@/data/plan';

const waveTone: Record<string, { chip: string; bar: string; card: string }> = {
  red: { chip: 'bg-rose-100 text-rose-800 border-rose-200', bar: 'bg-rose-500', card: 'border-rose-200' },
  amber: { chip: 'bg-amber-100 text-amber-800 border-amber-200', bar: 'bg-amber-500', card: 'border-amber-200' },
  blue: { chip: 'bg-sky-100 text-sky-800 border-sky-200', bar: 'bg-sky-500', card: 'border-sky-200' },
};

const effortTone: Record<PlanTask['effort'], string> = {
  Низкие: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Средние: 'bg-amber-50 text-amber-700 border-amber-200',
  Высокие: 'bg-rose-50 text-rose-700 border-rose-200',
};

const priorityLabel: Record<PlanTask['priority'], string> = {
  1: 'Высокий приоритет',
  2: 'Средний приоритет',
  3: 'Можно позже',
};

function StatusChip({ status }: { status: PlanTask['status'] }) {
  const s = STATUS_META[status];
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${s.chip}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function ProgressBar({ tasks }: { tasks: PlanTask[] }) {
  const c = countByStatus(tasks);
  return (
    <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
      {STATUS_ORDER.map((k) =>
        c[k] > 0 ? (
          <div key={k} className={STATUS_META[k].bar} style={{ width: `${(c[k] / c.total) * 100}%` }} />
        ) : null,
      )}
    </div>
  );
}

function TaskChecklist({ points }: { points: PlanChecklistPoint[] }) {
  const [open, setOpen] = useState(false);
  const total = points.reduce((n, p) => n + p.questions.length, 0);

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="no-print w-full flex items-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <Icon name="ListChecks" size={15} className="text-slate-500 shrink-0" />
        <span className="text-sm font-semibold text-slate-900 flex-1">
          Чек-лист разговора — {total} вопросов в 3 точках
        </span>
        <Icon
          name="ChevronDown"
          size={15}
          className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`${open ? 'block' : 'hidden'} print-block divide-y divide-slate-100`}>
        {points.map((p) => (
          <div key={p.when} className="px-3 py-3">
            <div className="flex items-baseline gap-2 flex-wrap mb-2">
              <span className="text-xs font-bold text-white bg-slate-800 rounded px-2 py-0.5">{p.when}</span>
              <span className="text-xs text-slate-500">{p.focus}</span>
            </div>

            <ol className="space-y-1.5 list-none">
              {p.questions.map((q, i) => (
                <li key={q} className="flex gap-2 text-sm text-slate-700 leading-relaxed">
                  <span className="text-slate-400 tabular-nums shrink-0">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>

            <div className="mt-2.5 flex gap-2 text-xs bg-rose-50 border border-rose-200 rounded-md px-2.5 py-2">
              <Icon name="TriangleAlert" size={13} className="text-rose-500 shrink-0 mt-0.5" />
              <span className="text-rose-900">
                <span className="font-semibold">Тревожный сигнал: </span>
                {p.redFlag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



function TaskCard({
  task,
  border,
  entry,
  onSave,
}: {
  task: PlanTask;
  border: string;
  entry?: PlanEntry;
  onSave: (id: string, patch: { status?: PlanStatus; note?: string }) => Promise<boolean>;
}) {
  const s = STATUS_META[task.status];
  const late = isOverdue(task);
  const days = late ? daysOverdue(task) : 0;

  return (
    <div
      className={`rounded-xl border p-5 print-block ${
        late ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-200' : `bg-white ${border}`
      } ${task.status === 'done' ? 'opacity-90' : ''}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <Icon name={s.icon} size={18} className={`mt-0.5 shrink-0 ${s.text}`} />
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold tabular-nums text-slate-400 shrink-0">{task.id}</span>
            <span className="font-semibold text-slate-900 leading-snug">{task.title}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{priorityLabel[task.priority]}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <StatusChip status={task.status} />
        {late && (
          <span className="text-[11px] px-2 py-0.5 rounded-full border bg-rose-100 text-rose-800 border-rose-300 inline-flex items-center gap-1.5 font-medium">
            <Icon name="TriangleAlert" size={12} />
            {overdueLabel(days)}
          </span>
        )}
        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${effortTone[task.effort]}`}>
          {task.effort} затраты
        </span>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-4">{task.what}</p>

      <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3 border-t border-slate-100 pt-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Ответственный</div>
          <div className="text-sm font-semibold text-slate-900">{task.owner}</div>
          <div className="text-xs text-slate-500 mt-0.5">{task.support}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Срок</div>
          <div className={`text-sm font-semibold flex items-center gap-1.5 ${late ? 'text-rose-700' : 'text-slate-900'}`}>
            <Icon
              name={late ? 'CalendarX' : 'CalendarCheck'}
              size={14}
              className={late ? 'text-rose-500' : 'text-slate-400'}
            />
            {task.deadline}
          </div>
        </div>
        <div className="sm:col-span-2 bg-slate-50 rounded-lg px-3 py-2.5">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Как измеряем результат</div>
          <div className="text-sm text-slate-700">
            {task.metric} — <span className="font-semibold text-slate-900">{task.target}</span>
          </div>
        </div>

        {task.checklist && (
          <div className="sm:col-span-2">
            <TaskChecklist points={task.checklist} />
          </div>
        )}

        {task.exitSurveys && (
          <div className="sm:col-span-2">
            <ExitSurveys />
          </div>
        )}

        <TaskNote taskId={task.id} entry={entry} status={task.status} onSave={onSave} />
      </div>
    </div>
  );
}

function SyncBadge({ state, onRetry }: { state: SyncState; onRetry: () => void }) {
  if (state === 'ready') return null;

  const map: Record<Exclude<SyncState, 'ready'>, { icon: string; text: string; cls: string }> = {
    loading: { icon: 'LoaderCircle', text: 'Загружаю отметки', cls: 'text-slate-400' },
    saving: { icon: 'LoaderCircle', text: 'Сохраняю', cls: 'text-slate-400' },
    error: { icon: 'TriangleAlert', text: 'Нет связи с хранилищем', cls: 'text-rose-600' },
  };
  const m = map[state];

  return (
    <div className={`no-print inline-flex items-center gap-1.5 text-[11px] ${m.cls}`}>
      <Icon name={m.icon} size={12} className={state === 'error' ? '' : 'animate-spin'} />
      {m.text}
      {state === 'error' && (
        <button type="button" onClick={onRetry} className="underline hover:no-underline ml-1">
          Повторить
        </button>
      )}
    </div>
  );
}

export default function ActionPlan() {
  const { entries, sync, save, reload } = usePlanState();

  const waves = PLAN_WAVES.map((w) => ({
    ...w,
    tasks: w.tasks.map((t) => ({ ...t, status: entries[t.id]?.status ?? t.status })),
  }));
  const allTasks = waves.flatMap((w) => w.tasks);
  const totals = countByStatus(allTasks);
  const progress = progressPercent(allTasks);
  const noteCount = allTasks.filter((t) => entries[t.id]?.note).length;

  const overdue = allTasks.filter((t) => isOverdue(t));
  const overdueSoonest = [...overdue].sort((a, b) => daysOverdue(b) - daysOverdue(a));

  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      await exportPlanToExcel(entries);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 print-block">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center shrink-0">
            <Icon name="ListChecks" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Как устроен план</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              {PLAN_TASKS.length} задач в трёх этапах. Каждая закрывает конкретную причину увольнений из этого отчёта, у
              каждой — один ответственный, срок и показатель, по которому видно результат.
            </p>
          </div>
        </div>

        {overdue.length > 0 && (
          <div className="mt-5 rounded-lg border border-rose-300 bg-rose-50 p-4 print-block">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center shrink-0">
                <Icon name="TriangleAlert" size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-bold text-rose-700 tabular-nums leading-none">{overdue.length}</span>
                  <span className="font-semibold text-rose-900">
                    {overdue.length === 1 ? 'задача просрочена' : 'задач просрочено'}
                  </span>
                </div>
                <p className="text-sm text-rose-800/80 mt-1 leading-relaxed">
                  Срок прошёл, а статус не «Выполнена». Эти задачи выделены красным в списке ниже.
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {overdueSoonest.slice(0, 6).map((t) => (
                    <span
                      key={t.id}
                      className="text-xs bg-white border border-rose-200 text-rose-900 rounded-lg px-2.5 py-1.5"
                    >
                      <span className="tabular-nums text-rose-400 mr-1.5">{t.id}</span>
                      {t.title}
                      <span className="text-rose-500 ml-1.5">· {t.owner}</span>
                    </span>
                  ))}
                  {overdue.length > 6 && (
                    <span className="text-xs text-rose-600 px-1 py-1.5">и ещё {overdue.length - 6}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="no-print flex flex-wrap items-center gap-3 mt-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => void download()}
            className="inline-flex items-center gap-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
          >
            <Icon name={busy ? 'LoaderCircle' : 'Sheet'} size={16} className={busy ? 'animate-spin' : ''} />
            {busy ? 'Готовлю файл…' : 'Выгрузить план в Excel'}
          </button>
          <span className="text-xs text-slate-500">
            Все задачи с ответственными, сроками, статусами и комментариями
          </span>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-end justify-between gap-4 mb-2">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400">Общий прогресс плана</div>
              <div className="text-sm text-slate-600 mt-0.5">
                Выполнено {totals.done} из {totals.total}, в работе {totals.doing}
              </div>
              <SyncBadge state={sync} onRetry={reload} />
            </div>
            <div className="text-3xl font-bold text-slate-900 tabular-nums leading-none">{progress}%</div>
          </div>

          <ProgressBar tasks={allTasks} />

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
            {STATUS_ORDER.map((k) => (
              <div key={k} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_META[k].dot}`} />
                <span className="text-xs text-slate-600">
                  {STATUS_META[k].label}
                  <span className="text-slate-400"> · {totals[k]}</span>
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">{PLAN_STATUS_NOTE}</p>

          <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-200">
            <Icon name="MessageSquareText" size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ответственный может записать ход выполнения в комментарии к задаче — отмечено{' '}
              <span className="font-semibold text-slate-600">{noteCount}</span> из {totals.total}. Отметки и
              комментарии общие для всех: их видно с любого компьютера, и они попадают в скачанный PDF.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {PLAN_OWNERS.map((o) => (
            <div key={o.owner} className="border border-slate-200 rounded-lg px-4 py-3">
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{o.count}</div>
              <div className="text-sm font-medium text-slate-700 mt-0.5 leading-snug">{o.owner}</div>
              <div className="text-xs text-slate-500 mt-1 leading-snug">{o.role}</div>
            </div>
          ))}
        </div>
      </div>

      {waves.map((wave) => {
        const tone = waveTone[wave.tone];
        const c = countByStatus(wave.tasks);
        const p = progressPercent(wave.tasks);
        return (
          <div key={wave.key} className="space-y-4">
            <div className="flex items-start gap-3 print-block">
              <div className={`w-1.5 self-stretch rounded-full ${tone.bar}`} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{wave.name}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${tone.chip}`}>{wave.period}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{wave.goal}</p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 max-w-xs">
                    <ProgressBar tasks={wave.tasks} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">{p}%</span>
                  <span className="text-xs text-slate-500">
                    выполнено {c.done} из {c.total}
                    {c.doing > 0 && `, в работе ${c.doing}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 print-pair">
              {wave.tasks.map((t) => (
                <TaskCard key={t.id} task={t} border={tone.card} entry={entries[t.id]} onSave={save} />
              ))}
            </div>
          </div>
        );
      })}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 print-block">
        <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Icon name="Repeat" size={18} className="text-slate-500" />
          Контроль исполнения
        </h3>
        <p className="text-sm text-slate-500 mb-4">Без регулярной сверки план перестаёт работать через месяц</p>
        <div className="grid md:grid-cols-3 gap-4 print-trio">
          {PLAN_CONTROL.map((c) => (
            <div key={c.title} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="font-semibold text-slate-900 text-sm mb-1.5">{c.title}</div>
              <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}