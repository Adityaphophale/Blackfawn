import { useState, useEffect, Suspense } from 'react';

// Customer Components
import Header from './customer/components/Header';
import Footer from './customer/components/Footer';
import CartDrawer from './customer/components/CartDrawer';
import QuickViewModal from './customer/components/QuickViewModal';

// Customer Views
import HomeView from './customer/views/HomeView';
import ShopView from './customer/views/ShopView';
import ProductDetailView from './customer/views/ProductDetailView';
import CheckoutView from './customer/views/CheckoutView';
import ProfileView from './customer/views/ProfileView';

// Admin Layout & Pages
import AdminLayout from './admin/layouts/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import DashboardPage from './admin/pages/DashboardPage';
import ProductsPage from './admin/pages/ProductsPage';
import InventoryPage from './admin/pages/InventoryPage';
import OrdersPage from './admin/pages/OrdersPage';
import CategoriesPage from './admin/pages/CategoriesPage';
import CouponsPage from './admin/pages/CouponsPage';
import ReviewsPage from './admin/pages/ReviewsPage';
import ReturnRequestsPage from './admin/pages/ReturnRequestsPage';
import GiftCardsPage from './admin/pages/GiftCardsPage';
import BlogsPage from './admin/pages/BlogsPage';

import { Product, CartItem, Coupon, User, Address, Order } from './shared/types';

import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_COLLECTIONS } from './shared/defaultData';

