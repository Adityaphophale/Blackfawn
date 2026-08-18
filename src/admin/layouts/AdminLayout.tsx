import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  Tags, 
  Ticket, 
  MessageSquare, 
  BookOpen, 
  ShieldAlert, 
  LogOut, 
  ArrowLeft,
  ChevronRight,
  Gift,
  Settings
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  currentUser: any;
  onLogout: () => void;
  setTab: (tab: string) => void;
}

export default function AdminLayout({
  children,
  activeSubTab,
  setActiveSubTab,
  currentUser,
  onLogout,
  setTab,
}: AdminLayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Analytics Hub', icon: <LayoutDashboard size={14} /> },
    { id: 'products', label: 'Apparel Drop List', icon: <Package size={14} /> },
    { id: 'campaigns', label: 'Festival Campaigns', icon: <Gift size={14} /> },
    { id: 'navigation', label: 'Mega Navigation', icon: <Tags size={14} /> },
    { id: 'hampers', label: 'Hampers & Gifting', icon: <Gift size={14} /> },
    { id: 'inventory', label: 'Stock Ledger', icon: <ShoppingCart size={14} /> },
    { id: 'orders', label: 'Fulfillment Orders', icon: <ClipboardList size={14} /> },
    { id: 'categories', label: 'Categories / Drops', icon: <Tags size={14} /> },
    { id: 'coupons', label: 'Coupons Center', icon: <Ticket size={14} /> },
    { id: 'reviews', label: 'Review Moderation', icon: <MessageSquare size={14} /> },
    { id: 'returns', label: 'Return Requests', icon: <ShieldAlert size={14} /> },
    { id: 'giftcards', label: 'Gift Vouchers', icon: <Gift size={14} /> },
    { id: 'blogs', label: 'Editorial Blogs', icon: <BookOpen size={14} /> },
    { id: 'settings', label: 'Business Settings', icon: <Settings size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-gray-200 flex">
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col justify-between h-screen fixed top-0 left-0 z-30">
        <div className="flex-1 overflow-y-auto py-6">
          {/* Brand/System Logo */}
          <div className="px-6 pb-6 border-b border-slate-800">
            <button
              onClick={() => setTab('home')}
              className="flex items-center gap-1.5 text-lg font-black tracking-widest text-white uppercase text-left hover:opacity-90 cursor-pointer"
            >
              <span>BLACK<span className="text-[#C9A227]">FAWN</span></span>
              <span className="text-[8px] bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 px-1 py-0.5 rounded font-black tracking-wider uppercase ml-1">SYSTEM</span>
            </button>
          </div>

          {/* User badge */}
          {currentUser && (
            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
              <div className="h-8 w-8 bg-slate-800 text-[#C9A227] font-bold rounded-full flex items-center justify-center text-xs uppercase border border-slate-700">
                {currentUser.name.substring(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate capitalize">{currentUser.name}</p>
                <p className="text-[9.5px] text-gray-500 truncate">{currentUser.email}</p>
              </div>
            </div>
          )}

          {/* Menu items */}
          <nav className="px-3 py-4 space-y-0.5 text-xs font-bold">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                  activeSubTab === item.id 
                    ? 'bg-[#C9A227] text-black font-extrabold shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {activeSubTab === item.id && <ChevronRight size={12} />}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Navigation Back Button */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setTab('home')}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft size={13} className="text-[#C9A227]" /> Return To Storefront
          </button>
          
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut size={13} /> Exit Admin Portal
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 ml-64 p-6 sm:p-10 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
