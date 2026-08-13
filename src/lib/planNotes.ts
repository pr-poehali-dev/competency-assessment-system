import { useCallback, useEffect, useState } from 'react';

const KEY = 'plan-notes-v1';

export type PlanNote = {
  text: string;
  updatedAt: string;
};

type NotesMap = Record<string, PlanNote>;

function read(): NotesMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as NotesMap) : {};
  } catch {
    return {};
  }
}

function write(map: NotesMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* хранилище недоступно — комментарии останутся только на время сессии */
  }
  window.dispatchEvent(new Event('plan-notes-changed'));
}

export function usePlanNotes() {
  const [notes, setNotes] = useState<NotesMap>({});

  useEffect(() => {
    setNotes(read());
    const sync = () => setNotes(read());
    window.addEventListener('plan-notes-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('plan-notes-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const save = useCallback((id: string, text: string) => {
    const map = read();
    const clean = text.trim();
    if (clean) {
      map[id] = { text: clean, updatedAt: new Date().toISOString() };
    } else {
      delete map[id];
    }
    write(map);
  }, []);

  return { notes, save };
}

export function formatNoteDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}
