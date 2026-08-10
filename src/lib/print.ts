export type PageFormat = 'A4' | 'A3';

const PAGE_SIZE: Record<PageFormat, { size: string; margin: string }> = {
  A4: { size: 'A4 portrait', margin: '12mm 10mm 16mm' },
  A3: { size: 'A3 portrait', margin: '14mm 12mm 18mm' },
};

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
  }`;
}

export function printReport(format: PageFormat, reportTitle: string) {
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

  document.documentElement.classList.remove('print-format-a4', 'print-format-a3');
  document.documentElement.classList.add(`print-format-${format.toLowerCase()}`);

  document.title = `${reportTitle} ${stamp}`;

  const cleanup = () => {
    document.title = prevTitle;
    style.remove();
    document.documentElement.classList.remove('print-format-a4', 'print-format-a3');
  };

  window.addEventListener('afterprint', cleanup, { once: true });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => window.print());
  });
}
