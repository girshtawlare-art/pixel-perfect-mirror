import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Clock, Moon, Search, ShoppingCart, Sun, User, X } from "lucide-react";
import { api } from "@/services/api";
import { store, useStore, cartSummary } from "@/store/store";
import { rs } from "@/utils/format";
import { ProductArt } from "./primitives";
import { cn } from "@/lib/utils";

const HINTS = ["milk", "chips", "paneer", "bread", "atta", "coffee"];

function Highlight({ text, q }: { text: string; q: string }) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (!q || i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark className="rounded bg-highlight/60 px-0.5 text-foreground">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

export function SearchBar({ className }: { className?: string }) {
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [focus, setFocus] = useState(false);
  const [hint, setHint] = useState(0);
  const recent = useStore((s) => s.recentSearches);
  const nav = useNavigate();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 2200); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setTimeout(() => setDq(q), 200); return () => clearTimeout(t); }, [q]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setFocus(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const sugg = useMemo(() => api.suggest(dq), [dq]);

  const go = (term: string) => { store.addSearch(term); setFocus(false); setQ(term); nav({ to: "/search", search: { q: term } }); };

  return (
    <div ref={box} className={cn("relative", className)}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); if (q.trim()) go(q.trim()); }}
        className="flex h-11 items-center gap-2 rounded-xl border bg-muted/70 px-3 focus-within:border-brand focus-within:bg-card">
        <Search className="size-4 text-muted-foreground" />
        <div className="relative flex-1">
          <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)} aria-label="Search products"
            className="w-full bg-transparent text-sm outline-none" />
          {!q && (
            <span className="pointer-events-none absolute inset-0 flex items-center overflow-hidden text-sm text-muted-foreground">
              Search&nbsp;<span key={hint} className="animate-fade-up">"{HINTS[hint]}"</span>
            </span>
          )}
        </div>
        {q && <button type="button" aria-label="Clear" onClick={() => setQ("")}><X className="size-4 text-muted-foreground" /></button>}
      </form>
      {focus && (
        <div className="animate-slide-up absolute inset-x-0 top-12 z-50 overflow-hidden rounded-2xl border bg-popover p-2 shadow-xl">
          {!q && recent.length > 0 && (
            <div className="p-2">
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted-foreground">RECENT SEARCHES
                <button className="text-brand" onClick={() => store.set({ recentSearches: [] })}>Clear</button></div>
              <div className="flex flex-wrap gap-2">{recent.map((r) => <button key={r} onClick={() => go(r)} className="press inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs"><Clock className="size-3" />{r}</button>)}</div>
            </div>
          )}
          {!q && <div className="p-2"><div className="mb-2 text-xs font-bold text-muted-foreground">TRENDING</div><div className="flex flex-wrap gap-2">{HINTS.map((h) => <button key={h} onClick={() => go(h)} className="press rounded-full bg-muted px-3 py-1 text-xs font-medium">{h}</button>)}</div></div>}
          {q && q !== dq && <div className="space-y-2 p-2">{[0, 1, 2].map((i) => <div key={i} className="shimmer h-10 rounded-lg" />)}</div>}
          {q && q === dq && sugg.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No matches for "{q}" 🤔</p>}
          {q && q === dq && sugg.map((p) => (
            <button key={p.id} onClick={() => { store.addSearch(q); setFocus(false); store.ui({ quickView: p.id }); }} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-muted">
              <ProductArt p={p} className="size-10" size="text-xl" />
              <div className="flex-1"><div className="text-sm font-medium"><Highlight text={p.name} q={q} /></div><div className="text-xs text-muted-foreground">{p.weight} · {p.brand}</div></div>
              <span className="text-sm font-bold">{rs(p.price)}</span>
            </button>
          ))}
          {q && q === dq && sugg.length > 0 && <button onClick={() => go(q)} className="w-full rounded-xl p-2 text-sm font-semibold text-brand hover:bg-muted">See all results for "{q}"</button>}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const address = useStore((s) => s.address);
  const dark = useStore((s) => s.dark);
  const bump = useStore((s) => s.ui.cartBump);
  const { count, total } = useStore((s) => cartSummary(s));
  useEffect(() => { const f = () => setScrolled(scrollY > 8); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);

  return (
    <header className={cn("sticky top-0 z-40 border-b transition-all", scrolled ? "bg-background/75 shadow-sm backdrop-blur-xl" : "bg-background")}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2.5 lg:flex-nowrap lg:gap-6">
        <Link to="/" className="flex items-center gap-1.5" aria-label="FreshGenie home">
          <span className="grid size-9 place-items-center rounded-xl bg-highlight text-lg">🧞</span>
          <span className="text-xl font-extrabold tracking-tight"><span className="text-brand">fresh</span>genie</span>
        </Link>
        <button onClick={() => store.ui({ addressOpen: true })} className="press min-w-0 flex-1 text-left lg:w-64 lg:flex-none">
          <div className="flex items-center gap-1.5 text-sm font-extrabold">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-brand" /></span>
            Delivery in 9 minutes
          </div>
          <div className="flex items-center gap-0.5 truncate text-xs text-muted-foreground"><span className="truncate">{address.label} – {address.line}</span><ChevronDown className="size-3.5 shrink-0" /></div>
        </button>
        <div className="flex items-center gap-1.5 lg:order-last">
          <button aria-label="Toggle dark mode" onClick={() => store.set({ dark: !dark })} className="press rounded-full p-2 hover:bg-muted">{dark ? <Sun className="size-5" /> : <Moon className="size-5" />}</button>
          <button className="press hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold hover:bg-muted sm:flex" aria-label="Login"><User className="size-4" />Login</button>
          <button id="cart-btn" key={bump} onClick={() => store.ui({ cartOpen: true })} aria-label={`Cart, ${count} items`}
            className={cn("press flex h-11 items-center gap-2 rounded-xl px-3 font-bold", count ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground", bump > 0 && "animate-bump")}>
            <ShoppingCart className="size-5" />
            {count ? <span className="text-left text-xs leading-tight">{count} item{count > 1 && "s"}<br />{rs(total)}</span> : <span className="text-sm">My Cart</span>}
          </button>
        </div>
        <SearchBar className="order-last w-full lg:order-none lg:flex-1" />
      </div>
    </header>
  );
}
