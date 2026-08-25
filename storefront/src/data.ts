import { Product, Blog, Coupon, Review } from '../../shared/types/types.ts';

export const PRODUCTS: Product[] = [];

export const BLOGS: Blog[] = [
  {
    id: 'printed-apparel-guide',
    title: "The Art of Printed Apparel Care",
    slug: "art-of-printed-apparel-care",
    excerpt: "Learn how to preserve high-density rubber prints and screen prints on your premium garments.",
    content: `
Printed garments are the core of modern street culture. To ensure your custom graphic prints remain crisp and resist cracking over time, follow our textile care guide.

### Wash Cold, Wash Inside Out
Always flip your printed garments inside out before placing them in the washing machine. This protects the printed graphics from friction against other clothes. Use cold water (under 30°C) on a gentle cycle.

### Air Dry Only
Never place printed items in a hot tumble dryer. The heat breaks down print adhesive and leads to peeling. Hang dry in shade.
    `,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000",
    author: "Fawn Textile Team",
    date: "July 12, 2026",
    readTime: "3 min read",
    tags: ["Printed Apparel", "Care Guide", "Textiles"]
  }
];

export const COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "BLACKFAWN10",
    type: "percentage",
    value: 10,
    minPurchase: 1499,
    description: "10% off on all printed apparel orders above ₹1,499",
    expiresAt: "2026-12-31",
    usageCount: 0
  }
];

export const FAQS = [
  {
    id: 'faq-1',
    category: "Care & Laundry",
    question: "How do I choose the correct size for custom products?",
    answer: "Every product page contains a detailed chart showing measurements in inches. Check the size chart before ordering."
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'round-neck-men',
    userName: "Aarav Sharma",
    userEmail: "aarav.sharma@gmail.com",
    rating: 5,
    comment: "This is easily the highest quality printed round neck tee I have ever bought in India. The print finish is premium and sits perfectly. High quality organic cotton weave.",
    date: "July 10, 2026",
    verified: true,
    helpfulCount: 24,
    reply: "Appreciate the support, Aarav! Stay tuned for more drops!"
  }
];
