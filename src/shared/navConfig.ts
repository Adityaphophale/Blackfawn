export interface NavLinkItem {
  id: string;
  label: string;
  url: string;
  categoryFilter?: string;
  subCategoryFilter?: string;
  collectionFilter?: string;
  personalizedFilter?: boolean;
  budgetFilterMax?: number;
}

export interface NavColumn {
  id: string;
  title: string;
  links: NavLinkItem[];
}

export interface NavFeaturedCard {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
}

export interface NavItemConfig {
  id: string;
  label: string;
  slug: string;
  enabled: boolean;
  order: number;
  columns: NavColumn[];
  featuredCard?: NavFeaturedCard;
  ctaText?: string;
  ctaUrl?: string;
}

export const DEFAULT_NAVIGATION_CONFIG: NavItemConfig[] = [
  {
    id: "nav-shop",
    label: "SHOP",
    slug: "shop",
    enabled: true,
    order: 1,
    columns: [
      {
        id: "col-shop-clothing",
        title: "CLOTHING",
        links: [
          { id: "l-s-1", label: "Printed Round Neck T-Shirts - Men", url: "#/t-shirts", categoryFilter: "T-Shirts", subCategoryFilter: "Printed Round Neck T-Shirts - Men" },
          { id: "l-s-2", label: "Printed Round Neck T-Shirts - Women", url: "#/t-shirts", categoryFilter: "T-Shirts", subCategoryFilter: "Printed Round Neck T-Shirts - Women" },
          { id: "l-s-3", label: "Printed Round Neck T-Shirts - Kids", url: "#/t-shirts", categoryFilter: "T-Shirts", subCategoryFilter: "Printed Round Neck T-Shirts - Kids" },
          { id: "l-s-4", label: "Printed Polo T-Shirts - Men", url: "#/polo-t-shirts", categoryFilter: "Polo T-Shirts", subCategoryFilter: "Printed Polo T-Shirts - Men" },
        ],
      },
      {
        id: "col-shop-acc",
        title: "ACCESSORIES",
        links: [
          { id: "l-s-5", label: "Caps", url: "#/caps", categoryFilter: "Caps" },
          { id: "l-s-6", label: "Socks", url: "#/socks", categoryFilter: "Socks" },
          { id: "l-s-7", label: "Towels", url: "#/towels", categoryFilter: "Towels" },
          { id: "l-s-8", label: "Hand Napkins", url: "#/hand-napkins", categoryFilter: "Hand Napkins" },
          { id: "l-s-9", label: "Mugs", url: "#/mugs", categoryFilter: "Mugs" },
          { id: "l-s-10", label: "Bottles", url: "#/bottles", categoryFilter: "Bottles" },
        ],
      },
      {
        id: "col-shop-gifting",
        title: "GIFTING",
        links: [
          { id: "l-s-11", label: "Hampers & Gifting", url: "#/hampers", categoryFilter: "Hampers & Gifting" },
          { id: "l-s-12", label: "Premium Gift Hampers", url: "#/hampers", categoryFilter: "Hampers & Gifting", collectionFilter: "Premium Gift Hampers" },
          { id: "l-s-13", label: "Personalized Gifts", url: "#/collections/personalized-gifts", collectionFilter: "Personalized Gifts" },
          { id: "l-s-14", label: "Corporate Gifting", url: "#/collections/corporate-gifting", collectionFilter: "Corporate Gifting" },
        ],
      },
      {
        id: "col-shop-by",
        title: "SHOP BY",
        links: [
          { id: "l-s-15", label: "New Arrivals", url: "#/collections/new-arrivals", collectionFilter: "New Arrivals" },
          { id: "l-s-16", label: "Best Sellers", url: "#/collections/best-sellers", collectionFilter: "Best Sellers" },
          { id: "l-s-17", label: "Trending", url: "#/collections/trending", collectionFilter: "Trending" },
          { id: "l-s-18", label: "Limited Edition", url: "#/collections/limited-edition", collectionFilter: "Limited Edition" },
        ],
      },
    ],
    featuredCard: {
      title: "ATELIER DROP 2026",
      subtitle: "Discover high-density heavy cottons and bespoke hampers.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
      ctaText: "EXPLORE ALL DROPS",
      ctaUrl: "#/shop",
    },
  },
  {
    id: "nav-tshirts",
    label: "T-SHIRTS",
    slug: "t-shirts",
    enabled: true,
    order: 2,
    columns: [
      {
        id: "col-ts-men",
        title: "MEN",
        links: [
          { id: "l-ts-1", label: "Printed Round Neck T-Shirts", url: "#/t-shirts", categoryFilter: "T-Shirts", subCategoryFilter: "Printed Round Neck T-Shirts - Men" },
          { id: "l-ts-2", label: "Printed Polo T-Shirts", url: "#/polo-t-shirts", categoryFilter: "Polo T-Shirts", subCategoryFilter: "Printed Polo T-Shirts - Men" },
        ],
      },
      {
        id: "col-ts-women",
        title: "WOMEN",
        links: [
          { id: "l-ts-3", label: "Printed Round Neck T-Shirts", url: "#/t-shirts", categoryFilter: "T-Shirts", subCategoryFilter: "Printed Round Neck T-Shirts - Women" },
        ],
      },
      {
        id: "col-ts-kids",
        title: "KIDS",
        links: [
          { id: "l-ts-4", label: "Printed Round Neck T-Shirts", url: "#/t-shirts", categoryFilter: "T-Shirts", subCategoryFilter: "Printed Round Neck T-Shirts - Kids" },
        ],
      },
      {
        id: "col-ts-style",
        title: "SHOP BY STYLE",
        links: [
          { id: "l-ts-5", label: "Printed", url: "#/t-shirts", categoryFilter: "T-Shirts" },
          { id: "l-ts-6", label: "Customized", url: "#/t-shirts", categoryFilter: "T-Shirts", personalizedFilter: true },
          { id: "l-ts-7", label: "New Arrivals", url: "#/t-shirts", categoryFilter: "T-Shirts", collectionFilter: "New Arrivals" },
          { id: "l-ts-8", label: "Best Sellers", url: "#/t-shirts", categoryFilter: "T-Shirts", collectionFilter: "Best Sellers" },
        ],
      },
    ],
    featuredCard: {
      title: "HEAVYWEIGHT COTTONS",
      subtitle: "Pre-shrunk 240 GSM organic combed cotton t-shirts.",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
      ctaText: "SHOP ALL T-SHIRTS",
      ctaUrl: "#/t-shirts",
    },
    ctaText: "SHOP ALL T-SHIRTS",
    ctaUrl: "#/t-shirts",
  },
  {
    id: "nav-accessories",
    label: "ACCESSORIES",
    slug: "accessories",
    enabled: true,
    order: 3,
    columns: [
      {
        id: "col-acc-wearable",
        title: "WEARABLE",
        links: [
          { id: "l-ac-1", label: "Caps", url: "#/caps", categoryFilter: "Caps" },
          { id: "l-ac-2", label: "Socks", url: "#/socks", categoryFilter: "Socks" },
        ],
      },
      {
        id: "col-acc-home",
        title: "HOME & LIFESTYLE",
        links: [
          { id: "l-ac-3", label: "Towels", url: "#/towels", categoryFilter: "Towels" },
          { id: "l-ac-4", label: "Hand Napkins", url: "#/hand-napkins", categoryFilter: "Hand Napkins" },
          { id: "l-ac-5", label: "Mugs", url: "#/mugs", categoryFilter: "Mugs" },
          { id: "l-ac-6", label: "Bottles", url: "#/bottles", categoryFilter: "Bottles" },
        ],
      },
      {
        id: "col-acc-shopby",
        title: "SHOP BY",
        links: [
          { id: "l-ac-7", label: "Personalized", url: "#/shop", personalizedFilter: true },
          { id: "l-ac-8", label: "New Arrivals", url: "#/collections/new-arrivals", collectionFilter: "New Arrivals" },
          { id: "l-ac-9", label: "Best Sellers", url: "#/collections/best-sellers", collectionFilter: "Best Sellers" },
        ],
      },
    ],
    featuredCard: {
      title: "ATELIER ESSENTIALS",
      subtitle: "Canvas caps, Terry towels, and laser-etched metal bottles.",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600",
      ctaText: "SHOP ALL ACCESSORIES",
      ctaUrl: "#/caps",
    },
    ctaText: "SHOP ALL ACCESSORIES",
    ctaUrl: "#/caps",
  },
  {
    id: "nav-hampers",
    label: "HAMPERS & GIFTING",
    slug: "hampers",
    enabled: true,
    order: 4,
    columns: [
      {
        id: "col-hamp-types",
        title: "GIFT HAMPERS",
        links: [
          { id: "l-h-1", label: "Premium Gift Hampers", url: "#/hampers", categoryFilter: "Hampers & Gifting", collectionFilter: "Premium Gift Hampers" },
          { id: "l-h-2", label: "Personalized Hampers", url: "#/hampers", categoryFilter: "Hampers & Gifting", collectionFilter: "Personalized Hampers" },
          { id: "l-h-3", label: "Couple Hampers", url: "#/hampers", categoryFilter: "Hampers & Gifting", collectionFilter: "Couple Hampers" },
          { id: "l-h-4", label: "Kids Hampers", url: "#/hampers", categoryFilter: "Hampers & Gifting", collectionFilter: "Kids Hampers" },
          { id: "l-h-5", label: "Corporate Hampers", url: "#/hampers", categoryFilter: "Hampers & Gifting", collectionFilter: "Corporate Hampers" },
          { id: "l-h-6", label: "Festival Hampers", url: "#/hampers", categoryFilter: "Hampers & Gifting", collectionFilter: "Festival Hampers" },
        ],
      },
      {
        id: "col-hamp-occ",
        title: "GIFT BY OCCASION",
        links: [
          { id: "l-h-7", label: "Birthday", url: "#/collections/birthday-gifts", collectionFilter: "Birthday Gifts" },
          { id: "l-h-8", label: "Anniversary", url: "#/collections/anniversary-gifts", collectionFilter: "Anniversary Gifts" },
          { id: "l-h-9", label: "Corporate Gifting", url: "#/collections/corporate-gifting", collectionFilter: "Corporate Gifting" },
          { id: "l-h-10", label: "Festival Gifting", url: "#/collections/festival-gifting", collectionFilter: "Festival Gifting" },
          { id: "l-h-11", label: "Special Moments", url: "#/hampers", categoryFilter: "Hampers & Gifting" },
        ],
      },
      {
        id: "col-hamp-budget",
        title: "GIFT BY BUDGET",
        links: [
          { id: "l-h-12", label: "Under ₹999", url: "#/collections/under-999", collectionFilter: "Under ₹999", budgetFilterMax: 999 },
          { id: "l-h-13", label: "Under ₹1,499", url: "#/collections/under-1499", collectionFilter: "Under ₹1,499", budgetFilterMax: 1499 },
          { id: "l-h-14", label: "Under ₹1,999", url: "#/collections/under-1999", collectionFilter: "Under ₹1,999", budgetFilterMax: 1999 },
          { id: "l-h-15", label: "Premium Gifts", url: "#/collections/premium-gifts", collectionFilter: "Premium Gifts" },
        ],
      },
    ],
    featuredCard: {
      title: "THE ROYAL GIFT BOX",
      subtitle: "Bespoke 14-piece customizable velvet gift trunk with satin lining.",
      image: "/1.jpeg",
      ctaText: "EXPLORE ALL HAMPERS",
      ctaUrl: "#/hampers",
    },
    ctaText: "EXPLORE ALL HAMPERS",
    ctaUrl: "#/hampers",
  },
  {
    id: "nav-personalized",
    label: "PERSONALIZED",
    slug: "personalized",
    enabled: true,
    order: 5,
    columns: [
      {
        id: "col-pers-clothing",
        title: "PERSONALIZED CLOTHING",
        links: [
          { id: "l-p-1", label: "Customized T-Shirts", url: "#/t-shirts", categoryFilter: "T-Shirts", personalizedFilter: true },
          { id: "l-p-2", label: "Customized Caps", url: "#/caps", categoryFilter: "Caps", personalizedFilter: true },
        ],
      },
      {
        id: "col-pers-acc",
        title: "PERSONALIZED ACCESSORIES",
        links: [
          { id: "l-p-3", label: "Customized Mugs", url: "#/mugs", categoryFilter: "Mugs", personalizedFilter: true },
          { id: "l-p-4", label: "Customized Bottles", url: "#/bottles", categoryFilter: "Bottles", personalizedFilter: true },
          { id: "l-p-5", label: "Customized Towels", url: "#/towels", categoryFilter: "Towels", personalizedFilter: true },
          { id: "l-p-6", label: "Customized Hand Napkins", url: "#/hand-napkins", categoryFilter: "Hand Napkins", personalizedFilter: true },
          { id: "l-p-7", label: "Customized Keychains", url: "#/hampers", categoryFilter: "Hampers & Gifting" },
          { id: "l-p-8", label: "Customized Fridge Magnets", url: "#/hampers", categoryFilter: "Hampers & Gifting" },
        ],
      },
      {
        id: "col-pers-gifts",
        title: "PERSONALIZED GIFTS",
        links: [
          { id: "l-p-9", label: "Personalized Hampers", url: "#/hampers", categoryFilter: "Hampers & Gifting", collectionFilter: "Personalized Hampers" },
          { id: "l-p-10", label: "Custom Gift Sets", url: "#/collections/personalized-gifts", collectionFilter: "Personalized Gifts" },
          { id: "l-p-11", label: "Corporate Gifts", url: "#/collections/corporate-gifting", collectionFilter: "Corporate Gifting" },
        ],
      },
    ],
    featuredCard: {
      title: "ATELIER EMBROIDERY & ENGRAVING",
      subtitle: "Custom names, monograms, and custom graphics on demand.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
      ctaText: "CREATE SOMETHING PERSONAL",
      ctaUrl: "#/hampers",
    },
    ctaText: "CREATE SOMETHING PERSONAL",
    ctaUrl: "#/hampers",
  },
  {
    id: "nav-new-arrivals",
    label: "NEW ARRIVALS",
    slug: "new-arrivals",
    enabled: true,
    order: 6,
    columns: [
      {
        id: "col-new-items",
        title: "LATEST DROPS",
        links: [
          { id: "l-na-1", label: "Latest T-Shirts", url: "#/t-shirts", categoryFilter: "T-Shirts", collectionFilter: "New Arrivals" },
          { id: "l-na-2", label: "Latest Accessories", url: "#/caps", collectionFilter: "New Arrivals" },
          { id: "l-na-3", label: "Latest Hampers", url: "#/hampers", categoryFilter: "Hampers & Gifting", collectionFilter: "New Arrivals" },
          { id: "l-na-4", label: "Latest Personalized Products", url: "#/shop", personalizedFilter: true, collectionFilter: "New Arrivals" },
        ],
      },
    ],
    featuredCard: {
      title: "SPRING / SUMMER 2026",
      subtitle: "Explore newly dropped products freshly marked by the atelier.",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
      ctaText: "SHOP NEW ARRIVALS",
      ctaUrl: "#/collections/new-arrivals",
    },
    ctaText: "SHOP NEW ARRIVALS",
    ctaUrl: "#/collections/new-arrivals",
  },
  {
    id: "nav-sale",
    label: "SALE",
    slug: "sale",
    enabled: true,
    order: 7,
    columns: [
      {
        id: "col-sale-budget",
        title: "SHOP SALE BY BUDGET",
        links: [
          { id: "l-sa-1", label: "Under ₹999", url: "#/collections/under-999", collectionFilter: "Under ₹999" },
          { id: "l-sa-2", label: "Under ₹1,499", url: "#/collections/under-1499", collectionFilter: "Under ₹1,499" },
          { id: "l-sa-3", label: "Under ₹1,999", url: "#/collections/under-1999", collectionFilter: "Under ₹1,999" },
        ],
      },
      {
        id: "col-sale-cat",
        title: "BY CATEGORY",
        links: [
          { id: "l-sa-4", label: "T-Shirts Sale", url: "#/t-shirts", categoryFilter: "T-Shirts" },
          { id: "l-sa-5", label: "Accessories Sale", url: "#/caps" },
          { id: "l-sa-6", label: "Hampers & Gifting Privilege Deals", url: "#/hampers", categoryFilter: "Hampers & Gifting" },
        ],
      },
    ],
    featuredCard: {
      title: "ATELIER PRIVILEGE OFFERS",
      subtitle: "Up to 55% OFF select drops and luxury hamper bundles.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
      ctaText: "EXPLORE ATELIER SALE",
      ctaUrl: "#/collections/under-999",
    },
    ctaText: "EXPLORE ATELIER SALE",
    ctaUrl: "#/collections/under-999",
  },
];
