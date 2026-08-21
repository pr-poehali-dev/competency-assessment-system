import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { printReport, applyPrintFormat, type PageFormat } from '@/lib/print';
import { exportHrAnalyticToExcel } from '@/lib/hrAnalyticSheet';
import PrintCover, { type CoverSection } from '@/components/print/PrintCover';
import PdfProgress, { type PdfState } from '@/components/print/PdfProgress';
import ReportToc from '@/components/print/ReportToc';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import KpiCards from '@/components/dashboard/KpiCards';
import SourcesChart from '@/components/dashboard/SourcesChart';
import GroupDonut from '@/components/dashboard/GroupDonut';
import SourcesTable from '@/components/dashboard/SourcesTable';
import TurnoverKpi from '@/components/dashboard/TurnoverKpi';
import TenureChart from '@/components/dashboard/TenureChart';
import HireVsFire from '@/components/dashboard/HireVsFire';
import EarlyTurnover from '@/components/dashboard/EarlyTurnover';
import UnstableChannels from '@/components/dashboard/UnstableChannels';
import ExecutiveSummary from '@/components/dashboard/ExecutiveSummary';
import ReasonsKpi from '@/components/dashboard/ReasonsKpi';
import ReasonsChart from '@/components/dashboard/ReasonsChart';
import ReasonsControllable from '@/components/dashboard/ReasonsControllable';
import ReasonsByTenure from '@/components/dashboard/ReasonsByTenure';
import ReasonsByUnit from '@/components/dashboard/ReasonsByUnit';
import ReasonsDetail from '@/components/dashboard/ReasonsDetail';
import ReasonsActions from '@/components/dashboard/ReasonsActions';
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

const SECTIONS: CoverSection[] = [
  { id: 'summary', title: 'Главное за два года', sub: 'Краткая сводка для руководителя' },
  { id: 'hiring', title: 'Подбор персонала', sub: 'Откуда приходят сотрудники' },
  { id: 'turnover', title: 'Текучесть кадров', sub: 'Кто и когда увольняется' },
  { id: 'reasons', title: 'Причины увольнения', sub: 'Почему уходят и что можно изменить' },
  { id: 'insights', title: 'Ключевые выводы', sub: 'Что делать дальше' },
];

