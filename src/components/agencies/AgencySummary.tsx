import Icon from '@/components/ui/icon';
import {
  AG_TOTAL_2025,
  AG_TOTAL_2026,
  AG_FIRED_2026,
  AG_TURNOVER_2025,
  AG_TURNOVER_2026,
  EFIR,
  EFIR_SHARE_2025,
  EFIR_SHARE_2026,
  EFIR_TURNOVER_2026,
  FAST_FIRED_2026,
  FIRED_TENURE,
  AGENCIES,
  MONTHLY,
  agPct,
} from '@/data/agencies';

export default function AgencySummary() {
  const done = MONTHLY.filter((m) => m.y2026 !== null).length;
  const sum2026 = MONTHLY.slice(0, done).reduce((s, m) => s + (m.y2026 ?? 0), 0);
  const same2025 = MONTHLY.slice(0, done).reduce((s, m) => s + m.y2025, 0);
  const paceDiff = sum2026 - same2025;

  const metrics = [
    {
      label: 'Нанято через агентства',
      value: AG_TOTAL_2026.toString(),
      prev: `${AG_TOTAL_2025} в 2025`,
      delta: `${paceDiff > 0 ? '+' : ''}${paceDiff} чел. за ${done} мес.`,
      good: false,
    },
    {
      label: 'Доля КА ЭФИР',
      value: `${EFIR_SHARE_2026.toFixed(0)}%`,
      prev: `${EFIR_SHARE_2025.toFixed(0)}% в 2025`,
      delta: `${EFIR.hired2026} из ${AG_TOTAL_2026} наймов`,
      good: false,
    },
    {
      label: 'Текучесть найма',
      value: `${AG_TURNOVER_2026.toFixed(1)}%`,
      prev: `${AG_TURNOVER_2025.toFixed(1)}% в 2025`,
      delta: `${(AG_TURNOVER_2026 - AG_TURNOVER_2025).toFixed(1)} п.п.`,
      good: true,
    },
    {
      label: 'Активных агентств',
      value: AGENCIES.filter((a) => a.hired2026 > 0).length.toString(),
      prev: `${AGENCIES.length} в 2025`,
      delta: 'зависимость от одного',
      good: false,
    },
  ];

  const findings = [
    {
      icon: 'Crown',
      title: 'Монополия одного поставщика',
      text: `КА ЭФИР закрывает ${EFIR_SHARE_2026.toFixed(0)}% найма через агентства (${EFIR.hired2026} из ${AG_TOTAL_2026} человек). Остальные подрядчики фактически не работают — это риск при срыве сроков или росте цен.`,
    },
    {
      icon: 'TrendingDown',
      title: 'Текучесть найма снизилась вдвое',
      text: `В 2026 году уволилось ${AG_FIRED_2026} из ${AG_TOTAL_2026} нанятых — ${AG_TURNOVER_2026.toFixed(1)}% против ${AG_TURNOVER_2025.toFixed(1)}% годом ранее. У КА ЭФИР показатель улучшился до ${EFIR_TURNOVER_2026.toFixed(1)}%.`,
    },
    {
      icon: 'Clock',
      title: 'Все потери — в первые полгода',
      text: `Ни один уволившийся не проработал года. ${agPct(FIRED_TENURE[0].y2026, AG_FIRED_2026).toFixed(0)}% ушли в первые три месяца, ${FAST_FIRED_2026} из ${AG_FIRED_2026} — за полгода. Проблема не в квалификации, а в ожиданиях при найме.`,
    },
    {
      icon: 'Target',
      title: 'Рекомендуемое действие',
      text: 'Ввести гарантийный срок замены кандидата в договоре с агентством и подключить второго подрядчика для страховки. Часть объёма перевести на реферальную программу.',
    },
  ];

  return (
    <section className="print-only print-block">
      <div className="border border-slate-300 rounded-xl overflow-hidden">
        <div className="bg-[#1a1a2e] text-white px-6 py-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Отчёт для руководства</div>
          <h2 className="text-2xl font-bold mt-1.5">Краткое резюме</h2>
          <p className="text-sm text-white/60 mt-1">
            Подбор через кадровые агентства · сравнение 2025 и 2026 годов
          </p>
        </div>

        <div className="grid grid-cols-4 gap-px bg-slate-200 border-b border-slate-200">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white p-4">
              <div className="text-[11px] text-slate-500 leading-snug h-8">{m.label}</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{m.value}</div>
              <div className="text-[10px] text-slate-400 mt-1">{m.prev}</div>
              <div className="text-[11px] font-semibold mt-1 text-slate-600">{m.delta}</div>
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
          <span>Источник: отчёты «Принятые сотрудники» за 2025 и 2026 годы</span>
        </div>
      </div>
    </section>
  );
}