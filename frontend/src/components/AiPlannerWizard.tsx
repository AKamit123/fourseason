'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, X, Shield,
  Columns2, RefreshCw, MapPin, Users, Calendar, Eye
} from 'lucide-react';

interface AiPlannerWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage?: (pkgId: string, items: string[]) => void;
  onOpenRfqWithData?: (data: any) => void;
}

const PLAN_STORAGE_KEY = 'fs_guest_planner_state_v2';
const PREVIEW_COUNT_KEY = 'fs_guest_preview_count';
const MAX_GUEST_PREVIEWS = 5;

const COMMUNITY_OPTIONS = [
  'Indian',
  'Muslim and Arabic',
  'Emirati and Khaleeji',
  'Pakistani',
  'Filipino',
  'Russian',
  'Chinese',
  'Western and destination',
];

const CORPORATE_FORMATS = [
  'Annual Day',
  'Award Night',
  'Conference & Summit',
  'Product Launch',
  'Dealer Meet & Gala',
];

const VENUES_CATALOG = [
  { name: 'Hotel Grand Ballroom (Live-Fire & Partition Ready)', tags: ['all', 'Indian', 'Emirati and Khaleeji', 'Muslim and Arabic', 'Pakistani', 'Corporate'] },
  { name: 'Beach & Luxury Resort Lawn', tags: ['all', 'Indian', 'Western and destination', 'Russian', 'Filipino', 'Chinese'] },
  { name: 'Private Villa & Estate Grounds', tags: ['all', 'Emirati and Khaleeji', 'Muslim and Arabic', 'Indian', 'Western and destination'] },
  { name: 'Desert Luxury Camp & Dunes', tags: ['all', 'Western and destination', 'Corporate', 'Russian'] },
  { name: 'Luxury Superyacht Deck', tags: ['all', 'Western and destination', 'Corporate', 'Russian'] },
  { name: 'Convention & Exhibition Hall', tags: ['Corporate'] },
];

