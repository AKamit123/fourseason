'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Sparkles, ArrowRight, MapPin, CheckCircle2, Camera } from 'lucide-react';
import { AiPlannerWizard } from '@/components/AiPlannerWizard';
import { RequirementFormModal } from '@/components/RequirementFormModal';

const EXPLORE_PAGES: Record<string, {
  badge: string;
  title: string;
  subtitle: string;
  heroImage: string;
  highlights: string[];
  gallery: string[];
  faq: { q: string; a: string }[];
}> = {
  'indian-wedding': {
    badge: 'Indian Wedding · Luxury Atelier',
    title: 'Plan your Indian wedding and see it before you decide',
    subtitle: 'Choose your theme, your mandap and your floral décor from our real in-house inventory. See an instant AI visual before committing your budget.',
    heroImage: '/reference_assets/hero_mandap_red.jpg',
    highlights: [
      'Live sacred fire (Havan) compliant hotel ballrooms & resort lawns',
      '6m Red Naomi Rose Mandaps, Bling Gold Mirror & 7.3m Curved Wave Stages',
      'End-to-end Haldi, Mehendi, Sangeet & Baraat production',
    ],
    gallery: [
      '/reference_assets/hero_mandap_red.jpg',
      '/reference_assets/hero_grecian_haldi.jpg',
      '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg',
    ],
    faq: [
      { q: 'Which venues allow a live sacred fire mandap?', a: 'Our planner automatically filters hotel ballrooms and resort lawns that approve live-fire ceremonies.' },
      { q: 'Are the mandaps and stages from your own inventory?', a: 'Yes, every mandap, jhoola swing, bar counter, and wave stage is owned and maintained in-house by Four Seasons.' },
    ],
  },
  'emirati-khaleeji': {
    badge: 'Emirati & Khaleeji · Royal Celebrations',
    title: 'Bespoke Emirati & Khaleeji Kosha and Majlis Architecture',
    subtitle: 'Monumental floral kosha stages, screened entrances, female-only production crew coordination, and palatial VIP majlis lounges.',
    heroImage: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
    highlights: [
      'Screened ballroom entrances & dedicated female-only setup crew available',
      '7.3m Stepped Curved Wave LED stages & crystal chandeliers',
      'Custom Arabic hospitality lounges & bespoke floral walkways',
    ],
    gallery: [
      '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
      '/catalog/fs_catalog_01_photobooth_carpet_arabic.jpg',
      '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg',
    ],
    faq: [
      { q: 'Do you provide female-only event crew?', a: 'Yes, we arrange screened entrances and female-only production teams for women-only celebrations.' },
    ],
  },
  'beach-resort-wedding': {
    badge: 'Beach & Resort · Destination Celebrations',
    title: 'Beachfront Mehendi, Haldi & Sunset Pavilion Weddings',
    subtitle: 'Sheer linen pavilions, pampas plumes, Grecian Roman columns, and wind-engineered seaside staging.',
    heroImage: '/reference_assets/slide_boho.jpg',
    highlights: [
      'Weather-tested beachfront mandap & arch structures',
      'Grecian Haldi citrus installations & Bohemian sunset lounges',
      'Wireless Astera AX5 lighting & coastal sound engineering',
    ],
    gallery: [
      '/reference_assets/slide_boho.jpg',
      '/reference_assets/hero_grecian_haldi.jpg',
      '/reference_assets/slide_neon.jpg',
    ],
    faq: [
      { q: 'Can you handle resort & civil defence permits?', a: 'Yes, Four Seasons handles all structural approvals, sound permits, and resort logistics.' },
    ],
  },
  'corporate-gala': {
    badge: 'Corporate Events · Awards, Conferences & Launches',
    title: 'Turnkey Corporate Galas, Award Nights & Product Launches',
    subtitle: 'High-impact kinetic LED staging, L-Acoustics concert audio, architectural lighting, and VIP hospitality lounges.',
    heroImage: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
    highlights: [
      '4K curved wave LED screens & dynamic stage trussing',
      'Art Deco & Versace hospitality bars for networking receptions',
      'Dedicated production director & timed run-of-show execution',
    ],
    gallery: [
      '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
      '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg',
      '/catalog/fs_catalog_06_welcome_board_gold_mirror_pedestal.jpg',
    ],
    faq: [
      { q: 'Can we get an indicative quote before our internal approval?', a: 'Yes, build your configuration in our planner and download an instant Branded A4 PDF proposal.' },
    ],
  },
};

