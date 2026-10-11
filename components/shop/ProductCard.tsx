'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Flame,
  ShoppingBag,
  RotateCw,
  Video,
  Sparkles,
  Zap,
  Check,
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
  const { addItem, openCheckout, setQuickViewProduct } = useCartStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
    if (Math.abs(deltaX) > 25) {
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

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const hasSecondaryImage = product.images.length > 1;

  return (
    <>
      <div
        className="group relative flex flex-col rounded-2xl bg-[#111116] border border-white/[0.08] hover:border-white/25 transition-all duration-300 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-black/70 select-none"
      >
        {/* Media Container with Flip / 360 / Video */}
        <div
          onPointerDown={handlePointerDown360}
          onPointerMove={handlePointerMove360}
          onPointerUp={handlePointerUp360}
          className="relative w-full aspect-[4/5] bg-[#16161c] overflow-hidden cursor-pointer"
          onClick={() => setQuickViewProduct(product)}
        >
          {/* Top-Left Floating Badges */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 flex flex-col items-start gap-1 pointer-events-none max-w-[70%]">
            {hasDiscount && (
              <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-black bg-rose-500 text-white font-mono tracking-tight shadow-md">
                -{discountPercent}%
              </span>
            )}

            {product.stockCount <= 4 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>დარჩა {product.stockCount}</span>
              </span>
            ) : product.isLimitedDrop ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 backdrop-blur-md">
                <Sparkles className="w-3 h-3" />
                <span>LIMITED</span>
              </span>
            ) : null}
          </div>

          {/* Top-Right Interactive Mode Actions (360° & Video Preview & Quick View) */}
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            {/* 360 Degree Rotation Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIs360Mode(!is360Mode);
                setIsVideoMode(false);
              }}
              title="360° როტაცია"
              className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-all ${
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
                title="ვიდეო"
                className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-all ${
                  isVideoMode
                    ? 'bg-brand-cyan text-black border-brand-cyan shadow-neon-cyan'
                    : 'bg-black/60 text-white border-white/15 hover:border-brand-cyan hover:text-brand-cyan'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              title="დეტალურად ნახვა"
              className="p-1.5 sm:p-2 rounded-xl backdrop-blur-md border bg-black/60 text-white border-white/15 hover:border-white hover:text-white transition-all hidden sm:flex"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 360 scrubber indicator badge */}
          {is360Mode && (
            <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-center pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-black/85 border border-brand-lime/40 text-[10px] font-mono text-brand-lime backdrop-blur-md">
                ◄ გაწიეთ დასატრიალებლად ({currentImageIndex + 1}/{product.images.length}) ►
              </span>
            </div>
          )}

          {/* Visual Presentation: Clean, Zero-Flicker CSS Transitions */}
          {isVideoMode && product.videoPreview ? (
            <video
              src={product.videoPreview}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : is360Mode ? (
            <div className="relative w-full h-full">
              <Image
                src={product.images[currentImageIndex] || product.images[0]}
                alt={product.titleKa}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                priority={false}
              />
            </div>
          ) : (
            <div className="relative w-full h-full overflow-hidden">
              {/* Primary Image: Always in DOM (no unmounting) */}
              <Image
                src={product.images[0]}
                alt={product.titleKa}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                  hasSecondaryImage ? 'group-hover:opacity-0' : ''
                }`}
                priority={false}
              />

              {/* Secondary Hover Image (Clean CSS fade, ZERO browser reload) */}
              {hasSecondaryImage && (
                <Image
                  src={product.images[1]}
                  alt={`${product.titleKa} preview`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  priority={false}
                />
              )}

              {/* Subtle luxury vignette gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 pointer-events-none" />
            </div>
          )}

          {/* Quick Details button centered on hover for desktop */}
          <div className="absolute inset-0 z-10 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="px-3.5 py-1.5 rounded-xl bg-black/85 border border-white/20 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-xl">
              <Eye className="w-3.5 h-3.5 text-brand-lime" />
              დეტალები
            </span>
          </div>
        </div>

        {/* Product Details Section: Clean, Editorial Typography */}
        <div className="p-3.5 sm:p-4 md:p-5 flex flex-col flex-1 justify-between bg-[#111116]">
          <div>
            {/* Brand identity & Authentic stock status */}
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 font-bold font-mono">
                {product.brand}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                მარაგშია
              </span>
            </div>

            {/* Product Title */}
            <h3
              onClick={() => setQuickViewProduct(product)}
              className="text-xs sm:text-sm font-bold text-white hover:text-brand-lime cursor-pointer line-clamp-1 transition-colors tracking-tight leading-snug"
              title={product.titleKa}
            >
              {product.titleKa}
            </h3>

            {/* Price with original price strikethrough & discount pill */}
            <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1.5">
              <span className="text-base sm:text-lg md:text-xl font-black text-brand-lime font-mono">
                {formatGEL(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-zinc-500 line-through font-mono">
                  {formatGEL(product.originalPrice!)}
                </span>
              )}
            </div>
          </div>

          {/* Size Selector + Size Recommendation trigger */}
          <div className="mt-3 pt-2.5 border-t border-white/[0.07]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase text-zinc-500">ზომა:</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSizeModalOpen(true);
                }}
                className="text-[10px] text-zinc-400 hover:text-brand-cyan transition-colors flex items-center gap-1"
              >
                <Ruler className="w-2.5 h-2.5" />
                გიდი
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold transition-all border flex items-center justify-center shrink-0 active:scale-95 ${
                    selectedSize === size
                      ? 'border-brand-lime bg-brand-lime text-black font-black'
                      : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: Refined, Responsive and Sleek */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-3">
            <button
              onClick={handleAddToCart}
              className={`min-h-[38px] sm:min-h-[42px] py-1.5 px-2 rounded-xl border text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                isAddedFeedback
                  ? 'border-brand-lime bg-brand-lime text-black font-extrabold'
                  : 'border-white/10 bg-white/5 hover:border-brand-lime/60 hover:text-brand-lime text-white'
              }`}
            >
              {isAddedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>დამატდა!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>კალათაში</span>
                </>
              )}
            </button>

            <button
              onClick={handleInstantBuy}
              className="min-h-[38px] sm:min-h-[42px] py-1.5 px-2 rounded-xl bg-brand-lime hover:bg-[#bbf000] active:scale-95 text-black font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all shadow-md"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>ყიდვა</span>
            </button>
          </div>
        </div>
      </div>

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
