import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Icon from '@/components/ui/icon';
import {
  TENURE_BANDS,
  TENURE_REASONS_TOTAL,
  TENURE_MEDIAN_MONTHS,
  REASON_GROUPS,
  bandPct,
} from '@/data/reasons';

const ORDER = ['other_job', 'nospec', 'life', 'conditions', 'perf', 'mgmt', 'commute', 'money', 'discipline', 'growth'];

const meta = (k: string) => REASON_GROUPS.find((g) => g.key === k)!;

const data = TENURE_BANDS.map((b) => {
  const row: Record<string, string | number> = { name: b.label, total: b.total };
  ORDER.forEach((k) => {
    row[meta(k).short] = +bandPct(b, k).toFixed(1);
  });
  return row;
});

const first = TENURE_BANDS[0];
const year = TENURE_BANDS[3];

export default function ReasonsByTenure() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
      <h3 className="font-semibold text-slate-900 mb-1">Причины увольнения в зависимости от стажа</h3>
      <p className="text-sm text-slate-500 mb-5">
        Почему уходят новички и почему — те, кто отработал год и больше. {TENURE_REASONS_TOTAL} увольнений с известной
        датой приёма и причиной, доля внутри каждой группы стажа
      </p>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ top: 8, right: 8 }} barCategoryGap="18%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} unit="%" domain={[0, 100]} />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
            formatter={(v: number, n) => [`${v}%`, n]}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconSize={9} />
          {ORDER.map((k) => (
            <Bar key={k} dataKey={meta(k).short} stackId="a" fill={meta(k).color} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <div className="grid sm:grid-cols-5 gap-2 mt-4">
        {TENURE_BANDS.map((b) => (
          <div key={b.key} className="rounded-lg border border-slate-200 px-3 py-2 text-center">
            <div className="text-xs text-slate-500">{b.label}</div>
            <div className="text-lg font-bold text-slate-900 leading-tight">{b.total}</div>
            <div className="text-[11px] text-slate-400">чел.</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3 mt-4">
        <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="UserX" size={16} className="text-orange-600" />
            <div className="font-semibold text-orange-900 text-sm">Первые 3 месяца — ошибка входа</div>
          </div>
          <p className="text-sm text-orange-900 leading-relaxed">
            У новичков резко выше доля «не справился с работой» ({bandPct(first, 'perf').toFixed(0)}% против{' '}
            {bandPct(year, 'perf').toFixed(0)}% у проработавших 1–3 года), условий труда (
            {bandPct(first, 'conditions').toFixed(0)}%) и дороги до работы ({bandPct(first, 'commute').toFixed(0)}%
            против {bandPct(year, 'commute').toFixed(0)}%). Это значит: человека взяли не под ту задачу, не рассказали
            про реальный график и не спросили, как он будет добираться. Уходят не из-за компании — из-за неверных
            ожиданий на входе.
          </p>
        </div>
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="LogOut" size={16} className="text-rose-600" />
            <div className="font-semibold text-rose-900 text-sm">После года — их переманивают</div>
          </div>
          <p className="text-sm text-rose-900 leading-relaxed">
            Начиная с 6 месяцев доля ушедших к другому работодателю подскакивает до{' '}
            {bandPct(TENURE_BANDS[2], 'other_job').toFixed(0)}–{bandPct(year, 'other_job').toFixed(0)}% против{' '}
            {bandPct(first, 'other_job').toFixed(0)}% у новичков. Добавляются деньги и конфликты с руководством. Это
            уже обученные и втянувшиеся люди, которых компания теряет в пользу рынка — самая дорогая категория потерь.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2.5 bg-slate-50 -mx-5 -mb-5 px-5 py-4 rounded-b-xl">
        <Icon name="Target" size={16} className="text-slate-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700">
          <strong>Вывод для управления:</strong> это две разные проблемы и два разных решения. Уходы до 3 месяцев
          лечатся на этапе подбора и адаптации — честным описанием работы, проверкой навыков и наставником. Уходы после
          года лечатся удержанием — оплатой, перспективой роста и работой руководителей. Медианный стаж уволенного —{' '}
          {TENURE_MEDIAN_MONTHS} месяцев, то есть половина уходит, не доработав и года.
        </p>
      </div>
    </div>
  );
}