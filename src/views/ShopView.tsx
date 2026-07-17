import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Grid, List, Check, RotateCcw, AlertCircle, Sparkles, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
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
  
  // Custom Color Map with actual hex codes for visual swatches in filter
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

  // Perform dynamic client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search matches
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(query);
          const matchesDesc = p.description.toLowerCase().includes(query);
          const matchesCat = p.category.toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }

        // Category matches
        if (categoryFilter && p.category.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }

        // Gender matches
        if (selectedGender && p.gender !== 'unisex' && p.gender !== selectedGender) {
          return false;
        }

        // Fit matches
        if (selectedFit && p.fit !== selectedFit) {
          return false;
        }

        // Size matches
        if (selectedSize && !p.sizes.includes(selectedSize)) {
          return false;
        }

        // Color matches
        if (selectedColor && !p.colors.some((c) => c.name === selectedColor)) {
          return false;
        }

        // Price matches
        const activePrice = p.discountPrice || p.price;
        if (activePrice > priceMax) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const pA = a.discountPrice || a.price;
        const pB = b.discountPrice || b.price;

        if (sortOption === 'price-low') {
          return pA - pB;
        }
        if (sortOption === 'price-high') {
          return pB - pA;
        }
        if (sortOption === 'discount') {
          const discountA = a.discountPrice ? a.price - a.discountPrice : 0;
          const discountB = b.discountPrice ? b.price - b.discountPrice : 0;
          return discountB - discountA;
        }
        if (sortOption === 'popularity') {
          return b.reviewCount - a.reviewCount;
        }
        // Default newest
        return b.isNewArrival ? 1 : -1;
      });
  }, [products, searchQuery, categoryFilter, selectedGender, selectedFit, selectedSize, selectedColor, priceMax, sortOption]);

  const categories = ['Oversized', 'T-Shirts', 'Hoodies', 'Cargo Pants', 'Sneakers', 'Accessories'];

  return (
    <div id="shop-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[140px] min-h-screen bg-[#F8F8F6] text-[#0B0B0B]">
      
      {/* 1. Header & Active Query Badges */}
      <div className="border-b border-[#0B0B0B]/10 pb-6 mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <span className="text-[9px] font-mono tracking-[0.3em] text-neutral-500 uppercase">BLACKFAWN APPARELS ARCHIVE</span>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-widest text-[#0B0B0B] uppercase mt-1">
            {categoryFilter || 'SHOP ALL RELEASES'}
          </h1>
          {searchQuery && (
            <p className="text-[10px] font-mono text-neutral-500 mt-2 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#C9A227]" /> SEARCHING KEYS: <span className="text-[#0B0B0B] font-bold">"{searchQuery}"</span> ({filteredProducts.length} results)
            </p>
          )}
        </div>

        {/* View Layout & Sort Filters */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Grid/List switch */}
          <div className="flex border border-[#0B0B0B]/10 p-1 bg-white rounded-none">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors cursor-pointer rounded-none ${viewMode === 'grid' ? 'text-black bg-neutral-100' : 'text-neutral-400 hover:text-black'}`}
              title="Grid View"
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors cursor-pointer rounded-none ${viewMode === 'list' ? 'text-black bg-neutral-100' : 'text-neutral-400 hover:text-black'}`}
              title="List View"
            >
              <List size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border text-[10px] font-display font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center gap-2 rounded-none ${
              showFilters ? 'bg-[#0B0B0B] text-[#F8F8F6] border-[#0B0B0B]' : 'bg-white border-[#0B0B0B]/15 text-[#0B0B0B] hover:bg-neutral-50'
            }`}
          >
            <SlidersHorizontal size={12} /> {showFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* 2. ADVANCED FILTERS BOARD */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full lg:w-64 shrink-0 bg-white border border-[#0B0B0B]/10 p-5 rounded-none space-y-6 h-fit max-h-[100vh] overflow-y-auto shadow-xs"
            >
              <div className="flex justify-between items-center border-b border-[#0B0B0B]/10 pb-3.5">
                <span className="text-[10px] font-display font-bold tracking-widest text-[#0B0B0B] uppercase">FILTERS SELECTOR</span>
                <button
                  onClick={resetFilters}
                  className="text-[9px] font-mono text-neutral-400 hover:text-[#C9A227] flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                >
                  <RotateCcw size={10} /> RESET ALL
                </button>
              </div>

              {/* Department Categories Selector */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">CATEGORY DEPT</h4>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                      className={`text-left text-[11px] font-mono uppercase tracking-wider py-1.5 px-2 rounded-none cursor-pointer hover:bg-neutral-50 flex justify-between items-center transition-colors ${
                        categoryFilter === cat ? 'text-[#0B0B0B] font-bold bg-[#F8F8F6] border-l-2 border-[#C9A227] pl-3' : 'text-neutral-500'
                      }`}
                    >
                      <span>{cat}</span>
                      {categoryFilter === cat && <Check size={10} className="text-[#C9A227]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Max Slider */}
              <div className="space-y-3 border-t border-[#0B0B0B]/10 pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">MAX PRICE</h4>
                  <span className="text-xs font-mono font-bold text-[#0B0B0B]">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={6000}
                  step={100}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#C9A227] bg-neutral-200 h-1 cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                  <span>₹500</span>
                  <span>₹6,000</span>
                </div>
              </div>

              {/* Sorting */}
              <div className="space-y-3 border-t border-[#0B0B0B]/10 pt-4">
                <h4 className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">ORDER ARCHIVE BY</h4>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/15 text-[#0B0B0B] text-[11px] font-mono p-2.5 focus:border-[#C9A227] outline-none uppercase tracking-widest rounded-none"
                >
                  <option value="newest">Newest Drops First</option>
                  <option value="popularity">Popularity (Most Reviewed)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Act II Sales Discount</option>
                </select>
              </div>

              {/* Gender Selection */}
              <div className="space-y-3 border-t border-[#0B0B0B]/10 pt-4">
                <h4 className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">GENDER BIAS</h4>
                <div className="flex gap-1.5">
                  {['men', 'women'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(selectedGender === g ? '' : g)}
                      className={`flex-1 py-1.5 border text-[9px] font-mono uppercase tracking-widest text-center transition-all cursor-pointer rounded-none ${
                        selectedGender === g
                          ? 'bg-[#0B0B0B] text-[#F8F8F6] border-[#0B0B0B] font-bold'
                          : 'bg-white border-[#0B0B0B]/10 text-neutral-500 hover:border-black/20'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector Grid */}
              <div className="space-y-3 border-t border-[#0B0B0B]/10 pt-4">
                <h4 className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">SIZE CAPSULES</h4>
                <div className="grid grid-cols-4 gap-1">
                  {sizesList.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                      className={`py-1.5 border text-[9px] font-mono text-center transition-all cursor-pointer rounded-none ${
                        selectedSize === s
                          ? 'bg-[#0B0B0B] text-[#F8F8F6] border-[#0B0B0B] font-black'
                          : 'bg-white border-[#0B0B0B]/10 text-neutral-500 hover:border-[#C9A227]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop Fit */}
              <div className="space-y-3 border-t border-[#0B0B0B]/10 pt-4">
                <h4 className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">SILHOUETTE GEOMETRY</h4>
                <select
                  value={selectedFit}
                  onChange={(e) => setSelectedFit(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-[#0B0B0B]/15 text-[#0B0B0B] text-[11px] font-mono p-2.5 focus:border-[#C9A227] outline-none uppercase tracking-widest rounded-none"
                >
                  <option value="">All Silhouette Cuts</option>
                  {fitsList.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Advanced Color Swatches Selectors - Nobero style */}
              <div className="space-y-3 border-t border-[#0B0B0B]/10 pt-4">
                <h4 className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">VISUAL COLOR TONES</h4>
                <div className="flex flex-wrap gap-1.5">
                  {colorsList.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                      className={`w-6 h-6 rounded-none border transition-all relative ${
                        selectedColor === c.name ? 'border-[#C9A227] scale-110 shadow-sm' : 'border-[#0B0B0B]/15 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] text-[#C9A227] mix-blend-difference font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                    Active: <span className="text-[#0B0B0B] font-bold">{selectedColor}</span>
                  </p>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 3. PRODUCTS GRID LIST */}
        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 border border-[#0B0B0B]/10 bg-white rounded-none flex flex-col items-center justify-center shadow-xs">
              <AlertCircle className="text-neutral-400" size={32} />
              <p className="mt-4 text-xs font-display font-bold tracking-widest text-[#0B0B0B] uppercase">
                NO METROPOLIS RELEASES COINCIDE WITH ACTIVE FILTERS
              </p>
              <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mt-1.5 max-w-xs leading-relaxed">
                We couldn't query any physical items under these exact parameters. Try widening your price filter or clearing selected sizes.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-[#0B0B0B] text-[#F8F8F6] text-xs font-display font-bold tracking-widest uppercase hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-all cursor-pointer rounded-none"
              >
                CLEAR FILTER BOARD
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
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
            /* List View Layout - Zara Minimalist */
            <div className="space-y-4 animate-fade-in">
              {filteredProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-6 p-4 bg-white border border-[#0B0B0B]/10 hover:border-[#C9A227] rounded-none transition-colors cursor-pointer group"
                    onClick={() => onProductClick(product)}
                  >
                    <div className="w-full sm:w-44 aspect-[3/4] bg-neutral-100 rounded-none overflow-hidden shrink-0 relative">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono tracking-[0.25em] text-[#C9A227] uppercase font-bold">
                          {product.category} • {product.fit} SILHOUETTE
                        </span>
                        
                        <h3 className="text-md font-display font-bold text-[#0B0B0B] uppercase tracking-wider">
                          {product.name}
                        </h3>

                        <p className="text-xs text-neutral-500 uppercase tracking-wide leading-relaxed line-clamp-2 max-w-xl">
                          {product.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.sizes.map((s) => (
                            <span key={s} className="text-[9px] font-mono border border-[#0B0B0B]/10 text-neutral-500 px-2 py-0.5 rounded-none bg-[#F8F8F6]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-end border-t border-[#0B0B0B]/5 pt-4 mt-6 sm:mt-0">
                        <div className="flex items-baseline gap-2.5">
                          {product.discountPrice ? (
                            <>
                              <span className="text-lg font-display font-black text-[#0B0B0B]">₹{product.discountPrice}</span>
                              <span className="text-xs font-mono text-neutral-400 line-through">₹{product.price}</span>
                            </>
                          ) : (
                            <span className="text-lg font-display font-black text-[#0B0B0B]">₹{product.price}</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickView(product);
                            }}
                            className="px-4 py-2 border border-[#0B0B0B]/15 hover:border-[#0B0B0B] text-black text-[10px] font-mono uppercase tracking-widest rounded-none bg-[#F8F8F6]"
                          >
                            SPECS VIEW
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product, product.sizes[0], product.colors[0].name);
                            }}
                            className="px-5 py-2 bg-[#0B0B0B] text-[#F8F8F6] text-[10px] font-display font-black uppercase tracking-widest rounded-none hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors"
                          >
                            ADD TO BAG
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
