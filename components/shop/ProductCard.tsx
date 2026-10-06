'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  ShoppingBag,
  RotateCw,
  Video,
  Sparkles,
  Zap,
  Check,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Ruler,
} from 'lucide-react';
import { Product } from '@/lib/products';
import { useCartStore } from '@/lib/store';
import { formatGEL } from '@/lib/utils';
import { SizeModal } from './SizeModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openDrawer, openCheckout, setQuickViewProduct } = useCartStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [is360Mode, setIs360Mode] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'L');
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  // 360 Drag rotation tracking
  const dragStartX = useRef<number>(0);
  const isDragging360 = useRef<boolean>(false);

  const handlePointerDown360 = (e: React.PointerEvent) => {
    if (!is360Mode) return;
    dragStartX.current = e.clientX;
    isDragging360.current = true;
  };

  const handlePointerMove360 = (e: React.PointerEvent) => {
    if (!is360Mode || !isDragging360.current) return;
    const deltaX = e.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 30) {
      const step = deltaX > 0 ? 1 : -1;
      setCurrentImageIndex((prev) => {
        const next = (prev + step + product.images.length) % product.images.length;
        return next;
      });
      dragStartX.current = e.clientX;
    }
  };

  const handlePointerUp360 = () => {
    isDragging360.current = false;
  };

  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.titleKa,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      size: selectedSize,
      colorName: product.colors[0]?.name,
    });
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1400);
  };

  // 1-Click Batumi Express Buy Now
  const handleInstantBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.titleKa,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      size: selectedSize,
      colorName: product.colors[0]?.name,
    });
    openCheckout();
  };

  // Display image based on hover / 360 mode
  // In normal hover, show index 1 (flip view). In 360 mode, show current index.
  const displayImage = is360Mode
    ? product.images[currentImageIndex]
    : isHovered && product.images.length > 1
    ? product.images[1]
    : product.images[0];

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!is360Mode) setIsVideoMode(false);
        }}
        className="group relative flex flex-col rounded-2xl bg-surface-card border border-border-subtle hover:border-brand-lime/40 transition-all duration-500 overflow-hidden shadow-cyber-card hover:shadow-neon-lime/20"
      >
        {/* Media Container with Flip / 360 / Video */}
        <div
          onPointerDown={handlePointerDown360}
          onPointerMove={handlePointerMove360}
          onPointerUp={handlePointerUp360}
          className="relative w-full aspect-[4/5] bg-[#121216] overflow-hidden select-none cursor-pointer"
          onClick={() => setQuickViewProduct(product)}
        >
          {/* Stock countdown, Discount & Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5 pointer-events-none">
            {/* Dynamic 2026/2027 Neo-Streetwear Discount Badge */}
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.45)] border border-rose-400/40 font-mono tracking-tight group-hover:scale-110 transition-transform duration-300">
                -{discountPercent}%
              </span>
            )}

            {product.stockCount <= 5 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-coral/20 text-brand-coral border border-brand-coral/30 backdrop-blur-md animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                დარჩენილია მხოლოდ {product.stockCount} ცალი
              </span>
            ) : product.isLimitedDrop ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-lime/20 text-brand-lime border border-brand-lime/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                LIMITED DROP
              </span>
            ) : null}

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/60 text-gray-300 border border-white/10 backdrop-blur-md">
              ბათუმში მიტანა 24სთ
            </span>
          </div>

          {/* Interactive Mode Toggles (360° & Video Preview) */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            {/* 360 Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIs360Mode(!is360Mode);
                setIsVideoMode(false);
              }}
              title="360° როტაცია"
              className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                is360Mode
                  ? 'bg-brand-lime text-black border-brand-lime font-bold shadow-neon-lime'
                  : 'bg-black/60 text-white border-white/15 hover:border-brand-lime hover:text-brand-lime'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Video preview button if available */}
            {product.videoPreview && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVideoMode(!isVideoMode);
                  setIs360Mode(false);
                }}
                title="ვიდეო გადახედვა"
                className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                  isVideoMode
                    ? 'bg-brand-cyan text-black border-brand-cyan shadow-neon-cyan'
                    : 'bg-black/60 text-white border-white/15 hover:border-brand-cyan hover:text-brand-cyan'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 360 scrubber indicator badge */}
          {is360Mode && (
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/80 border border-brand-lime/40 text-[11px] font-mono text-brand-lime backdrop-blur-md">
                ◄ გაწიეთ მაუსით დასატრიალებლად ({currentImageIndex + 1}/{product.images.length}) ►
              </span>
            </div>
          )}

          {/* Main Visual: Video or Image */}
          {isVideoMode && product.videoPreview ? (
            <video
              src={product.videoPreview}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700"
            />
          ) : (
            <motion.div
              key={displayImage}
              initial={{ opacity: 0.85, scale: 1 }}
              animate={{ opacity: 1, scale: isHovered && !is360Mode ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full"
            >
              <Image
                src={displayImage}
                alt={product.titleKa}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent opacity-60" />
            </motion.div>
          )}

          {/* Quick View Button overlay on hover */}
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="px-4 py-2 rounded-xl bg-black/80 border border-white/20 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-2xl">
              <Eye className="w-3.5 h-3.5 text-brand-lime" />
              დეტალურად ნახვა
            </span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-5 flex flex-col flex-1 justify-between bg-surface-card">
          <div>
            {/* Brand identity & Authenticity badge */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-wider text-zinc-300 font-black font-mono">
                {product.brand}
              </span>
              {product.isAuthentic !== false && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  100% ორიგინალი
                </span>
              )}
            </div>

            <h3
              onClick={() => setQuickViewProduct(product)}
              className="text-base font-black text-white hover:text-brand-lime cursor-pointer line-clamp-1 transition-colors tracking-tight"
            >
              {product.titleKa}
            </h3>

            {/* Price with original price strikethrough & discount pill */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-black text-brand-lime font-mono">
                {formatGEL(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-zinc-500 line-through font-mono">
                    {formatGEL(product.originalPrice!)}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Size Selector + Size Recommendation trigger */}
          <div className="mt-4 pt-3 border-t border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-brand-muted">ზომა:</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSizeModalOpen(true);
                }}
                className="text-[11px] text-brand-cyan hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3 h-3" />
                ზომის გიდი
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
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

          {/* Dual Action Buttons (Add to Cart & 1-Click Fast Express Buy) */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                isAddedFeedback
                  ? 'border-brand-lime bg-brand-lime text-black font-extrabold'
                  : 'border-border-subtle bg-surface hover:border-brand-lime/60 hover:text-brand-lime text-white'
              }`}
            >
              {isAddedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  დამატებულია!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  კალათაში
                </>
              )}
            </button>

            <button
              onClick={handleInstantBuy}
              className="py-2.5 px-3 rounded-xl bg-brand-lime hover:bg-brand-lime/90 active:scale-95 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-neon-lime"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              ლამაზად ყიდვა
            </button>
          </div>
        </div>
      </motion.div>

      {/* Interactive Size Modal */}
      <SizeModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        productTitle={product.titleKa}
        onSelectSize={(size) => setSelectedSize(size)}
      />
    </>
  );
}
