import { useSyncExternalStore } from "react";
import { productById } from "@/data/products";

export type Address = { id: string; label: string; line: string };
export type State = {
  cart: Record<string, number>;
  address: Address;
  savedAddresses: Address[];
  recentSearches: string[];
  pastOrders: string[]; // product ids, for "Buy it again"
  dark: boolean;
  coupon: string | null;
  lastOrder: { id: string; placedAt: number; items: Record<string, number>; total: number } | null;
  ui: { cartOpen: boolean; quickView: string | null; addressOpen: boolean; chatOpen: boolean; cartBump: number };
};

const defaultAddresses: Address[] = [
  { id: "home", label: "Home", line: "Flat 402, Palm Residency, HSR Layout, Bengaluru" },
  { id: "work", label: "Work", line: "WeWork Galaxy, Residency Rd, Bengaluru" },
];

const initial: State = {
  cart: {},
  address: defaultAddresses[0],
  savedAddresses: defaultAddresses,
  recentSearches: [],
  pastOrders: ["amul-toned-milk", "harvest-gold-brown-bread", "farmfresh-banana-robusta", "eggs", "amul-malai-paneer", "tata-tea-assam-tea", "lay-s-classic-salted-chips", "freshfarm-onion"],
  dark: false,
  coupon: null,
  lastOrder: null,
  ui: { cartOpen: false, quickView: null, addressOpen: false, chatOpen: false, cartBump: 0 },
};

let state = initial;
const subs = new Set<() => void>();
const KEY = "freshgenie:v1";
const PERSIST: (keyof State)[] = ["cart", "address", "savedAddresses", "recentSearches", "dark", "coupon", "lastOrder"];

function persist() {
  try {
    const out: Partial<State> = {};
    PERSIST.forEach((k) => ((out as Record<string, unknown>)[k] = state[k]));
    localStorage.setItem(KEY, JSON.stringify(out));
  } catch { /* ignore */ }
}

export const store = {
  get: () => state,
  subscribe(fn: () => void) { subs.add(fn); return () => subs.delete(fn); },
  set(patch: Partial<State> | ((s: State) => Partial<State>)) {
    const p = typeof patch === "function" ? patch(state) : patch;
    state = { ...state, ...p };
    persist();
    subs.forEach((f) => f());
  },
  ui(patch: Partial<State["ui"]>) { store.set((s) => ({ ui: { ...s.ui, ...patch } })); },
  hydrate() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = { ...state, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    subs.forEach((f) => f());
  },
  setQty(id: string, qty: number) {
    store.set((s) => {
      const cart = { ...s.cart };
      if (qty <= 0) delete cart[id]; else cart[id] = qty;
      const bump = qty > (s.cart[id] ?? 0) ? s.ui.cartBump + 1 : s.ui.cartBump;
      return { cart, ui: { ...s.ui, cartBump: bump } };
    });
  },
  add(id: string, n = 1) { store.setQty(id, (state.cart[id] ?? 0) + n); },
  addSearch(q: string) {
    const t = q.trim(); if (!t) return;
    store.set((s) => ({ recentSearches: [t, ...s.recentSearches.filter((x) => x !== t)].slice(0, 6) }));
  },
};

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(store.subscribe, () => sel(state), () => sel(initial));
}

// Pricing rules
export const FREE_DELIVERY_AT = 199;
export function cartSummary(s: State) {
  const lines = Object.entries(s.cart)
    .map(([id, qty]) => ({ p: productById(id)!, qty }))
    .filter((l) => l.p);
  const items = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
  const mrp = lines.reduce((a, l) => a + l.p.mrp * l.qty, 0);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const delivery = items === 0 || items >= FREE_DELIVERY_AT ? 0 : 30;
  const handling = items ? 4 : 0;
  const smallCart = items && items < 99 ? 20 : 0;
  const couponOff = s.coupon === "FIRST50" ? Math.min(50, items) : 0;
  const total = Math.max(0, items + delivery + handling + smallCart - couponOff);
  return { lines, items, mrp, count, delivery, handling, smallCart, couponOff, total, saved: mrp - items + couponOff };
}
