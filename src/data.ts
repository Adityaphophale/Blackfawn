import { Product, Blog, Coupon, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'fawn-01-tee',
    name: "FAWN-01 Heavyweight Oversized Tee",
    description: "Our signature oversized silhouette crafted from 240 GSM heavy luxury Terry Cotton. Engineered for the ultimate slouchy drop-shoulder aesthetic. Features a subtle high-density rubber print branding on the front chest and an industrial minimalist graphic on the back. Double-needle stitch detailed collar that retains shape after endless washes.",
    category: "Oversized",
    price: 1899,
    discountPrice: 1499,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=1000"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Charcoal Black", hex: "#1A1A1A" },
      { name: "Vintage Asphalt", hex: "#3A3A3A" },
      { name: "Sanded Olive", hex: "#4A5D4E" }
    ],
    fit: "Oversized",
    sleeve: "Short Sleeve",
    material: "100% French Terry Cotton (240 GSM)",
    pattern: "Solid & Front-Back Screenprint",
    gender: "unisex",
    rating: 4.8,
    reviewCount: 142,
    isBestSeller: true,
    isNewArrival: true,
    isOversized: true,
    stock: 45,
    features: [
      "240 GSM Ultra-Heavyweight Terry Cotton",
      "Slightly longer sleeves and dropped shoulder lines",
      "Breathable, high-density knit structure",
      "High-density front chest rubber print",
      "Pre-shrunk to prevent shrinkage after home washing"
    ],
    sizeChart: [
      { size: "S", chest: 44, length: 28, shoulder: 20 },
      { size: "M", chest: 46, length: 29, shoulder: 21 },
      { size: "L", chest: 48, length: 30, shoulder: 22 },
      { size: "XL", chest: 50, length: 31, shoulder: 23 },
      { size: "XXL", chest: 52, length: 32, shoulder: 24 }
    ],
    codAvailable: true,
    deliveryDaysEst: 3
  },
  {
    id: 'graffiti-ghost-tee',
    name: "GRAFFITI GHOST Heavyweight Graphic Tee",
    description: "An authentic street-art piece for your wardrobe. Crafted with 240 GSM premium carded cotton, featuring a full-bleed distressed graffiti mural back print and a clean tag print on the left sleeve. Designed to fade beautifully over time to provide a truly vintage, raw-edge aesthetic.",
    category: "T-Shirts",
    price: 1699,
    discountPrice: 1299,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Chalk White", hex: "#F3F4F6" },
      { name: "Pitch Black", hex: "#080808" }
    ],
    fit: "Oversized",
    sleeve: "Short Sleeve",
    material: "100% Luxury Carded Cotton (240 GSM)",
    pattern: "Streetwear Graffiti Graphic",
    gender: "unisex",
    rating: 4.7,
    reviewCount: 98,
    isNewArrival: true,
    isOversized: true,
    stock: 28,
    features: [
      "Premium soft-feel plastisol graphic print",
      "Relaxed ribbed crewneck collar",
      "Oversized street-drape",
      "Breathable, heavy-knit, fade-resistant fabric"
    ],
    sizeChart: [
      { size: "S", chest: 44, length: 28, shoulder: 20 },
      { size: "M", chest: 46, length: 29, shoulder: 21 },
      { size: "L", chest: 48, length: 30, shoulder: 22 },
      { size: "XL", chest: 50, length: 31, shoulder: 23 }
    ],
    codAvailable: true,
    deliveryDaysEst: 4
  },
  {
    id: 'nightwalker-cargos',
    name: "NIGHTWALKER Technical Cargo Pants",
    description: "Master the concrete jungle with our highly functional tactical cargos. Engineered from water-resistant micro-ripstop twill. Designed with multiple modular zipper utility pockets, heavy-duty utility strap adjusters, adjustable ankle toggles for a custom tapered or wide-leg fit, and customized d-ring hardware.",
    category: "Cargo Pants",
    price: 3499,
    discountPrice: 2899,
    images: [
      "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1000"
    ],
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "Stealth Black", hex: "#121212" },
      { name: "Tactical Khaki", hex: "#8B8580" },
      { name: "Sage Olive", hex: "#5C6B5E" }
    ],
    fit: "Relaxed",
    material: "Water-Resistant Cotton Elastane Ripstop Twill",
    pattern: "Solid Tactical Utility",
    gender: "men",
    rating: 4.9,
    reviewCount: 210,
    isBestSeller: true,
    stock: 15,
    features: [
      "Water and stain resistant finish",
      "6-pocket layout with premium zip enclosures",
      "Ankle drawcords for taper or straight-leg switching",
      "Custom gunmetal finished buckles and loops",
      "Comfort elastic stretch waistband with utility drawcord"
    ],
    sizeChart: [
      { size: "30", chest: 30, length: 39, shoulder: 0 },
      { size: "32", chest: 32, length: 40, shoulder: 0 },
      { size: "34", chest: 34, length: 41, shoulder: 0 },
      { size: "36", chest: 36, length: 42, shoulder: 0 }
    ],
    codAvailable: true,
    deliveryDaysEst: 3
  },
  {
    id: 'acid-soul-hoodie',
    name: "ACID SOUL Heavyweight Acid Wash Hoodie",
    description: "A masterclass in warmth and style. Formed from 400 GSM heavyweight brushed French Terry. The custom enzyme acid wash gives each hoodie an entirely unique wash pattern, raw vintage character, and ultra-soft handle. Features a double-lined hardware-free hoodie for a clean drape, extra-thick cuffs, and a kangaroo pouch pocket.",
    category: "Hoodies",
    price: 3999,
    discountPrice: 3299,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Acid Charcoal", hex: "#303036" },
      { name: "Acid Concrete", hex: "#61616B" },
      { name: "Acid Burgundy", hex: "#4A2B31" }
    ],
    fit: "Oversized",
    sleeve: "Long Sleeve",
    material: "85% Cotton, 15% Polyester Heavyweight Fleece (400 GSM)",
    pattern: "Enzyme Acid Wash",
    gender: "unisex",
    rating: 4.9,
    reviewCount: 165,
    isBestSeller: true,
    isNewArrival: true,
    isOversized: true,
    stock: 22,
    features: [
      "400 GSM heavy-knit thermal trap fleece",
      "Double-layered slouchy hood without drawstrings",
      "Heavy 2x2 elastane rib-knit cuffs and waist",
      "Seamless drop shoulder panels",
      "Special custom garment-dye wash"
    ],
    sizeChart: [
      { size: "S", chest: 46, length: 26, shoulder: 22 },
      { size: "M", chest: 48, length: 27, shoulder: 23 },
      { size: "L", chest: 50, length: 28, shoulder: 24 },
      { size: "XL", chest: 52, length: 29, shoulder: 25 },
      { size: "XXL", chest: 54, length: 30, shoulder: 26 }
    ],
    codAvailable: true,
    deliveryDaysEst: 4
  },
  {
    id: 'cyberpunk-joggers',
    name: "CYBERPUNK Street Utility Joggers",
    description: "High-comfort utility loungewear designed for active movement. Crafted from durable cotton-blend knit, styled with high-contrast reflective 3M webbing panels on the side seams, zipper side pockets, and durable elastic ankles.",
    category: "Joggers",
    price: 2499,
    discountPrice: 1999,
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=1000"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Matte Black", hex: "#111111" },
      { name: "Shadow Grey", hex: "#4A4A4A" }
    ],
    fit: "Regular Tapered",
    material: "75% Cotton, 25% Poly Technical Scuba Knit",
    pattern: "Reflective Accented Solid",
    gender: "unisex",
    rating: 4.6,
    reviewCount: 74,
    stock: 50,
    features: [
      "Water-repellent technical fleece lining",
      "Reflective 3M graphics",
      "Secure YKK zipper side pockets",
      "Ankle ribbed cuffs"
    ],
    sizeChart: [
      { size: "S", chest: 30, length: 38, shoulder: 0 },
      { size: "M", chest: 32, length: 39, shoulder: 0 },
      { size: "L", chest: 34, length: 40, shoulder: 0 },
      { size: "XL", chest: 36, length: 41, shoulder: 0 }
    ],
    codAvailable: true,
    deliveryDaysEst: 3
  },
  {
    id: 'stealth-x-sneakers',
    name: "STEALTH-X Tactical Chunky Sneakers",
    description: "The ultimate streetwear footwear designed to elevate any outfit. Formed with a multi-layered panel design utilizing water-repellent ballistic mesh, raw suede overlays, and a futuristic TPU neon-green skeletal heel stabilizer. Outfitted with high-rebound chunky EVA midsoles and deep-track rubber outer grips.",
    category: "Sneakers",
    price: 5999,
    discountPrice: 4899,
    images: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000"
    ],
    sizes: ["7", "8", "9", "10", "11"],
    colors: [
      { name: "Volt Black", hex: "#000000" },
      { name: "Ghost Grey", hex: "#CCCCCC" }
    ],
    fit: "Regular",
    material: "Premium Suede & Cordura Mesh Upper",
    pattern: "Panel Block Techwear",
    gender: "unisex",
    rating: 4.9,
    reviewCount: 320,
    isBestSeller: true,
    isLimited: true,
    stock: 8,
    features: [
      "Cordura® brand high-strength nylon mesh",
      "Futuristic high-traction thick platform sole",
      "Skeletal TPU outer heel counter",
      "Super soft memory-foam ortholite inserts"
    ],
    sizeChart: [
      { size: "7", chest: 7, length: 25.5, shoulder: 0 },
      { size: "8", chest: 8, length: 26.4, shoulder: 0 },
      { size: "9", chest: 9, length: 27.2, shoulder: 0 },
      { size: "10", chest: 10, length: 28.1, shoulder: 0 },
      { size: "11", chest: 11, length: 29, shoulder: 0 }
    ],
    codAvailable: false,
    deliveryDaysEst: 5
  },
  {
    id: 'vandal-sweater',
    name: "VANDAL Distressed Oversized Knit",
    description: "A dark-grunge statement knitted sweater. Intricately woven with ultra-soft organic cotton yarn featuring hand-finished distressed fraying along the hem, crewneck collar, and sleeve cuffs. Featuring alternating bold charcoal and black horizontal stripes.",
    category: "Hoodies",
    price: 3299,
    discountPrice: 2499,
    images: [
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=1000"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Vandal Stripes", hex: "#222222" }
    ],
    fit: "Oversized",
    sleeve: "Long Sleeve",
    material: "100% Organic Soft-Spun Cotton Knit",
    pattern: "Striped Distressed",
    gender: "unisex",
    rating: 4.5,
    reviewCount: 41,
    isNewArrival: true,
    isOversized: true,
    stock: 12,
    features: [
      "Luxury chunky hand-knit breathable construction",
      "Aesthetic distress rips and runs along border hems",
      "Ultra-soft feel, non-scratchy wool alternative",
      "Drapes beautifully off the shoulders"
    ],
    sizeChart: [
      { size: "S", chest: 46, length: 27, shoulder: 22 },
      { size: "M", chest: 48, length: 28, shoulder: 23 },
      { size: "L", chest: 50, length: 29, shoulder: 24 },
      { size: "XL", chest: 52, length: 30, shoulder: 25 }
    ],
    codAvailable: true,
    deliveryDaysEst: 4
  },
  {
    id: 'fawn-beanie',
    name: "BLACKFAWN Signature Metal Beanie",
    description: "Complete your tactical fit. Woven in dual-layer dense waffle knit for cold-shielding comfort. Featuring an polished gunmetal engraved logo plate riveted directly on the wide cuff border. Designed to snug securely and maintain elastic memory indefinitely.",
    category: "Accessories",
    price: 999,
    discountPrice: 699,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=1000"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Onyx Black", hex: "#0F0F0F" },
      { name: "Urban Steel", hex: "#606060" }
    ],
    fit: "Snug",
    material: "100% Recycled Anti-Pilling Acrylic Yarn",
    pattern: "Dense Ribbed Waffle Knit",
    gender: "unisex",
    rating: 4.7,
    reviewCount: 88,
    isBestSeller: true,
    stock: 80,
    features: [
      "Snug dual-layered heat lock ribbed weave",
      "Riveted gunmetal zinc-alloy custom badge",
      "Extremely breathable, itch-free synthetic wool blend",
      "Universal custom fit"
    ],
    sizeChart: [
      { size: "One Size", chest: 0, length: 0, shoulder: 0 }
    ],
    codAvailable: true,
    deliveryDaysEst: 3
  }
];

