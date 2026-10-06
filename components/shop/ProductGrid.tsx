'use client';

import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product, BRANDS } from '@/lib/products';
import { Sparkles, SlidersHorizontal, Search, CheckCircle2, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  activeBrand?: string;
  onBrandChange?: (brand: string) => void;
}

export function ProductGrid({ products, activeBrand, onBrandChange }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [internalBrand, setInternalBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    { id: 'sale', label: '🔥 SALE % (ფასდაკლებები)' },
    { id: 'sneakers', label: '👟 ფეხსაცმელი' },
    { id: 'streetwear', label: '👕 ტანსაცმელი' },
    { id: 'limited-drops', label: '💎 ლიმიტირებული' },
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

  const brandCounts: Record<string, number> = {
    all: products.length,
  };
  brandList.forEach((b) => {
    if (b !== 'all') {
      brandCounts[b] = products.filter((p) => p.brand.toLowerCase() === b.toLowerCase()).length;
    }
  });

  const filteredProducts = products.filter((p) => {
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

    const matchesSearch =
      p.titleKa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionKa.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesSearch;
  });

  const isFiltered = selectedCategory !== 'all' || currentBrand !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedCategory('all');
    handleBrandSelect('all');
    setSearchQuery('');
  };

  return (
    <div className="w-full">
      {/* Category Pills & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            const isSaleBtn = c.id === 'sale';

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected && isSaleBtn
                    ? 'border-rose-500 bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.45)] font-black'
                    : isSelected
                    ? 'border-brand-lime bg-brand-lime text-black shadow-neon-lime'
                    : isSaleBtn
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 hover:border-rose-400 hover:text-white'
                    : 'border-border-subtle bg-surface text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ძებნა ბრენდით, მოდელით..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-border-subtle text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-lime transition-all"
          />
        </div>
      </div>

      {/* BRAND SELECTOR SUB-BAR with Live Counters */}
      <div className="mb-8 p-3 rounded-2xl bg-surface/70 border border-white/5 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ტოპ ბრენდები (100% ორიგინალი):
            </span>
          </div>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono text-zinc-400 hover:text-brand-lime flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              ფილტრების გასუფთავება
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {brandList.map((brandKey) => {
            const isSelected = currentBrand.toLowerCase() === brandKey.toLowerCase();
            const displayName = brandKey === 'all' ? 'ყველა ბრენდი' : brandKey;
            const count = brandCounts[brandKey] ?? 0;

            if (brandKey !== 'all' && count === 0) return null;

            return (
              <button
                key={brandKey}
                onClick={() => handleBrandSelect(brandKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'border-white bg-white text-black shadow-lg scale-[1.02]'
                    : 'border-white/10 bg-[#121217] text-zinc-300 hover:border-brand-lime/40 hover:text-white'
                }`}
              >
                <span>{displayName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
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

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center border border-border-subtle rounded-2xl bg-surface">
          <p className="text-gray-400 text-sm">პროდუქტი ვერ მოიძებნა თქვენი მოთხოვნით.</p>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-lime/10 text-brand-lime border border-brand-lime/30 text-xs font-bold hover:bg-brand-lime hover:text-black transition-all"
            >
              ფილტრების გასუფთავება
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
