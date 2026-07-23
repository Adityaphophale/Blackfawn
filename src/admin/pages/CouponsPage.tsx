import React, { useState } from 'react';
import { Ticket, Plus, Trash2 } from 'lucide-react';
import { Coupon } from '../../shared/types';

interface CouponsPageProps {
  coupons: Coupon[];
  onCreateCoupon: (c: Partial<Coupon>) => Promise<any>;
  onDeleteCoupon: (id: string) => Promise<any>;
}

export default function CouponsPage({ coupons, onCreateCoupon, onDeleteCoupon }: CouponsPageProps) {
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(10);
  const [minPurchase, setMinPurchase] = useState(0);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    try {
      const res = await onCreateCoupon({
        code: code.toUpperCase(),
        type,
        value: Number(value),
        minPurchase: Number(minPurchase),
        description,
      });
      if (res.success) {
        setCode('');
        setDescription('');
        setMinPurchase(0);
        setValue(10);
        alert('Coupon campaign deployed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 text-white">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Promotions and Campaigns</span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Coupons Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Create form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 h-fit">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Deploy Coupon Campaign</h2>
          
          <div className="text-xs space-y-3.5">
            <div>
              <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Promo Code (Voucher Code)</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="FESTIVE300"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500 uppercase font-mono tracking-wider"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Discount Type</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Cash (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Value</label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Minimum Order Value (₹)</label>
              <input
                type="number"
                required
                value={minPurchase}
                onChange={(e) => setMinPurchase(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Description Campaign</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Save flat ₹300 above ₹2,499"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[10.5px] font-bold uppercase rounded flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus size={12} /> Deploy Coupon Vouchers
          </button>
        </form>

        {/* Right Side: Active table list */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Active Campaign Codes</h2>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {coupons.map((c) => (
              <div key={c.id} className="flex justify-between items-center p-4 bg-slate-950/30 border border-slate-850 rounded-xl text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Ticket size={14} className="text-orange-500" />
                    <span className="font-black text-slate-200 uppercase tracking-widest font-mono text-sm">{c.code}</span>
                    <span className="bg-slate-850 border border-slate-800 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      {c.type === 'percentage' ? `${c.value}% Off` : `₹${c.value} Off`}
                    </span>
                  </div>
                  <p className="text-gray-500 font-semibold">{c.description}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Min Order: ₹{c.minPurchase} • Redeemed: {c.usageCount} times</p>
                </div>

                <button
                  onClick={() => { if(confirm('Delete coupon?')) onDeleteCoupon(c.id); }}
                  className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-red-400 rounded cursor-pointer"
                  title="Delete Coupon"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