export default function App() {
  const [tab, setTab] = useState<string>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/admin')) return 'admin';
    return 'home';
  });

  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [collections, setCollections] = useState<any[]>(DEFAULT_COLLECTIONS);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Dashboard admin metrics
  const [metrics, setMetrics] = useState<any>({
    totalSales: 0,
    pendingOrders: 0,
    returnedOrders: 0,
    totalCustomers: 0,
    salesHistory: [],
    orders: [],
    users: [],
    productsCount: 0,
  });

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

  // Keep hash location updated for simple SPA routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/admin')) {
        setTab('admin');
      } else {
        setTab('home');
      }
    };
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

  // Bootstrapping: Load resources from Dynamic JSON Database REST APIs
  const fetchProductsAndSettings = () => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      })
      .catch(() => setProducts(DEFAULT_PRODUCTS));

    fetch('/api/categories')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCategories(data);
      })
      .catch(() => setCategories(DEFAULT_CATEGORIES));

    fetch('/api/collections')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCollections(data);
      })
      .catch(() => setCollections(DEFAULT_COLLECTIONS));

    // Restore login session from localStorage
    try {
      const savedUser = localStorage.getItem('blackfawn_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.name && parsed.name.toLowerCase().includes('phophale')) {
          parsed.name = 'Admin User';
          localStorage.setItem('blackfawn_user', JSON.stringify(parsed));
        }
        setCurrentUser(parsed);
      }
    } catch {
      localStorage.removeItem('blackfawn_user');
    }
  };

  useEffect(() => {
    fetchProductsAndSettings();
  }, []);

  // Fetch admin dashboard details when user is authenticated
  const fetchDashboardMetrics = () => {
    const token = localStorage.getItem('blackfawn_token');
    if (!token) return;

    fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        if (data.orders) setMetrics((m: any) => ({ ...m, orders: data.orders }));
      })
      .catch((err) => console.error('Error fetching dashboard:', err));
  };

  useEffect(() => {
    if (tab === 'admin' && currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff')) {
      fetchDashboardMetrics();
    }
  }, [tab, currentUser]);

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
        if (data.token) {
          localStorage.setItem('blackfawn_token', data.token);
          localStorage.setItem('token', data.token);
        }
        fetchProductsAndSettings();
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
        if (data.token) {
          localStorage.setItem('blackfawn_token', data.token);
          localStorage.setItem('token', data.token);
        }
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
    localStorage.removeItem('token');
    window.location.hash = '#/';
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

  const handlePlaceOrder = async (orderData: Partial<Order>) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ order: orderData }),
    });
    const data = await response.json();
    fetchProductsAndSettings();
    return data.order;
  };

  // ----------------------------------------------------
  // ADMIN WORKFLOW ACTIONS (CRUD)
  // ----------------------------------------------------
  const handleAdminCreateProduct = async (productData: Partial<Product>) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    fetchProductsAndSettings();
    fetchDashboardMetrics();
    return data;
  };

  const handleAdminUpdateProduct = async (id: string, productData: Partial<Product>) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    fetchProductsAndSettings();
    fetchDashboardMetrics();
    return data;
  };

  const handleAdminDeleteProduct = async (id: string) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    fetchProductsAndSettings();
    fetchDashboardMetrics();
    return data;
  };

  const handleAdminCreateCategory = async (categoryData: any) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    fetchProductsAndSettings();
    return data;
  };

  const handleAdminCreateCollection = async (collectionData: any) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch('/api/admin/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(collectionData),
    });
    const data = await response.json();
    fetchProductsAndSettings();
    return data;
  };

  const handleAdminUpdateOrder = async (id: string, updates: Partial<Order>) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    fetchDashboardMetrics();
    return data;
  };

  const handleAdminCreateCoupon = async (couponData: Partial<Coupon>) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });
    const data = await response.json();
    fetchDashboardMetrics();
    return data;
  };

  const handleAdminDeleteCoupon = async (id: string) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch(`/api/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    fetchDashboardMetrics();
    return data;
  };

  const handleAdminDeleteReview = async (id: string) => {
    const token = localStorage.getItem('blackfawn_token');
    const response = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  };

  // ----------------------------------------------------
  // ROUTING VIEW RENDERERS
  // ----------------------------------------------------
  if (tab === 'admin') {
    // Check authentication and authorize role
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'staff')) {
      return (
        <AdminLogin 
          onLogin={async (email, password) => {
            const res = await handleLogin(email, password);
            if (res.success && (res.user.role === 'admin' || res.user.role === 'staff')) {
              window.location.hash = '#/admin';
              setTab('admin');
              return { success: true };
            }
            return { success: false, error: 'Unauthorized credentials.' };
          }} 
        />
      );
    }

    return (
      <AdminLayout
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        setTab={(newTab) => {
          setTab(newTab);
          window.location.hash = '#/';
        }}
      >
        {activeSubTab === 'dashboard' && <DashboardPage metrics={metrics} />}
        {activeSubTab === 'products' && (
          <ProductsPage
            products={products}
            categories={categories}
            collections={collections}
            onCreateProduct={handleAdminCreateProduct}
            onUpdateProduct={handleAdminUpdateProduct}
            onDeleteProduct={handleAdminDeleteProduct}
          />
        )}
        {activeSubTab === 'inventory' && <InventoryPage />}
        {activeSubTab === 'orders' && <OrdersPage orders={metrics.orders} onUpdateOrder={handleAdminUpdateOrder} />}
        {activeSubTab === 'categories' && (
          <CategoriesPage
            categories={categories}
            collections={collections}
            onCreateCategory={handleAdminCreateCategory}
            onCreateCollection={handleAdminCreateCollection}
          />
        )}
        {activeSubTab === 'coupons' && (
          <CouponsPage
            coupons={metrics.orders ? coupons : []} // Fallback check
            onCreateCoupon={handleAdminCreateCoupon}
            onDeleteCoupon={handleAdminDeleteCoupon}
          />
        )}
        {activeSubTab === 'reviews' && <ReviewsPage onDeleteReview={handleAdminDeleteReview} />}
        {activeSubTab === 'returns' && <ReturnRequestsPage />}
        {activeSubTab === 'giftcards' && <GiftCardsPage />}
        {activeSubTab === 'blogs' && <BlogsPage />}
      </AdminLayout>
    );
  }

  // Else render standard Customer Storefront layout
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] flex flex-col font-sans antialiased selection:bg-[#f97316] selection:text-white">
      
      {/* Customer Header */}
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
        products={products}
        categoriesList={categories}
      />

      {/* Main View Router */}
      <main className="flex-grow pt-24 min-h-[75vh]">
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
            setCategoryFilter={setCategoryFilter}
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
            categoriesList={categories}
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
            categoriesList={categories}
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
        ) : (
          <div className="py-20 text-center font-mono">Disrupted Storefront Route</div>
        )}
      </main>

      {/* Customer Footer */}
      <Footer setTab={setTab} setCategoryFilter={setCategoryFilter} />

      {/* Slide-out bag Drawer */}
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

      {/* Quick View overlay Modal */}
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
    </div>
  );
}
