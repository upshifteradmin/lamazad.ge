'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Check,
  Move,
  Trash2,
  Zap,
  ArrowRight,
  ChevronRight,
  Palette,
  Layers,
  Smile,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatGEL } from '@/lib/utils';
import confetti from 'canvas-confetti';

export type GarmentType = 'tee-front' | 'tee-back';

interface GarmentColor {
  id: string;
  name: string;
  hex: string;
}

const GARMENT_COLORS: GarmentColor[] = [
  { id: 'washed-black', name: 'Washed Black (შავი ასფალტი)', hex: '#161619' },
  { id: 'acid-grey', name: 'Acid Slate (ნაცრისფერი)', hex: '#373a40' },
  { id: 'chalk-white', name: 'Chalk Bone (თეთრი ქვა)', hex: '#eae8e1' },
  { id: 'sunset-coral', name: 'Sunset Coral (ბათუმის დაისი)', hex: '#e84a5f' },
  { id: 'electric-cobalt', name: 'Electric Black Sea (ლურჯი)', hex: '#1a365d' },
];

const PRESET_STICKERS = [
  { id: 'stk-1', name: 'Batumi Coordinates', label: '41.64° N / 41.63° E', icon: '📍', svgText: '41.64° N, 41.63° E\nBATUMI GEORGIA' },
  { id: 'stk-2', name: 'ლამაზად Streetwear', label: 'ლამაზად™', icon: '⚡', svgText: 'ლ ა მ ა ზ ა დ\nEST. 2026' },
  { id: 'stk-3', name: 'Black Sea Wave', label: 'შავი ზღვის ტალღა', icon: '🌊', svgText: 'BLACK SEA / 0422\nBATUMI SECTOR' },
  { id: 'stk-4', name: 'Ali & Nino Cyber', label: 'ალი & ნინო', icon: '❤️', svgText: 'ALI & NINO\nKINETIC SOUL' },
];

const FONT_OPTIONS = [
  { id: 'f-syne', name: 'Syne Neo', fontFamily: 'Syne, sans-serif' },
  { id: 'f-mono', name: 'Cyber Mono', fontFamily: 'monospace' },
  { id: 'f-serif', name: 'Vintage', fontFamily: 'Georgia, serif' },
  { id: 'f-impact', name: 'Impact Heavy', fontFamily: 'Impact, sans-serif' },
];

const TEXT_COLORS = [
  { label: 'Volt Lime', hex: '#d4ff00' },
  { label: 'Pure White', hex: '#ffffff' },
  { label: 'Cyber Cyan', hex: '#00f2ff' },
  { label: 'Flame Crimson', hex: '#ff4655' },
  { label: 'Warm Orange', hex: '#ff9900' },
  { label: 'Jet Black', hex: '#111113' },
];

export interface StudioLayer {
  id: string;
  type: 'text' | 'sticker';
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  fontFamily?: string;
  printStyle?: 'flat' | 'puff' | 'embroidery';
}

