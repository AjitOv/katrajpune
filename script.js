/* Coming Soon — Shocking launch page with mystery, scarcity, and 3D mouse effects */

// -------- Config --------
const LAUNCH_DATE = new Date("2026-11-05T00:00:00").getTime();
const TOTAL_SPOTS = 1000;

// -------- DOM refs --------
const valueEls = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};
const card = document.getElementById("card");
const spotsLeftEl = document.getElementById("spots-left");
const joinedCountEl = document.getElementById("joined-count");
const glitchEl = document.getElementById("glitch-text");
const teaserLabel = document.getElementById("teaser-label");
const revealFill = document.getElementById("reveal-fill");

// -------- State --------
let joined = Number(localStorage.getItem("joined")) || 0;
let lastSecond = null;

// -------- Countdown --------
function pad(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function updateCountdown() {
  const now = Date.now();
  const diff = LAUNCH_DATE - now;

  if (diff <= 0) {
    Object.values(valueEls).forEach((el) => (el.textContent = "00"));
    glitchEl.textContent = "LIVE";
    teaserLabel.textContent = "It's here.";
    teaserLabel.style.color = "#34d399";
    revealFill.style.width = "100%";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // flip animation when a value changes
  const units = [
    { el: valueEls.days, val: days },
    { el: valueEls.hours, val: hours },
    { el: valueEls.minutes, val: minutes },
    { el: valueEls.seconds, val: seconds },
  ];
  units.forEach(({ el, val }) => {
    const current = el.textContent;
    const next = pad(val);
    if (current !== next) {
      el.parentElement.classList.add("flip");
      setTimeout(() => el.parentElement.classList.remove("flip"), 500);
    }
    el.textContent = next;
  });

  // mystery glitch text: random characters until near the end
  const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
  if (hoursLeft > 48) {
    glitchEl.textContent = Array.from({ length: 3 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 94))
    ).join("");
    teaserLabel.textContent = "Secret unlocks when the timer hits zero";
  } else if (hoursLeft > 0) {
    glitchEl.textContent = "…SOON";
  } else {
    glitchEl.textContent = "LIVE";
  }

  lastSecond = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

document.getElementById("year").textContent = new Date().getFullYear();

// -------- Scarcity / social proof --------
function updateScarcity() {
  const left = Math.max(0, TOTAL_SPOTS - joined);
  spotsLeftEl.textContent = left.toLocaleString();
  joinedCountEl.textContent = joined.toLocaleString();

  // progress bar based on how full the circle is
  const pct = Math.min(100, (joined / TOTAL_SPOTS) * 100);
  revealFill.style.width = pct + "%";

  if (left === 0) {
    teaserLabel.textContent = "Waitlist closed — circle is full.";
    teaserLabel.style.color = "#f43f5e";
  }
}

updateScarcity();

// slowly grow the joined count for social proof (demo effect)
setInterval(() => {
  if (Math.random() < 0.3 && joined < TOTAL_SPOTS - 1) {
    joined += 1;
    localStorage.setItem("joined", joined);
    updateScarcity();
  }
}, 4000);

// -------- 3D card tilt on mouse move --------
let targetX = 0;
let targetY = 0;

document.addEventListener("mousemove", (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  targetX = ((e.clientX - cx) / cx) * 10;
  targetY = -((e.clientY - cy) / cy) * 10;
});

function animateTilt() {
  const curX = parseFloat(card.style.getPropertyValue("--tx") || "0");
  const curY = parseFloat(card.style.getPropertyValue("--ty") || "0");
  const nextX = curX + (targetX - curX) * 0.07;
  const nextY = curY + (targetY - curY) * 0.07;

  card.style.setProperty("--tx", nextX.toFixed(3));
  card.style.setProperty("--ty", nextY.toFixed(3));
  card.style.transform = `perspective(1200px) rotateX(${nextY}deg) rotateY(${nextX}deg) translateZ(24px)`;

  requestAnimationFrame(animateTilt);
}
animateTilt();

// -------- Waitlist form --------
const form = document.getElementById("waitlist");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.elements.email.value.trim();
  if (!email) return;

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  submitBtn.textContent = "Joining…";
  msg.textContent = "";
  msg.className = "msg";

  try {
    await new Promise((r) => setTimeout(r, 1000));

    // mark a spot as taken
    joined += 1;
    localStorage.setItem("joined", joined);
    updateScarcity();

    msg.className = "msg ok";
    msg.textContent = "You're in the Inner Circle. 🎉 Keep this tab — we'll contact you before launch.";
    form.reset();

    // shocking celebration burst on the canvas
    if (window.triggerBurst) window.triggerBurst();
  } catch (err) {
    msg.className = "msg err";
    msg.textContent = "Something went wrong. Try again.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    submitBtn.textContent = "Join the Circle";
  }
});

