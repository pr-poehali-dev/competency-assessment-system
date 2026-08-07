import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import Icon from '@/components/ui/icon';
import { channelRisk, RISK_META, TOTAL_2026, DISM_2026, pct } from '@/data/recruitment';

const significant = channelRisk.filter((c) => c.hired >= 10);
const realChannels = significant.filter((c) => c.group !== 'unknown');
const unknownChannels = significant.filter((c) => c.group === 'unknown');
const avgTurnover = pct(DISM_2026, TOTAL_2026);

const levelOrder = ['low', 'mid', 'high'] as const;
const legendLevels = levelOrder.filter((l) => realChannels.some((c) => c.level === l));

const maxHired = Math.max(...realChannels.map((c) => c.hired));

function DotLabel({ x, y, index }: any) {
  const c = realChannels[index];
  if (!c) return null;
  const nearRight = c.hired > maxHired * 0.8;
  return (
    <text
      x={nearRight ? x - 12 : x}
      y={y - 15}
      textAnchor={nearRight ? 'end' : 'middle'}
      fontSize={10}
      fontWeight={600}
      fill="#475569"
    >
      {c.short}
    </text>
  );
}

function RiskTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as (typeof channelRisk)[number];
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
      <div className="font-semibold text-slate-900 mb-1.5">{d.short}</div>
      <div className="text-slate-600">Нанято: {d.hired} чел.</div>
      <div className="text-slate-600">Уволилось: {d.fired} чел.</div>
      <div className="font-semibold mt-1" style={{ color: RISK_META[d.level].color }}>
        Текучесть: {d.turnover.toFixed(1)}%
      </div>
    </div>
  );
}

