'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Compass, Mail, Package, Camera, HeartHandshake, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AtelierExperienceSection } from '@/components/AtelierExperienceSection';
import { AiPlannerWizard } from '@/components/AiPlannerWizard';
import { RequirementFormModal } from '@/components/RequirementFormModal';
import { WhatsAppChatbotWidget } from '@/components/WhatsAppChatbotWidget';
import { Footer } from '@/components/Footer';

const INDIAN_WEDDING_CEREMONIES = [
  {
    step: '01 · Morning',
    title: 'Haldi & Citrus Courtyard',
    venue: 'Bulgari Resort & Seaside Lawns',
    image: '/reference_assets/hero_grecian_haldi.jpg',
    desc: 'Fluted Roman pillars, fresh yellow marigolds, and sunlit coastal seating.',
  },
  {
    step: '02 · Afternoon',
    title: 'Royal Silk Mehendi',
    venue: 'One&Only Royal Mirage',
    image: '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg',
    desc: 'Hand-carved floral Jhoola swing, Persian carpets, and Moroccan lanterns.',
  },
  {
    step: '03 · Sunset',
    title: 'Sacred Fire Grand Mandap',
    venue: 'Atlantis The Royal, Palm Jumeirah',
    image: '/reference_assets/hero_mandap_red.jpg',
    desc: 'Live-fire approved 6m Dutch Red Naomi rose mandap with gold mirror aisle.',
  },
  {
    step: '04 · Midnight',
    title: 'Sangeet & Royal Reception',
    venue: 'Armani Hotel, Burj Khalifa',
    image: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
    desc: '7.3m curved kinetic LED wave stage, Versace gold bars, and cold sparks.',
  },
];

