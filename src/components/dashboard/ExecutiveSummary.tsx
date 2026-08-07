import Icon from '@/components/ui/icon';
import {
  TOTAL_2025,
  TOTAL_2026,
  DISM_2025,
  DISM_2026,
  TENURE,
  TENURE_2026,
  GROUPED,
  channelRisk,
  pct,
} from '@/data/recruitment';

const real = channelRisk.filter((c) => c.hired >= 10 && c.group !== 'unknown');
const worst = real[0];
const best = real[real.length - 1];

export default function ExecutiveSummary() {
  const turn2025 = pct(DISM_2025, TOTAL_2025);
  const turn2026 = pct(DISM_2026, TOTAL_2026);
  const hireDiff = TOTAL_2026 - TOTAL_2025;
  const referral = GROUPED.find((g) => g.group === 'referral')!;
  const agency = GROUPED.find((g) => g.group === 'agency')!;
  const earlyShare = pct(TENURE[0].y2026, TENURE_2026);
  const freeGroups = GROUPED.filter((g) => ['referral', 'internal', 'opp'].includes(g.group));
  const free2026 = freeGroups.reduce((s, g) => s + g.y2026, 0);
  const free2025 = freeGroups.reduce((s, g) => s + g.y2025, 0);

  const metrics = [
    {
      label: 'Нанято сотрудников',
      value: TOTAL_2026.toLocaleString('ru-RU'),
      prev: `${TOTAL_2025.toLocaleString('ru-RU')} в 2025`,
      delta: `${hireDiff > 0 ? '+' : ''}${hireDiff} чел. (${pct(hireDiff, TOTAL_2025).toFixed(0)}%)`,
      good: false,
    },
    {
      label: 'Уволилось сотрудников',
      value: DISM_2026.toLocaleString('ru-RU'),
      prev: `${DISM_2025.toLocaleString('ru-RU')} в 2025`,
      delta: `${DISM_2026 - DISM_2025} чел.`,
      good: true,
    },
    {
      label: 'Текучесть кадров',
      value: `${turn2026.toFixed(1)}%`,
      prev: `${turn2025.toFixed(1)}% в 2025`,
      delta: `${(turn2026 - turn2025).toFixed(1)} п.п.`,
      good: true,
    },
    {
      label: 'Доля бесплатных каналов',
      value: `${pct(free2026, TOTAL_2026).toFixed(0)}%`,
      prev: `${pct(free2025, TOTAL_2025).toFixed(0)}% в 2025`,
      delta: 'без затрат на подбор',
      good: true,
    },
  ];

  const findings = [
    {
      icon: 'Award',
      title: 'Рекомендации — основной канал найма',
      text: `${pct(referral.y2026, TOTAL_2026).toFixed(0)}% сотрудников пришли по рекомендациям и как ранее работавшие. Канал бесплатный и даёт самую низкую текучесть — ${best.turnover.toFixed(1)}%.`,
    },
    {
      icon: 'TriangleAlert',
      title: 'Кадровые агентства — низкое качество при высокой цене',
      text: `Текучесть ${worst.turnover.toFixed(1)}% — выше средней по компании. Из ${worst.hired} нанятых через агентства уволилось ${worst.fired} человек.`,
    },
    {
      icon: 'Clock',
      title: 'Первый год — критическая зона',
      text: `${earlyShare.toFixed(0)}% всех увольнений приходится на сотрудников со стажем менее года. Адаптация новичков — главный резерв снижения текучести.`,
    },
    {
      icon: 'Target',
      title: 'Рекомендуемое действие',
      text: `Перевод части найма с агентств (${agency.y2026} чел. в 2026) на реферальную программу сократит расходы на подбор и снизит текучесть.`,
    },
  ];

  return (
    <section className="print-only print-block">
      <div className="border border-slate-300 rounded-xl overflow-hidden">
        <div className="bg-[#1a1a2e] text-white px-6 py-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">
            Отчёт для руководства
          </div>
          <h2 className="text-2xl font-bold mt-1.5">Краткое резюме</h2>
          <p className="text-sm text-white/60 mt-1">
            Подбор и текучесть персонала · сравнение 2025 и 2026 годов
          </p>
        </div>

        <div className="grid grid-cols-4 gap-px bg-slate-200 border-b border-slate-200">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white p-4">
              <div className="text-[11px] text-slate-500 leading-snug h-8">{m.label}</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{m.value}</div>
              <div className="text-[10px] text-slate-400 mt-1">{m.prev}</div>
              <div className={`text-[11px] font-semibold mt-1 ${m.good ? 'text-emerald-600' : 'text-slate-600'}`}>
                {m.delta}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 p-5">
          {findings.map((f) => (
            <div key={f.title} className="flex gap-3">
              <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                <Icon name={f.icon} size={14} className="text-slate-600" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-900 leading-snug">{f.title}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{f.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-[10px] text-slate-500">
          <span>
            Отчёт сформирован{' '}
            {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span>Источник: внутренняя отчётность отдела подбора персонала</span>
        </div>
      </div>
    </section>
  );
}