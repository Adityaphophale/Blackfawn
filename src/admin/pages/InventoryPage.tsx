import React, { useState, useEffect } from 'react';
import { Package, Search, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface InventoryItem {
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState(0);

  const fetchInventory = () => {
    fetch('/api/admin/inventory', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (variantId: string) => {
    try {
      const res = await fetch(`/api/admin/inventory/${variantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ stock: stockInput }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-white">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Warehouse inventory controls</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Stock Ledger</h1>
        </div>
      </div>

      {/* Filter and search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search variant item by SKU or product name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-orange-500"
          />
        </div>
        <button
          onClick={fetchInventory}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stock Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-slate-950/20">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Size / Color</th>
                <th className="py-3 px-4">Reserved Stock</th>
                <th className="py-3 px-4">Warehouse Stock</th>
                <th className="py-3 px-4 text-right">Clearance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredInventory.map((item) => (
                <tr key={item.variantId} className="hover:bg-slate-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white uppercase">{item.productName}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-orange-500">{item.sku}</td>
                  <td className="py-3.5 px-4 uppercase text-[10px] text-slate-300">
                    {item.size} / {item.color}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                    {item.reservedStock} units
                  </td>
                  <td className="py-3.5 px-4">
                    {editingId === item.variantId ? (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          value={stockInput}
                          onChange={(e) => setStockInput(Number(e.target.value))}
                          className="w-16 bg-slate-950 border border-slate-700 text-xs text-white p-1 text-center font-mono rounded"
                        />
                        <button
                          onClick={() => handleUpdateStock(item.variantId)}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 bg-slate-800 text-gray-400 rounded text-[10px] font-bold hover:text-white cursor-pointer"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[11px] font-bold ${item.stock <= 5 ? 'text-red-500' : 'text-slate-200'}`}>
                          {item.stock} units
                        </span>
                        {item.stock <= 5 && <AlertTriangle size={12} className="text-red-500 animate-pulse" />}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {editingId !== item.variantId && (
                      <button
                        onClick={() => {
                          setEditingId(item.variantId);
                          setStockInput(item.stock);
                        }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase rounded cursor-pointer"
                      >
                        Adjust Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
