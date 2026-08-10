import funcUrls from '../../backend/func2url.json';

export const CLAIMS_URL = (funcUrls as Record<string, string>)['warranty-claims'];

export type Claim = {
  id: number;
  employee_name: string;
  position: string | null;
  agency: string;
  hire_date: string | null;
  fire_date: string | null;
  tenure_months: number | null;
  recruitment_cost: number | null;
  guarantee_months: number | null;
  claim_status: ClaimStatus;
  claim_date: string | null;
  deadline: string | null;
  replacement_date: string | null;
  comment: string | null;
};

export type ClaimStatus = 'not_filed' | 'filed' | 'replaced' | 'refused' | 'expired';

export type ClaimStats = Partial<Record<ClaimStatus, { count: number; sum: number }>>;

export const STATUS_META: Record<ClaimStatus, { label: string; cls: string; dot: string }> = {
  not_filed: { label: 'Не заявлена', cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  filed: { label: 'Заявлена', cls: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  replaced: { label: 'Замена сделана', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  refused: { label: 'Отказ агентства', cls: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
  expired: { label: 'Срок упущен', cls: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
};

export const AGENCY_OPTIONS = [
  'КА ЭФИР',
  'КА Вектор К',
  'КА A.N.T.',
  'КА Cornerstone',
  'КА Визави Консалт',
  'ИП Мухин',
  'КА ПрофиСтафф',
];

export const GUARANTEE_BY_AGENCY: Record<string, number> = {
  'КА ЭФИР': 6,
  'КА Вектор К': 5,
  'КА A.N.T.': 3,
  'КА Cornerstone': 5,
  'КА Визави Консалт': 6,
  'ИП Мухин': 8,
  'КА ПрофиСтафф': 3,
};

export async function fetchClaims(): Promise<{ items: Claim[]; stats: ClaimStats }> {
  const r = await fetch(CLAIMS_URL);
  if (!r.ok) throw new Error('Не удалось загрузить журнал');
  return r.json();
}

export async function saveClaim(data: Partial<Claim>): Promise<Claim> {
  const r = await fetch(CLAIMS_URL, {
    method: data.id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error('Не удалось сохранить запись');
  return r.json();
}

export async function deleteClaim(id: number): Promise<void> {
  const r = await fetch(`${CLAIMS_URL}?id=${id}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('Не удалось удалить запись');
}

export const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('ru-RU') : '—');

export const fmtMoney = (v: number | null) => (v ? `${Math.round(v).toLocaleString('ru-RU')} ₽` : '—');

export function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

export function calcDeadline(guaranteeMonths: number | null, hireDate: string | null) {
  if (!hireDate || !guaranteeMonths) return '';
  const d = new Date(hireDate);
  d.setMonth(d.getMonth() + guaranteeMonths);
  return d.toISOString().slice(0, 10);
}