import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Image, Sparkles, X, Settings, Upload, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../shared/types';
import RichTextEditor from '../components/RichTextEditor';
import { TOP_LEVEL_CATEGORIES, CROSS_CUTTING_COLLECTIONS } from '../../shared/taxonomy';

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
  const [category, setCategory] = useState('T-Shirts');
  const [subCategory, setSubCategory] = useState('');
  const [collection, setCollection] = useState('New Arrivals');
  const [selectedCollections, setSelectedCollections] = useState<string[]>(['New Arrivals']);
  const [gender, setGender] = useState<'Men' | 'Women' | 'Kids' | 'Unisex'>('Men');
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [price, setPrice] = useState(999);
  const [salePrice, setSalePrice] = useState<number | undefined>(799);
  const [description, setDescription] = useState('');
  const [fit, setFit] = useState('Regular');
  const [material, setMaterial] = useState('100% Cotton');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Variant builder helper fields
  const [variantSizes, setVariantSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [variantColors, setVariantColors] = useState<string[]>(['Black', 'White']);
  const [variantWeight, setVariantWeight] = useState(250);

  const resetForm = () => {
    setName('');
    setCategory('T-Shirts');
    setSubCategory('');
    setCollection('New Arrivals');
    setSelectedCollections(['New Arrivals']);
    setGender('Men');
    setIsPersonalized(false);
    setPrice(999);
    setSalePrice(799);
    setDescription('');
    setFit('Regular');
    setMaterial('100% Cotton');
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
    setSubCategory(p.subCategory || '');
    setCollection(p.collection || 'New Arrivals');
    setSelectedCollections(p.collections || [p.collection || 'New Arrivals']);
    setGender((p.gender as any) || 'Men');
    setIsPersonalized(!!p.isPersonalized);
    setPrice(p.variants?.[0]?.price || p.price);
    setSalePrice(p.variants?.[0]?.salePrice || p.discountPrice);
    setDescription(p.description);
    setFit(p.fit);
    setMaterial(p.material || '100% Cotton');
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
            if (!res.ok) throw new Error('Upload API unavailable');
            const data = await res.json();
            if (data.url) {
              setImages((prev) => [...prev, data.url]);
            } else {
              setImages((prev) => [...prev, resultUrl]);
            }
          } catch {
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
      if (!res.ok) throw new Error('Upload API unavailable');
      const data = await res.json();
      if (data.url) {
        setImages((prev) => [...prev, data.url]);
        setImageUrlInput('');
      }
    } catch {
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

  const toggleCollectionSelection = (collName: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collName) ? prev.filter((c) => c !== collName) : [...prev, collName]
    );
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
      subCategory,
      collection: selectedCollections[0] || collection,
      collections: selectedCollections,
      gender,
      isPersonalized,
      material,
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

  // Get active subcategories for chosen category
  const currentCategoryObj = TOP_LEVEL_CATEGORIES.find((c) => c.name === category);

  return (
    <div className="space-y-8 text-white">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#C9A227] tracking-wider uppercase">Official BLACKFAWN Taxonomy Catalog</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-1">Catalog Management</h1>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-[#C9A227] hover:bg-yellow-600 text-black text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
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
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category & Subcategory</th>
                <th className="py-3 px-4">Gender & Customization</th>
                <th className="py-3 px-4">Pricing & Variants</th>
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
                        <p className="text-[10px] text-gray-500 font-mono">SKU: {p.baseSku || p.id}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#C9A227]">{p.category}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{p.subCategory || 'Standard'}</p>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <span className="bg-slate-800 text-slate-300 text-[9.5px] px-2 py-0.5 rounded font-bold uppercase">
                        {p.gender || 'Unisex'}
                      </span>
                      {p.isPersonalized && (
                        <span className="block text-[9px] text-[#C9A227] font-extrabold uppercase">
                          Personalized
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white">₹{p.discountPrice || p.price}</span>
                      {p.discountPrice && <span className="text-[10px] text-gray-500 line-through ml-1.5">₹{p.price}</span>}
                      <p className="text-[9.5px] text-gray-500 mt-0.5">{p.variants?.length || 0} Variants ({totalStock} Stock)</p>
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
                        onClick={() => { if (confirm('Delete product from taxonomy?')) onDeleteProduct(p.id); }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-y-auto max-h-[90vh] w-full max-w-3xl text-white shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <Settings size={16} className="text-[#C9A227]" /> {isEditMode ? 'Modify Catalog Product' : 'Deploy Product To Taxonomy'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Product Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Material / Fabric</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Taxonomy Primary Category & Subcategory */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Primary Category (1 of 9)</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubCategory('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  >
                    {TOP_LEVEL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Subcategory Selection</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  >
                    <option value="">None / Standard</option>
                    {currentCategoryObj?.subcategories.map((sc) => (
                      <option key={sc.id} value={sc.name}>{sc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Target Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              {/* Collections Multi-Select Checkboxes */}
              <div className="space-y-1.5 border-t border-slate-800 pt-3">
                <label className="block text-gray-400 font-bold uppercase text-[10px]">Assign Cross-Cutting Collections (Multiple)</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 border border-slate-800 rounded-lg max-h-36 overflow-y-auto text-[11px]">
                  {CROSS_CUTTING_COLLECTIONS.map((coll) => (
                    <label key={coll.id} className="flex items-center gap-1.5 cursor-pointer text-gray-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(coll.name)}
                        onChange={() => toggleCollectionSelection(coll.name)}
                        className="rounded border-slate-800 text-[#C9A227]"
                      />
                      <span>{coll.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Personalized Custom Product?</label>
                  <select
                    value={isPersonalized ? 'yes' : 'no'}
                    onChange={(e) => setIsPersonalized(e.target.value === 'yes')}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  >
                    <option value="no">No (Standard Product)</option>
                    <option value="yes">Yes (Personalized / Custom)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Base Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">Sale Price (Optional, ₹)</label>
                  <input
                    type="number"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-[#C9A227]"
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
                    className="px-4 py-2 bg-[#C9A227] hover:bg-yellow-600 text-black text-xs font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Upload size={14} /> Upload Image File
                  </button>

                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Or paste image URL"
                      className="bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white rounded flex-1 outline-none"
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
                  <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> Variant Configuration Builder
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">Sizes (Comma separated)</label>
                      <input
                        type="text"
                        value={variantSizes.join(',')}
                        onChange={(e) => setVariantSizes(e.target.value.split(',').map((x) => x.trim()))}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">Colors (Comma separated)</label>
                      <input
                        type="text"
                        value={variantColors.join(',')}
                        onChange={(e) => setVariantColors(e.target.value.split(',').map((x) => x.trim()))}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#C9A227] hover:bg-yellow-600 text-black text-xs font-bold uppercase rounded-lg tracking-wider cursor-pointer shadow-lg mt-6 transition-all"
              >
                {isEditMode ? 'Modify Product Record' : 'Deploy Product To Taxonomy'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
