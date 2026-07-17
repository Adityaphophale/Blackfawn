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

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string; // oversized, t-shirts, shirts, hoodies, cargo pants, joggers, sneakers, accessories
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  fit: string; // Oversized, Relaxed, Regular, Slim
  sleeve?: string; // Short Sleeve, Long Sleeve, Sleeveless
  material: string; // 100% Terry Cotton, French Terry, Heavyweight Fleece, Cotton Twill, etc.
  pattern: string; // Graphic, Solid, Acid Wash, Tie-Dye, Distress
  gender: 'unisex' | 'men' | 'women';
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimited?: boolean;
  isOversized?: boolean;
  stock: number;
  features: string[];
  sizeChart: { size: string; chest: number; length: number; shoulder: number }[];
  codAvailable: boolean;
  deliveryDaysEst: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  points: number; // loyalty points
  addresses: Address[];
  couponsUsed: string[];
  role: 'user' | 'admin';
  createdAt: string;
}

export interface CartItem {
  id: string; // cart item unique id (product_size_color)
  productId: string;
  product: Product;
  size: string;
  color: string;
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
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  description: string;
  expiresAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: string;
  suggestedProducts?: string[]; // IDs of products suggested by AI
}
