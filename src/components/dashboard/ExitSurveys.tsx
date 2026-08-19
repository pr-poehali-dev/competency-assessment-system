import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { EXIT_SURVEYS, EXIT_ROUTER, EXIT_COMMON, type ExitSurveyKind } from '@/data/exitSurveys';
import type { SurveyQuestion } from '@/data/plan';

const TONE: Record<ExitSurveyKind['color'], { chip: string; head: string; badge: string; soft: string }> = {
  amber: {
    chip: 'bg-amber-50 text-amber-800 border-amber-200',
    head: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800',
    soft: 'bg-amber-50 border-amber-200',
  },
  rose: {
    chip: 'bg-rose-50 text-rose-800 border-rose-200',
    head: 'bg-rose-600',
    badge: 'bg-rose-100 text-rose-800',
    soft: 'bg-rose-50 border-rose-200',
  },
  sky: {
    chip: 'bg-sky-50 text-sky-800 border-sky-200',
    head: 'bg-sky-600',
    badge: 'bg-sky-100 text-sky-800',
    soft: 'bg-sky-50 border-sky-200',
  },
};

const typeTone: Record<SurveyQuestion['type'], string> = {
  'Один вариант': 'bg-slate-100 text-slate-600 border-slate-200',
  'Несколько вариантов': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Оценка: 'bg-amber-50 text-amber-700 border-amber-200',
  'Свободный ответ': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function Questions({ s }: { s: ExitSurveyKind }) {
  const t = TONE[s.color];
  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-2 px-3 pt-3">
        {[
          { icon: 'Users', label: 'Кого касается', text: s.who },
          { icon: 'Target', label: 'Цель интервью', text: s.goal },
          { icon: 'Clock', label: 'Длительность', text: s.duration },
          { icon: 'UserCheck', label: 'Кто проводит', text: s.interviewer },
        ].map((f) => (
          <div key={f.label} className="flex gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
            <Icon name={f.icon} size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">{f.label}</div>
              <div className="text-xs text-slate-700 leading-snug mt-0.5">{f.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`mx-3 mt-2.5 flex gap-2 text-xs border rounded-md px-2.5 py-2 ${t.soft}`}>
        <Icon name="Info" size={13} className="shrink-0 mt-0.5 text-slate-500" />
        <span className="text-slate-800 leading-relaxed">{s.rule}</span>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {s.questions.map((q) => (
          <div key={q.n} className="px-3 py-3">
            <div className="flex items-start gap-2">
              <span
                className={`w-5 h-5 rounded text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${t.head}`}
              >
                {q.n}
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900 leading-snug">{q.question}</div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${typeTone[q.type]}`}>{q.type}</span>
                  <span className="text-[11px] text-slate-500">{q.hint}</span>
                </div>
              </div>
            </div>
            <ul className="mt-2.5 space-y-1 pl-7 list-none">
              {q.options.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-slate-700 leading-relaxed">
                  <span className="w-3.5 h-3.5 border border-slate-300 rounded-sm shrink-0 mt-0.5 bg-white" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-3 mb-3 mt-1 flex gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-xs">
        <Icon name="ChartNoAxesColumn" size={13} className="text-emerald-600 shrink-0 mt-0.5" />
        <span className="text-emerald-900 leading-relaxed">{s.useData}</span>
      </div>
    </div>
  );
}

export default function ExitSurveys() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const active = EXIT_SURVEYS[tab];
  const total = EXIT_SURVEYS.reduce((s, k) => s + k.questions.length, 0);

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="no-print w-full flex items-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <Icon name="ClipboardList" size={15} className="text-slate-500 shrink-0" />
        <span className="text-sm font-semibold text-slate-900 flex-1">
          Анкеты выходного интервью — 3 варианта, {total} вопросов
        </span>
        <Icon
          name="ChevronDown"
          size={15}
          className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`${open ? 'block' : 'hidden'} print-block`}>
        <div className="px-3 pt-3">
          <div className="text-sm font-bold text-slate-900">{EXIT_ROUTER.title}</div>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">{EXIT_ROUTER.intro}</p>

          <div className="mt-2.5 overflow-x-auto">
            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="text-left px-2.5 py-2 font-semibold">Тип текучести</th>
                  <th className="text-left px-2.5 py-2 font-semibold">Когда выбирать</th>
                  <th className="text-left px-2.5 py-2 font-semibold">Что хотим узнать</th>
                  <th className="text-left px-2.5 py-2 font-semibold">Анкета</th>
                </tr>
              </thead>
              <tbody>
                {EXIT_ROUTER.rows.map((r, idx) => (
                  <tr key={r.kind} className={idx % 2 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-2.5 py-2 font-semibold text-slate-900 align-top">{r.kind}</td>
                    <td className="px-2.5 py-2 text-slate-600 align-top">{r.when}</td>
                    <td className="px-2.5 py-2 text-slate-600 align-top">{r.goal}</td>
                    <td className="px-2.5 py-2 align-top">
                      <span
                        className={`whitespace-nowrap text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          TONE[EXIT_SURVEYS[idx].color].badge
                        }`}
                      >
                        {r.form}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-2.5 flex gap-2 text-xs bg-amber-50 border border-amber-200 rounded-md px-2.5 py-2">
            <Icon name="TriangleAlert" size={13} className="text-amber-600 shrink-0 mt-0.5" />
            <span className="text-amber-900 leading-relaxed">{EXIT_ROUTER.warning}</span>
          </div>

          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
            <div className="text-xs font-bold text-slate-900">{EXIT_COMMON.title}</div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {EXIT_COMMON.fields.map((f) => (
                <span key={f} className="text-[11px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600">
                  {f}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{EXIT_COMMON.note}</p>
          </div>
        </div>

        <div className="px-3 pt-4 pb-1">
          <div className="text-sm font-bold text-slate-900">Шаг 2. Заполнить анкету по выбранному типу</div>
        </div>

        <div className="no-print flex flex-wrap gap-1.5 px-3 pt-2">
          {EXIT_SURVEYS.map((s, idx) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setTab(idx)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-colors ${
                idx === tab ? `${TONE[s.color].head} text-white border-transparent` : `${TONE[s.color].chip} hover:opacity-80`
              }`}
            >
              {s.code} · {s.short} ({s.questions.length})
            </button>
          ))}
        </div>

        <div className="no-print px-3 pt-3">
          <div className={`rounded-lg border px-3 py-2.5 ${TONE[active.color].soft}`}>
            <div className="text-sm font-bold text-slate-900">
              {active.code}. {active.title}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mt-1">{active.definition}</p>
          </div>
          <Questions s={active} />
        </div>

        <div className="hidden print:block">
          {EXIT_SURVEYS.map((s) => (
            <div key={s.key} className="px-3 pt-3">
              <div className={`rounded-lg border px-3 py-2.5 ${TONE[s.color].soft}`}>
                <div className="text-sm font-bold text-slate-900">
                  {s.code}. {s.title}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">{s.definition}</p>
              </div>
              <Questions s={s} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
