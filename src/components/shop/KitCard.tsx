"use client";

import Image from "next/image";
import type { Product } from "@/types";
import { displayPrice, isSoldOut, discountPct } from "@/lib/utils";
import { useStore } from "@/hooks/useStore";
import { Icons } from "@/components/ui/Icons";

interface KitCardProps {
  product: Product;
  onOpen: (p: Product) => void;
}

export function KitCard({ product: p, onOpen }: KitCardProps) {
  const { toggleWishlist, isWishlisted } = useStore();
  const soldOut = isSoldOut(p);
  const pct = discountPct(p);
  const saved = isWishlisted(p.id);

  return (
    <div
      onClick={() => onOpen(p)}
      style={{
        overflow: "hidden",
        animation: "fadeUp .26s ease both",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 188, background: "var(--surface2)" }}>
        <Image
          src={p.photos[0]}
          alt={p.name}
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center top",
            filter: soldOut ? "grayscale(0.5) brightness(0.85)" : "none",
          }}
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {/* Sold out overlay */}
        {soldOut && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(250,250,248,0.55)",
          }}>
            <span style={{
              background: "var(--surface)", color: "var(--text-muted)",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "5px 12px", borderRadius: 6, border: "1px solid var(--border2)",
            }}>
              Sold Out
            </span>
          </div>
        )}

        {/* Discount badge */}
        {pct > 0 && !soldOut && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            background: "var(--price)", color: "#fff",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
            padding: "3px 7px", borderRadius: 6,
          }}>
            -{pct}%
          </span>
        )}
        {p.tag === "new" && !soldOut && pct === 0 && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            background: "var(--accent)", color: "#fff",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
            padding: "3px 7px", borderRadius: 6,
          }}>
            New
          </span>
        )}
        {p.tag === "retro" && !soldOut && pct === 0 && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            background: "var(--surface)", color: "var(--text-mid)",
            fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
            padding: "3px 7px", borderRadius: 6, border: "1px solid var(--border2)",
          }}>
            Retro
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
          style={{
            position: "absolute", top: 7, right: 7,
            width: 30, height: 30, borderRadius: 8,
            background: "rgba(255,255,255,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            color: saved ? "var(--red)" : "var(--text-muted)",
          }}
          aria-label={saved ? "Remove from wishlist" : "Save"}
        >
          {saved ? Icons.heartFilled : Icons.heart}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 13px" }}>
        <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
          {p.club}
        </p>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.35, marginBottom: 8 }}>
          {p.name}
        </p>

        {/* Price row — clear hierarchy */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span className="price-tag-sm">₹{displayPrice(p)}</span>
          {p.offerPrice && (
            <span className="price-mrp">₹{p.price}</span>
          )}
        </div>
        <p style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 3, letterSpacing: "0.04em" }}>
          {p.logo}
        </p>
      </div>
    </div>
  );
}
