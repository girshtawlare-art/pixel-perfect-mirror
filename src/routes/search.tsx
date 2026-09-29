import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Results } from "@/components/fg/Results";

export const Route = createFileRoute("/search")({
  validateSearch: (s) => z.object({ q: z.string().catch("") }).parse(s),
  head: () => ({
    meta: [
      { title: "Search groceries — FreshGenie" },
      { name: "description", content: "Search thousands of grocery essentials with instant delivery." },
      { property: "og:title", content: "Search — FreshGenie" },
      { property: "og:description", content: "Find groceries fast and get them in minutes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  return <Results key={q} q={q} />;
}
