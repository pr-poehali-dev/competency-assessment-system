import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import ExitFormSheet from '@/components/print/ExitFormSheet';
import { EXIT_SURVEYS, EXIT_ROUTER, EXIT_COMMON } from '@/data/exitSurveys';

const BADGE = ['text-amber-800 bg-amber-100', 'text-rose-800 bg-rose-100', 'text-sky-800 bg-sky-100'];

export default function ExitForms() {
  const total = EXIT_SURVEYS.reduce((s, k) => s + k.questions.length, 0);

  return (
    <div className="min-h-screen bg-slate-100 exit-forms-page">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="max-w-[1000px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/krost-logo.png" alt="Концерн КРОСТ" className="h-8 w-auto shrink-0 object-contain" />
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">Отдел кадров</div>
              <div className="font-semibold text-slate-900 leading-tight">Бланки выходного интервью</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
            >
              <Icon name="ClipboardList" size={16} />
              <span className="hidden sm:inline">План работы</span>
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1a1a2e] rounded-lg px-4 py-2 hover:bg-[#2d2d4a] transition-colors"
            >
              <Icon name="Printer" size={16} />
              <span>Печать бланков</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-6 space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 no-print">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center shrink-0">
              <Icon name="Printer" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Три бланка выходного интервью, готовые к печати
              </h1>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Нажмите «Печать бланков» — выйдет 4 листа A4: памятка по выбору типа увольнения и три анкеты, каждая на
                отдельном листе. Печатайте нужную анкету по ситуации или сразу весь комплект в папку кадровика. Всего{' '}
                {total} вопросов.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {EXIT_SURVEYS.map((s, i) => (
                  <span key={s.key} className={`text-xs font-semibold px-2 py-1 rounded ${BADGE[i]}`}>
                    {s.code} · {s.short} — {s.questions.length} вопросов
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="exit-form">
          <div className="border border-slate-800 bg-white">
            <div className="bg-[#1a1a2e] text-white px-3 py-2">
              <div className="text-[8.5pt] uppercase tracking-[0.15em] opacity-80 leading-none">
                Концерн КРОСТ · отдел кадров
              </div>
              <div className="text-[14pt] font-black leading-tight mt-1">
                Памятка кадровику: какую анкету заполнять
              </div>
            </div>

            <div className="px-3 py-2 border-b border-slate-300">
              <div className="text-[10pt] font-bold text-slate-900">{EXIT_ROUTER.title}</div>
              <p className="text-[8.5pt] text-slate-600 leading-snug mt-1">{EXIT_ROUTER.intro}</p>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="text-left px-2 py-1.5 text-[8.5pt] font-bold border border-slate-700 w-[22%]">
                    Тип текучести
                  </th>
                  <th className="text-left px-2 py-1.5 text-[8.5pt] font-bold border border-slate-700">
                    Когда выбирать этот тип
                  </th>
                  <th className="text-left px-2 py-1.5 text-[8.5pt] font-bold border border-slate-700">
                    Что хотим узнать
                  </th>
                  <th className="text-center px-2 py-1.5 text-[8.5pt] font-bold border border-slate-700 w-[11%]">
                    Анкета
                  </th>
                </tr>
              </thead>
              <tbody>
                {EXIT_ROUTER.rows.map((r, i) => (
                  <tr key={r.kind}>
                    <td className="px-2 py-1.5 text-[8.5pt] font-bold text-slate-900 align-top border border-slate-300">
                      {r.kind}
                    </td>
                    <td className="px-2 py-1.5 text-[8.5pt] text-slate-700 align-top border border-slate-300 leading-snug">
                      {r.when}
                    </td>
                    <td className="px-2 py-1.5 text-[8.5pt] text-slate-700 align-top border border-slate-300 leading-snug">
                      {r.goal}
                    </td>
                    <td
                      className={`px-2 py-1.5 text-[9pt] font-black text-center align-middle border border-slate-300 ${BADGE[i]}`}
                    >
                      {r.form}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-2 px-3 py-2 bg-amber-50 border-y border-amber-300">
              <Icon name="TriangleAlert" size={12} className="text-amber-600 shrink-0 mt-[2px]" />
              <span className="text-[8.5pt] text-amber-900 leading-snug">{EXIT_ROUTER.warning}</span>
            </div>

            <div className="px-3 py-2 border-b border-slate-300">
              <div className="text-[10pt] font-bold text-slate-900">{EXIT_COMMON.title}</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-[3px] mt-1.5">
                {EXIT_COMMON.fields.map((f) => (
                  <div key={f} className="flex gap-1.5 items-start">
                    <span className="w-[10px] h-[10px] border border-slate-500 shrink-0 mt-[2px] bg-white" />
                    <span className="text-[8.5pt] text-slate-800 leading-snug">{f}</span>
                  </div>
                ))}
              </div>
              <p className="text-[8pt] italic text-slate-500 leading-snug mt-1.5">{EXIT_COMMON.note}</p>
            </div>

            <div className="px-3 py-2">
              <div className="text-[10pt] font-bold text-slate-900">Порядок работы</div>
              <ol className="mt-1.5 space-y-1">
                {[
                  'До разговора: вместе с руководителем подразделения определите тип увольнения по таблице выше и возьмите нужный бланк.',
                  'Заполните шапку бланка. Стаж и источник найма обязательны — без них не посчитать, какой канал подбора даёт ранние уходы.',
                  'Проведите разговор и отметьте галочками то, что сказал сотрудник. Формулировка «собственное желание» причиной не является.',
                  'Анкета Б заполняется без присутствия непосредственного руководителя — иначе про руководителя правду не скажут.',
                  'Подпишите бланк с сотрудником до выдачи документов и передайте копию в отдел подбора в тот же день.',
                ].map((step, i) => (
                  <li key={step} className="flex gap-2">
                    <span className="w-[15px] h-[15px] rounded-full bg-slate-800 text-white text-[7.5pt] font-bold flex items-center justify-center shrink-0 mt-[1px]">
                      {i + 1}
                    </span>
                    <span className="text-[8.5pt] text-slate-800 leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-slate-100 border-t border-slate-300 px-3 py-1">
              <span className="text-[7.5pt] text-slate-600">
                Комплект бланков: {EXIT_SURVEYS.map((s) => `${s.code} — ${s.short} (${s.questions.length})`).join('; ')}.
                Всего {total} вопросов.
              </span>
            </div>
          </div>
        </div>

        {EXIT_SURVEYS.map((s, i) => (
          <ExitFormSheet key={s.key} survey={s} index={i + 1} />
        ))}
      </main>
    </div>
  );
}
