import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { formatNoteDate, getAuthor, setAuthor, type PlanEntry } from '@/lib/planNotes';
import { STATUS_META, STATUS_ORDER, type PlanStatus } from '@/data/plan';

const MAX = 280;

type Props = {
  taskId: string;
  entry?: PlanEntry;
  status: PlanStatus;
  onSave: (id: string, patch: { status?: PlanStatus; note?: string }) => Promise<boolean>;
};

export default function TaskNote({ taskId, entry, status, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(entry?.note ?? '');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(entry?.note ?? '');
  }, [entry?.note]);

  useEffect(() => {
    if (open) {
      setName(getAuthor());
      ref.current?.focus();
    }
  }, [open]);

  const commit = async () => {
    setBusy(true);
    setAuthor(name);
    const ok = await onSave(taskId, { note: value.trim() });
    setBusy(false);
    if (ok) setOpen(false);
  };

  const changeStatus = async (next: PlanStatus) => {
    if (next === status) return;
    setBusy(true);
    await onSave(taskId, { status: next });
    setBusy(false);
  };

  return (
    <div className="sm:col-span-2 border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-[11px] uppercase tracking-wide text-slate-400">Ход выполнения</div>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="no-print text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
          >
            <Icon name={entry?.note ? 'Pencil' : 'Plus'} size={13} />
            {entry?.note ? 'Изменить' : 'Добавить комментарий'}
          </button>
        )}
      </div>

      <div className="no-print flex flex-wrap gap-1.5 mb-2.5">
        {STATUS_ORDER.map((k) => {
          const active = k === status;
          const meta = STATUS_META[k];
          return (
            <button
              key={k}
              type="button"
              disabled={busy}
              onClick={() => void changeStatus(k)}
              className={`text-[11px] px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                active ? meta.chip : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${active ? meta.dot : 'bg-slate-200'}`} />
              {meta.label}
            </button>
          );
        })}
      </div>

      {open ? (
        <div className="no-print">
          <textarea
            ref={ref}
            value={value}
            maxLength={MAX}
            rows={3}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false);
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void commit();
            }}
            placeholder="Например: анкету согласовали с юристами, ждём доступ в 1С"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 leading-relaxed resize-none outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              maxLength={120}
              className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 outline-none focus:border-slate-400 w-40"
            />
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                {value.length} из {MAX}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Отмена
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void commit()}
                className="text-xs font-medium text-white bg-[#1a1a2e] hover:bg-[#2d2d4a] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
              >
                {busy ? 'Сохраняю…' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      ) : entry?.note ? (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
          <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{entry.note}</p>
          <div className="text-[11px] text-amber-700/70 mt-1.5">
            {entry.author ? `${entry.author} · ` : ''}
            обновлено {formatNoteDate(entry.updatedAt)}
          </div>
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
    </div>
  );
}
