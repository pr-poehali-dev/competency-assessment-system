import { forwardRef } from 'react';

const C = {
  start: '#1a1a2e',
  process: '#ffffff',
  decision: '#fff7ed',
  pass: '#16a34a',
  fail: '#dc2626',
  stroke: '#1a1a2e',
  line: '#475569',
  text: '#1a1a2e',
  doc: '#eff6ff',
  rand: '#f0f9ff',
};

const FONT = '"IBM Plex Sans", sans-serif';

// Y-координаты блоков. Каждый блок h=60, gap=28 → шаг = 88
//
// START:               y=40   (h=52, bottom=92)
// 1 Выбор профессии:   y=120
// 2 Заполнение ФИО:    y=208
// 3 Рандом вопросов:   y=296
// 4 Открытие теста:    y=384
// 5 Тест компетенций:  y=472
// 6 Тест ТБ:           y=560
// 7 Подсчёт:           y=648
// DECISION Верных≥7:   y=758
// PASS / FAIL node:    y=828
// DECISION попытка:    y=968
// 8 Оформление:        y=986
// BLACKLIST:           y=1042
// 9 Ведомость:         y=1104
// viewBox высота: 1242

const FlowchartSVG = forwardRef<SVGSVGElement>((_, ref) => {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 1242"
      width="100%"
      style={{ display: 'block', fontFamily: FONT }}
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={C.line} />
        </marker>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1a1a2e" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect x="0" y="0" width="900" height="1242" fill="#fafafa" />

      {/* ── СТРЕЛКИ ── */}
      <g stroke={C.line} strokeWidth="2" fill="none">
        {/* START → Выбор профессии */}
        <line x1="450" y1="92" x2="450" y2="118" markerEnd="url(#arrow)" />
        {/* Выбор профессии → ФИО */}
        <line x1="450" y1="180" x2="450" y2="206" markerEnd="url(#arrow)" />
        {/* ФИО → Формирование вопросов */}
        <line x1="450" y1="268" x2="450" y2="294" markerEnd="url(#arrow)" />
        {/* Формирование вопросов → Открытие теста */}
        <line x1="450" y1="356" x2="450" y2="382" markerEnd="url(#arrow)" />
        {/* Открытие теста → Тест компетенций */}
        <line x1="450" y1="444" x2="450" y2="470" markerEnd="url(#arrow)" />
        {/* Тест компетенций → Тест ТБ */}
        <line x1="450" y1="532" x2="450" y2="558" markerEnd="url(#arrow)" />
        {/* Тест ТБ → Подсчёт */}
        <line x1="450" y1="620" x2="450" y2="646" markerEnd="url(#arrow)" />
        {/* Подсчёт → ромб решения */}
        <line x1="450" y1="708" x2="450" y2="714" markerEnd="url(#arrow)" />
        {/* ДА: ромб → прошёл */}
        <line x1="450" y1="806" x2="450" y2="828" markerEnd="url(#arrow)" />
        {/* PASS → Оформление */}
        <line x1="450" y1="886" x2="450" y2="986" markerEnd="url(#arrow)" />
        {/* Оформление → Ведомость */}
        <line x1="450" y1="1076" x2="450" y2="1102" markerEnd="url(#arrow)" />
        {/* НЕТ: ромб → не прошёл (вправо) */}
        <line x1="554" y1="758" x2="730" y2="758" />
        <line x1="730" y1="758" x2="730" y2="828" markerEnd="url(#arrow)" />
        {/* не прошёл → попытка */}
        <line x1="730" y1="886" x2="730" y2="946" markerEnd="url(#arrow)" />
        {/* retry ДА → обратно к "Кандидат пришёл" */}
        <line x1="822" y1="968" x2="868" y2="968" />
        <line x1="868" y1="968" x2="868" y2="66" />
        <line x1="868" y1="66" x2="582" y2="66" markerEnd="url(#arrow)" />
        {/* blacklist НЕТ */}
        <line x1="730" y1="1014" x2="730" y2="1042" markerEnd="url(#arrow)" />
      </g>

      {/* ── START ── */}
      <g filter="url(#shadow)">
        <rect x="320" y="40" width="260" height="52" rx="26" fill={C.start} />
      </g>
      <text x="450" y="72" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="600">Кандидат пришёл</text>

      {/* ── 1: Выбор профессии ── */}
      <Box x={300} y={120} w={300} label="1. Выбор профессии" sub="из 29 доступных" />

      {/* ── 2: Заполнение ФИО ── */}
      <Box x={300} y={208} w={300} label="2. Заполнение ФИО" />

      {/* ── 3: Рандомное формирование вопросов ── */}
      <g filter="url(#shadow)">
        <rect x={300} y={296} width={300} height={60} rx="10" fill={C.rand} stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 3" />
        <text x={450} y={320} textAnchor="middle" fill="#0c4a6e" fontSize="15" fontWeight="600">3. Формирование вопросов</text>
        <text x={450} y={340} textAnchor="middle" fill="#0369a1" fontSize="12">рандомный порядок из базы</text>
      </g>

      {/* ── 4: Открытие теста ── */}
      <Box x={300} y={384} w={300} label="4. Открытие теста" />

      {/* ── 5: Тест компетенций ── */}
      <Box x={300} y={472} w={300} label="5. Тест компетенций" sub="5 вопросов" />

      {/* ── 6: Тест ТБ ── */}
      <Box x={300} y={560} w={300} label="6. Тест техники безопасности" sub="5 вопросов" />

      {/* ── 7: Подсчёт ── */}
      <Box x={300} y={648} w={300} label="7. Подсчёт результатов" sub="из 10 ответов" />

      {/* ── DECISION Верных≥7 ── */}
      <Decision x={450} y={758} label="Верных ≥ 7?" />

      {/* labels да/нет */}
      <text x="462" y="822" textAnchor="start" fill={C.pass} fontSize="13" fontWeight="600">ДА</text>
      <text x="620" y="750" textAnchor="middle" fill={C.fail} fontSize="13" fontWeight="600">НЕТ</text>

      {/* ── PASS ── */}
      <g filter="url(#shadow)">
        <rect x="320" y="828" width="260" height="58" rx="10" fill={C.pass} />
      </g>
      <text x="450" y="854" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="600">Кандидат прошёл</text>
      <text x="450" y="873" textAnchor="middle" fill="#fff" fontSize="12" opacity="0.85">следующий этап оформления</text>

      {/* ── FAIL ── */}
      <g filter="url(#shadow)">
        <rect x="610" y="828" width="240" height="58" rx="10" fill="#fef2f2" stroke={C.fail} strokeWidth="2" />
      </g>
      <text x="730" y="854" textAnchor="middle" fill={C.fail} fontSize="15" fontWeight="600">Кандидат не прошёл</text>
      <text x="730" y="873" textAnchor="middle" fill={C.fail} fontSize="12">верных &lt; 7</text>

      {/* ── DECISION попытка ── */}
      <Decision x={730} y={968} label="Попытка №1?" small />
      <text x={822} y={958} textAnchor="middle" fill={C.pass} fontSize="13" fontWeight="600">ДА</text>
      <text x={710} y={1032} textAnchor="end" fill={C.fail} fontSize="13" fontWeight="600">НЕТ</text>
      <text x={760} y={58} textAnchor="middle" fill={C.line} fontSize="12" fontStyle="italic">повтор 1 раз</text>

      {/* ── BLACKLIST ── */}
      <g filter="url(#shadow)">
        <rect x="610" y="1042" width="240" height="58" rx="10" fill={C.fail} />
      </g>
      <text x="730" y="1068" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="600">Чёрный список</text>
      <text x="730" y="1087" textAnchor="middle" fill="#fff" fontSize="12" opacity="0.85">отказ в приёме</text>

      {/* ── 8: Оформление ── */}
      <Box x={300} y={986} w={300} label="8. Оформление на работу" sub="результаты → в личное дело" h={90} />

      {/* ── 9: Ведомость ── */}
      <g filter="url(#shadow)">
        <path
          d="M250,1104 H650 V1204 Q550,1228 450,1204 Q350,1180 250,1204 Z"
          fill={C.doc}
          stroke={C.stroke}
          strokeWidth="2"
        />
      </g>
      <text x="450" y="1140" textAnchor="middle" fill={C.text} fontSize="16" fontWeight="600">9. Сводная ведомость</text>
      <text x="450" y="1162" textAnchor="middle" fill={C.line} fontSize="13">накопительный учёт в разрезе профессий</text>

      <text x="450" y="1230" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily='"IBM Plex Mono", monospace'>
        Бизнес-процесс оценки компетенций при найме рабочих · 40–170 чел./день · 29 профессий
      </text>
    </svg>
  );
});

