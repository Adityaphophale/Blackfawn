import React, { useState } from 'react';
import { ShieldCheck, Truck, ClipboardList, Eye, CheckCircle, ArrowRight, X } from 'lucide-react';
import { Order } from '../../shared/types';

interface OrdersPageProps {
  orders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => Promise<any>;
}

export default function OrdersPage({ orders, onUpdateOrder }: OrdersPageProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit / Update fields
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingStatus, setTrackingStatus] = useState('');

  const handleOpenDetails = (o: Order) => {
    setSelectedOrder(o);
    setOrderStatus(o.orderStatus);
    setPaymentStatus(o.paymentStatus);
    setTrackingNumber(o.trackingNumber || '');
    setTrackingStatus(o.trackingStatus || '');
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await onUpdateOrder(selectedOrder.id, {
        orderStatus: orderStatus as any,
        paymentStatus: paymentStatus as any,
        trackingNumber,
        trackingStatus,
      });
      if (res.success) {
        setSelectedOrder({
          ...selectedOrder,
          orderStatus: orderStatus as any,
          paymentStatus: paymentStatus as any,
          trackingNumber,
          trackingStatus,
        });
        alert('Order status metrics configured successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = (orders || []).filter((o) => {
    if (statusFilter === 'all') return true;
    return o.orderStatus === statusFilter;
  });

  return (
    <div className="space-y-8 text-white">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Fulfillment and dispatches ledger</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Orders Portal</h1>
        </div>
      </div>

      {/* Filter and stats */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap gap-3">
        {['all', 'placed', 'processing', 'shipped', 'delivered', 'cancelled', 'return_requested', 'exchange_requested'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
              statusFilter === st ? 'bg-orange-600 text-white' : 'bg-slate-950 text-gray-400 hover:text-white'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-slate-950/20">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Totals</th>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{o.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-300">{o.customerName}</p>
                    <p className="text-[10px] text-gray-500 font-semibold">{o.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-orange-500">₹{o.total}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-mono">{o.paymentMethod} • {o.paymentStatus}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-200">{o.trackingNumber || 'NA'}</p>
                    <p className="text-[10px] text-gray-500 truncate max-w-xs">{o.trackingStatus || 'Pending packaging.'}</p>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      o.orderStatus === 'delivered' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {o.orderStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetails(o)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase rounded flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Eye size={12} /> Dispatch Config
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details / Edit Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-y-auto max-h-[90vh] w-full max-w-3xl text-white shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <ClipboardList size={16} className="text-orange-500" /> ORDER DISPATCH CONTROL REPORT: {selectedOrder.id}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300">
              
              {/* Left Column: Shipment specs */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                  <p className="font-bold text-white uppercase tracking-wider">Customer Contact Blueprint</p>
                  <p className="font-semibold">Recipient: {selectedOrder.shippingAddress.name}</p>
                  <p className="font-semibold">Phone: {selectedOrder.shippingAddress.phone}</p>
                  <p className="text-gray-400">
                    Address: {selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.addressLine2 && `${selectedOrder.shippingAddress.addressLine2}, `}{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                  </p>
                  {selectedOrder.gstInvoiceRequested && (
                    <div className="mt-2.5 p-2 bg-orange-950/20 border border-orange-900 text-orange-400 rounded">
                      <p className="font-bold">B2B GSTIN INVOICE REQUESTED</p>
                      <p className="font-mono text-[10px] mt-0.5">GSTIN: {selectedOrder.gstNumber}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                  <p className="font-bold text-white uppercase tracking-wider">Items in Order Package</p>
                  <div className="space-y-2.5">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center gap-3 text-[11px]">
                        <div className="flex items-center gap-2">
                          <img src={item.productImage} alt="" className="w-8 h-10 object-cover rounded border border-slate-800" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-slate-200 capitalize">{item.productName}</p>
                            <p className="text-[9.5px] text-gray-500 font-mono">SKU: {item.sku} • {item.size}/{item.color} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Dispatch configurations */}
              <form onSubmit={handleSaveDetails} className="space-y-4 bg-slate-950/25 border border-slate-800 p-5 rounded-xl">
                <p className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">Status Settings</p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Fulfillment Status</label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                    >
                      <option value="placed">Order Placed</option>
                      <option value="processing">Warehouse Processing</option>
                      <option value="shipped">Dispatched / Shipped</option>
                      <option value="delivered">Delivered to client</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="return_requested">Return Requested</option>
                      <option value="returned">Returned</option>
                      <option value="exchange_requested">Exchange Requested</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed / Bounced</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Courier tracking ID / AWB Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Courier Status Description</label>
                  <input
                    type="text"
                    value={trackingStatus}
                    onChange={(e) => setTrackingStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-lg tracking-wider cursor-pointer shadow-lg mt-4 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={13} /> Update Dispatch Parameters
                </button>
              </form>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
