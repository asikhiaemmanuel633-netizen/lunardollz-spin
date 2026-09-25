import { useEffect, useRef, useState } from 'react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const GROUND_Y = 240;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const BASE_SPEED = 5;

export default function ReaperRunner() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready | playing | gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('reaper-runner-highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    player: { x: 90, y: GROUND_Y, vy: 0, w: 36, h: 46, ducking: false, jumping: false, legPhase: 0 },
    obstacles: [],
    particles: [],
    frame: 0,
    speed: BASE_SPEED,
    score: 0,
    spawnTimer: 0,
  });

  const resetGame = () => {
    stateRef.current = {
      player: { x: 90, y: GROUND_Y, vy: 0, w: 36, h: 46, ducking: false, jumping: false, legPhase: 0 },
      obstacles: [],
      particles: [],
      frame: 0,
      speed: BASE_SPEED,
      score: 0,
      spawnTimer: 0,
    };
    setScore(0);
  };

  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  const jump = () => {
    const p = stateRef.current.player;
    if (!p.jumping && gameState === 'playing') {
      p.vy = JUMP_FORCE;
      p.jumping = true;
    }
  };

  const duck = (isDucking) => {
    const p = stateRef.current.player;
    if (!p.jumping) p.ducking = isDucking;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'ready' || gameState === 'gameover') startGame();
        else jump();
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        duck(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'ArrowDown') duck(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const spawnObstacle = () => {
      const types = ['tombstone', 'spike', 'skull'];
      const type = types[Math.floor(Math.random() * types.length)];
      const obstacle =
        type === 'skull'
          ? { type, x: GAME_WIDTH, y: GROUND_Y - 90 - Math.random() * 20, w: 28, h: 28, bob: Math.random() * Math.PI * 2 }
          : type === 'spike'
          ? { type, x: GAME_WIDTH, y: GROUND_Y, w: 46, h: 26, spikes: 3 }
          : { type, x: GAME_WIDTH, y: GROUND_Y, w: 30, h: 42 };
      stateRef.current.obstacles.push(obstacle);
    };

    const loop = () => {
      const s = stateRef.current;
      s.frame++;
      s.spawnTimer--;

      const p = s.player;
      p.y += p.vy;
      p.vy += GRAVITY;
      if (p.y >= GROUND_Y) {
        p.y = GROUND_Y;
        p.vy = 0;
        p.jumping = false;
      }
      if (!p.jumping) p.legPhase += 0.35;

      if (s.frame % 2 === 0) {
        const flameX = p.x + (p.ducking ? 22 : 20);
        const flameY = p.y - (p.ducking ? p.h * 0.75 : p.h + 6);
        s.particles.push({
          x: flameX + (Math.random() * 4 - 2),
          y: flameY,
          vy: -1 - Math.random(),
          vx: (Math.random() - 0.5) * 0.6,
          life: 20,
          maxLife: 20,
        });
      }
      s.particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
      });
      s.particles = s.particles.filter((pt) => pt.life > 0);

      s.speed = BASE_SPEED + Math.floor(s.frame / 500) * 0.5;

      if (s.spawnTimer <= 0) {
        spawnObstacle();
        s.spawnTimer = 60 + Math.random() * 50 - Math.min(s.speed * 3, 40);
      }

      s.obstacles.forEach((o) => (o.x -= s.speed));
      s.obstacles = s.obstacles.filter((o) => o.x > -60);

      s.score += 1;
      setScore(Math.floor(s.score / 10));

      const pH = p.ducking ? p.h / 2 : p.h;
      const pY = p.ducking ? p.y + p.h / 2 : p.y - p.h;
      const pBox = { x: p.x - p.w / 2 + 6, y: pY, w: p.w - 12, h: pH };

      for (const o of s.obstacles) {
        const oBox =
          o.type === 'skull'
            ? { x: o.x, y: o.y, w: o.w, h: o.h }
            : { x: o.x, y: o.y - o.h, w: o.w, h: o.h };
        if (
          pBox.x < oBox.x + oBox.w &&
          pBox.x + pBox.w > oBox.x &&
          pBox.y < oBox.y + oBox.h &&
          pBox.y + pBox.h > oBox.y
        ) {
          setGameState('gameover');
          const finalScore = Math.floor(s.score / 10);
          setHighScore((prev) => {
            const newHigh = Math.max(prev, finalScore);
            try {
              localStorage.setItem('reaper-runner-highscore', String(newHigh));
            } catch {}
            return newHigh;
          });
          return;
        }
      }

      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      const sky = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      sky.addColorStop(0, '#0a0f2e');
      sky.addColorStop(0.55, '#1a1440');
      sky.addColorStop(1, '#241a3d');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      const moonX = 680, moonY = 55, moonR = 32;
      ctx.save();
      ctx.shadowColor = 'rgba(230, 220, 255, 0.8)';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#f2edff';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = 'rgba(200, 190, 230, 0.35)';
      ctx.beginPath();
      ctx.arc(moonX - 10, moonY - 6, 5, 0, Math.PI * 2);
      ctx.arc(moonX + 8, moonY + 8, 7, 0, Math.PI * 2);
      ctx.fill();

      const parX = -(s.frame * 0.4) % 200;
      ctx.fillStyle = 'rgba(20, 12, 40, 0.8)';
      for (let i = -1; i < 6; i++) {
        const bx = parX + i * 200;
        ctx.fillRect(bx, 150, 40, 90);
        ctx.fillRect(bx + 50, 130, 30, 110);
        ctx.fillRect(bx + 90, 165, 45, 75);
        ctx.beginPath();
        ctx.moveTo(bx + 50, 130);
        ctx.lineTo(bx + 65, 110);
        ctx.lineTo(bx + 80, 130);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = '#150c28';
      ctx.fillRect(0, GROUND_Y + 6, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 6);
      ctx.lineTo(GAME_WIDTH, GROUND_Y + 6);
      ctx.stroke();
      ctx.shadowBlur = 0;

      const groundX = -(s.frame * s.speed * 0.3) % 40;
      ctx.strokeStyle = 'rgba(90, 70, 130, 0.5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 24; i++) {
        const gx = groundX + i * 40;
        ctx.beginPath();
        ctx.moveTo(gx, GROUND_Y + 10);
        ctx.lineTo(gx - 3, GROUND_Y + 3);
        ctx.moveTo(gx + 4, GROUND_Y + 10);
        ctx.lineTo(gx + 6, GROUND_Y + 2);
        ctx.stroke();
      }

      s.particles.forEach((pt) => {
        const t = pt.life / pt.maxLife;
        ctx.globalAlpha = t;
        const grad2 = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 6);
        grad2.addColorStop(0, '#fff3c4');
        grad2.addColorStop(0.5, '#f59e0b');
        grad2.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5 * t + 1, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      s.obstacles.forEach((o) => {
        if (o.type === 'tombstone') {
          ctx.fillStyle = '#5b5470';
          ctx.strokeStyle = '#2d2840';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(o.x, o.y);
          ctx.lineTo(o.x, o.y - o.h + 10);
          ctx.quadraticCurveTo(o.x + o.w / 2, o.y - o.h - 8, o.x + o.w, o.y - o.h + 10);
          ctx.lineTo(o.x + o.w, o.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = 'rgba(0,0,0,0.4)';
          ctx.beginPath();
          ctx.moveTo(o.x + o.w / 2, o.y - o.h + 4);
          ctx.lineTo(o.x + o.w / 2, o.y - 6);
          ctx.moveTo(o.x + o.w / 2 - 6, o.y - o.h / 2);
          ctx.lineTo(o.x + o.w / 2 + 6, o.y - o.h / 2);
          ctx.stroke();
        } else if (o.type === 'spike') {
          const spikeW = o.w / o.spikes;
          for (let i = 0; i < o.spikes; i++) {
            ctx.fillStyle = '#9ca3af';
            ctx.strokeStyle = '#4b5563';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(o.x + i * spikeW, o.y);
            ctx.lineTo(o.x + i * spikeW + spikeW / 2, o.y - o.h);
            ctx.lineTo(o.x + i * spikeW + spikeW, o.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        } else if (o.type === 'skull') {
          const bobY = o.y + Math.sin(s.frame * 0.1 + o.bob) * 4;
          ctx.save();
          ctx.shadowColor = '#c4b5fd';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#e5e0f5';
          ctx.beginPath();
          ctx.arc(o.x + o.w / 2, bobY + o.h / 2, o.w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.fillStyle = '#e5e0f5';
          ctx.fillRect(o.x + o.w / 2 - 7, bobY + o.h / 2 + 6, 14, 6);
          ctx.fillStyle = '#1a1030';
          ctx.beginPath();
          ctx.arc(o.x + o.w / 2 - 5, bobY + o.h / 2, 3, 0, Math.PI * 2);
          ctx.arc(o.x + o.w / 2 + 5, bobY + o.h / 2, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(196, 181, 253, 0.5)';
          ctx.lineWidth = 1.5;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(o.x + o.w + 4, bobY + o.h / 2 - 6 + i * 6);
            ctx.lineTo(o.x + o.w + 14, bobY + o.h / 2 - 6 + i * 6);
            ctx.stroke();
          }
        }
      });

      ctx.save();
      const px = p.x;
      const py = p.y;
      const ducking = p.ducking;
      const bodyH = ducking ? p.h * 0.55 : p.h;
      const headY = py - bodyH;
      const legSwing = Math.sin(p.legPhase) * 10;

      ctx.strokeStyle = '#e8e4f0';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(px, py - bodyH * 0.35);
      ctx.lineTo(px - 8 + (p.jumping ? -4 : legSwing * 0.4), py);
      ctx.moveTo(px, py - bodyH * 0.35);
      ctx.lineTo(px + 8 + (p.jumping ? 6 : -legSwing * 0.4), py);
      ctx.stroke();

      ctx.fillStyle = '#d8d3e8';
      ctx.strokeStyle = '#8b7fae';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px - 10, py - bodyH * 0.35);
      ctx.lineTo(px - 12, headY + 6);
      ctx.quadraticCurveTo(px, headY, px + 12, headY + 6);
      ctx.lineTo(px + 10, py - bodyH * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(139, 127, 174, 0.6)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const ry = headY + 12 + i * 6;
        ctx.beginPath();
        ctx.moveTo(px - 8, ry);
        ctx.lineTo(px + 8, ry);
        ctx.stroke();
      }

      ctx.strokeStyle = '#d8d3e8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px + 6, headY + 10);
      ctx.lineTo(px + 20, headY - 4);
      ctx.stroke();
      ctx.strokeStyle = '#7c5a3a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px + 20, headY - 4);
      ctx.lineTo(px + 22, headY - 20);
      ctx.stroke();
      const flameFlicker = 4 + Math.sin(s.frame * 0.5) * 2;
      const fgrad = ctx.createRadialGradient(px + 22, headY - 24, 0, px + 22, headY - 24, 8 + flameFlicker);
      fgrad.addColorStop(0, '#fff3c4');
      fgrad.addColorStop(0.5, '#fb923c');
      fgrad.addColorStop(1, 'rgba(249,115,22,0)');
      ctx.fillStyle = fgrad;
      ctx.beginPath();
      ctx.arc(px + 22, headY - 24, 7 + flameFlicker, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#d8d3e8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px - 6, headY + 10);
      ctx.lineTo(px - 14 + legSwing * 0.3, headY + 24);
      ctx.stroke();

      ctx.save();
      ctx.shadowColor = 'rgba(216, 211, 232, 0.5)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#efeaf7';
      ctx.beginPath();
      ctx.arc(px, headY - 4, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#efeaf7';
      ctx.fillRect(px - 5, headY + 4, 10, 5);
      ctx.save();
      ctx.shadowColor = '#c4b5fd';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#3b2f5c';
      ctx.beginPath();
      ctx.arc(px - 4, headY - 5, 2.5, 0, Math.PI * 2);
      ctx.arc(px + 4, headY - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

    // touch controls: swipe up = jump, swipe down = duck, tap = jump
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    if (gameState === 'ready' || gameState === 'gameover') {
      startGame();
    }
  };

  const handleTouchEnd = (e) => {
    if (gameState !== 'playing') return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const elapsed = Date.now() - touchStartTime.current;

    if (deltaY < -25) {
      jump(); // swipe up
    } else if (deltaY > 25) {
      duck(true); // swipe down
      setTimeout(() => duck(false), 400);
    } else if (elapsed < 250) {
      jump(); // quick tap
    }
  };

    return (
    <div className="reaper-runner">
      <div
        className="reaper-runner-canvas-wrap"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} />

        <div className="reaper-runner-title">
          REAPER<br />RUN
        </div>

        <div className="reaper-runner-hud">
          <div className="hud-block">
            <span className="hud-label">Score</span>
            <span className="hud-value">{String(score).padStart(5, '0')}</span>
          </div>
          <div className="hud-block">
            <span className="hud-label">Best</span>
            <span className="hud-value">{String(highScore).padStart(5, '0')}</span>
          </div>
        </div>

        {gameState !== 'playing' && (
          <div className="reaper-runner-overlay" onClick={startGame}>
            {gameState === 'ready' && (
              <div className="reaper-runner-card">
                <h3>Reaper Run</h3>
                <p className="tagline">Outrun death.</p>
                <button className="reaper-runner-btn">Play</button>
                <p className="controls-hint">
                  Space / tap / swipe up to jump &middot; ↓ / swipe down to duck
                </p>
              </div>
            )}
            {gameState === 'gameover' && (
              <div className="reaper-runner-card">
                <h3>You Perished</h3>
                <p>Score: {score}</p>
                <p>Best: {highScore}</p>
                <button className="reaper-runner-btn">Try Again</button>
              </div>
            )}
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div className="reaper-runner-controls">
          <button
            className="reaper-runner-control-btn"
            onTouchStart={(e) => { e.preventDefault(); jump(); }}
            onMouseDown={(e) => { e.preventDefault(); jump(); }}
          >
            ↑ Jump
          </button>
          <button
            className="reaper-runner-control-btn"
            onTouchStart={(e) => { e.preventDefault(); duck(true); }}
            onTouchEnd={(e) => { e.preventDefault(); duck(false); }}
            onMouseDown={(e) => { e.preventDefault(); duck(true); }}
            onMouseUp={(e) => { e.preventDefault(); duck(false); }}
          >
            ↓ Duck
          </button>
        </div>
      )}
    </div>
  );
}