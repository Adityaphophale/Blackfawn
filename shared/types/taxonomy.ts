export interface CategoryTaxonomy {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  subcategories: { id: string; name: string; slug: string; targetGender?: string; isFuture?: boolean }[];
  productTypes?: string[];
}

export interface CollectionTaxonomy {
  id: string;
  name: string;
  slug: string;
  description: string;
  isPriceBased?: boolean;
}

export const TOP_LEVEL_CATEGORIES: CategoryTaxonomy[] = [
  {
    id: 'cat-tshirts',
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Bespoke heavyweight cotton and printed tees for daily luxury.',
    subcategories: [
      { id: 'sub-tshirt-men', name: 'Printed Round Neck T-Shirts - Men', slug: 'men', targetGender: 'Men' },
      { id: 'sub-tshirt-women', name: 'Printed Round Neck T-Shirts - Women', slug: 'women', targetGender: 'Women' },
      { id: 'sub-tshirt-kids', name: 'Printed Round Neck T-Shirts - Kids', slug: 'kids', targetGender: 'Kids' },
      { id: 'sub-tshirt-oversized', name: 'Oversized T-Shirts', slug: 'oversized', isFuture: true },
      { id: 'sub-tshirt-regular', name: 'Regular Fit T-Shirts', slug: 'regular-fit', isFuture: true },
      { id: 'sub-tshirt-custom', name: 'Customized T-Shirts', slug: 'customized', isFuture: true },
    ],
  },
  {
    id: 'cat-polo-tshirts',
    name: 'Polo T-Shirts',
    slug: 'polo-t-shirts',
    description: 'Structured pique cotton polos with premium embroidery and tailored collars.',
    subcategories: [
      { id: 'sub-polo-men', name: 'Printed Polo T-Shirts - Men', slug: 'men', targetGender: 'Men' },
      { id: 'sub-polo-women', name: 'Printed Polo T-Shirts - Women', slug: 'women', isFuture: true },
      { id: 'sub-polo-custom', name: 'Customized Polo T-Shirts', slug: 'customized', isFuture: true },
    ],
  },
  {
    id: 'cat-caps',
    name: 'Caps',
    slug: 'caps',
    description: 'Structured cotton canvas headwear with embroidered craft emblems.',
    subcategories: [
      { id: 'sub-caps-unisex', name: 'Printed Caps - Unisex', slug: 'printed', targetGender: 'Unisex' },
      { id: 'sub-caps-custom', name: 'Customized Caps', slug: 'customized' },
    ],
  },
  {
    id: 'cat-socks',
    name: 'Socks',
    slug: 'socks',
    description: 'High-density combed cotton knitted socks engineered for comfort.',
    subcategories: [
      { id: 'sub-socks-printed', name: 'Printed Socks', slug: 'printed' },
      { id: 'sub-socks-custom', name: 'Customized Socks', slug: 'customized' },
    ],
  },
  {
    id: 'cat-towels',
    name: 'Towels',
    slug: 'towels',
    description: 'Plush organic terry cotton towels with rapid absorbency loops.',
    productTypes: ['Face Towel', 'Hand Towel', 'Bath Towel', 'Beach Towel'],
    subcategories: [
      { id: 'sub-towels-printed', name: 'Printed Towels', slug: 'printed' },
      { id: 'sub-towels-custom', name: 'Customized Towels', slug: 'customized' },
    ],
  },
  {
    id: 'cat-hand-napkins',
    name: 'Hand Napkins',
    slug: 'hand-napkins',
    description: 'Bespoke pocket hand napkins crafted from pre-shrunk cotton.',
    subcategories: [
      { id: 'sub-[#hand-napkins-printed]', name: 'Printed Hand Napkins', slug: 'printed' },
      { id: 'sub-hand-napkins-custom', name: 'Customized Hand Napkins', slug: 'customized' },
    ],
  },
  {
    id: 'cat-mugs',
    name: 'Mugs',
    slug: 'mugs',
    description: 'Artisanal ceramic mugs designed for high-resolution personalized prints.',
    subcategories: [
      { id: 'sub-mugs-custom', name: 'Customized Printed Mugs', slug: 'customized' },
    ],
  },
  {
    id: 'cat-bottles',
    name: 'Bottles',
    slug: 'bottles',
    description: 'Double-walled vacuum insulated stainless steel water bottles with laser engraving.',
    subcategories: [
      { id: 'sub-bottles-custom', name: 'Customized Metal Water Bottles', slug: 'customized' },
    ],
  },
  {
    id: 'cat-hampers',
    name: 'Hampers & Gifting',
    slug: 'hampers',
    description: 'Curated multi-piece luxury gift hampers and personalized artisanal boxes.',
    subcategories: [
      { id: 'sub-hamp-premium', name: 'Premium Gift Hampers', slug: 'premium' },
      { id: 'sub-hamp-personalized', name: 'Personalized Hampers', slug: 'personalized' },
      { id: 'sub-hamp-couple', name: 'Couple Hampers', slug: 'couple' },
      { id: 'sub-hamp-kids', name: 'Kids Hampers', slug: 'kids' },
      { id: 'sub-hamp-corporate', name: 'Corporate Hampers', slug: 'corporate' },
      { id: 'sub-hamp-festival', name: 'Festival Hampers', slug: 'festival' },
      { id: 'sub-hamp-custom', name: 'Custom Hampers', slug: 'custom' },
    ],
  },
];

