"use client";

import type { Product } from "@/types";
import { KitCard } from "@/components/shop/KitCard";
import { Icons } from "@/components/ui/Icons";
import { useStore } from "@/hooks/useStore";
import { CATEGORIES, SORT_OPTIONS, STORE_NAME } from "@/config";

type SortValue = "featured" | "price_asc" | "price_desc";

interface HomeViewProps {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  sort: SortValue;
  onOpenFilters: () => void;
  onOpenSort: () => void;
  onOpenProduct: (p: Product) => void;
  onGoCart: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export function HomeView({
  products, searchQuery, setSearchQuery,
  category, setCategory, sort,
  onOpenFilters, onOpenSort, onOpenProduct, onGoCart, searchInputRef,
}: HomeViewProps) {
  const { cartCount } = useStore();
  const cartNum = cartCount();

  return (
    <div>
      {/* Sticky header */}
      <div style={{
        padding: "30px 16px 0",
        background: "rgba(250,250,248,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid var(--border)",
      }}>
        {/* Wordmark row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: 32, lineHeight: 1, color: "var(--text)", letterSpacing: "-0.01em" }}>
              Trivela
            </h1>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>
              Premium Football Jerseys
            </p>
          </div>
          <button
            onClick={onGoCart}
            style={{ position: "relative", padding: 8, color: "var(--text-mid)" }}
            aria-label="Cart"
          >
            {Icons.cart}
            {cartNum > 0 && (
              <span style={{
                position: "absolute", top: 3, right: 3,
                width: 14, height: 14,
                background: "var(--accent)", color: "#fff",
                borderRadius: "50%", fontSize: 8, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid var(--bg)",
              }}>
                {cartNum}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }}>
            {Icons.search}
          </span>
          <input
            ref={searchInputRef}
            style={{
              width: "100%", height: 42,
              background: "var(--surface2)",
              border: "1.5px solid transparent",
              borderRadius: 12, padding: "0 14px 0 40px",
              outline: "none", color: "var(--text)", fontSize: 14, fontWeight: 400,
              transition: "border-color .15s, background .15s",
            }}
            placeholder="Search kits, clubs, nations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "var(--surface)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "transparent"; e.target.style.background = "var(--surface2)"; }}
          />
        </div>

        {/* Category chips + controls */}
        <div className="no-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
          {CATEGORIES.map((c) => (
            <button key={c} className={`chip${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, paddingRight: 2, flexShrink: 0 }}>
            <button
              onClick={onOpenSort}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                height: 32, padding: "0 14px",
                border: "1px solid var(--border2)", borderRadius: 100,
                fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
                background: "var(--surface)",
              }}
            >
              {Icons.filter} Sort
            </button>
          </div>
        </div>
      </div>

      {/* Hero — only on default state */}
      {!searchQuery && category === "All" && (
        <div style={{
          margin: "14px 14px 4px",
          position: "relative", height: 200,
          borderRadius: 16, overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        }}>
          <img
            src="https://res.cloudinary.com/dt9y9hxud/image/upload/v1779213435/Picsart_26-05-19_23-26-24-914_lt9z1x.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "brightness(0.38) saturate(0.7)" }}
          />
          <div style={{
            position: "absolute", inset: 0, padding: "0 20px 20px",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)", marginBottom: 6,
            }}>
              2026 Season
            </span>
            <h2 className="font-serif" style={{ fontSize: 40, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              New Season<br /><span style={{ fontStyle: "italic" }}>Drops</span>
            </h2>
          </div>
        </div>
      )}

      {/* Product grid */}
      <div style={{ padding: "14px 14px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
            {products.length} kit{products.length !== 1 ? "s" : ""}
          </p>
          {sort !== "featured" && (
            <span style={{
              fontSize: 11, color: "var(--accent)", fontWeight: 600,
              border: "1px solid var(--accent-border)", padding: "2px 10px", borderRadius: 100,
              background: "var(--accent-dim)",
            }}>
              {SORT_OPTIONS.find((s) => s.value === sort)?.label}
            </span>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }}>
          {products.map((p) => (
            <KitCard key={p.id} product={p} onOpen={onOpenProduct} />
          ))}
        </div>

        {products.length === 0 && (
          <div style={{ padding: "72px 0", textAlign: "center" }}>
            <p className="font-serif" style={{ fontSize: 26, color: "var(--text-muted)", marginBottom: 6 }}>No kits found</p>
            <p style={{ color: "var(--text-dim)", fontSize: 13 }}>Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
