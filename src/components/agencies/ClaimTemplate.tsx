import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Claim, fmtMoney } from '@/lib/claims';
import { downloadClaimDoc } from '@/lib/claimDoc';

const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('ru-RU') : '__.__.____');

const PLACEHOLDER: Partial<Claim> = {
  employee_name: 'Иванов Иван Иванович',
  position: 'помощник руководителя',
  agency: 'КА ЭФИР',
  hire_date: null,
  fire_date: null,
  tenure_months: null,
  recruitment_cost: null,
  guarantee_months: 6,
};

export default function ClaimTemplate({ items }: { items: Claim[] }) {
  const [open, setOpen] = useState(false);
  const [pickedId, setPickedId] = useState<number | 'none'>('none');
  const [copied, setCopied] = useState(false);

  const candidates = useMemo(() => items.filter((i) => i.claim_status === 'not_filed'), [items]);

  const c = useMemo<Partial<Claim>>(() => {
    if (pickedId === 'none') return PLACEHOLDER;
    return candidates.find((i) => i.id === pickedId) ?? PLACEHOLDER;
  }, [pickedId, candidates]);

  const text = useMemo(() => {
    const cost = c.recruitment_cost ? fmtMoney(c.recruitment_cost) : '__________ ₽';
    const tenure = c.tenure_months !== null && c.tenure_months !== undefined ? `${c.tenure_months}` : '__';
    const guarantee = c.guarantee_months ?? 6;

    return `Руководителю ${c.agency ?? '__________'}

Исх. № ______ от ${new Date().toLocaleDateString('ru-RU')}

ПРЕТЕНЗИЯ
о гарантийной замене подобранного кандидата

В рамках договора возмездного оказания услуг по подбору персонала Вашим агентством был подобран кандидат ${c.employee_name ?? '__________'} на позицию «${c.position ?? '__________'}».

Кандидат принят на работу ${fmtDate(c.hire_date ?? null)}, стоимость услуг по подбору составила ${cost} и была оплачена в полном объёме.

Трудовые отношения с сотрудником прекращены ${fmtDate(c.fire_date ?? null)}. Фактический срок работы составил ${tenure} мес., что не выходит за пределы гарантийного срока в ${guarantee} мес., установленного договором.

На основании изложенного и в соответствии с условиями договора требуем:
1. Произвести бесплатную замену указанного кандидата в срок не более 30 календарных дней с даты получения настоящей претензии.
2. При невозможности замены — вернуть уплаченную сумму ${cost} в течение 10 банковских дней.
3. Направить письменный ответ на настоящую претензию в срок не более 10 рабочих дней.

Приложения:
1. Копия приказа о приёме на работу.
2. Копия приказа о прекращении трудового договора.
3. Копия акта оказанных услуг и платёжного поручения.

_______________________ / __________________
        должность                    подпись, Ф. И. О.`;
  }, [c]);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mt-3 rounded-lg border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <Icon name="FileText" size={15} className="text-slate-500 shrink-0" />
        <span className="text-xs font-medium text-slate-700">Образец претензии агентству</span>
        <span className="text-[11px] text-slate-400 ml-auto no-print flex items-center gap-1">
          {open ? 'свернуть' : 'посмотреть и скопировать'}
          <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={14} />
        </span>
      </button>

      {open && (
        <div className="p-3.5 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-2 mb-3 no-print">
            {candidates.length > 0 && (
              <select
                value={pickedId}
                onChange={(e) => setPickedId(e.target.value === 'none' ? 'none' : Number(e.target.value))}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 max-w-full"
              >
                <option value="none">Пустой бланк</option>
                {candidates.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.employee_name} · {i.agency}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => downloadClaimDoc(text, c.employee_name)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg px-3 py-1.5 hover:bg-slate-700 transition-colors"
            >
              <Icon name="Download" size={14} />
              Скачать в Word
            </button>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 border border-slate-200 bg-white rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
            >
              <Icon name={copied ? 'Check' : 'Copy'} size={14} />
              {copied ? 'Скопировано' : 'Скопировать текст'}
            </button>
          </div>

          <pre className="text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap font-sans bg-slate-50 border border-slate-200 rounded-lg p-3.5 max-h-80 overflow-y-auto">
            {text}
          </pre>

          <p className="text-[11px] text-slate-400 mt-2 leading-snug">
            Файл открывается в Word и готов к печати на бланке. Перед отправкой сверьте номер договора, реквизиты и
            срок гарантии — они отличаются у разных агентств. Претензию лучше направлять письмом с подтверждением
            получения.
          </p>
        </div>
      )}
    </div>
  );
}