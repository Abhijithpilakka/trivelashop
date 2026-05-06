import type { Product, Coupon } from "@/types";

export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "919999999999";
export const FREE_SHIP_MIN = Number(process.env.NEXT_PUBLIC_FREE_SHIP_MIN ?? 1499);
export const DEFAULT_SHIP = Number(process.env.NEXT_PUBLIC_DEFAULT_SHIP ?? 79);
export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "TRIVELA";

export const COUPONS: Record<string, Coupon> = {
  TRIVELA10: { type: "pct", value: 10 },
  FLAT150: { type: "flat", value: 150 },
  NEWSEASON: { type: "pct", value: 15 },
};

export const CATEGORIES = ["All", "Club", "National", "Retro"] as const;
export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

export const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Real Madrid Home 24/25",
    club: "Real Madrid",
    category: "Club",
    description:
      "The iconic all-white home shirt for the 24/25 season. Adidas AEROREADY moisture-wicking technology. Official crest with precision embroidery finish.",
    price: 1299,
    offerPrice: 999,
    logo: "Embroidery",
    inStock: true,
    sizes: { S: 8, M: 3, L: 0, XL: 5, XXL: 2 },
    versions: ["Fan Version", "Player Version", "Master Copy"],
    photos: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80",
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=600&q=80",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
    ],
    tag: "bestseller",
  },
  {
    id: 2,
    name: "FC Barcelona Away 24/25",
    club: "FC Barcelona",
    category: "Club",
    description:
      "Deep navy away kit with gold trim. Nike Dri-FIT technology. Heat-pressed crest for a sleek low-profile look. Match-grade construction throughout.",
    price: 1399,
    offerPrice: 1099,
    logo: "Heat Pressed",
    inStock: true,
    sizes: { S: 4, M: 0, L: 7, XL: 3, XXL: 1 },
    versions: ["Fan Version", "Player Version", "Master Copy"],
    photos: [
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80",
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80",
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80",
    ],
    tag: "new",
  },
  {
    id: 3,
    name: "India National Home",
    club: "India",
    category: "National",
    description:
      "Wear the Blue Tigers with pride. AIFF crest embroidery. Premium polyester blend for match and everyday wear. India's most iconic kit, now in stock.",
    price: 899,
    offerPrice: null,
    logo: "Embroidery",
    inStock: true,
    sizes: { S: 12, M: 8, L: 5, XL: 9, XXL: 3 },
    versions: ["Fan Version", "Master Copy"],
    photos: [
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80",
      "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=600&q=80",
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=600&q=80",
    ],
    tag: null,
  },
  {
    id: 4,
    name: "Manchester City Third 24/25",
    club: "Manchester City",
    category: "Club",
    description:
      "Man City's limited third kit. Bold geometric print inspired by Manchester's industrial architecture. Heat-pressed Puma badge. Collector's edition.",
    price: 1199,
    offerPrice: 949,
    logo: "Heat Pressed",
    inStock: false,
    sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    versions: ["Fan Version", "Player Version"],
    photos: [
      "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=600&q=80",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
      "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=600&q=80",
    ],
    tag: "soldout",
  },
  {
    id: 5,
    name: "Liverpool Home 24/25",
    club: "Liverpool",
    category: "Club",
    description:
      "Classic red with subtle tonal pinstripes. Nike Dri-FIT ADV. You'll Never Walk Alone — embroidered crest, match-day ready construction.",
    price: 1299,
    offerPrice: 1049,
    logo: "Embroidery",
    inStock: true,
    sizes: { S: 2, M: 6, L: 4, XL: 1, XXL: 5 },
    versions: ["Fan Version", "Player Version", "Master Copy"],
    photos: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80",
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=600&q=80",
    ],
    tag: "bestseller",
  },
  {
    id: 6,
    name: "Brazil Retro 1970",
    club: "Brazil",
    category: "Retro",
    description:
      "Faithful replica of Brazil's 1970 World Cup shirt. Canary yellow with green trim. Cotton-blend fabric, embroidered CBF crest. A piece of history.",
    price: 1099,
    offerPrice: 849,
    logo: "Embroidery",
    inStock: true,
    sizes: { S: 6, M: 4, L: 8, XL: 2, XXL: 1 },
    versions: ["Fan Version", "Master Copy"],
    photos: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80",
    ],
    tag: "retro",
  },
];
