'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/products';
import { Search, RotateCcw, ArrowUpDown, Tag, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  activeBrand?: string;
  onBrandChange?: (brand: string) => void;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'discount';

export function ProductGrid({ products, activeBrand, onBrandChange }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [internalBrand, setInternalBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const currentBrand = activeBrand !== undefined ? activeBrand : internalBrand;

  const handleBrandSelect = (brand: string) => {
    if (onBrandChange) {
      onBrandChange(brand);
    } else {
      setInternalBrand(brand);
    }
  };

  const categories = [
    { id: 'all', label: 'ყველა' },
    { id: 'sneakers', label: '👟 სნეიკერები' },
    { id: 'streetwear', label: '👕 ტანსაცმელი' },
    { id: 'limited-drops', label: '💎 ლიმიტირებული' },
    { id: 'sale', label: '🔥 SALE %' },
  ];

  // Brand item counters
  const brandList = [
    'all',
    'Nike',
    'Adidas',
    'Jordan',
    "Levi's",
    'New Balance',
    'Carhartt',
    'Lamazad Custom',
  ];

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    brandList.forEach((b) => {
      if (b !== 'all') {
        counts[b] = products.filter((p) => p.brand.toLowerCase() === b.toLowerCase()).length;
      }
    });
    return counts;
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'sale'
          ? Boolean(p.originalPrice && p.originalPrice > p.price)
          : p.category === selectedCategory;

      const matchesBrand =
        currentBrand === 'all'
          ? true
          : p.brand.toLowerCase() === currentBrand.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.titleKa.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.descriptionKa.toLowerCase().includes(q);

      return matchesCategory && matchesBrand && matchesSearch;
    });

    // Sorting logic
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      result = [...result].sort((a, b) => {
        const discA = a.originalPrice ? a.originalPrice - a.price : 0;
        const discB = b.originalPrice ? b.originalPrice - b.price : 0;
        return discB - discA;
      });
    }

    return result;
  }, [products, selectedCategory, currentBrand, searchQuery, sortBy]);

  const isFiltered =
    selectedCategory !== 'all' ||
    currentBrand !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'default';

  const handleResetFilters = () => {
    setSelectedCategory('all');
    handleBrandSelect('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="w-full">
      {/* 1. TOP TOOLBAR: Category Pills + Search + Sorting */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Category Tabs */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              const isSale = c.id === 'sale';

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                    isSelected && isSale
                      ? 'border-rose-500 bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                      : isSelected
                      ? 'border-brand-lime bg-brand-lime text-black shadow-neon-lime'
                      : isSale
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:border-rose-400/60'
                      : 'border-white/10 bg-[#121217] text-zinc-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Product Count Pill */}
          <div className="text-[11px] font-mono text-zinc-400 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-lime" />
            <span>{filteredAndSortedProducts.length} მოდელი მარაგშია</span>
          </div>
        </div>

        {/* Search & Sort Controls Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ძებნა: Nike, Samba, Levi's..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#121217] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-lime transition-colors"
            />
          </div>

          {/* Sort Selector + Clear Filter Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 bg-[#121217] border border-white/10 rounded-xl px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="დალაგება"
                className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer pr-1"
              >
                <option value="default" className="bg-[#121217] text-white">
                  დალაგება: რეკომენდებული
                </option>
                <option value="price-asc" className="bg-[#121217] text-white">
                  ფასი: დაბლიდან მაღლა
                </option>
                <option value="price-desc" className="bg-[#121217] text-white">
                  ფასი: მაღლიდან დაბლა
                </option>
                <option value="discount" className="bg-[#121217] text-white">
                  უდიდესი ფასდაკლება
                </option>
              </select>
            </div>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-mono text-zinc-400 hover:text-brand-lime flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>გასუფთავება</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. BRAND SELECTOR STRIP: Minimalist editorial chips */}
      <div className="mb-6 pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {brandList.map((brandKey) => {
            const isSelected = currentBrand.toLowerCase() === brandKey.toLowerCase();
            const displayName = brandKey === 'all' ? 'ყველა ბრენდი' : brandKey;
            const count = brandCounts[brandKey] ?? 0;

            if (brandKey !== 'all' && count === 0) return null;

            return (
              <button
                key={brandKey}
                onClick={() => handleBrandSelect(brandKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'border-white bg-white text-black shadow-md'
                    : 'border-white/10 bg-[#121217]/70 text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{displayName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-black/15 text-black font-black' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRODUCT GRID: Smooth, instant 2-col on mobile, 3/4-col on desktop */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="p-12 text-center border border-white/10 rounded-2xl bg-[#111116] my-6">
          <p className="text-zinc-400 text-sm">პროდუქტი ვერ მოიძებნა თქვენი პარამეტრებით.</p>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-lime text-black text-xs font-bold hover:bg-[#bbf000] transition-all"
            >
              ფილტრების გასუფთავება
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
