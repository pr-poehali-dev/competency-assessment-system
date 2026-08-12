import Icon from '@/components/ui/icon';
import { REASON_GROUPS, rPct } from '@/data/reasons';

const g = (k: string) => REASON_GROUPS.find((x) => x.key === k)!;

const actions: {
  icon: string;
  title: string;
  problem: string;
  action: string;
  effect: string;
  tone: 'red' | 'amber' | 'blue';
}[] = [
  {
    icon: 'MessageSquareQuote',
    title: 'Ввести выходное интервью',
    problem: `${g('nospec').total} увольнений (${rPct(g('nospec').total).toFixed(0)}%) закрыты формулировкой «собственное желание» без объяснения, ещё ${g('other_job').total} — «нашёл другую работу» без указания, чем именно другая работа лучше.`,
    action:
      'Короткая анкета из 5 вопросов при расчёте: что стало решающим, что предлагает новый работодатель, что могло бы удержать, оценка руководителя, готовность вернуться.',
    effect: 'Половина всех уходов перестанет быть «чёрным ящиком» уже через квартал.',
    tone: 'red',
  },
  {
    icon: 'CalendarClock',
    title: 'Пересмотреть графики и нагрузку',
    problem: `${g('conditions').total} человек ушли из-за графика, объёма работы и переработок — это ${rPct(g('conditions').total).toFixed(0)}% всех увольнений и крупнейшая причина после ухода к конкуренту.`,
    action:
      'Выделить подразделения-лидеры по таким уходам, проверить фактические переработки и сменность, скорректировать нормативы нагрузки.',
    effect: 'Дешевле повышения зарплат: не требует роста фонда оплаты труда.',
    tone: 'amber',
  },
  {
    icon: 'UserCheck',
    title: 'Усилить отбор и адаптацию',
    problem: `${g('perf').total} расставаний — «не справляется с работой» и «не прошёл испытательный срок», ещё ${g('discipline').total} — дисциплина и нарушения.`,
    action:
      'Проверять на входе профильные навыки под конкретную задачу, закрепить наставника на первые 3 месяца и контрольные точки на 2-й, 6-й и 12-й неделе.',
    effect: 'Прямо снижает долю уходов в первый год и число гарантийных случаев по агентствам.',
    tone: 'blue',
  },
  {
    icon: 'MapPin',
    title: 'Спрашивать про дорогу на входе',
    problem: `${g('commute').total} человек ушли из-за расположения объекта или нашли работу ближе к дому. Это выясняется одним вопросом до найма.`,
    action:
      'Добавить в анкету кандидата фактическое время в пути и способ добраться; при пути дольше 1,5 часов — обсуждать риск сразу или предлагать другой объект.',
    effect: 'Полностью предотвратимая группа уходов.',
    tone: 'blue',
  },
  {
    icon: 'Users',
    title: 'Работать с руководителями',
    problem: `${g('mgmt').total} уходов связаны с руководителем и коллективом. На выходе о конфликте с начальником говорят неохотно — реальная доля выше.`,
    action:
      'Считать текучесть в разрезе руководителей: там, где из одного подразделения ушли трое и более, проводить разбор отдельно.',
    effect: 'Точечно вскрывает подразделения, теряющие людей быстрее остальных.',
    tone: 'amber',
  },
  {
    icon: 'TrendingUp',
    title: 'Дать перспективу лучшим',
    problem: `${g('growth').total} человек ушли из-за отсутствия роста и смены сферы, ${g('money').total} — прямо из-за зарплаты. Это уже обученные сотрудники.`,
    action:
      'Определить ключевые роли и зафиксировать для них понятный горизонт: пересмотр оплаты, расширение зоны ответственности, обучение.',
    effect: 'Самая дорогая группа по стоимости замены — удержание окупается быстрее всего.',
    tone: 'red',
  },
];

const toneMap = {
  red: 'bg-rose-50 border-rose-200 text-rose-900',
  amber: 'bg-amber-50 border-amber-200 text-amber-900',
  blue: 'bg-sky-50 border-sky-200 text-sky-900',
};

export default function ReasonsActions() {
  return (
    <div>
      <h3 className="font-semibold text-slate-900 mb-1">Что делать с этими причинами</h3>
      <p className="text-sm text-slate-500 mb-4">Приоритетные шаги, вытекающие из структуры увольнений</p>
      <div className="grid md:grid-cols-2 gap-4 print-pair">
        {actions.map((a) => (
          <div key={a.title} className={`rounded-xl border p-5 print-block ${toneMap[a.tone]}`}>
            <div className="flex items-center gap-2 mb-3">
              <Icon name={a.icon} size={18} />
              <div className="font-semibold">{a.title}</div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed mb-2.5">{a.problem}</p>
            <div className="text-xs uppercase tracking-wide opacity-60 mb-1">Что сделать</div>
            <p className="text-sm opacity-90 leading-relaxed mb-2.5">{a.action}</p>
            <div className="text-sm font-medium border-t border-current/10 pt-2.5">{a.effect}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
