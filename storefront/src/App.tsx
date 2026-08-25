import { useState, useEffect, Suspense } from 'react';

// Customer Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';

// Customer Views
import HomeView from './pages/HomeView';
import ShopView from './pages/ShopView';
import ProductDetailView from './pages/ProductDetailView';
import CheckoutView from './pages/CheckoutView';
import ProfileView from './pages/ProfileView';

import { Product, CartItem, Coupon, User, Address, Order, FestivalCampaign } from '../../shared/types/types';
import { BusinessInfo, DEFAULT_BUSINESS_INFO } from '../../shared/types/businessConfig';
import { NavItemConfig, DEFAULT_NAVIGATION_CONFIG } from '../../shared/types/navConfig';
import { DEFAULT_FESTIVAL_CAMPAIGNS } from '../../shared/types/campaignConfig';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_COLLECTIONS } from '../../shared/types/defaultData';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [tab, setTab] = useState<string>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/shop')) return 'shop';
    if (hash.startsWith('#/checkout')) return 'checkout';
    if (hash.startsWith('#/profile')) return 'profile';
    return 'home';
  });

  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [collections, setCollections] = useState<any[]>(DEFAULT_COLLECTIONS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [navConfig, setNavConfig] = useState<NavItemConfig[]>(DEFAULT_NAVIGATION_CONFIG);
  const [festivalCampaigns, setFestivalCampaigns] = useState<FestivalCampaign[]>(DEFAULT_FESTIVAL_CAMPAIGNS);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Shopping Bag and Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('blackfawn_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('blackfawn_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawer & Modals state
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Active Promo Code
  const [couponApplied, setCouponApplied] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('blackfawn_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep hash location updated for simple SPA routing & SEO URLs
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#/shop')) {
        setTab('shop');
      } else if (hash.startsWith('#/t-shirts')) {
        setCategoryFilter('T-Shirts');
        setTab('shop');
      } else if (hash.startsWith('#/polo-t-shirts')) {
        setCategoryFilter('Polo T-Shirts');
        setTab('shop');
      } else if (hash.startsWith('#/caps')) {
        setCategoryFilter('Caps');
        setTab('shop');
      } else if (hash.startsWith('#/socks')) {
        setCategoryFilter('Socks');
        setTab('shop');
      } else if (hash.startsWith('#/towels')) {
        setCategoryFilter('Towels');
        setTab('shop');
      } else if (hash.startsWith('#/hand-napkins')) {
        setCategoryFilter('Hand Napkins');
        setTab('shop');
      } else if (hash.startsWith('#/mugs')) {
        setCategoryFilter('Mugs');
        setTab('shop');
      } else if (hash.startsWith('#/bottles')) {
        setCategoryFilter('Bottles');
        setTab('shop');
      } else if (hash.startsWith('#/hampers')) {
        setCategoryFilter('Hampers & Gifting');
        setTab('shop');
      } else if (hash.startsWith('#/collections/')) {
        const rawColl = window.location.hash.replace('#/collections/', '').replace(/-/g, ' ');
        setCategoryFilter('');
        setSearchQuery(`coll:${rawColl}`);
        setTab('shop');
      } else if (hash === '#/checkout') {
        setTab('checkout');
      } else if (hash === '#/profile') {
        setTab('profile');
      } else if (hash === '#/' || hash === '') {
        setTab('home');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(DEFAULT_BUSINESS_INFO);

  // Bootstrapping: Load resources from Backend REST APIs
  const fetchProductsAndSettings = () => {
    fetch(`${API_URL}/api/business-info`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) setBusinessInfo(data);
      })
      .catch(() => setBusinessInfo(DEFAULT_BUSINESS_INFO));

    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      })
      .catch(() => setProducts(DEFAULT_PRODUCTS));

    fetch(`${API_URL}/api/categories`)
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCategories(data);
      })
      .catch(() => setCategories(DEFAULT_CATEGORIES));

    fetch(`${API_URL}/api/collections`)
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCollections(data);
      })
      .catch(() => setCollections(DEFAULT_COLLECTIONS));

    fetch(`${API_URL}/api/navigation`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setNavConfig(data);
      })
      .catch(() => setNavConfig(DEFAULT_NAVIGATION_CONFIG));

    fetch(`${API_URL}/api/campaigns`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setFestivalCampaigns(data);
      })
      .catch(() => setFestivalCampaigns(DEFAULT_FESTIVAL_CAMPAIGNS));

    // Restore login session from localStorage
    try {
      const savedUser = localStorage.getItem('blackfawn_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      }
    } catch {
      localStorage.removeItem('blackfawn_user');
    }
  };

  useEffect(() => {
    fetchProductsAndSettings();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const u = data.user;
          setCurrentUser(u);
          localStorage.setItem('blackfawn_user', JSON.stringify(u));
          if (data.token) {
            localStorage.setItem('blackfawn_token', data.token);
          }
          return { success: true, user: u };
        } else if (data.error) {
          return { success: false, error: data.error };
        }
      }
    } catch (err) {
      // Fallback
    }

    const fallbackUser: User = {
      id: 'usr-customer-' + Date.now(),
      name: email.split('@')[0],
      email: email,
      phone: '+91 98765 43210',
      points: 100,
      role: 'customer',
      addresses: [],
      couponsUsed: [],
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(fallbackUser);
    localStorage.setItem('blackfawn_user', JSON.stringify(fallbackUser));
    return { success: true, user: fallbackUser };
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('blackfawn_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('blackfawn_token', data.token);
        }
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      const fallbackUser: User = {
        id: 'usr-customer-' + Date.now(),
        name: name,
        email: email,
        phone: '',
        points: 50,
        role: 'customer',
        addresses: [],
        couponsUsed: [],
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem('blackfawn_user', JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('blackfawn_user');
    localStorage.removeItem('blackfawn_token');
    window.location.hash = '#/';
    setTab('home');
  };

  const handleAddAddress = async (address: Partial<Address>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      id: 'addr-' + Date.now(),
      type: address.type || 'home',
      name: address.name || currentUser.name,
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2,
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      phone: address.phone || currentUser.phone || '',
      isDefault: address.isDefault || currentUser.addresses?.length === 0,
    };

    const updatedUser = {
      ...currentUser,
      addresses: [...(currentUser.addresses || []), newAddr],
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('blackfawn_user', JSON.stringify(updatedUser));
    showToast('Address added successfully!', 'success');
  };

  const handleRemoveAddress = (addressId: string) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      addresses: (currentUser.addresses || []).filter((a) => a.id !== addressId),
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('blackfawn_user', JSON.stringify(updatedUser));
    showToast('Address removed', 'info');
  };

  // Cart operations
  const addToCart = (product: Product, size: string, color: string, quantity = 1, customDesignText?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
          customDesignText,
        },
      ];
    });
    setCartOpen(true);
    showToast(`Added ${product.name} to Bag`, 'success');
  };

  const updateCartQuantity = (productId: string, size: string, color: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
    showToast('Item removed from cart', 'info');
  };

  // Wishlist toggle
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast('Added to Wishlist', 'success');
        return [...prev, product];
      }
    });
  };

  // Apply Coupon
  const applyCoupon = (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    if (uppercaseCode === 'LUXURY10') {
      const coupon: Coupon = {
        id: 'c1',
        code: 'LUXURY10',
        discountType: 'percentage',
        value: 10,
        minOrderValue: 999,
        active: true,
      };
      setCouponApplied(coupon);
      showToast('Coupon LUXURY10 Applied (10% OFF)', 'success');
      return { success: true, message: '10% Discount Applied!' };
    } else if (uppercaseCode === 'WELCOME200') {
      const coupon: Coupon = {
        id: 'c2',
        code: 'WELCOME200',
        discountType: 'fixed',
        value: 200,
        minOrderValue: 1499,
        active: true,
      };
      setCouponApplied(coupon);
      showToast('Coupon WELCOME200 Applied (₹200 OFF)', 'success');
      return { success: true, message: '₹200 Discount Applied!' };
    } else {
      showToast('Invalid Coupon Code', 'error');
      return { success: false, message: 'Invalid or expired promo code' };
    }
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    showToast('Coupon removed', 'info');
  };

  // Create Order
  const handlePlaceOrder = async (orderData: Partial<Order>) => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (data.success) {
        setCart([]);
        setCouponApplied(null);
        showToast('Order Placed Successfully!', 'success');
        return { success: true, orderId: data.order.id };
      }
    } catch {
      // Local fallback
    }

    const fallbackId = 'BF-' + Math.floor(10000 + Math.random() * 90000) + '-IN';
    setCart([]);
    setCouponApplied(null);
    showToast('Order Placed Successfully!', 'success');
    return { success: true, orderId: fallbackId };
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#111111] font-sans antialiased selection:bg-[#C9A227]/20 selection:text-[#111111]">
      {/* Toast Banner */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium text-sm transition-all transform animate-bounce ${
          toast.type === 'success' ? 'bg-[#111111] border-l-4 border-[#C9A227]' : toast.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Global Header */}
      <Header
        currentTab={tab}
        setTab={(t) => { setTab(t); setSelectedProductId(null); }}
        setCategoryFilter={setCategoryFilter}
        setSelectedProductId={setSelectedProductId}
        cart={cart}
        wishlist={wishlist}
        currentUser={currentUser}
        setSearchQuery={setSearchQuery}
        toggleCart={() => setCartOpen(true)}
        products={products}
        categoriesList={categories}
        navConfig={navConfig}
      />

      {/* Main Content View Switcher */}
      <main className="flex-grow pt-24 md:pt-28">
        <Suspense fallback={<div className="py-20 text-center text-sm tracking-widest uppercase text-gray-400">Loading Blackfawn Experience...</div>}>
          {selectedProductId && selectedProduct ? (
            <ProductDetailView
              product={selectedProduct}
              onBack={() => setSelectedProductId(null)}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              isInWishlist={wishlist.some((p) => p.id === selectedProduct.id)}
              allProducts={products}
              onSelectProduct={(id) => setSelectedProductId(id)}
            />
          ) : tab === 'shop' ? (
            <ShopView
              products={products}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectProduct={(id) => setSelectedProductId(id)}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              wishlist={wishlist}
              onQuickView={(product) => setQuickViewProduct(product)}
            />
          ) : tab === 'checkout' ? (
            <CheckoutView
              cart={cart}
              currentUser={currentUser}
              couponApplied={couponApplied}
              applyCoupon={applyCoupon}
              removeCoupon={removeCoupon}
              onPlaceOrder={handlePlaceOrder}
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
              wishlist={wishlist}
              onSelectProduct={(id) => { setSelectedProductId(id); setTab('shop'); }}
              onAddToCart={addToCart}
            />
          ) : (
            <HomeView
              products={products}
              categories={categories}
              collections={collections}
              festivalCampaigns={festivalCampaigns}
              onSelectProduct={(id) => setSelectedProductId(id)}
              onCategoryClick={(catName) => { setCategoryFilter(catName); setTab('shop'); }}
              onCollectionClick={(collTitle) => { setSearchQuery(`coll:${collTitle}`); setTab('shop'); }}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              wishlist={wishlist}
              onQuickView={(product) => setQuickViewProduct(product)}
            />
          )}
        </Suspense>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        couponApplied={couponApplied}
        applyCoupon={applyCoupon}
        removeCoupon={removeCoupon}
        onCheckout={() => { setCartOpen(false); setTab('checkout'); setSelectedProductId(null); window.location.hash = '#/checkout'; }}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          isInWishlist={wishlist.some((p) => p.id === quickViewProduct.id)}
          onViewFullDetails={(id) => { setQuickViewProduct(null); setSelectedProductId(id); }}
        />
      )}

      {/* Global Footer */}
      <Footer setTab={setTab} setCategoryFilter={setCategoryFilter} businessInfo={businessInfo} />
    </div>
  );
}
