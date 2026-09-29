import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { cartSummary, store, useStore } from "@/store/store";
import { Bill } from "@/components/fg/CartDrawer";
import { EmptyState, ProductArt } from "@/components/fg/primitives";
import { confetti } from "@/utils/animations";
import { rs, sleep } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — FreshGenie" },
      { name: "description", content: "Choose address, delivery slot and payment to place your FreshGenie order." },
      { property: "og:title", content: "Checkout — FreshGenie" },
      { property: "og:description", content: "Complete your grocery order in seconds." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const PAY: [string, string, string, string][] = [["upi", "📱", "UPI", "GPay, PhonePe, Paytm"], ["card", "💳", "Cards", "Credit & debit"], ["cod", "💵", "Cash on Delivery", "Pay at your door"], ["wallet", "👛", "Wallet", "FreshGenie balance ₹120"]];
const SLOTS = ["7–8 PM", "8–9 PM", "Tomorrow 7–9 AM"];

function Checkout() {
  const s = useStore((x) => x);
  const sum = cartSummary(s);
  const [slot, setSlot] = useState<"instant" | "scheduled">("instant");
  const [time, setTime] = useState<string>(SLOTS[0]!);
  const [pay, setPay] = useState("upi");
  const [placing, setPlacing] = useState(false);
  const nav = useNavigate();

  if (sum.count === 0 && !placing) return <EmptyState emoji="🧺" title="Nothing to check out" text="Your cart is empty."><Link to="/" className="press rounded-full bg-brand px-5 py-2 text-sm font-bold text-brand-foreground">Browse products</Link></EmptyState>;

  const place = async () => {
    setPlacing(true);
    await sleep(1600); // TODO(real API): POST /orders
    store.set((st) => ({ lastOrder: { id: `FG${Date.now().toString().slice(-6)}`, placedAt: Date.now(), items: st.cart, total: sum.total }, cart: {}, coupon: null, pastOrders: [...new Set([...Object.keys(st.cart), ...st.pastOrders])].slice(0, 12) }));
    confetti();
    nav({ to: "/tracking" });
  };

  const card = (active: boolean) => cn("press rounded-2xl border bg-card p-4 text-left transition-colors", active && "border-brand bg-brand-soft ring-1 ring-brand");

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold">Checkout</h1>
        <section>
          <h2 className="mb-2 font-extrabold">1. Delivery address</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {s.savedAddresses.map((a) => (
              <button key={a.id} onClick={() => store.set({ address: a })} className={card(s.address.id === a.id)}>
                <div className="flex items-center justify-between font-bold">{a.label}{s.address.id === a.id && <Check className="size-4 text-brand" />}</div>
                <div className="text-sm text-muted-foreground">{a.line}</div>
              </button>
            ))}
            <button onClick={() => store.ui({ addressOpen: true })} className="rounded-2xl border border-dashed p-4 text-sm font-bold text-brand">+ Add new address</button>
          </div>
        </section>
        <section>
          <h2 className="mb-2 font-extrabold">2. Delivery slot</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => setSlot("instant")} className={card(slot === "instant")}><div className="font-bold">⚡ Instant</div><div className="text-sm text-muted-foreground">Arrives in 9 minutes</div></button>
            <button onClick={() => setSlot("scheduled")} className={card(slot === "scheduled")}><div className="font-bold">📅 Scheduled</div><div className="text-sm text-muted-foreground">Pick a time that suits you</div></button>
          </div>
          {slot === "scheduled" && <div className="animate-fade-up mt-3 flex flex-wrap gap-2">{SLOTS.map((t) => <button key={t} onClick={() => setTime(t)} className={cn("press rounded-full border px-4 py-1.5 text-sm font-semibold", time === t && "border-brand bg-brand text-brand-foreground")}>{t}</button>)}</div>}
        </section>
        <section>
          <h2 className="mb-2 font-extrabold">3. Payment</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PAY.map(([id, e, t, d]) => <button key={id} onClick={() => setPay(id)} className={card(pay === id)} aria-pressed={pay === id}><div className="flex items-center gap-3"><span className="text-2xl">{e}</span><div><div className="font-bold">{t}</div><div className="text-xs text-muted-foreground">{d}</div></div></div></button>)}
          </div>
        </section>
      </div>
      <aside className="h-fit space-y-3 lg:sticky lg:top-32">
        <div className="rounded-2xl border bg-card p-4">
          <h3 className="mb-2 font-extrabold">Order summary · {sum.count} items</h3>
          <ul className="max-h-60 space-y-2 overflow-y-auto">{sum.lines.map(({ p, qty }) => <li key={p.id} className="flex items-center gap-2 text-sm"><ProductArt p={p} className="size-9" size="text-lg" /><span className="flex-1 truncate">{qty} × {p.name}</span><b>{rs(p.price * qty)}</b></li>)}</ul>
        </div>
        <Bill s={sum} />
        <button onClick={place} disabled={placing} className="press flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-bold text-brand-foreground disabled:opacity-80">
          {placing ? <><Loader2 className="size-5 animate-spin" />Placing order…</> : <>Place order · {rs(sum.total)}</>}
        </button>
      </aside>
    </div>
  );
}
