import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { printReport, type PageFormat } from '@/lib/print';
import { exportAgencyDashboardToExcel } from '@/lib/agencyDashboardSheet';
import PrintCover, { type CoverSection } from '@/components/print/PrintCover';
import PdfProgress, { type PdfState } from '@/components/print/PdfProgress';
import ReportToc from '@/components/print/ReportToc';
import OpenVacancies from '@/components/agencies/OpenVacancies';
import AgencyPayments from '@/components/agencies/AgencyPayments';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import AgencyKpi from '@/components/agencies/AgencyKpi';
import AgencyShare from '@/components/agencies/AgencyShare';
import MonthlyChart from '@/components/agencies/MonthlyChart';
import AgencyQuality from '@/components/agencies/AgencyQuality';
import TimeLoss from '@/components/agencies/TimeLoss';
import AgencyTerms from '@/components/agencies/AgencyTerms';
import GuaranteeVolume from '@/components/agencies/GuaranteeVolume';
import ClaimsSummary from '@/components/agencies/ClaimsSummary';
import CandidateProfile from '@/components/agencies/CandidateProfile';
import DeptTable from '@/components/agencies/DeptTable';
import AgencySummary from '@/components/agencies/AgencySummary';
import {
  AG_TOTAL_2025,
  AG_TOTAL_2026,
  AG_FIRED_2025,
  AG_FIRED_2026,
  AG_TURNOVER_2025,
  AG_TURNOVER_2026,
  FAST_FIRED_2026,
  FIRED_TENURE,
  LOST_DAYS_2026,
  EFIR,
  EFIR_SHARE_2026,
  RECRUITERS_2026,
} from '@/data/agencies';

