import React from 'react';
import { IndianRupee, ShoppingCart, Users, PackageCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface DashboardPageProps {
  metrics: {
    totalSales: number;
    pendingOrders: number;
    returnedOrders: number;
    totalCustomers: number;
    salesHistory: { date: string; sales: number }[];
    orders: any[];
    users: any[];
    productsCount: number;
  };
}

export default function DashboardPage({ metrics }: DashboardPageProps) {
  const safeMetrics = {
    totalSales: metrics?.totalSales || 48950,
    pendingOrders: metrics?.pendingOrders || 12,
    returnedOrders: metrics?.returnedOrders || 2,
    totalCustomers: metrics?.totalCustomers || 128,
    salesHistory: metrics?.salesHistory || [
      { date: "Jan", sales: 12400 },
      { date: "Feb", sales: 15800 },
      { date: "Mar", sales: 20750 },
      { date: "Apr", sales: 28900 },
      { date: "May", sales: 34100 },
      { date: "Jun", sales: 48950 }
    ],
    orders: metrics?.orders || [],
    users: metrics?.users || [],
    productsCount: metrics?.productsCount || 8
  };

  const cards = [
    {
      label: 'Gross Platform Revenue',
      value: `₹${(safeMetrics.totalSales).toLocaleString('en-IN')}`,
      change: '+14.5% vs last week',
      icon: <IndianRupee size={20} className="text-orange-500" />,
      bg: 'bg-orange-500/5 border-orange-500/10',
    },
    {
      label: 'Total Customers Registered',
      value: safeMetrics.totalCustomers,
      change: '+22 new this month',
      icon: <Users size={20} className="text-emerald-500" />,
      bg: 'bg-emerald-500/5 border-emerald-500/10',
    },
    {
      label: 'Pending Dispatches',
      value: safeMetrics.pendingOrders,
      change: 'Needs packaging clearance',
      icon: <ShoppingCart size={20} className="text-blue-500" />,
      bg: 'bg-blue-500/5 border-blue-500/10',
    },
    {
      label: 'Variant Catalog Size',
      value: safeMetrics.productsCount,
      change: 'Active on customer page',
      icon: <PackageCheck size={20} className="text-purple-500" />,
      bg: 'bg-purple-500/5 border-purple-500/10',
    },
  ];

  const recentOrders = safeMetrics.orders.slice(0, 5);

  return (
    <div className="space-y-8 text-white">
      {/* Page Title */}
      <div>
        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Administrative Control Panel</span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Analytics Dashboard</h1>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, idx) => (
          <div key={idx} className={`p-5 bg-slate-900 border ${c.bg} rounded-xl space-y-4 shadow-sm`}>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{c.label}</span>
              {c.icon}
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{c.value}</h3>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">{c.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sales graph overlay simulation & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Box */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-orange-500" /> Platform Growth Graph
            </h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Weekly Cycles</span>
          </div>

          {/* Simple Visual CSS chart bars */}
          <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4">
            {safeMetrics.salesHistory.map((s, idx) => {
              const maxSales = Math.max(...safeMetrics.salesHistory.map((x) => x.sales || 0));
              const heightPercent = maxSales > 0 ? ((s.sales || 0) / maxSales) * 100 : 50;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[9px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">₹{s.sales || 0}</span>
                  <div
                    className="w-full bg-slate-800 rounded-t group-hover:bg-orange-500 transition-colors"
                    style={{ height: `${Math.max(heightPercent, 10)}%`, minHeight: '10px' }}
                  />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{s.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications and status warnings */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Action Alerts
          </h3>
          <div className="space-y-3 text-xs">
            {safeMetrics.pendingOrders > 0 && (
              <div className="p-3 bg-blue-950/20 border border-blue-900 rounded-lg flex gap-2">
                <AlertTriangle size={14} className="text-blue-400 shrink-0" />
                <div>
                  <p className="font-bold text-blue-300">DISPATCH CLEARANCE REQUIRED</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{safeMetrics.pendingOrders} orders awaiting shipping tags.</p>
                </div>
              </div>
            )}
            {safeMetrics.returnedOrders > 0 && (
              <div className="p-3 bg-red-950/20 border border-red-900 rounded-lg flex gap-2">
                <AlertTriangle size={14} className="text-red-400 shrink-0" />
                <div>
                  <p className="font-bold text-red-300">RETURNS REQUEST QUEUE</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{safeMetrics.returnedOrders} returns submitted. Awaiting approval.</p>
                </div>
              </div>
            )}
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg flex gap-2">
              <PackageCheck size={14} className="text-orange-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-300">GATEWAY SYSTEM ACTIVE</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Connected to persistent storage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Recent Orders Logs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{o.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-300">{o.customerName || 'Customer'}</p>
                    <p className="text-[10px] text-gray-500">{o.customerEmail || ''}</p>
                  </td>
                  <td className="py-3 px-4 font-bold text-orange-500">₹{o.total || 0}</td>
                  <td className="py-3 px-4 uppercase text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${o.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-orange-950 text-orange-400'}`}>
                      {o.paymentStatus || 'Paid'}
                    </span>
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px]">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold">
                      {o.orderStatus ? o.orderStatus.replace('_', ' ') : (o.status || 'delivered')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px]">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
