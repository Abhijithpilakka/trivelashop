"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type { Product } from "@/types";
import { HomeView } from "@/components/shop/HomeView";
import { ProductView } from "@/components/shop/ProductView";
import { CartView } from "@/components/shop/CartView";
import { SavedView } from "@/components/shop/SavedView";
import { AboutView } from "@/components/shop/AboutView";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sheet } from "@/components/ui/Sheet";
import { CATEGORIES, SORT_OPTIONS } from "@/config";
import { displayPrice } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";

type ViewName = "home" | "product" | "cart" | "saved" | "about";
type SortValue = "featured" | "price_asc" | "price_desc";

interface AppShellProps {
  initialProducts: Product[];
}

export function AppShell({ initialProducts }: AppShellProps) {
  const [view, setView] = useState<ViewName>("home");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortValue>("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigate = useCallback((v: ViewName, p: Product | null = null) => {
    setActiveProduct(p);
    setView(v);
    window.scrollTo(0, 0);
  }, []);

  const openProduct = useCallback((p: Product) => navigate("product", p), [navigate]);
  const focusSearch = useCallback(() => {
    setView("home");
    setTimeout(() => searchInputRef.current?.focus(), 80);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => `${p.name} ${p.club}`.toLowerCase().includes(q));
    }
    if (sort === "price_asc")  list.sort((a, b) => displayPrice(a) - displayPrice(b));
    if (sort === "price_desc") list.sort((a, b) => displayPrice(b) - displayPrice(a));
    return list;
  }, [initialProducts, category, searchQuery, sort]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 86 }}>
      {view === "home" && (
        <HomeView
          products={filteredProducts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          sort={sort}
          onOpenFilters={() => setFilterOpen(true)}
          onOpenSort={() => setSortOpen(true)}
          onOpenProduct={openProduct}
          onGoCart={() => navigate("cart")}
          searchInputRef={searchInputRef}
        />
      )}
      {view === "product" && activeProduct && (
        <ProductView product={activeProduct} onBack={() => navigate("home")} onGoCart={() => navigate("cart")} />
      )}
      {view === "cart" && (
        <CartView onGoHome={() => navigate("home")} onOpenProduct={(p) => navigate("product", p)} />
      )}
      {view === "saved" && (
        <SavedView allProducts={initialProducts} onGoHome={() => navigate("home")} onOpenProduct={openProduct} onGoCart={() => navigate("cart")} />
      )}
      {view === "about" && <AboutView onGoCart={() => navigate("cart")} />}

      <BottomNav view={view} onNavigate={navigate} onSearchFocus={focusSearch} />

      {/* Filter sheet */}
      {filterOpen && (
        <Sheet onClose={() => setFilterOpen(false)}>
          <div style={{ padding: "0 20px" }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 14, fontFamily: "'DM Serif Display', serif" }}>
              Category
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button key={c} className={`chip${category === c ? " active" : ""}`}
                  onClick={() => { setCategory(c); setFilterOpen(false); }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Sheet>
      )}

      {/* Sort sheet */}
      {sortOpen && (
        <Sheet onClose={() => setSortOpen(false)}>
          <div style={{ paddingBottom: 4 }}>
            <p style={{
              fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8,
              padding: "0 20px", fontFamily: "'DM Serif Display', serif",
            }}>
              Sort By
            </p>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => { setSort(s.value as SortValue); setSortOpen(false); }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  width: "100%", padding: "14px 20px",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 15, fontWeight: s.value === sort ? 600 : 400,
                  color: s.value === sort ? "var(--accent)" : "var(--text-mid)",
                  background: s.value === sort ? "var(--accent-dim)" : "transparent",
                }}
              >
                {s.label}
                {s.value === sort && <span style={{ color: "var(--accent)" }}>{Icons.check}</span>}
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  );
}
