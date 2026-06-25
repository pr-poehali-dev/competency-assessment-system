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
};

const FONT = '"IBM Plex Sans", sans-serif';

const FlowchartSVG = forwardRef<SVGSVGElement>((_, ref) => {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 1620"
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

      <rect x="0" y="0" width="900" height="1620" fill="#fafafa" />

      {/* lines first */}
      <g stroke={C.line} strokeWidth="2" fill="none">
        <line x1="450" y1="92" x2="450" y2="118" markerEnd="url(#arrow)" />
        <line x1="450" y1="180" x2="450" y2="206" markerEnd="url(#arrow)" />
        <line x1="450" y1="268" x2="450" y2="294" markerEnd="url(#arrow)" />
        <line x1="450" y1="356" x2="450" y2="382" markerEnd="url(#arrow)" />
        <line x1="450" y1="444" x2="450" y2="470" markerEnd="url(#arrow)" />
        <line x1="450" y1="532" x2="450" y2="558" markerEnd="url(#arrow)" />
        {/* подсчёт -> ромб решения */}
        <line x1="450" y1="620" x2="450" y2="626" markerEnd="url(#arrow)" />
        {/* ДА: ромб -> прошёл */}
        <line x1="450" y1="718" x2="450" y2="740" markerEnd="url(#arrow)" />
        {/* pass branch down to оформление */}
        <line x1="450" y1="798" x2="450" y2="898" markerEnd="url(#arrow)" />
        <line x1="450" y1="988" x2="450" y2="1014" markerEnd="url(#arrow)" />
        {/* НЕТ: ромб -> не прошёл (вправо) */}
        <line x1="554" y1="670" x2="730" y2="670" />
        <line x1="730" y1="670" x2="730" y2="740" markerEnd="url(#arrow)" />
        {/* не прошёл -> попытка №1 */}
        <line x1="730" y1="798" x2="730" y2="858" markerEnd="url(#arrow)" />
        {/* retry ДА -> обратно к "Кандидат пришёл" */}
        <line x1="822" y1="880" x2="868" y2="880" />
        <line x1="868" y1="880" x2="868" y2="66" />
        <line x1="868" y1="66" x2="582" y2="66" markerEnd="url(#arrow)" />
        {/* blacklist НЕТ */}
        <line x1="730" y1="926" x2="730" y2="954" markerEnd="url(#arrow)" />
      </g>

      {/* 1 START */}
      <g filter="url(#shadow)">
        <rect x="320" y="40" width="260" height="52" rx="26" fill={C.start} />
      </g>
      <text x="450" y="72" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="600">Кандидат пришёл</text>

      {/* 2 Профессия */}
      <Box x={300} y={120} w={300} label="1. Выбор профессии" sub="из 15 доступных" />
      {/* 3 ФИО */}
      <Box x={300} y={208} w={300} label="2. Заполнение ФИО" />
      {/* 4 Открытие теста */}
      <Box x={300} y={296} w={300} label="3. Открытие теста" />
      {/* 5 Проф тест */}
      <Box x={300} y={384} w={300} label="4. Тест компетенций" sub="5 вопросов" />
      {/* 6 ТБ тест */}
      <Box x={300} y={472} w={300} label="5. Тест техники безопасности" sub="5 вопросов" />
      {/* 7 Подсчёт */}
      <Box x={300} y={560} w={300} label="6. Подсчёт результатов" sub="из 10 ответов" />

      {/* DECISION 7+ */}
      <Decision x={450} y={670} label="Верных ≥ 7?" />

      {/* labels yes/no */}
      <text x="462" y="734" textAnchor="start" fill={C.pass} fontSize="13" fontWeight="600">ДА</text>
      <text x="620" y="662" textAnchor="middle" fill={C.fail} fontSize="13" fontWeight="600">НЕТ</text>

      {/* PASS node */}
      <g filter="url(#shadow)">
        <rect x="320" y="740" width="260" height="58" rx="10" fill={C.pass} />
      </g>
      <text x="450" y="766" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="600">Кандидат прошёл</text>
      <text x="450" y="785" textAnchor="middle" fill="#fff" fontSize="12" opacity="0.85">следующий этап оформления</text>

      {/* FAIL node */}
      <g filter="url(#shadow)">
        <rect x="610" y="740" width="240" height="58" rx="10" fill="#fef2f2" stroke={C.fail} strokeWidth="2" />
      </g>
      <text x="730" y="766" textAnchor="middle" fill={C.fail} fontSize="15" fontWeight="600">Кандидат не прошёл</text>
      <text x="730" y="785" textAnchor="middle" fill={C.fail} fontSize="12">верных &lt; 7</text>

      {/* DECISION попытка */}
      <Decision x={730} y={880} label="Попытка №1?" small />
      <text x={822} y={870} textAnchor="middle" fill={C.pass} fontSize="13" fontWeight="600">ДА</text>
      <text x={710} y={944} textAnchor="end" fill={C.fail} fontSize="13" fontWeight="600">НЕТ</text>
      <text x={760} y={58} textAnchor="middle" fill={C.line} fontSize="12" fontStyle="italic">повтор 1 раз</text>

      {/* BLACKLIST */}
      <g filter="url(#shadow)">
        <rect x="610" y="954" width="240" height="58" rx="10" fill={C.fail} />
      </g>
      <text x="730" y="980" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="600">Чёрный список</text>
      <text x="730" y="999" textAnchor="middle" fill="#fff" fontSize="12" opacity="0.85">отказ в приёме</text>

      {/* 7. Оформление */}
      <Box x={300} y={898} w={300} label="7. Оформление на работу" sub="результаты → в личное дело" h={90} />

      {/* connector оформление -> ведомость */}
      {/* 8. Ведомость (document shape) */}
      <g filter="url(#shadow)">
        <path
          d="M250,1016 H650 V1116 Q550,1140 450,1116 Q350,1092 250,1116 Z"
          fill={C.doc}
          stroke={C.stroke}
          strokeWidth="2"
        />
      </g>
      <text x="450" y="1052" textAnchor="middle" fill={C.text} fontSize="16" fontWeight="600">8. Сводная ведомость</text>
      <text x="450" y="1074" textAnchor="middle" fill={C.line} fontSize="13">накопительный учёт в разрезе профессий</text>

      {/* Footer legend */}
      <g transform="translate(120,1200)">
        <text x="0" y="0" fill={C.text} fontSize="15" fontWeight="700">Условные обозначения</text>
        <Legend y={30} color={C.start} label="Начало / приём кандидата" round />
        <Legend y={70} color={C.process} label="Действие / этап процесса" stroke />
        <Legend y={110} color={C.decision} label="Решение (да / нет)" diamond />
        <Legend y={150} color={C.pass} label="Положительный исход" />
        <Legend y={190} color={C.fail} label="Отказ / чёрный список" />
        <Legend y={230} color={C.doc} label="Документ / отчётность" stroke doc />
      </g>

      <text x="450" y="1600" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily='"IBM Plex Mono", monospace'>
        Бизнес-процесс оценки компетенций при найме рабочих · 40–170 чел./день · 15 профессий
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

function Legend({ y, color, label, round, stroke, diamond, doc }: { y: number; color: string; label: string; round?: boolean; stroke?: boolean; diamond?: boolean; doc?: boolean }) {
  return (
    <g transform={`translate(0,${y})`}>
      {diamond ? (
        <polygon points="14,-2 28,12 14,26 0,12" fill={color} stroke="#ea580c" strokeWidth="1.5" />
      ) : doc ? (
        <path d="M0,0 H28 V20 Q21,24 14,20 Q7,16 0,20 Z" fill={color} stroke={C.stroke} strokeWidth="1.5" />
      ) : (
        <rect x="0" y="0" width="28" height="22" rx={round ? 11 : 4} fill={color} stroke={stroke ? C.stroke : 'none'} strokeWidth="1.5" />
      )}
      <text x="40" y="16" fill={C.text} fontSize="14">{label}</text>
    </g>
  );
}

export default FlowchartSVG;