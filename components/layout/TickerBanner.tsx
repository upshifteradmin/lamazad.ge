'use client';

import React from 'react';
import { Zap, Flame, Sparkles, MapPin } from 'lucide-react';

export function TickerBanner() {
  const items = [
    { text: 'ბათუმში ექსპრეს მიტანა 24 საათში', icon: Zap },
    { text: 'NEW DROP: BATUMI NOCTURNE HOODIE', icon: Flame },
    { text: 'DESIGN LAB: ააწყვე შენი უნიკალური პრინტი', icon: Sparkles },
    { text: 'ლოკაცია: ბათუმი, რუსთაველის გამზირი', icon: MapPin },
  ];

  return (
    <div className="w-full bg-[#0a0a0d] border-b border-border-subtle py-2 overflow-hidden text-xs font-mono text-gray-400 select-none">
      <div className="flex whitespace-nowrap animate-[shimmer_20s_linear_infinite]">
        <div className="flex items-center gap-8 px-4 shrink-0">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <span key={idx} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-brand-lime" />
                <span className="text-gray-300 font-semibold">{item.text}</span>
                <span className="text-brand-muted">•</span>
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-8 px-4 shrink-0">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <span key={`dup-${idx}`} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-brand-lime" />
                <span className="text-gray-300 font-semibold">{item.text}</span>
                <span className="text-brand-muted">•</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
