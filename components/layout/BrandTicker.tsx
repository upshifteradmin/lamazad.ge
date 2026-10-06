'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface BrandTickerProps {
  onSelectBrand?: (brand: string) => void;
}

export function BrandTicker({ onSelectBrand }: BrandTickerProps) {
  const brands = [
    { name: 'NIKE', query: 'Nike', sub: 'Beaverton, OR', tag: 'DUNK / AF1 / TECH' },
    { name: 'ADIDAS', query: 'Adidas', sub: 'Herzogenaurach', tag: 'SAMBA / GAZELLE / CAMPUS' },
    { name: 'AIR JORDAN', query: 'Jordan', sub: 'Jumpman 23', tag: 'RETRO 1 / 4' },
    { name: "LEVI'S", query: "Levi's", sub: 'Est. 1873 SF', tag: '501® ORIGINAL' },
    { name: 'NEW BALANCE', query: 'New Balance', sub: 'Boston, MA', tag: '550 / 2002R / 1906R' },
    { name: 'CARHARTT WIP', query: 'Carhartt', sub: 'Work In Progress', tag: 'DEARBORN CANVAS' },
    { name: 'LAMAZAD CUSTOM', query: 'Lamazad Custom', sub: 'Batumi Studio', tag: 'LIMITED DROPS' },
  ];

  return (
    <div className="w-full bg-[#070709] border-y border-white/5 py-4 overflow-hidden relative select-none group">
      {/* Glow ambient background accents */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#070709] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070709] to-transparent z-10 pointer-events-none" />

      {/* Top micro-bar: Authenticity assurance */}
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-300 font-bold tracking-wider uppercase">
            ოფიციალური & ავთენტური ბრენდები
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-500 hidden sm:inline">100% ორიგინალი გარანტიით</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>შემოწმებული ხარისხი // BATUMI</span>
        </div>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-6 animate-[shimmer_25s_linear_infinite] group-hover:[animation-play-state:paused]">
          {[...brands, ...brands].map((b, idx) => (
            <button
              key={`${b.name}-${idx}`}
              onClick={() => onSelectBrand?.(b.query)}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-surface/60 border border-white/10 hover:border-brand-lime/50 hover:bg-surface-elevated hover:shadow-[0_0_20px_rgba(212,255,0,0.15)] transition-all cursor-pointer text-left group/pill"
            >
              <div className="flex flex-col">
                <span className="text-sm font-black text-white group-hover/pill:text-brand-lime tracking-wider transition-colors font-mono">
                  {b.name}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono tracking-tight">
                  {b.tag}
                </span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/pill:bg-brand-lime transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
