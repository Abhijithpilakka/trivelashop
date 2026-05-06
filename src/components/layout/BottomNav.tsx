"use client";

import { Icons } from "@/components/ui/Icons";
import { useStore } from "@/hooks/useStore";

type ViewName = "home" | "saved" | "cart" | "product" | "about";

interface BottomNavProps {
  view: ViewName;
  onNavigate: (view: ViewName) => void;
  onSearchFocus: () => void;
}

export function BottomNav({ view, onNavigate, onSearchFocus }: BottomNavProps) {
  const { wishlist, cartCount } = useStore();
  const cartNum = cartCount();

  const items = [
    { id: "home"  as const, label: "Shop",   icon: Icons.home },
    { id: "_search" as const, label: "Search", icon: Icons.search },
    { id: "saved" as const, label: "Saved",  icon: wishlist.length ? Icons.heartFilled : Icons.heart },
    { id: "cart"  as const, label: "Cart",   icon: Icons.cart, badge: cartNum || null },
    { id: "about" as const, label: "About",  icon: Icons.info },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        background: "rgba(250,250,248,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0 22px",
        zIndex: 100,
      }}
    >
      {items.map(({ id, label, icon, badge }) => {
        const isActive =
          view === id ||
          (id === "home" && (view === "home" || view === "product"));

        return (
          <button
            key={id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "4px 14px",
              color: isActive ? "var(--accent)" : "var(--text-dim)",
              transition: "color .15s",
            }}
            onClick={() => id === "_search" ? onSearchFocus() : onNavigate(id)}
          >
            <span style={{ position: "relative" }}>
              {icon}
              {badge != null && (
                <span style={{
                  position: "absolute", top: -3, right: -4,
                  width: 14, height: 14,
                  background: "var(--accent)", color: "#fff",
                  borderRadius: "50%", fontSize: 8, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid var(--bg)",
                }}>
                  {badge}
                </span>
              )}
            </span>
            <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {label}
            </span>
            {isActive && (
              <span style={{ width: 16, height: 2, background: "var(--accent)", borderRadius: 2, marginTop: -1 }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
