'use client';

import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, Award, Users, Star,
  ShieldCheck, Eye, Layers, Compass, CheckCircle2, ChevronRight
} from 'lucide-react';

interface HeroSectionProps {
  onOpenPlanner: () => void;
  onExploreStudio: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenPlanner, onExploreStudio }) => {
  // Interactive showcase state
  const [showcaseMode, setShowcaseMode] = useState<'render' | 'blueprint'>('render');

  const marqueeItems = [
    { name: 'Red Bloom Mandap', img: '/reference_assets/hero_mandap_red.jpg', pos: '58% 22%', tag: 'Royal Mandap' },
    { name: 'Stepped Wave Stage (7.3m)', img: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg', pos: 'center', tag: 'Catalog Spec' },
    { name: 'Art Deco Gold Bar (6m)', img: '/catalog/fs_catalog_02_bar_marina_florence_tiles_gold.jpg', pos: 'center', tag: 'Catalog Spec' },
    { name: 'Moorish Arch Band Stage (11m)', img: '/catalog/fs_catalog_09_stage_moorish_arch_grand_band.jpg', pos: 'center', tag: 'Catalog Spec' },
    { name: 'Versace Medallion Bar', img: '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg', pos: 'center', tag: 'Catalog Spec' },
    { name: 'Royal Mehendi Jhoola', img: '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg', pos: 'center', tag: 'Catalog Spec' },
    { name: 'Mediterranean Tile Bar (4.2m)', img: '/catalog/fs_catalog_02_bar_marina_florence_tiles_gold.jpg', pos: 'center', tag: 'Catalog Spec' },
    { name: 'Baroque Gold Mirror Sign (1.7m)', img: '/catalog/fs_catalog_07_welcome_board_vintage_gold_mirror.jpg', pos: 'center', tag: 'Catalog Spec' },
    { name: 'Arabic Carpet Photobooth', img: '/catalog/fs_catalog_01_photobooth_carpet_arabic.jpg', pos: 'center', tag: 'Catalog Spec' },
    { name: 'Bling Mirror Stage (12m)', img: '/reference_assets/slide_bling_stage.jpg', pos: 'center', tag: 'Mirror Grandeur' },
    { name: 'Grecian Haldi Columns', img: '/reference_assets/hero_grecian_haldi.jpg', pos: 'center', tag: 'Ceremonial' },
    { name: 'French Window Rose Stage', img: '/catalog/fs_catalog_15_stage_marina_arch_casino_french_window.jpg', pos: 'center', tag: 'Catalog Spec' },
  ];

  const venuePartners = [
    'Armani Hotel Grand Ballroom',
    'Atlantis The Royal Palatial Hall',
    'Jumeirah Grand Pavilion',
    'Bulgari Luxury Resort',
    'Emirates Palace Mandarin Oriental',
    'One&Only Imperial Ocean Lawn',
    'The Ritz-Carlton Grand Hall',
  ];

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between pt-20 sm:pt-24 pb-10 overflow-hidden bg-fs-navy-dark">
      {/* Ambient Radial Background with Atmospheric Gold Haze */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transform pointer-events-none transition-opacity duration-1000"
        style={{ backgroundImage: "url('/reference_assets/hero_mandap_red.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-fs-navy-dark/95 via-fs-navy/90 to-fs-navy-dark pointer-events-none" />

      {/* Decorative Golden Glowing Orbs */}
      <div className="absolute top-1/4 -right-48 w-[500px] h-[500px] rounded-full bg-fs-gold/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-24 -left-48 w-[450px] h-[450px] rounded-full bg-fs-gold-light/10 blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: High-Fashion Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Atelier Heritage Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-fs-gold/15 border border-fs-gold/35 text-fs-gold-lighter text-xs font-semibold shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-fs-gold animate-ping" />
              <span className="font-serif tracking-widest uppercase text-[11px]">Four Seasons</span>
              <span className="text-fs-cream/40">•</span>
              <span className="text-fs-cream/90 font-sans font-medium">Luxury Atelier</span>
            </div>

            {/* Script Accent Subhead */}
            <div className="font-script text-3xl sm:text-4xl lg:text-5xl text-fs-gold-lighter leading-none text-shadow-sm">
              Bespoke Luxury Celebrations &amp; Weddings
            </div>

            {/* Monumental Hero Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.07]">
              Design your dream event with{' '}
              <span className="gold-gradient-text text-gold-shimmer">AI Precision</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-fs-cream/85 font-light leading-relaxed max-w-2xl">
              Combine authentic in-house rental decor, 7.3m wave stages, hand-carved mandaps, and Versace gold bars from our master event atelier. Watch our asynchronous AI visualize photorealistic 4K concepts in seconds before committing your budget.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onOpenPlanner}
                className="gold-gradient-btn px-7 py-4 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center gap-3 group shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 text-fs-navy transition-transform group-hover:rotate-12" />
                <span>Plan with AI Concierge</span>
                <ArrowRight className="w-4 h-4 text-fs-navy transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreStudio}
                className="px-6 py-4 rounded-2xl border border-fs-gold/45 hover:border-fs-gold text-fs-gold-light hover:bg-fs-gold/10 font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 backdrop-blur-md"
              >
                <Compass className="w-4 h-4 text-fs-gold" />
                <span>Explore Catalog Studio</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-fs-gold/20 text-xs text-fs-cream/80">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-fs-gold shrink-0" />
                <span className="font-medium">27+ Years Heritage</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-fs-gold shrink-0" />
                <span className="font-medium">4,800+ Royal Galas</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fs-gold shrink-0" />
                <span className="font-medium">4K Photorealistic AI</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-fs-gold shrink-0" />
                <span className="font-medium">Anti-Double Booking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Ultra-Luxurious Interactive AI Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-fs-gold/40 shadow-2xl bg-fs-navy/90 backdrop-blur-xl animate-float">
              {/* Card Header & Toggle */}
              <div className="px-5 py-3.5 bg-fs-navy-dark/90 border-b border-fs-gold/25 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    {showcaseMode === 'render' ? 'AI 4K Concept Preview' : 'Real Catalog Engineering Blueprint'}
                  </span>
                </div>

                {/* Mode Switcher */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 text-[10px]">
                  <button
                    onClick={() => setShowcaseMode('render')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      showcaseMode === 'render'
                        ? 'bg-fs-gold text-fs-navy shadow-sm'
                        : 'text-fs-cream/70 hover:text-white'
                    }`}
                  >
                    4K AI Render
                  </button>
                  <button
                    onClick={() => setShowcaseMode('blueprint')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      showcaseMode === 'blueprint'
                        ? 'bg-fs-gold text-fs-navy shadow-sm'
                        : 'text-fs-cream/70 hover:text-white'
                    }`}
                  >
                    Real Specs
                  </button>
                </div>
              </div>

              {/* Showcase Main Visual */}
              <div className="relative h-72 sm:h-80 overflow-hidden group">
                <img
                  src={
                    showcaseMode === 'render'
                      ? '/reference_assets/hero_mandap_red.jpg'
                      : '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg'
                  }
                  alt="Four Seasons Luxury Wedding Showcase"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Dimension Badges on Image */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-fs-gold/40 text-[10px] text-white font-medium flex items-center gap-1.5 shadow-lg">
                  <Layers className="w-3.5 h-3.5 text-fs-gold" />
                  <span>
                    {showcaseMode === 'render'
                      ? 'AI Harmonized: Royal Red Bloom Theme'
                      : 'Catalog Spec: 7.3m Curved Wave Stage'}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-fs-navy-dark/80 backdrop-blur-md border border-white/15 text-[10px] text-fs-gold-lighter font-mono font-semibold">
                  {showcaseMode === 'render' ? 'Output: 3840 x 2160 (4K)' : 'Screen: 2.5m x 2.5m | Height: 270cm'}
                </div>
              </div>

              {/* Showcase Bottom Details Bar */}
              <div className="p-4 sm:p-5 bg-fs-navy-dark/95 border-t border-fs-gold/20 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-serif font-bold text-white text-sm block">
                      The Royal Grand Ballroom Concept
                    </span>
                    <span className="text-[10px] text-fs-gold-light/90">
                      Curated for Armani Hotel &amp; Atlantis The Royal
                    </span>
                  </div>
                  <span className="text-xs font-bold text-fs-gold bg-fs-gold/15 px-2.5 py-1 rounded-lg border border-fs-gold/30">
                    4S Atelier
                  </span>
                </div>

                {/* Real Inclusions List */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-fs-cream/80 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fs-gold shrink-0" />
                    <span className="truncate">7.3m Wave LED Stage</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fs-gold shrink-0" />
                    <span className="truncate">6m Art Deco Gold Bar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fs-gold shrink-0" />
                    <span className="truncate">12,000+ Dutch Roses</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fs-gold shrink-0" />
                    <span className="truncate">Astera Hall Pin-Spotting</span>
                  </div>
                </div>

                {/* Card Action Trigger */}
                <button
                  onClick={onExploreStudio}
                  className="w-full py-2.5 rounded-xl border border-fs-gold/40 hover:bg-fs-gold/15 text-fs-gold-lighter font-semibold text-xs flex items-center justify-center gap-2 transition-all mt-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-fs-gold" />
                  <span>Customize this Look in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Prestigious Venues Strip */}
        <div className="mt-14 pt-8 pb-4 border-t border-fs-gold/20 text-center">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-fs-gold-light/70 uppercase block mb-4">
            CELEBRATED AT ICONIC PALACES &amp; LUXURY BALLROOMS
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-10 opacity-75">
            {venuePartners.map((v, i) => (
              <span
                key={i}
                className="font-serif text-xs sm:text-sm text-fs-cream/90 hover:text-fs-gold transition-colors font-medium tracking-wide flex items-center gap-2"
              >
                <span>{v}</span>
                {i < venuePartners.length - 1 && <span className="text-fs-gold/30 text-xs hidden sm:inline">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Infinite Real Celebrations Marquee with All 15 Catalog Specification Sheets */}
      <div className="relative z-10 mt-10 pt-5 pb-2 border-y border-fs-gold/20 bg-fs-navy-dark/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fs-gold animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-fs-gold uppercase">
              Official Four Seasons Catalog Specifications &amp; Decor Renders
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-fs-cream/60">
            Click any decor item to open in AI Combination Studio
          </span>
        </div>

        <div className="overflow-hidden w-full">
          <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div
                key={idx}
                onClick={onExploreStudio}
                className="group relative w-40 sm:w-48 h-56 sm:h-64 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 border border-fs-gold/20 shadow-lg hover:border-fs-gold transition-all hover:scale-[1.03]"
              >
                <div
                  className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${item.img}')`,
                    backgroundPosition: item.pos || 'center',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fs-navy-dark/95 via-black/20 to-transparent" />
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-fs-gold/25 border border-fs-gold/40 text-fs-gold-lighter font-bold uppercase tracking-wider backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <span className="text-[9px] tracking-wider text-fs-gold-light uppercase font-semibold block mb-0.5">
                    Authentic 4S Asset
                  </span>
                  <span className="font-serif font-semibold text-xs sm:text-sm text-white leading-tight block drop-shadow-md">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
