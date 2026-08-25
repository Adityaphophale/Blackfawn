import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Image, Sparkles, X, Gift, CheckCircle, Save } from 'lucide-react';
import { Product } from '../../../shared/types/types.ts';
import RichTextEditor from '../components/RichTextEditor';

interface HampersPageProps {
  products: Product[];
  categories: any[];
  collections: any[];
  onCreateProduct: (p: Partial<Product>) => Promise<any>;
  onUpdateProduct: (id: string, p: Partial<Product>) => Promise<any>;
  onDeleteProduct: (id: string) => Promise<any>;
}

const EXISTING_PUBLIC_IMAGES = [
  "/1.jpeg",
  "/2.jpeg",
  "/3.jpeg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpeg",
  "/7.jpeg",
  "/8.jpeg",
  "/9.jpeg",
  "/10.jpeg",
  "/11.jpeg",
  "/12.jpeg",
  "/13.jpeg",
  "/14.jpeg"
];

const HAMPER_COLLECTIONS = [
  "Premium Gift Hampers",
  "Personalized Hampers",
  "Corporate Hampers",
  "Festival Hampers",
  "Couple Hampers",
  "Kids Hampers"
];

export default function HampersPage({
  products,
  collections,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}: HampersPageProps) {
  const hampersList = products.filter(p => p.category === 'Hampers & Gifting');

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [collection, setCollection] = useState('Premium Gift Hampers');
  const [price, setPrice] = useState(3999);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(3499);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [includedItemsText, setIncludedItemsText] = useState('');
  const [stock, setStock] = useState(25);
  const [images, setImages] = useState<string[]>(['/1.jpeg']);
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [giftMessageEnabled, setGiftMessageEnabled] = useState(true);

  const resetForm = () => {
    setName('');
    setSku('');
    setSlug('');
    setCollection('Premium Gift Hampers');
    setPrice(3999);
    setDiscountPrice(3499);
    setShortDescription('');
    setDescription('');
    setIncludedItemsText('');
    setStock(25);
    setImages(['/1.jpeg']);
    setStatus('active');
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(false);
    setSeoTitle('');
    setSeoDescription('');
    setGiftMessageEnabled(true);
    setCurrentId('');
    setIsEditMode(false);
  };

  const handleEditClick = (p: Product) => {
    setIsEditMode(true);
    setCurrentId(p.id);
    setName(p.name);
    setSku(p.baseSku || p.variants?.[0]?.sku || '');
    setSlug(p.slug || '');
    setCollection(p.collection || 'Premium Gift Hampers');
    setPrice(p.price);
    setDiscountPrice(p.discountPrice);
    setShortDescription(p.shortDescription || '');
    setDescription(p.description || '');
    setStock(p.variants?.[0]?.stock ?? 25);
    setImages(p.images && p.images.length > 0 ? p.images : ['/1.jpeg']);
    setStatus(p.status === 'draft' ? 'draft' : 'active');
    setIsFeatured(!!p.isFeatured);
    setIsBestSeller(!!p.isBestSeller);
    setIsNewArrival(!!p.isNewArrival);
    setSeoTitle(p.seo?.title || '');
    setSeoDescription(p.seo?.description || '');
    setShowModal(true);
  };

  const toggleImageSelection = (imgUrl: string) => {
    if (images.includes(imgUrl)) {
      if (images.length > 1) {
        setImages(images.filter(i => i !== imgUrl));
      }
    } else {
      setImages([...images, imgUrl]);
    }
  };

  const setMainImage = (imgUrl: string) => {
    setImages([imgUrl, ...images.filter(i => i !== imgUrl)]);
  };

  const handleSave = async (targetStatus: 'active' | 'draft') => {
    if (!name.trim()) {
      alert('Please enter a hamper name.');
      return;
    }

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const generatedSku = sku.trim() || `HAMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    let fullDescription = description;
    if (includedItemsText.trim()) {
      const itemsList = includedItemsText.split('\n').filter(i => i.trim());
      fullDescription += `<h3>Included In This Box</h3><ul>${itemsList.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
    }

    const payload: Partial<Product> = {
      name,
      slug: generatedSlug,
      category: 'Hampers & Gifting',
      collection,
      shortDescription,
      description: fullDescription,
      brand: 'BLACKFAWN',
      baseSku: generatedSku,
      material: 'Luxury Gift Packaging',
      fabric: 'Satin & Velvet Box',
      fit: 'Gift Hamper Box',
      gender: 'unisex',
      gstRate: 18,
      tags: ['Hamper', 'Gift Box', collection],
      seo: {
        title: seoTitle || `${name} | BLACKFAWN Hampers & Gifting`,
        description: seoDescription || shortDescription || name,
        keywords: 'gift hamper, corporate gift, luxury box',
      },
      status: targetStatus,
      isFeatured,
      isBestSeller,
      isNewArrival,
      images,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      variants: [
        {
          id: `var-${Math.random().toString(36).substr(2, 9)}`,
          sku: generatedSku,
          size: 'Standard Gift Box',
          color: 'Black & Gold',
          price: Number(price),
          salePrice: discountPrice ? Number(discountPrice) : undefined,
          stock: Number(stock),
          reservedStock: 0,
          availableStock: Number(stock),
          images,
        }
      ]
    };

    if (isEditMode) {
      await onUpdateProduct(currentId, payload);
    } else {
      await onCreateProduct(payload);
    }

    setShowModal(false);
    resetForm();
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#C9A227] tracking-widest uppercase flex items-center gap-1">
            <Gift size={13} /> BLACKFAWN Gifting Management
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Hampers & Gifting</h1>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-[#C9A227] hover:bg-yellow-600 text-black text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg transition-colors"
        >
          <Plus size={14} /> Create New Hamper
        </button>
      </div>

      {/* Table grid listing */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-slate-950/40">
                <th className="py-3.5 px-4">Hamper Details</th>
                <th className="py-3.5 px-4">Collection</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {hampersList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No hampers created yet. Click "Create New Hamper" to add one.
                  </td>
                </tr>
              ) : (
                hampersList.map((p) => {
                  const itemStock = p.variants?.[0]?.stock ?? 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-950/30 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={p.images?.[0] || '/1.jpeg'}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded border border-slate-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-white uppercase">{p.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">SKU: {p.baseSku || p.id}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {p.collection || 'General Gifting'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#C9A227]">
                        ₹{p.discountPrice || p.price}
                        {p.discountPrice && (
                          <span className="text-[10px] text-gray-500 line-through ml-1.5 font-normal">₹{p.price}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${itemStock > 5 ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                          {itemStock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          p.status === 'draft' 
                            ? 'bg-amber-900/30 text-amber-400 border border-amber-800' 
                            : 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
                        }`}>
                          {p.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer transition-colors"
                          title="Edit Hamper"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete hamper "${p.name}"?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded cursor-pointer transition-colors"
                          title="Delete Hamper"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Hamper Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl text-xs font-medium">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#C9A227] uppercase">BLACKFAWN Atelier</span>
                <h2 className="text-lg font-bold text-white uppercase mt-0.5">
                  {isEditMode ? 'Edit Hamper Product' : 'Add New Gift Hamper'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave('active'); }} className="space-y-6">
              {/* Row 1: Name, SKU, Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Hamper Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Black & Gold Box"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Row 2: Collection, Price, Sale Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Collection *</label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
                  >
                    {HAMPER_COLLECTIONS.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice || ''}
                    onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Existing Public Images Picker */}
              <div className="space-y-2 border border-slate-800 p-4 rounded-lg bg-slate-950/40">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider">
                    Select Images from Public Assets (/public) *
                  </label>
                  <span className="text-[10px] text-gray-400">Click to add/remove. First image = Main.</span>
                </div>
                <div className="grid grid-cols-7 gap-2 pt-2">
                  {EXISTING_PUBLIC_IMAGES.map((imgUrl, i) => {
                    const isSelected = images.includes(imgUrl);
                    const isMain = images[0] === imgUrl;
                    return (
                      <div
                        key={i}
                        onClick={() => toggleImageSelection(imgUrl)}
                        className={`relative aspect-square rounded overflow-hidden cursor-pointer border-2 transition-all ${
                          isMain 
                            ? 'border-[#C9A227] ring-2 ring-[#C9A227]/40 scale-102' 
                            : isSelected 
                            ? 'border-emerald-500' 
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Asset ${i}`} className="w-full h-full object-cover" />
                        {isMain && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#C9A227] text-black text-[8px] font-bold text-center py-0.5 uppercase">
                            Main
                          </span>
                        )}
                        {isSelected && !isMain && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setMainImage(imgUrl); }}
                            className="absolute top-1 right-1 bg-black/80 text-[8px] text-yellow-400 px-1 rounded hover:bg-black"
                          >
                            Set Main
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Or Add Custom Image URL (Paste URL to replace temporary imagery)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or /custom_photo.jpg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val && !images.includes(val)) {
                            setImages([val, ...images]);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#C9A227]"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const inputEl = (e.currentTarget.previousElementSibling as HTMLInputElement);
                        const val = inputEl?.value?.trim();
                        if (val && !images.includes(val)) {
                          setImages([val, ...images]);
                          inputEl.value = '';
                        }
                      }}
                      className="px-3 py-1.5 bg-[#C9A227] text-black text-xs font-bold uppercase rounded hover:bg-yellow-500 cursor-pointer"
                    >
                      Add Image URL
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-gray-300">
                        <span className="truncate max-w-[150px] font-mono">{img}</span>
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300 ml-1 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Short Summary</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief 1-liner summary for catalog display"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Full Description (HTML Supported)</label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Describe the hamper story, packaging details, and luxury feel..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Included Products (1 per line)</label>
                  <textarea
                    rows={3}
                    value={includedItemsText}
                    onChange={(e) => setIncludedItemsText(e.target.value)}
                    placeholder={"Handcrafted Journal\nBrass Pen\nSoy Candle 200g"}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white outline-none focus:border-[#C9A227] font-mono"
                  />
                </div>
              </div>

              {/* Badges and Flags */}
              <div className="flex flex-wrap gap-6 p-4 border border-slate-800 rounded-lg bg-slate-950/20">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded accent-[#C9A227]"
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded accent-[#C9A227]"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded accent-[#C9A227]"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={giftMessageEnabled}
                    onChange={(e) => setGiftMessageEnabled(e.target.checked)}
                    className="rounded accent-[#C9A227]"
                  />
                  <span>Enable Free Gift Card Message</span>
                </label>
              </div>

              {/* SEO Meta */}
              <div className="space-y-3 p-4 border border-slate-800 rounded-lg bg-slate-950/20">
                <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider">SEO Search Engine Optimization</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase">SEO Title</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Meta Page Title"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase">SEO Description</label>
                    <input
                      type="text"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Meta Description snippet"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} /> Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C9A227] hover:bg-yellow-600 text-black text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={14} /> Publish Hamper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
