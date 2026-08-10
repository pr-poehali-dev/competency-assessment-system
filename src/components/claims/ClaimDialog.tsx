import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  Claim,
  ClaimStatus,
  STATUS_META,
  AGENCY_OPTIONS,
  GUARANTEE_BY_AGENCY,
  calcDeadline,
  saveClaim,
} from '@/lib/claims';

type Props = {
  open: boolean;
  claim: Partial<Claim> | null;
  onClose: () => void;
  onSaved: () => void;
};

const empty: Partial<Claim> = {
  employee_name: '',
  position: '',
  agency: 'КА ЭФИР',
  hire_date: '',
  fire_date: '',
  recruitment_cost: null,
  guarantee_months: 6,
  claim_status: 'not_filed',
  claim_date: '',
  deadline: '',
  comment: '',
};

export default function ClaimDialog({ open, claim, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Partial<Claim>>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(claim ? { ...empty, ...claim } : empty);
      setError('');
    }
  }, [open, claim]);

  if (!open) return null;

  const set = (k: keyof Claim, v: string | number | null) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === 'agency' && typeof v === 'string') {
        next.guarantee_months = GUARANTEE_BY_AGENCY[v] ?? 3;
      }
      if (k === 'agency' || k === 'hire_date' || k === 'guarantee_months') {
        const auto = calcDeadline(next.guarantee_months ?? null, next.hire_date ?? null);
        if (auto) next.deadline = auto;
      }
      return next;
    });
  };

  const submit = async () => {
    if (!form.employee_name?.trim()) {
      setError('Укажите фамилию и имя сотрудника');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await saveClaim(form);
      onSaved();
      onClose();
    } catch {
      setError('Не удалось сохранить. Попробуйте ещё раз.');
    } finally {
      setSaving(false);
    }
  };

  const field = 'w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400';
  const label = 'block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:p-8">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
              <Icon name="FilePlus2" size={18} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                {claim?.id ? 'Изменить претензию' : 'Новая претензия'}
              </div>
              <div className="text-xs text-slate-500">Уволившийся сотрудник и статус гарантийной замены</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Сотрудник</label>
              <input
                className={field}
                value={form.employee_name ?? ''}
                onChange={(e) => set('employee_name', e.target.value)}
                placeholder="Иванов Иван"
              />
            </div>
            <div>
              <label className={label}>Должность</label>
              <input
                className={field}
                value={form.position ?? ''}
                onChange={(e) => set('position', e.target.value)}
                placeholder="Помощник руководителя"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={label}>Агентство</label>
              <select className={field} value={form.agency ?? ''} onChange={(e) => set('agency', e.target.value)}>
                {AGENCY_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Гарантия, мес.</label>
              <input
                type="number"
                className={field}
                value={form.guarantee_months ?? ''}
                onChange={(e) => set('guarantee_months', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div>
              <label className={label}>Стоимость подбора, ₽</label>
              <input
                type="number"
                className={field}
                value={form.recruitment_cost ?? ''}
                onChange={(e) => set('recruitment_cost', e.target.value ? Number(e.target.value) : null)}
                placeholder="220500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={label}>Дата приёма</label>
              <input
                type="date"
                className={field}
                value={form.hire_date ?? ''}
                onChange={(e) => set('hire_date', e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Дата увольнения</label>
              <input
                type="date"
                className={field}
                value={form.fire_date ?? ''}
                onChange={(e) => set('fire_date', e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Срок подачи претензии</label>
              <input
                type="date"
                className={field}
                value={form.deadline ?? ''}
                onChange={(e) => set('deadline', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={label}>Статус претензии</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_META) as ClaimStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => set('claim_status', s)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    form.claim_status === s
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Дата подачи претензии</label>
              <input
                type="date"
                className={field}
                value={form.claim_date ?? ''}
                onChange={(e) => set('claim_date', e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Дата выхода замены</label>
              <input
                type="date"
                className={field}
                value={form.replacement_date ?? ''}
                onChange={(e) => set('replacement_date', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={label}>Комментарий</label>
            <textarea
              className={`${field} min-h-[70px] resize-y`}
              value={form.comment ?? ''}
              onChange={(e) => set('comment', e.target.value)}
              placeholder="Причина ухода, переписка с агентством, договорённости"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="text-sm font-medium text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Сохраняю…' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}