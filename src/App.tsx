import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Core Eager Views
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import ProductDetailView from './views/ProductDetailView';

// Code-Split Dynamic Views & Modals
const CheckoutView = lazy(() => import('./views/CheckoutView'));
const ProfileView = lazy(() => import('./views/ProfileView'));
const AdminView = lazy(() => import('./views/AdminView'));
const QuickViewModal = lazy(() => import('./components/QuickViewModal'));

import { Product, CartItem, Coupon, User, Address, Order } from './types';

export default function App() {
  const [tab, setTab] = useState<string>('home'); // 'home' | 'shop' | 'product' | 'checkout' | 'profile'
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Shopping Bag and Saved Wishlist (persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('blackfawn_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('blackfawn_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Drawer & Modals state
  const [cartOpen, setCartOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Active Promo Code
  const [couponApplied, setCouponApplied] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('blackfawn_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  // Save Cart to Local Storage on update
  useEffect(() => {
    localStorage.setItem('blackfawn_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Wishlist to Local Storage on update
  useEffect(() => {
    localStorage.setItem('blackfawn_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save Coupon to Local Storage on update
  useEffect(() => {
    if (couponApplied) {
      localStorage.setItem('blackfawn_coupon', JSON.stringify(couponApplied));
    } else {
      localStorage.removeItem('blackfawn_coupon');
    }
  }, [couponApplied]);

  // Bootstrapping: Fetch initial catalog, coupons, and active user session
  useEffect(() => {
    // Products
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error loading products:', err));

    // Coupons
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => setCoupons(data))
      .catch((err) => console.error('Error loading coupons:', err));

    // Restore login session from localStorage if present
    const savedUser = localStorage.getItem('blackfawn_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // API Authentication wrappers
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('blackfawn_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('blackfawn_token', data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Database network timeout.' };
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('blackfawn_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('blackfawn_token', data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Database registration failure.' };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('blackfawn_user');
    localStorage.removeItem('blackfawn_token');
    setTab('home');
  };

  const handleAddAddress = async (address: Partial<Address>) => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem('blackfawn_token');
      const response = await fetch('/api/user/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ userId: currentUser.id, address }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('blackfawn_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem('blackfawn_token');
      const response = await fetch('/api/user/address/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ userId: currentUser.id, addressId }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('blackfawn_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  // Cart Management
  const handleAddToCart = (product: Product, size: string, color: string) => {
    if (!size) {
      alert("Please choose a size drop before adding to bag.");
      return;
    }
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          productId: product.id,
          product,
          size,
          color,
          quantity: 1,
        },
      ];
    });
    setCartOpen(true);
  };

  const handleBuyNow = (product: Product, size: string, color: string) => {
    if (!size) {
      alert("Please select a size blueprint.");
      return;
    }
    // Clear and add only this item
    setCart([
      {
        id: `${product.id}-${size}-${color}-${Date.now()}`,
        productId: product.id,
        product,
        size,
        color,
        quantity: 1,
      },
    ]);
    setTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Coupon apply validation on backend
  const handleApplyCoupon = async (code: string) => {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartValue: cart.reduce((tot, c) => tot + (c.product.discountPrice || c.product.price) * c.quantity, 0) }),
      });
      const data = await response.json();
      if (data.success) {
        setCouponApplied(data.coupon);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Database coupon validator failure.' };
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
  };

  // Place secure order via backend REST endpoint
  const handlePlaceOrder = async (orderData: Partial<Order>) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    return data.order;
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white antialiased">
      
      {/* 1. Header Layout navigation panel */}
      <Header
        currentTab={tab}
        setTab={(newTab) => {
          setTab(newTab);
          setSelectedProductId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        setCategoryFilter={setCategoryFilter}
        setSelectedProductId={setSelectedProductId}
        cart={cart}
        wishlist={wishlist}
        currentUser={currentUser}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setTab('shop');
        }}
        toggleCart={() => setCartOpen(!cartOpen)}
        toggleAIAssistant={() => setAiAssistantOpen(!aiAssistantOpen)}
        products={products}
      />

      {/* 2. Primary Layout Route Content Router */}
      <main className="flex-1 pt-20">
        <Suspense fallback={
          <div className="py-32 text-center text-xs font-mono uppercase text-neutral-400 tracking-widest flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#C9A227] animate-ping rounded-full" /> Loading view drop...
          </div>
        }>
          {selectedProductId ? (
            <ProductDetailView
              productId={selectedProductId}
              products={products}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlist.some((w) => w.id === selectedProductId)}
              setTab={setTab}
              setSelectedProductId={setSelectedProductId}
            />
          ) : tab === 'home' ? (
            <HomeView
              products={products}
              onProductClick={(p) => setSelectedProductId(p.id)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              onQuickView={(p) => setQuickViewProduct(p)}
              setTab={setTab}
              setCategoryFilter={setCategoryFilter}
              toggleAIAssistant={() => setAiAssistantOpen(!aiAssistantOpen)}
            />
          ) : tab === 'shop' ? (
            <ShopView
              products={products}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onProductClick={(p) => setSelectedProductId(p.id)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ) : tab === 'checkout' ? (
            <CheckoutView
              cart={cart}
              currentUser={currentUser}
              couponApplied={couponApplied}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onPlaceOrder={handlePlaceOrder}
              onClearCart={() => {
                setCart([]);
                setCouponApplied(null);
              }}
              setTab={setTab}
            />
          ) : tab === 'profile' ? (
            <ProfileView
              currentUser={currentUser}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
              onAddAddress={handleAddAddress}
              onRemoveAddress={handleRemoveAddress}
              coupons={coupons}
              setTab={setTab}
            />
          ) : tab === 'admin' ? (
            <AdminView
              products={products}
              setTab={setTab}
              currentUser={currentUser}
            />
          ) : (
            <div className="py-20 text-center font-mono">Disrupted Metropolis Route</div>
          )}
        </Suspense>
      </main>

      {/* 3. Footer Informative Brand footer with trust badges and rich structures */}
      <Footer setTab={setTab} setCategoryFilter={setCategoryFilter} />

      {/* 4. Sliding Bag Drawer Panel */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setCartOpen(false);
          setTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        couponApplied={couponApplied}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* 5. Quick View Overlay Modal */}
      <Suspense fallback={null}>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={(p, sz, clr) => {
              handleAddToCart(p, sz, clr);
              setQuickViewProduct(null);
            }}
            onBuyNow={(p, sz, clr) => {
              handleBuyNow(p, sz, clr);
              setQuickViewProduct(null);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}