export const BLOGS: Blog[] = [
  {
    id: 'streetwear-trends-2026',
    title: "Streetwear Rebellion: Oversized Layering Guide for 2026",
    slug: "streetwear-rebellion-oversized-layering",
    excerpt: "Break the rules of visual balance. Layering is no longer about shielding from cold; it's about building texture and depth. Read our signature playbook on how to style 400 GSM hoodies with distressed raw knitwear.",
    content: `
Streetwear has always been a reflection of rebellious youth culture. In 2026, we are witnessing a paradigm shift from simple minimalism to heavy-knit textured maximalism. The focus is no longer just on oversized graphic prints, but on tactile material contrast.

### Rule 1: The Weight Hierarchy
Always layer from thinnest to thickest GSM (grams per square meter). Start with a relaxed 200 GSM core slub tee, add a 280 GSM waffle thermal layer, and top with an ultra-rigid 400 GSM drop-shoulder acid-wash hoodie. The bottom edge of your core tee should peek out 1.5 inches to break the dark block of color.

### Rule 2: Coordinate Fabrics, Distort Fits
Do not pair standard track pants with premium heavyweight knitwear. Pair heavy knits with utility cargos or water-repellent ripstop fabrics. The juxtaposition of luxury organic cotton knitwear and technical tactical materials creates a high-contrast industrial aesthetic that screams streetwear luxury.

### Rule 3: The Footwear Anchor
An oversized silhouette creates visual bulk on top. To prevent looking top-heavy, you must anchor your fit with chunky platform or track sneakers like the Stealth-X. This creates a grounded, athletic shape that balances the slouchy, relaxed drape of oversized cargos.
    `,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000",
    author: "Fawn Editorial Team",
    date: "July 12, 2026",
    readTime: "4 min read",
    tags: ["Streetwear", "Styling Guide", "Oversized"]
  },
  {
    id: 'heavyweight-cotton-secrets',
    title: "Why 240 GSM French Terry is the Luxury Standard",
    slug: "why-heavyweight-french-terry-is-luxury",
    excerpt: "Is higher GSM always better? We break down the engineering of loopback Terry Cotton knit structures and how they achieve that premium, gravity-defying shoulder drop.",
    content: `
Many fast-fashion brands advertise "heavyweight" apparel, but often deliver stiff, scratchy shirts that choke your neckline and lose shape instantly. At BLACKFAWN, our fabric is engineered from the ground up to define luxury. Here's why our 240 GSM cotton is different.

### What is GSM anyway?
GSM stands for Grams per Square Meter. It measures the density of the fabric knit. Most standard retail t-shirts range between 120 and 160 GSM, meaning they are thin, translucent, and lay flat against your body structure. A 240 GSM knit is heavy, fully opaque, and holds its own structural silhouette, falling away from your skin to form clean geometric lines.

### The Magic of French Terry
Unlike standard single-jersey weave, French Terry has a unique loopback structure on the interior side. This loopback knit creates tiny pockets of air that insulate, while maintaining excellent breathability. It absorbs moisture cleanly and provides an incredibly soft touch against the skin, unlike scratchy raw cotton.

### Shaping the Silhouette
A true drop-shoulder oversized shirt should drape by gravity. By combining combed long-staple cotton threads with a relaxed double-weave rib, our t-shirts feature a structured heavy shoulder-line that cascades naturally, creating a sleek architectural shape that slims the waist and expands the chest line visually.
    `,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000",
    author: "Vikram Sen, Lead Textile Engineer",
    date: "June 28, 2026",
    readTime: "5 min read",
    tags: ["Fabric Tech", "Sustainability", "Behind the Brand"]
  }
];

