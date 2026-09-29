export const rs = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const discountPct = (price: number, mrp: number) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

export function debounce<A extends unknown[]>(fn: (...a: A) => void, ms = 250) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...a: A) => { if (t) clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
