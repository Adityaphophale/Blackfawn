import React, { useState, useEffect } from 'react';
import { ShieldAlert, BarChart3, ShoppingCart, Tag, Users, Package, RefreshCw, Eye, Check, X, AlertTriangle, Plus, Trash2, ArrowUpDown } from 'lucide-react';
import { Order, Product, User, Coupon } from '../types';

interface AdminViewProps {
  products: Product[];
  setTab: (tab: string) => void;
  currentUser: any;
}

interface DashboardData {
  totalSales: number;
  pendingOrders: number;
  returnedOrders: number;
  totalCustomers: number;
  salesHistory: { date: string; sales: number }[];
  orders: Order[];
  users: User[];
}

export default function AdminView({ products: initialProducts, setTab, currentUser }: AdminViewProps) {
  const [activeSidebarTab, setActiveSidebarTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'users'>('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Orders Management state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState<'pending' | 'paid' | 'failed' | 'refunded'>('pending');
  const [newTrackingMsg, setNewTrackingMsg] = useState('');

  // Products Management state
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingStockProductId, setEditingStockProductId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);
  const [newProductForm, setNewProductForm] = useState({
    id: '',
    name: '',
    description: '',
    category: 'Oversized',
    price: 0,
    discountPrice: 0,
    images: ['', ''],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Charcoal Black', hex: '#1C1C1C' }],
    fit: 'Oversized',
    material: '100% Terry Cotton',
    pattern: 'Solid',
    gender: 'unisex' as 'unisex' | 'men' | 'women',
    stock: 50,
  });

  // Coupons Management state
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState<Coupon>({
    code: '',
    type: 'percentage',
    value: 15,
    minPurchase: 1999,
    description: '15% Off Metropolis drop.',
    expiresAt: '2026-12-31',
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('blackfawn_token');
      const res = await fetch('/api/admin/dashboard', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      setDashboardData(data);
      setProductsList(initialProducts);
    } catch (err) {
      console.error(err);
      setError('Could not establish secure administrator telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      setCouponsList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchDashboardData();
      fetchCoupons();
    }
  }, [currentUser]);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center pt-[160px]">
        <ShieldAlert size={48} className="text-red-700 mb-4" />
        <h2 className="text-lg font-display font-black tracking-widest text-[#0B0B0B] uppercase">ACCESS DENIED</h2>
        <p className="text-xs font-mono text-neutral-500 uppercase mt-2 max-w-xs leading-relaxed">
          This container is restricted to authorized admin nodes. Secure key validation failed.
        </p>
        <button
          onClick={() => setTab('home')}
          className="mt-6 px-6 py-2.5 bg-[#0B0B0B] text-[#F8F8F6] text-xs font-display font-black tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors rounded-none"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const token = localStorage.getItem('blackfawn_token');
      const res = await fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          orderStatus: newOrderStatus,
          paymentStatus: newPaymentStatus,
          trackingStatus: newTrackingMsg,
        }),
      });
      const data = await res.json();
      if (data.order) {
        setSelectedOrder(data.order);
        // Refresh local dashboard data list
        setDashboardData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            orders: prev.orders.map((o) => (o.id === data.order.id ? data.order : o)),
          };
        });
        alert('Order status successfully updated in centralized database.');
      }
    } catch (err) {
      console.error(err);
      alert('Could not synchronize status updates.');
    }
  };

  const handleSaveStock = (productId: string) => {
    // Local stock modification helper
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStockVal } : p))
    );
    setEditingStockProductId(null);
    alert('Stock adjustments updated successfully.');
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      name: newProductForm.name,
      description: newProductForm.description,
      category: newProductForm.category,
      price: Number(newProductForm.price),
      discountPrice: newProductForm.discountPrice ? Number(newProductForm.discountPrice) : undefined,
      images: newProductForm.images.filter((img) => img.trim() !== ''),
      sizes: newProductForm.sizes,
      colors: newProductForm.colors,
      fit: newProductForm.fit,
      material: newProductForm.material,
      pattern: newProductForm.pattern,
      gender: newProductForm.gender,
      stock: Number(newProductForm.stock),
      features: ['240 GSM single jersey cotton', 'Oversized drop silhouette design'],
      sizeChart: [
        { size: 'S', chest: 44, length: 28, shoulder: 20 },
        { size: 'M', chest: 46, length: 29, shoulder: 21 },
        { size: 'L', chest: 48, length: 30, shoulder: 22 },
        { size: 'XL', chest: 50, length: 31, shoulder: 23 },
      ],
      codAvailable: true,
      deliveryDaysEst: 3,
      rating: 5,
      reviewCount: 0,
    };

    setProductsList((prev) => [newProduct, ...prev]);
    setShowAddProductModal(false);
    // Reset form
    setNewProductForm({
      id: '',
      name: '',
      description: '',
      category: 'Oversized',
      price: 0,
      discountPrice: 0,
      images: ['', ''],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Charcoal Black', hex: '#1C1C1C' }],
      fit: 'Oversized',
      material: '100% Terry Cotton',
      pattern: 'Solid',
      gender: 'unisex',
      stock: 50,
    });
    alert('New apparel item successfully added to inventory drops list.');
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponsList((prev) => [...prev, newCouponForm]);
    setShowAddCouponModal(false);
    // Reset form
    setNewCouponForm({
      code: '',
      type: 'percentage',
      value: 15,
      minPurchase: 1999,
      description: '15% Off Metropolis drop.',
      expiresAt: '2026-12-31',
    });
    alert('Promo coupon code registered and active.');
  };

  const handleDeleteCoupon = (code: string) => {
    setCouponsList((prev) => prev.filter((c) => c.code !== code));
    alert('Coupon code has been deactivated.');
  };

  const handleToggleUserRole = (user: User) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    if (dashboardData) {
      setDashboardData({
        ...dashboardData,
        users: dashboardData.users.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)),
      });
      alert(`User role updated to "${nextRole.toUpperCase()}".`);
    }
  };

  return (
    <div id="admin-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[140px] min-h-screen bg-[#F8F8F6] text-[#0B0B0B]">
      
      {/* 1. Header Navigation */}
      <div className="border-b border-[#0B0B0B]/10 pb-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#C9A227] uppercase font-bold">ADMINISTRATIVE TELEMETRY SYSTEM</span>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-widest text-[#0B0B0B] uppercase mt-1">
            CONTROL CONSOLE
          </h1>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 border border-[#0B0B0B]/15 text-[#0B0B0B] text-[10px] font-mono uppercase tracking-widest hover:bg-[#0B0B0B] hover:text-[#F8F8F6] transition-colors rounded-none flex items-center gap-1.5 self-end sm:self-auto"
        >
          <RefreshCw size={12} /> Sync Telemetry
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 font-mono text-xs text-neutral-400 uppercase tracking-widest flex flex-col items-center justify-center gap-4">
          <RefreshCw size={24} className="animate-spin text-[#C9A227]" /> Synchronizing with Metropolis central database...
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-red-50 border border-red-200 text-red-700 font-mono text-xs uppercase tracking-widest rounded-none p-6">
          <AlertTriangle size={32} className="mx-auto mb-4" /> {error}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Menu */}
          <aside className="w-full lg:w-64 shrink-0 space-y-2">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
              { id: 'orders', label: 'Orders Manager', icon: ShoppingCart },
              { id: 'products', label: 'Products Inventory', icon: Package },
              { id: 'coupons', label: 'Coupons Tool', icon: Tag },
              { id: 'users', label: 'User Roles & Accounts', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveSidebarTab(tab.id as any); setSelectedOrder(null); }}
                  className={`w-full text-left px-4 py-3 text-xs font-mono uppercase tracking-widest flex items-center gap-3 transition-colors border rounded-none cursor-pointer ${
                    activeSidebarTab === tab.id
                      ? 'bg-[#0B0B0B] text-[#F8F8F6] border-[#0B0B0B] font-bold'
                      : 'bg-white border-[#0B0B0B]/10 text-neutral-500 hover:bg-neutral-50'
                  }`}
                >
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </aside>

          {/* Core Admin Screen */}
          <main className="flex-1 bg-white border border-[#0B0B0B]/10 p-6 rounded-none shadow-xs overflow-x-auto">
            {activeSidebarTab === 'overview' && dashboardData && (
              <div className="space-y-10">
                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none text-center">
                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">Total Sales</span>
                    <p className="text-xl font-display font-black text-[#0B0B0B] mt-1">₹{dashboardData.totalSales}</p>
                  </div>
                  <div className="p-4 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none text-center">
                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">Pending Orders</span>
                    <p className="text-xl font-display font-black text-amber-600 mt-1">{dashboardData.pendingOrders}</p>
                  </div>
                  <div className="p-4 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none text-center">
                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">Returns & Claims</span>
                    <p className="text-xl font-display font-black text-red-700 mt-1">{dashboardData.returnedOrders}</p>
                  </div>
                  <div className="p-4 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none text-center">
                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">User Directory</span>
                    <p className="text-xl font-display font-black text-[#0B0B0B] mt-1">{dashboardData.totalCustomers}</p>
                  </div>
                </div>

                {/* Sales Chart block using standard SVG grids */}
                <div className="space-y-4">
                  <h3 className="text-xs font-display font-bold tracking-widest uppercase">SALES GRAPH METRIC (LAST 6 DAYS)</h3>
                  <div className="h-56 w-full border border-[#0B0B0B]/10 bg-[#F8F8F6] p-4 flex flex-col justify-between">
                    <div className="flex-1 flex items-end justify-between gap-6 px-4">
                      {dashboardData.salesHistory.map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[8px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">₹{item.sales}</span>
                          <div
                            style={{ height: `${(item.sales / 35000) * 120}px` }}
                            className="w-full bg-[#0B0B0B] hover:bg-[#C9A227] transition-all min-h-[4px]"
                          />
                          <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">{item.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Stats table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Latest Orders */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-display font-bold tracking-widest uppercase border-b border-[#0B0B0B]/10 pb-2">LATEST ORDERS</h4>
                    <div className="divide-y divide-[#0B0B0B]/10 text-[10px] font-mono uppercase tracking-wider">
                      {dashboardData.orders.slice(0, 5).map((o) => (
                        <div key={o.id} className="py-2.5 flex justify-between items-center">
                          <span>{o.id} • {o.customerName}</span>
                          <span className="font-bold">₹{o.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top VIP users */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-display font-bold tracking-widest uppercase border-b border-[#0B0B0B]/10 pb-2">TOP VIP ACCOUNTS</h4>
                    <div className="divide-y divide-[#0B0B0B]/10 text-[10px] font-mono uppercase tracking-wider">
                      {dashboardData.users.slice(0, 5).map((u) => (
                        <div key={u.id} className="py-2.5 flex justify-between items-center">
                          <span>{u.name}</span>
                          <span className="text-[#C9A227] font-bold">{u.points} PTS</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Management tab */}
            {activeSidebarTab === 'orders' && dashboardData && (
              <div className="space-y-6">
                {!selectedOrder ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-display font-bold tracking-widest uppercase">CUSTOMER ORDER ACQUISITIONS</h3>
                    <div className="overflow-x-auto border border-[#0B0B0B]/10 rounded-none bg-[#F8F8F6]">
                      <table className="w-full text-left text-[11px] font-mono uppercase tracking-wider divide-y divide-[#0B0B0B]/10">
                        <thead className="bg-white text-neutral-500">
                          <tr>
                            <th className="p-4">ORDER ID</th>
                            <th className="p-4">CUSTOMER</th>
                            <th className="p-4">TOTAL</th>
                            <th className="p-4">STATUS</th>
                            <th className="p-4">PAYMENT</th>
                            <th className="p-4">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0B0B0B]/10 text-neutral-600">
                          {dashboardData.orders.map((o) => (
                            <tr key={o.id} className="hover:bg-white transition-colors">
                              <td className="p-4 font-bold">{o.id}</td>
                              <td className="p-4">{o.customerName}</td>
                              <td className="p-4">₹{o.total}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 text-[8px] font-bold ${
                                  o.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                                  o.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {o.orderStatus}
                                </span>
                              </td>
                              <td className="p-4">{o.paymentStatus}</td>
                              <td className="p-4">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(o);
                                    setNewOrderStatus(o.orderStatus);
                                    setNewPaymentStatus(o.paymentStatus);
                                    setNewTrackingMsg(o.trackingStatus || '');
                                  }}
                                  className="text-[9px] font-bold uppercase text-[#C9A227] hover:underline"
                                >
                                  Modify
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-[9px] font-mono text-neutral-400 hover:text-black uppercase underline flex items-center gap-1.5"
                    >
                      ← Return to Orders List
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-6">
                        <div className="p-5 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none space-y-4">
                          <h4 className="text-xs font-display font-black tracking-widest uppercase">Order Details: {selectedOrder.id}</h4>
                          <div className="divide-y divide-[#0B0B0B]/5 text-xs font-mono uppercase tracking-wider text-neutral-600">
                            <div className="py-2.5 flex justify-between">
                              <span>Customer Node</span>
                              <span className="text-[#0B0B0B] font-bold">{selectedOrder.customerName} ({selectedOrder.customerEmail})</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                              <span>Address line</span>
                              <span className="text-[#0B0B0B] font-bold">{selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.city}</span>
                            </div>
                            {selectedOrder.gstNumber && (
                              <div className="py-2.5 flex justify-between bg-yellow-50 px-2 font-bold text-[#C9A227]">
                                <span>GSTIN ID</span>
                                <span>{selectedOrder.gstNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="p-5 bg-white border border-[#0B0B0B]/10 rounded-none space-y-4">
                          <h4 className="text-xs font-display font-bold tracking-widest uppercase">Items Packaged</h4>
                          <div className="space-y-3">
                            {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 text-xs font-mono uppercase text-neutral-500">
                                <img src={item.productImage} alt="" className="w-10 aspect-[3/4] object-cover border border-[#0B0B0B]/10 shrink-0" referrerPolicy="no-referrer" />
                                <div className="flex-1 overflow-hidden">
                                  <h5 className="text-[#0B0B0B] font-bold line-clamp-1">{item.productName}</h5>
                                  <p className="text-[9px]">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                                </div>
                                <span className="text-[#0B0B0B] font-bold">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Modify Form */}
                      <form onSubmit={handleUpdateOrderStatus} className="p-5 bg-white border border-[#0B0B0B]/10 rounded-none space-y-4 h-fit shadow-sm">
                        <h4 className="text-xs font-display font-bold tracking-widest uppercase">Modify Shipment</h4>
                        
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono text-neutral-400 uppercase">Order status</label>
                          <select
                            value={newOrderStatus}
                            onChange={(e) => setNewOrderStatus(e.target.value)}
                            className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/10 text-[#0B0B0B] text-[10px] font-mono p-2 focus:border-[#C9A227] outline-none uppercase rounded-none"
                          >
                            <option value="placed">Placed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="return_requested">Return Requested</option>
                            <option value="returned">Returned</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono text-neutral-400 uppercase">Payment status</label>
                          <select
                            value={newPaymentStatus}
                            onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                            className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/10 text-[#0B0B0B] text-[10px] font-mono p-2 focus:border-[#C9A227] outline-none uppercase rounded-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono text-neutral-400 uppercase">Live tracking log</label>
                          <textarea
                            value={newTrackingMsg}
                            onChange={(e) => setNewTrackingMsg(e.target.value)}
                            rows={3}
                            className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/10 text-[#0B0B0B] text-[10px] font-mono p-2 focus:border-[#C9A227] outline-none uppercase rounded-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-[#0B0B0B] text-[#F8F8F6] text-xs font-display font-black tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors rounded-none font-bold"
                        >
                          APPLY MUTATIONS
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Products Inventory tab */}
            {activeSidebarTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[#0B0B0B]/10 pb-4">
                  <h3 className="text-xs font-display font-bold tracking-widest uppercase">CATALOG STOCK REGISTER</h3>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 bg-[#0B0B0B] text-[#F8F8F6] text-[10px] font-display font-bold tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors rounded-none flex items-center gap-1.5 font-bold cursor-pointer"
                  >
                    <Plus size={12} /> ADD APPAREL DROP
                  </button>
                </div>

                {showAddProductModal && (
                  <form onSubmit={handleAddProductSubmit} className="p-5 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none space-y-4 animate-fade-in max-w-2xl">
                    <h4 className="text-xs font-display font-bold tracking-widest uppercase">Constituent Drop Parameters</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Product Name</label>
                        <input
                          type="text"
                          required
                          placeholder="FAWN-X OVERSIZED HOODIE"
                          value={newProductForm.name}
                          onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none uppercase rounded-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Category Drop</label>
                        <select
                          value={newProductForm.category}
                          onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none uppercase rounded-none h-[34px]"
                        >
                          <option value="Oversized">Oversized</option>
                          <option value="T-Shirts">T-Shirts</option>
                          <option value="Hoodies">Hoodies</option>
                          <option value="Cargo Pants">Cargo Pants</option>
                          <option value="Sneakers">Sneakers</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Catalog Price</label>
                        <input
                          type="number"
                          required
                          value={newProductForm.price}
                          onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none rounded-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Discount Price</label>
                        <input
                          type="number"
                          value={newProductForm.discountPrice}
                          onChange={(e) => setNewProductForm({ ...newProductForm, discountPrice: Number(e.target.value) })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none rounded-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Initial Stock</label>
                        <input
                          type="number"
                          required
                          value={newProductForm.stock}
                          onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none rounded-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-neutral-400 uppercase">Primary Image URL</label>
                      <input
                        type="text"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={newProductForm.images[0]}
                        onChange={(e) => {
                          const imgs = [...newProductForm.images];
                          imgs[0] = e.target.value;
                          setNewProductForm({ ...newProductForm, images: imgs });
                        }}
                        className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none rounded-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Silhouette Fit</label>
                        <input
                          type="text"
                          value={newProductForm.fit}
                          onChange={(e) => setNewProductForm({ ...newProductForm, fit: e.target.value })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none uppercase rounded-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Yarn Material</label>
                        <input
                          type="text"
                          value={newProductForm.material}
                          onChange={(e) => setNewProductForm({ ...newProductForm, material: e.target.value })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none uppercase rounded-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-neutral-400 uppercase">Description narrative</label>
                      <textarea
                        required
                        rows={2}
                        value={newProductForm.description}
                        onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                        className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] p-3 text-xs font-mono focus:border-[#C9A227] outline-none uppercase rounded-none resize-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#0B0B0B] text-[#F8F8F6] text-xs font-display font-black tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors rounded-none font-bold"
                      >
                        PUBLISH APPAREL DROP
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddProductModal(false)}
                        className="px-6 py-3 bg-white border border-[#0B0B0B]/15 text-[#0B0B0B] text-xs font-mono uppercase tracking-widest hover:bg-neutral-50 transition-colors rounded-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto border border-[#0B0B0B]/10 rounded-none bg-[#F8F8F6]">
                  <table className="w-full text-left text-[11px] font-mono uppercase tracking-wider divide-y divide-[#0B0B0B]/10">
                    <thead className="bg-white text-neutral-500">
                      <tr>
                        <th className="p-4">PREVIEW</th>
                        <th className="p-4">PRODUCT NAME</th>
                        <th className="p-4">CATEGORY</th>
                        <th className="p-4">PRICE</th>
                        <th className="p-4">STOCK</th>
                        <th className="p-4">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0B0B0B]/10 text-neutral-600">
                      {productsList.map((p) => (
                        <tr key={p.id} className="hover:bg-white transition-colors">
                          <td className="p-4">
                            <img src={p.images[0]} alt="" className="w-8 aspect-[3/4] object-cover border border-[#0B0B0B]/10" referrerPolicy="no-referrer" />
                          </td>
                          <td className="p-4 font-bold">{p.name}</td>
                          <td className="p-4">{p.category}</td>
                          <td className="p-4">₹{p.price}</td>
                          <td className="p-4">
                            {editingStockProductId === p.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  className="w-12 p-1 text-[10px] font-mono border border-black focus:outline-none"
                                  value={newStockVal}
                                  onChange={(e) => setNewStockVal(Number(e.target.value))}
                                />
                                <button onClick={() => handleSaveStock(p.id)} className="p-1 bg-[#0B0B0B] text-white hover:bg-neutral-800"><Check size={10} /></button>
                                <button onClick={() => setEditingStockProductId(null)} className="p-1 bg-neutral-200 text-neutral-600"><X size={10} /></button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className={p.stock <= 15 ? 'text-red-600 font-bold' : ''}>{p.stock}</span>
                                <button
                                  onClick={() => { setEditingStockProductId(p.id); setNewStockVal(p.stock); }}
                                  className="text-[8px] underline text-neutral-400 hover:text-black font-bold"
                                >
                                  Adjust
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setProductsList((prev) => prev.filter((item) => item.id !== p.id));
                                alert('Product deleted from active view.');
                              }}
                              className="text-[9px] font-bold text-red-700 hover:underline"
                            >
                              De-list
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Coupons Management tab */}
            {activeSidebarTab === 'coupons' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[#0B0B0B]/10 pb-4">
                  <h3 className="text-xs font-display font-bold tracking-widest uppercase">PROMO COUPON MANAGER</h3>
                  <button
                    onClick={() => setShowAddCouponModal(true)}
                    className="px-4 py-2 bg-[#0B0B0B] text-[#F8F8F6] text-[10px] font-display font-bold tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors rounded-none flex items-center gap-1.5 font-bold cursor-pointer"
                  >
                    <Plus size={12} /> CREATE COUPON
                  </button>
                </div>

                {showAddCouponModal && (
                  <form onSubmit={handleAddCouponSubmit} className="p-5 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none space-y-4 animate-fade-in max-w-md">
                    <h4 className="text-xs font-display font-bold tracking-widest uppercase">Coupon Parameters</h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-mono text-neutral-400 uppercase">Coupon Code</label>
                      <input
                        type="text"
                        required
                        placeholder="METROPOLIS15"
                        value={newCouponForm.code}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                        className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2.5 text-xs font-mono focus:border-[#C9A227] outline-none uppercase rounded-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Reduction Type</label>
                        <select
                          value={newCouponForm.type}
                          onChange={(e) => setNewCouponForm({ ...newCouponForm, type: e.target.value as any })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] text-[10px] font-mono p-2 focus:border-[#C9A227] outline-none uppercase rounded-none h-[34px]"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Flat Amount (₹)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Face Value</label>
                        <input
                          type="number"
                          required
                          value={newCouponForm.value}
                          onChange={(e) => setNewCouponForm({ ...newCouponForm, value: Number(e.target.value) })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none rounded-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Min Cart Value</label>
                        <input
                          type="number"
                          required
                          value={newCouponForm.minPurchase}
                          onChange={(e) => setNewCouponForm({ ...newCouponForm, minPurchase: Number(e.target.value) })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none rounded-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Expires At</label>
                        <input
                          type="date"
                          required
                          value={newCouponForm.expiresAt}
                          onChange={(e) => setNewCouponForm({ ...newCouponForm, expiresAt: e.target.value })}
                          className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2 text-xs font-mono focus:border-[#C9A227] outline-none rounded-none h-[34px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-mono text-neutral-400 uppercase">Description label</label>
                      <input
                        type="text"
                        required
                        placeholder="15% Off Metropolis drop."
                        value={newCouponForm.description}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                        className="w-full bg-white border border-[#0B0B0B]/10 text-[#0B0B0B] px-3.5 py-2.5 text-xs font-mono focus:border-[#C9A227] outline-none uppercase rounded-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#0B0B0B] text-[#F8F8F6] text-xs font-display font-black tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors rounded-none font-bold"
                      >
                        PUBLISH COUPON
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCouponModal(false)}
                        className="px-6 py-3 bg-white border border-[#0B0B0B]/15 text-[#0B0B0B] text-xs font-mono uppercase tracking-widest hover:bg-neutral-50 transition-colors rounded-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {couponsList.map((coupon) => (
                    <div key={coupon.code} className="p-4 bg-[#F8F8F6] border border-[#0B0B0B]/10 rounded-none flex justify-between items-center">
                      <div className="font-mono text-xs text-neutral-600 uppercase tracking-widest space-y-1">
                        <span className="text-[9px] font-display font-bold bg-[#C9A227] text-black px-2 py-0.5 rounded-none">{coupon.code}</span>
                        <h4 className="text-[#0B0B0B] font-bold mt-1.5">{coupon.description}</h4>
                        <p className="text-[9px]">Min Bag total: ₹{coupon.minPurchase} • Type: {coupon.type} (val: {coupon.value})</p>
                        <p className="text-[9px]">Expiry: {coupon.expiresAt}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.code)}
                        className="text-neutral-400 hover:text-red-700 p-2 cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Role management tab */}
            {activeSidebarTab === 'users' && dashboardData && (
              <div className="space-y-4">
                <h3 className="text-xs font-display font-bold tracking-widest uppercase">USER DIRECTORY & ROLES</h3>
                <div className="overflow-x-auto border border-[#0B0B0B]/10 rounded-none bg-[#F8F8F6]">
                  <table className="w-full text-left text-[11px] font-mono uppercase tracking-wider divide-y divide-[#0B0B0B]/10">
                    <thead className="bg-white text-neutral-500">
                      <tr>
                        <th className="p-4">USER NAME</th>
                        <th className="p-4">EMAIL ADDRESS</th>
                        <th className="p-4">VIP POINTS</th>
                        <th className="p-4">ROLE NODE</th>
                        <th className="p-4">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0B0B0B]/10 text-neutral-600">
                      {dashboardData.users.map((user) => (
                        <tr key={user.id} className="hover:bg-white transition-colors">
                          <td className="p-4 font-bold">{user.name}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4 text-[#C9A227] font-bold">{user.points} PTS</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-[8px] font-bold ${
                              user.role === 'admin' ? 'bg-[#C9A227] text-[#0B0B0B]' : 'bg-neutral-200 text-neutral-600'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleUserRole(user)}
                              className="text-[9px] font-bold text-[#0B0B0B] hover:text-[#C9A227] underline"
                            >
                              Toggle Role
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
