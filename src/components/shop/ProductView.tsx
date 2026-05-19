"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import type { SizeKey } from "@/types";
import { displayPrice, isSoldOut, discountPct, buildProductInquiryUrl } from "@/lib/utils";
import { useStore } from "@/hooks/useStore";
import { Icons } from "@/components/ui/Icons";
import { ShippingEstimator } from "@/components/shop/ShippingEstimator";
import { FREE_SHIP_MIN } from "@/config";

interface ProductViewProps {
  product: Product;
  onBack: () => void;
  onGoCart: () => void;
}

export function ProductView({ product: p, onBack, onGoCart }: ProductViewProps) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeKey | null>(null);
  const [selectedVer, setSelectedVer] = useState(p.versions[0]);
  const [addedOk, setAddedOk] = useState(false);

  const { addToCart, toggleWishlist, isWishlisted, cartCount } = useStore();
  const cartNum = cartCount();

  const soldOut = isSoldOut(p);
  const price = displayPrice(p);
  const pct = discountPct(p);
  const stockQty = selectedSize ? p.sizes[selectedSize] : null;
  const wishlisted = isWishlisted(p.id);

  const handleAdd = () => {
    if (!selectedSize) return;
    addToCart({ pid: p.id, product: p, size: selectedSize, ver: selectedVer });
    setAddedOk(true);
    setTimeout(() => setAddedOk(false), 1800);
  };

  function optimizeCloudinary(url: string, width = 800) {
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,c_limit,w_${width},dpr_auto/`
  );
}

  const handleWA = () => window.open(buildProductInquiryUrl(p, selectedVer, selectedSize), "_blank");

  return (
    <div>
      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,250,248,0.97)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        padding: "30px 16px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
      }}>
        <button
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-mid)", padding: "4px 0" }}
        >
          {Icons.back}
          <span style={{ fontSize: 14, fontWeight: 500 }}>Back</span>
        </button>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => toggleWishlist(p.id)}
            style={{ padding: 8, color: wishlisted ? "var(--red)" : "var(--text-muted)" }}
          >
            {wishlisted ? Icons.heartFilled : Icons.heart}
          </button>
          <button onClick={onGoCart} style={{ position: "relative", padding: 8, color: "var(--text-mid)" }}>
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
      </div>

      {/* Photos */}
      <div style={{ background: "var(--surface2)" }}>
        <div style={{ height: 360, overflow: "hidden", position: "relative" }}>
          <Image
            src={optimizeCloudinary(p.photos[photoIdx], 1000)}
            alt={p.name}
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center top" }}
            sizes="100vw"
          />
        </div>
        {/* Thumbnails */}
        <div className="no-scrollbar" style={{
          display: "flex", gap: 8, padding: "10px 14px",
          background: "var(--surface)", borderBottom: "1px solid var(--border)",
          overflowX: "auto",
        }}>
          {p.photos.map((ph, i) => (
            <button key={i} onClick={() => setPhotoIdx(i)} style={{
              width: 56, height: 56, flexShrink: 0, overflow: "hidden",
              border: `2px solid ${i === photoIdx ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 10, padding: 0, position: "relative", transition: "border-color .15s",
            }}>
              <Image
                src={optimizeCloudinary(ph, 200)}
                alt=""
                fill
                style={{ objectFit: "cover" }}
                sizes="56px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "20px 16px 130px" }}>

        {/* Title block */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
            <span className="badge badge-outline">{p.category}</span>
            <span className="badge badge-outline">{p.logo}</span>
            {p.tag === "bestseller" && <span className="badge badge-accent">★ Bestseller</span>}
            {soldOut && <span className="badge badge-red">Sold Out</span>}
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            {p.club}
          </p>
          <h2 className="font-serif" style={{ fontSize: 30, lineHeight: 1.1, color: "var(--text)", letterSpacing: "-0.01em" }}>
            {p.name}
          </h2>
        </div>

        {/* Price block — prominent, readable */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          padding: "16px", marginBottom: 24,
          background: "var(--price-bg)", borderRadius: 12,
          border: "1px solid rgba(15,123,60,0.12)",
        }}>
          <span className="price-tag-lg">₹{price}</span>
          {p.offerPrice && (
            <>
              <span className="price-mrp" style={{ fontSize: 15 }}>₹{p.price}</span>
              <span style={{
                marginLeft: "auto",
                background: "var(--price)", color: "#fff",
                fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8,
              }}>
                Save ₹{p.price - p.offerPrice}
              </span>
            </>
          )}
        </div>

        {/* Version */}
        <div style={{ marginBottom: 22 }}>
          <span className="section-label">Version</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {p.versions.map((v) => (
              <button key={v} className={`chip${selectedVer === v ? " active" : ""}`} onClick={() => setSelectedVer(v)}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span className="section-label" style={{ marginBottom: 0 }}>Size</span>
            {stockQty !== null && stockQty > 0 && (
              <p style={{ fontSize: 12, color: stockQty <= 3 ? "var(--red)" : "var(--grn)", fontWeight: 600 }}>
                {stockQty <= 3 ? `Only ${stockQty} left` : `${stockQty} in stock`}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(Object.entries(p.sizes) as [SizeKey, number][]).map(([sz, qty]) => (
              <button
                key={sz}
                className={`size-btn${selectedSize === sz ? " active" : ""}${qty === 0 ? " oos" : ""}`}
                onClick={() => qty > 0 && setSelectedSize(sz)}
                disabled={qty === 0}
              >
                {sz}
              </button>
            ))}
          </div>
          {!selectedSize && !soldOut && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
              Select a size to add to cart
            </p>
          )}
        </div>

        {/* Description */}
        <div style={{
          marginBottom: 20, padding: "16px",
          background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)",
        }}>
          <span className="section-label">About this kit</span>
          <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7 }}>
            {p.description}
          </p>
        </div>

        {/* Shipping estimator */}
        <div style={{
          marginBottom: 24, padding: "16px",
          background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)",
        }}>
          <ShippingEstimator subtotal={price >= FREE_SHIP_MIN ? price : 0} />
        </div>

        {/* CTAs */}
        {!soldOut ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn-primary" onClick={handleAdd} disabled={!selectedSize}>
              {addedOk ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {Icons.check} Added to Cart
                </span>
              ) : "Add to Cart"}
            </button>
            <button className="btn-wa" onClick={handleWA}>
              {Icons.whatsapp} Buy via WhatsApp
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{
              height: 52, display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid var(--border2)", borderRadius: 12,
              fontSize: 14, color: "var(--text-muted)", fontWeight: 500,
            }}>
              Out of Stock
            </div>
            <button className="btn-wa" onClick={handleWA}>
              {Icons.whatsapp} Enquire on WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
