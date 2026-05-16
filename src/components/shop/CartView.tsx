"use client";

import { useState } from "react";
import Image from "next/image";
import { useStore } from "@/hooks/useStore";
import { Icons } from "@/components/ui/Icons";
import { ShippingEstimator } from "@/components/shop/ShippingEstimator";
import { displayPrice, buildCheckoutUrl, hasFreeShipping } from "@/lib/utils";
import { validateCoupon, createOrder } from "@/lib/api";
import { COUPONS, DEFAULT_SHIP } from "@/config";
import type { ShippingEstimate } from "@/types";

interface CartViewProps {
  onGoHome: () => void;
  onOpenProduct: (p: any) => void;
}

interface AppliedCoupon {
  code: string;
  type: "pct" | "flat";
  value: number;
  discountAmount: number;
}
function optimizeCloudinary(url: string, width = 800) {
  if (!url.includes("res.cloudinary.com")) return url;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,c_limit,w_${width},dpr_auto/`
  );
}

export function CartView({ onGoHome, onOpenProduct }: CartViewProps) {
  const { cart, removeFromCart, changeQty, clearCart } = useStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [pin, setPin] = useState("");
  const [ship, setShip] = useState<ShippingEstimate | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const sub = cart.reduce((s, x) => s + displayPrice(x.product) * x.qty, 0);
  const disc = appliedCoupon?.discountAmount ?? 0;
  const isFreeShip = hasFreeShipping(sub);
  const shipCost = isFreeShip ? 0 : ship ? ship.cost : DEFAULT_SHIP;
  const total = sub - disc + shipCost;

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const result = await validateCoupon(code, sub);
      if (result) {
        setAppliedCoupon({ code: result.code, type: result.type, value: result.value, discountAmount: result.discount_amount });
        return;
      }
    } catch (err: any) {
      setCouponError(err.message ?? "Invalid promo code");
      setAppliedCoupon(null);
      setCouponLoading(false);
      return;
    } finally {
      setCouponLoading(false);
    }
    const c = COUPONS[code];
    if (c) {
      const amount = c.type === "pct" ? Math.round(sub * c.value / 100) : c.value;
      setAppliedCoupon({ code, type: c.type, value: c.value, discountAmount: amount });
    } else {
      setCouponError("Invalid promo code");
      setAppliedCoupon(null);
    }
  };

  const checkout = async () => {
    setCheckingOut(true);
    try {
      const order = await createOrder({
        items: cart.map((x) => ({ product_id: x.pid, size: x.size, version: x.ver, qty: x.qty })),
        coupon_code: appliedCoupon?.code,
        pincode: pin || undefined,
      });
      if (order?.whatsapp_url) { clearCart(); window.open(order.whatsapp_url, "_blank"); return; }
    } catch (err: any) {
      if (err.message) { alert(err.message); setCheckingOut(false); return; }
    }
    const url = buildCheckoutUrl(cart, sub, disc, shipCost, total, appliedCoupon?.code ?? null, pin);
    clearCart();
    window.open(url, "_blank");
    setCheckingOut(false);
  };

  if (!cart.length) {
    return (
      <div style={{ padding: "100px 24px", textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: "var(--surface2)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", color: "var(--text-dim)",
        }}>
          {Icons.cart}
        </div>
        <h2 className="font-serif" style={{ fontSize: 26, marginBottom: 6, color: "var(--text)" }}>Your cart is empty</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: 14 }}>
          Add some kits and come back here
        </p>
        <button className="btn-primary" style={{ maxWidth: 180, margin: "0 auto" }} onClick={onGoHome}>
          Browse Kits
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        padding: "30px 16px 14px",
        borderBottom: "1px solid var(--border)",
        background: "rgba(250,250,248,0.97)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onGoHome} style={{ marginLeft: -4, color: "var(--text-mid)" }}>{Icons.back}</button>
          <h2 className="font-serif" style={{ fontSize: 26, letterSpacing: "-0.01em" }}>Cart</h2>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
            {cart.length} item{cart.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div style={{ padding: "8px 16px 130px" }}>
        {/* Cart items */}
        {cart.map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, padding: "14px 0",
            borderBottom: "1px solid var(--border)",
            animation: "fadeUp .2s ease both",
          }}>
            <div style={{
              width: 80, height: 90, overflow: "hidden",
              background: "var(--surface2)", flexShrink: 0,
              cursor: "pointer", position: "relative",
              borderRadius: 10, border: "1px solid var(--border)",
            }}
              onClick={() => onOpenProduct(item.product)}
            >
              <Image
                src={optimizeCloudinary(item.product.photos[0], 300)}
                alt=""
                fill
                style={{ objectFit: "cover" }}
                sizes="80px"
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>
                {item.product.club}
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.3, color: "var(--text)" }}>
                {item.product.name}
              </p>
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                <span className="badge badge-outline">{item.size}</span>
                <span className="badge badge-outline">{item.ver}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="price-tag">₹{displayPrice(item.product) * item.qty}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <button onClick={() => changeQty(i, -1)} style={{
                    width: 28, height: 28, border: "1px solid var(--border2)", borderRadius: 7,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-mid)",
                  }}>{Icons.minus}</button>
                  <span style={{ width: 22, textAlign: "center", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{item.qty}</span>
                  <button onClick={() => changeQty(i, 1)} style={{
                    width: 28, height: 28, border: "1px solid var(--border2)", borderRadius: 7,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-mid)",
                  }}>{Icons.plus}</button>
                  <button onClick={() => removeFromCart(i)} style={{
                    width: 28, height: 28, border: "1px solid rgba(192,57,43,.2)", borderRadius: 7,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "var(--red)",
                    background: "var(--red-dim)", marginLeft: 4,
                  }}>{Icons.trash}</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Coupon */}
        <div className="card" style={{ marginTop: 16, padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <span style={{ color: "var(--accent)" }}>{Icons.tag}</span>
            <span className="section-label" style={{ marginBottom: 0, color: "var(--accent)" }}>Promo Code</span>
          </div>
          {appliedCoupon ? (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", background: "var(--grn-dim)", borderRadius: 10,
              border: "1px solid rgba(26,122,74,.2)",
            }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--grn)" }}>{appliedCoupon.code}</p>
                <p style={{ fontSize: 12, color: "var(--grn)" }}>
                  {appliedCoupon.type === "pct" ? `${appliedCoupon.value}% off` : `₹${appliedCoupon.value} off`} — saving ₹{disc}
                </p>
              </div>
              <button onClick={() => setAppliedCoupon(null)} style={{ color: "var(--text-muted)" }}>{Icons.x}</button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="input-field"
                  style={{ flex: 1, textTransform: "uppercase" }}
                  placeholder="Enter promo code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  style={{
                    padding: "0 16px", background: "var(--accent)", color: "#fff",
                    borderRadius: 10, fontWeight: 600, fontSize: 13,
                    opacity: couponLoading ? 0.6 : 1, whiteSpace: "nowrap",
                  }}
                >
                  {couponLoading ? "…" : "Apply"}
                </button>
              </div>
              {couponError && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 6 }}>{couponError}</p>}
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                {Object.keys(COUPONS).map((c) => (
                  <button key={c} className="chip" style={{ fontSize: 10 }}
                    onClick={() => { setCouponCode(c); setCouponError(""); }}>
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Shipping */}
        <div className="card" style={{ marginTop: 10, padding: "16px" }}>
          <ShippingEstimator subtotal={sub} externalPin={pin} externalOnPin={setPin} onShipChange={setShip} />
        </div>

        {/* Summary */}
        <div className="card" style={{ marginTop: 10, padding: "16px" }}>
          <span className="section-label">Order Summary</span>
          {[
            { label: "Subtotal", val: `₹${sub}`, color: "var(--text-mid)" },
            ...(appliedCoupon ? [{ label: `Discount (${appliedCoupon.code})`, val: `-₹${disc}`, color: "var(--grn)" }] : []),
            { label: "Shipping", val: shipCost === 0 ? "Free" : `₹${shipCost}`, color: shipCost === 0 ? "var(--grn)" : "var(--text-mid)" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
              <span style={{ fontWeight: 600, color: row.color }}>{row.val}</span>
            </div>
          ))}
          <div className="divider" style={{ margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Total
            </span>
            <span className="price-tag-lg">₹{total}</span>
          </div>
        </div>

        {/* Checkout */}
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn-wa" onClick={checkout} disabled={checkingOut} style={{ opacity: checkingOut ? 0.7 : 1 }}>
            {Icons.whatsapp} {checkingOut ? "Processing…" : "Checkout via WhatsApp"}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
            Your full order will be sent as a WhatsApp message
          </p>
        </div>
      </div>
    </div>
  );
}
