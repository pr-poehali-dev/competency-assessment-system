import Icon from '@/components/ui/icon';
import { PLAN_WAVES, PLAN_OWNERS, PLAN_CONTROL, PLAN_TASKS, type PlanTask } from '@/data/plan';

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

function TaskCard({ task, border }: { task: PlanTask; border: string }) {
  return (
    <div className={`rounded-xl border bg-white p-5 print-block ${border}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="text-xs font-bold tabular-nums text-slate-400 mt-0.5 shrink-0">{task.id}</div>
        <div className="flex-1">
          <div className="font-semibold text-slate-900 leading-snug">{task.title}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{priorityLabel[task.priority]}</div>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${effortTone[task.effort]}`}>
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
          <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Icon name="CalendarCheck" size={14} className="text-slate-400" />
            {task.deadline}
          </div>
        </div>
        <div className="sm:col-span-2 bg-slate-50 rounded-lg px-3 py-2.5">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Как измеряем результат</div>
          <div className="text-sm text-slate-700">
            {task.metric} — <span className="font-semibold text-slate-900">{task.target}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActionPlan() {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {PLAN_OWNERS.map((o) => (
            <div key={o.owner} className="border border-slate-200 rounded-lg px-4 py-3">
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{o.count}</div>
              <div className="text-sm font-medium text-slate-700 mt-0.5 leading-snug">{o.owner}</div>
              <div className="text-xs text-slate-500 mt-1 leading-snug">{o.role}</div>
            </div>
          ))}
        </div>
      </div>

      {PLAN_WAVES.map((wave) => {
        const tone = waveTone[wave.tone];
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
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 print-pair">
              {wave.tasks.map((t) => (
                <TaskCard key={t.id} task={t} border={tone.card} />
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
