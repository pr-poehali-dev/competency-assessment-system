import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import KpiCards from '@/components/dashboard/KpiCards';
import SourcesChart from '@/components/dashboard/SourcesChart';
import GroupDonut from '@/components/dashboard/GroupDonut';
import SourcesTable from '@/components/dashboard/SourcesTable';
import { SOURCES, TOTAL_2025, TOTAL_2026, pct } from '@/data/recruitment';

export default function Dashboard() {
  const referral = SOURCES.find((s) => s.source === 'По рекомендации')!;
  const hh = SOURCES.find((s) => s.source === 'HeadHunter.ru')!;
  const agency = SOURCES.find((s) => s.source === 'Кадровое агентство')!;

  const insights = [
    {
      icon: 'Award',
      tone: 'emerald',
      title: 'Рекомендации — главный канал',
      text: `${pct(referral.y2026, TOTAL_2026).toFixed(0)}% всех наймов в 2026 году приходит по рекомендациям сотрудников. Это самый дешёвый и качественный источник.`,
    },
    {
      icon: 'Globe',
      tone: 'sky',
      title: 'HeadHunter удерживает позиции',
      text: `Доля HeadHunter стабильна — около ${pct(hh.y2026, TOTAL_2026).toFixed(0)}% найма. Остальные job-сайты практически не дают результата.`,
    },
    {
      icon: 'Wallet',
      tone: 'amber',
      title: 'Кадровые агентства — зона экономии',
      text: `Агентства закрывают ${pct(agency.y2026, TOTAL_2026).toFixed(0)}% вакансий. Усиление реферальной программы позволит сократить эти расходы.`,
    },
  ];

  const toneMap: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    sky: 'bg-sky-50 border-sky-200 text-sky-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center">
              <Icon name="ChartColumnBig" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">Аналитика HR</div>
              <div className="font-semibold text-slate-900 leading-tight">Источники подбора персонала</div>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
          >
            <Icon name="GitBranch" size={16} />
            <span className="hidden sm:inline">Блок-схема найма</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Дашборд подбора персонала</h1>
          <p className="text-slate-500 mt-2">
            Сравнение эффективности каналов найма за 2025 и 2026 годы. Всего обработано{' '}
            {(TOTAL_2025 + TOTAL_2026).toLocaleString('ru-RU')} наймов.
          </p>
        </div>

        <KpiCards />

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <SourcesChart />
          </div>
          <div className="lg:col-span-2">
            <GroupDonut />
          </div>
        </div>

        <SourcesTable />

        <div>
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Icon name="Lightbulb" size={18} className="text-amber-500" />
            Ключевые выводы
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {insights.map((i) => (
              <div key={i.title} className={`rounded-xl border p-5 ${toneMap[i.tone]}`}>
                <Icon name={i.icon} size={20} className="mb-3" />
                <div className="font-semibold mb-2">{i.title}</div>
                <p className="text-sm opacity-90 leading-relaxed">{i.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 font-mono pt-4 border-t border-slate-200">
          Источник данных: внутренняя отчётность отдела подбора персонала · 2025–2026
        </p>
      </main>
    </div>
  );
}
