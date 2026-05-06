"use client";

import type { Product } from "@/types";
import { KitCard } from "@/components/shop/KitCard";
import { Icons } from "@/components/ui/Icons";
import { useStore } from "@/hooks/useStore";

interface SavedViewProps {
  allProducts: Product[];
  onGoHome: () => void;
  onOpenProduct: (p: Product) => void;
  onGoCart: () => void;
}

export function SavedView({ allProducts, onGoHome, onOpenProduct, onGoCart }: SavedViewProps) {
  const { wishlist, cartCount } = useStore();
  const cartNum = cartCount();
  const savedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <div style={{
        padding: "54px 16px 14px",
        borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,250,248,0.97)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="font-serif" style={{ fontSize: 26, letterSpacing: "-0.01em" }}>Saved Kits</h2>
          <button onClick={onGoCart} style={{ position: "relative", padding: 8, color: "var(--text-mid)" }}>
            {Icons.cart}
            {cartNum > 0 && (
              <span style={{
                position: "absolute", top: 3, right: 3,
                width: 14, height: 14, background: "var(--accent)", color: "#fff",
                borderRadius: "50%", fontSize: 8, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid var(--bg)",
              }}>
                {cartNum}
              </span>
            )}
          </button>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        {savedProducts.length === 0 ? (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <div style={{ color: "var(--text-dim)", marginBottom: 16, display: "flex", justifyContent: "center" }}>
              {Icons.heart}
            </div>
            <h3 className="font-serif" style={{ fontSize: 24, color: "var(--text-mid)", marginBottom: 8 }}>
              Nothing saved yet
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 }}>
              Tap the heart icon on any kit to save it here
            </p>
            <button className="btn-outline" style={{ maxWidth: 180, margin: "0 auto" }} onClick={onGoHome}>
              Browse Kits
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 12 }}>
              {savedProducts.length} saved
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }}>
              {savedProducts.map((p) => (
                <KitCard key={p.id} product={p} onOpen={onOpenProduct} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