const SIGNATURE_PREVIEW_ITEMS = [
  {
    name: 'Royal Red Naomi Rose Mandap',
    category: 'Mandaps & Pavilions',
    dimensions: '6.0m × 4.5m',
    price: 'AED 32,000',
    image: '/reference_assets/hero_mandap_red.jpg',
  },
  {
    name: 'Stepped Curved Wave Screen Stage',
    category: 'Stages & Backdrops',
    dimensions: '7.3m Wide',
    price: 'AED 42,000',
    image: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
  },
  {
    name: 'Art Deco Versace Gold Bar',
    category: 'Designer Bars',
    dimensions: '5.9m Span',
    price: 'AED 19,500',
    image: '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg',
  },
  {
    name: 'Grecian Roman Column Haldi',
    category: 'Outdoor & Haldi',
    dimensions: 'Custom Courtyard',
    price: 'AED 24,000',
    image: '/reference_assets/hero_grecian_haldi.jpg',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [rfqOpen, setRfqOpen] = useState(false);
  const [rfqInitialData, setRfqInitialData] = useState<any | null>(null);

  const handleOpenRfq = (data?: any) => {
    if (typeof data === 'string') {
      setRfqInitialData({ occasion: data });
    } else if (data) {
      setRfqInitialData(data);
    } else {
      setRfqInitialData(null);
    }
    setRfqOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1E1A16]">
      <Navbar
        onOpenPlanner={() => setPlannerOpen(true)}
        onOpenRfq={() => handleOpenRfq()}
      />

      {/* 1. Editorial Dubai Indian Wedding Hero */}
      <HeroSection
        onOpenPlanner={() => setPlannerOpen(true)}
        onExploreStudio={() => router.push('/studio')}
      />

      {/* 2. Multi-Day Indian Wedding in Dubai Editorial Strip */}
      <section className="py-20 bg-[#F4EFE6] border-t border-[#E8E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#B38E36] block">
                Multi-Day Celebrations in Dubai
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1A16]">
                Every Function, Styled to Perfection
              </h2>
              <p className="text-sm text-[#474036]">
                From intimate morning Haldi rituals to 600-guest grand ballroom receptions across Dubai’s premier resorts.
              </p>
            </div>
            <button
              onClick={() => setPlannerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-[#E2D4B7] text-xs font-bold text-[#785E1A] hover:bg-[#F6EED8] transition-colors shadow-sm self-start md:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B38E36]" />
              <span>Plan All 4 Functions</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INDIAN_WEDDING_CEREMONIES.map((c, i) => (
              <div
                key={i}
                onClick={() => setPlannerOpen(true)}
                className="group cursor-pointer rounded-3xl bg-white border border-[#E8E0D2] hover:border-[#B38E36]/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 border border-[#E2D4B7] text-[10px] font-bold text-[#785E1A] uppercase">
                    {c.step}
                  </span>
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-[#B38E36] uppercase tracking-wider block">
                      {c.venue}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#1E1A16] mt-0.5 group-hover:text-[#8F6E22] transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-[#474036] mt-1.5 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#785E1A] pt-2 inline-flex items-center gap-1">
                    Visualize Setup <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Curated Signature Pieces (Limited 4-Item Preview) */}
      <section className="py-20 bg-white border-t border-[#E8E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EED8] border border-[#E2D4B7] text-[#785E1A] text-[11px] font-bold uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5 text-[#B38E36]" />
                Curated Atelier Preview
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1A16]">
                Signature In-House Inventory
              </h2>
              <p className="text-sm text-[#474036]">
                A glimpse of our owned wedding architecture. Explore the full 26+ piece catalog inside the studio.
              </p>
            </div>

            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1E1A16] text-white hover:bg-[#B38E36] transition-colors text-xs sm:text-sm font-bold shadow-md self-start md:self-auto"
            >
              <span>Open Full Inventory Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SIGNATURE_PREVIEW_ITEMS.map((item, idx) => (
              <Link
                key={idx}
                href="/studio"
                className="group rounded-3xl bg-[#FAF8F5] border border-[#E8E0D2] hover:border-[#B38E36]/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-[#EAE3D6]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 border border-[#E2D4B7] text-[10px] font-bold text-[#785E1A] uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1E1A16] group-hover:text-[#8F6E22] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-xs text-[#786F62] block mt-1">{item.dimensions}</span>
                  </div>
                  <div className="pt-3 border-t border-[#E8E0D2] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#8F6E22]">{item.price}</span>
                    <span className="text-[#474036] font-semibold">Customize →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Four Seasons Atelier Experience */}
      <AtelierExperienceSection onOpenPlanner={() => setPlannerOpen(true)} />

      {/* 5. Menu Destinations Strip */}
      <section className="py-16 bg-[#FAF8F5] border-t border-[#E8E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: '/packages', icon: Package, title: 'Luxury Packages', desc: 'Essential, Signature & Royal Luxe bundles' },
              { href: '/invitations', icon: Mail, title: 'Digital Invitations', desc: 'Interactive invites with live RSVP' },
              { href: '/portfolio', icon: Camera, title: 'Real Celebrations', desc: 'Past Dubai weddings & case studies' },
              { href: '/services', icon: HeartHandshake, title: 'Turnkey Services', desc: 'Architecture, lighting & hospitality' },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <Link
                  key={i}
                  href={card.href}
                  className="group p-6 rounded-3xl bg-white border border-[#E8E0D2] hover:border-[#B38E36] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F6EED8] border border-[#E2D4B7] flex items-center justify-center text-[#B38E36]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#1E1A16] group-hover:text-[#8F6E22] transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-xs text-[#474036] mt-1">{card.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-[#785E1A] flex items-center gap-1">
                    Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      <AiPlannerWizard
        isOpen={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        onOpenRfqWithData={(data) => handleOpenRfq(data)}
      />

      <RequirementFormModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialData={rfqInitialData}
      />

      <WhatsAppChatbotWidget
        onOpenPlanner={() => setPlannerOpen(true)}
        onOpenRfq={() => handleOpenRfq()}
      />
    </main>
  );
}
