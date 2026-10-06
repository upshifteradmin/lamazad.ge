'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, CheckCircle2, Sparkles } from 'lucide-react';

interface SizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  onSelectSize: (size: string) => void;
}

export function SizeModal({ isOpen, onClose, productTitle, onSelectSize }: SizeModalProps) {
  const [height, setHeight] = useState<number>(178);
  const [weight, setWeight] = useState<number>(74);
  const [fitPreference, setFitPreference] = useState<'fitted' | 'regular' | 'oversized'>('oversized');

  // AI-inspired recommendation calculation
  const getRecommendedSize = () => {
    let base = 'M';
    if (weight > 85 || height > 185) base = 'XL';
    else if (weight > 76 || height > 180) base = 'L';
    else if (weight < 65 && height < 172) base = 'S';

    if (fitPreference === 'oversized') {
      if (base === 'S') return 'M';
      if (base === 'M') return 'L';
      if (base === 'L') return 'XL';
      if (base === 'XL') return 'XXL';
    }
    return base;
  };

  const recommendedSize = getRecommendedSize();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg bg-[#0e0e12] border border-border-subtle rounded-2xl p-6 shadow-cyber-card relative text-white"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ინტერაქტიული ზომის გიდი (Size AI)</h3>
              <p className="text-xs text-brand-muted">{productTitle}</p>
            </div>
          </div>

          <div className="space-y-4 my-6">
            {/* Height slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-brand-muted">სიმაღლე (სმ)</span>
                <span className="font-mono font-bold text-brand-cyan">{height} სმ</span>
              </div>
              <input
                type="range"
                min="150"
                max="210"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-brand-cyan bg-surface cursor-pointer"
              />
            </div>

            {/* Weight slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-brand-muted">წონა (კგ)</span>
                <span className="font-mono font-bold text-brand-cyan">{weight} კგ</span>
              </div>
              <input
                type="range"
                min="45"
                max="130"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-brand-cyan bg-surface cursor-pointer"
              />
            </div>

            {/* Fit Preference */}
            <div>
              <div className="text-xs text-brand-muted mb-2">მორგების სტილი</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fitted', label: 'ტანზე (Fitted)' },
                  { id: 'regular', label: 'სტანდარტული' },
                  { id: 'oversized', label: 'ოვერსაიზ (Street)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFitPreference(f.id as any)}
                    className={`py-2 px-1 text-xs rounded-xl border text-center transition-all ${
                      fitPreference === f.id
                        ? 'border-brand-cyan bg-brand-cyan/15 text-brand-cyan font-bold'
                        : 'border-border-subtle bg-surface text-gray-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-brand-lime/10 to-brand-cyan/10 border border-brand-lime/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-brand-lime" />
              <div>
                <div className="text-xs text-gray-300">რეკომენდებული ზომა:</div>
                <div className="text-2xl font-black text-brand-lime font-mono">{recommendedSize}</div>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectSize(recommendedSize);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-lime text-black font-bold text-xs hover:bg-brand-lime/90 active:scale-95 transition-all shadow-neon-lime"
            >
              ზომის დადასტურება
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
