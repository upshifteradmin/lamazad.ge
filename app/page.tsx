'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Truck,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductCard } from '@/components/shop/ProductCard';
import { BrandTicker } from '@/components/layout/BrandTicker';

export default function HomePage() {
  const [activeBrand, setActiveBrand] = useState<string>('all');
  const saleProducts = PRODUCTS.filter((p) => p.originalPrice && p.originalPrice > p.price);

  const handleSelectBrand = (brand: string) => {
    setActiveBrand(brand);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#09090b] relative overflow-hidden bg-grid-pattern">
      {/* Subtle Glow Ambient Lights */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-lime/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] right-0 w-[450px] h-[300px] bg-brand-cyan/10 blur-[140px] pointer-events-none rounded-full" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Direct Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border-subtle text-xs font-mono text-gray-300 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
          <span className="text-brand-lime font-bold">ბათუმი:</span>
          <span>მიტანა 24 საათში ადგილზე მოსინჯვით</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-none max-w-4xl mx-auto">
          ჩაიცვი <span className="text-brand-lime glow-volt">ლამაზად.</span>
          <br />
          <span className="text-gray-300">BATUMI</span>
        </h1>

        <p className="mt-4 text-xs sm:text-sm text-gray-400 max-w-xl mx-auto font-mono">
          Nike • Adidas • Jordan • Levi's • New Balance • Carhartt
          <br className="hidden sm:inline" /> 100% ორიგინალი გარანტიით & ბათუმის ექსპრეს მიწოდებით
        </p>

        {/* Direct Action Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto">
          <a
            href="#catalog"
            className="flex-1 min-h-[48px] px-6 py-3 rounded-2xl bg-brand-lime text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-brand-lime/90 active:scale-95 transition-all shadow-neon-lime"
          >
            <span>კოლექციის ნახვა</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#sale"
            className="flex-1 min-h-[48px] px-6 py-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 hover:border-rose-400 text-rose-400 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-all shadow-[0_0_15px_rgba(244,63,94,0.25)]"
          >
            <span>🔥 SALE (-30%)</span>
          </a>
        </div>

        {/* Minimal Delivery Highlight */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs font-mono text-gray-400 border-t border-border-subtle/60 pt-5 max-w-sm mx-auto">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-brand-lime" />
            მიტანა 24 საათში
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
            100% ორიგინალი
          </span>
        </div>
      </section>

      {/* 2. GLOBAL BRANDS TICKER / MARQUEE STRIP */}
      <BrandTicker onSelectBrand={handleSelectBrand} />

      {/* 3. PRODUCT CATALOG: READY FOOTWEAR & CLOTHING */}
      <section id="catalog" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              კოლექცია 2026
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-lime/10 text-brand-lime border border-brand-lime/30">
                BATUMI
              </span>
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              მზა ფეხსაცმელი და ტანსაცმელი • 100% ორიგინალი
            </p>
          </div>

          <Link
            href="/studio"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-brand-cyan hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            საკუთარი დიზაინის აწყობა (Studio)
          </Link>
        </div>

        {/* Product Grid Component with Category, Brand & SALE Filters */}
        <ProductGrid
          products={PRODUCTS}
          activeBrand={activeBrand}
          onBrandChange={setActiveBrand}
        />
      </section>

      {/* 4. STANDALONE SALE SHOWCASE SECTION */}
      <section id="sale" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="rounded-3xl bg-gradient-to-br from-[#1c0c12]/90 via-[#13090e] to-surface border border-rose-500/35 p-6 sm:p-8 shadow-[0_0_35px_rgba(244,63,94,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 blur-[110px] pointer-events-none rounded-full" />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-4 border-b border-rose-500/20">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ფასდაკლებები
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                შეზღუდული რაოდენობა — სპეციალური ფასები დღეს
              </p>
            </div>

            <div className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl self-start sm:self-auto font-bold">
              ფასდაკლება 30%-მდე
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleProducts.map((product) => (
              <ProductCard key={`sale-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. 1-CLICK BATUMI EXPRESS CONTACT */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-subtle relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lime/10 blur-[90px] rounded-full pointer-events-none" />
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            გჭირდებათ დახმარება შეკვეთაში?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-md mx-auto">
            ჩვენი გუნდი მზადაა პირდაპირ WhatsApp-ში ან Messenger-ში დაგეხმაროთ ზომისა და მოდელის შერჩევაში.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/995577000000?text=%E1%83%92%E1%83%90%E1%83%9B%E1%83%90%E1%83%A0%E1%83%AF%E1%83%9D%E1%83%91%E1%83%90%2C%20lamazad.ge-%E1%83%A1%20%E1%83%A8%E1%83%94%E1%83%99%E1%83%95%E1%83%94%E1%83%97%E1%83%90%E1%83%96%E1%83%94%20%E1%83%9B%E1%83%A1%E1%83%A3%E1%83%A0%E1%83%A1%20%E1%83%99%E1%83%9D%E1%83%9C%E1%83%A1%E1%83%A3%E1%83%9A%E1%83%A2%E1%83%90%E1%83%AA%E1%83%98%E1%83%90"
              target="_blank"
              rel="noreferrer"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <span>WhatsApp კონსულტაცია</span>
            </a>
            <a
              href="https://m.me/lamazad.ge"
              target="_blank"
              rel="noreferrer"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0084FF] hover:bg-[#0070db] text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <span>Messenger ჩატი</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
