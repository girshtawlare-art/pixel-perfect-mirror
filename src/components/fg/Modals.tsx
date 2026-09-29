import { useState } from "react";
import { Check, MapPin, Plus, Star, X } from "lucide-react";
import { productById } from "@/data/products";
import { api } from "@/services/api";
import { whyRecommend } from "@/services/ai";
import { store, useStore } from "@/store/store";
import { discountPct, rs } from "@/utils/format";
import { AddButton, ProductArt } from "./primitives";
import { ProductCard } from "./ProductCard";
import { useEsc } from "./CartDrawer";
import { cn } from "@/lib/utils";

function Shell({ onClose, label, children, className }: { onClose: () => void; label: string; children: React.ReactNode; className?: string }) {
  useEsc(true, onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={label}>
      <div className="animate-in fade-in absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("animate-slide-up relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-background shadow-2xl sm:rounded-3xl", className)}>
        <button onClick={onClose} aria-label="Close" className="press absolute right-3 top-3 z-10 rounded-full bg-card p-1.5 shadow"><X className="size-5" /></button>
        {children}
      </div>
    </div>
  );
}

export function QuickView() {
  const id = useStore((s) => s.ui.quickView);
  if (!id) return null;
  return <QuickViewInner key={id} id={id} />;
}

function QuickViewInner({ id }: { id: string }) {
  const p = productById(id);
  const [img, setImg] = useState(0);
  const [variant, setVariant] = useState(0);
  const close = () => store.ui({ quickView: null });
  if (!p) return null;
  const v = p.variants[variant];
  const price = Math.round(p.price * v.mult), mrp = Math.round(p.mrp * v.mult);
  const views = ["", "scale-x-[-1]", "rotate-12"];
  return (
    <Shell onClose={close} label={p.name} className="sm:max-w-3xl">
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <ProductArt p={p} className={cn("aspect-square w-full transition-transform")} size={cn("text-[120px] transition-transform duration-300 inline-block", views[img])} />
          <div className="mt-3 flex gap-2">{views.map((_, k) => <button key={k} aria-label={`Image ${k + 1}`} onClick={() => setImg(k)} className={cn("rounded-xl border-2", img === k ? "border-brand" : "border-transparent")}><ProductArt p={p} className="size-14" size={cn("text-2xl inline-block", views[k])} /></button>)}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-muted-foreground">{p.brand} · {p.sub}</div>
          <h2 className="mt-1 text-2xl font-extrabold leading-tight">{p.name}</h2>
          <div className="mt-1 flex items-center gap-1 text-sm"><Star className="size-4 fill-highlight text-highlight" />{p.rating.toFixed(1)} · ⏱ {p.eta} mins</div>
          <div className="mt-3 flex items-baseline gap-2"><span className="text-2xl font-extrabold">{rs(price)}</span>{mrp > price && <><s className="text-muted-foreground">{rs(mrp)}</s><span className="rounded bg-brand-soft px-1.5 text-xs font-bold text-brand">{discountPct(price, mrp)}% OFF</span></>}</div>
          <div className="mt-4 text-xs font-bold text-muted-foreground">SELECT UNIT</div>
          <div className="mt-2 flex flex-wrap gap-2">{p.variants.map((x, k) => <button key={x.label} onClick={() => setVariant(k)} className={cn("press rounded-xl border px-3 py-2 text-sm font-semibold", variant === k && "border-brand bg-brand-soft text-brand")}>{x.label}</button>)}</div>
          <div className="mt-4 max-w-48"><AddButton p={p} full /></div>
          <div className="mt-5 rounded-2xl border bg-gradient-to-br from-brand-soft to-card p-3">
            <div className="text-xs font-extrabold text-brand">🧞 WHY WE RECOMMEND THIS</div>
            <p className="mt-1 text-sm">{whyRecommend(p)}</p>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {Object.entries(p.nutrition).map(([k, val]) => <div key={k} className="rounded-xl bg-muted p-2"><div className="text-sm font-extrabold">{val}{k === "kcal" ? "" : "g"}</div><div className="text-[10px] uppercase text-muted-foreground">{k}</div></div>)}
          </div>
          {p.diets.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{p.diets.map((d) => <span key={d} className="rounded-full border px-2 py-0.5 text-xs capitalize">{d}</span>)}</div>}
        </div>
      </div>
      <div className="border-t px-5 pb-6 pt-4 sm:px-6">
        <h3 className="mb-3 font-extrabold">Similar products</h3>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">{api.similar(p).map((x) => <ProductCard key={x.id} p={x} className="w-36 shrink-0" />)}</div>
      </div>
    </Shell>
  );
}

export function AddressModal() {
  const open = useStore((s) => s.ui.addressOpen);
  const saved = useStore((s) => s.savedAddresses);
  const current = useStore((s) => s.address);
  const [line, setLine] = useState("");
  if (!open) return null;
  const close = () => store.ui({ addressOpen: false });
  return (
    <Shell onClose={close} label="Choose delivery address" className="sm:max-w-lg">
      <div className="relative h-44 overflow-hidden bg-brand-soft" aria-hidden>
        <svg className="absolute inset-0 size-full opacity-60" viewBox="0 0 400 180">
          {[20, 70, 120, 160].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y + 10} stroke="currentColor" className="text-card" strokeWidth="10" />)}
          {[60, 170, 290].map((x) => <line key={x} x1={x} y1="0" x2={x + 20} y2="180" stroke="currentColor" className="text-card" strokeWidth="8" />)}
        </svg>
        <MapPin className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-full animate-bounce fill-brand text-brand-foreground" />
      </div>
      <div className="p-5">
        <h2 className="text-lg font-extrabold">Select delivery location</h2>
        <button onClick={() => { store.set({ address: { id: "gps", label: "Current", line: "Near Agara Lake, HSR Layout, Bengaluru" } }); close(); }} className="press mt-3 flex w-full items-center gap-2 rounded-xl border border-brand p-3 text-sm font-bold text-brand"><MapPin className="size-4" />Use my current location</button>
        <div className="mt-4 text-xs font-bold text-muted-foreground">SAVED ADDRESSES</div>
        <ul className="mt-2 space-y-2">
          {saved.map((a) => (
            <li key={a.id}><button onClick={() => { store.set({ address: a }); close(); }} className={cn("flex w-full items-start gap-3 rounded-xl border p-3 text-left", current.id === a.id && "border-brand bg-brand-soft")}>
              <span className="text-xl">{a.label === "Work" ? "🏢" : "🏠"}</span><span className="flex-1"><b className="block text-sm">{a.label}</b><span className="text-xs text-muted-foreground">{a.line}</span></span>{current.id === a.id && <Check className="size-4 text-brand" />}
            </button></li>
          ))}
        </ul>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!line.trim()) return; const a = { id: `a${Date.now()}`, label: "Other", line }; store.set((s) => ({ savedAddresses: [...s.savedAddresses, a], address: a })); setLine(""); close(); }}>
          <input value={line} onChange={(e) => setLine(e.target.value)} placeholder="Add a new address" aria-label="New address" className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:border-brand" />
          <button aria-label="Save address" className="press rounded-lg bg-brand px-3 text-brand-foreground"><Plus className="size-4" /></button>
        </form>
      </div>
    </Shell>
  );
}
