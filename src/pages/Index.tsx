import { useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import FlowchartSVG from '@/components/FlowchartSVG';

const STEPS = [
  { n: '1', t: 'Выбор профессии', d: 'Кандидат указывает профессию из 15 доступных' },
  { n: '2', t: 'Заполнение ФИО', d: 'Регистрация участника тестирования' },
  { n: '3', t: 'Открытие теста', d: 'Запуск процедуры оценки' },
  { n: '4', t: 'Тест компетенций', d: '5 вопросов по профессиональным навыкам' },
  { n: '5', t: 'Техника безопасности', d: '5 вопросов на знание ТБ' },
  { n: '6', t: 'Подсчёт результатов', d: 'Проходной балл — не менее 7 из 10' },
  { n: '7', t: 'Оформление', d: 'Результаты подшиваются в личное дело' },
  { n: '8', t: 'Сводная ведомость', d: 'Накопительный учёт по профессиям' },
];

export default function Index() {
  const svgRef = useRef<SVGSVGElement>(null);

  const printChart = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const src = new XMLSerializer().serializeToString(svgEl);
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Блок-схема оценки компетенций</title>
      <style>
        @page { size: A4 landscape; margin: 10mm; }
        body { margin: 0; display: flex; justify-content: center; align-items: flex-start; background: #fff; }
        svg { width: 100%; height: auto; max-height: 100vh; }
        @media print { body { padding: 0; } }
      </style></head><body>${src}<script>window.onload=function(){window.print();window.close();}</` + `script></body></html>`);
    win.document.close();
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
            <Button onClick={printChart} variant="outline" className="gap-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white">
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