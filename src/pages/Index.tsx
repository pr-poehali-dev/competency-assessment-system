import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import FlowchartSVG from '@/components/FlowchartSVG';

const STEPS = [
  { n: '1', t: 'Выбор номера заявки', d: 'Кандидат указывает номер своей заявки' },
  { n: '2', t: 'Выбор профессии', d: 'Кандидат указывает профессию из 15 доступных' },
  { n: '3', t: 'Заполнение ФИО', d: 'Регистрация участника тестирования' },
  { n: '4', t: 'Открытие теста', d: 'Запуск процедуры оценки' },
  { n: '5', t: 'Формирование вопросов', d: 'Рандомный порядок вопросов из базы' },
  { n: '6', t: 'Тест компетенций', d: '5 вопросов по профессиональным навыкам' },
  { n: '7', t: 'Техника безопасности', d: '5 вопросов на знание ТБ' },
  { n: '8', t: 'Подсчёт результатов', d: 'Проходной балл — не менее 7 из 10' },
  { n: '9', t: 'Оформление', d: 'Результаты подшиваются в личное дело' },
  { n: '10', t: 'Сводная ведомость', d: 'Накопительный учёт по профессиям' },
];

export default function Index() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const printChart = (pageSize: 'A4' | 'A3') => {
    setShowPrintDialog(false);
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svgSrc = new XMLSerializer().serializeToString(svgEl);
    const stepsHtml = STEPS.map(s => `
      <div class="step">
        <div class="step-num">${s.n}</div>
        <div><div class="step-title">${s.t}</div><div class="step-desc">${s.d}</div></div>
      </div>`).join('');
    const win = window.open('', '_blank');
    if (!win) return;
    // Рендерим SVG в PNG через canvas для точного воспроизведения
    const svgBlob = new Blob([svgSrc], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const scale = 3;
      const svgW = 900 * scale;
      const svgH = 1330 * scale;

      // Рисуем полную схему на canvas
      const fullCanvas = document.createElement('canvas');
      fullCanvas.width = svgW;
      fullCanvas.height = svgH;
      const fullCtx = fullCanvas.getContext('2d')!;
      fullCtx.fillStyle = '#fafafa';
      fullCtx.fillRect(0, 0, svgW, svgH);
      fullCtx.drawImage(img, 0, 0, svgW, svgH);
      URL.revokeObjectURL(svgUrl);

      const pageCss = pageSize === 'A3' ? 'A3 portrait' : 'A4 portrait';

      // A3: схема целиком на 1 листе; A4: делим пополам на 2 листа
      let schemaPages = '';
      if (pageSize === 'A3') {
        const png = fullCanvas.toDataURL('image/png');
        schemaPages = `<img class="schema-img" src="${png}" /><div class="footer">Блок-схема оценки компетенций · Лист 1 из 2</div>`;
      } else {
        const halfH = Math.ceil(svgH / 2);
        const topCanvas = document.createElement('canvas');
        topCanvas.width = svgW; topCanvas.height = halfH;
        const topCtx = topCanvas.getContext('2d')!;
        topCtx.fillStyle = '#fafafa'; topCtx.fillRect(0, 0, svgW, halfH);
        topCtx.drawImage(fullCanvas, 0, 0, svgW, halfH, 0, 0, svgW, halfH);
        const png1 = topCanvas.toDataURL('image/png');

        const botCanvas = document.createElement('canvas');
        botCanvas.width = svgW; botCanvas.height = svgH - halfH;
        const botCtx = botCanvas.getContext('2d')!;
        botCtx.fillStyle = '#fafafa'; botCtx.fillRect(0, 0, svgW, svgH - halfH);
        botCtx.drawImage(fullCanvas, 0, halfH, svgW, svgH - halfH, 0, 0, svgW, svgH - halfH);
        const png2 = botCanvas.toDataURL('image/png');

        schemaPages = `
          <img class="schema-img" src="${png1}" />
          <div class="footer">Блок-схема оценки компетенций · Лист 1 из 3</div>
          <div class="page-break">
            <img class="schema-img" src="${png2}" />
            <div class="footer">Блок-схема оценки компетенций · Лист 2 из 3</div>
          </div>`;
      }

      const legendHtml = `
        <div class="legend">
          <div class="legend-title">Условные обозначения</div>
          <div class="legend-items">
            <div class="legend-item"><div class="li-box round" style="background:#1a1a2e"></div><span>Начало / приём кандидата</span></div>
            <div class="legend-item"><div class="li-box bordered"></div><span>Действие / этап процесса</span></div>
            <div class="legend-item"><div class="li-box dashed"></div><span>Рандомное формирование</span></div>
            <div class="legend-item"><div class="li-diamond"></div><span>Решение (да / нет)</span></div>
            <div class="legend-item"><div class="li-box" style="background:#16a34a"></div><span>Положительный исход</span></div>
            <div class="legend-item"><div class="li-box" style="background:#dc2626"></div><span>Отказ / чёрный список</span></div>
            <div class="legend-item"><div class="li-doc"></div><span>Документ / отчётность</span></div>
          </div>
        </div>`;

      win!.document.write(`<!DOCTYPE html><html><head><title>Оценка компетенций при найме</title>
        <style>
          @page { size: ${pageCss}; margin: 8mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; color: #1a1a2e; background: #fff; }
          h1 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
          .subtitle { font-size: 11px; color: #64748b; margin-bottom: 12px; }
          .schema-img { display: block; width: 100%; height: auto; }
          h2 { font-size: 14px; font-weight: 700; margin: 14px 0 10px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          .steps { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .step { display: flex; gap: 10px; align-items: flex-start; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; }
          .step-num { min-width: 28px; height: 28px; background: #1a1a2e; color: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
          .step-title { font-size: 13px; font-weight: 600; }
          .step-desc { font-size: 11px; color: #64748b; margin-top: 2px; }
          .rules { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 10px; }
          .rule { border-radius: 8px; padding: 8px 10px; border: 1px solid; }
          .rule.pass { background: #f0fdf4; border-color: #86efac; }
          .rule.retry { background: #fff7ed; border-color: #fdba74; }
          .rule.fail { background: #fef2f2; border-color: #fca5a5; }
          .rule-title { font-size: 12px; font-weight: 700; margin-bottom: 3px; }
          .rule.pass .rule-title { color: #166534; }
          .rule.retry .rule-title { color: #9a3412; }
          .rule.fail .rule-title { color: #991b1b; }
          .rule-desc { font-size: 10px; color: #475569; }
          .legend { margin-top: 14px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; }
          .legend-title { font-size: 12px; font-weight: 700; margin-bottom: 8px; }
          .legend-items { display: flex; flex-wrap: wrap; gap: 8px 20px; }
          .legend-item { display: flex; align-items: center; gap: 7px; font-size: 11px; }
          .li-box { width: 22px; height: 16px; border-radius: 3px; shrink: 0; }
          .li-box.round { border-radius: 8px; }
          .li-box.bordered { background: #fff; border: 1.5px solid #1a1a2e; }
          .li-box.dashed { background: #f0f9ff; border: 1.5px dashed #0ea5e9; }
          .li-diamond { width: 16px; height: 16px; background: #fff7ed; border: 1.5px solid #ea580c; transform: rotate(45deg); flex-shrink: 0; }
          .li-doc { width: 22px; height: 16px; background: #eff6ff; border: 1.5px solid #1a1a2e; border-radius: 2px 2px 0 0; clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%); }
          .page-break { page-break-before: always; padding-top: 4px; }
          .footer { margin-top: 10px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 6px; }
        </style></head><body>
        ${schemaPages}
        <div class="page-break">
          <h1>Оценка компетенций при найме рабочих</h1>
          <div class="subtitle">40–170 кандидатов в день · 15 профессий · 10 вопросов (5+5) · проходной балл ≥ 7</div>
          <h2 style="border-top:none; padding-top:0; margin-top:8px;">Этапы процесса</h2>
          <div class="steps">${stepsHtml}</div>
          <div class="rules">
            <div class="rule pass"><div class="rule-title">Прошёл</div><div class="rule-desc">7 и более верных ответов — допуск к оформлению на работу.</div></div>
            <div class="rule retry"><div class="rule-title">Повтор</div><div class="rule-desc">Менее 7 — одна повторная попытка пройти конкурс.</div></div>
            <div class="rule fail"><div class="rule-title">Чёрный список</div><div class="rule-desc">Провал повторной попытки — отказ в приёме.</div></div>
          </div>
          ${legendHtml}
          <div class="footer">Бизнес-процесс оценки компетенций при найме рабочих · Этапы процесса</div>
        </div>
        <script>window.onload=function(){window.print();window.close();}</` + `script></body></html>`);
      win!.document.close();
    };
    img.src = svgUrl;
  };

  const downloadPNG = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const src = new XMLSerializer().serializeToString(svgEl);
    const scale = 2;
    const w = 900 * scale;
    const h = 1330 * scale;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([src], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.download = 'biznes-process-ocenki-kompetenciy.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  };

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const src = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${src}`], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'biznes-process-ocenki-kompetenciy.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a2e]">
      {/* Print format dialog */}
      {showPrintDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowPrintDialog(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-80 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Формат страницы</h2>
              <button onClick={() => setShowPrintDialog(false)} className="text-[#94a3b8] hover:text-[#1a1a2e]">
                <Icon name="X" size={18} />
              </button>
            </div>
            <p className="text-sm text-[#64748b]">Выберите размер бумаги для печати</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => printChart('A4')}
                className="flex items-center gap-4 border-2 border-[#e2e8f0] hover:border-[#1a1a2e] rounded-xl p-4 text-left transition-colors group"
              >
                <div className="w-10 h-14 border-2 border-current rounded flex items-center justify-center text-[#1a1a2e] text-xs font-mono font-bold shrink-0">A4</div>
                <div>
                  <p className="font-semibold text-[#1a1a2e]">A4 — стандартный</p>
                  <p className="text-xs text-[#64748b] mt-0.5">210 × 297 мм · обычный офисный принтер</p>
                </div>
              </button>
              <button
                onClick={() => printChart('A3')}
                className="flex items-center gap-4 border-2 border-[#e2e8f0] hover:border-[#1a1a2e] rounded-xl p-4 text-left transition-colors group"
              >
                <div className="w-10 h-14 border-2 border-current rounded flex items-center justify-center text-[#1a1a2e] text-xs font-mono font-bold shrink-0">A3</div>
                <div>
                  <p className="font-semibold text-[#1a1a2e]">A3 — увеличенный</p>
                  <p className="text-xs text-[#64748b] mt-0.5">297 × 420 мм · крупный плакат, наглядно</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="border-b border-[#e2e8f0] bg-white">
        <div className="container py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center">
              <Icon name="Workflow" className="text-white" size={20} />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#64748b]">Бизнес-процесс</p>
              <h1 className="text-lg font-bold leading-tight">Оценка компетенций при найме</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadPNG} variant="outline" className="gap-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white">
              <Icon name="Image" size={16} />
              Скачать PNG
            </Button>
            <Button onClick={() => setShowPrintDialog(true)} variant="outline" className="gap-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white">
              <Icon name="Printer" size={16} />
              Печать
            </Button>
            <Button onClick={downloadSVG} className="bg-[#1a1a2e] hover:bg-[#33334d] gap-2">
              <Icon name="Download" size={16} />
              Скачать SVG
            </Button>
          </div>
        </div>
      </header>

      {/* Hero / metrics */}
      <section className="container pt-12 pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#ea580c] mb-3">Блок-схема процесса</p>
        <h2 className="text-3xl md:text-4xl font-bold max-w-2xl leading-tight">
          Алгоритм оценки рабочих по профессиональным компетенциям
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { v: '40–170', l: 'кандидатов в день', i: 'Users' },
            { v: '15', l: 'профессий', i: 'Briefcase' },
            { v: '10', l: 'вопросов (5+5)', i: 'ListChecks' },
            { v: '≥ 7', l: 'проходной балл', i: 'Target' },
          ].map((m) => (
            <div key={m.l} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
              <Icon name={m.i} size={20} className="text-[#ea580c] mb-3" />
              <p className="text-2xl font-bold font-mono">{m.v}</p>
              <p className="text-sm text-[#64748b] mt-1">{m.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flowchart */}
      <section className="container pb-12">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 md:p-8 overflow-x-auto">
          <div className="min-w-[640px] max-w-[820px] mx-auto">
            <FlowchartSVG ref={svgRef} />
          </div>
        </div>
      </section>

      {/* Steps detail */}
      <section className="container pb-20">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Icon name="ListOrdered" size={22} className="text-[#ea580c]" />
          Этапы процесса
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex gap-4 hover:border-[#1a1a2e] transition-colors">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-[#1a1a2e] text-white font-mono font-semibold flex items-center justify-center">
                {s.n}
              </div>
              <div>
                <p className="font-semibold">{s.t}</p>
                <p className="text-sm text-[#64748b] mt-0.5">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* rules */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="rounded-xl p-5 bg-[#f0fdf4] border border-[#16a34a]/30">
            <Icon name="CircleCheck" size={22} className="text-[#16a34a] mb-2" />
            <p className="font-semibold text-[#166534]">Прошёл</p>
            <p className="text-sm text-[#15803d] mt-1">7 и более верных ответов — допуск к оформлению на работу.</p>
          </div>
          <div className="rounded-xl p-5 bg-[#fff7ed] border border-[#ea580c]/30">
            <Icon name="RotateCcw" size={22} className="text-[#ea580c] mb-2" />
            <p className="font-semibold text-[#9a3412]">Повтор</p>
            <p className="text-sm text-[#c2410c] mt-1">Менее 7 — одна повторная попытка пройти конкурс.</p>
          </div>
          <div className="rounded-xl p-5 bg-[#fef2f2] border border-[#dc2626]/30">
            <Icon name="Ban" size={22} className="text-[#dc2626] mb-2" />
            <p className="font-semibold text-[#991b1b]">Чёрный список</p>
            <p className="text-sm text-[#dc2626] mt-1">Провал повторной попытки — отказ в приёме.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e2e8f0] py-6">
        <p className="container font-mono text-xs text-[#94a3b8]">
          Редактируемая SVG-схема · откройте в Figma, Illustrator или браузере для правок
        </p>
      </footer>
    </div>
  );
}