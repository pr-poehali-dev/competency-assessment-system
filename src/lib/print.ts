import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export type PageFormat = 'A4' | 'A3';

const PAGE_SIZE: Record<PageFormat, { widthMm: number; heightMm: number; marginMm: number; contentMm: number }> = {
  A4: { widthMm: 210, heightMm: 297, marginMm: 10, contentMm: 190 },
  A3: { widthMm: 297, heightMm: 420, marginMm: 12, contentMm: 273 },
};

const MM_TO_PX = 96 / 25.4;

function nextFrames(count: number) {
  return new Promise<void>((resolve) => {
    const step = (left: number) => {
      if (left <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(() => step(left - 1));
    };
    step(count);
  });
}

export function applyPrintFormat(format: PageFormat) {
  const root = document.documentElement;
  root.classList.remove('print-format-a4', 'print-format-a3');
  root.classList.add(`print-format-${format.toLowerCase()}`);

  const main = document.querySelector('main') as HTMLElement | null;
  if (main) {
    main.style.width = `${Math.round(PAGE_SIZE[format].contentMm * MM_TO_PX)}px`;
    main.style.maxWidth = 'none';
    main.style.marginLeft = 'auto';
    main.style.marginRight = 'auto';
  }
  window.dispatchEvent(new Event('resize'));
}

type Progress = (percent: number, label: string) => void;

export async function printReport(format: PageFormat, reportTitle: string, onProgress?: Progress) {
  const page = PAGE_SIZE[format];
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const humanDate = d.toLocaleDateString('ru-RU');

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await nextFrames(2);

  const source = document.querySelector('main') as HTMLElement | null;
  if (!source) return;

  onProgress?.(5, 'Готовлю отчёт');

  const widthPx = Math.round(page.contentMm * MM_TO_PX);
  const formatClass = `print-format-${format.toLowerCase()}`;
  const root = document.documentElement;
  const prevInline = source.getAttribute('style');

  root.classList.add(formatClass, 'print-measuring');
  source.style.width = `${widthPx}px`;
  source.style.maxWidth = 'none';
  source.style.marginLeft = 'auto';
  source.style.marginRight = 'auto';

  window.dispatchEvent(new Event('resize'));
  await nextFrames(3);
  await new Promise((r) => setTimeout(r, 600));
  window.dispatchEvent(new Event('resize'));
  await nextFrames(3);
  await new Promise((r) => setTimeout(r, 400));

  const restore = () => {
    root.classList.remove(formatClass, 'print-measuring');
    if (prevInline === null) source.removeAttribute('style');
    else source.setAttribute('style', prevInline);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
  };

  try {
    onProgress?.(20, 'Отрисовываю страницы');

    const canvas = await html2canvas(source, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      windowWidth: widthPx,
      onclone: (doc) => {
        doc.documentElement.classList.add(formatClass, 'print-measuring');
        doc.querySelectorAll('.no-print').forEach((n) => n.remove());
        const m = doc.querySelector('main') as HTMLElement | null;
        if (m) {
          m.style.width = `${widthPx}px`;
          m.style.maxWidth = 'none';
          m.style.padding = '0';
          m.style.margin = '0 auto';
        }
      },
    });

    const scaleY = canvas.height / source.scrollHeight;
    const baseTop = source.getBoundingClientRect().top + window.scrollY;
    const breaks: number[] = [];
    source.querySelectorAll('.print-block, .print-page-break, .print-cover').forEach((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      breaks.push(Math.round((r.top + window.scrollY - baseTop) * scaleY));
      breaks.push(Math.round((r.bottom + window.scrollY - baseTop) * scaleY));
    });
    const stops = Array.from(new Set(breaks.filter((v) => v > 0))).sort((a, b) => a - b);

    restore();
    onProgress?.(65, 'Собираю PDF');

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: format.toLowerCase() as 'a3' | 'a4' });

    const imgWidthMm = page.contentMm;
    const pxPerMm = canvas.width / imgWidthMm;
    const footerMm = 10;
    const usableMm = page.heightMm - page.marginMm * 2 - footerMm;
    const sliceHeightPx = Math.floor(usableMm * pxPerMm);

    const cuts: { start: number; height: number }[] = [];
    let y = 0;
    while (y < canvas.height) {
      const limit = Math.min(y + sliceHeightPx, canvas.height);
      let end = limit;
      if (limit < canvas.height) {
        const minEnd = y + sliceHeightPx * 0.55;
        const candidate = stops.filter((s) => s > minEnd && s <= limit).pop();
        if (candidate) end = candidate;
      }
      cuts.push({ start: y, height: end - y });
      y = end;
    }

    const totalPages = cuts.length;
    const slice = document.createElement('canvas');
    const ctx = slice.getContext('2d')!;

    for (let i = 0; i < totalPages; i += 1) {
      const { start: startY, height } = cuts[i];

      slice.width = canvas.width;
      slice.height = height;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, startY, canvas.width, height, 0, 0, canvas.width, height);

      if (i > 0) pdf.addPage();
      pdf.addImage(
        slice.toDataURL('image/jpeg', 0.92),
        'JPEG',
        page.marginMm,
        page.marginMm,
        imgWidthMm,
        height / pxPerMm,
        undefined,
        'FAST',
      );

      if (i > 0) {
        const y = page.heightMm - page.marginMm + 2;
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text(reportTitle, page.marginMm, y);
        pdf.text(`Стр. ${i + 1} из ${totalPages}`, page.widthMm / 2, y, { align: 'center' });
        pdf.text(`Концерн КРОСТ · ${humanDate}`, page.widthMm - page.marginMm, y, { align: 'right' });
      }

      onProgress?.(65 + Math.round(((i + 1) / totalPages) * 30), `Страница ${i + 1} из ${totalPages}`);
      await nextFrames(1);
    }

    onProgress?.(98, 'Сохраняю файл');
    pdf.save(`${reportTitle} ${format} ${stamp}.pdf`);
    onProgress?.(100, 'Готово');
  } catch (e) {
    restore();
    throw e;
  }
}