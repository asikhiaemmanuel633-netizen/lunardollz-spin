import { useEffect, useState } from 'react';

const IMAGES = ['/backgrounds/bg-dungeon.jpg', '/backgrounds/bg-cyberpunk.jpg'];
const SWITCH_EVERY_MS = 12000;

export default function BackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, SWITCH_EVERY_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slideshow" aria-hidden="true">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className={`bg-slide${i === index ? ' active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="bg-slideshow-overlay" />
    </div>
  );
}
