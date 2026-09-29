import { useMemo, useState } from "react";
import { ArrowRight, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateBasket, recipeBasket, type BasketItem } from "@/services/ai";
import { filterProducts } from "@/services/api";
import type { Diet } from "@/data/products";
import { store } from "@/store/store";
import { rs } from "@/utils/format";
import { confetti } from "@/utils/animations";
import { ProductArt } from "./primitives";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

export function Thinking({ label = "FreshGenie is thinking" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
      <span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="typing-dot size-1.5 rounded-full bg-brand" style={{ animationDelay: `${i * 0.15}s` }} />)}</span>{label}…
    </div>
  );
}

export function BasketList({ items, compact }: { items: BasketItem[]; compact?: boolean }) {
  const total = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  return (
    <div>
      <ul className={cn("grid gap-2", !compact && "sm:grid-cols-2 lg:grid-cols-3")}>
        {items.map((i, k) => (
          <li key={i.product.id} className="animate-fade-up flex items-center gap-3 rounded-xl border bg-card p-2" style={{ animationDelay: `${k * 60}ms` }}>
            <ProductArt p={i.product} className="size-11 shrink-0" size="text-2xl" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{i.product.name}</div>
              <div className="truncate text-xs text-muted-foreground">{i.qty} × {i.product.weight}{i.note && ` · ${i.note}`}</div>
            </div>
            <span className="text-sm font-bold">{rs(i.product.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => { items.forEach((i) => store.add(i.product.id, i.qty)); toast.success(`${items.length} items added to cart`); store.ui({ cartOpen: true }); }}
        className="press mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground sm:w-auto">
        Add all to cart · {rs(total)} <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

const RECIPES: [string, string][] = [["🍝", "Pasta Night"], ["🍛", "Biryani"], ["🥣", "Healthy Breakfast"], ["🎉", "Party Snacks"]];
const DIETS: [Diet, string][] = [["vegan", "🌱 Vegan"], ["keto", "🥑 Keto"], ["high-protein", "💪 High-protein"], ["gluten-free", "🌾 Gluten-free"], ["low-sugar", "🍬 Low-sugar"]];

export function AiStrip() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; items: BasketItem[] } | null>(null);
  const [diets, setDiets] = useState<Diet[]>([]);
  const dietResults = useMemo(() => (diets.length ? filterProducts({ diets }).slice(0, 10) : []), [diets]);

  const ask = async (p: string) => {
    if (!p.trim()) return;
    setLoading(true); setResult(null);
    const r = await generateBasket(p);
    setResult(r); setLoading(false);
  };

  return (
    <section aria-labelledby="ai-title" className="relative mt-6 overflow-hidden rounded-3xl border bg-gradient-to-br from-brand-soft via-card to-highlight/25 p-5 sm:p-8">
      <div className="absolute -right-6 -top-6 text-8xl opacity-20 sm:text-9xl" aria-hidden>🧞</div>
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-brand"><Wand2 className="size-4" />AI-powered</div>
      <h2 id="ai-title" className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Ask FreshGenie</h2>
      <p className="mt-1 text-sm text-muted-foreground">Tell me what you're cooking. I'll build the basket.</p>

      <form onSubmit={(e) => { e.preventDefault(); ask(prompt); }} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} aria-label="Describe what you need"
          placeholder="ingredients for paneer butter masala for 4 people"
          className="h-12 flex-1 rounded-full border bg-card px-5 text-sm shadow-sm outline-none focus:border-brand" />
        <button disabled={loading} className="press h-12 rounded-full bg-foreground px-6 text-sm font-bold text-background disabled:opacity-60">Generate basket ✨</button>
      </form>

      <div className="mt-4">
        <div className="mb-2 text-xs font-bold text-muted-foreground">RECIPE TO CART</div>
        <div className="flex flex-wrap gap-2">
          {RECIPES.map(([e, n]) => (
            <button key={n} onClick={() => { setPrompt(n); setLoading(true); setResult(null); setTimeout(() => { setResult({ title: n, items: recipeBasket(n) }); setLoading(false); }, 700); }}
              className="press rounded-full border bg-card px-4 py-2 text-sm font-semibold shadow-sm hover:border-brand">{e} {n}</button>
          ))}
        </div>
      </div>

      {(loading || result) && (
        <div className="animate-slide-up mt-5 rounded-2xl border bg-background/70 p-4 backdrop-blur" aria-live="polite">
          {loading ? (
            <div className="space-y-3"><Thinking /><div className="grid gap-2 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="shimmer h-14 rounded-xl" />)}</div></div>
          ) : result && (
            <><h3 className="mb-3 font-extrabold">🧺 {result.title}</h3><BasketList items={result.items} /></>
          )}
        </div>
      )}

      <div className="mt-6">
        <div className="mb-2 text-xs font-bold text-muted-foreground">DIET FILTERS</div>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {DIETS.map(([d, l]) => {
            const on = diets.includes(d);
            return <button key={d} aria-pressed={on} onClick={() => setDiets((x) => (on ? x.filter((y) => y !== d) : [...x, d]))}
              className={cn("press shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors", on ? "border-brand bg-brand text-brand-foreground" : "bg-card")}>{l}</button>;
          })}
        </div>
        {diets.length > 0 && (
          dietResults.length
            ? <div className="no-scrollbar -mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-2">{dietResults.map((p) => <ProductCard key={p.id} p={p} className="w-40 shrink-0" />)}</div>
            : <p className="mt-3 text-sm text-muted-foreground">No products match all of those filters yet 🥲</p>
        )}
      </div>
    </section>
  );
}

export { confetti };
