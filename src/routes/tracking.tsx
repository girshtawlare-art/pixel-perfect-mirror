import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageCircle, Phone } from "lucide-react";
import { productById } from "@/data/products";
import { useStore } from "@/store/store";
import { EmptyState } from "@/components/fg/primitives";
import { rs } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Track your order — FreshGenie" },
      { name: "description", content: "Watch your FreshGenie rider live on the map." },
      { property: "og:title", content: "Track your order — FreshGenie" },
      { property: "og:description", content: "Live order tracking with your rider's location." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Tracking,
});

const STEPS = ["Confirmed", "Packing", "Out for delivery", "Arrived"];
const TOTAL = 9 * 60 * 1000;
const PATH = "M40,200 C120,190 110,110 190,110 S280,40 360,50";

function Tracking() {
  const order = useStore((s) => s.lastOrder);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (!order) return <EmptyState emoji="🛵" title="No active orders" text="Place an order and track it live here."><Link to="/" className="press rounded-full bg-brand px-5 py-2 text-sm font-bold text-brand-foreground">Start shopping</Link></EmptyState>;

  // Demo speeds time up 6x so the whole journey is visible in ~90s.
  const elapsed = Math.min(TOTAL, (now - order.placedAt) * 6);
  const prog = elapsed / TOTAL;
  const step = prog >= 1 ? 3 : prog > 0.35 ? 2 : prog > 0.1 ? 1 : 0;
  const left = Math.max(0, TOTAL - elapsed) / 6;
  const mm = Math.floor(left / 60000), ss = Math.floor((left % 60000) / 1000);
  const riderT = Math.max(0, (prog - 0.35) / 0.65);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div><div className="text-sm text-muted-foreground">Order #{order.id}</div><h1 className="text-2xl font-extrabold">{step === 3 ? "Delivered! Enjoy 🎉" : STEPS[step] + "…"}</h1></div>
        {step < 3 && <div className="rounded-2xl bg-brand px-4 py-2 text-center text-brand-foreground"><div className="text-2xl font-extrabold tabular-nums">{mm}:{String(ss).padStart(2, "0")}</div><div className="text-[10px] font-bold uppercase">arriving in</div></div>}
      </div>

      <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Order progress">
        {STEPS.map((s, i) => (
          <li key={s} className="relative flex flex-col items-center text-center">
            {i > 0 && <span className="absolute right-1/2 top-4 h-1 w-full -translate-y-1/2 rounded bg-muted"><span className="block h-full rounded bg-brand transition-all duration-700" style={{ width: step >= i ? "100%" : "0%" }} /></span>}
            <span className={cn("relative z-10 grid size-8 place-items-center rounded-full border-2 text-xs font-bold transition-colors duration-500", step >= i ? "border-brand bg-brand text-brand-foreground" : "bg-card")}>{step > i ? <Check className="size-4" /> : i + 1}</span>
            <span className={cn("mt-1.5 text-xs font-semibold", step >= i ? "text-foreground" : "text-muted-foreground")}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="relative mt-6 overflow-hidden rounded-3xl border bg-brand-soft" aria-label="Live map">
        <svg viewBox="0 0 400 240" className="h-64 w-full sm:h-80">
          {[30, 90, 150, 210].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y - 20} className="stroke-card" strokeWidth="12" />)}
          {[80, 220, 330].map((x) => <line key={x} x1={x} y1="0" x2={x - 30} y2="240" className="stroke-card" strokeWidth="10" />)}
          <path id="route" d={PATH} fill="none" className="stroke-brand" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" />
          <text x="22" y="215" fontSize="26">🏪</text>
          <text x="345" y="45" fontSize="26">🏠</text>
          <g>
            <circle r="16" className="fill-highlight" opacity=".35"><animate attributeName="r" values="12;20;12" dur="1.6s" repeatCount="indefinite" /></circle>
            <text x="-12" y="8" fontSize="22">🛵</text>
            <animateMotion dur="0.01s" fill="freeze" keyPoints={`${riderT};${riderT}`} keyTimes="0;1" calcMode="linear" path={PATH} key={Math.round(riderT * 200)} />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
          <span className="grid size-12 place-items-center rounded-full bg-highlight text-2xl">🧑🏽</span>
          <div className="flex-1"><div className="font-bold">Ravi Kumar</div><div className="text-xs text-muted-foreground">⭐ 4.9 · KA 01 AB 1234</div></div>
          <a href="tel:+910000000000" aria-label="Call rider" className="press grid size-10 place-items-center rounded-full bg-brand-soft text-brand"><Phone className="size-4" /></a>
          <button aria-label="Chat with rider" className="press grid size-10 place-items-center rounded-full bg-brand-soft text-brand"><MessageCircle className="size-4" /></button>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <h3 className="mb-2 font-extrabold">Order details</h3>
          <ul className="space-y-1 text-sm">{Object.entries(order.items).map(([id, q]) => { const p = productById(id); return p && <li key={id} className="flex justify-between"><span>{p.emoji} {q} × {p.name}</span><span>{rs(p.price * q)}</span></li>; })}</ul>
          <div className="mt-2 flex justify-between border-t pt-2 font-extrabold"><span>Paid</span><span>{rs(order.total)}</span></div>
        </div>
      </div>
    </div>
  );
}