export const AiPlannerWizard: React.FC<AiPlannerWizardProps> = ({
  isOpen,
  onClose,
  onOpenRfqWithData,
}) => {
  const [step, setStep] = useState(0);
  const [isCurating, setIsCurating] = useState(false);
  const [curatingIndex, setCuratingIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // 5-Question Core State (PDF 2 Step 4)
  const [categoryMode, setCategoryMode] = useState<'celebration' | 'corporate'>('celebration');
  const [occasion, setOccasion] = useState('Wedding');
  const [style, setStyle] = useState('Indian');
  const [eventDate, setEventDate] = useState('2026-12-18');
  const [guests, setGuests] = useState(350);
  const [location, setLocation] = useState('Hotel Grand Ballroom (Live-Fire & Partition Ready)');
  const [inclusions, setInclusions] = useState<string[]>(['Production & Staging', 'Décor & Florals', 'Lighting & Sound']);
  const [theme, setTheme] = useState('Floral Majesty');
  const [budget, setBudget] = useState(150000);

  // Step 7 & 8: Guest Preview Limits + 2-Version Side-by-Side Comparison
  const [previewCount, setPreviewCount] = useState(1);
  const [versionA, setVersionA] = useState<any | null>(null);
  const [versionB, setVersionB] = useState<any | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  // Restore saved guest plan from localStorage (PDF 2 Step 3 & 4: Saved as they go)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.categoryMode) setCategoryMode(p.categoryMode);
        if (p.occasion) setOccasion(p.occasion);
        if (p.style) setStyle(p.style);
        if (p.eventDate) setEventDate(p.eventDate);
        if (p.guests) setGuests(p.guests);
        if (p.location) setLocation(p.location);
        if (p.inclusions) setInclusions(p.inclusions);
        if (p.theme) setTheme(p.theme);
        if (p.budget) setBudget(p.budget);
      }
      const cnt = Number(localStorage.getItem(PREVIEW_COUNT_KEY) || '1');
      setPreviewCount(cnt);
    } catch (_) {}
  }, []);

  // Auto-save every answer immediately
  useEffect(() => {
    try {
      localStorage.setItem(
        PLAN_STORAGE_KEY,
        JSON.stringify({ categoryMode, occasion, style, eventDate, guests, location, inclusions, theme, budget })
      );
    } catch (_) {}
  }, [categoryMode, occasion, style, eventDate, guests, location, inclusions, theme, budget]);

  const curatingMessages = [
    'Reading your event & cultural rules…',
    `Holding fixed inventory structures for ${theme}…`,
    `Matching eligible ${location.split('(')[0].trim()} layouts…`,
    'Applying house brand rules & watermarking guest preview…',
    'Preparing your Four Seasons visual plan ✨',
  ];

  const themesList = [
    { id: 'Floral Majesty', name: 'Floral Majesty', img: '/reference_assets/hero_floral_majesty.jpg', desc: 'Ivory & blush hydrangeas, romantic ceiling canopies' },
    { id: 'Red Bloom', name: 'Red Bloom', img: '/reference_assets/slide_redbloom.jpg', desc: 'Opulent crimson Dutch Red Naomi roses & gold mirrors' },
    { id: 'Bling', name: 'Bling Glamour', img: '/reference_assets/slide_bling_stage.jpg', desc: 'Gold mirror reflective stages & crystal chandeliers' },
    { id: 'Grecian Haldi', name: 'Grecian Haldi', img: '/reference_assets/hero_grecian_haldi.jpg', desc: 'Roman fluted pillars, sunny citrus & marigolds' },
    { id: 'Colourful Mehendi', name: 'Colourful Mehendi', img: '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg', desc: 'Royal floral swing & rich magenta silks' },
    { id: 'Boho', name: 'Bohemian Sunset', img: '/reference_assets/slide_boho.jpg', desc: 'Beachfront linen drapery & pampas plumes' },
    { id: 'Sufi Traditional', name: 'Sufi Traditional', img: '/catalog/fs_catalog_01_photobooth_carpet_arabic.jpg', desc: 'Ornate Persian carpets & candle arches' },
    { id: 'Neon Glow', name: 'Tropical Neon', img: '/reference_assets/slide_neon.jpg', desc: 'Living foliage walls & custom neon moments' },
  ];

  const selectedThemeObj = themesList.find((t) => t.id === theme) || themesList[0];

  // Venue eligibility filtering based on community/corporate format
  const eligibleVenues = VENUES_CATALOG.filter((v) => {
    if (categoryMode === 'corporate') return v.tags.includes('Corporate');
    return v.tags.includes(style) || v.tags.includes('all');
  });

  const handleToggleInclusion = (inc: string) => {
    setInclusions((prev) =>
      prev.includes(inc) ? prev.filter((x) => x !== inc) : [...prev, inc]
    );
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      const nextCnt = Math.min(MAX_GUEST_PREVIEWS, previewCount + 1);
      setPreviewCount(nextCnt);
      try {
        localStorage.setItem(PREVIEW_COUNT_KEY, String(nextCnt));
      } catch (_) {}
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
      }, 650);
      return () => clearInterval(interval);
    }
  }, [isCurating]);

  if (!isOpen) return null;

  const isLuxe = budget >= 250000;
  const isSignature = budget >= 99000 && budget < 250000;
  const recommendedPackage = isLuxe
    ? {
        id: 'luxe',
        name: 'The Royal Four Seasons Luxe Atelier',
        priceRange: 'AED 185,000 – 260,000',
        items: [
          'Royal Red Naomi Rose Grand Mandap (6m × 4.5m)',
          'Stepped Organic Curved Wave Screen Stage (7.3m)',
          'Art Deco Gold Geometric Bar Counter (6m)',
          'Wireless Astera AX5 Uplighting & Cold Sparkulars (x6)',
        ],
      }
    : isSignature
    ? {
        id: 'signature',
        name: 'The Four Seasons Signature Celebration',
        priceRange: 'AED 99,000 – 150,000',
        items: [
          'Signature Floral Mandap or Grecian Pillar Stage',
          'Bling Gold Mirror Reflection Stage (12m × 6m)',
          'Mediterranean Blue Tile Bar Counter (4.2m)',
          'Astera Pin-Spot Lighting & Cold Sparks (x4)',
        ],
      }
    : {
        id: 'essential',
        name: 'The Four Seasons Essential Elegance',
        priceRange: 'AED 49,000 – 75,000',
        items: [
          'Pastel Blossom Ceremonial Mandap / Arch',
          'Flower Wall Photo Moment Backdrop',
          'Floral Table Centrepieces (x15) & Warm Uplighting',
        ],
      };

  const captureCurrentSnapshot = () => ({
    theme,
    image: selectedThemeObj.img,
    location: location.split('(')[0].trim(),
    guests,
    packageName: recommendedPackage.name,
    priceRange: recommendedPackage.priceRange,
    items: recommendedPackage.items,
  });

  const handleSaveForComparison = () => {
    const snap = captureCurrentSnapshot();
    if (!versionA) {
      setVersionA(snap);
    } else {
      setVersionB(snap);
      setShowCompare(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-[#E8E0D2] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D2] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B38E36] flex items-center justify-center font-serif font-bold text-white text-sm shadow-sm">
              4S
            </div>
            <div>
              <span className="font-serif text-[#1E1A16] text-sm block font-bold">
                Plan My Event · {categoryMode === 'corporate' ? 'Corporate Experience' : 'Celebration Atelier'}
              </span>
              <span className="text-[10px] text-[#785E1A] block tracking-widest uppercase font-semibold">
                No Account Needed · Answers Auto-Saved
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E8E0D2] text-[#786F62] hover:text-[#1E1A16] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {isCurating ? (
            <div className="py-16 text-center space-y-6 animate-fade-in">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-[#E2D4B7] border-t-[#B38E36] animate-spin" />
                <div className="absolute inset-3 rounded-full bg-[#F6EED8] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[#B38E36] animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#1E1A16] font-bold">
                  Creating Your Event Visualization
                </h3>
                <p className="text-[#785E1A] text-sm font-medium h-6">
                  {curatingMessages[curatingIndex]}
                </p>
              </div>
              <div className="w-64 h-1.5 bg-[#E8E0D2] rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-[#B38E36] transition-all duration-500"
                  style={{ width: `${((curatingIndex + 1) / curatingMessages.length) * 100}%` }}
                />
              </div>
            </div>
          ) : showCompare && versionA && versionB ? (
            /* Step 8: Side-by-Side 2-Version Comparison */
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                    Compare Your Two Event Plans
                  </h3>
                  <p className="text-xs text-[#474036]">
                    Which of these two fits your celebration best?
                  </p>
                </div>
                <button
                  onClick={() => setShowCompare(false)}
                  className="text-xs font-semibold text-[#785E1A] hover:underline"
                >
                  ← Back to Plan
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Version A', data: versionA },
                  { label: 'Version B', data: versionB },
                ].map((v, i) => (
                  <div key={i} className="rounded-2xl border-2 border-[#E8E0D2] bg-[#FAF8F5] p-4 space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B38E36] text-white text-[10px] font-bold uppercase">
                      {v.label} · {v.data.theme}
                    </span>
                    <div className="relative h-40 rounded-xl overflow-hidden border border-[#E8E0D2]">
                      <img src={v.data.image} alt={v.data.theme} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white/40 font-serif text-lg font-bold tracking-[0.25em] -rotate-12">
                          FOUR SEASONS
                        </span>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="font-serif font-bold text-sm text-[#1E1A16]">{v.data.packageName}</div>
                      <div className="font-bold text-[#785E1A]">{v.data.priceRange}</div>
                      <div className="text-[#474036]">{v.data.location} · {v.data.guests} Guests</div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenRfqWithData?.({
                          occasion,
                          style,
                          eventDate,
                          guests: v.data.guests,
                          location: v.data.location,
                          theme: v.data.theme,
                          budget,
                          recommendedPackage: v.data.packageName,
                        });
                      }}
                      className="gold-gradient-btn w-full py-2.5 rounded-xl text-xs font-bold text-white"
                    >
                      Save {v.label} &amp; Get PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : showResult ? (
            /* Step 7 & 8: AI Visual Preview + Watermark + Swap One Thing */
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38E36] block">
                    Here Is Your Event · {theme}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                    {recommendedPackage.name}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F6EED8] border border-[#E2D4B7] text-[10px] font-bold text-[#785E1A]">
                  Guest Previews: {previewCount} / {MAX_GUEST_PREVIEWS}
                </span>
              </div>

              {/* Watermarked Picture + Honest Disclosure */}
              <div className="space-y-1.5">
                <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden border border-[#E8E0D2] shadow-md">
                  <img
                    src={selectedThemeObj.img}
                    alt={theme}
                    className="w-full h-full object-cover"
                  />
                  {/* Light Guest Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="text-white/40 font-serif text-3xl sm:text-4xl font-bold tracking-[0.35em] -rotate-12 uppercase drop-shadow">
                      FOUR SEASONS
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-bold text-[#785E1A] border border-[#E2D4B7]">
                    Verify Mobile for Clean Version
                  </div>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 text-[10px] font-bold text-white uppercase">
                    AI VISUAL · YOUR SELECTION
                  </div>
                </div>
                <p className="text-[11px] text-[#786F62] italic text-center">
                  An illustration of the style and combination you chose. It is not a photograph of a finished venue.
                </p>
              </div>

              {/* Indicative Range + Chosen Items */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E0D2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#B38E36] block">
                    Indicative Budget Range ({guests} {categoryMode === 'corporate' ? 'Attendees' : 'Guests'})
                  </span>
                  <span className="font-serif text-xl font-bold text-[#1E1A16]">
                    {recommendedPackage.priceRange}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E0D2] text-[10px] font-semibold text-[#474036]">
                    {occasion} · {style}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E0D2] text-[10px] font-semibold text-[#474036]">
                    {location.split('(')[0].trim()}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Save My Plan, Swap One Thing, Compare 2 Versions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setShowResult(false);
                    setStep(4); // Go straight to Theme/Item swap
                  }}
                  className="py-3 px-4 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] hover:bg-[#F3EDE2] text-[#474036] text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#B38E36]" />
                  <span>Change Something</span>
                </button>

                <button
                  onClick={handleSaveForComparison}
                  className="py-3 px-4 rounded-xl border border-[#B38E36] bg-[#F6EED8] hover:bg-[#EFE2C0] text-[#785E1A] text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  <span>{versionA ? 'Compare 2 Versions' : 'Save as Version A'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenRfqWithData?.({
                      occasion,
                      style,
                      eventDate,
                      guests,
                      location: location.split('(')[0].trim(),
                      theme,
                      budget,
                      recommendedPackage: recommendedPackage.name,
                    });
                  }}
                  className="gold-gradient-btn py-3 px-4 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <span>Save My Plan &amp; PDF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* 6-Step Guided Flow (5 Core Questions + Theme Picker) */
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-[#786F62]">
                <span>Question {step + 1} of 6</span>
                <span className="text-[#B38E36] font-bold">
                  {Math.round(((step + 1) / 6) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E8E0D2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B38E36] transition-all duration-300"
                  style={{ width: `${((step + 1) / 6) * 100}%` }}
                />
              </div>

              {/* Step 0: Event Type (Celebration vs Corporate) */}
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                      1. What kind of event are you planning?
                    </h3>
                    <p className="text-xs text-[#474036] mt-1">
                      Choose a family celebration or a corporate gathering.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setCategoryMode('celebration');
                        setOccasion('Wedding');
                        setStyle('Indian');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        categoryMode === 'celebration'
                          ? 'border-[#B38E36] bg-[#F6EED8] font-bold'
                          : 'border-[#DDD5C7] bg-[#FAF8F5]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#1E1A16] block">Family Celebration</span>
                      <span className="text-[10px] text-[#786F62]">Weddings, Haldi, Mehendi, Reception</span>
                    </button>
                    <button
                      onClick={() => {
                        setCategoryMode('corporate');
                        setOccasion('Annual Day');
                        setStyle('Annual Day');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        categoryMode === 'corporate'
                          ? 'border-[#B38E36] bg-[#F6EED8] font-bold'
                          : 'border-[#DDD5C7] bg-[#FAF8F5]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#1E1A16] block">Corporate Event</span>
                      <span className="text-[10px] text-[#786F62]">Conferences, Galas, Product Launches</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(categoryMode === 'celebration'
                      ? ['Wedding', 'Reception', 'Mehendi', 'Haldi', 'Sangeet', 'Engagement', 'Milestone Birthday']
                      : ['Annual Day', 'Award Night', 'Conference', 'Product Launch', 'Dealer Meet']
                    ).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setOccasion(opt)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          occasion === opt
                            ? 'bg-[#B38E36] text-white shadow-md'
                            : 'bg-[#FBF9F5] border border-[#DDD5C7] text-[#474036] hover:bg-[#F3EDE2]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Community or Format (BEFORE Location!) */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                      2. {categoryMode === 'corporate' ? 'Which corporate format?' : 'Which wedding tradition / community?'}
                    </h3>
                    <p className="text-xs text-[#474036] mt-1">
                      This helps us filter eligible venues (e.g., live sacred fire or screened entrances) before you pick a location.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(categoryMode === 'corporate' ? CORPORATE_FORMATS : COMMUNITY_OPTIONS).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setStyle(opt)}
                        className={`px-4 py-3 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-all ${
                          style === opt
                            ? 'bg-[#B38E36] text-white shadow-md'
                            : 'bg-[#FBF9F5] border border-[#DDD5C7] text-[#474036] hover:bg-[#F3EDE2]'
                        }`}
                      >
                        <span>{opt}</span>
                        {style === opt && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Guest Count */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                      3. Date and {categoryMode === 'corporate' ? 'how many attendees?' : 'how many guests are you expecting?'}
                    </h3>
                    <p className="text-xs text-[#474036] mt-1">
                      Together they set the season and shortlist stages &amp; seating capacity.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#474036] block mb-1">
                        Target Date / Month
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#474036] block mb-1">
                        Estimated {categoryMode === 'corporate' ? 'Attendees' : 'Guests'}: <strong>{guests}</strong>
                      </label>
                      <input
                        type="range"
                        min={50}
                        max={1200}
                        step={50}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full accent-[#B38E36] mt-2 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Eligible Location + Inclusions */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                      4. Eligible Locations &amp; Inclusions
                    </h3>
                    <p className="text-xs text-[#474036] mt-1">
                      Showing venues eligible for <strong>{style}</strong> ({guests} {categoryMode === 'corporate' ? 'attendees' : 'guests'}).
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {eligibleVenues.map((v) => (
                      <button
                        key={v.name}
                        onClick={() => setLocation(v.name)}
                        className={`p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                          location === v.name
                            ? 'bg-[#B38E36] text-white shadow-sm'
                            : 'bg-[#FBF9F5] border border-[#DDD5C7] text-[#474036] hover:bg-[#F3EDE2]'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#785E1A] block mb-2">
                      5. What would you like Four Seasons to provide?
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Production & Staging', 'Décor & Florals', 'Lighting & Sound', 'Entertainment', 'Hospitality & Staffing'].map((inc) => {
                        const active = inclusions.includes(inc);
                        return (
                          <button
                            key={inc}
                            onClick={() => handleToggleInclusion(inc)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              active
                                ? 'bg-[#1E1A16] text-white'
                                : 'bg-[#FAF8F5] border border-[#DDD5C7] text-[#474036]'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}
                            {inc}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Theme Selection */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                      6. Choose Your Visual Theme
                    </h3>
                    <p className="text-xs text-[#474036] mt-1">
                      Every tile shows real past work from Four Seasons. No prompt typing required.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {themesList.map((t) => {
                      const isSel = theme === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-1.5 ${
                            isSel ? 'border-[#B38E36] bg-[#F6EED8] scale-[1.03] shadow-md' : 'border-[#E8E0D2] bg-[#FAF8F5]'
                          }`}
                        >
                          <div
                            className="w-full h-20 rounded-lg bg-cover bg-center mb-1.5"
                            style={{ backgroundImage: `url('${t.img}')` }}
                          />
                          <span className="text-xs font-serif font-bold text-[#1E1A16] block truncate">
                            {t.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Indicative Budget Tier */}
              {step === 5 && (
                <div className="space-y-4 py-2">
                  <div className="text-center">
                    <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                      Indicative Investment Tier
                    </h3>
                    <span className="text-3xl font-serif font-bold text-[#B38E36] block mt-2">
                      AED {budget.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#786F62] block mt-1">
                      Indicative range only — final quote confirmed after venue survey.
                    </span>
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
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          budget === b.v
                            ? 'bg-[#B38E36] text-white shadow-sm'
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
          )}
        </div>

        {/* Footer */}
        {!isCurating && !showResult && !showCompare && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E8E0D2] bg-[#FAF8F5]">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${
                step === 0 ? 'text-[#C5BDB0] cursor-not-allowed' : 'text-[#474036] hover:bg-[#E8E0D2]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center gap-2 shadow-md"
            >
              <span>{step === 5 ? 'Show Me My Event ✨' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
