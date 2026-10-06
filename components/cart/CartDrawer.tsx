'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Zap,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatGEL } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    openCheckout,
    getTotalPrice,
    getTotalCount,
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const totalCount = getTotalCount();
  const freeShippingThreshold = 200;
  const progressToFreeShipping = Math.min(100, (totalPrice / freeShippingThreshold) * 100);

  if (!isDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDrawer}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer container: full width on mobile, max-w-md on desktop */}
        <div className="fixed inset-y-0 right-0 w-full sm:max-w-md flex pl-0 sm:pl-6 pointer-events-none">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="w-full bg-[#0c0c10] border-l border-white/10 shadow-2xl flex flex-col justify-between text-white pointer-events-auto h-full"
          >
            {/* 1. Header */}
            <div className="px-5 py-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-surface/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-lime/15 border border-brand-lime/30 flex items-center justify-center text-brand-lime shadow-neon-lime">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    კალათა
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-brand-lime text-black">
                      {totalCount}
                    </span>
                  </h2>
                  <p className="text-[10px] sm:text-[11px] font-mono text-brand-lime tracking-tight">
                    ბათუმში მიტანა 24 საათში
                  </p>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="w-10 h-10 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
                aria-label="დახურვა"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Free Shipping Progress in Batumi */}
            <div className="px-5 py-3 bg-[#121217] border-b border-white/10 shrink-0">
              <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Truck className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  {totalPrice >= freeShippingThreshold ? (
                    <span className="text-brand-lime font-bold">უფასო მიტანა ბათუმში! 🎉</span>
                  ) : (
                    <span>
                      კიდევ <span className="text-brand-lime font-bold">{formatGEL(freeShippingThreshold - totalPrice)}</span> უფასო მიტანამდე
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-zinc-400 font-bold">
                  {progressToFreeShipping.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-brand-cyan to-brand-lime transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* 3. Items List with responsive touch-friendly cards */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 overscroll-contain">
              {items.length === 0 ? (
                <div className="text-center py-20 px-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">კალათა ცარიელია</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-6">
                    შეარჩიეთ სნეიკერები და ტანსაცმელი კოლექციიდან
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="px-6 py-2.5 rounded-xl bg-brand-lime text-black font-extrabold text-xs shadow-neon-lime hover:scale-105 transition-all"
                  >
                    კოლექციის ნახვა
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-[#14141a] border border-white/10 flex gap-3 sm:gap-3.5 items-center relative transition-all hover:border-white/20"
                  >
                    {/* Item Image */}
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 72px, 80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      {item.isCustomStudio && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 mb-1 font-bold">
                          <Sparkles className="w-2.5 h-2.5" />
                          STUDIO MERCH
                        </span>
                      )}

                      <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-tight">
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-zinc-300">
                          {item.size}
                        </span>
                        {item.colorName && (
                          <span className="truncate text-zinc-400">
                            • {item.colorName}
                          </span>
                        )}
                      </div>

                      {item.customDetails?.textPrint && (
                        <div className="text-[10px] text-brand-cyan font-mono truncate mt-0.5">
                          პრინტი: &quot;{item.customDetails.textPrint}&quot;
                        </div>
                      )}

                      {/* Price and Mobile-Optimized Quantity Controls */}
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-sm sm:text-base font-black text-brand-lime font-mono">
                          {formatGEL(item.price * item.quantity)}
                        </span>

                        {/* Tactile Quantity Controls (Thumb-friendly 32px targets) */}
                        <div className="flex items-center gap-1 bg-[#1a1a24] border border-white/10 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
                            aria-label="რაოდენობის შემცირება"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-black w-6 text-center text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
                            aria-label="რაოდენობის გაზრდა"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Item Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 sm:p-2.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-90 transition-all shrink-0 self-start sm:self-center"
                      title="წაშლა"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 4. Footer Summary & Instant 1-Click Checkout */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0f0f14] space-y-3.5 shrink-0 pb-6 sm:pb-6 safe-area-pb">
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>პროდუქტები ({totalCount})</span>
                    <span className="text-white font-bold">{formatGEL(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>მიტანა ბათუმში</span>
                    <span className="text-brand-lime font-bold">
                      {totalPrice >= freeShippingThreshold ? 'უფასო (0 ₾)' : '5 ₾ (ექსპრეს)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-white/10">
                    <span>სულ ჯამი</span>
                    <span className="text-lg sm:text-xl text-brand-lime font-mono">
                      {formatGEL(totalPrice >= freeShippingThreshold ? totalPrice : totalPrice + 5)}
                    </span>
                  </div>
                </div>

                {/* Big Thumb-Friendly Checkout Button */}
                <button
                  onClick={() => {
                    closeDrawer();
                    openCheckout();
                  }}
                  className="w-full min-h-[50px] sm:min-h-[52px] py-3.5 rounded-2xl bg-brand-lime hover:bg-[#bbf000] text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-neon-lime"
                >
                  <Zap className="w-4 h-4 fill-black shrink-0" />
                  <span>ბათუმში ექსპრეს შეკვეთა (1-Click)</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>გადახდა ბარათით ან ნაღდით მიღებისას</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
