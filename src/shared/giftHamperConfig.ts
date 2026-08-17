export interface HamperItemConfig {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  customizable: boolean;
  fields?: {
    key: string;
    label: string;
    type: 'text' | 'select' | 'textarea';
    options?: string[];
    required?: boolean;
    placeholder?: string;
  }[];
}

export interface GiftHamperData {
  productId: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  originalValue: number;
  discountPrice?: number;
  stock: number;
  mainImage: string;
  galleryImages: string[];
  shortDescription: string;
  fullDescription: string;
  deliveryDaysEst: number;
  codAvailable: boolean;
  items: HamperItemConfig[];
}

export const CENTRALIZED_HAMPER_ITEMS: HamperItemConfig[] = [
  {
    id: "item-tshirt",
    name: "Customized Printed T-Shirt",
    shortDescription: "100% organic combed cotton tee customized with high-density print and tailored size.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "tshirtSize", label: "T-Shirt Size", type: "select", options: ["S", "M", "L", "XL", "XXL"], required: true },
      { key: "tshirtText", label: "Custom Name / Text on T-Shirt", type: "text", placeholder: "e.g. ADITYA / BLACKFAWN ATELIER", required: false },
      { key: "tshirtColor", label: "T-Shirt Color", type: "select", options: ["Jet Black", "Ivory White", "Navy Blue", "Heather Grey"], required: false },
      { key: "tshirtDesign", label: "Print Design Style", type: "select", options: ["Minimalist Monogram", "Signature Crown", "Vintage Text", "Bold Statement"], required: false }
    ]
  },
  {
    id: "item-mug",
    name: "Customized Printed Mug",
    shortDescription: "Premium ceramic coffee mug with high-gloss finish and custom printed text/artwork.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "mugText", label: "Custom Text / Name on Mug", type: "text", placeholder: "e.g. Best Wishes / Morning Brew", required: false },
      { key: "mugDesign", label: "Mug Print Motif", type: "select", options: ["Gold Foil Crest", "Contemporary Typography", "Monogram Badge"], required: false }
    ]
  },
  {
    id: "item-chocolates",
    name: "Handmade Chocolates",
    shortDescription: "Assorted artisanal Belgian dark and milk chocolate truffles handcrafted by master chocolatiers.",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=800",
    customizable: false
  },
  {
    id: "item-card",
    name: "Wish Card",
    shortDescription: "Gold foil embossed luxury greeting card with your bespoke personalized message.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "wishCardMessage", label: "Personalized Card Message", type: "textarea", placeholder: "Write your heartfelt message here...", required: false }
    ]
  },
  {
    id: "item-candle",
    name: "Aroma Candle",
    shortDescription: "Hand-poured aromatic French vanilla & cedarwood soy wax candle in a frosted jar.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
    customizable: false
  },
  {
    id: "item-bottle",
    name: "Customized Premium Metal Water Bottle",
    shortDescription: "Double-walled vacuum insulated matte black stainless steel bottle with laser engraving.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "bottleName", label: "Engraved Name / Text on Bottle", type: "text", placeholder: "e.g. ADITYA", required: false },
      { key: "bottleColor", label: "Bottle Finish", type: "select", options: ["Matte Black", "Brushed Steel", "Champagne Gold"], required: false },
      { key: "bottleDesign", label: "Engraving Style", type: "select", options: ["Vertical Serif", "Horizontal Monogram", "Crest Emblem"], required: false }
    ]
  },
  {
    id: "item-nametag",
    name: "Name Tag / Badge",
    shortDescription: "Solid metallic luxury name tag precision laser-etched with custom title.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "nameTagText", label: "Name / Text on Badge", type: "text", placeholder: "e.g. ADITYA P.", required: false }
    ]
  },
  {
    id: "item-keychain",
    name: "Customized Keychain",
    shortDescription: "Genuine leather & brushed champagne gold metallic keychain customized with initials or name.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "keychainText", label: "Text / Initial on Keychain", type: "text", placeholder: "e.g. A.P. / BLACKFAWN", required: false }
    ]
  },
  {
    id: "item-magnet",
    name: "Customized Fridge Magnet",
    shortDescription: "High-gloss acrylic fridge magnet customized with custom print artwork and text.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "magnetText", label: "Text / Quote on Magnet", type: "text", placeholder: "e.g. Good Vibes Only", required: false },
      { key: "magnetDesign", label: "Magnet Design Theme", type: "select", options: ["Typography Slate", "Abstract Gold Line", "Geometric Floral"], required: false }
    ]
  },
  {
    id: "item-pillow",
    name: "Customized Pillow",
    shortDescription: "Plush velvet cushion pillow customized with embroidered or printed name and motif.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "pillowText", label: "Name / Message on Pillow", type: "text", placeholder: "e.g. Cozy Vibes / Aditya", required: false },
      { key: "pillowDesign", label: "Pillow Artwork Style", type: "select", options: ["Embroidered Initial", "Minimalist Crest", "Satin Stripe"], required: false }
    ]
  },
  {
    id: "item-towel",
    name: "Customized Towel",
    shortDescription: "100% Egyptian plush cotton bath towel featuring custom monogram embroidery.",
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "towelText", label: "Name / Monogram on Towel", type: "text", placeholder: "e.g. A.P.", required: false },
      { key: "towelDesign", label: "Embroidery Thread Color", type: "select", options: ["Champagne Gold", "Classic White", "Charcoal Black"], required: false }
    ]
  },
  {
    id: "item-napkin",
    name: "Customized Hand Napkin",
    shortDescription: "Pure linen soft pocket hand napkin featuring delicate custom monogram stitching.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "napkinText", label: "Name / Text on Hand Napkin", type: "text", placeholder: "e.g. Aditya", required: false },
      { key: "napkinDesign", label: "Stitching Style", type: "select", options: ["Classic Serif Monogram", "Minimal Dot Motif", "Gold Edge Hem"], required: false }
    ]
  },
  {
    id: "item-cap",
    name: "Customized Cap",
    shortDescription: "Structured 6-panel cotton baseball cap with high-density custom embroidery.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
    customizable: true,
    fields: [
      { key: "capText", label: "Text / Logo on Cap", type: "text", placeholder: "e.g. BLACKFAWN / ADITYA", required: false },
      { key: "capDesign", label: "Cap Color & Style", type: "select", options: ["Matte Black / Gold Thread", "Off-White / Black Thread", "Navy / White Thread"], required: false }
    ]
  },
  {
    id: "item-cookies",
    name: "Handmade Cookies",
    shortDescription: "Freshly baked butter chocolate-chip cookies packaged in a sealed luxury tin.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800",
    customizable: false
  }
];

