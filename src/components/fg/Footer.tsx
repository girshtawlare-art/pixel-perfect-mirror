import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";

export function Footer() {
  return (
    <footer className="mt-12 border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1fr_2fr_1fr]">
        <div>
          <div className="text-xl font-extrabold"><span className="text-brand">fresh</span>genie 🧞</div>
          <p className="mt-2 text-sm text-muted-foreground">Groceries in minutes, planned by AI.</p>
          <div className="mt-4 flex gap-2" aria-label="Social links">
            {["𝕏", "in", "f", "▶"].map((s) => <a key={s} href="#" aria-label={`Social ${s}`} className="grid size-9 place-items-center rounded-full bg-muted text-sm font-bold hover:bg-brand hover:text-brand-foreground">{s}</a>)}
          </div>
        </div>
        <nav aria-label="Categories">
          <h3 className="mb-3 text-sm font-extrabold">Categories</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            {categories.map((c) => <li key={c.slug}><Link to="/c/$slug" params={{ slug: c.slug }} className="hover:text-brand">{c.name}</Link></li>)}
          </ul>
        </nav>
        <div>
          <h3 className="mb-3 text-sm font-extrabold">Get the app</h3>
          <div className="flex flex-col gap-2">
            {["App Store", "Google Play"].map((s) => <a key={s} href="#" className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-background"><span className="text-xl">{s === "App Store" ? "" : "▶"}</span><span className="text-xs leading-tight">Download on<br /><b className="text-sm">{s}</b></span></a>)}
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-4"><span>🔒 Secure payments</span><span>✅ Quality checked</span><span>↩️ Easy returns</span><span>⚡ 10-min delivery</span></div>
          <span>© 2026 FreshGenie. Demo storefront.</span>
        </div>
      </div>
    </footer>
  );
}
