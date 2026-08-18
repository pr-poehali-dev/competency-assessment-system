import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import Icon from '@/components/ui/icon';
import { OPP_TEAM, OPP_DEPT } from '@/data/oppDept';

const FEE_STEPS = [15, 18, 20, 25];

const money = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} млн ₽`;
  if (Math.abs(v) >= 1000) return `${Math.round(v / 1000)} тыс. ₽`;
  return `${Math.round(v)} ₽`;
};

const full = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`;

export default function OppVsAgency() {
  const [fee, setFee] = useState(15);

  const agencyPerHire = (OPP_DEPT.vacancySalary * 12 * fee) / 100;
  const agencyYear = agencyPerHire * OPP_DEPT.hires;
  const ownYear = OPP_DEPT.totalYear;
  const save = agencyYear - ownYear;
  const savePct = agencyYear > 0 ? (save / agencyYear) * 100 : 0;
  const times = ownYear > 0 ? agencyYear / ownYear : 0;
  const perHireDiff = agencyPerHire - OPP_DEPT.perHire;
  const positive = save >= 0;

  const data = [
    {
      name: 'Свой отдел подбора',
      'Зарплата с налогами': OPP_DEPT.fotWithTax,
      'Рабочие места': OPP_DEPT.workplacesYear,
      total: ownYear,
    },
    {
      name: `Кадровое агентство (${fee}%)`,
      'Гонорар агентства': agencyYear,
      total: agencyYear,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm print-block">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#1a1a2e] flex items-center justify-center shrink-0">
            <Icon name="Scale" size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">Свой отдел подбора против кадрового агентства</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Затраты за год при объёме найма {OPP_DEPT.hires} человек. Состав отдела — {OPP_TEAM.length} рекрутеров,{' '}
              {OPP_DEPT.fte.toFixed(2).replace('.', ',')} ставки.
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
          <span className="text-xs text-slate-400">от годового дохода нанятого</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#1a1a2e] shrink-0" />
            <span className="text-xs text-slate-600">Зарплата рекрутеров с налогами</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#64748b] shrink-0" />
            <span className="text-xs text-slate-600">Рабочие места</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#dc2626] shrink-0" />
            <span className="text-xs text-slate-600">Гонорар агентства</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 28, right: 12, bottom: 10 }} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickMargin={8} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v: number) => `${Math.round(v / 1_000_000)} млн`} />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
              formatter={(v: number, n: string) => [full(v), n]}
            />
            <Bar dataKey="Зарплата с налогами" stackId="a" fill="#1a1a2e" />
            <Bar dataKey="Рабочие места" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="total"
                position="top"
                fontSize={12}
                fontWeight={700}
                fill="#1a1a2e"
                formatter={(v: number) => (v ? money(v) : '')}
              />
            </Bar>
            <Bar dataKey="Гонорар агентства" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="Гонорар агентства"
                position="top"
                fontSize={12}
                fontWeight={700}
                fill="#dc2626"
                formatter={(v: number) => (v ? money(v) : '')}
              />
              <Cell fill="#dc2626" />
              <Cell fill="#dc2626" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Свой отдел за год</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{full(ownYear)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{full(OPP_DEPT.perHire)} за один наём</div>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5">
            <div className="text-[11px] uppercase tracking-wide text-rose-400 font-semibold">Агентство за год</div>
            <div className="text-xl font-bold text-rose-700 mt-1">{full(agencyYear)}</div>
            <div className="text-[11px] text-rose-500 mt-0.5">{full(agencyPerHire)} за один наём</div>
          </div>
          <div
            className={`rounded-lg border p-3.5 ${
              positive ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div
              className={`text-[11px] uppercase tracking-wide font-semibold ${
                positive ? 'text-emerald-500' : 'text-amber-500'
              }`}
            >
              {positive ? 'Экономия за год' : 'Переплата за год'}
            </div>
            <div className={`text-xl font-bold mt-1 ${positive ? 'text-emerald-700' : 'text-amber-700'}`}>
              {full(Math.abs(save))}
            </div>
            <div className={`text-[11px] mt-0.5 ${positive ? 'text-emerald-600' : 'text-amber-600'}`}>
              {Math.abs(savePct).toFixed(1).replace('.', ',')}% · в {times.toFixed(1).replace('.', ',')} раза дешевле
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Icon name="Info" size={13} className="text-slate-400" />
            Как читать график
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Users" size={14} className="text-slate-500 mt-0.5 shrink-0" />
            <div className="text-[11px] text-slate-600 leading-snug">
              <strong className="text-slate-700">Левый столбик</strong> — содержание собственного отдела: зарплата{' '}
              {OPP_TEAM.length} рекрутеров с налогами ({money(OPP_DEPT.fotWithTax)}) и рабочие места (
              {money(OPP_DEPT.workplacesYear)})
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Building2" size={14} className="text-rose-500 mt-0.5 shrink-0" />
            <div className="text-[11px] text-slate-600 leading-snug">
              <strong className="text-rose-700">Правый столбик</strong> — если бы все {OPP_DEPT.hires} наймов закрывало
              агентство: {fee}% от годового дохода сотрудника с окладом {money(OPP_DEPT.vacancySalary)} в месяц
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="TrendingDown" size={14} className="text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-[11px] text-slate-600 leading-snug">
              На каждом найме собственный отдел{' '}
              <strong className="text-emerald-700">
                {perHireDiff >= 0 ? 'экономит' : 'дороже на'} {full(Math.abs(perHireDiff))}
              </strong>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-2.5 text-[11px] text-slate-500 leading-snug">
            Расчёт по фактическому составу отдела подбора и объёму найма за год. Переключите процент гонорара, чтобы
            увидеть сравнение по условиям вашего договора с агентством.
          </div>
        </div>
      </div>
    </div>
  );
}
