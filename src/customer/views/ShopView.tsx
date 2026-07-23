import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Grid, List, Check, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category } from '../../shared/types';
import ProductCard from '../components/ProductCard';

interface ShopViewProps {
  products: Product[];
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  onQuickView: (product: Product) => void;
  categoriesList: Category[];
}

export default function ShopView({
  products,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onQuickView,
  categoriesList,
}: ShopViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedFit, setSelectedFit] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [priceMax, setPriceMax] = useState<number>(6000);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(true);

  // Lists of unique values for filter building
  const sizesList = ['S', 'M', 'L', 'XL', 'XXL', '7', '8', '9', '10', '11', 'One Size'];
  const fitsList = ['Oversized', 'Relaxed', 'Regular', 'Regular Tapered', 'Snug'];
  
  const colorsList = [
    { name: 'Charcoal Black', hex: '#1C1C1C' },
    { name: 'Vintage Asphalt', hex: '#3A3A3A' },
    { name: 'Sanded Olive', hex: '#525B4C' },
    { name: 'Chalk White', hex: '#EDEDED' },
    { name: 'Pitch Black', hex: '#050505' },
    { name: 'Stealth Black', hex: '#0D0D0D' },
    { name: 'Tactical Khaki', hex: '#9C927A' },
    { name: 'Sage Olive', hex: '#5E6B58' },
    { name: 'Acid Charcoal', hex: '#2B2C2D' },
    { name: 'Acid Concrete', hex: '#636568' },
    { name: 'Acid Burgundy', hex: '#421E23' },
    { name: 'Matte Black', hex: '#141414' },
    { name: 'Shadow Grey', hex: '#4A4C4F' },
    { name: 'Volt Black', hex: '#1C2621' },
    { name: 'Ghost Grey', hex: '#B8BAC0' },
    { name: 'Onyx Black', hex: '#09090A' },
    { name: 'Urban Steel', hex: '#5A6065' }
  ];

  const resetFilters = () => {
    setCategoryFilter('');
    setSearchQuery('');
    setSelectedGender('');
    setSelectedFit('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceMax(6000);
    setSortOption('newest');
  };

  // Perform client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(query);
          const matchesDesc = (p.description || "").toLowerCase().includes(query);
          const matchesCat = p.category.toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }

        if (categoryFilter && p.category.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }

        if (selectedGender && p.gender !== 'unisex' && p.gender !== selectedGender) {
          return false;
        }

        if (selectedFit && p.fit !== selectedFit) {
          return false;
        }

        if (selectedSize && !p.variants?.some(v => v.size === selectedSize)) {
          return false;
        }

        if (selectedColor && !p.variants?.some(v => v.color === selectedColor)) {
          return false;
        }

        const activePrice = p.variants?.[0]?.salePrice || p.variants?.[0]?.price || p.discountPrice || p.price;
        if (activePrice > priceMax) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const pA = a.variants?.[0]?.salePrice || a.variants?.[0]?.price || a.discountPrice || a.price;
        const pB = b.variants?.[0]?.salePrice || b.variants?.[0]?.price || b.discountPrice || b.price;

        if (sortOption === 'price-low') {
          return pA - pB;
        }
        if (sortOption === 'price-high') {
          return pB - pA;
        }
        if (sortOption === 'discount') {
          const diffA = a.variants?.[0] ? a.variants[0].price - (a.variants[0].salePrice || a.variants[0].price) : 0;
          const diffB = b.variants?.[0] ? b.variants[0].price - (b.variants[0].salePrice || b.variants[0].price) : 0;
          return diffB - diffA;
        }
        if (sortOption === 'popularity') {
          return b.reviewCount - a.reviewCount;
        }
        return b.isNewArrival ? 1 : -1;
      });
  }, [products, searchQuery, categoryFilter, selectedGender, selectedFit, selectedSize, selectedColor, priceMax, sortOption]);

  const categories = categoriesList.map(c => c.name);

  return (
    <div id="shop-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-[120px] min-h-screen bg-[#f1f5f9] text-[#1e293b]">
      
      {/* 1. Shop Header Row */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Catalog Release List</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-wide mt-1 uppercase font-display">
            {categoryFilter || 'Shop All Releases'}
          </h1>
          {searchQuery && (
            <p className="text-xs text-gray-500 font-medium mt-1.5 flex items-center gap-1">
              <Sparkles size={12} className="text-[#f97316]" /> Search results for: <span className="text-gray-900 font-bold">"{searchQuery}"</span> ({filteredProducts.length} items)
            </p>
          )}
        </div>

        {/* Layout & Filters Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-200 p-1 bg-gray-50 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors cursor-pointer rounded-md ${viewMode === 'grid' ? 'text-[#f97316] bg-white shadow-xs' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors cursor-pointer rounded-md ${viewMode === 'list' ? 'text-[#f97316] bg-white shadow-xs' : 'text-gray-400 hover:text-gray-600'}`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
              showFilters ? 'bg-[#131921] text-white border-slate-900 shadow-sm' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs'
            }`}
          >
            <SlidersHorizontal size={13} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* 2. Side filter bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full lg:w-64 shrink-0 bg-white border border-gray-200 p-5 rounded-xl space-y-6 h-fit max-h-[85vh] overflow-y-auto shadow-xs"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-gray-900 tracking-wider uppercase">Filter Selection</span>
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-gray-400 hover:text-[#f97316] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} /> Clear All
                </button>
              </div>

              {/* Categories list filter */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Departments</h4>
                <div className="flex flex-col gap-0.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                      className={`text-left text-xs py-1.5 px-2.5 rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                        categoryFilter === cat ? 'text-[#f97316] font-bold bg-orange-50/60' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat}</span>
                      {categoryFilter === cat && <Check size={12} className="text-[#f97316]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Max slider */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Max Price Range</h4>
                  <span className="text-xs font-extrabold text-gray-900">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={6000}
                  step={100}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#f97316] bg-gray-200 h-1 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                  <span>₹500</span>
                  <span>₹6,000</span>
                </div>
              </div>

              {/* Sorting Order */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Sort By</h4>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs text-gray-800 p-2.5 rounded-lg focus:ring-1 focus:ring-[#f97316] focus:border-[#f97316] outline-none"
                >
                  <option value="newest">Newest Launch</option>
                  <option value="popularity">Popularity (Rating Count)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Special Discount</option>
                </select>
              </div>

              {/* Gender filter button group */}
              <div className="space-y-2.5 border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Ideal For</h4>
                <div className="flex gap-2">
                  {['men', 'women'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(selectedGender === g ? '' : g)}
                      className={`flex-1 py-1.5 border text-xs font-bold capitalize rounded-lg transition-all cursor-pointer ${
                        selectedGender === g
                          ? 'bg-[#131921] text-white border-slate-900'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Capsules */}
              <div className="space-y-3.5 border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Sizes</h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {sizesList.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                      className={`py-1.5 border text-[10px] font-semibold text-center rounded-md transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#f97316] text-white border-[#f97316]'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-[#f97316] hover:text-[#f97316]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color filter swatches */}
              <div className="space-y-3.5 border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Color Swatches</h4>
                <div className="flex flex-wrap gap-2">
                  {colorsList.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                      className={`w-6 h-6 rounded-full border transition-all relative ${
                        selectedColor === c.name ? 'border-[#f97316] scale-110 shadow-md ring-2 ring-[#f97316]/30' : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold mix-blend-difference">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 3. Products Grid/List View */}
        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-gray-200 bg-white rounded-xl flex flex-col items-center justify-center shadow-xs">
              <AlertCircle className="text-gray-400" size={36} />
              <p className="mt-4 text-sm font-bold text-gray-900 uppercase tracking-wide">
                No Apparel Matches Found
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                We couldn't retrieve any items matching your filter settings. Please expand your price range or select other sizes.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-[#f97316] text-white text-xs font-bold uppercase hover:bg-[#e0620d] transition-all cursor-pointer rounded-lg shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.some((w) => w.id === product.id)}
                  onCardClick={() => onProductClick(product)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const defaultVariant = product.variants?.[0];
                const price = defaultVariant?.price ?? product.price ?? 999;
                const salePrice = defaultVariant?.salePrice ?? product.discountPrice;
                const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
                const itemImage = defaultVariant?.images?.[0] || product.images?.[0];
                const sizes = product.variants ? Array.from(new Set(product.variants.map(v => v.size))) as string[] : ['S', 'M', 'L'];

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-5 p-4 bg-white border border-gray-200 hover:border-[#f97316] rounded-xl transition-all cursor-pointer group shadow-xs hover:shadow-md"
                    onClick={() => onProductClick(product)}
                  >
                    <div className="w-full sm:w-40 aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden shrink-0 relative">
                      <img src={itemImage} alt={product.name} className="w-full h-full object-cover object-top group-hover:scale-103 transition-all duration-500" referrerPolicy="no-referrer" />
                      {discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-red-600 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow-xs">{discount}% OFF</span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#f97316] tracking-wider uppercase">
                          {product.category}
                        </span>
                        
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#f97316] transition-colors capitalize">
                          {product.name}
                        </h3>

                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 max-w-xl">
                          {product.shortDescription || "Premium high-quality streetwear design crafted for comfort."}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {sizes.map((s) => (
                            <span key={s} className="text-[10px] font-semibold border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md bg-gray-50">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-6 sm:mt-0">
                        <div className="flex items-baseline gap-2">
                          {salePrice ? (
                            <>
                              <span className="text-lg font-black text-gray-900">₹{salePrice}</span>
                              <span className="text-xs text-gray-400 line-through">₹{price}</span>
                            </>
                          ) : (
                            <span className="text-lg font-black text-gray-900">₹{price}</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickView(product);
                            }}
                            className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors bg-white cursor-pointer"
                          >
                            Quick View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product, sizes[0], product.variants?.[0]?.color || 'Charcoal Black');
                            }}
                            className="px-5 py-2 bg-[#f97316] text-white text-xs font-bold rounded-lg hover:bg-[#e0620d] transition-colors cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