// -------- Mouse-following animated characters (canvas) --------
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d", { alpha: false });

ctx.font = "34px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
ctx.textBaseline = "middle";
ctx.textAlign = "center";

let width, height;
const chars = [];
const mouse = { x: 0, y: 0 };
const TRAIL_OPACITY = 0.16;

const CHAR_EMOJIS = ["⚡", "🔥", "💥", "🚀", "💎", "💫", "🌌", "✨", "🎯", "💣", "☢️", "🧨", "🕳️", "🔮"];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("touchmove", (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, { passive: true });

class Char {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = initial ? Math.random() * width : mouse.x + (Math.random() - 0.5) * 100;
    this.y = initial ? Math.random() * height : mouse.y + (Math.random() - 0.5) * 100;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.angle = Math.random() * Math.PI * 2;
    this.scale = 0.7 + Math.random() * 1;
    this.emoji = CHAR_EMOJIS[Math.floor(Math.random() * CHAR_EMOJIS.length)];
    this.history = [];
    this.maxHistory = 14;
    this.wobble = Math.random() * Math.PI * 2;
    this.life = 1;
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.hypot(dx, dy);

    const pull = dist < 150 ? 0.08 : 0.025;
    this.vx += (dx / Math.max(dist, 1)) * pull;
    this.vy += (dy / Math.max(dist, 1)) * pull;

    this.vx *= 0.9;
    this.vy *= 0.9;

    this.vx += Math.sin(Date.now() * 0.0015 + this.wobble) * 0.05;
    this.vy += Math.cos(Date.now() * 0.0012 + this.wobble) * 0.05;

    this.x += this.vx;
    this.y += this.vy;

    const margin = 30;
    if (this.x < margin) { this.x = margin; this.vx *= -0.6; }
    if (this.x > width - margin) { this.x = width - margin; this.vx *= -0.6; }
    if (this.y < margin) { this.y = margin; this.vy *= -0.6; }
    if (this.y > height - margin) { this.y = height - margin; this.vy *= -0.6; }

    this.angle += 0.03 + Math.abs(this.vx) * 0.03;

    this.history.push({ x: this.x, y: this.y, scale: this.scale, angle: this.angle });
    if (this.history.length > this.maxHistory) this.history.shift();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.scale(this.scale, this.scale);

    for (let i = 0; i < this.history.length; i++) {
      const h = this.history[i];
      const t = i / this.history.length;
      ctx.globalAlpha = t * 0.25;

      ctx.save();
      ctx.translate(h.x - this.x, h.y - this.y);
      ctx.rotate(h.angle - this.angle);
      ctx.scale(h.scale / this.scale, h.scale / this.scale);
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
  }
}

for (let i = 0; i < 20; i++) chars.push(new Char());

// explosion burst for celebrations
let bursts = [];
window.triggerBurst = () => {
  const cx = width / 2;
  const cy = height / 2;
  for (let i = 0; i < 24; i++) {
    const ang = (i / 24) * Math.PI * 2;
    const speed = 4 + Math.random() * 6;
    bursts.push({
      x: cx, y: cy,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      emoji: CHAR_EMOJIS[Math.floor(Math.random() * CHAR_EMOJIS.length)],
      life: 1,
      scale: 1.5,
    });
  }
};

function drawFrame() {
  ctx.fillStyle = "rgba(2, 4, 10, " + TRAIL_OPACITY + ")";
  ctx.fillRect(0, 0, width, height);

  const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 340);
  grad.addColorStop(0, "rgba(16, 185, 129, 0.1)");
  grad.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // update bursts
  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i];
    b.x += b.vx;
    b.y += b.vy;
    b.vx *= 0.92;
    b.vy *= 0.92;
    b.life -= 0.025;
    b.scale *= 0.96;

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(b.scale, b.scale);
    ctx.globalAlpha = Math.max(0, b.life);
    ctx.fillText(b.emoji, 0, 0);
    ctx.restore();

    if (b.life <= 0) bursts.splice(i, 1);
  }

  for (const c of chars) {
    c.update();
    c.draw();
  }

  requestAnimationFrame(drawFrame);
}
drawFrame();
