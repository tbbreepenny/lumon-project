/* ============================================================
   LUMON INDUSTRIES — MACRODATA REFINEMENT
   main.js — Terminal logic, bins, quota, Kier modal, waffle party
   ============================================================ */

// ---- STATE ----
const state = {
  activeBin: 'WO',
  refined: 0,
  flagged: 0,
  binFills: { WO: 0, FC: 0, DR: 0, MA: 0, TE: 0 },
  scared: new Set(),
  refined_nums: new Set(),
};

// ---- CONSTANTS ----
const KIER_QUOTES = [
  "The work is mysterious and important.",
  "You have been chosen. Be glad.",
  "What is outside is outside. What is inside is yours.",
  "To feel is to know you are alive. To refine is to serve.",
  "Temptation is the innie's burden. Virtue is his reward.",
  "Each number holds a feeling. Trust your gut.",
  "You did not choose Lumon. Lumon chose you.",
  "The severed floor is a sanctuary. Treat it as such.",
];

const DANCE_FRAMES = [
`   o/
  /|
  / \\`,
`   \\o
   |\\
  / \\`,
`   o/
  /|\\
  / \\`,
`  \\o/
   |
  / \\`,
`   o
  /|\\
  / \\`,
];

const MILCHICK_LINES = [
  "You did it. You actually did it.",
  "The numbers have been refined.",
  "All five bins. One hundred percent.",
  "Ms. Cobel has been notified.",
  "This is... unprecedented.",
  "On behalf of Lumon Industries —",
  "and our founder Kier Eagan —",
  "it is my honor and privilege...",
  "...to announce...",
  "A WAFFLE PARTY HAS BEEN APPROVED.",
];

let waffleAnimId = null;

// ---- CLOCK ----
function updateClock() {
  const now = new Date();
  const h  = now.getHours() % 12 || 12;
  const m  = String(now.getMinutes()).padStart(2, '0');
  const s  = String(now.getSeconds()).padStart(2, '0');
  const ap = now.getHours() >= 12 ? 'PM' : 'AM';
  document.getElementById('clock').textContent =
    `${String(h).padStart(2, '0')}:${m}:${s} ${ap}`;
}

