export type PageFormat = 'A4' | 'A3';

const PAGE_SIZE: Record<PageFormat, { size: string; margin: string; contentMm: number }> = {
  A4: { size: 'A4 portrait', margin: '12mm 10mm 16mm', contentMm: 190 },
  A3: { size: 'A3 portrait', margin: '14mm 12mm 18mm', contentMm: 273 },
};

const MM_TO_PX = 96 / 25.4;

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

function pageRule(format: PageFormat, title: string, date: string) {
  const { size, margin } = PAGE_SIZE[format];
  const footer = 'font-size: 8pt; color: #94a3b8; font-family: system-ui, sans-serif;';

  return `@page {
    size: ${size};
    margin: ${margin};
    @bottom-left { content: "${esc(title)}"; ${footer} }
    @bottom-center { content: "Стр. " counter(page) " из " counter(pages); ${footer} }
    @bottom-right { content: "Концерн КРОСТ · ${date}"; ${footer} }
  }

  @page :first {
    @bottom-left { content: ""; }
    @bottom-center { content: ""; }
    @bottom-right { content: ""; }
  }`;
}

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

export function applyPrintFormat(format: PageFormat, reportTitle: string) {
  const humanDate = new Date().toLocaleDateString('ru-RU');

  document.getElementById('page-format')?.remove();

  const style = document.createElement('style');
  style.id = 'page-format';
  style.media = 'print';
  style.textContent = pageRule(format, reportTitle, humanDate);
  document.head.appendChild(style);

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

export async function printReport(format: PageFormat, reportTitle: string) {
  const prevTitle = document.title;
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const humanDate = d.toLocaleDateString('ru-RU');

  document.getElementById('page-format')?.remove();

  const style = document.createElement('style');
  style.id = 'page-format';
  style.media = 'print';
  style.textContent = pageRule(format, reportTitle, humanDate);
  document.head.appendChild(style);

  const root = document.documentElement;
  root.classList.remove('print-format-a4', 'print-format-a3');
  root.classList.add(`print-format-${format.toLowerCase()}`);

  document.title = `${reportTitle} ${stamp}`;

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

  const main = document.querySelector('main') as HTMLElement | null;
  const widthPx = Math.round(PAGE_SIZE[format].contentMm * MM_TO_PX);
  const prevInline = main?.getAttribute('style') ?? null;

  if (main) {
    main.style.width = `${widthPx}px`;
    main.style.maxWidth = 'none';
    main.style.marginLeft = 'auto';
    main.style.marginRight = 'auto';
  }
  root.classList.add('print-measuring');

  window.dispatchEvent(new Event('resize'));
  await nextFrames(3);
  await new Promise((r) => setTimeout(r, 320));
  window.dispatchEvent(new Event('resize'));
  await nextFrames(2);

  const cleanup = () => {
    document.title = prevTitle;
    style.remove();
    root.classList.remove('print-format-a4', 'print-format-a3', 'print-measuring');
    if (main) {
      if (prevInline === null) main.removeAttribute('style');
      else main.setAttribute('style', prevInline);
    }
    setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
  };

  window.addEventListener('afterprint', cleanup, { once: true });

  window.print();

  setTimeout(() => {
    if (root.classList.contains('print-measuring')) cleanup();
  }, 60000);
}