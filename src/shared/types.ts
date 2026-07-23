export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  salePrice?: number;
  stock: number;
  reservedStock: number;
  availableStock: number;
  weight?: number; // in grams
  dimensions?: string; // e.g. "10x10x2 cm"
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string; // HTML Rich Text description
  category: string;
  collection?: string;
  brand: string;
  baseSku: string;
  barcode?: string;
  material: string;
  fabric: string;
  fit: string;
  gender: 'unisex' | 'men' | 'women';
  season?: string;
  countryOfOrigin?: string;
  gstRate: number; // e.g. 5, 12, 18
  tags: string[];
  seo: SEOConfig;
  status: 'active' | 'draft' | 'archived';
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimited?: boolean;
  images: string[]; // fallback list of main product images
  video?: string;
  threeSixtyImages?: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  codAvailable: boolean;
  deliveryDaysEst: number;
  price: number; // Base retail price fallback
  discountPrice?: number; // Base discount price fallback
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  points: number;
  addresses: Address[];
  couponsUsed: string[];
  role: 'user' | 'admin' | 'staff';
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color: string;
  variantId?: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  couponCode?: string;
  discount: number;
  subtotal: number;
  shippingFee: number;
  gstAmount: number;
  total: number;
  paymentMethod: 'cod' | 'stripe' | 'upi' | 'razorpay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'returned' | 'exchange_requested' | 'exchanged';
  trackingNumber?: string;
  trackingStatus?: string;
  createdAt: string;
  updatedAt: string;
  gstInvoiceRequested?: boolean;
  gstNumber?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  reply?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  description: string;
  expiresAt: string;
  usageCount: number;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  items: { sku: string; reason: string; qty: number }[];
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  type: 'return' | 'exchange';
  createdAt: string;
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  initialBalance: number;
  expiryDate: string;
  isActive: boolean;
}
