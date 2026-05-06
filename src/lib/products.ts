/**
 * src/lib/products.ts
 * -------------------
 * Data fetching layer.
 * Priority: Backend API → Seed data fallback
 */

import type { Product } from "@/types";
import { fetchProducts, fetchProduct } from "@/lib/api";

export async function getProducts(): Promise<Product[]> {
  return fetchProducts();
}

export async function getProduct(id: number): Promise<Product | null> {
  return fetchProduct(id);
}
