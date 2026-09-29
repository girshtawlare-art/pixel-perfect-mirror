import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { api, type SortKey } from "@/services/api";
import { products, type Diet } from "@/data/products";
import type { Category } from "@/data/categories";
import { ProductCard } from "./ProductCard";
import { EmptyState, Skeleton } from "./primitives";
import { cn } from "@/lib/utils";

const DIETS: Diet[] = ["vegan", "keto", "high-protein", "gluten-free", "low-sugar"];

export function Results({ category, q }: { category?: Category; q?: string }) {
  const [sub, setSub] = useState<string | undefined>();
  const [sort, setSort] = useState<SortKey>("relevance");
  const [maxPrice, setMaxPrice] = useState(700);
  const [brands, setBrands] = useState<string[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const allBrands = useMemo(() => [...new Set(products.filter((p) => !category || p.category === category.slug).map((p) => p.brand))].sort(), [category]);
  const query = { category: category?.slug, q, sub, sort, maxPrice, brands, diets };
  const r = useQuery({ queryKey: ["list", query], queryFn: () => api.list(query) });
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="mx-auto flex max-w-7xl gap-4 px-4 py-4">
      {category && (
        <aside className="sticky top-32 hidden h-fit w-52 shrink-0 overflow-hidden rounded-2xl border bg-card md:block" aria-label="Subcategories">
          {[undefined, ...category.subs].map((s) => (
            <button key={s ?? "all"} onClick={() => setSub(s)} className={cn("flex w-full items-center gap-3 border-l-4 px-3 py-3 text-left text-sm font-semibold", sub === s ? "border-brand bg-brand-soft text-brand" : "border-transparent hover:bg-muted")}>
              <span className="text-xl">{s ? category.emoji : "🛍️"}</span>{s ?? "All"}
            </button>
          ))}
        </aside>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-extrabold">{category ? category.name : `Results for "${q}"`} <span className="text-sm font-medium text-muted-foreground">{r.data ? `(${r.data.length})` : ""}</span></h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters((x) => !x)} className="press inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold"><SlidersHorizontal className="size-4" />Filters</button>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort" className="rounded-full border bg-card px-3 py-1.5 text-sm font-semibold">
              <option value="relevance">Relevance</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="discount">Discount</option>
            </select>
          </div>
        </div>
        {category && (
          <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 md:hidden">
            {[undefined, ...category.subs].map((s) => <button key={s ?? "all"} onClick={() => setSub(s)} className={cn("shrink-0 rounded-full border px-3 py-1 text-xs font-semibold", sub === s && "border-brand bg-brand text-brand-foreground")}>{s ?? "All"}</button>)}
          </div>
        )}
        {showFilters && (
          <div className="animate-slide-up mb-4 grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-3">
            <label className="text-sm font-semibold">Max price: ₹{maxPrice}
              <input type="range" min={20} max={700} step={10} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="mt-2 w-full accent-[var(--color-brand)]" />
            </label>
            <div><div className="mb-1 text-sm font-semibold">Brand</div><div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">{allBrands.map((b) => <button key={b} onClick={() => setBrands((x) => toggle(x, b))} className={cn("rounded-full border px-2.5 py-0.5 text-xs", brands.includes(b) && "border-brand bg-brand-soft text-brand")}>{b}</button>)}</div></div>
            <div><div className="mb-1 text-sm font-semibold">Diet</div><div className="flex flex-wrap gap-1.5">{DIETS.map((d) => <button key={d} onClick={() => setDiets((x) => toggle(x, d))} className={cn("rounded-full border px-2.5 py-0.5 text-xs capitalize", diets.includes(d) && "border-brand bg-brand-soft text-brand")}>{d}</button>)}</div></div>
          </div>
        )}
        {r.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{Array.from({ length: 10 }, (_, i) => <Skeleton key={i} className="h-72" />)}</div>
        ) : r.data?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{r.data.map((p, i) => <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}><ProductCard p={p} className="h-full" /></div>)}</div>
        ) : (
          <EmptyState emoji="🔍" title="Nothing here yet" text="Try removing a filter or searching for something else." />
        )}
      </div>
    </div>
  );
}