FlowchartSVG.displayName = 'FlowchartSVG';

function Box({ x, y, w, label, sub, h = 60 }: { x: number; y: number; w: number; label: string; sub?: string; h?: number }) {
  const cx = x + w / 2;
  return (
    <g filter="url(#shadow)">
      <rect x={x} y={y} width={w} height={h} rx="10" fill={C.process} stroke={C.stroke} strokeWidth="2" />
      <text x={cx} y={sub ? y + h / 2 - 4 : y + h / 2 + 5} textAnchor="middle" fill={C.text} fontSize="16" fontWeight="600">
        {label}
      </text>
      {sub && (
        <text x={cx} y={y + h / 2 + 16} textAnchor="middle" fill={C.line} fontSize="12.5">
          {sub}
        </text>
      )}
    </g>
  );
}

function Decision({ x, y, label, small }: { x: number; y: number; label: string; small?: boolean }) {
  const w = small ? 92 : 104;
  const h = small ? 46 : 48;
  return (
    <g filter="url(#shadow)">
      <polygon
        points={`${x},${y - h} ${x + w},${y} ${x},${y + h} ${x - w},${y}`}
        fill={C.decision}
        stroke="#ea580c"
        strokeWidth="2"
      />
      <text x={x} y={y + 5} textAnchor="middle" fill={C.text} fontSize={small ? 13 : 15} fontWeight="600">
        {label}
      </text>
    </g>
  );
}

function Legend({ y, color, label, round, stroke, diamond, doc, dashBlue }: { y: number; color: string; label: string; round?: boolean; stroke?: boolean; diamond?: boolean; doc?: boolean; dashBlue?: boolean }) {
  return (
    <g transform={`translate(0,${y})`}>
      {diamond ? (
        <polygon points="14,-2 28,12 14,26 0,12" fill={color} stroke="#ea580c" strokeWidth="1.5" />
      ) : doc ? (
        <path d="M0,0 H28 V20 Q21,24 14,20 Q7,16 0,20 Z" fill={color} stroke="#1a1a2e" strokeWidth="1.5" />
      ) : round ? (
        <rect x="0" y="0" width="28" height="28" rx="14" fill={color} />
      ) : dashBlue ? (
        <rect x="0" y="4" width="28" height="20" rx="4" fill={color} stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 2" />
      ) : stroke ? (
        <rect x="0" y="4" width="28" height="20" rx="4" fill={color} stroke="#1a1a2e" strokeWidth="1.5" />
      ) : (
        <rect x="0" y="4" width="28" height="20" rx="4" fill={color} />
      )}
      <text x="38" y="17" fill="#1a1a2e" fontSize="13">{label}</text>
    </g>
  );
}

export default FlowchartSVG;