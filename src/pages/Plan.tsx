import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { printReport, type PageFormat } from '@/lib/print';
import PrintCover, { type CoverSection } from '@/components/print/PrintCover';
import PdfProgress, { type PdfState } from '@/components/print/PdfProgress';
import ReportToc from '@/components/print/ReportToc';
import ActionPlan from '@/components/dashboard/ActionPlan';
import PlanTimeline from '@/components/dashboard/PlanTimeline';
import ReferralEconomics from '@/components/dashboard/ReferralEconomics';
import OppVsAgency from '@/components/dashboard/OppVsAgency';
import OppScaleChart from '@/components/dashboard/OppScaleChart';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { PLAN_WAVES, PLAN_TASKS, countByStatus } from '@/data/plan';

const SECTIONS: CoverSection[] = [
  { id: 'tasks', title: 'Задачи по этапам', sub: 'Что делаем, кто отвечает и к какому сроку' },
  { id: 'timeline', title: 'Диаграмма сроков', sub: 'Как задачи распределены по месяцам' },
  { id: 'referral', title: 'Экономика реферальной премии', sub: 'Сколько платить за приведённого сотрудника' },
  { id: 'opp', title: 'Свой отдел или агентство', sub: 'Сравнение затрат на подбор за год' },
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

export default function Plan() {
  const [pdf, setPdf] = useState<PdfState>(null);

  const handlePrint = async (format: PageFormat) => {
    setPdf({ percent: 0, label: 'Готовлю отчёт', format });
    try {
      await printReport(format, 'План работы по снижению текучести персонала', (percent, label) =>
        setPdf({ percent, label, format }),
      );
    } finally {
      setTimeout(() => setPdf(null), 600);
    }
  };

  const totals = countByStatus(PLAN_TASKS);

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
              <div className="font-semibold text-slate-900 leading-tight">План работы</div>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            <Link
              to="/exit-forms"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
            >
              <Icon name="Printer" size={16} />
              <span className="hidden sm:inline">Бланки анкет</span>
            </Link>
            <Link
              to="/present"
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1a1a2e] rounded-lg px-3 py-2 hover:bg-[#2a2a44] transition-colors"
            >
              <Icon name="Presentation" size={16} />
              <span className="hidden sm:inline">Презентация</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
            >
              <Icon name="ChartColumnBig" size={16} />
              <span className="hidden sm:inline">Общий дашборд</span>
            </Link>
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
          title="План работы по снижению текучести персонала"
          subtitle="Задачи, ответственные, сроки и показатели результата на 2026–2027 годы"
          icon="ClipboardList"
          accent="#10b981"
          facts={[
            { value: String(totals.total), label: 'задач в плане' },
            { value: String(PLAN_WAVES.length), label: 'этапа работы' },
            { value: `${totals.done} из ${totals.total}`, label: 'выполнено на сегодня' },
          ]}
          sections={SECTIONS}
          note="План составлен по итогам анализа причин увольнений за 2025–2026 годы. Отметки о выполнении и комментарии ответственных обновляются в реальном времени и общие для всех сотрудников."
        />

        <ReportToc sections={SECTIONS} accent="#1a1a2e" />

        <SectionTitle
          id="tasks"
          icon="ListChecks"
          title="Задачи по этапам"
          sub="Что делаем, кто отвечает и к какому сроку"
        />
        <ActionPlan />

        <div className="print-page-break" />
        <SectionTitle
          id="timeline"
          icon="CalendarRange"
          title="Диаграмма сроков"
          sub="Как задачи распределены по месяцам"
        />
        <PlanTimeline />

        <div className="print-page-break" />
        <SectionTitle
          id="referral"
          icon="Calculator"
          title="Экономика реферальной премии"
          sub="Сколько платить за приведённого сотрудника"
        />
        <ReferralEconomics />

        <div className="print-page-break" />
        <SectionTitle
          id="opp"
          icon="Scale"
          title="Свой отдел или кадровое агентство"
          sub="Сравнение затрат на подбор за год"
        />
        <OppVsAgency />
        <OppScaleChart />

        <p className="text-xs text-slate-400 font-mono pt-4 border-t border-slate-200">
          Источник данных: внутренняя отчётность отдела подбора персонала · 2025–2026
        </p>
      </main>
    </div>
  );
}
