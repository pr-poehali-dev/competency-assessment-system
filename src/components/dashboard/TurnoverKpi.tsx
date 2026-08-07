import Icon from '@/components/ui/icon';
import {
  DISM_2025,
  DISM_2026,
  TOTAL_2025,
  TOTAL_2026,
  TENURE,
  TENURE_2026,
  retentionBySource,
  pct,
} from '@/data/recruitment';

export default function TurnoverKpi() {
  const turnover2025 = pct(DISM_2025, TOTAL_2025);
  const turnover2026 = pct(DISM_2026, TOTAL_2026);
  const diff = turnover2026 - turnover2025;

  const best = retentionBySource[0];
  const worst = retentionBySource[retentionBySource.length - 1];
  const earlyShare = pct(TENURE[0].y2026, TENURE_2026);

  const cards = [
    {
      icon: 'UserMinus',
      value: DISM_2026.toString(),
      label: 'уволено в 2026 году',
      sub: `в 2025 — ${DISM_2025} чел.`,
      tone: 'text-slate-500',
    },
    {
      icon: 'Percent',
      value: `${turnover2026.toFixed(1)}%`,
      label: 'текучесть кадров',
      sub: `${diff > 0 ? '+' : ''}${diff.toFixed(1)} п.п. к 2025 (${turnover2025.toFixed(1)}%)`,
      tone: diff <= 0 ? 'text-emerald-600' : 'text-rose-600',
    },
    {
      icon: 'ThumbsUp',
      value: `${best.turnover.toFixed(1)}%`,
      label: `лучший канал: ${best.short}`,
      sub: `ушло ${best.fired} из ${best.hired} нанятых`,
      tone: 'text-emerald-600',
    },
    {
      icon: 'TriangleAlert',
      value: `${earlyShare.toFixed(0)}%`,
      label: 'уходят в первый год',
      sub: `худший канал: ${worst.short} — ${worst.turnover.toFixed(0)}%`,
      tone: 'text-rose-600',
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
