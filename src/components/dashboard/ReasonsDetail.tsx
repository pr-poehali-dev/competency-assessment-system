import Icon from '@/components/ui/icon';
import { REASON_TOP, rPct } from '@/data/reasons';

export default function ReasonsDetail() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
      <h3 className="font-semibold text-slate-900 mb-1">Что стоит за каждой группой причин</h3>
      <p className="text-sm text-slate-500 mb-5">
        Реальные формулировки из кадровых документов и вывод для управления
      </p>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
              <th className="pb-2.5 font-medium">Группа причин</th>
              <th className="pb-2.5 font-medium text-right w-16">Всего</th>
              <th className="pb-2.5 font-medium text-right w-14">Доля</th>
              <th className="pb-2.5 font-medium text-right w-20">Сам ушёл</th>
              <th className="pb-2.5 font-medium text-right w-24">Уволили</th>
              <th className="pb-2.5 font-medium pl-4">Типичные формулировки</th>
            </tr>
          </thead>
          <tbody>
            {REASON_TOP.map((g) => (
              <tr key={g.key} className="border-b border-slate-100 align-top">
                <td className="py-3 pr-3">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0 mt-1" style={{ background: g.color }} />
                    <div>
                      <div className="font-medium text-slate-900 leading-tight">{g.label}</div>
                      <div
                        className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded ${
                          g.manageable ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {g.manageable ? 'управляемо' : 'вне контроля'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right font-semibold text-slate-900">{g.total}</td>
                <td className="py-3 text-right text-slate-500">{rPct(g.total).toFixed(1)}%</td>
                <td className="py-3 text-right text-slate-700">{g.emp}</td>
                <td className="py-3 text-right text-slate-700">{g.empr}</td>
                <td className="py-3 pl-4 text-slate-600 text-xs leading-relaxed">
                  {g.examples.map((e) => (
                    <div key={e.text}>
                      {e.text} <span className="text-slate-400">— {e.n}</span>
                    </div>
                  ))}
                  <div className="mt-1.5 text-slate-500 italic">{g.comment}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2.5 bg-slate-50 -mx-5 -mb-5 px-5 py-4 rounded-b-xl">
        <Icon name="Info" size={16} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600">
          В одной записи может быть указано несколько причин — они отнесены к основной по смыслу. Категории «сам ушёл»
          и «уволили» соответствуют отметке инициатора в кадровом документе.
        </p>
      </div>
    </div>
  );
}
