import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { DesignStudio } from '@/components/studio/DesignStudio';

export const metadata = {
  title: 'DESIGN LAB | LAMAZAD.GE — შექმენი შენი მაისური',
  description: 'ააწყვე შენი უნიკალური Oversized მაისური ონლაინ. ბათუმში ექსპრეს დამზადება და მიტანა 24 საათში.',
};

export default function StudioPage() {
  return (
    <div className="w-full bg-[#09090b] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            მაღაზიაში დაბრუნება
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
            THE DESIGN LAB
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
              BATUMI STUDIO
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
            ააწყვე შენი Oversized მაისური: აირჩიე წინა ან ზურგის მხარე, ქსოვილის ფერი, დაამატე ტექსტი ან ატვირთე შენი ლოგო.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-brand-muted">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border-subtle">
            <Zap className="w-3.5 h-3.5 text-brand-lime" />
            <span>24სთ მიტანა ბათუმში</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border-subtle">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
            <span>პრემიუმ ხარისხი</span>
          </div>
        </div>
      </div>

      {/* The Full Interactive Customizer Component */}
      <DesignStudio />
    </div>
  );
}
