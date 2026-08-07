import Icon from '@/components/ui/icon';
import {
  AG_TOTAL_2025,
  AG_TOTAL_2026,
  AG_FIRED_2025,
  AG_TURNOVER_2025,
  EFIR,
  EFIR_SHARE_2026,
  AGENCIES,
} from '@/data/agencies';

export default function AgencyKpi() {
  const activeAgencies = AGENCIES.filter((a) => a.hired2026 > 0).length;

  const cards = [
    {
      icon: 'Users',
      tone: 'text-slate-700 bg-slate-100',
      value: AG_TOTAL_2026.toString(),
      label: 'нанято в 2026 году',
      sub: `${AG_TOTAL_2025} чел. в 2025 году`,
      subTone: 'text-slate-500',
    },
    {
      icon: 'Crown',
      tone: 'text-amber-700 bg-amber-100',
      value: `${EFIR_SHARE_2026.toFixed(0)}%`,
      label: 'доля КА ЭФИР в 2026',
      sub: `${EFIR.hired2026} из ${AG_TOTAL_2026} нанятых`,
      subTone: 'text-amber-600',
    },
    {
      icon: 'UserMinus',
      tone: 'text-rose-700 bg-rose-100',
      value: `${AG_TURNOVER_2025.toFixed(1)}%`,
      label: 'текучесть найма 2025',
      sub: `уволилось ${AG_FIRED_2025} из ${AG_TOTAL_2025}`,
      subTone: 'text-rose-600',
    },
    {
      icon: 'Building2',
      tone: 'text-sky-700 bg-sky-100',
      value: activeAgencies.toString(),
      label: 'агентства работают в 2026',
      sub: `из ${AGENCIES.length} в 2025 году`,
      subTone: 'text-sky-600',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 print-wide">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${c.tone}`}>
            <Icon name={c.icon} size={18} />
          </div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">{c.value}</div>
          <div className="text-sm text-slate-500 mt-1">{c.label}</div>
          <div className={`text-xs font-medium mt-2 ${c.subTone}`}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
