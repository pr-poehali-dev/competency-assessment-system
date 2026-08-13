import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { formatNoteDate, type PlanNote } from '@/lib/planNotes';

const MAX = 280;

type Props = {
  taskId: string;
  note?: PlanNote;
  onSave: (id: string, text: string) => void;
};

export default function TaskNote({ taskId, note, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(note?.text ?? '');
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(note?.text ?? '');
  }, [note?.text]);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  const commit = () => {
    onSave(taskId, value);
    setOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cancel = () => {
    setValue(note?.text ?? '');
    setOpen(false);
  };

  if (!open) {
    return (
      <div className="sm:col-span-2 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Ход выполнения</div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="no-print text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
          >
            <Icon name={note ? 'Pencil' : 'Plus'} size={13} />
            {note ? 'Изменить' : 'Добавить комментарий'}
          </button>
        </div>

        {note ? (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
            <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{note.text}</p>
            <div className="text-[11px] text-amber-700/70 mt-1.5">Обновлено {formatNoteDate(note.updatedAt)}</div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="no-print w-full text-left rounded-lg border border-dashed border-slate-200 px-3 py-2.5 text-sm text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-colors"
          >
            Что уже сделано и что мешает — запишите коротко
          </button>
        )}

        {saved && (
          <div className="no-print text-[11px] text-emerald-600 mt-1.5 inline-flex items-center gap-1">
            <Icon name="Check" size={12} />
            Сохранено
          </div>
        )}

        {!note && <div className="print-only text-sm text-slate-300">—</div>}
      </div>
    );
  }

  return (
    <div className="sm:col-span-2 border-t border-slate-100 pt-3 no-print">
      <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1.5">Ход выполнения</div>
      <textarea
        ref={ref}
        value={value}
        maxLength={MAX}
        rows={3}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancel();
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit();
        }}
        placeholder="Например: анкету согласовали с юристами, ждём доступ в 1С"
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 leading-relaxed resize-none outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400"
      />
      <div className="flex items-center justify-between gap-3 mt-2">
        <span className="text-[11px] text-slate-400">
          {value.length} из {MAX}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cancel}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={commit}
            className="text-xs font-medium text-white bg-[#1a1a2e] hover:bg-[#2d2d4a] px-3 py-1.5 rounded-lg transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
