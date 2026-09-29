import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";
import { Reveal } from "./primitives";

export function CategoryGrid() {
  return (
    <section className="py-6" aria-labelledby="cat-title">
      <h2 id="cat-title" className="mb-3 text-lg font-extrabold tracking-tight sm:text-xl">Shop by category</h2>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-10">
        {categories.map((c, i) => {
          const [a, b] = c.tint.split(",");
          return (
            <Reveal key={c.slug} delay={i * 50}>
              <Link to="/c/$slug" params={{ slug: c.slug }} className="group block text-center">
                <div className="grid aspect-square place-items-center rounded-2xl text-4xl transition-transform duration-300 group-hover:scale-105 sm:text-5xl" style={{ background: `linear-gradient(145deg, ${a}, ${b})` }}>{c.emoji}</div>
                <span className="mt-1.5 block text-[11px] font-semibold leading-tight sm:text-xs">{c.name}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
