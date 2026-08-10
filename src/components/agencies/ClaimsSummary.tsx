import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Claim, fetchClaims, fmtMoney, daysLeft } from '@/lib/claims';
import { COVERED_SUM, money } from '@/data/agencyTerms';
import ClaimTemplate from '@/components/agencies/ClaimTemplate';

export default function ClaimsSummary() {
  const [items, setItems] = useState<Claim[] | null>(null);

  useEffect(() => {
    fetchClaims()
      .then((d) => setItems(d.items))
      .catch(() => setItems([]));
  }, []);

  const pending = (items ?? []).filter((i) => i.claim_status === 'not_filed');
  const filed = (items ?? []).filter((i) => i.claim_status === 'filed');
  const replaced = (items ?? []).filter((i) => i.claim_status === 'replaced');
  const urgent = pending.filter((i) => {
    const d = daysLeft(i.deadline);
    return d !== null && d >= 0 && d <= 30;
  });
  const sum = (arr: Claim[]) => arr.reduce((s, i) => s + (i.recruitment_cost ?? 0), 0);

  const empty = items !== null && items.length === 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-block">
      <div className="p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <Icon name="ClipboardList" size={18} className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">Контроль гарантийных претензий</h3>
              <p className="text-sm text-slate-500">Учёт обращений к агентствам по уволившимся</p>
            </div>
            <Link
              to="/claims"
              className="no-print shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg px-3 py-2 hover:bg-slate-700 transition-colors"
            >
              <Icon name="ExternalLink" size={14} />
              Открыть журнал
            </Link>
          </div>

          {items === null ? (
            <div className="mt-4 text-sm text-slate-400">Загружаю данные журнала…</div>
          ) : empty ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="text-sm font-semibold text-amber-900">Журнал пока не заполнен</div>
              <p className="text-xs text-amber-800 mt-1 leading-snug">
                По расчёту выше около {money(COVERED_SUM)} подбора подпадает под гарантию бесплатной замены. Пока
                обращения не зафиксированы, невозможно подтвердить, что эти деньги отработаны агентствами.
              </p>
              <ClaimTemplate items={[]} />
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-4 gap-3 mt-4">
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xl font-bold text-slate-900 tabular-nums">{items.length}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">записей в журнале</div>
                </div>
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                  <div className="text-xl font-bold text-rose-600 tabular-nums">{pending.length}</div>
                  <div className="text-[11px] text-rose-800 mt-0.5 leading-snug">
                    не заявлено на {fmtMoney(sum(pending))}
                  </div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
                  <div className="text-xl font-bold text-sky-700 tabular-nums">{filed.length}</div>
                  <div className="text-[11px] text-sky-800 mt-0.5 leading-snug">претензий в работе</div>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <div className="text-xl font-bold text-emerald-700 tabular-nums">{fmtMoney(sum(replaced))}</div>
                  <div className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                    возвращено заменами ({replaced.length})
                  </div>
                </div>
              </div>

              {urgent.length > 0 && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 flex items-center gap-2">
                  <Icon name="Clock" size={15} className="text-amber-600 shrink-0" />
                  <span className="text-xs text-amber-900 leading-snug">
                    По {urgent.length} записям срок подачи претензии истекает в ближайшие 30 дней
                  </span>
                </div>
              )}

              <ClaimTemplate items={items} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}