// ---- NUMBER GENERATION ----
function randNum() {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

function generateNumbers() {
  const container = document.getElementById('numbersContainer');
  container.innerHTML = '';
  state.scared.clear();

  for (let i = 0; i < 300; i++) {
    const el = document.createElement('span');
    el.className = 'num-group';
    el.textContent = randNum();
    el.dataset.id = i;
    el.addEventListener('click', onNumberClick);

    if (Math.random() < 0.04) {
      el.classList.add('scared');
      state.scared.add(i);
    }

    container.appendChild(el);
  }
}

// ---- QUOTA ----
function updateQuota() {
  const fills = Object.values(state.binFills);
  const avg   = Math.round(fills.reduce((a, b) => a + b, 0) / fills.length);

  document.getElementById('quotaPct').textContent = avg + '%';
  document.getElementById('quotaArc').style.strokeDashoffset =
    150.8 - (150.8 * avg / 100);

  const total = state.refined_nums.size;
  document.getElementById('refinedTotal').textContent = total.toLocaleString();
  document.getElementById('refinedCount').innerHTML =
    `${total.toLocaleString()} <span style="font-size:0.6rem;color:var(--lumon-grey)">/ 170</span>`;
}

// ---- NUMBER CLICK ----
function onNumberClick(e) {
  const el = e.currentTarget;
  const id = parseInt(el.dataset.id);
  if (state.refined_nums.has(id)) return;

  // Scared number
  if (state.scared.has(id)) {
    state.flagged++;
    document.getElementById('flaggedTotal').textContent = state.flagged.toLocaleString();
    el.classList.add('scared');
    addLog('warn', `Scary number flagged → ${el.textContent}`);
    showKier();
    return;
  }

  // Block if active bin is full
  if (state.binFills[state.activeBin] >= 100) {
    addLog('warn', `Bin ${state.activeBin} is full — select another bin`);
    const binEl = document.querySelector(`.bin[data-bin="${state.activeBin}"]`);
    binEl.style.borderColor = '#ff4444';
    binEl.style.background  = 'rgba(255,68,68,0.08)';
    setTimeout(() => {
      binEl.style.borderColor = '';
      binEl.style.background  = '';
    }, 600);
    return;
  }

  // Refine
  el.classList.add('refined');
  state.refined_nums.add(id);
  state.binFills[state.activeBin] = Math.min(100, state.binFills[state.activeBin] + 3);
  updateBinUI(state.activeBin);
  updateQuota();
  floatNum(el, el.textContent);
  addLog('ok', `Refined ${el.textContent} → ${state.activeBin}`);
}

// ---- FLOATING NUMBER EFFECT ----
function floatNum(el, txt) {
  const rect      = el.getBoundingClientRect();
  const field     = document.getElementById('numberField');
  const fieldRect = field.getBoundingClientRect();
  const fn        = document.createElement('span');
  fn.className    = 'float-num';
  fn.textContent  = txt;
  fn.style.left   = (rect.left - fieldRect.left) + 'px';
  fn.style.top    = (rect.top  - fieldRect.top)  + 'px';
  field.appendChild(fn);
  setTimeout(() => fn.remove(), 2000);
}

// ---- BIN SELECTION ----
function selectBin(bin) {
  state.activeBin = bin;
  document.querySelectorAll('.bin').forEach(b => {
    b.classList.toggle('active', b.dataset.bin === bin);
  });
  document.getElementById('activeBinLabel').textContent = bin;
  addLog('', `Bin ${bin} selected`);
}

// ---- BIN UI UPDATE ----
function updateBinUI(bin) {
  const pct   = state.binFills[bin];
  document.getElementById(`fill-${bin}`).style.width = pct + '%';
  document.getElementById(`pct-${bin}`).textContent  = pct + '%';

  const binEl = document.querySelector(`.bin[data-bin="${bin}"]`);

  if (pct >= 100) {
    binEl.classList.add('full');
    if (!binEl.querySelector('.bin-full-tag')) {
      const tag       = document.createElement('span');
      tag.className   = 'bin-full-tag';
      tag.textContent = '✓ COMPLETE';
      binEl.appendChild(tag);
    }
    // Auto-switch to next incomplete bin
    const next = Object.keys(state.binFills).find(k => state.binFills[k] < 100);
    if (next) selectBin(next);
  }

  // Check win condition
  if (Object.values(state.binFills).every(v => v >= 100)) {
    triggerWaffleParty();
  }
}

// ---- SYSTEM LOG ----
function addLog(type, msg) {
  const now       = new Date();
  const h         = String(now.getHours()).padStart(2, '0');
  const m         = String(now.getMinutes()).padStart(2, '0');
  const container = document.getElementById('logEntries');
  const entry     = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.innerHTML = `<span class="ts">${h}:${m}</span><span class="msg">${msg}</span>`;
  container.appendChild(entry);
  if (container.children.length > 8) container.removeChild(container.firstChild);
  container.scrollTop = container.scrollHeight;
}

// ---- KIER MODAL ----
function showKier() {
  const q = KIER_QUOTES[Math.floor(Math.random() * KIER_QUOTES.length)];
  document.getElementById('kierQuote').textContent = `"${q}"`;
  document.getElementById('kierModal').classList.add('show');
}

function closeKier() {
  document.getElementById('kierModal').classList.remove('show');
}

// ---- WAFFLE PARTY ----
function triggerWaffleParty() {
  const party = document.getElementById('waffleParty');
  if (party.style.display === 'flex') return;

  party.style.display = 'flex';

  // Flash white
  const flash = document.getElementById('waffleFlash');
  flash.style.opacity = '1';
  setTimeout(() => (flash.style.opacity = '0'), 300);

  startConfetti();

  // Slide Milchick in
  setTimeout(() => {
    const wrap       = document.getElementById('milchickWrap');
    wrap.style.opacity   = '1';
    wrap.style.transform = 'translateY(0)';
  }, 600);

  // Dance frames
  let frame = 0;
  const danceInterval = setInterval(() => {
    document.getElementById('milchickAscii').textContent =
      DANCE_FRAMES[frame % DANCE_FRAMES.length];
    frame++;
  }, 300);
  party._danceInterval = danceInterval;

  // Typewriter speech
  let lineIdx = 0, charIdx = 0, currentText = '';
  const speech = document.getElementById('milchickSpeech');
  speech.textContent = '';

  function typeNext() {
    if (lineIdx >= MILCHICK_LINES.length) return;
    const line = MILCHICK_LINES[lineIdx];
    if (charIdx < line.length) {
      currentText += line[charIdx];
      speech.textContent = currentText;
      charIdx++;
      setTimeout(typeNext, 55);
    } else {
      currentText += '\n';
      speech.style.whiteSpace = 'pre';
      lineIdx++;
      charIdx = 0;
      setTimeout(typeNext, 500);
    }
  }
  setTimeout(typeNext, 800);
}

function startConfetti() {
  const canvas = document.getElementById('waffleCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS    = ['#111', '#333', '#555', '#888', '#aaa', '#000'];
  const particles = Array.from({ length: 120 }, () => ({
    x:      Math.random() * canvas.width,
    y:     -Math.random() * canvas.height,
    vy:     1.5 + Math.random() * 3,
    vx:    (Math.random() - 0.5) * 1.5,
    rot:    Math.random() * 360,
    rotV:  (Math.random() - 0.5) * 4,
    size:   10 + Math.random() * 14,
    color:  COLORS[Math.floor(Math.random() * COLORS.length)],
    char:   String(Math.floor(Math.random() * 10)),
    opacity: 0.6 + Math.random() * 0.4,
  }));

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.font        = `bold ${p.size}px 'Share Tech Mono', monospace`;
      ctx.fillStyle   = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fillText(p.char, 0, 0);
      ctx.restore();

      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;
      p.char = String(Math.floor(Math.random() * 10));

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    });
    waffleAnimId = requestAnimationFrame(drawConfetti);
  }
  drawConfetti();
}

