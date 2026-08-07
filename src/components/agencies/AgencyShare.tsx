import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import Icon from '@/components/ui/icon';
import { AGENCIES, AG_TOTAL_2025, AG_TOTAL_2026, agPct } from '@/data/agencies';

const data = AGENCIES.map((a) => ({
  name: a.short,
  full: a.name,
  y2025: a.hired2025,
  y2026: a.hired2026,
  color: a.color,
}));

function ShareTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
      <div className="font-semibold text-slate-900 mb-1.5">{d.full}</div>
      <div className="text-slate-600">
        2025: {d.y2025} чел. ({agPct(d.y2025, AG_TOTAL_2025).toFixed(1)}%)
      </div>
      <div className="text-slate-900 font-semibold">
        2026: {d.y2026} чел. ({agPct(d.y2026, AG_TOTAL_2026).toFixed(1)}%)
      </div>
    </div>
  );
}

export default function AgencyShare() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
      <h3 className="font-semibold text-slate-900 mb-1">Найм по агентствам</h3>
      <p className="text-sm text-slate-500 mb-3">Сколько человек привело каждое агентство</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-300 shrink-0" />
          <span className="text-xs text-slate-600">2025 год</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#1a1a2e] shrink-0" />
          <span className="text-xs text-slate-600">2026 год</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 4, right: 40, top: 4, bottom: 4 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" fontSize={11} />
          <YAxis type="category" dataKey="name" width={92} stroke="#64748b" fontSize={10} interval={0} tickMargin={4} />
          <Tooltip content={<ShareTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="y2025" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={11}>
            <LabelList dataKey="y2025" position="right" fontSize={10} fill="#94a3b8" />
          </Bar>
          <Bar dataKey="y2026" radius={[0, 4, 4, 0]} barSize={11}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.name === 'ЭФИР' ? '#f59e0b' : '#1a1a2e'} />
            ))}
            <LabelList dataKey="y2026" position="right" fontSize={10} fontWeight={700} fill="#1a1a2e" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 flex items-start gap-2">
        <Icon name="Crown" size={14} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-900 leading-relaxed">
          КА ЭФИР — практически монопольный поставщик: {agPct(AGENCIES[0].hired2026, AG_TOTAL_2026).toFixed(0)}% всего
          найма через агентства в 2026 году. Остальные агентства закрыли единичные вакансии.
        </p>
      </div>
    </div>
  );
}