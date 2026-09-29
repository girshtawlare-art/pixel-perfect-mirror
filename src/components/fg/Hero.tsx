import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

const BANNERS = [
  { t: "Flat 20% off on fruits", s: "Farm-fresh, handpicked every morning", e: "🍉🍓🍍", bg: "linear-gradient(120deg,#0C831F,#3DBE54)", cta: "fruits-vegetables" },
  { t: "Free delivery above ₹199", s: "No hidden fees. Ever.", e: "🛵💨", bg: "linear-gradient(120deg,#F59F00,#F8CB46)", cta: "snacks" },
  { t: "Dairy at your door by 7am", s: "Milk, paneer, curd & more", e: "🥛🧀🥚", bg: "linear-gradient(120deg,#1C7ED6,#4DABF7)", cta: "dairy-eggs" },
  { t: "Party packs from ₹99", s: "Snacks & drinks for every crowd", e: "🍿🥤🎉", bg: "linear-gradient(120deg,#C2255C,#F06595)", cta: "beverages" },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [y, setY] = useState(0);
  const touch = useRef(0);
  useEffect(() => { if (paused) return; const t = setInterval(() => setI((x) => (x + 1) % BANNERS.length), 4000); return () => clearInterval(t); }, [paused]);
  useEffect(() => { const f = () => setY(Math.min(scrollY, 300)); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);

  return (
    <section aria-roledescription="carousel" aria-label="Offers" className="animate-fade-up relative overflow-hidden rounded-3xl"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? 0)}
      onTouchEnd={(e) => { const d = (e.changedTouches[0]?.clientX ?? 0) - touch.current; if (Math.abs(d) > 40) setI((x) => (x + (d < 0 ? 1 : BANNERS.length - 1)) % BANNERS.length); }}>
      <div className="flex transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ transform: `translateX(-${i * 100}%)` }}>
        {BANNERS.map((b, k) => (
          <div key={k} className="relative flex h-44 w-full shrink-0 items-center justify-between overflow-hidden px-6 sm:h-56 sm:px-12" style={{ background: b.bg }} aria-hidden={k !== i}>
            <div className="relative z-10 max-w-md text-[#fff]">
              <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl">{b.t}</h2>
              <p className="mt-1 text-sm opacity-90 sm:text-base">{b.s}</p>
              <Link to="/c/$slug" params={{ slug: b.cta }} tabIndex={k === i ? 0 : -1} className="press mt-4 inline-block rounded-full bg-[#fff] px-5 py-2 text-sm font-bold text-[#1C1C1C]">Shop now</Link>
            </div>
            <div className="text-6xl sm:text-8xl" style={{ transform: `translateY(${y * 0.15}px)` }}>{b.e}</div>
            <div className="absolute -right-10 -top-10 size-56 rounded-full bg-[#fff]/10" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {BANNERS.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full bg-[#fff] transition-all ${k === i ? "w-6" : "w-1.5 opacity-60"}`} />)}
      </div>
    </section>
  );
}

const TILES = [
  { t: "Pharmacy", s: "Medicines at your door", e: "💊", c: "#E7F5FF", slug: "personal-care" },
  { t: "Pet Care", s: "Food, toys & more", e: "🐶", c: "#FFF4E6", slug: "cleaning" },
  { t: "Baby Care", s: "Diapers & essentials", e: "👶", c: "#FFF0F6", slug: "baby-care" },
  { t: "Cafe", s: "Hot coffee in 10 mins", e: "☕", c: "#F3F0FF", slug: "beverages" },
];

export function QuickTiles() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TILES.map((t) => (
        <Link key={t.t} to="/c/$slug" params={{ slug: t.slug }} className="hover-wiggle card-lift flex items-center gap-3 rounded-2xl border p-3 text-[#1C1C1C]" style={{ background: t.c }}>
          <span className="wiggle-target text-3xl">{t.e}</span>
          <span><span className="block text-sm font-extrabold">{t.t}</span><span className="block text-xs opacity-70">{t.s}</span></span>
        </Link>
      ))}
    </div>
  );
}
