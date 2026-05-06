import { getProducts } from "@/lib/products";
import { AppShell } from "@/components/shop/AppShell";

/**
 * Root page — server component.
 * Fetches products on the server (from Supabase or seed data)
 * then hands them to the client-side AppShell.
 */
export default async function Page() {
  const products = await getProducts();

  return <AppShell initialProducts={products} />;
}
