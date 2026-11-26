'use client';

import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, Award, Users,
  ShieldCheck, Compass, CheckCircle2, ChevronRight, MapPin
} from 'lucide-react';

interface HeroSectionProps {
  onOpenPlanner: () => void;
  onExploreStudio: () => void;
}

const CEREMONY_SHOWCASE = [
  {
    id: 'mandap',
    label: 'Royal Mandap',
    title: 'Twilight Palace Grand Mandap',
    venue: 'Atlantis The Royal, Palm Jumeirah',
    specs: '6.0m × 4.5m · Live-Fire Approved',
    image: '/reference_assets/luxury_mandap_twilight.jpg',
    highlights: ['Blush & Ivory Floral Canopy', 'Crystal Chandeliers & Brass Lanterns', 'Rose-Petal Ceremonial Aisle', 'Custom Brass Havan Kund'],
  },
  {
    id: 'haldi',
    label: 'Grecian Haldi',
    title: 'Sunlit Courtyard Haldi & Citrus',
    venue: 'Bulgari Resort, Jumeirah Bay',
    specs: 'Seaside Courtyard · Floral Columns',
    image: '/reference_assets/hero_grecian_haldi.jpg',
    highlights: ['Sculpted Roman Pillars', 'Fresh Marigold & Citrus', 'Pastel Aisle Seating', 'Acoustic Folk Stage'],
  },
  {
    id: 'mehendi',
    label: 'Mehendi Jhoola',
    title: 'Royal Silk Mehendi Swing',
    venue: 'One&Only Royal Mirage, Dubai',
    specs: 'Hand-Carved Canopy · Silk Drapes',
    image: '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg',
    highlights: ['Magenta & Teal Silk Canopy', 'Persian Carpet Lounges', 'Moroccan Glass Lanterns', 'Artisan Floral Backdrop'],
  },
  {
    id: 'sangeet',
    label: 'Sangeet Stage',
    title: 'Stepped Curved Wave LED Stage',
    venue: 'Armani Hotel, Burj Khalifa',
    specs: '7.3m Wide · Triple Arch 4K',
    image: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
    highlights: ['7.3m Curved Wave Screen', 'L-Acoustics Concert Audio', 'Cold Sparkular Fountains', 'Versace Gold Bar Counter'],
  },
];

const DUBAI_VENUES = [
  'Atlantis The Royal',
  'Armani Hotel Burj Khalifa',
  'Bulgari Resort Dubai',
  'Madinat Jumeirah',
  'Palazzo Versace Dubai',
  'One&Only Royal Mirage',
  'The Ritz-Carlton DIFC',
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenPlanner, onExploreStudio }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = CEREMONY_SHOWCASE[activeIdx];

  return (
    <section id="home" className="relative pt-24 sm:pt-28 pb-16 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F6F1E9] to-[#FAF8F5]">
      {/* Subtle Ambient Architectural Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply scale-105 pointer-events-none"
        style={{ backgroundImage: `url('${current.image}')` }}
      />
      <div className="absolute top-16 -right-40 w-[520px] h-[520px] rounded-full bg-[#DFBE6F]/15 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-40 w-[460px] h-[460px] rounded-full bg-[#E8D5B7]/25 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: High-Fashion Editorial Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-[#E2D4B7] text-[#785E1A] text-xs font-semibold shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#B38E36] animate-pulse" />
              <span className="font-serif tracking-[0.2em] uppercase text-[10px] font-bold">Four Seasons Atelier</span>
              <span className="text-[#C5BDB0]">•</span>
              <span className="text-[#474036] text-[11px] font-medium">Indian Weddings in Dubai</span>
            </div>

            <div className="font-script text-3xl sm:text-4xl text-[#8F6E22] leading-tight">
              Royal Indian Celebrations, Crafted in Dubai
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E1A16] tracking-tight leading-[1.06]">
              Design your grand Indian wedding with{' '}
              <span className="gold-gradient-text">AI Precision</span>
            </h1>

            <p className="text-sm sm:text-base text-[#474036] leading-relaxed max-w-xl">
              From sunlit beachfront Haldi courtyards and silk Mehendi jhoolas to live-fire Red Naomi mandaps and 7.3m Sangeet wave stages across Dubai’s iconic palaces — preview your exact decor in 4K before committing your budget.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                onClick={onOpenPlanner}
                className="gold-gradient-btn px-7 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 group shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-white"
              >
                <Sparkles className="w-4 h-4 text-white transition-transform group-hover:rotate-12" />
                <span>Plan My Wedding</span>
                <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreStudio}
                className="px-6 py-4 rounded-2xl border border-[#DDD5C7] hover:border-[#B38E36] text-[#1E1A16] bg-white/90 hover:bg-[#F6EED8]/60 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Compass className="w-4 h-4 text-[#B38E36]" />
                <span>Explore Inventory</span>
                <ChevronRight className="w-4 h-4 text-[#786F62]" />
              </button>
            </div>

            {/* Refined Trust Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#E8E0D2] text-[11px] text-[#474036]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#B38E36] shrink-0" />
                <span className="font-semibold">27+ Years in Dubai</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B38E36] shrink-0" />
                <span className="font-semibold">4,800+ Royal Galas</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B38E36] shrink-0" />
                <span className="font-semibold">In-House Inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B38E36] shrink-0" />
                <span className="font-semibold">Live-Fire Approved</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 4-Ceremony Editorial Showcase */}
          <div className="lg:col-span-6">
            <div className="p-1.5 rounded-[36px] bg-gradient-to-br from-[#E9D9B8] via-[#FAF6EE] to-[#DFC89A] shadow-2xl shadow-stone-300/50">
            <div className="rounded-[30px] overflow-hidden border border-[#E2D8C6] bg-white">
              {/* Ceremony Selector Pills */}
              <div className="px-4 py-3 bg-[#FAF8F5] border-b border-[#E8E0D2] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5">
                  {CEREMONY_SHOWCASE.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveIdx(idx)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                        activeIdx === idx
                          ? 'bg-[#B38E36] text-white shadow-sm'
                          : 'bg-white border border-[#E8E0D2] text-[#474036] hover:bg-[#F3EDE2]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Visual */}
              <div className="relative h-72 sm:h-96 overflow-hidden group">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                <div className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E2D4B7] text-[10px] font-bold text-[#785E1A] flex items-center gap-1.5 shadow-sm">
                  <MapPin className="w-3 h-3 text-[#B38E36]" />
                  <span>{current.venue}</span>
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#F6EED8] font-bold block">
                      {current.specs}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                      {current.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Curated Inclusions Footer */}
              <div className="p-5 bg-white space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs text-[#474036]">
                  {current.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B38E36] shrink-0" />
                      <span className="truncate font-medium">{h}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onExploreStudio}
                  className="w-full py-3 rounded-xl border border-[#E2D4B7] bg-[#FAF8F5] hover:bg-[#F6EED8] text-[#785E1A] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B38E36]" />
                  <span>Customize This Ceremony in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Prestigious Dubai Venues Strip */}
        <div className="mt-14 pt-8 border-t border-[#E8E0D2] text-center">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#785E1A] uppercase block mb-4">
            PREFERRED DECOR ATELIER AT DUBAI’S ICONIC VENUES
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5">
            {DUBAI_VENUES.map((v, i) => (
              <span
                key={i}
                className="font-serif text-xs sm:text-sm text-[#474036] hover:text-[#B38E36] transition-colors font-medium"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