export const CROSS_CUTTING_COLLECTIONS: CollectionTaxonomy[] = [
  { id: 'coll-new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', description: 'Fresh seasonal drops and atelier releases.' },
  { id: 'coll-best-sellers', name: 'Best Sellers', slug: 'best-sellers', description: 'Most requested luxury pieces and client favorites.' },
  { id: 'coll-trending', name: 'Trending', slug: 'trending', description: 'Garments and hampers trending across high-fashion edits.' },
  { id: 'coll-featured', name: 'Featured', slug: 'featured', description: 'Handpicked spotlight collection.' },
  { id: 'coll-limited-edition', name: 'Limited Edition', slug: 'limited-edition', description: 'Exclusive numbered runs and rare drop releases.' },
  { id: 'coll-personalized-gifts', name: 'Personalized Gifts', slug: 'personalized-gifts', description: 'Custom-engraved and printed luxury keepsakes.' },
  { id: 'coll-corporate-gifting', name: 'Corporate Gifting', slug: 'corporate-gifting', description: 'Bespoke corporate bundles and brand hampers.' },
  { id: 'coll-birthday-gifts', name: 'Birthday Gifts', slug: 'birthday-gifts', description: 'Curated birthday surprises and personalized hampers.' },
  { id: 'coll-anniversary-gifts', name: 'Anniversary Gifts', slug: 'anniversary-gifts', description: 'Romantic couple hampers and luxury memory tokens.' },
  { id: 'coll-festival-gifting', name: 'Festival Gifting', slug: 'festival-gifting', description: 'Festive hamper boxes and traditional celebration gifts.' },
  { id: 'coll-couple-gifts', name: 'Couple Gifts', slug: 'couple-gifts', description: 'Matching apparel and romantic gift sets for couples.' },
  { id: 'coll-kids-gifts', name: 'Kids Gifts', slug: 'kids-gifts', description: 'Whimsical customized printed tees and fun accessories.' },
  { id: 'coll-premium-gifts', name: 'Premium Gifts', slug: 'premium-gifts', description: 'High-end artisanal hampers and luxury metalware.' },
  { id: 'coll-under-999', name: 'Under ₹999', slug: 'under-999', description: 'Affordable luxury drops under ₹999.', isPriceBased: true },
  { id: 'coll-under-1499', name: 'Under ₹1,499', slug: 'under-1499', description: 'Curated apparel and accessories under ₹1,499.', isPriceBased: true },
  { id: 'coll-under-1999', name: 'Under ₹1,999', slug: 'under-1999', description: 'Premium hampers and gifting sets under ₹1,999.', isPriceBased: true },
  { id: 'coll-gift-picks', name: 'Gift Picks', slug: 'gift-picks', description: 'Editor-curated top picks for instant gifting.' },
];

export const VALID_SIZES_CLOTHING = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];
export const VALID_SIZES_CAPS = ['Free Size'];

export function getCategoryBySlug(slug: string): CategoryTaxonomy | undefined {
  return TOP_LEVEL_CATEGORIES.find((c) => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
}

export function getCollectionBySlug(slug: string): CollectionTaxonomy | undefined {
  return CROSS_CUTTING_COLLECTIONS.find((c) => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
}
