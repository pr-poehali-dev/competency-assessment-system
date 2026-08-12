const BRAND = '#0F4D9D';

export default function KrostLogo({ height = 40 }: { height?: number }) {
  const mark = height * 1.05;

  return (
    <div className="flex items-center" style={{ gap: height * 0.32 }}>
      <svg
        viewBox="0 0 100 92"
        height={mark}
        role="img"
        aria-label="Концерн КРОСТ"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <g fill={BRAND} fillRule="evenodd">
          <path d="M50 2 L69.5 35.8 L61.9 35.8 L50 15.2 L38.1 35.8 L30.5 35.8 Z" />
          <path d="M26.6 42.5 L34.2 42.5 L14.9 76 L7.3 76 Z" />
          <path d="M73.4 42.5 L92.7 76 L85.1 76 L65.8 42.5 Z" />
          <path d="M22.7 82.7 L77.3 82.7 L73.4 89.4 L26.6 89.4 Z" />
          <path d="M3.4 82.7 L19 82.7 L11.2 69.2 Z" opacity="0" />
        </g>
      </svg>

      <div style={{ lineHeight: 1 }}>
        <div className="font-bold" style={{ color: BRAND, fontSize: height * 0.66, letterSpacing: '-0.015em' }}>
          КРОСТ
        </div>
        <div
          className="font-semibold"
          style={{
            color: BRAND,
            fontSize: height * 0.24,
            letterSpacing: height * 0.12,
            marginTop: height * 0.1,
          }}
        >
          КОНЦЕРН
        </div>
      </div>
    </div>
  );
}
