import React, { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, Grid, List, Check, RotateCcw, Sparkles, ChevronRight, Filter, X, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category } from '../../shared/types';
import ProductCard from '../components/ProductCard';
import { TOP_LEVEL_CATEGORIES, CROSS_CUTTING_COLLECTIONS } from '../../shared/taxonomy';

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

// Color Swatch Mapping for Visual Representation
const COLOR_HEX_MAP: Record<string, string> = {
  black: '#0B0B0B',
  white: '#FFFFFF',
  grey: '#808080',
  gray: '#808080',
  navy: '#000080',
  red: '#DC2626',
  blue: '#2563EB',
  green: '#16A34A',
  yellow: '#EAB308',
  beige: '#F5F5DC',
  brown: '#78350F',
  gold: '#C9A227',
  ivory: '#F8F7F2',
  pink: '#EC4899',
  purple: '#9333EA',
  charcoal: '#36454F',
};

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
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedFit, setSelectedFit] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  
  // Dynamic Max Catalog Price calculation
  const catalogMaxPrice = useMemo(() => {
    if (!products.length) return 5000;
    let max = 0;
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        const val = v.salePrice || v.price;
        if (val > max) max = val;
      });
      const pVal = p.discountPrice || p.price;
      if (pVal > max) max = pVal;
    });
    return Math.ceil(max / 500) * 500 || 5000;
  }, [products]);

  const [priceMinInput, setPriceMinInput] = useState<number>(0);
  const [priceMaxInput, setPriceMaxInput] = useState<number>(catalogMaxPrice);
  const [sortOption, setSortOption] = useState<string>('recommended');
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Update price ceiling if catalog max changes
  useEffect(() => {
    if (catalogMaxPrice > 0 && priceMaxInput === 5000 && catalogMaxPrice !== 5000) {
      setPriceMaxInput(catalogMaxPrice);
    }
  }, [catalogMaxPrice]);

  // Sync state FROM URL query params on mount/url change
  useEffect(() => {
    const readUrlState = () => {
      const hash = window.location.hash;
      const qIndex = hash.indexOf('?');
      if (qIndex === -1) return;
      const queryString = hash.substring(qIndex + 1);
      const params = new URLSearchParams(queryString);

      if (params.has('category')) setCategoryFilter(params.get('category') || '');
      if (params.has('subCategory')) setSelectedSubCategory(params.get('subCategory') || '');
      if (params.has('gender')) setSelectedGender(params.get('gender') || '');
      if (params.has('personalized')) setSelectedPersonalized(params.get('personalized') || '');
      if (params.has('size')) setSelectedSize(params.get('size') || '');
      if (params.has('color')) setSelectedColor(params.get('color') || '');
      if (params.has('material')) setSelectedMaterial(params.get('material') || '');
      if (params.has('fit')) setSelectedFit(params.get('fit') || '');
      if (params.has('availability')) setSelectedAvailability(params.get('availability') || '');
      if (params.has('collection')) setSelectedCollection(params.get('collection') || '');
      if (params.has('minPrice')) setPriceMinInput(Number(params.get('minPrice')) || 0);
      if (params.has('maxPrice')) setPriceMaxInput(Number(params.get('maxPrice')) || catalogMaxPrice);
      if (params.has('sort')) setSortOption(params.get('sort') || 'recommended');
    };
    readUrlState();
  }, []);

  // Update URL state whenever filters change
  const updateUrlState = (updates: Record<string, string | number | undefined>) => {
    const hash = window.location.hash;
    const baseHash = hash.split('?')[0] || '#/shop';
    const params = new URLSearchParams();

    if (categoryFilter) params.set('category', categoryFilter);
    if (selectedSubCategory) params.set('subCategory', selectedSubCategory);
    if (selectedGender) params.set('gender', selectedGender);
    if (selectedPersonalized) params.set('personalized', selectedPersonalized);
    if (selectedSize) params.set('size', selectedSize);
    if (selectedColor) params.set('color', selectedColor);
    if (selectedMaterial) params.set('material', selectedMaterial);
    if (selectedFit) params.set('fit', selectedFit);
    if (selectedAvailability) params.set('availability', selectedAvailability);
    if (selectedCollection) params.set('collection', selectedCollection);
    if (priceMinInput > 0) params.set('minPrice', priceMinInput.toString());
    if (priceMaxInput < catalogMaxPrice) params.set('maxPrice', priceMaxInput.toString());
    if (sortOption !== 'recommended') params.set('sort', sortOption);

    // Override with explicit updates
    Object.entries(updates).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== 0) {
        params.set(k, v.toString());
      } else {
        params.delete(k);
      }
    });

    const queryString = params.toString();
    const newHash = queryString ? `${baseHash}?${queryString}` : baseHash;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  };

  const resetFilters = () => {
    setCategoryFilter('');
    setSearchQuery('');
    setSelectedSubCategory('');
    setSelectedGender('');
    setSelectedPersonalized('');
    setSelectedSize('');
    setSelectedColor('');
    setSelectedMaterial('');
    setSelectedFit('');
    setSelectedAvailability('');
    setSelectedCollection('');
    setPriceMinInput(0);
    setPriceMaxInput(catalogMaxPrice);
    setSortOption('recommended');
    const baseHash = window.location.hash.split('?')[0] || '#/shop';
    window.history.replaceState(null, '', baseHash);
  };

  // Perform client-side filtering and sorting (intersection AND logic)
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
            const matchesDesc = (p.description || '').toLowerCase().includes(query);
            const matchesCat = p.category.toLowerCase().includes(query);
            const matchesSubCat = (p.subCategory || '').toLowerCase().includes(query);
            const matchesColl = (p.collection || '').toLowerCase().includes(query);
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

        // Collection Filter
        if (selectedCollection) {
          const normColl = selectedCollection.toLowerCase();
          const pColls = (p.collections || [p.collection || '']).map((c) => c.toLowerCase());
          if (!pColls.includes(normColl)) return false;
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
        if (selectedPersonalized === 'yes' && !p.isPersonalized) return false;
        if (selectedPersonalized === 'no' && p.isPersonalized) return false;

        // Material Filter
        if (selectedMaterial && !(p.material || '').toLowerCase().includes(selectedMaterial.toLowerCase())) {
          return false;
        }

        // Fit Filter
        if (selectedFit && !(p.fit || '').toLowerCase().includes(selectedFit.toLowerCase())) {
          return false;
        }

        // Availability Filter
        if (selectedAvailability === 'In Stock') {
          const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 10;
          if (totalStock <= 0) return false;
        }

        // Size Filter
        if (selectedSize && !p.variants?.some((v) => v.size === selectedSize)) {
          return false;
        }

        // Color Filter
        if (selectedColor && !p.variants?.some((v) => v.color.toLowerCase().includes(selectedColor.toLowerCase()))) {
          return false;
        }

        // Price Filter (Range Min to Max)
        const activePrice = p.variants?.[0]?.salePrice || p.variants?.[0]?.price || p.discountPrice || p.price;
        if (activePrice < priceMinInput || activePrice > priceMaxInput) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const pA = a.variants?.[0]?.salePrice || a.variants?.[0]?.price || a.discountPrice || a.price;
        const pB = b.variants?.[0]?.salePrice || b.variants?.[0]?.price || b.discountPrice || b.price;

        if (sortOption === 'price-low') return pA - pB;
        if (sortOption === 'price-high') return pB - pA;
        if (sortOption === 'discount') {
          const diffA = a.variants?.[0] ? a.variants[0].price - (a.variants[0].salePrice || a.variants[0].price) : 0;
          const diffB = b.variants?.[0] ? b.variants[0].price - (b.variants[0].salePrice || b.variants[0].price) : 0;
          return diffB - diffA;
        }
        if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortOption === 'bestselling') return b.reviewCount - a.reviewCount;
        if (sortOption === 'newest') return b.isNewArrival ? 1 : -1;
        // Recommended default
        return (b.isFeatured ? 2 : 0) + (b.isBestSeller ? 1 : 0) - ((a.isFeatured ? 2 : 0) + (a.isBestSeller ? 1 : 0));
      });
  }, [
    products,
    searchQuery,
    categoryFilter,
    selectedSubCategory,
    selectedCollection,
    selectedGender,
    selectedPersonalized,
    selectedMaterial,
    selectedFit,
    selectedAvailability,
    selectedSize,
    selectedColor,
    priceMinInput,
    priceMaxInput,
    sortOption,
  ]);

  // Dynamic available sizes calculated strictly from displayed products
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    filteredProducts.forEach((p) => {
      if (p.category.toLowerCase().includes('hamper') && !p.variants?.some(v => v.size && v.size !== 'Bespoke Box')) {
        return;
      }
      p.variants?.forEach((v) => {
        if (v.size && v.size !== 'Bespoke Box' && v.size !== 'Standard Gift Box') {
          set.add(v.size);
        }
      });
    });
    return Array.from(set);
  }, [filteredProducts]);

  // Dynamic available colors extracted directly from product variants
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, { name: string; hex: string }>();
    filteredProducts.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.color) {
          const rawName = v.color.split('(')[0].trim();
          const key = rawName.toLowerCase();
          if (!colorMap.has(key)) {
            const hex = COLOR_HEX_MAP[key] || COLOR_HEX_MAP[key.split(' ')[0]] || '#0B0B0B';
            colorMap.set(key, { name: rawName, hex });
          }
        }
      });
    });
    return Array.from(colorMap.values());
  }, [filteredProducts]);

  // Dynamic Materials list based on displayed items
  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    filteredProducts.forEach((p) => {
      if (p.material) set.add(p.material.split('/')[0].trim());
    });
    return Array.from(set).slice(0, 8);
  }, [filteredProducts]);

  // Dynamic Fits list
  const availableFits = useMemo(() => {
    const set = new Set<string>();
    filteredProducts.forEach((p) => {
      if (p.fit) set.add(p.fit.split('/')[0].trim());
    });
    return Array.from(set).slice(0, 6);
  }, [filteredProducts]);

  // Dynamic Subcategories for top category
  const availableSubCategories = useMemo(() => {
    if (!categoryFilter) return [];
    const catObject = TOP_LEVEL_CATEGORIES.find((c) => c.name.toLowerCase() === categoryFilter.toLowerCase());
    return catObject ? catObject.subcategories.filter((sc) => !sc.isFuture) : [];
  }, [categoryFilter]);

  // Header Title
  const activeHeaderLabel = useMemo(() => {
    if (searchQuery.startsWith('coll:')) return searchQuery.replace('coll:', '');
    if (categoryFilter) return categoryFilter;
    return 'All Atelier Products';
  }, [searchQuery, categoryFilter]);

  // Active filters count for badges
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilter) count++;
    if (selectedSubCategory) count++;
    if (selectedGender) count++;
    if (selectedPersonalized) count++;
    if (selectedSize) count++;
    if (selectedColor) count++;
    if (selectedMaterial) count++;
    if (selectedFit) count++;
    if (selectedAvailability) count++;
    if (selectedCollection) count++;
    if (priceMinInput > 0 || priceMaxInput < catalogMaxPrice) count++;
    return count;
  }, [
    categoryFilter,
    selectedSubCategory,
    selectedGender,
    selectedPersonalized,
    selectedSize,
    selectedColor,
    selectedMaterial,
    selectedFit,
    selectedAvailability,
    selectedCollection,
    priceMinInput,
    priceMaxInput,
    catalogMaxPrice,
  ]);

  // Sidebar Filter Form Component
  const FilterContent = () => (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <span className="text-xs font-serif font-bold text-[#0B0B0B] tracking-wider uppercase flex items-center gap-1.5">
          <Filter size={13} className="text-[#C9A227]" /> FILTERS ({activeFiltersCount})
        </span>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-[10px] font-bold text-[#C9A227] hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <RotateCcw size={11} /> Clear All
          </button>
        )}
      </div>

      {/* 1. Price Range Dual Filter & Quick Bands */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">PRICE RANGE</h4>
          <span className="text-xs font-bold text-[#0B0B0B]">
            ₹{priceMinInput.toLocaleString('en-IN')} — ₹{priceMaxInput.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Dual Price Inputs */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[9px] font-semibold text-gray-400 uppercase block mb-1">Min Price</label>
            <div className="relative flex items-center">
              <span className="absolute left-2 text-gray-400 font-medium">₹</span>
              <input
                type="number"
                min={0}
                max={priceMaxInput}
                value={priceMinInput}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceMinInput(val);
                  updateUrlState({ minPrice: val });
                }}
                className="w-full pl-5 pr-2 py-1 bg-white border border-[#E8E5DD] rounded text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>
          <div>
            <label className="text-[9px] font-semibold text-gray-400 uppercase block mb-1">Max Price</label>
            <div className="relative flex items-center">
              <span className="absolute left-2 text-gray-400 font-medium">₹</span>
              <input
                type="number"
                min={priceMinInput}
                max={catalogMaxPrice}
                value={priceMaxInput}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceMaxInput(val);
                  updateUrlState({ maxPrice: val });
                }}
                className="w-full pl-5 pr-2 py-1 bg-white border border-[#E8E5DD] rounded text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={catalogMaxPrice}
          step={100}
          value={priceMaxInput}
          onChange={(e) => {
            const val = Number(e.target.value);
            setPriceMaxInput(val);
            updateUrlState({ maxPrice: val });
          }}
          className="w-full accent-[#C9A227] bg-gray-200 h-1.5 rounded-lg cursor-pointer"
        />

        {/* Quick Price Bands */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { label: 'Under ₹999', min: 0, max: 999 },
            { label: '₹999–₹1,499', min: 999, max: 1499 },
            { label: '₹1,499–₹1,999', min: 1499, max: 1999 },
            { label: '₹1,999–₹2,999', min: 1999, max: 2999 },
            { label: '₹2,999+', min: 2999, max: catalogMaxPrice },
          ].map((band) => {
            const isSelected = priceMinInput === band.min && priceMaxInput === band.max;
            return (
              <button
                key={band.label}
                onClick={() => {
                  if (isSelected) {
                    setPriceMinInput(0);
                    setPriceMaxInput(catalogMaxPrice);
                    updateUrlState({ minPrice: undefined, maxPrice: undefined });
                  } else {
                    setPriceMinInput(band.min);
                    setPriceMaxInput(band.max);
                    updateUrlState({ minPrice: band.min, maxPrice: band.max });
                  }
                }}
                className={`text-[10px] px-2 py-1 rounded border transition-all cursor-pointer font-medium ${
                  isSelected ? 'bg-[#0B0B0B] text-[#C9A227] border-[#C9A227]' : 'bg-[#F8F7F2] border-[#E8E5DD] text-gray-700 hover:border-[#0B0B0B]'
                }`}
              >
                {band.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Swatches Filter */}
      {availableColors.length > 0 && (
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">COLOR SWATCHES</h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {availableColors.map((col) => {
              const isSelected = selectedColor.toLowerCase() === col.name.toLowerCase();
              return (
                <button
                  key={col.name}
                  title={col.name}
                  onClick={() => {
                    const next = isSelected ? '' : col.name;
                    setSelectedColor(next);
                    updateUrlState({ color: next });
                  }}
                  className={`group relative h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                    isSelected ? 'border-[#C9A227] scale-110 shadow-md ring-2 ring-[#C9A227]/30' : 'border-[#E8E5DD] hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && (
                    <Check size={12} className={col.hex === '#FFFFFF' || col.hex === '#F8F7F2' ? 'text-black' : 'text-white'} />
                  )}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-[#0B0B0B] text-white text-[9px] font-bold py-0.5 px-1.5 rounded whitespace-nowrap z-30 shadow-lg uppercase tracking-wider">
                    {col.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Size Filter */}
      {availableSizes.length > 0 && (
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">AVAILABLE SIZES</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((sz) => {
              const isSelected = selectedSize === sz;
              return (
                <button
                  key={sz}
                  onClick={() => {
                    const next = isSelected ? '' : sz;
                    setSelectedSize(next);
                    updateUrlState({ size: next });
                  }}
                  className={`px-3 py-1 border text-xs font-semibold rounded transition-all cursor-pointer ${
                    isSelected ? 'bg-[#0B0B0B] text-[#C9A227] border-[#C9A227] shadow-xs' : 'bg-white border-[#E8E5DD] text-gray-800 hover:border-[#0B0B0B]'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Top Category */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">CATEGORIES</h4>
        <div className="flex flex-col gap-1">
          {TOP_LEVEL_CATEGORIES.map((cat) => {
            const isSelected = categoryFilter.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => {
                  const next = isSelected ? '' : cat.name;
                  setCategoryFilter(next);
                  setSelectedSubCategory('');
                  updateUrlState({ category: next, subCategory: undefined });
                }}
                className={`text-left text-xs py-1.5 px-2.5 rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                  isSelected ? 'text-[#0B0B0B] font-bold bg-[#F8F7F2] border border-[#E8E5DD]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check size={12} className="text-[#C9A227]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Gender */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">GENDER</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {['Men', 'Women', 'Kids', 'Unisex'].map((gen) => {
            const isSelected = selectedGender === gen;
            return (
              <button
                key={gen}
                onClick={() => {
                  const next = isSelected ? '' : gen;
                  setSelectedGender(next);
                  updateUrlState({ gender: next });
                }}
                className={`py-1.5 px-2 border rounded text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#0B0B0B] text-[#C9A227] border-[#0B0B0B]' : 'bg-white border-[#E8E5DD] text-gray-700 hover:border-[#0B0B0B]'
                }`}
              >
                {gen}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Customization */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">CUSTOMIZATION</h4>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const next = selectedPersonalized === 'yes' ? '' : 'yes';
              setSelectedPersonalized(next);
              updateUrlState({ personalized: next });
            }}
            className={`flex-1 py-1.5 border rounded text-[11px] font-bold uppercase cursor-pointer transition-colors ${
              selectedPersonalized === 'yes' ? 'bg-[#0B0B0B] text-[#C9A227] border-[#C9A227]' : 'bg-white border-[#E8E5DD] text-gray-700'
            }`}
          >
            Personalized
          </button>
          <button
            onClick={() => {
              const next = selectedPersonalized === 'no' ? '' : 'no';
              setSelectedPersonalized(next);
              updateUrlState({ personalized: next });
            }}
            className={`flex-1 py-1.5 border rounded text-[11px] font-bold uppercase cursor-pointer transition-colors ${
              selectedPersonalized === 'no' ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]' : 'bg-white border-[#E8E5DD] text-gray-700'
            }`}
          >
            Standard
          </button>
        </div>
      </div>

      {/* 7. Material */}
      {availableMaterials.length > 0 && (
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">MATERIAL</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableMaterials.map((mat) => {
              const isSelected = selectedMaterial === mat;
              return (
                <button
                  key={mat}
                  onClick={() => {
                    const next = isSelected ? '' : mat;
                    setSelectedMaterial(next);
                    updateUrlState({ material: next });
                  }}
                  className={`px-2.5 py-1 border text-[11px] rounded transition-all cursor-pointer ${
                    isSelected ? 'bg-[#0B0B0B] text-[#C9A227] border-[#C9A227]' : 'bg-white border-[#E8E5DD] text-gray-700 hover:border-[#0B0B0B]'
                  }`}
                >
                  {mat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. Fit */}
      {availableFits.length > 0 && (
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">FIT</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableFits.map((fit) => {
              const isSelected = selectedFit === fit;
              return (
                <button
                  key={fit}
                  onClick={() => {
                    const next = isSelected ? '' : fit;
                    setSelectedFit(next);
                    updateUrlState({ fit: next });
                  }}
                  className={`px-2.5 py-1 border text-[11px] rounded transition-all cursor-pointer ${
                    isSelected ? 'bg-[#0B0B0B] text-[#C9A227] border-[#C9A227]' : 'bg-white border-[#E8E5DD] text-gray-700 hover:border-[#0B0B0B]'
                  }`}
                >
                  {fit}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 9. Availability */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">AVAILABILITY</h4>
        <button
          onClick={() => {
            const next = selectedAvailability === 'In Stock' ? '' : 'In Stock';
            setSelectedAvailability(next);
            updateUrlState({ availability: next });
          }}
          className={`w-full py-1.5 px-3 border rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
            selectedAvailability === 'In Stock' ? 'bg-[#0B0B0B] text-[#C9A227] border-[#C9A227]' : 'bg-white border-[#E8E5DD] text-gray-700'
          }`}
        >
          <span>In Stock Only</span>
          {selectedAvailability === 'In Stock' && <Check size={12} />}
        </button>
      </div>

    </div>
  );

  return (
    <div id="shop-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-[120px] min-h-screen bg-[#F8F7F2] text-[#111111]">
      
      {/* 1. SEO Breadcrumb Navigation Trail */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
        <button onClick={() => resetFilters()} className="hover:text-[#C9A227] cursor-pointer">Home</button>
        <ChevronRight size={10} />
        <button onClick={() => { setCategoryFilter(''); setSearchQuery(''); }} className="hover:text-[#C9A227] cursor-pointer">Shop</button>
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
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B0B0B] tracking-wide mt-1 uppercase flex items-center gap-3">
            <span>{activeHeaderLabel}</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 bg-[#F8F7F2] border border-[#E8E5DD] text-[#C9A227] rounded-full">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            </span>
          </h1>
          {searchQuery && !searchQuery.startsWith('coll:') && (
            <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
              <Sparkles size={12} className="text-[#C9A227]" /> Search results for: <span className="text-[#0B0B0B] font-bold">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Desktop View Mode & Filter Toggle & Sorting */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => {
                const val = e.target.value;
                setSortOption(val);
                updateUrlState({ sort: val });
              }}
              className="bg-[#F8F7F2] border border-[#E8E5DD] text-xs text-gray-900 py-1.5 px-3 rounded-lg focus:border-[#C9A227] outline-none font-bold cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest</option>
              <option value="bestselling">Best Selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

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
            onClick={() => setShowDesktopFilters(!showDesktopFilters)}
            className={`hidden md:flex px-4 py-2 border rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer items-center gap-2 ${
              showDesktopFilters ? 'bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-sm' : 'bg-white border-[#E8E5DD] text-gray-700 hover:bg-gray-50 shadow-xs'
            }`}
          >
            <SlidersHorizontal size={13} className="text-[#C9A227]" /> {showDesktopFilters ? 'Hide Filters' : 'Filter'}
          </button>
        </div>
      </div>

      {/* 3. Subcategories Pills Bar */}
      {availableSubCategories.length > 0 && (
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8E5DD] shadow-xs mb-6 space-y-2">
          <span className="text-[10px] font-serif font-bold text-[#C9A227] tracking-widest uppercase">SUBCATEGORIES</span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedSubCategory('');
                updateUrlState({ subCategory: undefined });
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all ${
                !selectedSubCategory
                  ? 'bg-[#0B0B0B] text-[#C9A227] border border-[#C9A227]'
                  : 'bg-[#F8F7F2] text-gray-600 border border-[#E8E5DD] hover:border-[#0B0B0B]'
              }`}
            >
              All {categoryFilter}
            </button>
            {availableSubCategories.map((sc) => {
              const isSel = selectedSubCategory === sc.name;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    const next = isSel ? '' : sc.name;
                    setSelectedSubCategory(next);
                    updateUrlState({ subCategory: next });
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all ${
                    isSel
                      ? 'bg-[#0B0B0B] text-[#C9A227] border border-[#C9A227]'
                      : 'bg-[#F8F7F2] text-gray-600 border border-[#E8E5DD] hover:border-[#0B0B0B]'
                  }`}
                >
                  {sc.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Active Filters Removable Pills Bar */}
      {activeFiltersCount > 0 && (
        <div className="bg-white p-3 rounded-xl border border-[#E8E5DD] shadow-xs mb-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Active Filters:</span>
          {categoryFilter && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0B0B] text-[#C9A227] text-[11px] font-semibold rounded-full border border-[#C9A227]">
              {categoryFilter}
              <X size={11} className="cursor-pointer hover:text-white" onClick={() => { setCategoryFilter(''); updateUrlState({ category: undefined }); }} />
            </span>
          )}
          {selectedSubCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0B0B] text-white text-[11px] font-semibold rounded-full border border-[#0B0B0B]">
              {selectedSubCategory}
              <X size={11} className="cursor-pointer hover:text-[#C9A227]" onClick={() => { setSelectedSubCategory(''); updateUrlState({ subCategory: undefined }); }} />
            </span>
          )}
          {selectedGender && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0B0B] text-white text-[11px] font-semibold rounded-full">
              Gender: {selectedGender}
              <X size={11} className="cursor-pointer hover:text-[#C9A227]" onClick={() => { setSelectedGender(''); updateUrlState({ gender: undefined }); }} />
            </span>
          )}
          {selectedSize && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0B0B] text-[#C9A227] text-[11px] font-semibold rounded-full border border-[#C9A227]">
              Size {selectedSize}
              <X size={11} className="cursor-pointer hover:text-white" onClick={() => { setSelectedSize(''); updateUrlState({ size: undefined }); }} />
            </span>
          )}
          {selectedColor && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0B0B] text-white text-[11px] font-semibold rounded-full">
              Color: {selectedColor}
              <X size={11} className="cursor-pointer hover:text-[#C9A227]" onClick={() => { setSelectedColor(''); updateUrlState({ color: undefined }); }} />
            </span>
          )}
          {selectedPersonalized && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0B0B] text-[#C9A227] text-[11px] font-semibold rounded-full">
              {selectedPersonalized === 'yes' ? 'Personalized' : 'Standard'}
              <X size={11} className="cursor-pointer hover:text-white" onClick={() => { setSelectedPersonalized(''); updateUrlState({ personalized: undefined }); }} />
            </span>
          )}
          {(priceMinInput > 0 || priceMaxInput < catalogMaxPrice) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0B0B] text-white text-[11px] font-semibold rounded-full">
              ₹{priceMinInput} - ₹{priceMaxInput}
              <X
                size={11}
                className="cursor-pointer hover:text-[#C9A227]"
                onClick={() => {
                  setPriceMinInput(0);
                  setPriceMaxInput(catalogMaxPrice);
                  updateUrlState({ minPrice: undefined, maxPrice: undefined });
                }}
              />
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-[11px] font-bold text-red-600 hover:underline uppercase tracking-wider ml-auto cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 5. Sticky Mobile Filter & Sort Bar */}
      <div className="md:hidden sticky top-[72px] z-40 bg-white border border-[#E8E5DD] rounded-xl p-2.5 mb-6 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 py-2.5 min-h-[44px] bg-[#0B0B0B] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal size={15} className="text-[#C9A227]" />
          <span>FILTER {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <div className="flex-1 min-h-[44px] flex items-center justify-center bg-[#F8F7F2] border border-[#E8E5DD] rounded-lg relative px-2">
          <ArrowUpDown size={13} className="text-[#C9A227] mr-1 shrink-0" />
          <select
            value={sortOption}
            onChange={(e) => {
              const val = e.target.value;
              setSortOption(val);
              updateUrlState({ sort: val });
            }}
            className="w-full bg-transparent text-xs font-bold text-[#0B0B0B] outline-none cursor-pointer py-2 uppercase"
          >
            <option value="recommended">SORT: RECOMMENDED</option>
            <option value="newest">SORT: NEWEST</option>
            <option value="bestselling">SORT: BEST SELLING</option>
            <option value="price-low">SORT: LOW TO HIGH</option>
            <option value="price-high">SORT: HIGH TO LOW</option>
            <option value="discount">SORT: DISCOUNT</option>
            <option value="rating">SORT: RATING</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* 6. Desktop Left Filter Sidebar */}
        <AnimatePresence>
          {showDesktopFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hidden md:block w-full lg:w-64 shrink-0 bg-white border border-[#E8E5DD] p-5 rounded-xl space-y-6 h-fit max-h-[85vh] overflow-y-auto shadow-xs"
            >
              <FilterContent />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 7. Product Grid & Catalog Output */}
        <div className="flex-1 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E8E5DD] p-12 rounded-xl text-center space-y-4 shadow-xs">
              <div className="text-[#C9A227] text-3xl font-serif">✦</div>
              <h3 className="text-base font-serif font-bold text-[#0B0B0B] uppercase tracking-wider">No products found</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                We couldn't find any items matching your selected criteria. Try expanding your price range, clearing specific filters, or checking out our latest drops.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#0B0B0B] text-[#C9A227] hover:bg-[#C9A227] hover:text-black border border-[#0B0B0B] text-xs font-bold uppercase tracking-widest cursor-pointer transition-all rounded-lg"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => {
                    resetFilters();
                    setSearchQuery('coll:New Arrivals');
                  }}
                  className="px-6 py-2.5 bg-[#F8F7F2] text-[#0B0B0B] hover:border-[#0B0B0B] border border-[#E8E5DD] text-xs font-bold uppercase tracking-widest cursor-pointer transition-all rounded-lg"
                >
                  Explore New Arrivals
                </button>
              </div>
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

      {/* 8. Full-Screen / Bottom Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-2xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Drawer Top Bar */}
              <div className="p-4 bg-[#F8F7F2] border-b border-[#E8E5DD] flex items-center justify-between">
                <span className="text-sm font-serif font-bold text-[#0B0B0B] uppercase tracking-wider flex items-center gap-2">
                  <Filter size={16} className="text-[#C9A227]" /> BLACKFAWN FILTERS
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] text-gray-700 hover:text-black flex items-center justify-center cursor-pointer"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Filter Controls Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <FilterContent />
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 bg-white border-t border-[#E8E5DD] grid grid-cols-2 gap-3">
                <button
                  onClick={resetFilters}
                  className="py-3 min-h-[44px] bg-[#F8F7F2] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider border border-[#E8E5DD] rounded-lg cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="py-3 min-h-[44px] bg-[#0B0B0B] text-[#C9A227] text-xs font-bold uppercase tracking-wider border border-[#0B0B0B] rounded-lg cursor-pointer shadow-md"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