export default function UnstableChannels() {
  const worst = realChannels[0];
  const best = realChannels[realChannels.length - 1];
  const maxT = Math.max(...realChannels.map((c) => c.turnover));
  const unknownHired = unknownChannels.reduce((s, c) => s + c.hired, 0);
  const unknownFired = unknownChannels.reduce((s, c) => s + c.fired, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
      <div className="p-5 pb-0 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <Icon name="Radar" size={18} className="text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Какой канал приводит нестабильных сотрудников</h3>
          <p className="text-sm text-slate-500">
            Рейтинг каналов по текучести за 2026 год. Учтены источники с наймом от 10 человек
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-slate-200 mt-5 border-y border-slate-200">
        <div className="bg-white p-4 flex items-start gap-3">
          <Icon name="TriangleAlert" size={18} className="text-rose-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm text-slate-500">Самый нестабильный канал</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{worst.short}</div>
            <div className="text-xs text-rose-600 font-medium mt-1">
              текучесть {worst.turnover.toFixed(1)}% — ушло {worst.fired} из {worst.hired} нанятых
            </div>
          </div>
        </div>
        <div className="bg-white p-4 flex items-start gap-3">
          <Icon name="ShieldCheck" size={18} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm text-slate-500">Самый надёжный канал</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{best.short}</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              текучесть {best.turnover.toFixed(1)}% — ушло {best.fired} из {best.hired} нанятых
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {realChannels.map((c, i) => {
          const m = RISK_META[c.level];
          return (
            <div key={c.source} className={`rounded-lg border ${m.border} ${m.bg} p-3.5`}>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="w-6 h-6 rounded-md bg-white/70 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                  {i + 1}
                </span>
                <span className="font-semibold text-slate-900 flex-1 text-sm">{c.short}</span>
                <span className={`text-xs font-medium ${m.text}`}>{m.label}</span>
                <span className="text-lg font-bold tabular-nums w-16 text-right" style={{ color: m.color }}>
                  {c.turnover.toFixed(1)}%
                </span>
              </div>
              <div className="flex h-2.5 rounded-full overflow-hidden bg-white/70">
                <div
                  className="h-full"
                  style={{ width: `${(c.turnover / maxT) * 100}%`, background: m.color }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                <span>
                  Нанято {c.hired} · осталось работать {c.retained}
                </span>
                <span>
                  Уволилось {c.fired}, из них ~{c.earlyFired} в первый год
                </span>
              </div>
            </div>
          );
        })}

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
          <div className="flex items-start gap-3">
            <Icon name="CircleHelp" size={18} className="text-slate-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800 text-sm flex-1">Источник не зафиксирован</span>
                <span className="text-lg font-bold tabular-nums text-slate-600">
                  {pct(unknownFired, unknownHired).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {unknownHired} наймов без указания канала, из них уволилось {unknownFired}. Это не источник, а
                пробел в учёте — самая высокая текучесть в выборке. Обязательное заполнение поля «источник»
                при найме уберёт слепую зону.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="text-sm font-semibold text-slate-700 mb-1">Объём найма и качество канала</div>
        <p className="text-xs text-slate-500 mb-3">
          Идеальная зона — правый нижний угол: много наймов при низкой текучести
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 30, right: 46, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="hired"
              name="Нанято"
              stroke="#94a3b8"
              fontSize={11}
              label={{ value: 'Нанято, чел.', position: 'insideBottom', offset: -18, fontSize: 12, fill: '#64748b' }}
            />
            <YAxis
              type="number"
              dataKey="turnover"
              name="Текучесть"
              unit="%"
              stroke="#94a3b8"
              fontSize={11}
              label={{ value: 'Текучесть, %', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }}
            />
            <ZAxis type="number" dataKey="fired" range={[80, 500]} />
            <ReferenceLine
              y={avgTurnover}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{
                value: `среднее по компании ${avgTurnover.toFixed(1)}%`,
                fontSize: 10,
                fill: '#64748b',
                position: 'insideBottomLeft',
              }}
            />
            <Tooltip content={<RiskTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={realChannels} fillOpacity={0.75} label={<DotLabel />}>
              {realChannels.map((c) => (
                <Cell key={c.source} fill={RISK_META[c.level].color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-3">
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Icon name="Info" size={13} className="text-slate-400" />
            Как читать график
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-2">
              <Icon name="MoveRight" size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-slate-700">Правее — больше найма</div>
                <div className="text-[11px] text-slate-500 leading-snug">Горизонталь: сколько человек пришло</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="MoveUp" size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-slate-700">Выше — хуже удержание</div>
                <div className="text-[11px] text-slate-500 leading-snug">Вертикаль: процент увольнений</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Circle" size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-slate-700">Крупнее — больше потерь</div>
                <div className="text-[11px] text-slate-500 leading-snug">Размер круга: число уволившихся</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <div className="text-[11px] font-semibold text-slate-700 mb-2">Цвет круга — уровень риска</div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {legendLevels.map((lvl) => (
                <div key={lvl} className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ background: RISK_META[lvl].color, opacity: 0.75 }}
                  />
                  <span className="text-[11px] text-slate-600">
                    {RISK_META[lvl].label}
                    <span className="text-slate-400"> · {RISK_META[lvl].range}</span>
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="w-5 border-t-2 border-dashed border-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-600">
                  Среднее по компании
                  <span className="text-slate-400"> · {avgTurnover.toFixed(1)}%</span>
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 grid sm:grid-cols-2 gap-2">
            <div className="flex items-start gap-2">
              <Icon name="CircleCheck" size={14} className="text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-[11px] text-slate-600 leading-snug">
                <strong className="text-emerald-700">Правый нижний угол — цель.</strong> Канал даёт много людей, и они
                остаются работать
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CircleAlert" size={14} className="text-rose-600 mt-0.5 shrink-0" />
              <div className="text-[11px] text-slate-600 leading-snug">
                <strong className="text-rose-700">Верхняя часть — зона риска.</strong> Деньги на подбор уходят, а люди
                не задерживаются
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-5 py-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong>Вывод.</strong> Самые нестабильные сотрудники приходят от кадровых агентств — текучесть{' '}
          {worst.turnover.toFixed(1)}% против {avgTurnover.toFixed(1)}% в среднем по компании: из {worst.hired}{' '}
          нанятых ушло {worst.fired}. Надёжнее всего рекомендации и повторный найм бывших сотрудников —{' '}
          {best.turnover.toFixed(1)}% увольнений. Перераспределение бюджета с агентств на реферальную программу
          снизит и текучесть, и затраты на подбор.
        </p>
      </div>
    </div>
  );
}