import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { OPP_TEAM, OPP_DEPT } from '@/data/oppDept';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  LabelList,
  Cell,
} from 'recharts';

const money = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')} млн ₽`;
  if (Math.abs(v) >= 1000) return `${Math.round(v / 1000)} тыс. ₽`;
  return `${Math.round(v)} ₽`;
};
const full = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`;

const FEE = OPP_DEPT.agencyFee;
const agencyPerHire = (OPP_DEPT.vacancySalary * 12 * FEE) / 100;
const agencyYear = agencyPerHire * OPP_DEPT.hires;
const ownYear = OPP_DEPT.totalYear;
const save = agencyYear - ownYear;
const savePct = (save / agencyYear) * 100;
const times = agencyYear / ownYear;
const breakEven = Math.ceil(ownYear / agencyPerHire);

const scaleData: { hires: number; Агентство: number; Отдел: number; Экономия: number }[] = [];
for (let h = 100; h <= 400; h += 20) {
  scaleData.push({ hires: h, Агентство: agencyPerHire * h, Отдел: ownYear, Экономия: agencyPerHire * h - ownYear });
}

const barData = [
  { name: 'Свой отдел', value: ownYear, color: '#1a1a2e' },
  { name: 'Агентство', value: agencyYear, color: '#dc2626' },
];

function Slide({ children, n, total }: { children: React.ReactNode; n: number; total: number }) {
  return (
    <div className="w-full h-full flex flex-col justify-center px-[6vw] py-[5vh] relative">
      {children}
      <div className="absolute bottom-[3vh] right-[6vw] text-[1.1vw] text-slate-400 font-mono">
        {n} / {total}
      </div>
      <div className="absolute bottom-[3vh] left-[6vw] flex items-center gap-[1vw]">
        <img src="/krost-logo.png" alt="КРОСТ" className="h-[2.6vh] w-auto object-contain opacity-60" />
        <span className="text-[1vw] text-slate-400">Отдел подбора персонала · 2026</span>
      </div>
    </div>
  );
}

function Big({ value, label, tone = 'dark' }: { value: string; label: string; tone?: 'dark' | 'red' | 'green' }) {
  const colors = {
    dark: 'text-slate-900',
    red: 'text-rose-600',
    green: 'text-emerald-600',
  };
  return (
    <div>
      <div className={`text-[6vw] font-black leading-none tracking-tight ${colors[tone]}`}>{value}</div>
      <div className="text-[1.4vw] text-slate-500 mt-[1vh] font-medium">{label}</div>
    </div>
  );
}

function Title({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-[4vh]">
      <h2 className="text-[3vw] font-bold text-slate-900 leading-tight">{children}</h2>
      {sub && <p className="text-[1.3vw] text-slate-500 mt-[1vh]">{sub}</p>}
    </div>
  );
}

export default function Present() {
  const [i, setI] = useState(() => {
    const h = parseInt(window.location.hash.replace('#', ''), 10);
    return Number.isFinite(h) && h > 0 ? h - 1 : 0;
  });

  useEffect(() => {
    window.history.replaceState(null, '', `#${i + 1}`);
  }, [i]);

  const slides = [
    <Slide key="s0" n={1} total={7}>
      <div className="text-[1.2vw] uppercase tracking-[0.3em] text-slate-400 font-semibold mb-[2vh]">
        Аналитика HR · Концерн КРОСТ
      </div>
      <h1 className="text-[4.4vw] font-black text-slate-900 leading-[1.05] tracking-tight">
        Свой отдел подбора
        <br />
        или кадровое агентство
      </h1>
      <p className="text-[1.6vw] text-slate-500 mt-[3vh] max-w-[60vw]">
        Сколько стоит подбор персонала своими силами и что было бы, если бы весь наём закрывали агентства
      </p>
      <div className="flex gap-[4vw] mt-[6vh]">
        <div>
          <div className="text-[3.6vw] font-black text-slate-900 leading-none">{OPP_DEPT.hires}</div>
          <div className="text-[1.1vw] text-slate-500 mt-[0.6vh]">наймов за год</div>
        </div>
        <div>
          <div className="text-[3.6vw] font-black text-slate-900 leading-none">{OPP_TEAM.length}</div>
          <div className="text-[1.1vw] text-slate-500 mt-[0.6vh]">рекрутеров в отделе</div>
        </div>
        <div>
          <div className="text-[3.6vw] font-black text-emerald-600 leading-none">{money(save)}</div>
          <div className="text-[1.1vw] text-slate-500 mt-[0.6vh]">экономия за год</div>
        </div>
      </div>
    </Slide>,

    <Slide key="s1" n={2} total={7}>
      <Title sub={`${OPP_TEAM.length} рекрутеров · ${OPP_DEPT.fte.toFixed(2).replace('.', ',')} ставки`}>
        Сколько стоит свой отдел подбора
      </Title>
      <div className="grid grid-cols-3 gap-[3vw]">
        <div className="rounded-[1vw] border border-slate-200 bg-white p-[2.2vw]">
          <div className="text-[3.2vw] font-black text-slate-900 leading-none">{money(OPP_DEPT.fotWithTax)}</div>
          <div className="text-[1.1vw] text-slate-500 mt-[1vh]">зарплата с налогами за год</div>
        </div>
        <div className="rounded-[1vw] border border-slate-200 bg-white p-[2.2vw]">
          <div className="text-[3.2vw] font-black text-slate-900 leading-none">{money(OPP_DEPT.workplacesYear)}</div>
          <div className="text-[1.1vw] text-slate-500 mt-[1vh]">рабочие места</div>
        </div>
        <div className="rounded-[1vw] bg-[#1a1a2e] p-[2.2vw]">
          <div className="text-[3.2vw] font-black text-white leading-none">{money(ownYear)}</div>
          <div className="text-[1.1vw] text-slate-300 mt-[1vh]">всего за год</div>
        </div>
      </div>
      <div className="mt-[5vh]">
        <Big value={full(OPP_DEPT.perHire)} label="стоимость одного найма собственными силами" />
      </div>
    </Slide>,

    <Slide key="s2" n={3} total={7}>
      <Title sub={`Гонорар ${FEE}% от годового дохода сотрудника с окладом ${money(OPP_DEPT.vacancySalary)} в месяц`}>
        Сколько стоило бы через агентство
      </Title>
      <div className="grid grid-cols-2 gap-[4vw] items-center">
        <div className="space-y-[4vh]">
          <Big value={full(agencyPerHire)} label="за одного нанятого сотрудника" tone="red" />
          <Big value={money(agencyYear)} label={`за весь объём найма — ${OPP_DEPT.hires} человек`} tone="red" />
        </div>
        <div className="rounded-[1vw] border border-rose-200 bg-rose-50 p-[2.5vw]">
          <div className="text-[1.2vw] text-rose-500 font-semibold uppercase tracking-wide">Разница на одном найме</div>
          <div className="text-[4vw] font-black text-rose-600 leading-none mt-[1.5vh]">
            {full(agencyPerHire - OPP_DEPT.perHire)}
          </div>
          <div className="text-[1.1vw] text-rose-500 mt-[1.5vh]">
            столько компания переплачивала бы за каждого человека
          </div>
        </div>
      </div>
    </Slide>,

    <Slide key="s3" n={4} total={7}>
      <Title sub={`Затраты за год при найме ${OPP_DEPT.hires} человек`}>Сравнение затрат за год</Title>
      <div className="h-[46vh]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 40, right: 20 }} barCategoryGap="32%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" stroke="#334155" fontSize={20} tickMargin={12} />
            <YAxis stroke="#94a3b8" fontSize={16} tickFormatter={(v: number) => `${Math.round(v / 1_000_000)} млн`} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={false}>
              {barData.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                fontSize={28}
                fontWeight={800}
                fill="#0f172a"
                formatter={(v: number) => money(v)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-[2vh] text-[1.5vw] text-slate-600">
        Свой отдел дешевле в{' '}
        <strong className="text-emerald-600">{times.toFixed(1).replace('.', ',')} раза</strong> — экономия{' '}
        <strong className="text-emerald-600">{money(save)}</strong> в год
      </div>
    </Slide>,

    <Slide key="s4" n={5} total={7}>
      <div className="text-center">
        <div className="text-[1.4vw] uppercase tracking-[0.3em] text-emerald-500 font-bold mb-[3vh]">
          Экономия за год
        </div>
        <div className="text-[9vw] font-black text-emerald-600 leading-none tracking-tight">{money(save)}</div>
        <div className="text-[1.8vw] text-slate-500 mt-[3vh]">
          это {savePct.toFixed(0)}% затрат на подбор — деньги остаются в компании
        </div>
        <div className="flex justify-center gap-[5vw] mt-[6vh]">
          <div>
            <div className="text-[2.6vw] font-black text-slate-900 leading-none">
              {times.toFixed(1).replace('.', ',')} раза
            </div>
            <div className="text-[1.1vw] text-slate-500 mt-[0.8vh]">дешевле агентства</div>
          </div>
          <div>
            <div className="text-[2.6vw] font-black text-slate-900 leading-none">{money(save / 12)}</div>
            <div className="text-[1.1vw] text-slate-500 mt-[0.8vh]">экономия каждый месяц</div>
          </div>
          <div>
            <div className="text-[2.6vw] font-black text-slate-900 leading-none">{breakEven} чел.</div>
            <div className="text-[1.1vw] text-slate-500 mt-[0.8vh]">точка окупаемости отдела</div>
          </div>
        </div>
      </div>
    </Slide>,

    <Slide key="s5" n={6} total={7}>
      <Title sub="Свой отдел стоит одинаково, счёт агентства растёт с каждым нанятым">
        Чем больше найм — тем выше экономия
      </Title>
      <div className="h-[48vh]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={scaleData} margin={{ top: 20, right: 30, bottom: 10 }}>
            <defs>
              <linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="hires"
              type="number"
              domain={[100, 400]}
              ticks={[100, 150, 200, 250, 300, 350, 400]}
              stroke="#334155"
              fontSize={16}
              tickMargin={10}
            />
            <YAxis stroke="#94a3b8" fontSize={15} tickFormatter={(v: number) => `${Math.round(v / 1_000_000)} млн`} />
            <Area type="monotone" dataKey="Экономия" stroke="#10b981" strokeWidth={3} fill="url(#pgrad)" isAnimationActive={false} />
            <Line type="monotone" dataKey="Агентство" stroke="#dc2626" strokeWidth={4} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="Отдел" stroke="#1a1a2e" strokeWidth={4} strokeDasharray="8 6" dot={false} isAnimationActive={false} />
            <ReferenceLine y={0} stroke="#cbd5e1" />
            <ReferenceLine
              x={OPP_DEPT.hires}
              stroke="#0ea5e9"
              strokeDasharray="5 5"
              label={{ value: `факт ${OPP_DEPT.hires}`, position: 'top', fontSize: 16, fill: '#0ea5e9', fontWeight: 700 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-[3vw] mt-[1vh] text-[1.2vw]">
        <span className="flex items-center gap-[0.6vw]">
          <span className="w-[2vw] border-t-[3px] border-[#dc2626]" /> <span className="text-slate-600">Агентство</span>
        </span>
        <span className="flex items-center gap-[0.6vw]">
          <span className="w-[2vw] border-t-[3px] border-dashed border-[#1a1a2e]" />{' '}
          <span className="text-slate-600">Свой отдел</span>
        </span>
        <span className="flex items-center gap-[0.6vw]">
          <span className="w-[1.2vw] h-[1.2vw] rounded bg-emerald-200" />{' '}
          <span className="text-slate-600">Экономия: ноль при {breakEven} наймах, {money(agencyPerHire * 400 - ownYear)} при 400</span>
        </span>
      </div>
    </Slide>,

    <Slide key="s6" n={7} total={7}>
      <Title sub="Что показывают расчёты">Выводы</Title>
      <div className="space-y-[3vh]">
        {[
          {
            icon: 'CircleCheck',
            text: `Собственный отдел подбора обходится в ${money(ownYear)} в год и закрывает ${OPP_DEPT.hires} наймов`,
          },
          {
            icon: 'TrendingDown',
            text: `Один наём своими силами — ${full(OPP_DEPT.perHire)} против ${full(agencyPerHire)} у агентства`,
          },
          { icon: 'Wallet', text: `Экономия за год — ${money(save)}, это ${savePct.toFixed(0)}% затрат на подбор` },
          {
            icon: 'ArrowUpRight',
            text: `Отдел окупается уже при ${breakEven} наймах в год; при росте до 400 экономия достигает ${money(agencyPerHire * 400 - ownYear)}`,
          },
        ].map((r) => (
          <div key={r.text} className="flex items-start gap-[1.6vw]">
            <div className="w-[3.4vw] h-[3.4vw] rounded-[0.8vw] bg-[#1a1a2e] flex items-center justify-center shrink-0">
              <Icon name={r.icon} size={26} className="text-white" />
            </div>
            <div className="text-[1.7vw] text-slate-700 leading-snug pt-[0.4vh]">{r.text}</div>
          </div>
        ))}
      </div>
    </Slide>,
  ];

  const total = slides.length;

  const go = useCallback(
    (d: number) => setI((v) => Math.min(total - 1, Math.max(0, v + d))),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        go(1);
      }
      if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'Home') setI(0);
      if (e.key === 'End') setI(total - 1);
      if (e.key === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, total]);

  return (
    <div className="fixed inset-0 bg-white overflow-hidden select-none">
      <div className="absolute top-0 left-0 h-[0.5vh] bg-emerald-500 transition-all duration-300 z-20"
        style={{ width: `${((i + 1) / total) * 100}%` }}
      />
      <div className="w-full h-full">{slides[i]}</div>

      <div className="absolute top-[3vh] right-[3vw] flex items-center gap-[0.8vw] z-20 opacity-40 hover:opacity-100 transition-opacity">
        <button
          onClick={() =>
            document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
          }
          className="w-[2.6vw] h-[2.6vw] rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50"
          title="Во весь экран (F)"
        >
          <Icon name="Maximize" size={18} className="text-slate-600" />
        </button>
        <Link
          to="/plan"
          className="w-[2.6vw] h-[2.6vw] rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50"
          title="Вернуться к плану"
        >
          <Icon name="X" size={18} className="text-slate-600" />
        </Link>
      </div>

      <button
        onClick={() => go(-1)}
        disabled={i === 0}
        className="absolute left-[1vw] top-1/2 -translate-y-1/2 w-[3vw] h-[3vw] rounded-full border border-slate-200 bg-white/80 flex items-center justify-center disabled:opacity-0 hover:bg-white transition-all z-20"
      >
        <Icon name="ChevronLeft" size={22} className="text-slate-600" />
      </button>
      <button
        onClick={() => go(1)}
        disabled={i === total - 1}
        className="absolute right-[1vw] top-1/2 -translate-y-1/2 w-[3vw] h-[3vw] rounded-full border border-slate-200 bg-white/80 flex items-center justify-center disabled:opacity-0 hover:bg-white transition-all z-20"
      >
        <Icon name="ChevronRight" size={22} className="text-slate-600" />
      </button>

      <div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 flex items-center gap-[0.6vw] z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-[0.8vh] rounded-full transition-all ${
              idx === i ? 'w-[2.4vw] bg-[#1a1a2e]' : 'w-[0.8vh] bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
