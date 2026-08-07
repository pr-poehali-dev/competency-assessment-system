import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
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

export default function Agencies() {
  const handlePrint = (format: 'A4' | 'A3') => {
    const prev = document.title;
    const d = new Date();
    const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const style = document.createElement('style');
    style.id = 'page-format';
    style.textContent =
      format === 'A3'
        ? '@page { size: A3 portrait; margin: 14mm 12mm; }'
        : '@page { size: A4 portrait; margin: 12mm 10mm; }';
    document.head.appendChild(style);
    document.documentElement.classList.add(`print-format-${format.toLowerCase()}`);

    document.title = `Отчёт по подбору через кадровые агентства ${format} ${stamp}`;
    window.addEventListener(
      'afterprint',
      () => {
        document.title = prev;
        style.remove();
        document.documentElement.classList.remove('print-format-a4', 'print-format-a3');
      },
      { once: true },
    );
    window.print();
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b] flex items-center justify-center">
              <Icon name="Handshake" size={20} className="text-white" />
            </div>
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
                  Откроется окно печати. Выберите «Сохранить как PDF» и убедитесь, что размер бумаги совпадает с
                  выбранным форматом.
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Дашборд подбора через кадровые агентства</h1>
          <p className="text-slate-500 mt-2">
            Эффективность агентств-подрядчиков за 2025–2026 годы. Всего {AG_TOTAL_2025 + AG_TOTAL_2026} наймов, из них{' '}
            {AG_FIRED_2025 + AG_FIRED_2026} сотрудников уволились в год приёма.
          </p>
        </div>

        <AgencySummary />

        <div className="print-page-break" />
        <SectionTitle icon="Handshake" title="Объём и структура найма" sub="Какие агентства работают и сколько дают" />
        <AgencyKpi />

        <div className="grid lg:grid-cols-2 gap-6 print-wide">
          <AgencyShare />
          <MonthlyChart />
        </div>

        <div className="print-page-break" />
        <SectionTitle icon="ShieldAlert" title="Качество найма" sub="Сколько нанятых остаются работать" />
        <AgencyQuality />

        <div className="print-page-break" />
        <SectionTitle icon="Hourglass" title="Цена быстрых уходов" sub="Сколько времени теряет компания" />
        <TimeLoss />

        <div className="print-page-break" />
        <SectionTitle icon="UserSearch" title="Кого приводят агентства" sub="Портрет кандидата и закрытые позиции" />
        <CandidateProfile />
        <DeptTable />

        <div className="print-page-break" />
        <SectionTitle icon="Lightbulb" title="Ключевые выводы" sub="Что делать дальше" />
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
                В договорах с кадровыми агентствами закреплена гарантия бесплатной замены кандидата. Это значит, что
                прямые расходы на повторный подбор по {AG_FIRED_2026} случаям 2026 года компания в основном не несёт —
                финансовый риск закрыт.
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
                  Проверить, покрывает ли действующая гарантия замены все {AG_FIRED_2026} случаев 2026 года, и
                  фиксировать каждое обращение — гарантия работает только при заявленной претензии.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-600 shrink-0">2.</span>
                  Подключить второе агентство на 20–30% объёма, чтобы снизить зависимость от единственного поставщика.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-600 shrink-0">3.</span>
                  Пересмотреть требования по проблемным позициям — помощник руководителя, ГИП и производитель работ
                  дают наибольшие потери оба года.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-600 shrink-0">4.</span>
                  Часть объёма перевести на реферальную программу: по общему дашборду это самый дешёвый и устойчивый
                  канал.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-600 shrink-0">5.</span>
                  Вести учёт замен по гарантии: сколько ушедших агентство заменило бесплатно, а сколько подборов
                  пришлось оплатить повторно. Это покажет реальную стоимость текучести.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 pt-2 pb-4 leading-relaxed">
          Источник данных: отчёты «Принятые сотрудники» и «Уволенные сотрудники» Концерна КРОСТ за 2025 и 2026 годы.
          Все источники с упоминанием ЭФИР учтены как одна компания. Увольнения считаются по сотрудникам, принятым и
          уволенным в течение одного года. Данные за 2026 год приведены на дату формирования отчёта.
        </div>
      </main>
    </div>
  );
}