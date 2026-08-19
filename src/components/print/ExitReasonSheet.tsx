import Icon from '@/components/ui/icon';
import type { ExitReasonSet } from '@/data/exitReasons';

const TONE = {
  amber: { bar: 'bg-amber-500', soft: 'bg-amber-50', chip: 'bg-amber-100 text-amber-900' },
  rose: { bar: 'bg-rose-600', soft: 'bg-rose-50', chip: 'bg-rose-100 text-rose-900' },
  sky: { bar: 'bg-sky-600', soft: 'bg-sky-50', chip: 'bg-sky-100 text-sky-900' },
};

export default function ExitReasonSheet({ set }: { set: ExitReasonSet }) {
  const t = TONE[set.color];
  const groups = [...new Set(set.reasons.map((r) => r.group))];

  return (
    <div className="bg-white">
      <div className="border border-slate-800">
        <div className={`${t.bar} px-3 py-1.5 flex items-start justify-between gap-3 text-white`}>
          <div>
            <div className="text-[8.5pt] uppercase tracking-[0.15em] opacity-90 leading-none">
              Концерн КРОСТ · справочник причин увольнения
            </div>
            <div className="text-[12pt] font-black leading-tight mt-0.5">
              {set.form}. {set.title}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[8.5pt] opacity-90 leading-none">причин</div>
            <div className="text-[14pt] font-black leading-none mt-0.5">{set.reasons.length}</div>
          </div>
        </div>

        <div className={`${t.soft} border-b border-slate-300 px-3 py-1`}>
          <p className="text-[8pt] text-slate-700 leading-snug">{set.intro}</p>
        </div>

        <div className="px-3 py-1 border-b border-slate-300 flex flex-wrap gap-1">
          {groups.map((g) => (
            <span key={g} className={`text-[7.5pt] font-bold px-1.5 py-[1px] rounded ${t.chip}`}>
              {g}
            </span>
          ))}
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="text-left px-1.5 py-1 text-[8pt] font-bold border border-slate-700 w-[8%]">Код</th>
              <th className="text-center px-1 py-1 text-[8pt] font-bold border border-slate-700 w-[5%]">✓</th>
              <th className="text-left px-1.5 py-1 text-[8pt] font-bold border border-slate-700 w-[30%]">
                Причина увольнения
              </th>
              <th className="text-left px-1.5 py-1 text-[8pt] font-bold border border-slate-700 w-[26%]">
                Когда ставить эту причину
              </th>
              <th className="text-left px-1.5 py-1 text-[8pt] font-bold border border-slate-700">
                Что делает компания по этой причине
              </th>
            </tr>
          </thead>
          <tbody>
            {set.reasons.map((r, i) => (
              <tr key={r.code} className={i % 2 ? t.soft : 'bg-white'}>
                <td className="px-1.5 py-[3px] text-[8pt] font-black text-slate-900 align-top border border-slate-300 whitespace-nowrap">
                  {r.code}
                </td>
                <td className="px-1 py-[3px] align-middle border border-slate-300 text-center">
                  <span className="inline-block w-[10px] h-[10px] border border-slate-500 bg-white" />
                </td>
                <td className="px-1.5 py-[3px] text-[8pt] align-top border border-slate-300 leading-snug">
                  <span className="font-bold text-slate-900">{r.name}</span>
                  {r.comment && (
                    <span className="text-[7pt] font-bold text-rose-700"> · нужен комментарий</span>
                  )}
                  <div className="text-[7pt] text-slate-500 leading-none mt-[1px]">{r.group}</div>
                </td>
                <td className="px-1.5 py-[3px] text-[8pt] text-slate-700 align-top border border-slate-300 leading-snug">
                  {r.when}
                </td>
                <td className="px-1.5 py-[3px] text-[8pt] text-slate-700 align-top border border-slate-300 leading-snug">
                  {r.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-2 px-3 py-1 bg-amber-50 border-t border-amber-300">
          <Icon name="Info" size={11} className="text-amber-600 shrink-0 mt-[2px]" />
          <span className="text-[7.5pt] text-amber-900 leading-snug">
            Причина одна, главная — та, без которой сотрудник бы остался. Код причины переносится в кадровую программу
            и в статистику текучести. Свободный ввод не допускается.
          </span>
        </div>

        <div className="flex gap-6 px-3 py-1.5">
          <div className="flex-1">
            <div className="text-[7.5pt] text-slate-500 leading-none">Код выбранной причины</div>
            <div className="border-b border-slate-400 h-[14px]" />
          </div>
          <div className="basis-1/2">
            <div className="text-[7.5pt] text-slate-500 leading-none">Комментарий (сумма, компания, срок возврата)</div>
            <div className="border-b border-slate-400 h-[14px]" />
          </div>
          <div className="basis-1/4">
            <div className="text-[7.5pt] text-slate-500 leading-none">Подпись кадровика</div>
            <div className="border-b border-slate-400 h-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
