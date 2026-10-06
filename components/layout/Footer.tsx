import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Send, ShieldCheck, Truck, Zap } from 'lucide-react';
import { BATUMI_DISTRICTS } from '@/lib/districts';

export function Footer() {
  return (
    <footer className="w-full bg-[#08080a] border-t border-border-subtle pt-16 pb-28 sm:pb-16 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-lime text-black font-black flex items-center justify-center text-base">
                L
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                LAMAZAD<span className="text-brand-lime">.GE</span>
              </span>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              ექსკლუზიური ტანსაცმლისა და ფეხსაცმლის ონლაინ პლატფორმა ბათუმში.
            </p>
            <div className="flex items-center gap-3 text-white">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-surface border border-border-subtle flex items-center justify-center hover:border-brand-lime hover:text-brand-lime transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-surface border border-border-subtle flex items-center justify-center hover:border-brand-cyan hover:text-brand-cyan transition-all"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Batumi Delivery Zones */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
              მიტანის უბნები (ბათუმი)
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              {BATUMI_DISTRICTS.slice(0, 5).map((d) => (
                <li key={d.id} className="flex justify-between items-center text-gray-400">
                  <span>{d.nameKa.split('(')[0]}</span>
                  <span className="text-brand-lime">{d.estimatedDelivery}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Physical Showroom & Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              შოურუმი & კონტაქტი
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-semibold">Batumi Flagship Hub</span>
                  რუსთაველის გამზირი 18 / ძველი ბათუმი
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-cyan shrink-0" />
                <span className="font-mono text-white">+995 (422) 27-00-26</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border-subtle text-[11px] text-gray-300">
                <span className="text-brand-lime font-bold block">სამუშაო საათები:</span>
                ყოველდღე: 11:00 - 22:00
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              გარანტია & სერვისი
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-gray-300">
                <Truck className="w-4 h-4 text-brand-lime" />
                24 საათიანი ექსპრეს კურიერი
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                პრემიუმ ხარისხის გარანტია
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="w-4 h-4 text-brand-lime" />
                ადგილზე მოსინჯვა კურიერის თანდასწრებით
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>© {new Date().getFullYear()} LAMAZAD.GE — ყველა უფლება დაცულია. ბათუმი, საქართველო.</div>
        </div>
      </div>
    </footer>
  );
}
