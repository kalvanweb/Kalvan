"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { categories, colorOptions, sizeOptions, fetchProducts, Product } from "@/lib/products";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export default function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("featured");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Couldn't load products. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(list: string[], value: string, setList: (v: string[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (activeColors.length && !p.colors.some((c) => activeColors.includes(c))) return false;
      if (activeSizes.length && !p.sizes.some((s) => activeSizes.includes(s))) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return result;
  }, [products, activeCategory, activeColors, activeSizes, sort, query]);

  function setCategory(cat: string) {
    setActiveCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat) params.set("category", cat);
    else params.delete("category");
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-eyebrow">Full collection</p>
          <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">
            {activeCategory || "Shop All"}
          </h1>
        </div>
        <p className="text-sm text-charcoal/50">{loading ? "Loading…" : `${filtered.length} products`}</p>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Filters */}
        <aside className="lg:w-64 lg:shrink-0">
          <button
            className="btn-secondary mb-4 w-full lg:hidden"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
          >
            {filtersOpen ? "Hide filters" : "Show filters"}
          </button>
          <div className={`${filtersOpen ? "block" : "hidden"} space-y-8 lg:block`}>
            <div>
              <label htmlFor="search" className="label-eyebrow">
                Search
              </label>
              <input
                id="search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="focus-ring mt-2 w-full border border-charcoal/20 bg-transparent px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <h3 className="label-eyebrow">Category</h3>
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setCategory("")}
                  className={`block text-sm ${!activeCategory ? "text-charcoal font-medium" : "text-charcoal/60"}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`block text-sm ${activeCategory === cat ? "text-charcoal font-medium" : "text-charcoal/60"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="label-eyebrow">Color</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggle(activeColors, color, setActiveColors)}
                    className={`border px-3 py-1.5 text-xs ${
                      activeColors.includes(color)
                        ? "border-charcoal bg-charcoal text-ivory"
                        : "border-charcoal/20 text-charcoal/70"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="label-eyebrow">Size</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggle(activeSizes, size, setActiveSizes)}
                    className={`h-9 w-9 border text-xs ${
                      activeSizes.includes(size)
                        ? "border-charcoal bg-charcoal text-ivory"
                        : "border-charcoal/20 text-charcoal/70"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-end">
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="focus-ring border border-charcoal/20 bg-transparent px-3 py-2 text-sm"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {loadError ? (
            <div className="border border-dashed border-rust/40 py-20 text-center">
              <p className="text-sm text-rust">{loadError}</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-stone-light/30" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-dashed border-charcoal/20 py-20 text-center">
              <p className="text-sm text-charcoal/60">
                No products match those filters. Try clearing a filter or search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