export default function ExplorePage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'indian-wedding';
  const pageData = EXPLORE_PAGES[slug] || EXPLORE_PAGES['indian-wedding'];

  const [plannerOpen, setPlannerOpen] = useState(false);
  const [rfqOpen, setRfqOpen] = useState(false);
  const [rfqData, setRfqData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1A16]">
      {/* Top Minimal Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E0D2] px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8F6E22] flex items-center justify-center font-serif font-bold text-white text-lg shadow-sm">
            4S
          </div>
          <span className="font-serif font-bold text-base tracking-wider text-[#1E1A16]">
            FOUR SEASONS
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/#portfolio" className="text-xs font-semibold text-[#474036] hover:text-[#B38E36] px-3 py-1.5">
            Gallery
          </Link>
          <Link href="/#studio" className="text-xs font-semibold text-[#474036] hover:text-[#B38E36] px-3 py-1.5">
            Inventory
          </Link>
          <button
            onClick={() => setPlannerOpen(true)}
            className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
          >
            Plan my event
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Hero Card (PDF 2 Page 7 Phone-First Pattern) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6EED8] border border-[#E2D4B7] text-[#785E1A] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#B38E36]" />
              {pageData.badge}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1A16] leading-tight">
              {pageData.title}
            </h1>
            <p className="text-sm text-[#474036] leading-relaxed">
              {pageData.subtitle}
            </p>
            <ul className="space-y-2">
              {pageData.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#2D261E] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#B38E36] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setPlannerOpen(true)}
                className="gold-gradient-btn px-7 py-3.5 rounded-2xl text-sm font-bold text-white flex items-center gap-2 shadow-lg"
              >
                <span>Plan my event</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRfqOpen(true)}
                className="px-5 py-3.5 rounded-2xl border border-[#DDD5C7] bg-white text-xs font-bold text-[#474036] hover:bg-[#F3EDE2]"
              >
                Request Direct Quote
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-[#E8E0D2] shadow-xl bg-white p-2">
              <img
                src={pageData.heroImage}
                alt={pageData.title}
                className="w-full h-72 sm:h-96 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Real Past Work Gallery */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#1E1A16] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#B38E36]" />
              Real Celebrations from Our Archive
            </h2>
            <Link href="/#portfolio" className="text-xs font-bold text-[#785E1A] hover:underline">
              View All Past Work →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pageData.gallery.map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-[#E8E0D2] bg-white shadow-sm h-52">
                <img src={img} alt="Past event" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Explore Links (Other Event Types, Communities & Venues) */}
        <section className="p-6 rounded-3xl bg-[#F5EFE6] border border-[#E8E0D2] space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#785E1A] block">
            Explore More Event Pages
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { slug: 'indian-wedding', label: 'Indian Weddings' },
              { slug: 'emirati-khaleeji', label: 'Emirati & Khaleeji' },
              { slug: 'beach-resort-wedding', label: 'Beach & Resort Weddings' },
              { slug: 'corporate-gala', label: 'Corporate Galas & Awards' },
            ].map((item) => (
              <Link
                key={item.slug}
                href={`/explore/${item.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  slug === item.slug
                    ? 'bg-[#B38E36] text-white shadow-sm'
                    : 'bg-white border border-[#DDD5C7] text-[#474036] hover:bg-[#FAF8F5]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Structured FAQ for Search & AI Assistants */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#1E1A16]">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pageData.faq.map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-[#E8E0D2] space-y-1.5">
                <h3 className="font-serif font-bold text-sm text-[#1E1A16]">{f.q}</h3>
                <p className="text-xs text-[#474036] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <AiPlannerWizard
        isOpen={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        onOpenRfqWithData={(data) => {
          setRfqData(data);
          setRfqOpen(true);
        }}
      />
      <RequirementFormModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        initialData={rfqData}
      />
    </div>
  );
}