export function DesignStudio() {
  const { addItem, openDrawer, openCheckout } = useCartStore();

  // Active Tab: 1 = Text & Print, 2 = Model & Color, 3 = Stickers
  const [activeTab, setActiveTab] = useState<'text' | 'garment' | 'stickers'>('text');

  // Garment State
  const [selectedGarment, setSelectedGarment] = useState<GarmentType>('tee-front');
  const [selectedColor, setSelectedColor] = useState<GarmentColor>(GARMENT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState<string>('L');

  // Main text inputs (Direct live state)
  const [mainText, setMainText] = useState('ლამაზად');
  const [subText, setSubText] = useState('BATUMI 2026');
  const [textColor, setTextColor] = useState('#d4ff00');
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].fontFamily);
  const [printStyle, setPrintStyle] = useState<'flat' | 'puff' | 'embroidery'>('puff');
  const [textScale, setTextScale] = useState(1.2);

  // Layers State
  const [layers, setLayers] = useState<StudioLayer[]>([
    {
      id: 'main-text-layer',
      type: 'text',
      content: 'ლამაზად',
      x: 50,
      y: 45,
      scale: 1.2,
      rotation: 0,
      color: '#d4ff00',
      fontFamily: 'Syne, sans-serif',
      printStyle: 'puff',
    },
    {
      id: 'sub-text-layer',
      type: 'text',
      content: 'BATUMI 2026',
      x: 50,
      y: 58,
      scale: 0.65,
      rotation: 0,
      color: '#ffffff',
      fontFamily: 'monospace',
      printStyle: 'flat',
    },
  ]);

  const [activeLayerId, setActiveLayerId] = useState<string | null>('main-text-layer');

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);

  // Base Prices
  const basePrices: Record<GarmentType, number> = {
    'tee-front': 75,
    'tee-back': 85,
  };
  const printCost = 15 + (printStyle === 'puff' || printStyle === 'embroidery' ? 10 : 0);
  const totalPrice = basePrices[selectedGarment] + printCost;

  // Sync main text changes to layers
  const handleMainTextChange = (newVal: string) => {
    setMainText(newVal);
    setLayers((prev) =>
      prev.map((l) =>
        l.id === 'main-text-layer'
          ? {
              ...l,
              content: newVal,
              color: textColor,
              fontFamily: selectedFont,
              printStyle: printStyle,
              scale: textScale,
            }
          : l
      )
    );
  };

  // Sync sub text changes to layers
  const handleSubTextChange = (newVal: string) => {
    setSubText(newVal);
    setLayers((prev) =>
      prev.map((l) => (l.id === 'sub-text-layer' ? { ...l, content: newVal } : l))
    );
  };

  // Sync color changes
  const handleTextColorChange = (colorHex: string) => {
    setTextColor(colorHex);
    setLayers((prev) =>
      prev.map((l) => (l.id === activeLayerId || l.id === 'main-text-layer' ? { ...l, color: colorHex } : l))
    );
  };

  // Sync font changes
  const handleFontChange = (fontFam: string) => {
    setSelectedFont(fontFam);
    setLayers((prev) =>
      prev.map((l) => (l.id === 'main-text-layer' ? { ...l, fontFamily: fontFam } : l))
    );
  };

  // Sync print style changes
  const handlePrintStyleChange = (style: 'flat' | 'puff' | 'embroidery') => {
    setPrintStyle(style);
    setLayers((prev) =>
      prev.map((l) => (l.id === 'main-text-layer' ? { ...l, printStyle: style } : l))
    );
  };

  // Sync scale changes
  const handleScaleChange = (scale: number) => {
    setTextScale(scale);
    setLayers((prev) =>
      prev.map((l) => (l.id === 'main-text-layer' ? { ...l, scale } : l))
    );
  };

  // Draw Canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 500;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Garment Base (Oversized T-Shirt)
    ctx.save();
    ctx.fillStyle = selectedColor.hex;

    ctx.beginPath();
    if (selectedGarment === 'tee-back') {
      ctx.moveTo(210, 80);
      ctx.quadraticCurveTo(250, 92, 290, 80);
    } else {
      ctx.moveTo(210, 70);
      ctx.quadraticCurveTo(250, 110, 290, 70);
    }
    // Right shoulder & wide sleeve
    ctx.lineTo(390, 120);
    ctx.lineTo(440, 220);
    ctx.lineTo(385, 255);
    ctx.lineTo(360, 195);
    // Right body (Boxy oversized streetwear)
    ctx.lineTo(360, 450);
    ctx.quadraticCurveTo(250, 465, 140, 450);
    // Left body
    ctx.lineTo(140, 195);
    ctx.lineTo(115, 255);
    ctx.lineTo(60, 220);
    ctx.lineTo(110, 120);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Realistic Fabric Texture & Shade
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(255,255,255,0.06)');
    grad.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 3. Print Zone Guideline
    const boxX = 165;
    const boxY = 140;
    const boxW = 170;
    const boxH = 250;
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 255, 0, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.restore();

    // 4. Render Layers
    layers.forEach((layer) => {
      ctx.save();
      const posX = (layer.x / 100) * width;
      const posY = (layer.y / 100) * height;

      ctx.translate(posX, posY);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.scale(layer.scale, layer.scale);

      if (layer.type === 'text') {
        const font = `${layer.scale * 28}px ${layer.fontFamily || 'Syne, sans-serif'}`;
        ctx.font = `bold ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (layer.printStyle === 'puff') {
          // 3D Puff shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowOffsetX = 2.5;
          ctx.shadowOffsetY = 3.5;
          ctx.shadowBlur = 4;
          ctx.fillStyle = layer.color;
          ctx.fillText(layer.content, 0, 0);

          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = 'rgba(255,255,255,0.35)';
          ctx.lineWidth = 1;
          ctx.strokeText(layer.content, 0, 0);
        } else if (layer.printStyle === 'embroidery') {
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 2;
          ctx.fillStyle = layer.color;
          ctx.fillText(layer.content, 0, 0);

          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.strokeText(layer.content, 0, 0);
        } else {
          ctx.fillStyle = layer.color;
          ctx.fillText(layer.content, 0, 0);
        }

        // Active selection indicator
        if (layer.id === activeLayerId) {
          ctx.shadowColor = 'transparent';
          const textMetrics = ctx.measureText(layer.content);
          const tWidth = textMetrics.width;
          const tHeight = 32 * layer.scale;
          ctx.strokeStyle = '#d4ff00';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
          ctx.strokeRect(-tWidth / 2 - 6, -tHeight / 2 - 4, tWidth + 12, tHeight + 8);
        }
      } else if (layer.type === 'sticker') {
        ctx.fillStyle = 'rgba(20, 20, 24, 0.85)';
        ctx.strokeStyle = '#d4ff00';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-70, -30, 140, 60, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lines = layer.content.split('\n');
        lines.forEach((line, idx) => {
          ctx.fillText(line, 0, (idx - (lines.length - 1) / 2) * 14);
        });

        if (layer.id === activeLayerId) {
          ctx.strokeStyle = '#00f2ff';
          ctx.strokeRect(-75, -35, 150, 70);
        }
      }

      ctx.restore();
    });
  }, [selectedColor, selectedGarment, layers, activeLayerId, printStyle]);

  // Redraw when canvas or state changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Mouse / Touch Dragging
  const handleCanvasStart = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((clientX - rect.left) / rect.width) * 100;
    const mouseY = ((clientY - rect.top) / rect.height) * 100;

    let clickedLayer: StudioLayer | null = null;
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      const dist = Math.hypot(layer.x - mouseX, layer.y - mouseY);
      if (dist < 25) {
        clickedLayer = layer;
        break;
      }
    }

    if (clickedLayer) {
      setActiveLayerId(clickedLayer.id);
      isDraggingRef.current = true;
    }
  };

  const handleCanvasMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current || !activeLayerId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((clientX - rect.left) / rect.width) * 100;
    const mouseY = ((clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(25, Math.min(75, mouseX));
    const clampedY = Math.max(25, Math.min(75, mouseY));

    setLayers((prev) =>
      prev.map((l) => (l.id === activeLayerId ? { ...l, x: clampedX, y: clampedY } : l))
    );
  };

  const handleCanvasEnd = () => {
    isDraggingRef.current = false;
  };

  const nudgeLayer = (dx: number, dy: number) => {
    const targetId = activeLayerId || 'layer-main-text';
    setLayers((prev) =>
      prev.map((l) =>
        l.id === targetId
          ? {
              ...l,
              x: Math.max(20, Math.min(80, l.x + dx)),
              y: Math.max(20, Math.min(80, l.y + dy)),
            }
          : l
      )
    );
  };

  // Add Sticker
  const handleAddSticker = (sticker: (typeof PRESET_STICKERS)[0]) => {
    const newId = `stk-${Date.now()}`;
    const newLayer: StudioLayer = {
      id: newId,
      type: 'sticker',
      content: sticker.svgText,
      x: 50,
      y: 50,
      scale: 0.9,
      rotation: 0,
      color: '#d4ff00',
    };
    setLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(newId);
  };

  // Cart Add & Instant Checkout
  const handleAddToCart = (instantCheckout = false) => {
    const canvas = canvasRef.current;
    const previewUrl = canvas ? canvas.toDataURL('image/png') : '';

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#d4ff00', '#00f2ff', '#ffffff'],
      });
    } catch {
      // ignore
    }

    const garmentNames: Record<GarmentType, string> = {
      'tee-front': 'Oversized მაისური (წინა მხარე)',
      'tee-back': 'Oversized მაისური (ზურგის პრინტი)',
    };

    addItem({
      title: `CUSTOM: ${garmentNames[selectedGarment]} - "${mainText}"`,
      price: totalPrice,
      quantity: 1,
      image: previewUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      size: selectedSize,
      colorName: selectedColor.name,
      isCustomStudio: true,
      customDetails: {
        garmentType: selectedGarment,
        garmentColor: selectedColor.name,
        textPrint: mainText,
        textFont: selectedFont,
        printStyle: printStyle,
        stickersCount: layers.filter((l) => l.type === 'sticker').length,
      },
    });

    if (instantCheckout) {
      openCheckout();
    } else {
      openDrawer();
    }
  };

  return (
    <div className="w-full bg-[#0a0a0d] border border-border-subtle rounded-3xl overflow-hidden shadow-2xl relative">
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/90">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DESIGN LAB // CUSTOM TEE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            შექმენი შენი მაისური
          </h2>
          <p className="text-xs text-gray-400">
            ჩაწერე სასურველი ტექსტი, აირჩიე ფერი და მიიღე ბათუმში 24 საათში
          </p>
        </div>

        {/* Front / Back Toggle Pill */}
        <div className="flex items-center gap-2 bg-[#121217] p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setSelectedGarment('tee-front')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGarment === 'tee-front'
                ? 'bg-brand-lime text-black shadow-neon-lime'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            👕 წინა მხარე
          </button>
          <button
            onClick={() => setSelectedGarment('tee-back')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGarment === 'tee-back'
                ? 'bg-brand-lime text-black shadow-neon-lime'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🔄 ზურგის მხარე
          </button>
        </div>
      </div>

      {/* 2. Main Studio Grid (Mobile-First Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Interactive Canvas */}
        <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0d] to-[#111116] border-b lg:border-b-0 lg:border-r border-white/10 relative select-none">
          <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square flex items-center justify-center">
            <canvas
              ref={canvasRef}
              onMouseDown={(e) => handleCanvasStart(e.clientX, e.clientY)}
              onMouseMove={(e) => handleCanvasMove(e.clientX, e.clientY)}
              onMouseUp={handleCanvasEnd}
              onMouseLeave={handleCanvasEnd}
              onTouchStart={(e) => {
                const t = e.touches[0];
                if (t) handleCanvasStart(t.clientX, t.clientY);
              }}
              onTouchMove={(e) => {
                if (!isDraggingRef.current) return;
                const t = e.touches[0];
                if (t) handleCanvasMove(t.clientX, t.clientY);
              }}
              onTouchEnd={handleCanvasEnd}
              className="w-full h-full object-contain cursor-grab active:cursor-grabbing rounded-2xl shadow-2xl touch-pan-y"
            />
          </div>

          <div className="flex items-center justify-between w-full max-w-[340px] sm:max-w-[420px] mt-3 text-[11px] text-zinc-400 px-2 font-mono">
            <span className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-brand-lime" />
              გადააადგილეთ თითით / მაუსით
            </span>
            <button
              onClick={() => {
                setMainText('ლამაზად');
                setSubText('BATUMI 2026');
                handleMainTextChange('ლამაზად');
                handleSubTextChange('BATUMI 2026');
              }}
              className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              საწყისი ტექსტი
            </button>
          </div>
        </div>

        {/* Right: Studio Controls with High-Accessibility Tabs */}
        <div className="lg:col-span-6 p-4 sm:p-6 bg-[#0f0f14] flex flex-col justify-between">
          <div>
            {/* Control Navigation Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-6 p-1.5 bg-[#14141c] rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('text')}
                className={`py-2 px-1 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'text'
                    ? 'bg-brand-lime text-black shadow-neon-lime'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>ტექსტი</span>
              </button>

              <button
                onClick={() => setActiveTab('garment')}
                className={`py-2 px-1 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'garment'
                    ? 'bg-brand-lime text-black shadow-neon-lime'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>ფერი & ზომა</span>
              </button>

              <button
                onClick={() => setActiveTab('stickers')}
                className={`py-2 px-1 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'stickers'
                    ? 'bg-brand-lime text-black shadow-neon-lime'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>სტიკერები</span>
              </button>
            </div>

            {/* TAB 1: TEXT & PRINT (DIRECT LIVE INPUT - NEVER BLOCKED) */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                {/* 1. Primary Text Input */}
                <div>
                  <label className="text-xs font-mono uppercase text-brand-lime font-bold mb-1.5 flex items-center justify-between">
                    <span>1. მთავარი ტექსტი (მაისურზე)</span>
                    <span className="text-zinc-500 text-[11px]">Live Preview</span>
                  </label>
                  <input
                    type="text"
                    value={mainText}
                    onChange={(e) => handleMainTextChange(e.target.value)}
                    placeholder="ჩაწერე შენი ტექსტი (მაგ: ლამაზად)"
                    className="w-full min-h-[48px] bg-[#16161f] border-2 border-brand-lime/40 focus:border-brand-lime rounded-xl px-4 py-3 text-sm text-white font-bold placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {/* 2. Secondary Subtext Input */}
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 font-semibold mb-1.5 block">
                    2. მეორე ხაზი (ქვესათაური / წელი)
                  </label>
                  <input
                    type="text"
                    value={subText}
                    onChange={(e) => handleSubTextChange(e.target.value)}
                    placeholder="მაგ: BATUMI 2026"
                    className="w-full min-h-[44px] bg-[#16161f] border border-white/10 focus:border-brand-lime rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
                  />
                </div>

                {/* 3. Text Color Picker Swatches */}
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 font-semibold mb-2 block">
                    ტექსტის ფერი
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {TEXT_COLORS.map((tc) => (
                      <button
                        key={tc.hex}
                        onClick={() => handleTextColorChange(tc.hex)}
                        title={tc.label}
                        className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all ${
                          textColor === tc.hex
                            ? 'border-brand-lime scale-110 shadow-lg'
                            : 'border-white/20 hover:border-white/60'
                        }`}
                        style={{ backgroundColor: tc.hex }}
                      >
                        {textColor === tc.hex && (
                          <Check className={`w-4 h-4 ${tc.hex === '#ffffff' || tc.hex === '#d4ff00' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Font Style Picker */}
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 font-semibold mb-2 block">
                    შრიფტის სტილი
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleFontChange(f.fontFamily)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                          selectedFont === f.fontFamily
                            ? 'border-brand-lime bg-brand-lime/15 text-white shadow-neon-lime/20'
                            : 'border-white/10 bg-[#16161f] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span style={{ fontFamily: f.fontFamily }}>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. 3D Puff / Silk-screen Effect */}
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 font-semibold mb-2 block">
                    ბეჭდვის ტექნოლოგია
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'puff', label: '3D Puff (ამოზნექილი)' },
                      { id: 'flat', label: 'Flat (აბრეშუმი)' },
                      { id: 'embroidery', label: 'ნაქარგი სტილი' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handlePrintStyleChange(st.id as 'flat' | 'puff' | 'embroidery')}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all ${
                          printStyle === st.id
                            ? 'border-brand-cyan bg-brand-cyan/15 text-white'
                            : 'border-white/10 bg-[#16161f] text-zinc-400'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Text Scale Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                    <span>ტექსტის ზომა</span>
                    <span>{(textScale * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.8"
                    step="0.05"
                    value={textScale}
                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                    className="w-full accent-brand-lime cursor-pointer"
                  />
                </div>

                {/* 7. Position Nudge Buttons */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1.5">
                    <span>პოზიციის კორექცია</span>
                    <span className="text-[10px] text-brand-lime">ნაბიჯ-ნაბიჯ</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => nudgeLayer(-3, 0)}
                      className="py-2.5 rounded-xl bg-[#16161f] border border-white/10 hover:border-brand-lime text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center active:scale-95"
                    >
                      ⬅️
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeLayer(0, -3)}
                      className="py-2.5 rounded-xl bg-[#16161f] border border-white/10 hover:border-brand-lime text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center active:scale-95"
                    >
                      ⬆️
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeLayer(0, 3)}
                      className="py-2.5 rounded-xl bg-[#16161f] border border-white/10 hover:border-brand-lime text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center active:scale-95"
                    >
                      ⬇️
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeLayer(3, 0)}
                      className="py-2.5 rounded-xl bg-[#16161f] border border-white/10 hover:border-brand-lime text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center active:scale-95"
                    >
                      ➡️
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GARMENT COLOR & SIZE */}
            {activeTab === 'garment' && (
              <div className="space-y-4">
                {/* Garment Color Swatches */}
                <div>
                  <label className="text-xs font-mono uppercase text-brand-lime font-bold mb-2 block">
                    ქსოვილის ფერი (100% ორგანული ბამბა)
                  </label>
                  <div className="space-y-2">
                    {GARMENT_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                          selectedColor.id === c.id
                            ? 'border-brand-lime bg-brand-lime/10 text-white font-bold'
                            : 'border-white/10 bg-[#16161f] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-6 h-6 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-xs">{c.name}</span>
                        </div>
                        {selectedColor.id === c.id && <Check className="w-4 h-4 text-brand-lime" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Picker */}
                <div>
                  <label className="text-xs font-mono uppercase text-brand-lime font-bold mb-2 block">
                    ზომა (Oversized Street Fit)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                          selectedSize === sz
                            ? 'border-brand-lime bg-brand-lime text-black font-black shadow-neon-lime'
                            : 'border-white/10 bg-[#16161f] text-zinc-300 hover:border-white/30'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STICKERS & BADGES */}
            {activeTab === 'stickers' && (
              <div className="space-y-4">
                <label className="text-xs font-mono uppercase text-brand-lime font-bold mb-2 block">
                  ბათუმის ექსკლუზიური ლოგოები & სტიკერები
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_STICKERS.map((stk) => (
                    <button
                      key={stk.id}
                      onClick={() => handleAddSticker(stk)}
                      className="p-3.5 rounded-xl border border-white/10 bg-[#16161f] hover:border-brand-lime/50 text-left transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{stk.icon}</span>
                        <span className="text-xs font-bold text-white group-hover:text-brand-lime transition-colors">
                          {stk.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500 block">
                        {stk.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Bottom Sticky Actions & Pricing */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">სრული ფასი:</span>
              <span className="text-xl sm:text-2xl font-black text-brand-lime font-mono">
                {formatGEL(totalPrice)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleAddToCart(false)}
                className="min-h-[48px] py-3 rounded-xl bg-[#1c1c24] hover:bg-[#252530] text-white border border-white/15 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-brand-lime" />
                <span>კალათაში</span>
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                className="min-h-[48px] py-3 rounded-xl bg-brand-lime hover:bg-[#bbf000] text-black font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-neon-lime"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>1-Click შეკვეთა</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
