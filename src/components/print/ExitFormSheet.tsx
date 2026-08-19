import Icon from '@/components/ui/icon';
import { type ExitSurveyKind } from '@/data/exitSurveys';

const TONE: Record<ExitSurveyKind['color'], { bar: string; soft: string; text: string; border: string }> = {
  amber: { bar: 'bg-amber-500', soft: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  rose: { bar: 'bg-rose-600', soft: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300' },
  sky: { bar: 'bg-sky-600', soft: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-300' },
};

function Field({ label, w = 'flex-1' }: { label: string; w?: string }) {
  return (
    <div className={`${w} min-w-0`}>
      <div className="text-[7.5pt] text-slate-500 leading-none">{label}</div>
      <div className="border-b border-slate-400 h-[14px]" />
    </div>
  );
}

const LABEL_SHORT: Record<string, string> = {
  'Один вариант': 'один вариант',
  'Несколько вариантов': 'можно несколько',
  Оценка: 'оценка',
  'Свободный ответ': 'записать словами',
};

export default function ExitFormSheet({ survey }: { survey: ExitSurveyKind }) {
  const t = TONE[survey.color];

  return (
    <div className="bg-white">
      <div className="border border-slate-800">
        <div className={`${t.bar} px-3 py-1.5 flex items-start justify-between gap-3 text-white`}>
          <div>
            <div className="text-[8.5pt] uppercase tracking-[0.15em] opacity-90 leading-none">
              Концерн КРОСТ · выходное интервью
            </div>
            <div className="text-[12pt] font-black leading-tight mt-0.5">
              {survey.code}. {survey.title}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[8.5pt] opacity-90 leading-none">вопросов</div>
            <div className="text-[14pt] font-black leading-none mt-0.5">{survey.questions.length}</div>
          </div>
        </div>

        <div className={`${t.soft} border-b border-slate-300 px-3 py-1`}>
          <p className="text-[8pt] text-slate-700 leading-snug">{survey.definition}</p>
        </div>

        <div className="grid grid-cols-4 border-b border-slate-300 divide-x divide-slate-200">
          {[
            { label: 'Кого касается', text: survey.who },
            { label: 'Цель', text: survey.goal },
            { label: 'Время', text: survey.duration },
            { label: 'Кто проводит', text: survey.interviewer },
          ].map((f) => (
            <div key={f.label} className="px-2 py-1">
              <div className="text-[7.5pt] uppercase tracking-wide text-slate-400 font-bold leading-none">{f.label}</div>
              <div className="text-[7.5pt] text-slate-700 leading-snug mt-0.5">{f.text}</div>
            </div>
          ))}
        </div>

        <div className="px-3 py-1.5 border-b border-slate-300">
          <div className="flex gap-3">
            <Field label="ФИО сотрудника" w="basis-1/2" />
            <Field label="Подразделение" w="basis-1/4" />
            <Field label="Должность" w="basis-1/4" />
          </div>
          <div className="flex gap-3 mt-1.5">
            <Field label="Дата приёма" />
            <Field label="Дата увольнения" />
            <Field label="Стаж работы" />
            <Field label="Источник найма" w="basis-1/4" />
          </div>
          <div className="flex gap-3 mt-1.5">
            <Field label="Непосредственный руководитель" w="basis-1/2" />
            <Field label="Интервью провёл (ФИО, должность)" w="basis-1/2" />
          </div>
        </div>

        <div className="flex gap-2 px-3 py-1 bg-amber-50 border-b border-amber-300">
          <Icon name="Info" size={11} className="text-amber-600 shrink-0 mt-[2px]" />
          <span className="text-[7.5pt] text-amber-900 leading-snug">{survey.rule}</span>
        </div>

        <div>
          {survey.questions.map((q) => (
            <div key={q.n} className="border-b border-slate-200 print-keep">
              <div className="flex items-baseline gap-2 px-3 pt-1">
                <span className="text-[9.5pt] font-black text-slate-900">{q.n}.</span>
                <span className="text-[9.5pt] font-bold text-slate-900 leading-snug flex-1">{q.question}</span>
                <span className={`text-[7.5pt] font-bold uppercase shrink-0 ${t.text}`}>{LABEL_SHORT[q.type]}</span>
              </div>
              <div className="px-3 pl-7 text-[7.5pt] italic text-slate-500 leading-snug">{q.hint}</div>
              <div className="px-3 pl-7 py-0.5 grid grid-cols-2 gap-x-4 gap-y-[2px]">
                {q.options.map((o) => (
                  <div key={o} className="flex gap-1.5 items-start">
                    <span className="w-[10px] h-[10px] border border-slate-500 shrink-0 mt-[2px] bg-white" />
                    <span className="text-[8pt] text-slate-800 leading-snug">{o}</span>
                  </div>
                ))}
              </div>
              {q.type === 'Свободный ответ' && (
                <div className="px-3 pl-7 pb-1 space-y-[8px]">
                  <div className="border-b border-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-3 py-1.5">
          <div className="text-[8pt] font-bold text-slate-700">Комментарий специалиста, проводившего интервью</div>
          <div className="mt-1 space-y-[10px]">
            <div className="border-b border-slate-300" />
            <div className="border-b border-slate-300" />
          </div>
        </div>

        <div className="flex gap-6 px-3 pb-1.5">
          <Field label="Подпись сотрудника" w="basis-1/2" />
          <Field label="Подпись специалиста отдела кадров" w="basis-1/2" />
        </div>

        <div className={`${t.soft} border-t border-slate-300 px-3 py-0.5`}>
          <span className="text-[7pt] text-slate-600 leading-snug">Куда идут ответы: {survey.useData}</span>
        </div>
      </div>
    </div>
  );
}