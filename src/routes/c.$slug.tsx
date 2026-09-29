import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategory } from "@/data/categories";
import { Results } from "@/components/fg/Results";
import { EmptyState } from "@/components/fg/primitives";

export const Route = createFileRoute("/c/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Category not found — FreshGenie" }, { name: "robots", content: "noindex" }] };
    const n = loaderData.category.name;
    return {
      meta: [
        { title: `${n} — delivered in minutes | FreshGenie` },
        { name: "description", content: `Shop ${n} online with 10-minute delivery on FreshGenie.` },
        { property: "og:title", content: `${n} | FreshGenie` },
        { property: "og:description", content: `Shop ${n} online with 10-minute delivery.` },
      ],
    };
  },
  notFoundComponent: CategoryMissing,
  component: CategoryPage,
});

function CategoryMissing() {
  return <EmptyState emoji="🧺" title="Category not found" text="That aisle doesn't exist." />;
}

function CategoryPage() {
  const { category } = Route.useLoaderData();
  return <Results key={category.slug} category={category} />;
}
