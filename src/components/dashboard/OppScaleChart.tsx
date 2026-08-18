import { useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import Icon from '@/components/ui/icon';
import { OPP_DEPT } from '@/data/oppDept';

const FEE_STEPS = [15, 18, 20, 25];
const FROM = 100;
const TO = 400;
const STEP = 20;

const money = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} млн ₽`;
  if (Math.abs(v) >= 1000) return `${Math.round(v / 1000)} тыс. ₽`;
  return `${Math.round(v)} ₽`;
};

const full = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`;

export default function OppScaleChart() {
  const [fee, setFee] = useState(15);

  const agencyPerHire = (OPP_DEPT.vacancySalary * 12 * fee) / 100;
  const ownYear = OPP_DEPT.totalYear;
  const breakEven = agencyPerHire > 0 ? ownYear / agencyPerHire : 0;

  const data: { hires: number; Агентство: number; 'Свой отдел': number; Экономия: number }[] = [];
  for (let h = FROM; h <= TO; h += STEP) {
    const agency = agencyPerHire * h;
    data.push({ hires: h, Агентство: agency, 'Свой отдел': ownYear, Экономия: agency - ownYear });
  }

  const at = (h: number) => agencyPerHire * h - ownYear;
  const saveNow = at(OPP_DEPT.hires);
  const save400 = at(TO);
  const save100 = at(FROM);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#1a1a2e] flex items-center justify-center shrink-0">
          <Icon name="TrendingUp" size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 leading-tight">Как растёт экономия при увеличении объёма найма</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Затраты за год при найме от {FROM} до {TO} человек. Свой отдел стоит одинаково независимо от объёма, счёт
            агентства растёт с каждым нанятым.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 no-print">
        <span className="text-xs font-medium text-slate-600 mr-1">Гонорар агентства:</span>
        {FEE_STEPS.map((f) => (
          <button
            key={f}
            onClick={() => setFee(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
              fee === f
                ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f}%
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-5 border-t-2 border-[#dc2626] shrink-0" />
          <span className="text-xs text-slate-600">Затраты на агентство</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 border-t-2 border-dashed border-[#1a1a2e] shrink-0" />
          <span className="text-xs text-slate-600">Свой отдел подбора</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-200 shrink-0" />
          <span className="text-xs text-slate-600">Экономия собственного отдела</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={data} margin={{ top: 20, right: 16, bottom: 24 }}>
          <defs>
            <linearGradient id="saveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="hires"
            type="number"
            domain={[FROM, TO]}
            ticks={[100, 150, 200, 250, 300, 350, 400]}
            stroke="#64748b"
            fontSize={11}
            tickMargin={8}
            label={{ value: 'Нанято человек за год', position: 'insideBottom', offset: -14, fontSize: 11, fill: '#94a3b8' }}
          />
          <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v: number) => `${Math.round(v / 1_000_000)} млн`} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
            labelFormatter={(v) => `${v} нанятых за год`}
            formatter={(v: number, n: string) => [full(v), n]}
          />
          <Area
            type="monotone"
            dataKey="Экономия"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#saveGrad)"
            activeDot={{ r: 4 }}
          />
          <Line type="monotone" dataKey="Агентство" stroke="#dc2626" strokeWidth={2.5} dot={false} />
          <Line
            type="monotone"
            dataKey="Свой отдел"
            stroke="#1a1a2e"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={false}
          />
          <ReferenceLine y={0} stroke="#cbd5e1" />
          <ReferenceLine
            x={OPP_DEPT.hires}
            stroke="#0ea5e9"
            strokeDasharray="4 4"
            label={{ value: `факт ${OPP_DEPT.hires}`, position: 'top', fontSize: 11, fill: '#0ea5e9', fontWeight: 600 }}
          />
          <ReferenceDot x={OPP_DEPT.hires} y={saveNow} r={5} fill="#10b981" stroke="#fff" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Точка окупаемости</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{Math.ceil(breakEven)} чел.</div>
          <div className="text-[11px] text-slate-500 mt-0.5">свой отдел выгоднее при найме от этой цифры</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3.5">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">При {FROM} наймах</div>
          <div className={`text-xl font-bold mt-1 ${save100 >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {save100 >= 0 ? '+' : '−'}
            {money(Math.abs(save100))}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{save100 >= 0 ? 'экономия' : 'дороже агентства'}</div>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5">
          <div className="text-[11px] uppercase tracking-wide text-emerald-500 font-semibold">
            Факт {OPP_DEPT.hires} наймов
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-1">+{money(saveNow)}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">экономия за 2025 год</div>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5">
          <div className="text-[11px] uppercase tracking-wide text-emerald-500 font-semibold">При {TO} наймах</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">+{money(save400)}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">экономия при росте объёма</div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Icon name="Info" size={13} className="text-slate-400" />
          Как читать график
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 border-t-2 border-dashed border-[#1a1a2e] shrink-0 mt-2" />
          <div className="text-[11px] text-slate-600 leading-snug">
            <strong className="text-slate-700">Горизонтальная линия</strong> — содержание своего отдела:{' '}
            {full(ownYear)} в год независимо от того, сколько человек нанято
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 border-t-2 border-[#dc2626] shrink-0 mt-2" />
          <div className="text-[11px] text-slate-600 leading-snug">
            <strong className="text-rose-700">Растущая линия</strong> — счёт агентства: {full(agencyPerHire)} за каждого
            нанятого, чем больше объём, тем дороже
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Icon name="ChartArea" size={14} className="text-emerald-600 mt-0.5 shrink-0" />
          <div className="text-[11px] text-slate-600 leading-snug">
            <strong className="text-emerald-700">Зелёная зона</strong> — разница между линиями: чем больше найм, тем
            сильнее выигрывает собственный отдел
          </div>
        </div>
        <div className="border-t border-slate-200 pt-2.5 text-[11px] text-slate-500 leading-snug">
          Расчёт при гонораре агентства {fee}% от годового дохода сотрудника с окладом {money(OPP_DEPT.vacancySalary)} в
          месяц. Каждые дополнительные 100 наймов дают ещё {money(agencyPerHire * 100)} экономии.
        </div>
      </div>
    </div>
  );
}
