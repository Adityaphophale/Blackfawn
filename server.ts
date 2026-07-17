import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

const SECRET_KEY = "blackfawn_secret_key_2026";

function generateToken(userId: string, role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(JSON.stringify({
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
  })).toString("base64");
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const [headerB64, payloadB64, signature] = token.split(".");
    if (!headerB64 || !payloadB64 || !signature) return null;
    
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(`${headerB64}.${payloadB64}`).digest("base64url");
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { userId: payload.userId, role: payload.role };
  } catch (err) {
    return null;
  }
}

function authMiddleware(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. Token missing." });
    return;
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: "Access denied. Invalid token." });
    return;
  }
  (req as any).userId = decoded.userId;
  (req as any).userRole = decoded.role;
  next();
}

function adminMiddleware(req: Request, res: Response, next: () => void) {
  authMiddleware(req, res, () => {
    if ((req as any).userRole !== "admin") {
      res.status(403).json({ error: "Access denied. Admin role required." });
      return;
    }
    next();
  });
}

// Types for DB
import { Order, User, Review, Product, Coupon, Address } from "./src/types";
import { PRODUCTS, BLOGS, COUPONS, FAQS, INITIAL_REVIEWS } from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';"
  );
  next();
});

// Initialize Gemini SDK lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } else {
      console.warn("GEMINI_API_KEY not configured or placeholder. AI features will fallback to deterministic rules.");
    }
  }
  return aiClient;
}

// Persistent JSON Store file path
const STORE_PATH = path.join(process.cwd(), "db_store.json");

// Structure of our DB store
interface DbStore {
  users: User[];
  orders: Order[];
  reviews: Review[];
  banners: { id: string; imageUrl: string; title: string; subtitle: string; link: string }[];
}

// Helper to load/save JSON database
function loadStore(): DbStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading JSON store:", err);
  }

  // Initial Seed
  const initialStore: DbStore = {
    users: [
      {
        id: "usr-guest-1",
        email: "aphophale@gmail.com",
        name: "Abhishek Phophale",
        phone: "+91 98765 43210",
        points: 450,
        addresses: [
          {
            id: "addr-1",
            type: "home",
            name: "Abhishek Phophale",
            addressLine1: "Flat 402, Building A, Sky Heights",
            addressLine2: "Senapati Bapat Road",
            city: "Pune",
            state: "Maharashtra",
            postalCode: "411016",
            phone: "+91 98765 43210",
            isDefault: true,
          },
        ],
        couponsUsed: [],
        role: "admin", // default as requested for testing admin and normal features
        createdAt: new Date().toISOString(),
      },
    ],
    orders: [
      {
        id: "BF-82931-IN",
        userId: "usr-guest-1",
        customerName: "Abhishek Phophale",
        customerEmail: "aphophale@gmail.com",
        items: [
          {
            productId: "fawn-01-tee",
            productName: "FAWN-01 Heavyweight Oversized Tee",
            productImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
            size: "L",
            color: "Charcoal Black",
            price: 1499,
            quantity: 1,
          },
          {
            productId: "fawn-beanie",
            productName: "BLACKFAWN Signature Metal Beanie",
            productImage: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=1000",
            size: "One Size",
            color: "Onyx Black",
            price: 699,
            quantity: 1,
          },
        ],
        shippingAddress: {
          id: "addr-1",
          type: "home",
          name: "Abhishek Phophale",
          addressLine1: "Flat 402, Building A, Sky Heights",
          addressLine2: "Senapati Bapat Road",
          city: "Pune",
          state: "Maharashtra",
          postalCode: "411016",
          phone: "+91 98765 43210",
          isDefault: true,
        },
        discount: 0,
        subtotal: 2198,
        shippingFee: 0,
        gstAmount: 110, // 5% GST included
        total: 2198,
        paymentMethod: "stripe",
        paymentStatus: "paid",
        orderStatus: "delivered",
        trackingNumber: "IN-FAWN-772911",
        trackingStatus: "Delivered to Customer Gate",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        gstInvoiceRequested: true,
        gstNumber: "27AAAAA1111A1Z1",
      },
    ],
    reviews: INITIAL_REVIEWS,
    banners: [
      {
        id: "banner-1",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600",
        title: "ACT I: SHADOWS OF INDUS",
        subtitle: "A modern street tribute to structural minimalism and luxury drapery.",
        link: "Oversized",
      },
      {
        id: "banner-2",
        imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1600",
        title: "ACID REBELLION DROP",
        subtitle: "Experience heavy-knit enzyme washes, raw edges, and 400 GSM armor hoodies.",
        link: "Hoodies",
      },
      {
        id: "banner-3",
        imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1600",
        title: "TACTICAL CARGOS V2",
        subtitle: "Water-repellent ripstop weaves designed for active modular travel.",
        link: "Cargo Pants",
      },
    ],
  };

  saveStore(initialStore);
  return initialStore;
}

