/**
 * src/lib/api.ts
 * --------------
 * HTTP client for the KitDrop FastAPI backend.
 * Falls back gracefully to seed data if API_URL is not configured.
 */

import type { Product } from "@/types";
import { SEED_PRODUCTS } from "@/config";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── Raw backend shape (snake_case) ──────────────────────────────────────────
interface ApiProduct {
  id: number;
  name: string;
  club: string;
  category: string;
  description: string;
  price: number;
  offer_price: number | null;
  logo: string;
  in_stock: boolean;
  sizes: { S: number; M: number; L: number; XL: number; XXL: number };
  versions: string[];
  photos: string[];
  tag: string | null;
  display_price: number;
  discount_pct: number;
}

interface ApiProductList {
  items: ApiProduct[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Map snake_case → camelCase for the frontend ─────────────────────────────
function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    club: p.club,
    category: p.category as Product["category"],
    description: p.description,
    price: p.price,
    offerPrice: p.offer_price,
    logo: p.logo as Product["logo"],
    inStock: p.in_stock,
    sizes: p.sizes,
    versions: p.versions,
    photos: p.photos,
    tag: (p.tag ?? null) as Product["tag"],
  };
}

// ─── Fetch all products ───────────────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  if (!API_URL) {
    console.info("[api] NEXT_PUBLIC_API_URL not set — using seed data");
    return SEED_PRODUCTS;
  }

  try {
    const res = await fetch(`${API_URL}/products?page_size=100`, {
      next: { revalidate: 60 }, // ISR: re-fetch every 60 seconds
    });

    if (!res.ok) {
      console.error(`[api] GET /products failed: ${res.status}`);
      return SEED_PRODUCTS;
    }

    const data: ApiProductList = await res.json();
    return data.items.map(mapProduct);
  } catch (err) {
    console.error("[api] fetchProducts error:", err);
    return SEED_PRODUCTS;
  }
}

// ─── Fetch single product ─────────────────────────────────────────────────────
export async function fetchProduct(id: number): Promise<Product | null> {
  if (!API_URL) {
    return SEED_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`[api] GET /products/${id} failed: ${res.status}`);
      return SEED_PRODUCTS.find((p) => p.id === id) ?? null;
    }

    const data: ApiProduct = await res.json();
    return mapProduct(data);
  } catch (err) {
    console.error("[api] fetchProduct error:", err);
    return SEED_PRODUCTS.find((p) => p.id === id) ?? null;
  }
}

// ─── Validate coupon via backend ──────────────────────────────────────────────
export interface CouponResult {
  code: string;
  type: "pct" | "flat";
  value: number;
  discount_amount: number;
  message: string;
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponResult | null> {
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}/orders/coupon/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.detail ?? "Invalid coupon");
    }

    return await res.json();
  } catch (err: any) {
    throw new Error(err.message ?? "Coupon validation failed");
  }
}

// ─── Estimate shipping via backend ────────────────────────────────────────────
export interface ShippingResult {
  zone: string;
  eta: string;
  cost: number;
  is_free: boolean;
}

export async function estimateShippingApi(
  pincode: string,
  subtotal: number
): Promise<ShippingResult | null> {
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}/orders/shipping/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincode, subtotal }),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Create order via backend ─────────────────────────────────────────────────
export interface OrderItemPayload {
  product_id: number;
  size: string;
  version: string;
  qty: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  coupon_code?: string;
  pincode?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
}

export interface OrderResult {
  id: string;
  status: string;
  total: number;
  whatsapp_url: string;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<OrderResult | null> {
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.detail ?? "Order failed");
    }

    return await res.json();
  } catch (err: any) {
    throw new Error(err.message ?? "Order creation failed");
  }
}