function closeWaffleParty() {
  const party = document.getElementById('waffleParty');
  party.style.display = 'none';

  if (waffleAnimId) cancelAnimationFrame(waffleAnimId);
  if (party._danceInterval) clearInterval(party._danceInterval);

  // Reset all state
  Object.keys(state.binFills).forEach(k => {
    state.binFills[k] = 0;
    // Remove full class and COMPLETE tag
    const binEl = document.querySelector(`.bin[data-bin="${k}"]`);
    binEl.classList.remove('full');
    const tag = binEl.querySelector('.bin-full-tag');
    if (tag) tag.remove();
  });

  state.refined_nums.clear();
  state.scared.clear();
  state.refined = 0;
  state.flagged = 0;

  // Reset first bin as active
  selectBin('WO');

  // Re-render bin UI
  Object.keys(state.binFills).forEach(k => updateBinUI(k));

  // Reset quota display
  document.getElementById('quotaPct').textContent              = '0%';
  document.getElementById('quotaArc').style.strokeDashoffset   = '150.8';
  document.getElementById('refinedTotal').textContent          = '0';
  document.getElementById('refinedCount').innerHTML =
    `0 <span style="font-size:0.6rem;color:var(--lumon-grey)">/ 170</span>`;
  document.getElementById('flaggedTotal').textContent = '0';

  generateNumbers();
  addLog('ok', 'New file loaded. Begin refinement.');
}

// ---- AUTO-REFRESH NUMBERS ----
setInterval(() => {
  if (Math.random() < 0.15) {
    const nums = document.querySelectorAll('.num-group:not(.refined):not(.scared)');
    if (nums.length) {
      nums[Math.floor(Math.random() * nums.length)].textContent = randNum();
    }
  }
}, 3000);

// ---- INIT ----
setInterval(updateClock, 1000);
updateClock();
generateNumbers();
setTimeout(() => showKier(), 2200);