function saveStore(store: DbStore) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving JSON store:", err);
  }
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// 1. PRODUCTS ENDPOINTS
app.get("/api/products", (req: Request, res: Response) => {
  res.json(PRODUCTS);
});

app.get("/api/products/:id", (req: Request, res: Response) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

// 2. AUTH & PROFILE
app.post("/api/auth/login-otp", (req: Request, res: Response) => {
  const { phone, email } = req.body;
  const store = loadStore();

  let user = store.users.find((u) => (email && u.email.toLowerCase() === email.toLowerCase()) || (phone && u.phone === phone));

  if (!user) {
    // Create new user automatically
    user = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      email: email || "customer@blackfawn.in",
      name: email ? email.split("@")[0] : "Streetwear Enthusiast",
      phone: phone || "",
      points: 100, // Welcome loyalty points
      addresses: [],
      couponsUsed: [],
      role: "user",
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    saveStore(store);
  }

  res.json({ message: "OTP login successful", user, token: generateToken(user.id, user.role) });
});

// Standard Login for App.tsx
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const store = loadStore();
  let user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // For demo/testing, create user on the fly
    user = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      email: email,
      name: email.split("@")[0],
      points: 100,
      addresses: [],
      couponsUsed: [],
      role: "user",
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    saveStore(store);
  }

  res.json({ success: true, user, token: generateToken(user.id, user.role) });
});

