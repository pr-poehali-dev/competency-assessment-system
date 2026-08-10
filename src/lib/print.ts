export type PageFormat = 'A4' | 'A3';

const PAGE_RULES: Record<PageFormat, string> = {
  A4: '@page { size: A4 portrait; margin: 12mm 10mm; }',
  A3: '@page { size: A3 portrait; margin: 14mm 12mm; }',
};

export function printReport(format: PageFormat, reportTitle: string) {
  const prevTitle = document.title;
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  document.getElementById('page-format')?.remove();

  const style = document.createElement('style');
  style.id = 'page-format';
  style.textContent = PAGE_RULES[format];
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
