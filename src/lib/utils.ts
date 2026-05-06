import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product, ShippingEstimate, CartItem } from "@/types";
import { WA_NUMBER, FREE_SHIP_MIN } from "@/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Effective display price */
export function displayPrice(p: Product): number {
  return p.offerPrice ?? p.price;
}

/** Is this product sold out? */
export function isSoldOut(p: Product): boolean {
  return !p.inStock || Object.values(p.sizes).every((q) => q === 0);
}

/** Discount percentage */
export function discountPct(p: Product): number {
  if (!p.offerPrice) return 0;
  return Math.round((1 - p.offerPrice / p.price) * 100);
}

/** Estimate shipping from pincode */
export function estimateShipping(pin: string): ShippingEstimate | null {
  if (!pin || pin.length !== 6) return null;
  const n = parseInt(pin.slice(0, 2));
  if (n >= 40 && n <= 41) return { label: "Mumbai Local", eta: "1–2 days", cost: 0 };
  if (n >= 36 && n <= 42) return { label: "West India", eta: "2–3 days", cost: 60 };
  if ((n >= 50 && n <= 69) || (n >= 10 && n <= 29))
    return { label: "Pan India", eta: "3–5 days", cost: 79 };
  if (n >= 78 && n <= 79) return { label: "Northeast", eta: "5–7 days", cost: 120 };
  return { label: "Standard", eta: "3–5 days", cost: 79 };
}

/** Build WhatsApp checkout URL */
export function buildCheckoutUrl(
  cart: CartItem[],
  sub: number,
  disc: number,
  shipCost: number,
  total: number,
  couponCode: string | null,
  pin: string
): string {
  const lines = cart
    .map(
      (x) =>
        `• ${x.product.name} | ${x.ver} | Size ${x.size} | Qty ${x.qty} | ₹${displayPrice(x.product) * x.qty}`
    )
    .join("\n");

  const msg = [
    "Hi! I'd like to order:",
    "",
    lines,
    "",
    `Subtotal: ₹${sub}`,
    couponCode ? `Coupon (${couponCode}): -₹${disc}` : null,
    `Shipping: ${shipCost === 0 ? "Free" : "₹" + shipCost}`,
    `*Total: ₹${total}*`,
    `Pincode: ${pin || "—"}`,
    "",
    "Please confirm and share payment details.",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/** Build WhatsApp product inquiry URL */
export function buildProductInquiryUrl(
  p: Product,
  ver: string,
  size: string | null
): string {
  const msg = [
    "Hi! I want to order:",
    "",
    `*${p.name}*`,
    `Version: ${ver}`,
    `Size: ${size ?? "TBD"}`,
    `Price: ₹${displayPrice(p)}`,
    `Logo: ${p.logo}`,
    "",
    "Please confirm availability.",
  ].join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/** Format rupees */
export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Is order eligible for free shipping? */
export function hasFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIP_MIN;
}
