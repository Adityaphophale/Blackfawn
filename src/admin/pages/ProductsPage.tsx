import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Image, Sparkles, X, Settings, Upload } from 'lucide-react';
import { Product, ProductVariant } from '../../shared/types';
import RichTextEditor from '../components/RichTextEditor';

interface ProductsPageProps {
  products: Product[];
  categories: any[];
  collections: any[];
  onCreateProduct: (p: Partial<Product>) => Promise<any>;
  onUpdateProduct: (id: string, p: Partial<Product>) => Promise<any>;
  onDeleteProduct: (id: string) => Promise<any>;
}

export default function ProductsPage({
  products,
  categories,
  collections,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductsPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Oversized');
  const [collection, setCollection] = useState('Core classics');
  const [price, setPrice] = useState(1499);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [fit, setFit] = useState('Oversized');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Variant generator builder helper fields
  const [variantSizes, setVariantSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [variantColors, setVariantColors] = useState<string[]>(['Charcoal Black', 'Chalk White']);
  const [variantWeight, setVariantWeight] = useState(350);

  const resetForm = () => {
    setName('');
    setCategory('Oversized');
    setCollection('Core classics');
    setPrice(1499);
    setSalePrice(undefined);
    setDescription('');
    setFit('Oversized');
    setIsFeatured(false);
    setIsLimited(false);
    setImages([]);
    setImageUrlInput('');
    setCurrentId('');
    setIsEditMode(false);
  };

  const handleEditClick = (p: Product) => {
    setIsEditMode(true);
    setCurrentId(p.id);
    setName(p.name);
    setCategory(p.category);
    setCollection(p.collection || '');
    setPrice(p.variants?.[0]?.price || p.price);
    setSalePrice(p.variants?.[0]?.salePrice || p.discountPrice);
    setDescription(p.description);
    setFit(p.fit);
    setIsFeatured(!!p.isFeatured);
    setIsLimited(!!p.isLimited);
    setImages(p.images || []);
    setShowModal(true);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        if (resultUrl) {
          try {
            const token = localStorage.getItem('blackfawn_token') || localStorage.getItem('token');
            const res = await fetch('/api/admin/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ fileData: resultUrl, fileName: file.name }),
            });
            const data = await res.json();
            if (data.url) {
              setImages((prev) => [...prev, data.url]);
            }
          } catch (err) {
            setImages((prev) => [...prev, resultUrl]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUploadImage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!imageUrlInput.trim()) return;

    try {
      const token = localStorage.getItem('blackfawn_token') || localStorage.getItem('token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ fileData: '', fileName: imageUrlInput }),
      });
      const data = await res.json();
      if (data.url) {
        setImages((prev) => [...prev, data.url]);
        setImageUrlInput('');
      }
    } catch (err) {
      setImages((prev) => [...prev, imageUrlInput]);
      setImageUrlInput('');
    }
  };

  const generateVariants = (): ProductVariant[] => {
    const variants: ProductVariant[] = [];
    variantSizes.forEach((sz) => {
      variantColors.forEach((col) => {
        variants.push({
          id: `var-${Math.random().toString(36).substr(2, 9)}`,
          sku: `${name.substring(0, 8).toUpperCase().replace(/ /g, '-')}-${sz}-${col.substring(0, 3).toUpperCase()}`,
          size: sz,
          color: col,
          price: Number(price),
          salePrice: salePrice ? Number(salePrice) : undefined,
          stock: 30,
          reservedStock: 0,
          availableStock: 30,
          weight: variantWeight,
          dimensions: '30x25x3 cm',
          images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'],
        });
      });
    });
    return variants;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload: Partial<Product> = {
      name,
      category,
      collection,
      description,
      fit,
      isFeatured,
      isLimited,
      isNewArrival: true,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'],
      status: 'active',
    };

    if (isEditMode) {
      await onUpdateProduct(currentId, payload);
    } else {
      payload.variants = generateVariants();
      payload.price = price;
      payload.discountPrice = salePrice;
      await onCreateProduct(payload);
    }

    setShowModal(false);
    resetForm();
  };

  return (
    <div className="space-y-8 text-white">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Variant Catalog control</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Apparel Catalog</h1>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Table grid listing */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-slate-950/20">
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Base Pricing</th>
                <th className="py-3 px-4">Active Variants</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((p) => {
                const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img src={p.images?.[0]} alt="" className="w-9 h-11 object-cover rounded border border-slate-800 shrink-0" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-white uppercase">{p.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-mono">ID: {p.id}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">{p.category}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{p.fit} Fit</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-orange-500">
                      ₹{p.discountPrice || p.price}
                      {p.discountPrice && <span className="text-[10px] text-gray-500 line-through ml-1.5 font-semibold">₹{p.price}</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-bold">
                        {p.variants?.length || 0} Variants ({totalStock} Stock)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 space-x-1">
                      {p.isFeatured && <span className="text-[9px] bg-orange-600/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded font-bold">Featured</span>}
                      {p.isLimited && <span className="text-[9px] bg-purple-600/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-bold">Limited</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => { if(confirm('Delete product?')) onDeleteProduct(p.id); }}
                        className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-red-400 rounded cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-y-auto max-h-[90vh] w-full max-w-3xl text-white shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <Settings size={16} className="text-orange-500" /> {isEditMode ? 'Modify Apparel Drop Info' : 'Create New Apparel Drop'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Fit Type</label>
                  <input
                    type="text"
                    required
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Category Selection</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Base Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Sale Price (Optional, ₹)</label>
                  <input
                    type="number"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              {/* Rich Text Editor for WYSIWYG Descriptions */}
              <div className="space-y-1">
                <label className="block text-gray-400 font-bold uppercase text-[10px]">Description & Story details (WYSIWYG Editor)</label>
                <RichTextEditor value={description} onChange={setDescription} />
              </div>

              {/* Image Uploading tools */}
              <div className="space-y-2 border-t border-slate-800 pt-4">
                <label className="block text-gray-400 font-bold uppercase text-[10px]">Product Image Gallery</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Upload size={14} /> Upload Image File
                  </button>

                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Or paste image URL"
                      className="bg-slate-950 border border-slate-850 px-3 py-1.5 text-xs text-white rounded flex-1 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded text-white cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-14 h-18 rounded overflow-hidden border border-slate-800">
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-0 right-0 bg-red-600 text-white p-0.5 text-[9px] font-bold"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variant Auto Generation configs */}
              {!isEditMode && (
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3.5 text-xs text-gray-400">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> Variant Configuration Builder
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">Sizes (Comma separated)</label>
                      <input
                        type="text"
                        value={variantSizes.join(',')}
                        onChange={(e) => setVariantSizes(e.target.value.split(',').map((x) => x.trim()))}
                        className="w-full bg-slate-900 border border-slate-850 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">Colors (Comma separated)</label>
                      <input
                        type="text"
                        value={variantColors.join(',')}
                        onChange={(e) => setVariantColors(e.target.value.split(',').map((x) => x.trim()))}
                        className="w-full bg-slate-900 border border-slate-850 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs font-bold pt-4 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-slate-800 text-orange-500"
                  />
                  <span>Feature on Homepage Slider</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLimited}
                    onChange={(e) => setIsLimited(e.target.checked)}
                    className="rounded border-slate-800 text-orange-500"
                  />
                  <span>Limited Drop Collection</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-lg tracking-wider cursor-pointer shadow-lg mt-6"
              >
                {isEditMode ? 'Modify Apparel Drop Record' : 'Deploy Apparel Drop'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
