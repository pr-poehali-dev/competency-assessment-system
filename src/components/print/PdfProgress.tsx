import Icon from '@/components/ui/icon';

export type PdfState = { percent: number; label: string; format: string } | null;

export default function PdfProgress({ state }: { state: PdfState }) {
  if (!state) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center shrink-0">
            <Icon name="FileDown" size={20} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 leading-tight">Готовлю PDF в формате {state.format}</div>
            <div className="text-xs text-slate-500 mt-0.5">{state.label}</div>
          </div>
        </div>

        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-[#1a1a2e] transition-all duration-300 rounded-full"
            style={{ width: `${state.percent}%` }}
          />
        </div>
        <div className="text-right text-xs text-slate-400 mt-2">{state.percent}%</div>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          Файл скачается автоматически с уже заданным размером листа — настраивать формат в окне печати не нужно.
        </p>
      </div>
    </div>
  );
}