// Standard Register for App.tsx
app.post("/api/auth/register", (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const store = loadStore();
  let user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (user) {
    res.status(400).json({ success: false, error: "Email already registered." });
    return;
  }

  const newUser: User = {
    id: `usr-${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    points: 150, // bonus points
    addresses: [],
    couponsUsed: [],
    role: "user",
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);
  saveStore(store);
  res.json({ success: true, user: newUser, token: generateToken(newUser.id, newUser.role) });
});

app.post("/api/auth/profile", (req: Request, res: Response) => {
  const { userId, name, email, phone } = req.body;
  const store = loadStore();
  const userIndex = store.users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  store.users[userIndex] = {
    ...store.users[userIndex],
    name: name || store.users[userIndex].name,
    email: email || store.users[userIndex].email,
    phone: phone || store.users[userIndex].phone,
  };

  saveStore(store);
  res.json({ message: "Profile updated successfully", user: store.users[userIndex] });
});

// 3. ADDRESSES
app.post("/api/user/address", authMiddleware, (req: Request, res: Response) => {
  const { userId, address } = req.body;
  const store = loadStore();
  const user = store.users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ success: false, error: "User not found" });
    return;
  }

  const newAddress: Address = {
    id: `addr-${Math.random().toString(36).substr(2, 9)}`,
    type: address.type || "home",
    name: address.name || user.name,
    addressLine1: address.addressLine1 || "",
    addressLine2: address.addressLine2 || "",
    city: address.city || "",
    state: address.state || "",
    postalCode: address.postalCode || "",
    phone: address.phone || user.phone || "",
    isDefault: address.isDefault || false,
  };

  if (newAddress.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  } else if (user.addresses.length === 0) {
    newAddress.isDefault = true;
  }

  user.addresses.push(newAddress);
  saveStore(store);
  res.json({ success: true, user });
});

app.post("/api/user/address/remove", authMiddleware, (req: Request, res: Response) => {
  const { userId, addressId } = req.body;
  const store = loadStore();
  const user = store.users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ success: false, error: "User not found" });
    return;
  }

  user.addresses = user.addresses.filter((a) => a.id !== addressId);
  if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
    user.addresses[0].isDefault = true;
  }

  saveStore(store);
  res.json({ success: true, user });
});

app.post("/api/addresses", authMiddleware, (req: Request, res: Response) => {
  const { userId, address } = req.body;
  const store = loadStore();
  const user = store.users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const newAddress: Address = {
    id: `addr-${Math.random().toString(36).substr(2, 9)}`,
    ...address,
  };

  if (address.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  } else if (user.addresses.length === 0) {
    newAddress.isDefault = true;
  }

  user.addresses.push(newAddress);
  saveStore(store);
  res.json({ message: "Address added successfully", user });
});

app.delete("/api/addresses/:userId/:addressId", authMiddleware, (req: Request, res: Response) => {
  const { userId, addressId } = req.params;
  const store = loadStore();
  const user = store.users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  user.addresses = user.addresses.filter((a) => a.id !== addressId);
  saveStore(store);
  res.json({ message: "Address deleted", user });
});

// 4. REVIEWS
app.get("/api/reviews/:productId", (req: Request, res: Response) => {
  const store = loadStore();
  const productReviews = store.reviews.filter((r) => r.productId === req.params.productId);
  res.json(productReviews);
});

app.post("/api/reviews", (req: Request, res: Response) => {
  const { productId, userName, userEmail, rating, comment } = req.body;
  const store = loadStore();

  const newReview: Review = {
    id: `rev-${Math.random().toString(36).substr(2, 9)}`,
    productId,
    userName,
    userEmail,
    rating: Number(rating),
    comment,
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    verified: true,
    helpfulCount: 0,
  };

  store.reviews.unshift(newReview);
  saveStore(store);
  res.json({ message: "Review posted successfully", review: newReview });
});

// 5. COUPONS
app.get("/api/coupons", (req: Request, res: Response) => {
  res.json(COUPONS);
});

app.post("/api/coupons/validate", (req: Request, res: Response) => {
  const { code, cartValue } = req.body;
  const coupon = COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    res.json({ success: false, error: "Invalid coupon code." });
    return;
  }

  if (cartValue < coupon.minPurchase) {
    res.json({ success: false, error: `Minimum order value for this coupon is ₹${coupon.minPurchase}` });
    return;
  }

  res.json({ success: true, coupon });
});

// 6. ORDERS
app.get("/api/orders/user/:userId", (req: Request, res: Response) => {
  const store = loadStore();
  const userOrders = store.orders.filter((o) => o.userId === req.params.userId);
  res.json(userOrders);
});

app.post("/api/orders", authMiddleware, (req: Request, res: Response) => {
  const { order } = req.body;
  const store = loadStore();

  const newOrder: Order = {
    ...order,
    id: `BF-${Math.floor(10000 + Math.random() * 90000)}-IN`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trackingNumber: `IN-FAWN-${Math.floor(100000 + Math.random() * 900000)}`,
    trackingStatus: "Order Placed. Readying in warehouse.",
  };

  store.orders.unshift(newOrder);

  // Deduct/Add loyalty points (1 point per ₹10 spent)
  const user = store.users.find((u) => u.id === order.userId);
  if (user) {
    user.points = Math.round(user.points + order.total / 10);
    if (order.couponCode) {
      user.couponsUsed.push(order.couponCode);
    }
  }

  saveStore(store);
  res.json({ message: "Order placed successfully", order: newOrder });
});

// 7. ORDER MUTATIONS (RETURNS & EXCHANGES)
app.post("/api/orders/request-action", (req: Request, res: Response) => {
  const { orderId, action, reason, details } = req.body; // action: 'return' or 'exchange'
  const store = loadStore();
  const order = store.orders.find((o) => o.id === orderId);

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (action === "return") {
    order.orderStatus = "return_requested";
    order.trackingStatus = `Return request placed: "${reason}". Reverse pickup courier dispatched.`;
  } else if (action === "exchange") {
    order.orderStatus = "exchange_requested";
    order.trackingStatus = `Exchange request placed for size "${details.newSize}": "${reason}". Reverse pickup courier dispatched.`;
  }

  order.updatedAt = new Date().toISOString();
  saveStore(store);
  res.json({ message: `${action === "return" ? "Return" : "Exchange"} requested successfully`, order });
});

// 8. ADMIN OPERATIONS
app.get("/api/admin/dashboard", adminMiddleware, (req: Request, res: Response) => {
  const store = loadStore();

  // Calculate sales statistics
  const totalSales = store.orders
    .filter((o) => o.paymentStatus === "paid" && o.orderStatus !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = store.orders.filter((o) => o.orderStatus === "placed" || o.orderStatus === "processing").length;
  const returnedOrders = store.orders.filter((o) => o.orderStatus === "returned" || o.orderStatus === "return_requested").length;
  const totalCustomers = store.users.length;

  // Sales by Category
  const categorySales: Record<string, number> = {};
  const ordersLast30Days = store.orders.filter((o) => new Date(o.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Seed default charts
  const salesHistory = [
    { date: "July 10", sales: 12400 },
    { date: "July 11", sales: 18900 },
    { date: "July 12", sales: 15400 },
    { date: "July 13", sales: 24500 },
    { date: "July 14", sales: 31200 },
    { date: "July 15", sales: totalSales > 0 ? totalSales % 50000 : 18500 },
  ];

  res.json({
    totalSales,
    pendingOrders,
    returnedOrders,
    totalCustomers,
    salesHistory,
    orders: store.orders,
    users: store.users,
  });
});

app.post("/api/admin/orders/status", adminMiddleware, (req: Request, res: Response) => {
  const { orderId, orderStatus, trackingStatus, paymentStatus } = req.body;
  const store = loadStore();
  const order = store.orders.find((o) => o.id === orderId);

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (orderStatus) order.orderStatus = orderStatus;
  if (trackingStatus) order.trackingStatus = trackingStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  order.updatedAt = new Date().toISOString();
  saveStore(store);
  res.json({ message: "Order status updated successfully", order });
});

// 9. BLOGS & FAQS
app.get("/api/blogs", (req: Request, res: Response) => {
  res.json(BLOGS);
});

app.get("/api/faqs", (req: Request, res: Response) => {
  res.json(FAQS);
});

// 10. AI STREETWEAR PERSONAL STYLIST (SERVER-SIDE GEMINI API)
app.post("/api/ai/assistant", async (req: Request, res: Response) => {
  const { message, chatHistory } = req.body;
  const gemini = getGeminiClient();

  if (!gemini) {
    // Elegant fallback stylist if Gemini API Key isn't configured
    console.log("Using deterministic fallback AI engine.");
    const query = message.toLowerCase();
    let reply = "I am the BLACKFAWN AI Style Assistant. Let me guide your outfit selection. ";
    let suggested: string[] = [];

    if (query.includes("oversized") || query.includes("t-shirt") || query.includes("tee")) {
      reply += "I highly recommend our FAWN-01 Heavyweight Oversized Tee. It is crafted in 240 GSM heavy French Terry and gives that perfect drop-shoulder streetwear look. Pair it with the Nightwalker cargos!";
      suggested = ["fawn-01-tee", "graffiti-ghost-tee", "nightwalker-cargos"];
    } else if (query.includes("cargo") || query.includes("pants") || query.includes("jogger")) {
      reply += "Cargos and utility joggers are the anchor of modern streetwear. Check out our Nightwalker Technical Cargo Pants (water-resistant, ripstop weave) or the Cyberpunk Reflective Joggers.";
      suggested = ["nightwalker-cargos", "cyberpunk-joggers"];
    } else if (query.includes("hoodie") || query.includes("winter") || query.includes("cold")) {
      reply += "Our Acid Soul Heavyweight Hoodie is our absolute masterpiece. It features 400 GSM brushed fleece with an enzyme wash that creates an incredible custom vintage texture. It is a wardrobe essential.";
      suggested = ["acid-soul-hoodie", "vandal-sweater"];
    } else if (query.includes("shoe") || query.includes("sneaker")) {
      reply += "Footwear balances the entire oversized outfit. The Stealth-X Tactical Sneaker provides a thick chunky sole, suede overlays, and a futuristic vibe that anchors oversized cargos perfectly.";
      suggested = ["stealth-x-sneakers"];
    } else if (query.includes("size") || query.includes("fit") || query.includes("height")) {
      reply += "Because our collection is streetwear-focused, oversized fits run slouchy. For a relaxed drop-shoulder aesthetic, pick your standard size. If you want a more regular look, consider sizing down one level.";
      suggested = ["fawn-01-tee", "acid-soul-hoodie"];
    } else {
      reply += "BLACKFAWN represents modern structural minimalism, bold drop shoulders, and rugged garment washes. Explore our heavy-fleece hoodies, technical multi-pocket cargos, and chunky Stealth-X runners to curate your next iconic outfit.";
      suggested = ["fawn-01-tee", "nightwalker-cargos", "acid-soul-hoodie", "stealth-x-sneakers"];
    }

    res.json({ text: reply, suggestedProducts: suggested });
    return;
  }

  try {
    // Build context with catalog data
    const productsContext = PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      fit: p.fit,
      material: p.material,
      colors: p.colors.map((c) => c.name).join(", "),
    }));

    const systemInstruction = `You are FAWN-AI, the elite, high-fashion streetwear stylist for the premium luxury clothing brand BLACKFAWN.
Your goal is to consult users on their fashion queries, select the best apparel options for them, explain outfit pairings using streetwear design vocabulary (e.g. drop-shoulder, GSM weight, layers, techwear, acid washes), suggest sizing based on height/weight, and generate a helpful styling output.

You MUST respond ONLY with a JSON object of this structure:
{
  "text": "Your helpful, stylish response in friendly, elite streetwear assistant tone. Speak like a professional fashion director. Focus on aesthetic choices and material pairings.",
  "suggestedProducts": ["array", "of", "matching", "product", "ids", "from", "the", "catalog"]
}

Our current catalog:
${JSON.stringify(productsContext, null, 2)}

Only suggest product IDs that are EXACTLY in the catalog. If none fit, return an empty array. Do not generate other properties outside 'text' and 'suggestedProducts'.`;

    // Construct history parts
    const contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.slice(-6).forEach((h: any) => {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The stylist speech text",
            },
            suggestedProducts: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "Array of matching product ids from the catalog",
            },
          },
          required: ["text", "suggestedProducts"],
        },
      },
    });

    const textOutput = response.text ? response.text.trim() : "{}";
    const data = JSON.parse(textOutput);
    res.json(data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate styling advice." });
  }
});

// ----------------------------------------------------
// VITE DEV / PRODUCTION INTEGRATION
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static compiled assets in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Pre-load store
  loadStore();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BLACKFAWN Server] Full stack running on http://localhost:${PORT}`);
  });
}

startServer();
