'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw, X, Shield, Star, DollarSign, Users, Calendar } from 'lucide-react';

interface AiPlannerWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage?: (pkgId: string, items: string[]) => void;
  onOpenRfqWithData?: (data: any) => void;
}

export const AiPlannerWizard: React.FC<AiPlannerWizardProps> = ({
  isOpen,
  onClose,
  onSelectPackage,
  onOpenRfqWithData,
}) => {
  const [step, setStep] = useState(0);
  const [isCurating, setIsCurating] = useState(false);
  const [curatingIndex, setCuratingIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Form State
  const [occasion, setOccasion] = useState('Wedding');
  const [style, setStyle] = useState('Indian');
  const [functions, setFunctions] = useState(3);
  const [guests, setGuests] = useState(400);
  const [timeline, setTimeline] = useState('In 3–6 months');
  const [theme, setTheme] = useState('Red Bloom');
  const [budget, setBudget] = useState(250000);

  const curatingMessages = [
    'Reading your cultural style cues…',
    `Matching authentic ${theme} florals and mandaps…`,
    'Pairing the right 7.3m stage and designer bar…',
    'Optimizing against your AED budget and guest capacity…',
    'Adding the Four Seasons Atelier magic ✨',
  ];

  const themesList = [
    { id: 'Red Bloom', name: 'Red Bloom', img: '/reference_assets/slide_redbloom.jpg', desc: 'Opulent crimson Dutch Red Naomi roses, gold mirrors & crystal' },
    { id: 'Bling', name: 'Bling Glamour', img: '/reference_assets/slide_bling_stage.jpg', desc: 'Gold mirror reflective stages, kinetic shimmer & chandeliers' },
    { id: 'Grecian Haldi', name: 'Grecian Haldi', img: '/reference_assets/hero_grecian_haldi.jpg', desc: 'Roman fluted pillars, sunny citrus & yellow marigolds' },
    { id: 'Floral Majesty', name: 'Floral Majesty', img: '/reference_assets/hero_floral_majesty.jpg', desc: 'Blush pink, white hydrangeas & romantic ceiling canopies' },
    { id: 'Colourful Mehendi', name: 'Colourful Mehendi', img: '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg', desc: 'Royal floral swing, painted crate signs & rich magenta silks' },
    { id: 'Boho', name: 'Bohemian Sunset', img: '/reference_assets/slide_boho.jpg', desc: 'Beachfront linen drapery, pampas plumes & ocean views' },
    { id: 'Sufi Traditional', name: 'Sufi Traditional', img: '/catalog/fs_catalog_01_photobooth_carpet_arabic.jpg', desc: 'Ornate Persian woven carpets, terracotta urns & candle arches' },
    { id: 'Neon Glow', name: 'Tropical Neon', img: '/reference_assets/slide_neon.jpg', desc: 'Living foliage walls, custom couple hashtag neon & flamingos' },
  ];

  const questions = [
    {
      title: 'What are we celebrating?',
      subtitle: 'Every legendary event starts with the occasion.',
      type: 'chips',
      options: ['Wedding', 'Haldi', 'Mehendi', 'Engagement', 'Reception', 'Arabic Nikah', 'Milestone Birthday', 'Corporate Gala'],
      value: occasion,
      setValue: setOccasion,
    },
    {
      title: 'Which cultural aesthetic speaks to you?',
      subtitle: 'Our atelier tailors every detail to your family traditions.',
      type: 'chips',
      options: ['Indian Royal', 'Arabic Modern', 'Muslim Contemporary', 'Western Minimalist', 'Fusion Celebration'],
      value: style,
      setValue: setStyle,
    },
    {
      title: 'How many functions are you planning?',
      subtitle: 'From an intimate single-day ceremony to a grand multi-day extravaganza.',
      type: 'slider',
      min: 1,
      max: 6,
      unit: 'Functions',
      value: functions,
      setValue: setFunctions,
    },
    {
      title: 'Estimated guest attendance',
      subtitle: 'Helps us calculate ballroom staging, dining chairs, and sound coverage.',
      type: 'guests',
      value: guests,
      setValue: setGuests,
    },
    {
      title: 'When is the celebration?',
      subtitle: 'We reserve and verify inventory availability in real-time.',
      type: 'chips',
      options: ['Within 1 month', 'In 1–3 months', 'In 3–6 months', 'In 6–12 months', 'Next Year (2027)'],
      value: timeline,
      setValue: setTimeline,
    },
    {
      title: 'Select your visual theme',
      subtitle: 'AI will harmonize all mandaps, stages, bars, and centerpieces to this style.',
      type: 'themes',
      value: theme,
      setValue: setTheme,
    },
    {
      title: 'Estimated overall decor & production budget',
      subtitle: 'We ensure high-impact visual elegance at every tier.',
      type: 'budget',
      value: budget,
      setValue: setBudget,
    },
  ];

  // Handle next / finish
  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Trigger curating animation
      setIsCurating(true);
      setCuratingIndex(0);
    }
  };

  useEffect(() => {
    if (isCurating) {
      const interval = setInterval(() => {
        setCuratingIndex((prev) => {
          if (prev < curatingMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setIsCurating(false);
            setShowResult(true);
            return prev;
          }
        });
      }, 900);
      return () => clearInterval(interval);
    }
  }, [isCurating]);

  if (!isOpen) return null;

  // Determine recommended package
  const isLuxe = budget >= 250000;
  const isSignature = budget >= 99000 && budget < 250000;
  const recommendedPackage = isLuxe
    ? {
        id: 'luxe',
        name: 'The Royal Four Seasons Luxe Atelier',
        tag: 'Bespoke Multi-Day Grandeur',
        price: 185000,
        estimatedTotal: budget,
        savings: 'AED 38,000 Bundled Atelier Privilege',
        items: [
          'Royal Red Floral Mandap (6m x 4.5m) with Naomi Roses',
          'Stepped Organic Curved Wave Screen Stage (7.3m)',
          'Art Deco Gold Geometric Bar Counter (6m)',
          'Royal Floral Mehendi Swing (Jhoola) in Silk',
          'Ornate Baroque Gold Mirror Welcome Board (1.65m)',
          'Red Rose Spherical Table Centrepieces (x40)',
          'Full Ballroom Wireless Astera AX5 Uplighting',
          'Cold Sparkular Pyrotechnic Fountains (x6)',
          'VIP Royal Velvet Majlis Lounge Setup',
        ],
      }
    : isSignature
    ? {
        id: 'signature',
        name: 'The Four Seasons Signature Celebration',
        tag: 'Most Popular Choice',
        price: 99000,
        estimatedTotal: 125000,
        savings: 'AED 24,000 Bundled Savings',
        items: [
          'Royal Red Floral Mandap or Grecian Pillar Backdrop',
          'Bling Mirror Reflection Stage (12m x 6m)',
          'Mediterranean Blue Tile Bar Counter (4.2m)',
          'Arabic Heritage Carpet & Pampas Photobooth',
          'Grand Welcome Brass Stand Board',
          'Red Rose Table Centrepieces (x25)',
          'Astera Hall Pin-Spot & Uplighting Package',
          'Cold Spark Fountain Machines (x4)',
        ],
      }
    : {
        id: 'essential',
        name: 'The Four Seasons Essential Elegance',
        tag: 'Intimate & Refined',
        price: 49000,
        estimatedTotal: 65000,
        savings: 'AED 12,000 Bundled Savings',
        items: [
          'Pastel Blossom Ceremonial Mandap / Pavilion',
          'Flower Wall Photo Moment Backdrop',
          'Brushed Brass Minimalist Welcome Board',
          'Floral Table Centrepieces (x15)',
          'Warm Architectural Uplighting & Fairy Lights',
        ],
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8E0D2] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D2] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-fs-gold flex items-center justify-center font-serif font-bold text-fs-navy text-sm">
              4S
            </div>
            <div>
              <span className="font-serif font-semibold text-[#1E1A16] text-sm block font-bold">AI Event Planning Concierge</span>
              <span className="text-[10px] text-fs-gold-light block tracking-widest uppercase">Four Seasons</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-fs-cream/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {isCurating ? (
            /* Curating Animation State */
            <div className="py-16 text-center space-y-8 animate-fade-in">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-fs-gold/30 border-t-fs-gold animate-spin" />
                <div className="absolute inset-3 rounded-full bg-fs-gold/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-fs-gold animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-[#1E1A16] font-semibold">
                  Curating Your Masterpiece
                </h3>
                <p className="text-fs-gold-lighter text-base font-medium h-6 transition-all duration-300">
                  {curatingMessages[curatingIndex]}
                </p>
              </div>
              <div className="w-64 h-1.5 bg-fs-navy-dark rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fs-gold-light to-fs-gold transition-all duration-700 ease-out"
                  style={{ width: `${((curatingIndex + 1) / curatingMessages.length) * 100}%` }}
                />
              </div>
            </div>
          ) : showResult ? (
            /* Recommendation Result */
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fs-gold/20 text-fs-gold-light text-xs font-semibold border border-fs-gold/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Recommended Match
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1A16]">
                  {recommendedPackage.name}
                </h3>
                <p className="text-xs text-fs-cream/70">
                  Based on your {occasion} celebration ({style} style, {guests} guests, {theme} theme).
                </p>
              </div>

              {/* Package Card */}
              <div className="glass-gold rounded-2xl p-6 border border-fs-gold/40 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E0D2] gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-fs-gold block">
                      {recommendedPackage.tag}
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#1E1A16]">
                      AED {recommendedPackage.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-fs-cream/60 ml-2">bundled starting rate</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold w-max">
                    {recommendedPackage.savings}
                  </div>
                </div>

                <div className="pt-4 space-y-2.5">
                  <span className="text-xs font-semibold text-fs-gold-light uppercase tracking-wider block">
                    Curated Inventory Inclusions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {recommendedPackage.items.map((it, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-fs-cream/90">
                        <CheckCircle2 className="w-4 h-4 text-fs-gold flex-shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenRfqWithData) {
                      onOpenRfqWithData({
                        occasion,
                        style,
                        functions,
                        guests,
                        timeline,
                        theme,
                        budget,
                        recommendedPackage: recommendedPackage.name,
                      });
                    }
                  }}
                  className="gold-gradient-btn flex-1 py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2"
                >
                  <span>Request Official Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('studio');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3.5 px-6 rounded-xl border border-fs-gold/40 text-fs-gold-light hover:bg-fs-gold/10 font-semibold text-sm transition-colors text-center"
                >
                  Customize in Studio
                </button>
              </div>
            </div>
          ) : (
            /* Question Steps */
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-fs-cream/60">
                <span>Step {step + 1} of {questions.length}</span>
                <span className="text-fs-gold font-medium">{Math.round(((step + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-fs-gold transition-all duration-300"
                  style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                  {questions[step].title}
                </h3>
                <p className="text-xs text-fs-cream/70">
                  {questions[step].subtitle}
                </p>
              </div>

              {/* Question Options */}
              <div className="pt-2">
                {questions[step].type === 'chips' && (
                  <div className="flex flex-wrap gap-2.5">
                    {questions[step].options!.map((opt) => {
                      const isSel = questions[step].value === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => (questions[step].setValue as any)(opt)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isSel
                              ? 'bg-[#B38E36] text-white font-bold shadow-md scale-[1.02]'
                              : 'bg-[#FBF9F5] border border-[#DDD5C7] text-[#474036] hover:bg-[#F3EDE2]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {questions[step].type === 'slider' && (
                  <div className="space-y-4 py-4">
                    <div className="text-center">
                      <span className="text-4xl font-serif font-bold text-fs-gold-light">
                        {functions}
                      </span>
                      <span className="text-xs text-fs-cream/60 block mt-1">
                        Celebration Functions (e.g. Mehendi, Sangeet, Wedding, Reception)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      step={1}
                      value={functions}
                      onChange={(e) => setFunctions(Number(e.target.value))}
                      className="w-full accent-fs-gold cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-fs-cream/50 px-1">
                      <span>1 Intimate Day</span>
                      <span>3 Traditional</span>
                      <span>6 Grand Festival</span>
                    </div>
                  </div>
                )}

                {questions[step].type === 'guests' && (
                  <div className="space-y-4 py-4">
                    <div className="text-center">
                      <span className="text-4xl font-serif font-bold text-fs-gold-light">
                        {guests}
                      </span>
                      <span className="text-xs text-fs-cream/60 block mt-1">Estimated Attending Guests</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={1200}
                      step={50}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full accent-fs-gold cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-fs-cream/50 px-1">
                      <span>50 (VIP Intimate)</span>
                      <span>400 (Signature)</span>
                      <span>1,200+ (Royal Scale)</span>
                    </div>
                  </div>
                )}

                {questions[step].type === 'themes' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {themesList.map((t) => {
                      const isSel = theme === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-1.5 ${
                            isSel ? 'border-fs-gold bg-fs-gold/15 scale-105' : 'border-[#E8E0D2] hover:border-[#B38E36]/40 bg-[#FAF8F5]'
                          }`}
                        >
                          <div
                            className="w-full h-20 rounded-lg bg-cover bg-center mb-1.5"
                            style={{ backgroundImage: `url('${t.img}')` }}
                          />
                          <span className="text-xs font-serif font-semibold text-[#1E1A16] block truncate">
                            {t.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {questions[step].type === 'budget' && (
                  <div className="space-y-4 py-4">
                    <div className="text-center">
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-fs-gold-light">
                        AED {budget.toLocaleString()}
                      </span>
                      <span className="text-xs text-fs-cream/60 block mt-1">Total Decor &amp; Production Budget</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      {[
                        { label: 'Up to AED 75k', v: 75000 },
                        { label: 'AED 75–150k', v: 125000 },
                        { label: 'AED 150–250k', v: 200000 },
                        { label: 'AED 250k+', v: 350000 },
                      ].map((b) => (
                        <button
                          key={b.v}
                          onClick={() => setBudget(b.v)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                            budget === b.v
                              ? 'bg-fs-gold text-fs-navy font-bold'
                              : 'bg-[#FBF9F5] border border-[#DDD5C7] text-[#474036] hover:bg-[#F3EDE2]'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isCurating && !showResult && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E8E0D2] bg-[#FAF8F5]">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${
                step === 0 ? 'text-white/20 cursor-not-allowed' : 'text-fs-cream/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <span>{step === questions.length - 1 ? 'Curate My Plan ✨' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4 text-fs-navy" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
