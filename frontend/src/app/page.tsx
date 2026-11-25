'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Compass, Mail, Package, Camera, HeartHandshake } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AtelierExperienceSection } from '@/components/AtelierExperienceSection';
import { AiPlannerWizard } from '@/components/AiPlannerWizard';
import { RequirementFormModal } from '@/components/RequirementFormModal';
import { WhatsAppChatbotWidget } from '@/components/WhatsAppChatbotWidget';
import { Footer } from '@/components/Footer';

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

const CELEBRATION_GATEWAYS = [
  {
    title: 'Indian Royal Weddings',
    tag: 'Live-Fire Mandaps & Sangeet',
    image: '/reference_assets/hero_mandap_red.jpg',
    href: '/explore/indian-wedding',
  },
  {
    title: 'Emirati & Khaleeji',
    tag: 'Kosha Stages & VIP Majlis',
    image: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
    href: '/explore/emirati-khaleeji',
  },
  {
    title: 'Beach & Resort',
    tag: 'Sunset Pavilions & Boho',
    image: '/reference_assets/slide_boho.jpg',
    href: '/explore/beach-resort-wedding',
  },
  {
    title: 'Corporate Galas',
    tag: 'Awards, Summits & Launches',
    image: '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg',
    href: '/explore/corporate-gala',
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
      {/* Fixed Luxury Navigation */}
      <Navbar
        onOpenPlanner={() => setPlannerOpen(true)}
        onOpenRfq={() => handleOpenRfq()}
      />

      {/* 1. Editorial Hero Section */}
      <HeroSection
        onOpenPlanner={() => setPlannerOpen(true)}
        onExploreStudio={() => router.push('/studio')}
      />

      {/* 2. Curated Signature Pieces (Limited 4-Item Editorial Preview) */}
      <section className="py-24 bg-white border-t border-[#E8E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EED8] border border-[#E2D4B7] text-[#785E1A] text-[11px] font-bold uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5 text-[#B38E36]" />
                Curated Atelier Preview
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1A16] tracking-tight">
                Signature In-House Inventory
              </h2>
              <p className="text-sm text-[#474036] leading-relaxed">
                A curated glimpse of our architectural mandaps, kinetic LED stages, and designer bars. Open the full studio to combine items and generate 4K AI previews.
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
                <div className="relative h-60 overflow-hidden bg-[#EAE3D6]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 border border-[#E2D4B7] text-[10px] font-bold text-[#785E1A] uppercase backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#1E1A16] group-hover:text-[#8F6E22] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-xs text-[#786F62] block mt-1">{item.dimensions}</span>
                  </div>
                  <div className="pt-3 border-t border-[#E8E0D2] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#8F6E22]">{item.price}</span>
                    <span className="text-[#474036] font-semibold group-hover:translate-x-0.5 transition-transform">
                      Customize →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Four Seasons Atelier Experience */}
      <AtelierExperienceSection onOpenPlanner={() => setPlannerOpen(true)} />

      {/* 4. Celebrations & Quick Menu Gateways (Limited Editorial Grid) */}
      <section className="py-24 bg-[#FAF8F5] border-t border-[#E8E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Explore by Event & Community */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#B38E36] block">
                Tailored to Your Tradition
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1A16]">
                Discover by Celebration
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CELEBRATION_GATEWAYS.map((g, i) => (
                <Link
                  key={i}
                  href={g.href}
                  className="group relative h-72 rounded-3xl overflow-hidden border border-[#E8E0D2] shadow-sm hover:shadow-xl transition-all"
                >
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F6EED8] block">
                      {g.tag}
                    </span>
                    <h3 className="font-serif text-xl font-bold leading-snug">{g.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Dedicated Menu Destinations Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: '/packages', icon: Package, title: 'Luxury Packages', desc: 'Essential, Signature & Royal Luxe bundles' },
              { href: '/invitations', icon: Mail, title: 'Digital Invitations', desc: 'Interactive invites with live RSVP' },
              { href: '/portfolio', icon: Camera, title: 'Real Celebrations', desc: 'Past weddings & venue case studies' },
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

      {/* Luxury Footer */}
      <Footer />

      {/* Interactive Modals */}
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
