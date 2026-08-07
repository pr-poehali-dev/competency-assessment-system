import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';
import Icon from '@/components/ui/icon';
import { TENURE, TENURE_2025, TENURE_2026, TOTAL_2025, TOTAL_2026, pct } from '@/data/recruitment';

const early2025 = TENURE[0].y2025;
const early2026 = TENURE[0].y2026;
const rest2025 = TENURE_2025 - early2025;
const rest2026 = TENURE_2026 - early2026;

const compare = [
  { name: '2025 год', 'До 1 года': early2025, 'Более 1 года': rest2025 },
  { name: '2026 год', 'До 1 года': early2026, 'Более 1 года': rest2026 },
];

const share = [
  { name: '2025', value: pct(early2025, TENURE_2025) },
  { name: '2026', value: pct(early2026, TENURE_2026) },
];

export default function EarlyTurnover() {
  const risk2025 = pct(early2025, TOTAL_2025);
  const risk2026 = pct(early2026, TOTAL_2026);

  const stats = [
    {
      value: early2026.toString(),
      label: 'уволено со стажем до года в 2026',
      sub: `в 2025 — ${early2025} чел.`,
      tone: 'text-slate-500',
    },
    {
      value: `${pct(early2026, TENURE_2026).toFixed(0)}%`,
      label: 'доля в общем числе увольнений',
      sub: `в 2025 — ${pct(early2025, TENURE_2025).toFixed(0)}%`,
      tone: 'text-rose-600',
    },
    {
      value: `${risk2026.toFixed(1)}%`,
      label: 'от всех нанятых за год',
      sub: `в 2025 — ${risk2025.toFixed(1)}%, снижение в ${(risk2025 / risk2026).toFixed(1)} раза`,
      tone: 'text-emerald-600',
    },
    {
      value: `${(100 - risk2026).toFixed(1)}%`,
      label: 'новичков проходят первый год',
      sub: `удержано ${TOTAL_2026 - early2026} из ${TOTAL_2026} нанятых`,
      tone: 'text-emerald-600',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
      <div className="p-5 pb-0 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
          <Icon name="UserRoundX" size={18} className="text-rose-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Увольнения на первом году работы</h3>
          <p className="text-sm text-slate-500">Ключевая зона риска: сотрудники, не прошедшие адаптацию</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 mt-5 border-y border-slate-200">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-4">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">{s.value}</div>
            <div className="text-xs text-slate-600 mt-1 leading-snug">{s.label}</div>
            <div className={`text-[11px] mt-1.5 font-medium ${s.tone}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 p-5">
        <div className="lg:col-span-3">
          <div className="text-sm font-semibold text-slate-700 mb-3">Структура увольнений по стажу</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={compare} margin={{ top: 22, right: 8 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(v: number) => [`${v} чел.`, '']}
              />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="До 1 года" fill="#dc2626" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="До 1 года" position="top" fontSize={12} fontWeight={700} fill="#dc2626" />
              </Bar>
              <Bar dataKey="Более 1 года" fill="#cbd5e1" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="Более 1 года" position="top" fontSize={12} fontWeight={600} fill="#94a3b8" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2">
          <div className="text-sm font-semibold text-slate-700 mb-3">Доля «первогодок» в увольнениях</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={share} margin={{ top: 22, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} unit="%" />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(v: number) => [`${v.toFixed(1)}%`, 'Стаж до 1 года']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={56}>
                <Cell fill="#fca5a5" />
                <Cell fill="#dc2626" />
                <LabelList
                  dataKey="value"
                  position="top"
                  fontSize={13}
                  fontWeight={700}
                  fill="#dc2626"
                  formatter={(v: number) => `${v.toFixed(0)}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-rose-50 border-t border-rose-100 px-5 py-4">
        <p className="text-sm text-rose-800 leading-relaxed">
          <strong>Что это значит.</strong> Почти все увольнения происходят в первый год: {early2026} из{' '}
          {TENURE_2026} человек в 2026 году. При этом в абсолютных цифрах ситуация улучшилась — уходит{' '}
          {risk2026.toFixed(1)}% новичков против {risk2025.toFixed(1)}% в 2025 году. Наибольший эффект даст
          усиление наставничества и контроль первых трёх месяцев работы.
        </p>
      </div>
    </div>
  );
}
