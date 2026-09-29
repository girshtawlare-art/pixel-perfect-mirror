import { useEffect, useRef, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { store, useStore } from "@/store/store";
import { flyToCart, ripple } from "@/utils/animations";
import { cn } from "@/lib/utils";

export function ProductArt({ p, className, size = "text-5xl" }: { p: Product; className?: string; size?: string }) {
  const [a, b] = (getCategory(p.category)?.tint ?? "#eee,#ddd").split(",");
  return (
    <div className={cn("flex items-center justify-center rounded-xl", className)} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}>
      <span className={cn("drop-shadow-sm select-none", size)} aria-hidden>{p.emoji}</span>
    </div>
  );
}

export function AddButton({ p, artRef, full }: { p: Product; artRef?: React.RefObject<HTMLElement | null>; full?: boolean }) {
  const qty = useStore((s) => s.cart[p.id] ?? 0);
  const add = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); ripple(e);
    flyToCart(artRef?.current ?? e.currentTarget, p.emoji);
    store.add(p.id);
    if (qty === 0) toast.success(`${p.name} added`, { action: { label: "Undo", onClick: () => store.setQty(p.id, 0) } });
  };
  if (!qty)
    return (
      <button onClick={add} aria-label={`Add ${p.name} to cart`}
        className={cn("press relative overflow-hidden rounded-lg border border-brand bg-brand-soft/60 px-4 py-1.5 text-xs font-extrabold text-brand hover:bg-brand-soft", full && "w-full py-2.5 text-sm")}>
        ADD
      </button>
    );
  return (
    <div onClick={(e) => e.stopPropagation()} className={cn("animate-fade-up flex items-center justify-between gap-2 rounded-lg bg-brand px-1.5 py-1 text-brand-foreground", full && "w-full py-2")} role="group" aria-label={`${p.name} quantity`}>
      <button className="press rounded p-0.5" aria-label="Decrease" onClick={() => { store.setQty(p.id, qty - 1); if (qty === 1) toast(`${p.name} removed`, { action: { label: "Undo", onClick: () => store.setQty(p.id, 1) } }); }}><Minus className="size-3.5" strokeWidth={3} /></button>
      <span className="min-w-4 text-center text-xs font-extrabold tabular-nums">{qty}</span>
      <button className="press rounded p-0.5" aria-label="Increase" onClick={add}><Plus className="size-3.5" strokeWidth={3} /></button>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-xl", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="w-40 shrink-0 rounded-2xl border bg-card p-2.5 sm:w-44">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="mt-3 h-3 w-3/4" /><Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-3 flex justify-between"><Skeleton className="h-4 w-10" /><Skeleton className="h-7 w-14" /></div>
    </div>
  );
}

/** Reveals children on scroll via IntersectionObserver. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function EmptyState({ emoji, title, text, children }: { emoji: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="mb-3 text-6xl">{emoji}</div>
      <h3 className="text-base font-bold">{title}</h3>
      {text && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{text}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
