import React, { useState } from 'react';
import { Plus, Tag, RefreshCw } from 'lucide-react';

interface CategoriesPageProps {
  categories: any[];
  collections: any[];
  onCreateCategory: (cat: any) => Promise<any>;
  onCreateCollection: (coll: any) => Promise<any>;
}

export default function CategoriesPage({
  categories,
  collections,
  onCreateCategory,
  onCreateCollection,
}: CategoriesPageProps) {
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [collName, setCollName] = useState('');

  const handleCreateCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    const res = await onCreateCategory({ name: catName, description: catDesc });
    if (res.success) {
      setCatName('');
      setCatDesc('');
      alert('Department Category added.');
    }
  };

  const handleCreateColl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collName) return;
    const res = await onCreateCollection({ name: collName });
    if (res.success) {
      setCollName('');
      alert('Brand Drop Collection added.');
    }
  };

  return (
    <div className="space-y-8 text-white">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Hierarchy & grouping control</span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Categories & Collections</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Active Categories</h2>
          
          <form onSubmit={handleCreateCat} className="space-y-4 bg-slate-950/20 p-4 border border-slate-800 rounded-lg">
            <h3 className="text-[10.5px] font-bold text-orange-500 uppercase tracking-wider">Create Category</h3>
            <div className="text-xs space-y-3">
              <div>
                <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Category Name</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Description</label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-[10.5px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Add Category
            </button>
          </form>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {categories.map((c) => (
              <div key={c.id} className="p-3 bg-slate-950/30 border border-slate-850 rounded-lg text-xs">
                <p className="font-bold text-slate-200 capitalize">{c.name}</p>
                <p className="text-gray-500 mt-0.5">{c.description || 'No description provided.'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Collections Drop Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Drop Collections</h2>
          
          <form onSubmit={handleCreateColl} className="space-y-4 bg-slate-950/20 p-4 border border-slate-800 rounded-lg">
            <h3 className="text-[10.5px] font-bold text-orange-500 uppercase tracking-wider">Create drop Collection</h3>
            <div className="text-xs space-y-3">
              <div>
                <label className="block text-gray-500 font-bold mb-1 uppercase text-[9px]">Collection Name</label>
                <input
                  type="text"
                  required
                  value={collName}
                  onChange={(e) => setCollName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-[10.5px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Add Collection
            </button>
          </form>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {collections.map((c) => (
              <div key={c.id} className="p-3 bg-slate-950/30 border border-slate-850 rounded-lg text-xs flex justify-between items-center">
                <span className="font-bold text-slate-200 capitalize">{c.name}</span>
                <span className="text-[9px] bg-slate-800 text-slate-400 border border-slate-750 px-2 py-0.5 rounded font-bold uppercase tracking-wider">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
