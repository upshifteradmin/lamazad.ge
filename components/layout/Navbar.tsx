'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
  Menu,
  X,
  Flame,
  Shirt,
  Footprints,
  Layers,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatGEL } from '@/lib/utils';

export function Navbar() {
  const { getTotalCount, getTotalPrice, openDrawer, soundEnabled, toggleSound } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-lime to-[#95b800] text-black font-black flex items-center justify-center text-xl shadow-neon-lime group-hover:scale-105 transition-transform">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white flex items-center gap-1.5">
                LAMAZAD<span className="text-brand-lime">.GE</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-brand-muted uppercase -mt-1 font-semibold">
                ლამაზად • BATUMI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <Link
              href="/#catalog"
              className="text-gray-300 hover:text-brand-lime transition-colors flex items-center gap-1.5"
            >
              <Shirt className="w-3.5 h-3.5 text-brand-lime" />
              კოლექცია
            </Link>
            <Link
              href="/#sale"
              className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 font-bold"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>SALE</span>
            </Link>
            <Link
              href="/studio"
              className="text-gray-300 hover:text-brand-cyan transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              DESIGN LAB (Studio)
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'ხმოვანი ეფექტები ჩართულია' : 'ხმა გამორთულია'}
            className="hidden sm:flex p-2.5 rounded-xl border border-border-subtle bg-surface text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-lime" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Design Studio CTA Button */}
          <Link
            href="/studio"
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan text-xs font-bold hover:bg-brand-cyan hover:text-black transition-all shadow-neon-cyan/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ააწყვე დიზაინი</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openDrawer}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface border border-border-subtle hover:border-brand-lime transition-all group"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-brand-lime group-hover:scale-110 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-brand-lime text-black font-mono font-black text-[9px] flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="text-xs font-mono font-bold text-white hidden sm:inline">
              {formatGEL(totalPrice)}
            </span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-surface border border-border-subtle text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c10] border-b border-border-subtle px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <Link
              href="/#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface/60 border border-white/5 text-sm font-semibold text-gray-200 hover:text-brand-lime hover:border-brand-lime/30 transition-all"
            >
              <Shirt className="w-4 h-4 text-brand-lime" />
              <span>კოლექცია & კატალოგი</span>
            </Link>
            <Link
              href="/#sale"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm font-bold text-rose-400 hover:text-rose-300 transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>SALE (ფასდაკლებები)</span>
            </Link>
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-sm font-bold text-brand-cyan hover:text-white transition-all"
            >
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <span>DESIGN LAB (შენი დიზაინი)</span>
            </Link>
          </div>

          {/* Quick Support & Showroom Bar in Mobile Menu */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5 text-xs text-gray-400">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-500">ბათუმის შოურუმი:</span>
              <span className="text-[11px] font-mono text-brand-lime font-bold">24სთ მიტანა</span>
            </div>
            <a
              href="https://wa.me/995500990929?text=%E1%83%92%E1%83%90%E1%83%9B%E1%83%90%E1%83%A0%E1%83%AF%E1%83%9D%E1%83%91%E1%83%90%2C%20lamazad.ge-%E1%83%A1%20%E1%83%99%E1%83%9D%E1%83%9C%E1%83%A1%E1%83%A3%E1%83%9A%E1%83%A2%E1%83%90%E1%83%AA%E1%83%98%E1%83%90"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>WhatsApp კონსულტაცია (+995 500 99 09 29)</span>
            </a>
            <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-mono">
              <span>რუსთაველის 18, ბათუმი</span>
              <button
                onClick={toggleSound}
                className="flex items-center gap-1 text-zinc-400 hover:text-white"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-brand-lime" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? 'ხმა: ჩართულია' : 'ხმა: გამორთულია'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
