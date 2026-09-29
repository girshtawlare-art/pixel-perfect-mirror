// All data access goes through here. Swap these mock bodies for real fetch() calls later.
import { products, type Product, type Diet } from "@/data/products";
import { categories } from "@/data/categories";
import { sleep } from "@/utils/format";

export type SortKey = "relevance" | "price-asc" | "price-desc" | "discount";
export type Query = { q?: string | undefined; category?: string | undefined; sub?: string | undefined; sort?: SortKey; diets?: Diet[]; brands?: string[]; maxPrice?: number };

export const api = {
  async categories() { await sleep(250); return categories; },

  async byIds(ids: string[]) { await sleep(300); return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[]; },

  // TODO(real API): GET /products?category=&q=&sort=...
  async list(query: Query = {}): Promise<Product[]> {
    await sleep(350);
    return filterProducts(query);
  },

  async section(key: "trending" | "fruits" | "dairy" | "snacks") {
    await sleep(400 + Math.random() * 300);
    if (key === "trending") return [...products].sort((a, b) => b.mrp - b.price - (a.mrp - a.price)).slice(0, 14);
    const map = { fruits: "fruits-vegetables", dairy: "dairy-eggs", snacks: "snacks" } as const;
    const cat = map[key];
    return products.filter((p) => p.category === cat || (key === "dairy" && p.sub === "Bread"));
  },

  // TODO(real API): search suggestions endpoint
  suggest(q: string) {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return products.filter((p) => `${p.name} ${p.brand} ${p.sub}`.toLowerCase().includes(t)).slice(0, 6);
  },

  similar(p: Product) { return products.filter((x) => x.sub === p.sub && x.id !== p.id).concat(products.filter((x) => x.category === p.category && x.sub !== p.sub)).slice(0, 8); },
};

export function filterProducts({ q, category, sub, sort = "relevance", diets = [], brands = [], maxPrice }: Query) {
  let r = products;
  if (category) r = r.filter((p) => p.category === category);
  if (sub) r = r.filter((p) => p.sub === sub);
  if (q) { const t = q.toLowerCase(); r = r.filter((p) => `${p.name} ${p.brand} ${p.sub} ${p.category}`.toLowerCase().includes(t)); }
  if (diets.length) r = r.filter((p) => diets.every((d) => p.diets.includes(d)));
  if (brands.length) r = r.filter((p) => brands.includes(p.brand));
  if (maxPrice) r = r.filter((p) => p.price <= maxPrice);
  const s = [...r];
  if (sort === "price-asc") s.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") s.sort((a, b) => b.price - a.price);
  if (sort === "discount") s.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
  return s;
}
