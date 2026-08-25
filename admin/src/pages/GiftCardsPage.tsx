import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, RefreshCw } from 'lucide-react';
import { GiftCard } from '../../../shared/types/types.ts';

export default function GiftCardsPage() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [balance, setBalance] = useState(1000);

  const fetchCards = () => {
    fetch('/api/admin/giftcards', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/giftcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ balance }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Digital Gift Card Voucher generated successfully.');
        setBalance(1000);
        fetchCards();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 text-white">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Pre-paid wallet cards</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Gift Cards</h1>
        </div>
        <button
          onClick={fetchCards}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Create Card Form */}
        <form onSubmit={handleCreateCard} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 h-fit">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Generate Card Voucher</h2>
          
          <div className="text-xs space-y-3">
            <div>
              <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Initial Balance (₹)</label>
              <input
                type="number"
                required
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[10.5px] font-bold uppercase rounded flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus size={12} /> Create Gift Voucher
          </button>
        </form>

        {/* Gift Cards list */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Voucher Records</h2>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {cards.map((c) => (
              <div key={c.id} className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl text-xs flex justify-between items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-orange-500" />
                    <span className="font-mono text-sm font-black text-slate-200 uppercase tracking-widest">{c.code}</span>
                  </div>
                  <p className="text-gray-500 font-semibold">Voucher Code Balance: <span className="text-white font-bold">₹{c.balance}</span> / Initial: ₹{c.initialBalance}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Expires: {new Date(c.expiryDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${c.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                  {c.isActive ? 'Active' : 'Redeemed'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
