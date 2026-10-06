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
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-screen max-w-md bg-[#0c0c10] border-l border-border-subtle shadow-2xl flex flex-col justify-between text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight text-white">
                    კალათა ({totalCount})
                  </h2>
                  <p className="text-[11px] font-mono text-brand-lime">
                    BATUMI 24H EXPRESS READY
                  </p>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress in Batumi */}
            <div className="px-6 py-3 bg-surface-card border-b border-border-subtle">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Truck className="w-3.5 h-3.5 text-brand-cyan" />
                  {totalPrice >= freeShippingThreshold ? (
                    <span className="text-brand-lime font-bold">უფასო კურიერი ბათუმში გააქტიურებულია! 🎉</span>
                  ) : (
                    <span>
                      კიდევ <span className="text-brand-lime font-bold">{formatGEL(freeShippingThreshold - totalPrice)}</span> უფასო მიტანამდე
                    </span>
                  )}
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                  {progressToFreeShipping.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-cyan to-brand-lime transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-2">თქვენი კალათა ცარიელია</p>
                  <p className="text-xs text-brand-muted">
                    შეარჩიეთ დროპები ან შექმენით დიზაინი Studio-ში
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-surface border border-border-subtle flex gap-3.5 items-center relative group"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-border-subtle shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      {item.isCustomStudio && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-lime/10 text-brand-lime border border-brand-lime/30 mb-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          CUSTOM STUDIO MERCH
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <div className="text-[11px] text-brand-muted font-mono mt-0.5">
                        ზომა: {item.size} {item.colorName ? `• ${item.colorName}` : ''}
                      </div>

                      {item.customDetails?.textPrint && (
                        <div className="text-[10px] text-brand-cyan font-mono truncate mt-0.5">
                          პრინტი: &quot;{item.customDetails.textPrint}&quot;
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-black text-brand-lime font-mono">
                          {formatGEL(item.price * item.quantity)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-surface-card border border-border-subtle rounded-lg px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-gray-500 hover:text-brand-coral transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border-subtle bg-surface-card space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>პროდუქტები</span>
                    <span className="font-mono text-white">{formatGEL(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>მიტანა ბათუმში</span>
                    <span className="font-mono text-brand-lime">
                      {totalPrice >= freeShippingThreshold ? 'უფასო (0 ₾)' : '5 ₾ (ექსპრეს)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-border-subtle">
                    <span>სულ გადასახდელი</span>
                    <span className="text-xl text-brand-lime font-mono">
                      {formatGEL(totalPrice >= freeShippingThreshold ? totalPrice : totalPrice + 5)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={openCheckout}
                  className="w-full py-4 rounded-xl bg-brand-lime text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-brand-lime/90 active:scale-95 transition-all shadow-neon-lime"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  ბათუმში ექსპრეს შეკვეთა (1-Click)
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-brand-muted">
                  <ShieldCheck className="w-3 h-3 text-brand-lime" />
                  გადახდა ბარათით ან ნაღდით მიღებისას
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
