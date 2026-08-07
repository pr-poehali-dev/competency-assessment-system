import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import Icon from '@/components/ui/icon';
import { SOURCES, DISMISSALS } from '@/data/recruitment';

const data = [...SOURCES]
  .filter((s) => s.y2026 >= 10)
  .sort((a, b) => b.y2026 - a.y2026)
  .map((s) => {
    const fired = DISMISSALS.find((d) => d.source === s.source)?.y2026 ?? 0;
    return {
      name: s.short,
      Принято: s.y2026,
      Уволено: fired,
      Осталось: s.y2026 - fired,
    };
  });

export default function HireVsFire() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
      <h3 className="font-semibold text-slate-900 mb-1">Найм и увольнения по каналам, 2026</h3>
      <p className="text-sm text-slate-500 mb-3">Сколько человек пришло, ушло и осталось работать</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#1a1a2e] shrink-0" />
          <span className="text-xs text-slate-600">Принято</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#dc2626] shrink-0" />
          <span className="text-xs text-slate-600">Уволено</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative w-5 shrink-0 border-t-2 border-[#16a34a]">
            <span className="absolute left-1/2 -translate-x-1/2 -top-[3px] w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
          </span>
          <span className="text-xs text-slate-600">Осталось работать</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={330}>
        <ComposedChart data={data} margin={{ top: 22, right: 8, bottom: 46 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={11}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
            tickMargin={6}
          />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            formatter={(v: number) => [`${v} чел.`, '']}
          />
          <Bar dataKey="Принято" fill="#1a1a2e" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="Принято" position="top" fontSize={11} fontWeight={600} fill="#1a1a2e" />
          </Bar>
          <Bar dataKey="Уволено" fill="#dc2626" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="Уволено" position="top" fontSize={11} fontWeight={600} fill="#dc2626" />
          </Bar>
          <Line type="monotone" dataKey="Осталось" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: '#16a34a' }} />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-3">
        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Icon name="Info" size={13} className="text-slate-400" />
          Как читать график
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#1a1a2e] shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-slate-700">Тёмный столбик — принято</div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Сколько человек нанято через канал за 2026 год
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#dc2626] shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-slate-700">Красный столбик — уволено</div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Сколько из нанятых уже покинули компанию
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-3.5 shrink-0 mt-2 border-t-2 border-[#16a34a]" />
            <div>
              <div className="text-[11px] font-semibold text-slate-700">Зелёная линия — осталось работать</div>
              <div className="text-[11px] text-slate-500 leading-snug">Реальный результат канала: принято минус уволено</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3 space-y-2">
          <div className="flex items-start gap-2">
            <Icon name="CircleCheck" size={14} className="text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-[11px] text-slate-600 leading-snug">
              <strong className="text-emerald-700">Зелёная линия близко к тёмному столбику</strong> — канал работает
              хорошо, почти все нанятые остались
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="CircleAlert" size={14} className="text-rose-600 mt-0.5 shrink-0" />
            <div className="text-[11px] text-slate-600 leading-snug">
              <strong className="text-rose-700">Высокий красный столбик</strong> — канал приводит людей, которые быстро
              уходят: подбор приходится повторять
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 leading-snug">
          В график включены каналы с наймом от 10 человек. Наведите курсор на столбик, чтобы увидеть точные цифры.
        </div>
      </div>
    </div>
  );
}