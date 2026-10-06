'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatGEL } from '@/lib/utils';

export function FloatingCartDock() {
  const { items, openDrawer, openCheckout, getTotalCount, getTotalPrice } = useCartStore();

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();

  if (totalCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto max-w-md w-full bg-[#121217]/90 backdrop-blur-xl border border-white/15 p-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
          {/* Left: Cart Info Button */}
          <button
            onClick={openDrawer}
            className="flex items-center gap-3 pl-2 text-left group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-lime text-black font-mono font-black text-[10px] flex items-center justify-center">
                {totalCount}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-mono text-gray-400">კალათა ჯამში</div>
              <div className="text-sm font-black text-white font-mono">
                {formatGEL(totalPrice)}
              </div>
            </div>
          </button>

          {/* Right: Fast 1-Click Batumi Express Checkout */}
          <button
            onClick={openCheckout}
            className="min-h-[48px] flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-lime hover:bg-brand-lime/90 active:scale-95 text-black font-black text-xs sm:text-sm transition-all shadow-neon-lime"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>ბათუმში ყიდვა</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
