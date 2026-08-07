import Icon from '@/components/ui/icon';
import { SOURCES, TOTAL_2025, TOTAL_2026, pct } from '@/data/recruitment';

export default function KpiCards() {
  const top2026 = [...SOURCES].sort((a, b) => b.y2026 - a.y2026)[0];
  const freeShare2026 =
    pct(SOURCES.filter((s) => s.group === 'referral' || s.group === 'internal').reduce((s, r) => s + r.y2026, 0), TOTAL_2026);
  const paidShare2026 =
    pct(SOURCES.filter((s) => s.group === 'agency' || s.group === 'jobboard').reduce((s, r) => s + r.y2026, 0), TOTAL_2026);

  const delta = TOTAL_2026 - TOTAL_2025;
  const deltaPct = (delta / TOTAL_2025) * 100;

  const cards = [
    {
      icon: 'Users',
      value: TOTAL_2026.toLocaleString('ru-RU'),
      label: 'нанято в 2026 году',
      sub: `${delta > 0 ? '+' : ''}${delta} чел. (${deltaPct.toFixed(0)}%) к 2025`,
      tone: delta >= 0 ? 'text-emerald-600' : 'text-rose-600',
    },
    {
      icon: 'History',
      value: TOTAL_2025.toLocaleString('ru-RU'),
      label: 'нанято в 2025 году',
      sub: 'базовый период сравнения',
      tone: 'text-slate-500',
    },
    {
      icon: 'Trophy',
      value: `${pct(top2026.y2026, TOTAL_2026).toFixed(0)}%`,
      label: `лидер: ${top2026.short}`,
      sub: `${top2026.y2026} чел. из ${TOTAL_2026}`,
      tone: 'text-emerald-600',
    },
    {
      icon: 'PiggyBank',
      value: `${freeShare2026.toFixed(0)}%`,
      label: 'бесплатные каналы',
      sub: `платные каналы — ${paidShare2026.toFixed(0)}%`,
      tone: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <Icon name={c.icon} size={20} className="text-slate-400 mb-3" />
          <div className="text-3xl font-bold text-slate-900 tabular-nums">{c.value}</div>
          <div className="text-sm text-slate-600 mt-1">{c.label}</div>
          <div className={`text-xs mt-2 font-medium ${c.tone}`}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
