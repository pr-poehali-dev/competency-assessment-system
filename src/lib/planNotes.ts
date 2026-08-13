import { useEffect, useState } from 'react';
import funcUrls from '../../backend/func2url.json';
import type { PlanStatus } from '@/data/plan';

const API = (funcUrls as Record<string, string>)['plan-state'];
const AUTHOR_KEY = 'plan-author-v1';

export type PlanEntry = {
  status: PlanStatus;
  note: string;
  author: string;
  updatedAt: string;
};

export type PlanState = Record<string, PlanEntry>;

export type SyncState = 'loading' | 'ready' | 'saving' | 'error';

export function getAuthor() {
  try {
    return localStorage.getItem(AUTHOR_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setAuthor(name: string) {
  try {
    localStorage.setItem(AUTHOR_KEY, name.trim().slice(0, 120));
  } catch {
    /* хранилище недоступно */
  }
}

let shared: { entries: PlanState; sync: SyncState } = { entries: {}, sync: 'loading' };
const listeners = new Set<() => void>();

function publish(next: Partial<typeof shared>) {
  shared = { ...shared, ...next };
  listeners.forEach((fn) => fn());
}

let started = false;
let timer: number | null = null;

async function load(silent = false) {
  if (!silent) publish({ sync: 'loading' });
  try {
    const res = await fetch(API, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error('load failed');
    const data = (await res.json()) as { tasks: PlanState };
    publish({ entries: data.tasks ?? {}, sync: 'ready' });
  } catch {
    publish({ sync: 'error' });
  }
}

async function saveTask(taskId: string, patch: { status?: PlanStatus; note?: string }) {
  publish({ sync: 'saving' });

  const current = shared.entries[taskId];
  const next: PlanEntry = {
    status: patch.status ?? current?.status ?? 'todo',
    note: patch.note ?? current?.note ?? '',
    author: getAuthor(),
    updatedAt: new Date().toISOString(),
  };
  publish({ entries: { ...shared.entries, [taskId]: next } });

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status: next.status, note: next.note, author: next.author }),
    });
    if (!res.ok) throw new Error('save failed');
    const data = (await res.json()) as { tasks: PlanState };
    publish({ entries: data.tasks ?? {}, sync: 'ready' });
    return true;
  } catch {
    publish({ sync: 'error' });
    return false;
  }
}

export function usePlanState() {
  const [, force] = useState(0);

  useEffect(() => {
    const listener = () => force((n) => n + 1);
    listeners.add(listener);

    if (!started) {
      started = true;
      void load();
      timer = window.setInterval(() => void load(true), 30000);
      window.addEventListener('focus', () => void load(true));
    }

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && timer) {
        window.clearInterval(timer);
        timer = null;
        started = false;
      }
    };
  }, []);

  return {
    entries: shared.entries,
    sync: shared.sync,
    save: saveTask,
    reload: () => load(true),
  };
}

export function formatNoteDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) return `сегодня в ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}