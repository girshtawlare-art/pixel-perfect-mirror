import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HeroCarousel, QuickTiles } from "@/components/fg/Hero";
import { AiStrip } from "@/components/fg/AiStrip";
import { CategoryGrid } from "@/components/fg/CategoryGrid";
import { ProductRow } from "@/components/fg/ProductCard";
import { Reveal } from "@/components/fg/primitives";
import { api } from "@/services/api";
import { useStore } from "@/store/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshGenie — Groceries in 10 minutes, planned by AI" },
      { name: "description", content: "Order fruits, dairy, snacks and more in minutes. Ask FreshGenie to build your basket from a recipe." },
      { property: "og:title", content: "FreshGenie — Groceries in 10 minutes" },
      { property: "og:description", content: "Order groceries in minutes and let AI build your basket from any recipe." },
    ],
  }),
  component: Home,
});

function Row({ k, title }: { k: "trending" | "fruits" | "dairy" | "snacks"; title: string }) {
  const q = useQuery({ queryKey: ["section", k], queryFn: () => api.section(k) });
  return <Reveal><ProductRow title={title} items={q.data} loading={q.isLoading} /></Reveal>;
}

function BuyAgain() {
  const ids = useStore((s) => s.pastOrders);
  const q = useQuery({ queryKey: ["buy-again", ids], queryFn: () => api.byIds(ids) });
  return <Reveal><ProductRow title="🔁 Buy it again" items={q.data} loading={q.isLoading} action={<span className="hidden rounded-full bg-highlight/40 px-2 py-0.5 text-[11px] font-bold sm:inline">Smart reorder</span>} /></Reveal>;
}

function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <HeroCarousel />
      <QuickTiles />
      <AiStrip />
      <CategoryGrid />
      <BuyAgain />
      <Row k="trending" title="🔥 Trending near you" />
      <Row k="fruits" title="Fresh Fruits & Vegetables" />
      <Row k="dairy" title="Dairy, Bread & Eggs" />
      <Row k="snacks" title="Snacks & Munchies" />
    </div>
  );
}
