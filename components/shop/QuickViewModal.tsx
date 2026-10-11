'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Zap, Shield, Truck, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatGEL } from '@/lib/utils';

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addItem, openCheckout } = useCartStore();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('L');

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addItem({
      productId: quickViewProduct.id,
      title: quickViewProduct.titleKa,
      price: quickViewProduct.price,
      quantity: 1,
      image: quickViewProduct.images[0],
      size: selectedSize,
      colorName: quickViewProduct.colors[0]?.name,
    });
    setQuickViewProduct(null);
  };

  const handleInstantBuy = () => {
    addItem({
      productId: quickViewProduct.id,
      title: quickViewProduct.titleKa,
      price: quickViewProduct.price,
      quantity: 1,
      image: quickViewProduct.images[0],
      size: selectedSize,
      colorName: quickViewProduct.colors[0]?.name,
    });
    setQuickViewProduct(null);
    openCheckout();
  };

  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) setQuickViewProduct(null);
        }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center overscroll-contain"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-4xl max-h-[92vh] overflow-y-auto overscroll-contain bg-[#0e0e12] border border-border-subtle rounded-3xl shadow-2xl relative flex flex-col md:grid md:grid-cols-2 text-white my-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 rounded-full bg-black/80 border border-white/20 text-gray-300 hover:text-white hover:bg-black transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
            aria-label="დახურვა"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Media gallery */}
          <div className="p-4 sm:p-6 bg-[#121217] flex flex-col justify-start">
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-border-subtle">
              <Image
                src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
                alt={quickViewProduct.titleKa}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 sm:gap-2.5 mt-3 sm:mt-4 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx ? 'border-brand-lime shadow-neon-lime' : 'border-transparent opacity-60'
                  }`}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info & Buying */}
          <div className="p-5 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Brand and stock status */}
              <div className="flex items-center justify-between gap-2 mb-2 pr-8 sm:pr-0">
                <span className="text-xs uppercase tracking-widest text-zinc-300 font-mono font-black">
                  {quickViewProduct.brand}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  მარაგშია • ბათუმი
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase text-brand-lime px-2 py-0.5 rounded-md bg-brand-lime/10 border border-brand-lime/30">
                  {quickViewProduct.categoryLabelKa}
                </span>
                <span className="text-xs font-mono text-brand-muted">BATUMI EDITION</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
                {quickViewProduct.titleKa}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-black text-brand-lime font-mono">
                  {formatGEL(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm line-through text-brand-muted font-mono">
                    {formatGEL(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-5">
                {quickViewProduct.descriptionKa}
              </p>

              {/* Specs */}
              <div className="space-y-1.5 mb-5 p-3.5 rounded-2xl bg-surface border border-border-subtle">
                {quickViewProduct.specs.map((s, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-brand-muted">{s.label}:</span>
                    <span className="font-semibold text-white">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Size Selector */}
              <div className="mb-5">
                <div className="text-xs font-mono uppercase text-brand-muted mb-2">
                  ზომა (SIZE):
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] min-h-[44px] px-3 rounded-xl font-mono text-xs font-bold border transition-all flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-brand-lime bg-brand-lime text-black shadow-neon-lime'
                          : 'border-border-subtle bg-surface text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border-subtle">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="min-h-[48px] px-4 rounded-xl border border-border-subtle hover:border-brand-lime bg-surface text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-lime" />
                  კალათაში
                </button>
                <button
                  onClick={handleInstantBuy}
                  className="min-h-[48px] px-4 rounded-xl bg-brand-lime text-black font-black text-xs flex items-center justify-center gap-2 transition-all hover:bg-brand-lime/90 active:scale-95 shadow-neon-lime"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  ლამაზად ყიდვა
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-brand-muted pt-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  ბათუმში მიტანა 2-4 საათში
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-lime shrink-0" />
                  ადგილზე მოსინჯვით
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
