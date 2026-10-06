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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl bg-[#0e0e12] border border-border-subtle rounded-3xl overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-2 text-white"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-white/10 text-gray-400 hover:text-white hover:bg-black transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Media gallery */}
          <div className="p-6 bg-[#121217] flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-border-subtle">
              <Image
                src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
                alt={quickViewProduct.titleKa}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2.5 mt-4">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-brand-lime shadow-neon-lime' : 'border-transparent opacity-60'
                  }`}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info & Buying */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              {/* Brand and authenticity guarantee */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-zinc-300 font-mono font-black">
                  {quickViewProduct.brand}
                </span>
                {quickViewProduct.isAuthentic !== false && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    100% ორიგინალი
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase text-brand-lime px-2 py-0.5 rounded-md bg-brand-lime/10 border border-brand-lime/30">
                  {quickViewProduct.categoryLabelKa}
                </span>
                <span className="text-xs font-mono text-brand-muted">BATUMI EDITION</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white mb-2">
                {quickViewProduct.titleKa}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-black text-brand-lime font-mono">
                  {formatGEL(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm line-through text-brand-muted font-mono">
                    {formatGEL(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                {quickViewProduct.descriptionKa}
              </p>

              {/* Specs */}
              <div className="space-y-2 mb-6 p-4 rounded-2xl bg-surface border border-border-subtle">
                {quickViewProduct.specs.map((s, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-brand-muted">{s.label}:</span>
                    <span className="font-semibold text-white">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="text-xs font-mono uppercase text-brand-muted mb-2">
                  ზომა (SIZE):
                </div>
                <div className="flex gap-2">
                  {quickViewProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 rounded-xl font-mono text-xs font-bold border transition-all ${
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
                  className="py-3 px-4 rounded-xl border border-border-subtle hover:border-brand-lime bg-surface text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-lime" />
                  კალათაში
                </button>
                <button
                  onClick={handleInstantBuy}
                  className="py-3 px-4 rounded-xl bg-brand-lime text-black font-black text-xs flex items-center justify-center gap-2 transition-all hover:bg-brand-lime/90 active:scale-95 shadow-neon-lime"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  ლამაზად ყიდვა
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-brand-muted pt-2">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-brand-cyan" />
                  ბათუმში მიტანა 2-4 საათში
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-lime" />
                  100% ორიგინალი ხარისხი
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
