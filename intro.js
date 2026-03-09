/* ============================================================
   LUMON INDUSTRIES — MACRODATA REFINEMENT
   intro.js — Cascading number intro screen
   ============================================================ */

(function () {
  const canvas = document.getElementById('introCanvas');
  const ctx = canvas.getContext('2d');
  let animId;
  const FONT_SIZE = 16;
  const CHARS = '0123456789';
  let columns = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / FONT_SIZE);
    columns = Array.from({ length: cols }, (_, i) => ({
      x: i * FONT_SIZE,
      y: Math.random() * -canvas.height,
      speed: 0.4 + Math.random() * 1.4,
      brightness: 0.5 + Math.random() * 0.5,
      chars: Array.from({ length: 40 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
      charTimer: 0,
      charInterval: Math.floor(3 + Math.random() * 8),
    }));
  }

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.045)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    columns.forEach(col => {
      col.charTimer++;
      if (col.charTimer >= col.charInterval) {
        col.charTimer = 0;
        const idx = Math.floor(Math.random() * col.chars.length);
        col.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
      }

      const trailLen = Math.floor(18 + col.brightness * 20);
      for (let t = 0; t < trailLen; t++) {
        const yPos = col.y - t * FONT_SIZE;
        if (yPos < -FONT_SIZE || yPos > canvas.height) continue;
        const alpha = (1 - t / trailLen) * col.brightness;
        const lightness = t === 0
          ? 255
          : Math.floor(255 * (1 - t / trailLen) * 0.7);
        ctx.fillStyle = `rgba(${lightness},${lightness},${lightness},${alpha})`;
        ctx.font = `${FONT_SIZE}px 'Share Tech Mono', monospace`;
        ctx.fillText(col.chars[t % col.chars.length], col.x, yPos);
      }

      col.y += col.speed * FONT_SIZE * 0.25;

      if (col.y - (18 + col.brightness * 20) * FONT_SIZE > canvas.height) {
        col.y = -FONT_SIZE * Math.floor(Math.random() * 10);
        col.speed = 0.4 + Math.random() * 1.4;
        col.brightness = 0.5 + Math.random() * 0.5;
      }
    });

    animId = requestAnimationFrame(draw);
  }

  function dismissIntro() {
    const screen = document.getElementById('introScreen');
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
      cancelAnimationFrame(animId);
    }, 1200);
  }

  // Expose globally so the HTML onclick can call it
  window.dismissIntro = dismissIntro;

  window.addEventListener('resize', resize);
  resize();
  draw();

  // Auto-dismiss after 12 seconds
  setTimeout(dismissIntro, 12000);
})();
