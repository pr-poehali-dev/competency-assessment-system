import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import ClaimDialog from '@/components/claims/ClaimDialog';
import {
  Claim,
  ClaimStats,
  ClaimStatus,
  STATUS_META,
  fetchClaims,
  deleteClaim,
  fmtDate,
  fmtMoney,
  daysLeft,
} from '@/lib/claims';

export default function Claims() {
  const [items, setItems] = useState<Claim[]>([]);
  const [stats, setStats] = useState<ClaimStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<ClaimStatus | 'all'>('all');
  const [dialog, setDialog] = useState<{ open: boolean; claim: Partial<Claim> | null }>({
    open: false,
    claim: null,
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchClaims();
      setItems(data.items);
      setStats(data.stats);
      setError('');
    } catch {
      setError('Не удалось загрузить журнал');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm('Удалить запись из журнала?')) return;
    await deleteClaim(id);
    load();
  };

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.claim_status === filter)),
    [items, filter],
  );

  const totals = useMemo(() => {
    const pending = items.filter((i) => i.claim_status === 'not_filed');
    const filed = items.filter((i) => i.claim_status === 'filed');
    const replaced = items.filter((i) => i.claim_status === 'replaced');
    const urgent = pending.filter((i) => {
      const d = daysLeft(i.deadline);
      return d !== null && d >= 0 && d <= 30;
    });
    const sum = (arr: Claim[]) => arr.reduce((s, i) => s + (i.recruitment_cost ?? 0), 0);
    return {
      pending: pending.length,
      pendingSum: sum(pending),
      filed: filed.length,
      replaced: replaced.length,
      replacedSum: sum(replaced),
      urgent: urgent.length,
    };
  }, [items]);

  const kpis = [
    { v: `${items.length}`, l: 'записей в журнале', tone: 'text-slate-900' },
    { v: `${totals.pending}`, l: 'претензий не заявлено', tone: 'text-rose-600' },
    { v: `${totals.urgent}`, l: 'срок истекает в 30 дней', tone: 'text-amber-600' },
    { v: fmtMoney(totals.replacedSum), l: 'возвращено заменами', tone: 'text-emerald-600' },
  ];

  const chips: { key: ClaimStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'Все' },
    ...(Object.keys(STATUS_META) as ClaimStatus[]).map((k) => ({ key: k, label: STATUS_META[k].label })),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Icon name="ClipboardList" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">Контроль гарантий</div>
              <div className="font-semibold text-slate-900 leading-tight">Журнал гарантийных претензий</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/agencies"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
            >
              <Icon name="Handshake" size={16} />
              <span className="hidden sm:inline">Дашборд агентств</span>
            </Link>
            <button
              onClick={() => setDialog({ open: true, claim: null })}
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-slate-900 rounded-lg px-4 py-2 hover:bg-slate-700 transition-colors"
            >
              <Icon name="Plus" size={16} />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((k) => (
            <div key={k.l} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className={`text-xl font-bold tabular-nums ${k.tone}`}>{k.v}</div>
              <div className="text-xs text-slate-600 mt-1 leading-snug">{k.l}</div>
            </div>
          ))}
        </div>

        {totals.pending > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <Icon name="TriangleAlert" size={18} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-rose-900">
                {totals.pending} претензий на {fmtMoney(totals.pendingSum)} ещё не заявлены
              </div>
              <p className="text-xs text-rose-800 mt-0.5 leading-snug">
                Гарантия работает только при письменном обращении в срок. Пока претензия не подана, агентство не обязано
                делать бесплатную замену.
              </p>
            </div>
          </div>
        )}

        <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <Icon name="Info" size={16} className="text-sky-600 shrink-0 mt-0.5" />
          <p className="text-xs text-sky-900 leading-snug">
            Сейчас в журнале образцы записей, чтобы показать все статусы. Удалите их и заведите реальные случаи —
            фамилии, даты и суммы возьмите из отчётов по уволившимся.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const count = c.key === 'all' ? items.length : (stats[c.key as ClaimStatus]?.count ?? 0);
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  filter === c.key
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c.label}
                <span className={filter === c.key ? 'ml-1.5 text-white/60' : 'ml-1.5 text-slate-400'}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">Загружаю журнал…</div>
          ) : error ? (
            <div className="p-12 text-center text-sm text-rose-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Icon name="ClipboardList" size={32} className="text-slate-300 mx-auto mb-3" />
              <div className="text-sm font-medium text-slate-700">
                {items.length === 0 ? 'Журнал пока пуст' : 'Нет записей с таким статусом'}
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-snug">
                Добавьте уволившихся сотрудников, нанятых через агентства, чтобы контролировать сроки претензий и
                бесплатные замены.
              </p>
              {items.length === 0 && (
                <button
                  onClick={() => setDialog({ open: true, claim: null })}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white bg-slate-900 rounded-lg px-4 py-2 hover:bg-slate-700 transition-colors"
                >
                  <Icon name="Plus" size={16} />
                  Добавить первую запись
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-200">
                    <th className="px-4 py-3 font-semibold">Сотрудник</th>
                    <th className="px-4 py-3 font-semibold">Агентство</th>
                    <th className="px-4 py-3 font-semibold">Приём / уход</th>
                    <th className="px-4 py-3 font-semibold text-right">Стоимость</th>
                    <th className="px-4 py-3 font-semibold">Срок претензии</th>
                    <th className="px-4 py-3 font-semibold">Статус</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((c) => {
                    const dl = daysLeft(c.deadline);
                    const meta = STATUS_META[c.claim_status];
                    const urgent = c.claim_status === 'not_filed' && dl !== null && dl <= 30;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{c.employee_name}</div>
                          {c.position && <div className="text-xs text-slate-500">{c.position}</div>}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {c.agency}
                          {c.guarantee_months && (
                            <div className="text-xs text-slate-400">гарантия {c.guarantee_months} мес.</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                          {fmtDate(c.hire_date)} → {fmtDate(c.fire_date)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                          {fmtMoney(c.recruitment_cost)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-slate-700">{fmtDate(c.deadline)}</div>
                          {dl !== null && c.claim_status === 'not_filed' && (
                            <div className={`text-[11px] ${urgent ? 'text-rose-600 font-medium' : 'text-slate-400'}`}>
                              {dl < 0 ? 'срок истёк' : `осталось ${dl} дн.`}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full ${meta.cls}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setDialog({ open: true, claim: c })}
                              className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            >
                              <Icon name="Pencil" size={15} />
                            </button>
                            <button
                              onClick={() => remove(c.id)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Icon name="Trash2" size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
              <Icon name="Info" size={18} className="text-sky-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Как пользоваться журналом</h3>
              <ul className="space-y-1 text-xs text-slate-600 leading-snug">
                <li className="flex gap-1.5">
                  <span className="text-slate-300">·</span>
                  Заводите запись сразу при увольнении сотрудника, нанятого через агентство.
                </li>
                <li className="flex gap-1.5">
                  <span className="text-slate-300">·</span>
                  Срок претензии считается автоматически от даты приёма и гарантии по договору.
                </li>
                <li className="flex gap-1.5">
                  <span className="text-slate-300">·</span>
                  Статус «Не заявлена» с истекающим сроком подсвечивается красным — это деньги, которые можно потерять.
                </li>
                <li className="flex gap-1.5">
                  <span className="text-slate-300">·</span>
                  Данные сохраняются в базе и доступны всем сотрудникам с любого устройства.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <ClaimDialog
        open={dialog.open}
        claim={dialog.claim}
        onClose={() => setDialog({ open: false, claim: null })}
        onSaved={load}
      />
    </div>
  );
}