const SECTIONS: CoverSection[] = [
  { id: 'summary', title: 'Главное за два года', sub: 'Краткая сводка для руководителя' },
  { id: 'volume', title: 'Объём и структура найма', sub: 'Какие агентства работают и сколько дают' },
  { id: 'quality', title: 'Качество найма', sub: 'Сколько нанятых остаются работать' },
  { id: 'timeloss', title: 'Цена быстрых уходов', sub: 'Сколько времени теряет компания' },
  { id: 'terms', title: 'Условия работы с агентствами', sub: 'Стоимость, гарантии и порядок оплаты' },
  { id: 'cost', title: 'Стоимость подбора и гарантии', sub: 'Что покрыто бесплатной заменой' },
  { id: 'payments', title: 'Сколько заплатили агентствам', sub: 'Фактические оплаты за 2025–2026 годы' },
  { id: 'profile', title: 'Кого приводят агентства', sub: 'Портрет кандидата и закрытые позиции' },
  { id: 'vacancies', title: 'Вакансии в работе у КА ЭФИР', sub: 'Что агентство ищет прямо сейчас' },
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

export default function Agencies() {
  const [pdf, setPdf] = useState<PdfState>(null);

  const handlePrint = async (format: PageFormat) => {
    setPdf({ percent: 0, label: 'Готовлю отчёт', format });
    try {
      await printReport(format, 'Отчёт по подбору через кадровые агентства', (percent, label) =>
        setPdf({ percent, label, format }),
      );
    } finally {
      setTimeout(() => setPdf(null), 600);
    }
  };

  const handleExcel = () => {
    void exportAgencyDashboardToExcel();
  };

  const insights = [
    {
      icon: 'Crown',
      tone: 'amber',
      title: 'КА ЭФИР — единственный реальный поставщик',
      text: `${EFIR_SHARE_2026.toFixed(0)}% найма через агентства в 2026 году: ${EFIR.hired2026} из ${AG_TOTAL_2026} человек. Остальные агентства закрыли по 1–2 вакансии.`,
    },
    {
      icon: 'TrendingDown',
      tone: 'emerald',
      title: 'Текучесть найма снизилась вдвое',
      text: `В 2026 году уволилось ${AG_FIRED_2026} из ${AG_TOTAL_2026} нанятых — ${AG_TURNOVER_2026.toFixed(1)}% против ${AG_TURNOVER_2025.toFixed(1)}% в 2025 году.`,
    },
    {
      icon: 'Clock',
      tone: 'rose',
      title: 'Все потери — в первые полгода',
      text: `Ни один уволившийся не проработал года. ${FAST_FIRED_2026} из ${AG_FIRED_2026} ушли за первые шесть месяцев, ${FIRED_TENURE[0].y2026} — не отработав и трёх.`,
    },
    {
      icon: 'UsersRound',
      tone: 'violet',
      title: 'Команда рекрутеров расширилась',
      text: `С заказами в 2026 году работали ${RECRUITERS_2026} рекрутеров агентств — на четверых больше, чем годом ранее.`,
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
              <div className="font-semibold text-slate-900 leading-tight">Подбор через кадровые агентства</div>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
            >
              <Icon name="ChartColumnBig" size={16} />
              <span className="hidden sm:inline">Общий дашборд</span>
            </Link>
            <Link
              to="/claims"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-lg px-3 py-2 hover:bg-emerald-100 transition-colors"
            >
              <Icon name="ClipboardList" size={16} />
              <span className="hidden sm:inline">Журнал претензий</span>
            </Link>
            <button
              onClick={handleExcel}
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 border border-emerald-300 bg-emerald-50 rounded-lg px-3 py-2 hover:bg-emerald-100 transition-colors"
            >
              <Icon name="Sheet" size={16} />
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
          title="Подбор через кадровые агентства"
          subtitle="Эффективность агентств-подрядчиков, качество найма и стоимость быстрых уходов за 2025–2026 годы"
          icon="Handshake"
          accent="#f59e0b"
          facts={[
            { value: String(AG_TOTAL_2025 + AG_TOTAL_2026), label: 'наймов через агентства за два года' },
            { value: String(AG_FIRED_2025 + AG_FIRED_2026), label: 'уволились в год приёма' },
            { value: `${AG_TURNOVER_2026.toFixed(1)}%`, label: 'текучесть найма в 2026 году' },
          ]}
          sections={SECTIONS}
          note="Источник данных: отчёты «Принятые сотрудники» и «Уволенные сотрудники» Концерна КРОСТ за 2025 и 2026 годы, список кадровых агентств с условиями сотрудничества. Данные за 2026 год приведены на дату формирования отчёта."
        />

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Дашборд подбора через кадровые агентства</h1>
          <p className="text-slate-500 mt-2">
            Эффективность агентств-подрядчиков за 2025–2026 годы. Всего {AG_TOTAL_2025 + AG_TOTAL_2026} наймов, из них{' '}
            {AG_FIRED_2025 + AG_FIRED_2026} сотрудников уволились в год приёма.
          </p>
        </div>

        <ReportToc sections={SECTIONS} accent="#f59e0b" />

        <div id="summary" className="scroll-mt-24" />
        <AgencySummary />

        <div className="print-page-break" />
        <SectionTitle
          id="volume"
          icon="Handshake"
          title="Объём и структура найма"
          sub="Какие агентства работают и сколько дают"
        />
        <AgencyKpi />

        <div className="grid lg:grid-cols-2 gap-6 print-wide">
          <AgencyShare />
          <MonthlyChart />
        </div>

        <div className="print-page-break" />
        <SectionTitle id="quality" icon="ShieldAlert" title="Качество найма" sub="Сколько нанятых остаются работать" />
        <AgencyQuality />

        <div className="print-page-break" />
        <SectionTitle id="timeloss" icon="Hourglass" title="Цена быстрых уходов" sub="Сколько времени теряет компания" />
        <TimeLoss />

        <div className="print-page-break" />
        <SectionTitle
          id="terms"
          icon="FileSignature"
          title="Условия работы с агентствами"
          sub="Стоимость, гарантии и порядок оплаты"
        />
        <AgencyTerms />

        <div className="print-page-break" />
        <SectionTitle
          id="cost"
          icon="Receipt"
          title="Стоимость подбора и гарантии"
          sub="Сколько стоили уволившиеся и что покрыто заменой"
        />
        <GuaranteeVolume />
        <ClaimsSummary />

        <div className="print-page-break" />
        <SectionTitle
          id="payments"
          icon="Banknote"
          title="Сколько заплатили агентствам"
          sub="Фактические оплаты за 2025–2026 годы"
        />
        <AgencyPayments />

        <div className="print-page-break" />
        <SectionTitle
          id="profile"
          icon="UserSearch"
          title="Кого приводят агентства"
          sub="Портрет кандидата и закрытые позиции"
        />
        <CandidateProfile />
        <DeptTable />

        <div className="print-page-break" />
        <SectionTitle
          id="vacancies"
          icon="ClipboardList"
          title="Вакансии в работе у КА ЭФИР"
          sub="Что агентство ищет прямо сейчас"
        />
        <OpenVacancies />

        <div className="print-page-break" />
        <SectionTitle id="insights" icon="Lightbulb" title="Ключевые выводы" sub="Что делать дальше" />
        <div className="grid md:grid-cols-2 gap-4 print-wide">
          {insights.map((c) => (
            <div key={c.title} className={`rounded-xl border p-5 print-block ${toneMap[c.tone]}`}>
              <Icon name={c.icon} size={20} className="mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">{c.title}</h3>
              <p className="text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
              <Icon name="FileCheck" size={18} className="text-sky-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Гарантия замены уже действует</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Во всех семи договорах закреплена гарантия бесплатной замены кандидата — от 3 до 8 месяцев в
                зависимости от подрядчика. Средний срок работы уволившихся в 2026 году составил 2 месяца, то есть
                практически все {AG_FIRED_2026} случаев попадают в гарантийный период и подбор должен закрываться
                бесплатно.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed mt-2">
                Но гарантия не компенсирует главное: время. По расчёту выше быстрые уходы стоили компании около{' '}
                {(LOST_DAYS_2026 / 21).toFixed(0)} человеко-месяцев рабочего времени в 2026 году — вакансия простаивает,
                пока идёт поиск замены, а новый сотрудник ещё месяц входит в работу. Поэтому усилия стоит направить не
                на условия договора, а на снижение самой доли быстрых уходов.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Icon name="ClipboardCheck" size={18} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">План действий</h3>
              <ol className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-600 shrink-0">1.</span>
                  Пересмотреть требования по проблемным позициям — помощник руководителя, ГИП и производитель работ
                  дают наибольшие потери оба года.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-600 shrink-0">2.</span>
                  Часть объёма перевести на реферальную программу: по общему дашборду это самый дешёвый и устойчивый
                  канал. Дополнительно задействовать подрядчиков с длинной гарантией — у ИП Мухина она 8 месяцев.
                </li>

              </ol>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 pt-2 pb-4 leading-relaxed">
          Источник данных: отчёты «Принятые сотрудники» и «Уволенные сотрудники» Концерна КРОСТ за 2025 и 2026 годы,
          список кадровых агентств с условиями сотрудничества на 10.08.2026.
          Все источники с упоминанием ЭФИР учтены как одна компания. Увольнения считаются по сотрудникам, принятым и
          уволенным в течение одного года. Данные за 2026 год приведены на дату формирования отчёта.
        </div>
      </main>
    </div>
  );
}