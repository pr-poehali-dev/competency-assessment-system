import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import KpiCards from '@/components/dashboard/KpiCards';
import SourcesChart from '@/components/dashboard/SourcesChart';
import GroupDonut from '@/components/dashboard/GroupDonut';
import SourcesTable from '@/components/dashboard/SourcesTable';
import TurnoverKpi from '@/components/dashboard/TurnoverKpi';
import TenureChart from '@/components/dashboard/TenureChart';
import HireVsFire from '@/components/dashboard/HireVsFire';
import EarlyTurnover from '@/components/dashboard/EarlyTurnover';
import UnstableChannels from '@/components/dashboard/UnstableChannels';
import {
  SOURCES,
  TOTAL_2025,
  TOTAL_2026,
  DISM_2025,
  DISM_2026,
  TENURE,
  TENURE_2026,
  retentionBySource,
  pct,
} from '@/data/recruitment';

function SectionTitle({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 pt-4">
      <div className="w-9 h-9 rounded-lg bg-[#1a1a2e] flex items-center justify-center shrink-0">
        <Icon name={icon} size={18} className="text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 leading-tight">{title}</h2>
        <p className="text-sm text-slate-500">{sub}</p>
      </div>
      <div className="flex-1 h-px bg-slate-200 ml-2" />
    </div>
  );
}

export default function Dashboard() {
  const referral = SOURCES.find((s) => s.source === 'По рекомендации')!;
  const hh = SOURCES.find((s) => s.source === 'HeadHunter.ru')!;
  const agency = SOURCES.find((s) => s.source === 'Кадровое агентство')!;
  const best = retentionBySource[0];

  const handlePrint = () => {
    const prev = document.title;
    const d = new Date();
    const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    document.title = `Отчёт по подбору и текучести персонала ${stamp}`;
    window.addEventListener('afterprint', () => (document.title = prev), { once: true });
    window.print();
  };

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
    {
      icon: 'TriangleAlert',
      tone: 'rose',
      title: 'Первый год — критическая зона',
      text: `${pct(TENURE[0].y2026, TENURE_2026).toFixed(0)}% всех увольнений приходится на сотрудников со стажем менее года. Программа адаптации новичков даст максимальный эффект.`,
    },
    {
      icon: 'ShieldCheck',
      tone: 'violet',
      title: `Самый устойчивый канал — ${best.short}`,
      text: `Текучесть ${best.turnover.toFixed(1)}%: ушло ${best.fired} из ${best.hired} нанятых. Стоит наращивать объём найма через этот источник.`,
    },
    {
      icon: 'TrendingDown',
      tone: 'sky',
      title: 'Текучесть снижается',
      text: `В 2026 году уволилось ${DISM_2026} человек — это ${pct(DISM_2026, TOTAL_2026).toFixed(1)}% от нанятых против ${pct(DISM_2025, TOTAL_2025).toFixed(1)}% годом ранее.`,
    },
  ];

  const toneMap: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    sky: 'bg-sky-50 border-sky-200 text-sky-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    violet: 'bg-violet-50 border-violet-200 text-violet-700',
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
              <div className="font-semibold text-slate-900 leading-tight">Подбор и текучесть персонала</div>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
            >
              <Icon name="GitBranch" size={16} />
              <span className="hidden sm:inline">Блок-схема найма</span>
            </Link>
            <button
              onClick={handlePrint}
              title="Откроется окно печати — выберите «Сохранить как PDF»"
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1a1a2e] rounded-lg px-4 py-2 hover:bg-[#2d2d4a] transition-colors"
            >
              <Icon name="FileDown" size={16} />
              <span className="hidden sm:inline">Скачать PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Дашборд подбора и текучести персонала</h1>
          <p className="text-slate-500 mt-2">
            Эффективность каналов найма и удержание сотрудников за 2025–2026 годы. Всего{' '}
            {(TOTAL_2025 + TOTAL_2026).toLocaleString('ru-RU')} наймов и{' '}
            {(DISM_2025 + DISM_2026).toLocaleString('ru-RU')} увольнений.
          </p>
          <p className="print-only text-xs text-slate-400 mt-3 pt-3 border-t border-slate-200">
            Отчёт сформирован {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}Отдел подбора персонала
          </p>
        </div>

        <SectionTitle icon="UserPlus" title="Подбор персонала" sub="Откуда приходят сотрудники" />
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

        <div className="print-page-break" />
        <SectionTitle
          icon="UserMinus"
          title="Текучесть кадров"
          sub="Кто и когда увольняется, какие каналы дают устойчивый персонал"
        />
        <TurnoverKpi />

        <div className="grid lg:grid-cols-2 gap-6">
          <TenureChart />
          <HireVsFire />
        </div>

        <EarlyTurnover />

        <UnstableChannels />

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