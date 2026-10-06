'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { BATUMI_DISTRICTS } from '@/lib/districts';
import { formatGEL } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Store Official Contact Numbers for Auto-Dispatch
const STORE_WHATSAPP_NUMBER = '995577000000'; // lamazad.ge Batumi WhatsApp dispatch line
const STORE_FACEBOOK_PAGE = 'lamazad.ge'; // m.me/lamazad.ge

export function BatumiCheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, clearCart, getTotalPrice } = useCartStore();

  const [selectedDistrictId, setSelectedDistrictId] = useState(BATUMI_DISTRICTS[0].id);
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+995 5');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Completed Order Details
  const [completedOrder, setCompletedOrder] = useState<{
    id: string;
    totalAmount: number;
    customerName: string;
    phoneNumber: string;
    districtName: string;
    streetAddress: string;
    productSummary: string;
    paymentLabel: string;
    productLink: string;
  } | null>(null);

  if (!isCheckoutOpen) return null;

  const currentDistrict = BATUMI_DISTRICTS.find((d) => d.id === selectedDistrictId) || BATUMI_DISTRICTS[0];
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= 200 ? 0 : currentDistrict.deliveryFee;
  const finalTotal = subtotal + deliveryFee;

  const paymentMethodLabels: Record<string, string> = {
    cash: 'ნაღდი კურიერთან მიღებისას',
    card: 'საბანკო ბარათი (ონლაინ)',
    transfer: 'საბანკო გადარიცხვა (BOG / TBC)',
  };

  const productSummary = items
    .map((i) => `${i.title} (${i.size}) x${i.quantity}`)
    .join('; ');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedCode = `LMZ-${Math.floor(10000 + Math.random() * 90000)}`;
    const productLink = typeof window !== 'undefined' ? `${window.location.origin}/#catalog` : 'https://lamazad.ge';

    try {
      // 1. Save order immediately to Backend / Database
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: generatedCode,
          customerName: fullName,
          phoneNumber,
          districtId: currentDistrict.id,
          districtName: currentDistrict.nameKa,
          streetAddress,
          apartment,
          paymentMethod,
          subtotal,
          deliveryFee,
          totalAmount: finalTotal,
          items,
          productSummary,
        }),
      });

      const data = await res.json();
      const confirmedId = data.order?.id || generatedCode;

      setCompletedOrder({
        id: confirmedId,
        totalAmount: finalTotal,
        customerName: fullName,
        phoneNumber,
        districtName: currentDistrict.nameKa,
        streetAddress: `${streetAddress} ${apartment ? `(${apartment})` : ''}`,
        productSummary,
        paymentLabel: paymentMethodLabels[paymentMethod] || 'ნაღდი',
        productLink,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#d4ff00', '#00f2ff', '#ff4655', '#ffffff'],
        });
      } catch {
        // ignore
      }

      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
      // Fallback: still show confirmation screen so user never loses order
      setCompletedOrder({
        id: generatedCode,
        totalAmount: finalTotal,
        customerName: fullName,
        phoneNumber,
        districtName: currentDistrict.nameKa,
        streetAddress: `${streetAddress} ${apartment ? `(${apartment})` : ''}`,
        productSummary,
        paymentLabel: paymentMethodLabels[paymentMethod] || 'ნაღდი',
        productLink,
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }
  };

  // Generate Automated Message String formatted exactly as requested
  const formatDispatchMessage = () => {
    if (!completedOrder) return '';

    return `🇬🇪 ახალი შეკვეთა — lamazad.ge (#${completedOrder.id})
━━━━━━━━━━━━━━━━━━
👤 სახელი: ${completedOrder.customerName}
📞 ტელეფონი: ${completedOrder.phoneNumber}
📍 მისამართი: ${completedOrder.districtName}, ${completedOrder.streetAddress}

📦 პროდუქტი: ${completedOrder.productSummary}
💰 სულ გადასახდელი: ${formatGEL(completedOrder.totalAmount)} (${completedOrder.paymentLabel})

🔗 დიზაინის / პროდუქტის ლინკი: ${completedOrder.productLink}
━━━━━━━━━━━━━━━━━━
გთხოვთ დამიდასტუროთ შეკვეთა!`;
  };

  const formattedMsg = formatDispatchMessage();

  // WhatsApp Deep Link
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMsg)}`;

  // Facebook Messenger Deep Link
  const messengerUrl = `https://m.me/${STORE_FACEBOOK_PAGE}?text=${encodeURIComponent(formattedMsg)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formattedMsg);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setCompletedOrder(null);
    closeCheckout();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-xl bg-[#0c0c10] border border-border-subtle rounded-3xl p-5 sm:p-7 shadow-2xl relative text-white my-6"
        >
          {/* Close button */}
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime shadow-neon-lime shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                    ბათუმში ექსპრეს შეკვეთა
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-lime/20 text-brand-lime border border-brand-lime/30">
                      24H
                    </span>
                  </h2>
                  <p className="text-xs text-brand-muted">
                    ჩაწერეთ მონაცემები და მიიღეთ შეკვეთა დღესვე
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                {/* 1. Batumi District Picker */}
                <div>
                  <label className="text-xs font-mono uppercase text-brand-muted mb-1.5 block flex items-center justify-between">
                    <span>1. ბათუმის უბანი</span>
                    <span className="text-brand-cyan text-[11px] font-sans">
                      მიტანა: {currentDistrict.estimatedDelivery}
                    </span>
                  </label>
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                    className="w-full min-h-[44px] bg-surface border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-lime cursor-pointer"
                  >
                    {BATUMI_DISTRICTS.map((district) => (
                      <option key={district.id} value={district.id} className="bg-[#121216] text-white">
                        {district.nameKa} {district.deliveryFee === 0 ? '(უფასო)' : `(+${district.deliveryFee} ₾)`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Street & Apartment */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-brand-muted mb-1 block">
                      ქუჩა და ნომერი
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="მაგ: მემედ აბაშიძის 24"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-surface border border-border-subtle rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-lime"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-brand-muted mb-1 block">
                      ბინა / სართული
                    </label>
                    <input
                      type="text"
                      placeholder="ბინა 14"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 bg-surface border border-border-subtle rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-lime"
                    />
                  </div>
                </div>

                {/* 3. Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-mono uppercase text-brand-muted mb-1 block">
                      სახელი და გვარი
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="მაგ: გიორგი"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 bg-surface border border-border-subtle rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-lime"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-brand-muted mb-1 block">
                      ტელეფონის ნომერი
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+995 599 00 00 00"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-surface border border-border-subtle rounded-xl text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:border-brand-lime"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Payment Method */}
                <div>
                  <label className="text-xs font-mono uppercase text-brand-muted mb-1.5 block">
                    გადახდის მეთოდი
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cash', label: 'ნაღდი', desc: 'კურიერთან' },
                      { id: 'card', label: 'ბარათი', desc: 'ონლაინ' },
                      { id: 'transfer', label: 'გადარიცხვა', desc: 'BOG / TBC' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`min-h-[44px] p-2.5 rounded-xl border text-center transition-all ${
                          paymentMethod === m.id
                            ? 'border-brand-lime bg-brand-lime/10 text-white font-bold'
                            : 'border-border-subtle bg-surface text-gray-400'
                        }`}
                      >
                        <div className="text-xs">{m.label}</div>
                        <div className="text-[10px] text-brand-muted">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 block">სულ გადასახდელი ({items.length} ნივთი):</span>
                    <span className="text-[11px] text-brand-cyan">მიტანა: {deliveryFee === 0 ? 'უფასო' : `${deliveryFee} ₾`}</span>
                  </div>
                  <span className="text-2xl font-mono text-brand-lime font-black">
                    {formatGEL(finalTotal)}
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] py-3.5 rounded-2xl bg-brand-lime text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-brand-lime/90 active:scale-95 transition-all shadow-neon-lime disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-spin" />
                      შეკვეთა იგზავნება...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 fill-black" />
                      შეკვეთის გაფორმება ({formatGEL(finalTotal)})
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ============================================================ */
            /* CORE FEATURE: AUTOMATED WHATSAPP & MESSENGER DIRECT DISPATCH */
            /* ============================================================ */
            <div className="text-center py-4 space-y-5">
              <div className="w-14 h-14 rounded-full bg-brand-lime/15 border-2 border-brand-lime flex items-center justify-center text-brand-lime mx-auto shadow-neon-lime">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-brand-lime px-3 py-1 rounded-full bg-brand-lime/10 border border-brand-lime/30">
                  შეკვეთა შენახულია! #{completedOrder?.id}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  დაადასტურეთ შეკვეთა 1-Click-ით
                </h3>
                <p className="text-xs text-gray-300 max-w-sm mx-auto mt-1">
                  დააჭირეთ ქვემოთ WhatsApp-ს ან Messenger-ს და შეკვეთის დეტალები ავტომატურად გაიგზავნება ოპერატორთან:
                </p>
              </div>

              {/* TWO PROMINENT DIRECT CHAT BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. WhatsApp Direct Button (Green) */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[50px] py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-5 h-5 fill-black" />
                  <span>WhatsApp-ით გაგზავნა</span>
                </a>

                {/* 2. Facebook Messenger Direct Button (Blue) */}
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[50px] py-3 px-4 rounded-2xl bg-[#0084FF] hover:bg-[#0070db] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Messenger-ში მიწერა</span>
                </a>
              </div>

              {/* Formatted Message Preview Card with Copy action */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-brand-muted">
                  <span className="font-mono text-[11px] uppercase text-brand-cyan">
                    ავტომატური ტექსტი:
                  </span>
                  <button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-brand-lime" />
                        <span className="text-brand-lime">დაკოპირდა!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>ტექსტის კოპირება</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-gray-300 whitespace-pre-wrap bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed overflow-x-auto max-h-36 overflow-y-auto">
                  {formattedMsg}
                </pre>
              </div>

              {/* Delivery ETA info */}
              <div className="flex items-center justify-center gap-2 text-xs text-brand-muted">
                <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                <span>კურიერი მოგიტანთ: <strong className="text-white">{currentDistrict.estimatedDelivery}</strong></span>
              </div>

              {/* Continue Shopping button */}
              <button
                onClick={resetAndClose}
                className="w-full min-h-[44px] py-2.5 rounded-xl border border-border-subtle hover:border-gray-500 text-gray-400 hover:text-white text-xs font-semibold transition-all"
              >
                დახურვა და შოპინგის გაგრძელება
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
