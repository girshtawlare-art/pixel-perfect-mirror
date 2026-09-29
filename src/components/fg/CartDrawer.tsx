import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Tag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { forgotten } from "@/services/ai";
import { FREE_DELIVERY_AT, cartSummary, store, useStore } from "@/store/store";
import { rs } from "@/utils/format";
import { confetti } from "@/utils/animations";
import { AddButton, EmptyState, ProductArt } from "./primitives";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

export function useEsc(on: boolean, close: () => void) {
  useEffect(() => {
    if (!on) return;
    const f = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", f); document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", f); document.body.style.overflow = ""; };
  }, [on, close]);
}

export function Bill({ s }: { s: ReturnType<typeof cartSummary> }) {
  const row = (l: string, v: number, free?: boolean) => (
    <div className="flex justify-between text-sm"><span className="text-muted-foreground">{l}</span><span>{free ? <><s className="mr-1 text-muted-foreground">₹30</s><b className="text-brand">FREE</b></> : rs(v)}</span></div>
  );
  return (
    <div className="space-y-1.5 rounded-2xl border bg-card p-4">
      <h4 className="mb-1 font-extrabold">Bill details</h4>
      {row("Items total", s.items)}
      {row("Delivery fee", s.delivery, s.delivery === 0)}
      {row("Handling fee", s.handling)}
      {s.smallCart > 0 && row("Small cart fee", s.smallCart)}
      {s.couponOff > 0 && <div className="flex justify-between text-sm text-brand"><span>Coupon FIRST50</span><span>-{rs(s.couponOff)}</span></div>}
      <div className="flex justify-between border-t pt-2 font-extrabold"><span>Grand total</span><span>{rs(s.total)}</span></div>
    </div>
  );
}

export function CartDrawer() {
  const open = useStore((s) => s.ui.cartOpen);
  const coupon = useStore((s) => s.coupon);
  const s = useStore((st) => st);
  const sum = cartSummary(s);
  const [code, setCode] = useState("");
  const [tip, setTip] = useState(0);
  const [removing, setRemoving] = useState<string | null>(null);
  const nav = useNavigate();
  const close = () => store.ui({ cartOpen: false });
  useEsc(open, close);
  const ids = Object.keys(s.cart).join(",");
  const forgot = useMemo(() => forgotten(ids ? ids.split(",") : []), [ids]);
  if (!open) return null;

  const pct = Math.min(100, (sum.items / FREE_DELIVERY_AT) * 100);
  const apply = () => {
    if (code.trim().toUpperCase() === "FIRST50") { store.set({ coupon: "FIRST50" }); confetti(); toast.success("FIRST50 applied! You saved ₹50 🎉"); }
    else toast.error("Invalid coupon. Try FIRST50");
  };
  const remove = (id: string) => { setRemoving(id); setTimeout(() => { store.setQty(id, 0); setRemoving(null); }, 250); };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
      <div className="animate-in fade-in absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={close} />
      <aside className="animate-in slide-in-from-bottom sm:slide-in-from-right absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-3xl bg-background shadow-2xl duration-300 sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-extrabold">My Cart</h2>
          <button onClick={close} aria-label="Close cart" className="press rounded-full p-1.5 hover:bg-muted"><X className="size-5" /></button>
        </div>
        {sum.count === 0 ? (
          <EmptyState emoji="🛒" title="Your cart is empty" text="Add something delicious — it'll be at your door in minutes.">
            <button onClick={close} className="press rounded-full bg-brand px-5 py-2 text-sm font-bold text-brand-foreground">Start shopping</button>
          </EmptyState>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {sum.saved > 0 && <div className="rounded-xl bg-brand-soft px-4 py-2 text-sm font-bold text-brand">🎉 You saved {rs(sum.saved)} on this order</div>}
              <div className="rounded-2xl border bg-card p-3">
                <div className="text-sm font-bold">{sum.items >= FREE_DELIVERY_AT ? "🥳 Yay! You get FREE delivery" : `Add ${rs(FREE_DELIVERY_AT - sum.items)} more for FREE delivery`}</div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${pct}%` }} /></div>
              </div>
              <ul className="rounded-2xl border bg-card p-3">
                {sum.lines.map(({ p, qty }) => (
                  <li key={p.id} className={cn("grid transition-all duration-300", removing === p.id ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr]")}>
                    <div className="flex items-center gap-3 overflow-hidden py-2">
                      <ProductArt p={p} className="size-14 shrink-0" size="text-2xl" />
                      <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{p.name}</div><div className="text-xs text-muted-foreground">{p.weight}</div><div className="text-sm font-bold">{rs(p.price * qty)}</div></div>
                      <div className="w-20"><AddButton p={p} /></div>
                      <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
              {forgot.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-extrabold">🤔 You may have forgotten</h3>
                  <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">{forgot.map((p) => <ProductCard key={p.id} p={p} className="w-36 shrink-0" />)}</div>
                </div>
              )}
              <div className="rounded-2xl border bg-card p-3">
                {coupon ? (
                  <div className="flex items-center justify-between text-sm"><span className="font-bold text-brand"><Tag className="mr-1 inline size-4" />FIRST50 applied</span><button className="text-xs font-bold text-destructive" onClick={() => store.set({ coupon: null })}>Remove</button></div>
                ) : (
                  <div className="flex gap-2"><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter coupon (try FIRST50)" aria-label="Coupon code" className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm uppercase outline-none focus:border-brand" /><button onClick={apply} className="press rounded-lg px-3 text-sm font-bold text-brand">Apply</button></div>
                )}
              </div>
              <div className="rounded-2xl border bg-card p-3">
                <h4 className="text-sm font-extrabold">Tip your delivery partner</h4>
                <div className="mt-2 flex gap-2">{[0, 10, 20, 30, 50].map((t) => <button key={t} onClick={() => setTip(t)} className={cn("press flex-1 rounded-lg border py-1.5 text-sm font-semibold", tip === t && "border-brand bg-brand-soft text-brand")}>{t ? `₹${t}` : "None"}</button>)}</div>
                <textarea placeholder="Delivery instructions (e.g. don't ring the bell)" aria-label="Delivery instructions" className="mt-3 h-16 w-full resize-none rounded-lg border bg-background p-2 text-sm outline-none focus:border-brand" />
              </div>
              <Bill s={sum} />
            </div>
            <div className="border-t bg-background p-3">
              <button onClick={() => { close(); nav({ to: "/checkout" }); }} className="press flex w-full items-center justify-between rounded-xl bg-brand px-4 py-3 font-bold text-brand-foreground">
                <span className="text-left text-sm leading-tight">{rs(sum.total + tip)}<br /><span className="text-xs font-medium opacity-80">TOTAL</span></span>
                <span className="flex items-center">Proceed to Pay <ChevronRight className="size-5" /></span>
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
