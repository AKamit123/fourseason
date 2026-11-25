'use client';

import React from 'react';
import { Check, Sparkles, ArrowRight, Star } from 'lucide-react';

interface PackagesSectionProps {
  onSelectPackage: (pkg: any) => void;
  onOpenRfq: (pkgName?: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onSelectPackage, onOpenRfq }) => {
  const packages = [
    {
      id: 'essential',
      name: 'Essential Elegance',
      tag: 'Intimate Celebrations',
      price: 49000,
      blurb: 'A graceful single-function celebration, thoughtfully styled with bespoke florals and architectural uplighting.',
      star: false,
      savings: 'Save AED 12,000',
      items: [
        'Pastel Blossom Ceremonial Mandap / Arch',
        'Grecian Roman Column Backdrop or Flower Wall',
        'Pastel Aisle Floral Runners (20m continuous)',
        'Full Room Wireless Astera AX5 Uplighting',
        'Gold Chiavari Dining Chairs (up to 150)',
        'Brushed Brass Minimalist Welcome Board',
        'Dedicated On-Site Production Coordinator',
      ],
    },
    {
      id: 'signature',
      name: 'Signature Grand Atelier',
      tag: 'Most Popular Choice',
      price: 99000,
      blurb: 'Our signature multi-day wedding experience, fully produced with monumental florals, mirror stages, and cold pyrotechnics.',
      star: true,
      savings: 'Save AED 24,000',
      items: [
        'Royal Red Dutch Rose Mandap (6m x 4.5m)',
        'Bling Gold Mirror Reflection Stage (12m x 6m)',
        'Red Rose Spherical Table Centrepieces (x25)',
        'Mediterranean Blue Azulejo Bar Counter (4.2m)',
        'Arabic Heritage Persian Carpet Photobooth',
        'Grand Welcome Ornate Baroque Mirror Sign (1.65m)',
        'Cold Sparkular Fountain Machines (x4)',
        'Astera Intelligent Hall Lighting & Pin-Spotting',
        'Royal Velvet VIP Majlis Lounge Suite',
      ],
    },
    {
      id: 'luxe',
      name: 'The Royal Four Seasons Luxe',
      tag: 'Ultra-Luxury Multi-Day Grandeur',
      price: 185000,
      blurb: 'Turnkey palatial celebrations designed for Atlantis The Royal, Bulgari, or Emirates Palace with 4K LED kinetic staging.',
      star: false,
      savings: 'Save AED 38,000',
      items: [
        'Royal Red Naomi Rose Grand Mandap (6m x 4.5m)',
        'Stepped Organic Curved Wave Screen Stage (7.3m)',
        'Art Deco Gold Geometric Bar Counter (6m)',
        'Royal Floral Mehendi Swing (Jhoola) in Silk',
        'Triple Arched French Window Floral Backdrop (7.0m)',
        'Red Rose Dense Table Centrepieces (x40 tables)',
        'Cold Sparkular Pyro (x8) & Low-Fog Clouds',
        'Concert L-Acoustics Sound System & DJ Truss',
        'Antique Grand Floor Mirror Signs & Directional Posts',
        'Full 3D AI Concept Pre-visualization & Dedicated Director',
      ],
    },
  ];

  return (
    <section id="packages" className="py-24 bg-[#FAF8F5] relative border-t border-[#E8E0D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6EED8] border border-[#E2D4B7] text-[#785E1A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B38E36]" />
            Curated Atelier Packages
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1A16]">
            Pre-Curated Luxury Bundles
          </h2>
          <p className="text-sm text-[#474036] font-normal mt-3 leading-relaxed">
            Engineered from authentic Four Seasons catalog inventory with bundled production savings. Customize every single element in our AI Studio.
          </p>
        </div>

        {/* Packages 3-Col Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                pkg.star
                  ? 'border-2 border-[#B38E36] bg-[#FDFAF4] shadow-2xl scale-[1.03] lg:-translate-y-2'
                  : 'bg-white border border-[#E8E0D2] shadow-md hover:shadow-xl hover:border-[#B38E36]/40'
              }`}
            >
              {pkg.star && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38E36] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  Most Popular Choice
                </div>
              )}

              <div>
                {/* Header */}
                <div className="pb-6 border-b border-[#E8E0D2]">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B38E36] block mb-1">
                    {pkg.tag}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1A16] mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-[#474036] leading-relaxed min-h-[48px]">
                    {pkg.blurb}
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1A16]">
                      AED {pkg.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#786F62]">starting bundle</span>
                  </div>
                  <div className="mt-1 text-xs text-emerald-700 font-semibold">
                    {pkg.savings} vs individual item rental
                  </div>
                </div>

                {/* Inclusions List */}
                <div className="py-6 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#785E1A] block">
                    Curated Inclusions:
                  </span>
                  <ul className="space-y-2.5 text-xs text-[#2D261E]">
                    {pkg.items.map((it, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#B38E36] flex-shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#E8E0D2] space-y-2.5">
                <button
                  onClick={() => onOpenRfq(pkg.name)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all ${
                    pkg.star
                      ? 'gold-gradient-btn text-white shadow-lg hover:opacity-95'
                      : 'bg-[#1E1A16] text-white hover:bg-[#B38E36] transition-colors shadow-sm'
                  }`}
                >
                  Book Package Consultation
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('studio');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-[#474036] hover:bg-[#F3EDE2] text-xs font-semibold text-center transition-colors block"
                >
                  Customize Elements in Studio →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
