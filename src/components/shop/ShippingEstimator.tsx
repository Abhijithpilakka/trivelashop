"use client";

import { useState } from "react";
import { estimateShipping, hasFreeShipping } from "@/lib/utils";
import { estimateShippingApi } from "@/lib/api";
import type { ShippingEstimate } from "@/types";
import { Icons } from "@/components/ui/Icons";

interface ShippingEstimatorProps {
  subtotal?: number;
  onShipChange?: (ship: ShippingEstimate | null) => void;
  externalPin?: string;
  externalOnPin?: (pin: string) => void;
}

export function ShippingEstimator({ subtotal = 0, onShipChange, externalPin, externalOnPin }: ShippingEstimatorProps) {
  const [internalPin, setInternalPin] = useState("");
  const [ship, setShip] = useState<ShippingEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  const pin = externalPin ?? internalPin;
  const setPin = externalOnPin ?? setInternalPin;

  const check = async () => {
    if (pin.length !== 6) return;
    setLoading(true);
    try {
      const apiResult = await estimateShippingApi(pin, subtotal);
      if (apiResult) {
        const result: ShippingEstimate = { label: apiResult.zone, eta: apiResult.eta, cost: apiResult.is_free ? 0 : apiResult.cost };
        setShip(result); onShipChange?.(result);
      } else {
        const result = estimateShipping(pin); setShip(result); onShipChange?.(result);
      }
    } catch {
      const result = estimateShipping(pin); setShip(result); onShipChange?.(result);
    } finally {
      setLoading(false);
    }
  };

  const isFree = hasFreeShipping(subtotal);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <span style={{ color: "var(--accent)" }}>{Icons.pin}</span>
        <span className="section-label" style={{ marginBottom: 0, color: "var(--accent)" }}>
          Delivery Estimate
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input-field"
          style={{ flex: 1 }}
          placeholder="Enter pincode"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <button
          onClick={check}
          disabled={loading || pin.length !== 6}
          style={{
            padding: "0 16px", background: "var(--accent)", color: "#fff",
            borderRadius: 10, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap",
            opacity: loading || pin.length !== 6 ? 0.35 : 1,
            cursor: loading || pin.length !== 6 ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "…" : "Check"}
        </button>
      </div>
      {ship && (
        <div style={{
          marginTop: 10, display: "flex", justifyContent: "space-between",
          fontSize: 13, animation: "fadeIn .18s ease",
          padding: "8px 0", borderTop: "1px solid var(--border)",
        }}>
          <span style={{ color: "var(--text-muted)" }}>{ship.label} · {ship.eta}</span>
          <span style={{ fontWeight: 700, color: ship.cost === 0 || isFree ? "var(--grn)" : "var(--text)" }}>
            {ship.cost === 0 || isFree ? "Free" : `₹${ship.cost}`}
          </span>
        </div>
      )}
      {isFree && (
        <p style={{ fontSize: 12, color: "var(--grn)", marginTop: 8, fontWeight: 600 }}>
          ✓ This order qualifies for free shipping
        </p>
      )}
    </div>
  );
}