function SectionTitle({ id, icon, title, sub }: { id: string; icon: string; title: string; sub: string }) {
  return (
    <div id={id} className="flex items-center gap-3 pt-4 scroll-mt-24">
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

  const [pdf, setPdf] = useState<PdfState>(null);

  const handlePrint = async (format: PageFormat) => {
    setPdf({ percent: 0, label: 'Готовлю отчёт', format });
    try {
      await printReport(format, 'Отчёт по подбору и текучести персонала', (percent, label) =>
        setPdf({ percent, label, format }),
      );
    } finally {
      setTimeout(() => setPdf(null), 600);
    }
  };

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('print');
    if (p === 'A3' || p === 'A4') applyPrintFormat(p);
  }, []);

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
      <PdfProgress state={pdf} />
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/krost-logo.png" alt="Концерн КРОСТ" className="h-8 w-auto shrink-0 object-contain" />
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">Аналитика HR</div>
              <div className="font-semibold text-slate-900 leading-tight">Подбор и текучесть персонала</div>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-lg px-3 py-2 hover:bg-emerald-100 transition-colors"
            >
              <Icon name="ClipboardList" size={16} />
              <span className="hidden sm:inline">План работы</span>
            </Link>
            <Link
              to="/agencies"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 border border-amber-200 bg-amber-50 rounded-lg px-3 py-2 hover:bg-amber-100 transition-colors"
            >
              <Icon name="Handshake" size={16} />
              <span className="hidden sm:inline">Кадровые агентства</span>
            </Link>
            <Link
              to="/flowchart"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
            >
              <Icon name="GitBranch" size={16} />
              <span className="hidden sm:inline">Блок-схема оценки рабочих</span>
            </Link>
            <button
              onClick={() => void exportHrAnalyticToExcel()}
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 border border-emerald-200 bg-white rounded-lg px-3 py-2 hover:bg-emerald-50 transition-colors"
            >
              <Icon name="Table" size={16} />
              <span className="hidden sm:inline">Скачать Excel</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1a1a2e] rounded-lg px-4 py-2 hover:bg-[#2d2d4a] transition-colors">
                  <Icon name="FileDown" size={16} />
                  <span className="hidden sm:inline">Скачать PDF</span>
                  <Icon name="ChevronDown" size={14} className="opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Формат страницы</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handlePrint('A4')} className="gap-3 py-2.5 cursor-pointer">
                  <Icon name="FileText" size={18} className="text-slate-500 shrink-0" />
                  <div>
                    <div className="font-medium">Формат A4</div>
                    <div className="text-xs text-slate-500 mt-0.5">Обычный лист — для рассылки и чтения с экрана</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePrint('A3')} className="gap-3 py-2.5 cursor-pointer">
                  <Icon name="Files" size={18} className="text-slate-500 shrink-0" />
                  <div>
                    <div className="font-medium">Формат A3</div>
                    <div className="text-xs text-slate-500 mt-0.5">Крупный лист — для распечатки и презентаций</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-2 text-[11px] text-slate-400 leading-relaxed">
                  Файл скачается сразу, с уже заданным размером листа. Ничего настраивать в окне печати не нужно.
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <PrintCover
          eyebrow="Аналитика HR"
          title="Подбор и текучесть персонала"
          subtitle="Эффективность каналов найма и удержание сотрудников за 2025–2026 годы"
          icon="ChartColumnBig"
          accent="#1a1a2e"
          facts={[
            { value: (TOTAL_2025 + TOTAL_2026).toLocaleString('ru-RU'), label: 'наймов за два года' },
            { value: (DISM_2025 + DISM_2026).toLocaleString('ru-RU'), label: 'увольнений за два года' },
            { value: TOTAL_2026.toLocaleString('ru-RU'), label: 'наймов в 2026 году' },
          ]}
          sections={SECTIONS}
          note="Источник данных: внутренняя отчётность отдела подбора персонала Концерна КРОСТ за 2025–2026 годы. Данные за 2026 год приведены на дату формирования отчёта."
        />

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Дашборд подбора и текучести персонала</h1>
          <p className="text-slate-500 mt-2">
            Эффективность каналов найма и удержание сотрудников за 2025–2026 годы. Всего{' '}
            {(TOTAL_2025 + TOTAL_2026).toLocaleString('ru-RU')} наймов и{' '}
            {(DISM_2025 + DISM_2026).toLocaleString('ru-RU')} увольнений.
          </p>
        </div>

        <ReportToc sections={SECTIONS} accent="#1a1a2e" />

        <div id="summary" className="scroll-mt-24" />
        <ExecutiveSummary />

        <div className="print-page-break" />
        <SectionTitle id="hiring" icon="UserPlus" title="Подбор персонала" sub="Откуда приходят сотрудники" />
        <KpiCards />

        <div className="grid lg:grid-cols-5 gap-6 print-wide">
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
          id="turnover"
          icon="UserMinus"
          title="Текучесть кадров"
          sub="Кто и когда увольняется, какие каналы дают устойчивый персонал"
        />
        <TurnoverKpi />

        <div className="grid lg:grid-cols-2 gap-6 print-pair">
          <TenureChart />
          <HireVsFire />
        </div>

        <EarlyTurnover />

        <UnstableChannels />

        <div className="print-page-break" />
        <SectionTitle
          id="reasons"
          icon="MessageCircleQuestion"
          title="Причины увольнения"
          sub="Почему люди уходят и на что компания может повлиять"
        />
        <ReasonsKpi />

        <ReasonsChart />

        <ReasonsControllable />

        <ReasonsByTenure />

        <ReasonsByUnit />

        <ReasonsDetail />

        <ReasonsActions />

        <div id="insights" className="scroll-mt-24">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Icon name="Lightbulb" size={18} className="text-amber-500" />
            Ключевые выводы
          </h2>
          <div className="grid md:grid-cols-3 gap-4 print-trio">
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