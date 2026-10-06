'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Sliders,
  Layers,
  Check,
  Move,
  Trash2,
  Zap,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
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
  { id: 'f-impact', name: 'Impact', fontFamily: 'Impact, sans-serif' },
];

export interface StudioLayer {
  id: string;
  type: 'text' | 'sticker' | 'uploaded-image';
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

  // 4-Step Wizard Navigation on Mobile & Desktop
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Garment State
  const [selectedGarment, setSelectedGarment] = useState<GarmentType>('tee-front');
  const [selectedColor, setSelectedColor] = useState<GarmentColor>(GARMENT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState<string>('L');

  // Layers State
  const [layers, setLayers] = useState<StudioLayer[]>([
    {
      id: 'default-text',
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
      id: 'default-subtext',
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

  const [activeLayerId, setActiveLayerId] = useState<string | null>('default-text');

  // Inputs for active text layer
  const [inputText, setInputText] = useState('ლამაზად');
  const [textColor, setTextColor] = useState('#d4ff00');
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].fontFamily);
  const [printStyle, setPrintStyle] = useState<'flat' | 'puff' | 'embroidery'>('puff');

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);

  // Pricing formula
  const basePrices: Record<GarmentType, number> = {
    'tee-front': 75,
    'tee-back': 85,
  };

  const printCost = layers.length * 15 + (layers.some((l) => l.printStyle === 'puff' || l.printStyle === 'embroidery') ? 20 : 0);
  const totalPrice = basePrices[selectedGarment] + printCost;

  // Sync active layer values to inputs
  useEffect(() => {
    const activeLayer = layers.find((l) => l.id === activeLayerId);
    if (activeLayer && activeLayer.type === 'text') {
      setInputText(activeLayer.content);
      setTextColor(activeLayer.color);
      if (activeLayer.fontFamily) setSelectedFont(activeLayer.fontFamily);
      if (activeLayer.printStyle) setPrintStyle(activeLayer.printStyle);
    }
  }, [activeLayerId, layers]);

  const updateActiveLayer = useCallback(
    (updates: Partial<StudioLayer>) => {
      if (!activeLayerId) return;
      setLayers((prev) =>
        prev.map((layer) => (layer.id === activeLayerId ? { ...layer, ...updates } : layer))
      );
    },
    [activeLayerId]
  );

  // Draw Canvas with fabric simulation (Oversized T-Shirt Front/Back)
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
      // High neckline for back view
      ctx.moveTo(210, 80);
      ctx.quadraticCurveTo(250, 92, 290, 80);
    } else {
      // Crew neckline for front view
      ctx.moveTo(210, 70);
      ctx.quadraticCurveTo(250, 110, 290, 70);
    }
    // Right shoulder & wide sleeve
    ctx.lineTo(390, 120);
    ctx.lineTo(440, 220);
    ctx.lineTo(385, 255);
    ctx.lineTo(360, 195);
    // Right body (Boxy oversized fit)
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
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowOffsetX = 2.5;
          ctx.shadowOffsetY = 3.5;
          ctx.shadowBlur = 4;
          ctx.fillStyle = layer.color;
          ctx.fillText(layer.content, 0, 0);

          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
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
  }, [selectedGarment, selectedColor, layers, activeLayerId]);

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
      if (dist < 22) {
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

    updateActiveLayer({ x: clampedX, y: clampedY });
  };

  const handleCanvasEnd = () => {
    isDraggingRef.current = false;
  };

  // Add / Remove layers
  const handleAddTextLayer = () => {
    const newId = `txt-${Date.now()}`;
    const newLayer: StudioLayer = {
      id: newId,
      type: 'text',
      content: 'ახალი პრინტი',
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      color: textColor,
      fontFamily: selectedFont,
      printStyle: printStyle,
    };
    setLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(newId);
  };

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newId = `img-${Date.now()}`;
      const newLayer: StudioLayer = {
        id: newId,
        type: 'uploaded-image',
        content: dataUrl,
        x: 50,
        y: 48,
        scale: 0.8,
        rotation: 0,
        color: '#ffffff',
      };
      setLayers((prev) => [...prev, newLayer]);
      setActiveLayerId(newId);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (activeLayerId === id) {
      setActiveLayerId(layers.find((l) => l.id !== id)?.id || null);
    }
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
      title: `CUSTOM: ${garmentNames[selectedGarment]}`,
      price: totalPrice,
      quantity: 1,
      image: previewUrl || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      size: selectedSize,
      colorName: selectedColor.name,
      isCustomStudio: true,
      customDetails: {
        garmentType: selectedGarment,
        garmentColor: selectedColor.name,
        textPrint: layers.find((l) => l.type === 'text')?.content || 'Custom Print',
        textFont: selectedFont,
        printStyle: printStyle,
        stickersCount: layers.length,
      },
    });

    if (instantCheckout) {
      openCheckout();
    } else {
      openDrawer();
    }
  };

  const activeLayer = layers.find((l) => l.id === activeLayerId);

  return (
    <div className="w-full bg-[#0c0c10] border border-border-subtle rounded-3xl overflow-hidden shadow-2xl">
      {/* Studio Header: Mobile-First Step Wizard */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface/90 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              DESIGN LAB 2026
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-lime/20 text-brand-lime border border-brand-lime/30">
                BATUMI
              </span>
            </h3>
            <p className="text-[11px] text-brand-muted">
              ააწყვე შენი სთრითვეარი 4 მარტივ ნაბიჯში
            </p>
          </div>
        </div>

        {/* 4-Step Pill Navigation Bar */}
        <div className="flex items-center gap-1 w-full sm:w-auto bg-surface-card p-1 rounded-2xl border border-border-subtle overflow-x-auto">
          {[
            { step: 1, label: '1. მოდელი' },
            { step: 2, label: '2. ფერი' },
            { step: 3, label: '3. პრინტი' },
            { step: 4, label: '4. შეკვეთა' },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step as any)}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 sm:flex-none ${
                activeStep === s.step
                  ? 'bg-brand-lime text-black shadow-neon-lime'
                  : 'text-gray-400 hover:text-white hover:bg-surface'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Body: Canvas + Step Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left / Center: Interactive Canvas */}
        <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0d] to-[#111116] border-b lg:border-b-0 lg:border-r border-border-subtle relative select-none">
          <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square flex items-center justify-center">
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
                const t = e.touches[0];
                if (t) handleCanvasMove(t.clientX, t.clientY);
              }}
              onTouchEnd={handleCanvasEnd}
              className="w-full h-full object-contain cursor-grab active:cursor-grabbing rounded-2xl shadow-xl"
            />
          </div>

          <div className="flex items-center justify-between w-full max-w-[380px] sm:max-w-[420px] mt-3 text-[11px] text-brand-muted px-2">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3 text-brand-lime" />
              გადააადგილეთ თითით / მაუსით
            </span>
            <button
              onClick={() => {
                setLayers([]);
                setActiveLayerId(null);
              }}
              className="text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              გასუფთავება
            </button>
          </div>
        </div>

        {/* Right: Step-by-Step Wizard Controls */}
        <div className="lg:col-span-5 p-5 bg-surface-card flex flex-col justify-between min-h-[380px]">
          {/* STEP 1: Garment Selection */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-brand-lime font-bold">
                  ნაბიჯი 1: აირჩიე მოდელი
                </span>
                <span className="text-xs text-gray-400 font-mono">1 / 4</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'tee-front', label: 'მაისური (წინა მხარე)', desc: 'Front Print', price: 75 },
                  { id: 'tee-back', label: 'მაისური (ზურგის მხარე)', desc: 'Back Print', price: 85 },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGarment(g.id as GarmentType)}
                    className={`min-h-[64px] p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      selectedGarment === g.id
                        ? 'border-brand-lime bg-brand-lime/15 text-white font-bold shadow-neon-lime/20'
                        : 'border-border-subtle bg-surface text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{g.label}</span>
                      <span className="text-[10px] text-brand-muted">{g.desc}</span>
                    </div>
                    <span className="font-mono text-brand-lime text-xs mt-1 font-bold">{formatGEL(g.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Color Swatches */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-brand-lime font-bold">
                  ნაბიჯი 2: აირჩიე ქსოვილის ფერი
                </span>
                <span className="text-xs text-gray-400 font-mono">2 / 4</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {GARMENT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className={`min-h-[48px] p-3 rounded-xl border flex items-center justify-between transition-all ${
                      selectedColor.id === c.id
                        ? 'border-brand-lime bg-brand-lime/10 text-white font-bold'
                        : 'border-border-subtle bg-surface text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs">{c.name}</span>
                    </div>
                    {selectedColor.id === c.id && <Check className="w-4 h-4 text-brand-lime" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Text & Print Engine */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-brand-lime font-bold">
                  ნაბიჯი 3: ტექსტი & პრინტის ეფექტები
                </span>
                <span className="text-xs text-gray-400 font-mono">3 / 4</span>
              </div>

              {/* Text Input */}
              <div>
                <label className="text-[11px] font-mono text-gray-400 mb-1 block">ტექსტი</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      updateActiveLayer({ content: e.target.value });
                    }}
                    placeholder="ჩაწერე ტექსტი..."
                    className="flex-1 min-h-[44px] bg-surface border border-border-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                  <button
                    onClick={handleAddTextLayer}
                    className="min-h-[44px] px-3 rounded-xl bg-brand-lime/10 text-brand-lime border border-brand-lime/30 text-xs font-bold hover:bg-brand-lime/20"
                  >
                    + ახალი
                  </button>
                </div>
              </div>

              {/* 3D Puff / Embroidery Toggle */}
              <div>
                <label className="text-[11px] font-mono text-gray-400 mb-1 block">ბეჭდვის სტილი</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'puff', label: '3D Puff' },
                    { id: 'embroidery', label: 'ნაქარგი' },
                    { id: 'flat', label: 'Flat Ink' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setPrintStyle(st.id as any);
                        updateActiveLayer({ printStyle: st.id as any });
                      }}
                      className={`min-h-[40px] py-2 rounded-xl text-xs font-bold border transition-all ${
                        printStyle === st.id
                          ? 'border-brand-lime bg-brand-lime/15 text-white shadow-neon-lime/10'
                          : 'border-border-subtle bg-surface text-gray-400'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Batumi Preset Emblems */}
              <div>
                <label className="text-[11px] font-mono text-gray-400 mb-1 block">ბათუმის ემბლემები</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_STICKERS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleAddSticker(s)}
                      className="min-h-[44px] p-2 rounded-xl bg-surface border border-border-subtle hover:border-brand-lime text-left flex items-center gap-2 transition-all"
                    >
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-[11px] text-white font-medium truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image Upload */}
              <div>
                <label className="min-h-[44px] flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-border-subtle hover:border-brand-cyan text-brand-cyan text-xs font-bold cursor-pointer transition-colors">
                  <ImageIcon className="w-4 h-4" />
                  <span>საკუთარი ლოგოს / სურათის ატვირთვა</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Review, Size & Instant Checkout */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-brand-lime font-bold">
                  ნაბიჯი 4: ზომა & შეკვეთის გაფორმება
                </span>
                <span className="text-xs text-gray-400 font-mono">4 / 4</span>
              </div>

              {/* Size Selector */}
              <div>
                <label className="text-xs font-mono text-gray-400 mb-1.5 block">ზომა</label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-h-[44px] flex-1 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                        selectedSize === sz
                          ? 'border-brand-lime bg-brand-lime text-black shadow-neon-lime'
                          : 'border-border-subtle bg-surface text-gray-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Summary box */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>მოდელი:</span>
                  <span className="text-white font-semibold">{selectedGarment}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>ფერი:</span>
                  <span className="text-white font-semibold">{selectedColor.name.split('(')[0]}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>პრინტი:</span>
                  <span className="text-brand-cyan font-mono">{layers.length} შრე (3D Puff)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
                  <span className="font-bold text-white">ჯამური ფასი:</span>
                  <span className="text-2xl font-mono font-black text-brand-lime">
                    {formatGEL(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => handleAddToCart(false)}
                  className="min-h-[48px] py-3 px-3 rounded-2xl border border-border-subtle hover:border-brand-lime bg-surface text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-lime" />
                  კალათაში
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  className="min-h-[48px] py-3 px-3 rounded-2xl bg-brand-lime hover:bg-brand-lime/90 active:scale-95 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-neon-lime"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  სწრაფი ყიდვა
                </button>
              </div>
            </div>
          )}

          {/* Wizard Bottom Navigation (Next / Prev) */}
          <div className="pt-4 border-t border-border-subtle flex items-center justify-between gap-3 mt-4">
            {activeStep > 1 ? (
              <button
                onClick={() => setActiveStep((prev) => (prev - 1) as any)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-surface border border-border-subtle text-xs text-gray-300 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                უკან
              </button>
            ) : (
              <div />
            )}

            {activeStep < 4 ? (
              <button
                onClick={() => setActiveStep((prev) => (prev + 1) as any)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-surface-elevated hover:bg-brand-lime hover:text-black border border-border-active text-xs font-bold text-white flex items-center gap-1.5 transition-all ml-auto"
              >
                შემდეგი ნაბიჯი
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