export const BLACKFAWN_GIFT_HAMPER_CONFIG: GiftHamperData = {
  productId: "hamp-custom-gift-hamper",
  name: "BLACKFAWN Custom Gift Hamper",
  category: "Hampers & Gifting",
  collection: "Premium Gift Hampers",
  price: 3999,
  originalValue: 8999,
  discountPrice: 3999,
  stock: 50,
  mainImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000",
  galleryImages: [
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=1000"
  ],
  shortDescription: "The ultimate bespoke gifting experience. An ultra-exclusive 14-piece luxury hamper featuring personalized printed apparel, metal drinkware, desk accessories, and artisanal gourmet treats.",
  fullDescription: `<p>Elevate personal and corporate celebrations with the signature <strong>BLACKFAWN Custom Gift Hamper</strong>. Encased in an architectural matte black velvet chest with champagne gold satin lining, this 14-piece set combines bespoke personal accessories with handcrafted delicacies.</p><h3>Why Choose the BLACKFAWN Atelier Hamper?</h3><ul><li><strong>14 Signature Items:</strong> Customized T-Shirt, Mug, Water Bottle, Pillow, Cap, Towel, Hand Napkin, Keychain, Magnet, Badge, Wish Card, Candle, Handmade Chocolates & Cookies.</li><li><strong>Bespoke Customization:</strong> Personalize text, names, sizes, and design options step-by-step.</li><li><strong>Luxury Packaging:</strong> Delivered in a gold-embossed matte black wooden gift trunk.</li></ul>`,
  deliveryDaysEst: 3,
  codAvailable: true,
  items: CENTRALIZED_HAMPER_ITEMS
};
