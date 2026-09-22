import { useEffect, useMemo } from 'react';

const COLORS = ['#F2C879', '#A56CF0', '#6B3FCB', '#E7B75D', '#EDE9F7'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Self-contained burst of falling confetti pieces. Renders itself, animates
// via CSS, then calls onDone once it's finished so the parent can stop
// mounting it (no need to manually clean anything up).
export default function Confetti({ onDone }) {
  const pieces = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      left: randomBetween(4, 96),
      delay: randomBetween(0, 0.3),
      duration: randomBetween(1.8, 3.2),
      drift: randomBetween(-60, 60),
      rotate: randomBetween(180, 720),
      size: randomBetween(6, 11),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      round: Math.random() > 0.5,
    }));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="confetti-burst" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--rotate': `${p.rotate}deg`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