export const COUPONS: Coupon[] = [
  {
    code: "BLACKFAWN10",
    type: "percentage",
    value: 10,
    minPurchase: 1499,
    description: "10% off on all streetwear orders above ₹1,499",
    expiresAt: "2026-12-31"
  },
  {
    code: "STREETVIBES500",
    type: "fixed",
    value: 500,
    minPurchase: 3999,
    description: "Flat ₹500 off on premium shopping cart value above ₹3,999",
    expiresAt: "2026-10-15"
  },
  {
    code: "LAUNCHVIP",
    type: "percentage",
    value: 15,
    minPurchase: 0,
    description: "Launch exclusive: 15% discount with no minimum purchase requirement",
    expiresAt: "2026-08-31"
  }
];

export const FAQS = [
  {
    id: 'faq-1',
    category: "Sizing & Fit",
    question: "How do I choose the correct size for Oversized items?",
    answer: "Our oversized products are engineered with dropped shoulders and a slouchy drape, meaning they are already designed to fit loose and relaxed. We recommend buying your standard, normal size to achieve the intended designer streetwear silhouette. If you prefer a regular, more standard fit, go one size down."
  },
  {
    id: 'faq-2',
    category: "Sizing & Fit",
    question: "Do you provide a custom size calculator?",
    answer: "Yes! Every product page contains an extensive size chart mapping chest circumference, length, and shoulder drop in inches. If you are unsure, you can open our interactive FAWN-AI virtual assistant who can calculate your perfect fit dynamically based on your height and weight."
  },
  {
    id: 'faq-3',
    category: "Shipping & Delivery",
    question: "What is your delivery timeline in India?",
    answer: "We offer Free Express Shipping on all orders above ₹999. Orders are shipped from our Delhi hub. Metropolitan cities receive deliveries in 2-3 working days. Rest of India takes 4-5 working days. Rural and Northeast regions may take up to 6-7 business days."
  },
  {
    id: 'faq-4',
    category: "Returns & Exchanges",
    question: "What is your return and exchange policy?",
    answer: "We have an absolute no-questions-asked 7-day return and exchange policy. Items must be unworn, unwashed, and have the original security hangtags attached. You can submit returns or exchanges instantly via your Account Dashboard. A courier will be dispatched to your address within 24 hours for reverse pickup at no extra charge."
  },
  {
    id: 'faq-5',
    category: "Payments & Safety",
    question: "Do you support Cash on Delivery (COD)?",
    answer: "Yes, we support Cash on Delivery across 18,000+ pin codes in India for orders up to ₹9,999. There is no additional COD collection fee on orders. We also support standard credit cards, Google Pay, UPI, and net banking."
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'fawn-01-tee',
    userName: "Aarav Sharma",
    userEmail: "aarav.sharma@gmail.com",
    rating: 5,
    comment: "This is easily the highest quality oversized tee I have ever bought in India. The 240 GSM feels premium and sits perfectly without feeling suffocatingly hot. The charcoal color has that perfect acid vintage finish.",
    date: "July 10, 2026",
    verified: true,
    helpfulCount: 24,
    reply: "Appreciate the massive support, Aarav! We spent 6 months perfecting the Charcoal wash texture. Stay tuned for drop 2!"
  },
  {
    id: 'r2',
    productId: 'fawn-01-tee',
    userName: "Priya Patel",
    userEmail: "priya.patel@outlook.com",
    rating: 5,
    comment: "Absolutely obsessed with the drape! Dropped shoulders sit exactly where they should. Washed it twice already, no shrinkage or color bleed. 10/10 worth every rupee.",
    date: "July 05, 2026",
    verified: true,
    helpfulCount: 15
  },
  {
    id: 'r3',
    productId: 'nightwalker-cargos',
    userName: "Rohan Das",
    userEmail: "rohan.das@rediffmail.com",
    rating: 5,
    comment: "Cargos are outstanding. The ripstop fabric actually repels water, tried it during Delhi rains. Strap adjusters are very high quality, not cheap plastic. Sizing is true to size.",
    date: "June 25, 2026",
    verified: true,
    helpfulCount: 38,
    reply: "Thanks for testing the ripstop twill, Rohan! Built to withstand active weather while retaining that tactical techwear drip."
  }
];
