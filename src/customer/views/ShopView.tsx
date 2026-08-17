import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Grid, List, Check, RotateCcw, Sparkles, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category } from '../../shared/types';
import ProductCard from '../components/ProductCard';
import { TOP_LEVEL_CATEGORIES, CROSS_CUTTING_COLLECTIONS, VALID_SIZES_CLOTHING, VALID_SIZES_CAPS } from '../../shared/taxonomy';

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

  // Multi-dimensional Filter State
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedPersonalized, setSelectedPersonalized] = useState<string>(''); // 'yes' | 'no' | ''
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(true);

  const resetFilters = () => {
    setCategoryFilter('');
    setSearchQuery('');
    setSelectedSubCategory('');
    setSelectedGender('');
    setSelectedPersonalized('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceMax(10000);
    setSortOption('newest');
  };

  // Perform client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search Query / Collection Query
        if (searchQuery) {
          if (searchQuery.startsWith('coll:')) {
            const collTarget = searchQuery.replace('coll:', '').toLowerCase();
            const productColls = (p.collections || [p.collection || '']).map((c) => c.toLowerCase());
            if (!productColls.includes(collTarget) && (p.collection || '').toLowerCase() !== collTarget) {
              return false;
            }
          } else {
            const query = searchQuery.toLowerCase();
            const matchesName = p.name.toLowerCase().includes(query);
            const matchesDesc = (p.description || "").toLowerCase().includes(query);
            const matchesCat = p.category.toLowerCase().includes(query);
            const matchesSubCat = (p.subCategory || '').toLowerCase().includes(query);
            const matchesColl = (p.collection || "").toLowerCase().includes(query);
            if (!matchesName && !matchesDesc && !matchesCat && !matchesSubCat && !matchesColl) return false;
          }
        }

        // Category Filter
        const normalizeCat = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (categoryFilter && normalizeCat(p.category) !== normalizeCat(categoryFilter)) {
          return false;
        }

        // Subcategory Filter
        if (selectedSubCategory && normalizeCat(p.subCategory || '') !== normalizeCat(selectedSubCategory)) {
          return false;
        }

        // Gender Filter
        if (selectedGender) {
          const pGen = (p.gender || '').toLowerCase();
          const selGen = selectedGender.toLowerCase();
          if (pGen !== 'unisex' && pGen !== selGen) {
            return false;
          }
        }

        // Personalization Filter
        if (selectedPersonalized === 'yes' && !p.isPersonalized) {
          return false;
        }
        if (selectedPersonalized === 'no' && p.isPersonalized) {
          return false;
        }

        // Size Filter
        if (selectedSize && !p.variants?.some(v => v.size === selectedSize)) {
          return false;
        }

        // Color Filter
        if (selectedColor && !p.variants?.some(v => v.color.toLowerCase().includes(selectedColor.toLowerCase()))) {
          return false;
        }

        // Price Filter
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
  }, [products, searchQuery, categoryFilter, selectedSubCategory, selectedGender, selectedPersonalized, selectedSize, selectedColor, priceMax, sortOption]);

  // Compute available sizes dynamically for current filtered products
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    filteredProducts.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.size) set.add(v.size);
      });
    });
    return Array.from(set);
  }, [filteredProducts]);

  // Compute available subcategories for currently selected top category
  const availableSubCategories = useMemo(() => {
    if (!categoryFilter) return [];
    const catObject = TOP_LEVEL_CATEGORIES.find((c) => c.name.toLowerCase() === categoryFilter.toLowerCase());
    return catObject ? catObject.subcategories.filter((sc) => !sc.isFuture) : [];
  }, [categoryFilter]);

  // Display label for active collection or category
  const activeHeaderLabel = useMemo(() => {
    if (searchQuery.startsWith('coll:')) {
      return searchQuery.replace('coll:', '');
    }
    if (categoryFilter) return categoryFilter;
    return 'All Releases';
  }, [searchQuery, categoryFilter]);

  return (
    <div id="shop-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-[120px] min-h-screen bg-[#F8F7F2] text-[#111111]">
      
      {/* 1. SEO Breadcrumb Navigation Trail */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
        <button onClick={() => resetFilters()} className="hover:text-[#C9A227]">Home</button>
        <ChevronRight size={10} />
        <button onClick={() => { setCategoryFilter(''); setSearchQuery(''); }} className="hover:text-[#C9A227]">Shop</button>
        {categoryFilter && (
          <>
            <ChevronRight size={10} />
            <span className="text-[#0B0B0B] font-extrabold">{categoryFilter}</span>
          </>
        )}
        {searchQuery.startsWith('coll:') && (
          <>
            <ChevronRight size={10} />
            <span className="text-[#C9A227] font-extrabold">{searchQuery.replace('coll:', '')}</span>
          </>
        )}
        {selectedSubCategory && (
          <>
            <ChevronRight size={10} />
            <span className="text-gray-900 font-extrabold">{selectedSubCategory}</span>
          </>
        )}
      </nav>

      {/* 2. Shop Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-[#E8E5DD] shadow-xs mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-serif font-bold text-[#C9A227] tracking-widest uppercase">BLACKFAWN ATELIER CATALOG</span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B0B0B] tracking-wide mt-1 uppercase">
            {activeHeaderLabel}
          </h1>
          {searchQuery && !searchQuery.startsWith('coll:') && (
            <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
              <Sparkles size={12} className="text-[#C9A227]" /> Search results for: <span className="text-[#0B0B0B] font-bold">"{searchQuery}"</span> ({filteredProducts.length} items)
            </p>
          )}
        </div>

        {/* View Mode & Filter Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex border border-[#E8E5DD] p-1 bg-[#F8F7F2] rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors cursor-pointer rounded-md ${viewMode === 'grid' ? 'text-[#C9A227] bg-white shadow-xs' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors cursor-pointer rounded-md ${viewMode === 'list' ? 'text-[#C9A227] bg-white shadow-xs' : 'text-gray-400 hover:text-gray-600'}`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
              showFilters ? 'bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-sm' : 'bg-white border-[#E8E5DD] text-gray-700 hover:bg-gray-50 shadow-xs'
            }`}
          >
            <SlidersHorizontal size={13} className="text-[#C9A227]" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* 3. Subcategories Pills Bar */}
      {availableSubCategories.length > 0 && (
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8E5DD] shadow-xs mb-6 space-y-2">
          <span className="text-[10px] font-serif font-bold text-[#C9A227] tracking-widest uppercase">SUBCATEGORIES</span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSubCategory('')}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all ${
                !selectedSubCategory
                  ? 'bg-[#0B0B0B] text-[#C9A227] border border-[#C9A227]'
                  : 'bg-[#F8F7F2] text-gray-600 border border-[#E8E5DD] hover:border-[#0B0B0B]'
              }`}
            >
              All {categoryFilter}
            </button>
            {availableSubCategories.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedSubCategory(selectedSubCategory === sc.name ? '' : sc.name)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all ${
                  selectedSubCategory === sc.name
                    ? 'bg-[#0B0B0B] text-[#C9A227] border border-[#C9A227]'
                    : 'bg-[#F8F7F2] text-gray-600 border border-[#E8E5DD] hover:border-[#0B0B0B]'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* 4. Multi-Dimensional Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full lg:w-64 shrink-0 bg-white border border-[#E8E5DD] p-5 rounded-xl space-y-6 h-fit max-h-[85vh] overflow-y-auto shadow-xs text-xs"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-xs font-serif font-bold text-[#0B0B0B] tracking-wider uppercase flex items-center gap-1.5">
                  <Filter size={13} className="text-[#C9A227]" /> Catalog Filters
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-gray-400 hover:text-[#C9A227] flex items-center gap-1 cursor-pointer uppercase"
                >
                  <RotateCcw size={11} /> Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Product Category</h4>
                <div className="flex flex-col gap-1">
                  {TOP_LEVEL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryFilter(categoryFilter === cat.name ? '' : cat.name);
                        setSelectedSubCategory('');
                      }}
                      className={`text-left text-xs py-1.5 px-2.5 rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                        categoryFilter === cat.name ? 'text-[#0B0B0B] font-bold bg-[#F8F7F2] border border-[#E8E5DD]' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {categoryFilter === cat.name && <Check size={12} className="text-[#C9A227]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Target Gender</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Men', 'Women', 'Kids', 'Unisex'].map((gen) => (
                    <button
                      key={gen}
                      onClick={() => setSelectedGender(selectedGender === gen ? '' : gen)}
                      className={`py-1.5 px-2 border rounded text-xs font-semibold cursor-pointer transition-colors ${
                        selectedGender === gen ? 'bg-[#0B0B0B] text-[#C9A227] border-[#0B0B0B]' : 'bg-[#FFFFFF] border-[#E8E5DD] text-gray-700 hover:border-[#0B0B0B]'
                      }`}
                    >
                      {gen}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization Filter */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Customization Status</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPersonalized(selectedPersonalized === 'yes' ? '' : 'yes')}
                    className={`flex-1 py-1.5 border rounded text-[11px] font-bold uppercase cursor-pointer transition-colors ${
                      selectedPersonalized === 'yes' ? 'bg-[#0B0B0B] text-[#C9A227] border-[#C9A227]' : 'bg-white border-[#E8E5DD] text-gray-700'
                    }`}
                  >
                    Personalized
                  </button>
                  <button
                    onClick={() => setSelectedPersonalized(selectedPersonalized === 'no' ? '' : 'no')}
                    className={`flex-1 py-1.5 border rounded text-[11px] font-bold uppercase cursor-pointer transition-colors ${
                      selectedPersonalized === 'no' ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]' : 'bg-white border-[#E8E5DD] text-gray-700'
                    }`}
                  >
                    Standard
                  </button>
                </div>
              </div>

              {/* Dynamic Size Filter */}
              {availableSizes.length > 0 && (
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Size / Option</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                        className={`px-2.5 py-1 border text-xs font-semibold rounded transition-all cursor-pointer ${
                          selectedSize === sz ? 'bg-[#0B0B0B] text-[#C9A227] border-[#C9A227]' : 'bg-white border-[#E8E5DD] text-gray-700 hover:border-[#0B0B0B]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Max slider */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Max Price Range</h4>
                  <span className="text-xs font-extrabold text-[#0B0B0B]">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={10000}
                  step={100}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#C9A227] bg-gray-200 h-1 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                  <span>₹200</span>
                  <span>₹10,000</span>
                </div>
              </div>

              {/* Sorting Order */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Sort Catalog</h4>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-[#E8E5DD] text-xs text-gray-900 p-2.5 rounded-lg focus:border-[#C9A227] outline-none font-semibold"
                >
                  <option value="newest">Newest Launch</option>
                  <option value="popularity">Popularity (Rating Count)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Special Discount</option>
                </select>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 5. Product Grid & Catalog Output */}
        <div className="flex-1 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E8E5DD] p-12 rounded-xl text-center space-y-4 shadow-xs">
              <div className="text-[#C9A227] text-3xl font-serif">✦</div>
              <h3 className="text-base font-serif font-bold text-[#0B0B0B] uppercase tracking-wider">No Products Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No matching garments or hampers meet your current filter specifications. Try adjusting your selections.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] text-xs font-semibold uppercase tracking-widest cursor-pointer transition-all"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
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
          )}
        </div>

      </div>
    </div>
  );
}
