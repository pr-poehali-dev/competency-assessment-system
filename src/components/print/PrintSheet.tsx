import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const MM = 96 / 25.4;
const MARGIN_MM = 6;
const SHEET_W = Math.floor((210 - MARGIN_MM * 2) * MM);
const SHEET_H = Math.floor((297 - MARGIN_MM * 2) * MM);

const MIN_SCALE = 0.7;
const MAX_SCALE = 1.6;

export const A4_CONTENT_WIDTH = SHEET_W;
export const A4_CONTENT_HEIGHT = SHEET_H;

export default function PrintSheet({ children, className = '' }: { children: ReactNode; className?: string }) {
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const fit = () => {
    const el = inner.current;
    if (!el) return;
    let z = 1;
    for (let i = 0; i < 6; i += 1) {
      el.style.width = `${SHEET_W / z}px`;
      const h = el.offsetHeight;
      if (!h) break;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, SHEET_H / h));
      if (Math.abs(next - z) < 0.002) {
        z = next;
        break;
      }
      z = next;
    }
    el.style.width = `${SHEET_W / z}px`;
    setScale(z);
  };

  useLayoutEffect(fit, []);

  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) fit();
    });
    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    return () => {
      alive = false;
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className={`print-sheet mx-auto bg-white overflow-hidden ${className}`}
      style={{ width: SHEET_W, height: SHEET_H }}
    >
      <div
        ref={inner}
        style={{ width: SHEET_W, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  );
}
