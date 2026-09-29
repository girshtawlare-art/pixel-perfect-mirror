import { reducedMotion } from "./format";

/** Flies an emoji from the source element to the cart button in an arc. */
export function flyToCart(source: HTMLElement | null, emoji: string) {
  if (!source || reducedMotion()) return;
  const target = document.getElementById("cart-btn");
  if (!target) return;
  const a = source.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const el = document.createElement("div");
  el.textContent = emoji;
  Object.assign(el.style, {
    position: "fixed", left: `${a.left + a.width / 2 - 20}px`, top: `${a.top + a.height / 2 - 20}px`,
    fontSize: "40px", zIndex: "9999", pointerEvents: "none", willChange: "transform",
  });
  document.body.appendChild(el);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = el.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(.8)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.25)`, opacity: 0.4 },
    ],
    { duration: 700, easing: "cubic-bezier(.5,0,.5,1)" },
  );
  anim.onfinish = () => el.remove();
}

/** Lightweight canvas confetti. */
export function confetti() {
  if (typeof window === "undefined" || reducedMotion()) return;
  const c = document.createElement("canvas");
  c.width = innerWidth; c.height = innerHeight;
  Object.assign(c.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: "10000" });
  document.body.appendChild(c);
  const ctx = c.getContext("2d")!;
  const colors = ["#0C831F", "#F8CB46", "#FF6B6B", "#4DABF7", "#FFFFFF"];
  const parts = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2, y: innerHeight * 0.4,
    vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 4,
    s: Math.random() * 6 + 4, r: Math.random() * 6, c: colors[(Math.random() * colors.length) | 0],
  }));
  let f = 0;
  const tick = () => {
    ctx.clearRect(0, 0, c.width, c.height);
    parts.forEach((p) => {
      p.vy += 0.4; p.x += p.vx; p.y += p.vy; p.r += 0.1;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); ctx.restore();
    });
    if (++f < 110) requestAnimationFrame(tick); else c.remove();
  };
  tick();
}

export function ripple(e: React.MouseEvent<HTMLElement>) {
  if (reducedMotion()) return;
  const t = e.currentTarget; const r = t.getBoundingClientRect();
  const s = document.createElement("span"); const d = Math.max(r.width, r.height);
  s.className = "ripple-span";
  Object.assign(s.style, { width: `${d}px`, height: `${d}px`, left: `${e.clientX - r.left - d / 2}px`, top: `${e.clientY - r.top - d / 2}px` });
  t.appendChild(s); setTimeout(() => s.remove(), 600);
}
