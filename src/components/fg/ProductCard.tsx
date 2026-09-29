import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Timer } from "lucide-react";
import type { Product } from "@/data/products";
import { store } from "@/store/store";
import { discountPct, rs } from "@/utils/format";
import { AddButton, CardSkeleton, ProductArt } from "./primitives";
import { cn } from "@/lib/utils";

export function ProductCard({ p, className }: { p: Product; className?: string }) {
  const art = useRef<HTMLDivElement>(null);
  const off = discountPct(p.price, p.mrp);
  const press = useRef<ReturnType<typeof setTimeout>>();
  const open = () => store.ui({ quickView: p.id });
  return (
    <article
      onClick={open}
      onTouchStart={() => (press.current = setTimeout(open, 450))}
      onTouchEnd={() => clearTimeout(press.current)}
      onKeyDown={(e) => e.key === "Enter" && open()}
      tabIndex={0}
      aria-label={`${p.name}, ${rs(p.price)}`}
      className={cn("card-lift group relative flex cursor-pointer flex-col rounded-2xl border bg-card p-2.5 shadow-[0_1px_3px_oklch(0_0_0/0.04)]", className)}
    >
      {off > 0 && (
        <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-extrabold text-primary-foreground">{off}% OFF</span>
      )}
      <div ref={art}><ProductArt p={p} className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]" /></div>
      <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground"><Timer className="size-3" />{p.eta} MINS</span>
      <h3 className="mt-1.5 line-clamp-2 min-h-[2.5em] text-[13px] font-semibold leading-tight">{p.name}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{p.weight}</p>
      <div className="mt-auto flex items-end justify-between pt-2">
        <div className="leading-tight">
          <div className="text-[13px] font-bold">{rs(p.price)}</div>
          {p.mrp > p.price && <div className="text-[11px] text-muted-foreground line-through">{rs(p.mrp)}</div>}
        </div>
        <AddButton p={p} artRef={art} />
      </div>
    </article>
  );
}

export function ProductRow({ title, items, loading, action }: { title: string; items?: Product[]; loading?: boolean; action?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="py-4" aria-label={title}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <button aria-label="Scroll left" disabled={atStart} onClick={() => scroll(-1)} className="press hidden rounded-full border bg-card p-1.5 shadow-sm disabled:opacity-40 sm:block"><ChevronLeft className="size-4" /></button>
          <button aria-label="Scroll right" onClick={() => scroll(1)} className="press hidden rounded-full border bg-card p-1.5 shadow-sm sm:block"><ChevronRight className="size-4" /></button>
        </div>
      </div>
      <div ref={ref} onScroll={(e) => setAtStart(e.currentTarget.scrollLeft < 10)} className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 pb-2">
        {loading || !items
          ? Array.from({ length: 7 }, (_, i) => <CardSkeleton key={i} />)
          : items.map((p) => <ProductCard key={p.id} p={p} className="w-40 shrink-0 snap-start sm:w-44" />)}
      </div>
    </section>
  );
}
