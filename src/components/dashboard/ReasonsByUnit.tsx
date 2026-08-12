import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
  Cell,
} from 'recharts';
import Icon from '@/components/ui/icon';
import {
  DEPARTMENTS,
  POSITIONS,
  DEPT_AVG_MEDIAN,
  DEPT_TOTAL,
  REASON_GROUPS,
  type UnitRow,
} from '@/data/reasons';

const label = (k: string) => REASON_GROUPS.find((g) => g.key === k)?.short ?? k;

const barColor = (m: number) => (m <= 6 ? '#dc2626' : m <= 11 ? '#f97316' : '#0ea5e9');

function UnitTable({
  rows,
  unitTitle,
  showChart = true,
}: {
  rows: UnitRow[];
  unitTitle: string;
  showChart?: boolean;
}) {
  const sorted = [...rows].sort((a, b) => a.median - b.median);
  const chart = sorted.map((r) => ({ name: r.name, median: r.median, n: r.n }));

  return (
    <>
      {showChart && (
      <ResponsiveContainer width="100%" height={Math.max(260, sorted.length * 22)}>
        <BarChart data={chart} layout="vertical" margin={{ left: 8, right: 56, top: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} unit=" мес." />
          <YAxis type="category" dataKey="name" width={150} stroke="#64748b" fontSize={11} interval={0} />
          <ReferenceLine
            x={DEPT_AVG_MEDIAN}
            stroke="#475569"
            strokeDasharray="4 4"
            label={{ value: `среднее ${DEPT_AVG_MEDIAN} мес.`, position: 'top', fontSize: 10, fill: '#475569' }}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
            formatter={(v: number, _n, p) => [`${v} мес. · ${p.payload.n} уволенных`, 'Медианный стаж']}
          />
          <Bar dataKey="median" radius={[0, 4, 4, 0]} barSize={13} isAnimationActive={false}>
            {chart.map((d) => (
              <Cell key={d.name} fill={barColor(d.median)} />
            ))}
            <LabelList
              dataKey="median"
              position="right"
              fontSize={10}
              fontWeight={600}
              fill="#475569"
              formatter={(v: number) => `${v} мес.`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      )}

      <div className="overflow-x-auto -mx-5 px-5 mt-5">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
              <th className="pb-2.5 font-medium">{unitTitle}</th>
              <th className="pb-2.5 font-medium text-right w-20">Уволено</th>
              <th className="pb-2.5 font-medium text-right w-28">Медиан. стаж</th>
              <th className="pb-2.5 font-medium text-right w-24">Ушли до 3 мес.</th>
              <th className="pb-2.5 font-medium text-right w-24">Ушли за 1-й год</th>
              <th className="pb-2.5 font-medium pl-4 w-52">Главные причины</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const early = (r.lt12 / r.n) * 100;
              return (
                <tr key={r.name} className="border-b border-slate-100">
                  <td className="py-2.5 font-medium text-slate-900">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: barColor(r.median) }} />
                      {r.name}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-700">{r.n}</td>
                  <td className="py-2.5 text-right font-semibold" style={{ color: barColor(r.median) }}>
                    {r.median} мес.
                  </td>
                  <td className="py-2.5 text-right text-slate-600">
                    {r.lt3} <span className="text-slate-400 text-xs">({Math.round((r.lt3 / r.n) * 100)}%)</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={early >= 70 ? 'text-rose-700 font-semibold' : 'text-slate-600'}>
                      {r.lt12} <span className="text-slate-400 text-xs font-normal">({Math.round(early)}%)</span>
                    </span>
                  </td>
                  <td className="py-2.5 pl-4 text-xs text-slate-500">{r.top.map(label).join(' · ')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function ReasonsByUnit() {
  const [tab, setTab] = useState<'dept' | 'pos'>('dept');
  const rows = tab === 'dept' ? DEPARTMENTS : POSITIONS;

  const worstDept = [...DEPARTMENTS].sort((a, b) => a.median - b.median)[0];
  const gp = DEPARTMENTS.find((d) => d.name === 'ГП')!;
  const upt = DEPARTMENTS.find((d) => d.name === 'УПТК')!;
  const helper = POSITIONS.find((p) => p.name === 'Помощник руководителя')!;
  const foreman = POSITIONS.find((p) => p.name === 'Прораб')!;
  const smt = DEPARTMENTS.find((d) => d.name === '1 СМТ')!;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block print-flow">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
        <div>
          <h3 className="font-semibold text-slate-900">Кто теряет людей быстрее остальных</h3>
          <p className="text-sm text-slate-500 mt-1">
            Медианный стаж уволенного по подразделениям и должностям. {DEPT_TOTAL} увольнений с известными датами; в
            расчёт включены только подразделения и должности, где уволилось не менее шести человек
          </p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 no-print shrink-0">
          <button
            onClick={() => setTab('dept')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              tab === 'dept' ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Подразделения
          </button>
          <button
            onClick={() => setTab('pos')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              tab === 'pos' ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Должности
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-4 mt-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#dc2626]" /> до 6 мес. — критично
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316]" /> 6–11 мес. — хуже среднего
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#0ea5e9]" /> год и больше — норма
        </span>
      </div>

      <div className="no-print">
        <UnitTable rows={rows} unitTitle={tab === 'dept' ? 'Подразделение' : 'Должность'} />
      </div>

      <div className="print-only">
        <UnitTable rows={DEPARTMENTS} unitTitle="Подразделение" showChart={false} />
        <div className="mt-6">
          <UnitTable rows={POSITIONS} unitTitle="Должность" showChart={false} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-5">
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Flame" size={16} className="text-rose-600" />
            <div className="font-semibold text-rose-900 text-sm">Самая горячая точка — ГП</div>
          </div>
          <p className="text-sm text-rose-900 leading-relaxed">
            {gp.n} увольнений при медианном стаже {gp.median} месяцев: {Math.round((gp.lt12 / gp.n) * 100)}% ушли, не
            проработав года, {gp.lt3} человека — в первые три месяца. В причинах на втором месте отношения с
            руководством. Подразделение крупное, поэтому и потери самые дорогие.
          </p>
        </div>
        <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={16} className="text-orange-600" />
            <div className="font-semibold text-orange-900 text-sm">Люди не доживают до полугода</div>
          </div>
          <p className="text-sm text-orange-900 leading-relaxed">
            В {worstDept.name}, ЭО, Гагарине и ДС медианный стаж уволенного — {worstDept.median}–5 месяцев. В УПТК{' '}
            {Math.round((upt.lt12 / upt.n) * 100)}% уходов приходится на первый год. Это подбор «в никуда»: люди
            уходят раньше, чем начинают приносить пользу.
          </p>
        </div>
        <div className="rounded-lg bg-sky-50 border border-sky-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="ShieldCheck" size={16} className="text-sky-600" />
            <div className="font-semibold text-sky-900 text-sm">Где всё в порядке</div>
          </div>
          <p className="text-sm text-sky-900 leading-relaxed">
            В 1 СМТ ({smt.median} мес.), ДП и 1 ИТ люди работают в 3–4 раза дольше и почти не уходят в первый год.
            Стоит разобрать их практику найма и адаптации и перенести её в проблемные подразделения.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2.5 bg-slate-50 -mx-5 -mb-5 px-5 py-4 rounded-b-xl">
        <Icon name="Target" size={16} className="text-slate-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700">
          <strong>По должностям:</strong> быстрее всех сгорают помощники руководителя ({helper.median} мес.,{' '}
          {Math.round((helper.lt12 / helper.n) * 100)}% уходят за первый год), администраторы и прорабы (
          {foreman.median} мес., {foreman.lt3} из {foreman.n} — до 3 месяцев). Это позиции, где нужно менять сам подход
          к подбору: описывать реальные условия до выхода и закреплять наставника. Инженерные и проектные роли (ГИП,
          руководитель проекта, ст. производитель работ) держатся 14–17 месяцев — там задача другая: удерживать
          деньгами и перспективой.
        </p>
      </div>
    </div>
  );
}