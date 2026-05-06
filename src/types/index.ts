export type SizeKey = "S" | "M" | "L" | "XL" | "XXL";
export type ProductCategory = "Club" | "National" | "Retro";
export type ProductTag = "bestseller" | "new" | "retro" | "soldout" | null;
export type LogoType = "Embroidery" | "Heat Pressed";
export type CouponType = "pct" | "flat";

export interface ProductSizes {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

export interface Product {
  id: number;
  name: string;
  club: string;
  category: ProductCategory;
  description: string;
  price: number;
  offerPrice: number | null;
  logo: LogoType;
  inStock: boolean;
  sizes: ProductSizes;
  versions: string[];
  photos: string[];
  tag: ProductTag;
}

export interface CartItem {
  pid: number;
  product: Product;
  size: SizeKey;
  ver: string;
  qty: number;
}

export interface Coupon {
  type: CouponType;
  value: number;
  code?: string;
}

export interface ShippingEstimate {
  label: string;
  eta: string;
  cost: number;
}

export interface SortOption {
  label: string;
  value: "featured" | "price_asc" | "price_desc";
}
