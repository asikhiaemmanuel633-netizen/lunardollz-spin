import { useEffect, useRef, useState } from 'react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const GROUND_Y = 240;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const BASE_SPEED = 5;

const RUN_FRAME_COUNT = 7;
const RUN_FRAME_SPEED = 4; // lower = faster animation

export default function ReaperRunner() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('reaper-runner-highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const imagesRef = useRef({ background: null, ground: null, runFrames: [] });

  const stateRef = useRef({
    player: { x: 90, y: GROUND_Y, vy: 0, w: 60, h: 66, ducking: false, jumping: false, frameIndex: 0, frameTimer: 0 },
    obstacles: [],
    particles: [],
    frame: 0,
    speed: BASE_SPEED,
    score: 0,
    spawnTimer: 0,
    bgX: 0,
    groundX: 0,
  });

  // preload images once
  useEffect(() => {
    let loaded = 0;
    const total = 2 + RUN_FRAME_COUNT;
    const onLoad = () => {
      loaded++;
      if (loaded === total) setAssetsReady(true);
    };

    const bg = new Image();
    bg.src = '/sprites/background.png';
    bg.onload = onLoad;
    imagesRef.current.background = bg;

    const ground = new Image();
    ground.src = '/sprites/ground.png';
    ground.onload = onLoad;
    imagesRef.current.ground = ground;

    imagesRef.current.runFrames = [];
    for (let i = 1; i <= RUN_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/sprites/run-${i}.png`;
      img.onload = onLoad;
      imagesRef.current.runFrames.push(img);
    }
  }, []);

  const resetGame = () => {
    stateRef.current = {
      player: { x: 90, y: GROUND_Y, vy: 0, w: 60, h: 66, ducking: false, jumping: false, frameIndex: 0, frameTimer: 0 },
      obstacles: [],
      particles: [],
      frame: 0,
      speed: BASE_SPEED,
      score: 0,
      spawnTimer: 0,
      bgX: 0,
      groundX: 0,
    };
    setScore(0);
  };

  const startGame = () => {
    if (!assetsReady) return;
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
  }, [gameState, assetsReady]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    const { background, ground, runFrames } = imagesRef.current;

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

      // run animation cycling
      if (!p.jumping) {
        p.frameTimer++;
        if (p.frameTimer >= RUN_FRAME_SPEED) {
          p.frameTimer = 0;
          p.frameIndex = (p.frameIndex + 1) % RUN_FRAME_COUNT;
        }
      }

      s.speed = BASE_SPEED + Math.floor(s.frame / 500) * 0.5;
      s.bgX -= s.speed * 0.25;
      s.groundX -= s.speed;

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
      const pBox = { x: p.x - p.w / 2 + 16, y: pY, w: p.w - 32, h: pH };

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

      // ================= DRAW =================
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // scrolling background (tiled)
      if (background && background.complete) {
        const bgH = 220;
        const bgW = (background.width / background.height) * bgH;
        let x = s.bgX % bgW;
        if (x > 0) x -= bgW;
        for (let dx = x; dx < GAME_WIDTH; dx += bgW) {
          ctx.drawImage(background, dx, 0, bgW, bgH);
        }
      }

      // scrolling ground (tiled)
      if (ground && ground.complete) {
        const groundH = GAME_HEIGHT - GROUND_Y + 20;
        const groundW = (ground.width / ground.height) * groundH;
        let gx = s.groundX % groundW;
        if (gx > 0) gx -= groundW;
        for (let dx = gx; dx < GAME_WIDTH; dx += groundW) {
          ctx.drawImage(ground, dx, GROUND_Y - 10, groundW, groundH);
        }
      }

      // obstacles
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
          ctx.fillStyle = '#1a1030';
          ctx.beginPath();
          ctx.arc(o.x + o.w / 2 - 5, bobY + o.h / 2, 3, 0, Math.PI * 2);
          ctx.arc(o.x + o.w / 2 + 5, bobY + o.h / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ---- player sprite ----
      const frame = runFrames[p.frameIndex];
      if (frame && frame.complete) {
        ctx.save();
        const drawH = p.ducking ? p.h * 0.6 : p.h;
        const drawW = p.w * (drawH / p.h);
        const drawX = p.x - drawW / 2;
        const drawY = p.y - drawH;

        if (p.jumping) {
          ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
          ctx.rotate(-0.08);
          ctx.drawImage(frame, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
          ctx.drawImage(frame, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    if (gameState === 'ready' || gameState === 'gameover') startGame();
  };

  const handleTouchEnd = (e) => {
    if (gameState !== 'playing') return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const elapsed = Date.now() - touchStartTime.current;
    if (deltaY < -25) jump();
    else if (deltaY > 25) {
      duck(true);
      setTimeout(() => duck(false), 400);
    } else if (elapsed < 250) jump();
  };

  return (
    <div className="reaper-runner">
      <div className="reaper-runner-canvas-wrap" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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
                <button className="reaper-runner-btn">{assetsReady ? 'Play' : 'Loading...'}</button>
                <p className="controls-hint">Space / tap / swipe up to jump &middot; ↓ / swipe down to duck</p>
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