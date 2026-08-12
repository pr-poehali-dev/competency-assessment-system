import Icon from '@/components/ui/icon';
import {
  REASONS_TOTAL,
  REASONS_BY_EMPLOYEE,
  REASON_GROUPS,
  MANAGEABLE_TOTAL,
  rPct,
} from '@/data/reasons';

const g = (k: string) => REASON_GROUPS.find((x) => x.key === k)!;

export default function ReasonsKpi() {
  const cards = [
    {
      icon: 'ClipboardList' as const,
      value: REASONS_TOTAL.toLocaleString('ru-RU'),
      label: 'увольнений с указанной причиной',
      sub: `${rPct(REASONS_BY_EMPLOYEE).toFixed(0)}% — по инициативе самого сотрудника`,
      tone: 'bg-slate-50 border-slate-200 text-slate-700',
      accent: 'text-slate-500',
    },
    {
      icon: 'LogOut' as const,
      value: `${rPct(g('other_job').total).toFixed(0)}%`,
      label: 'ушли к другому работодателю',
      sub: `${g('other_job').total} человек нашли работу в другом месте`,
      tone: 'bg-rose-50 border-rose-200 text-rose-800',
      accent: 'text-rose-500',
    },
    {
      icon: 'Sliders' as const,
      value: `${rPct(MANAGEABLE_TOTAL).toFixed(0)}%`,
      label: 'причин управляемы компанией',
      sub: `${MANAGEABLE_TOTAL} из ${REASONS_TOTAL} уходов можно было предотвратить`,
      tone: 'bg-amber-50 border-amber-200 text-amber-800',
      accent: 'text-amber-500',
    },
    {
      icon: 'HelpCircle' as const,
      value: `${rPct(g('nospec').total).toFixed(0)}%`,
      label: 'причина не выяснена',
      sub: `${g('nospec').total} записей вида «собственное желание»`,
      tone: 'bg-slate-50 border-slate-200 text-slate-700',
      accent: 'text-slate-400',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 print-wide">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-xl border p-5 shadow-sm print-block ${c.tone}`}>
          <Icon name={c.icon} size={20} className={`mb-3 ${c.accent}`} />
          <div className="text-3xl font-bold leading-none">{c.value}</div>
          <div className="text-sm font-medium mt-2">{c.label}</div>
          <div className="text-xs opacity-70 mt-1.5 leading-snug">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
