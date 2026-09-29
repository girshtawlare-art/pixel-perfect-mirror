// Mock AI layer. Each function is where a real model call (via a server function) will plug in later.
import { findByName, products, productById, type Product } from "@/data/products";
import { sleep } from "@/utils/format";

export type BasketItem = { product: Product; qty: number; note: string };

const RECIPES: Record<string, [string, number, string][]> = {
  "paneer butter masala": [["Paneer", 2, "200g per 2 people"], ["Butter", 1, "for the makhani base"], ["Tomato", 2, "about 1 kg for gravy"], ["Onion", 1, ""], ["Fresh Cream", 1, "for richness"], ["Kashmiri", 1, "colour & mild heat"], ["Garam Masala", 1, ""], ["Kasuri Methi", 1, "finishing aroma"], ["Ginger Garlic", 1, ""]],
  "pasta night": [["Penne", 1, "500g serves 4"], ["Pasta Sauce", 1, ""], ["Cheese Slices", 1, "melt on top"], ["Olive Oil", 1, ""], ["Broccoli", 1, "add greens"], ["Garlic", 1, ""]],
  biryani: [["Basmati", 2, "1 kg per 4 people"], ["Onion", 1, "for birista"], ["Curd", 1, "marinade"], ["Garam Masala", 1, ""], ["Desi Ghee", 1, ""], ["Coriander", 2, ""], ["Green Chilli", 1, ""], ["Ginger Garlic", 1, ""]],
  "healthy breakfast": [["Oats", 1, ""], ["Greek Yogurt", 2, "protein boost"], ["Banana", 1, ""], ["Almonds", 1, "topping"], ["Eggs", 1, ""], ["Green Tea", 1, ""]],
  "party snacks": [["Salted Chips", 4, ""], ["Masala Munch", 3, ""], ["Bhujia", 2, ""], ["Popcorn", 2, ""], ["Cola", 6, "one per guest"], ["Garbage Bags", 1, "easy cleanup"]],
};

function resolve(rows: [string, number, string][], scale = 1): BasketItem[] {
  return rows
    .map(([q, qty, note]) => ({ product: findByName(q)!, qty: Math.max(1, Math.round(qty * scale)), note }))
    .filter((x) => x.product);
}

/** TODO(real AI): replace with an LLM call that returns structured basket JSON. */
export async function generateBasket(prompt: string): Promise<{ title: string; items: BasketItem[] }> {
  await sleep(1200);
  const t = prompt.toLowerCase();
  const people = Number(t.match(/(\d+)\s*(people|persons|guests|pax)/)?.[1] ?? 2);
  const scale = people / 2;
  const key = Object.keys(RECIPES).find((k) => t.includes(k) || k.split(" ").some((w) => w.length > 4 && t.includes(w)));
  if (key) return { title: `${key.replace(/\b\w/g, (c) => c.toUpperCase())} for ${people}`, items: resolve(RECIPES[key] ?? [], scale) };
  const hits = products.filter((p) => t.split(/\W+/).some((w) => w.length > 2 && p.name.toLowerCase().includes(w))).slice(0, 6);
  if (hits.length) return { title: "Here's what I found", items: hits.map((product) => ({ product, qty: 1, note: "" })) };
  return { title: "A quick everyday basket", items: resolve([["Toned Milk", 2, ""], ["Brown Bread", 1, ""], ["Eggs", 1, ""], ["Banana", 1, ""], ["Tomato", 1, ""], ["Onion", 1, ""]]) };
}

export const recipeBasket = (name: string) => resolve(RECIPES[name.toLowerCase()] ?? []);

const PAIRS: [string, string[]][] = [
  ["Bread", ["Salted Butter", "Farm Eggs"]], ["Milk", ["Brown Bread", "Instant Coffee"]], ["Pasta", ["Pasta Sauce", "Cheese Slices"]],
  ["Chips", ["Cola Can", "Bhujia"]], ["Rice", ["Toor Dal", "Desi Ghee"]], ["Paneer", ["Kasuri Methi", "Fresh Cream"]], ["Tea", ["Digestive", "Toned Milk"]],
  ["Diapers", ["Baby Wipes"]], ["Eggs", ["Brown Bread"]],
];

/** TODO(real AI): recommendation model for complementary items. */
export function forgotten(cartIds: string[]): Product[] {
  const inCart = cartIds.map((id) => productById(id)!).filter(Boolean);
  const out = new Map<string, Product>();
  inCart.forEach((p) => PAIRS.forEach(([k, v]) => { if (p.name.includes(k)) v.forEach((n) => { const x = findByName(n); if (x && !cartIds.includes(x.id)) out.set(x.id, x); }); }));
  if (out.size < 4) ["Coriander", "Lemon", "Green Chilli", "Toned Milk"].forEach((n) => { const x = findByName(n); if (x && !cartIds.includes(x.id)) out.set(x.id, x); });
  return [...out.values()].slice(0, 8);
}

/** TODO(real AI): generated product rationale. */
export function whyRecommend(p: Product) {
  const bits = [];
  if (p.diets.includes("high-protein")) bits.push("packs a solid protein punch");
  if (p.diets.includes("vegan")) bits.push("is 100% plant-based");
  if (p.mrp > p.price) bits.push(`is ${Math.round(((p.mrp - p.price) / p.mrp) * 100)}% cheaper than MRP today`);
  bits.push(`is reordered often by shoppers near you`);
  return `${p.brand} ${p.name} ${bits.join(", ")}. Rated ${p.rating.toFixed(1)}★ and arrives in about ${p.eta} minutes.`;
}

/** TODO(real AI): streaming chat completion. */
export async function chatReply(msg: string): Promise<{ text: string; items?: BasketItem[] }> {
  const t = msg.toLowerCase();
  if (/track|order|where/.test(t)) { await sleep(900); return { text: "Your latest order is on its way — open 'Track order' from the menu to see the rider live. 🛵" }; }
  if (/offer|coupon|discount/.test(t)) { await sleep(900); return { text: "Use code FIRST50 for ₹50 off, and delivery is free above ₹199. Fruits are flat 20% off today! 🍎" }; }
  if (/healthy|protein|diet|vegan|keto/.test(t)) {
    const items = products.filter((p) => p.diets.includes("high-protein")).slice(0, 4).map((product) => ({ product, qty: 1, note: "" }));
    await sleep(1000); return { text: "Here are some high-protein picks I'd recommend:", items };
  }
  const b = await generateBasket(msg);
  return { text: `${b.title} — I've put together ${b.items.length} items:`, items: b.items };
}
