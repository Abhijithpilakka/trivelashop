"use client";

import { useEffect } from "react";

interface SheetProps {
  onClose: () => void;
  children: React.ReactNode;
}

export function Sheet({ onClose, children }: SheetProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />
      <div style={{
        position: "relative",
        background: "var(--surface)",
        borderRadius: "20px 20px 0 0",
        border: "1px solid var(--border)",
        borderBottom: "none",
        paddingBottom: 32,
        paddingTop: 12,
        animation: "fadeUp .2s ease both",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.10)",
      }}>
        <div style={{ width: 36, height: 4, background: "var(--border2)", borderRadius: 4, margin: "0 auto 20px" }} />
        {children}
      </div>
    </div>
  );
}
