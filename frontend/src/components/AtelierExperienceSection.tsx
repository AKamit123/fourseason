'use client';

import React from 'react';
import {
  Compass, Wand2, ShieldCheck,
  Star, Quote, ArrowRight, Sparkles
} from 'lucide-react';

export const AtelierExperienceSection: React.FC<{ onOpenPlanner?: () => void }> = ({ onOpenPlanner }) => {
  const steps = [
    {
      step: '01',
      title: 'Curate Real Inventory',
      desc: 'Browse our catalog of authentic in-house assets — from 7.3m stepped wave stages to Versace bars, royal jhoolas, and Naomi rose mandaps with exact engineering dimensions.',
      icon: Compass,
      tag: '100% In-House Stock',
    },
    {
      step: '02',
      title: 'Harmonize Aesthetic Theme',
      desc: 'Select your preferred visual palette: Royal Red Bloom, Mediterranean Majolica Blue, Neoclassical Gold, or Modern Arabic Nikah.',
      icon: Wand2,
      tag: 'Bespoke Styling',
    },
    {
      step: '03',
      title: 'Generate 4K AI Concepts',
      desc: 'Our asynchronous AI pipeline synthesizes your exact chosen physical items into photorealistic 4K ballroom renders and cinematic videos in seconds.',
      icon: Sparkles,
      tag: 'Photorealistic Precision',
    },
    {
      step: '04',
      title: 'Reserve with Anti-Conflict Lock',
      desc: 'Lock in your date. Our transactional database engine guarantees zero double-booking, followed by automated WhatsApp concierge coordination.',
      icon: ShieldCheck,
      tag: 'Guaranteed Availability',
    },
  ];

  const testimonials = [
    {
      quote: "Four Seasons' 7.3m curved wave screen stage and Naomi rose canopy transformed the Armani Ballroom into an unforgettable royal wonderland. Their AI preview matched the live setup down to the millimeter.",
      client: "Royal Protocol Coordinator",
      venue: "Armani Hotel Grand Ballroom",
      event: "Royal Wedding Gala · 450 Guests",
      rating: 5,
    },
    {
      quote: "Being able to select the 6m Art Deco bar and Moorish arch band stage and see a photorealistic 4K render before paying a single dirham gave our family absolute peace of mind. Truly the finest luxury atelier.",
      client: "Dr. Al-Hashimi & Family",
      venue: "Jumeirah Al Naseem",
      event: "Emirati Nikah & Banquet",
      rating: 5,
    },
    {
      quote: "The combination of in-house luxury rentals, digital invitation RSVP sync, and instant WhatsApp updates made managing our 3-day multi-venue wedding completely stress-free.",
      client: "Priya & Rohan Nair",
      venue: "Atlantis The Royal",
      event: "Signature 3-Day Wedding Festival",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-[#F4EFE6] border-b border-[#E8E0D2] relative overflow-hidden">
      {/* Subtle Ambient Background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#DFBE6F]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#DFBE6F]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6EED8] border border-[#E3D4B3] text-[#785E1A] text-xs font-semibold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B38E36]" />
            <span>The Four Seasons Atelier Process</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1A16] tracking-tight">
            How physical mastery meets <span className="gold-gradient-text">Generative AI</span>
          </h2>
          <p className="text-sm sm:text-base text-[#474036] font-light leading-relaxed">
            Eliminate event guesswork. We combine our most sought-after physical wedding inventory with advanced AI visualizers for flawless execution.
          </p>
        </div>

        {/* 4 Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-[#E2D8C6] hover:border-[#B38E36] transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between space-y-4 group shadow-sm shadow-stone-200/50"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl font-bold text-[#B38E36] transition-colors">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5E8] border border-[#E8DAB7] flex items-center justify-center text-[#B38E36] group-hover:bg-[#B38E36] group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F6EED8] text-[#785E1A] uppercase tracking-wider inline-block">
                    {s.tag}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#1E1A16]">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#474036] font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials / Social Proof Carousel Grid */}
        <div className="mt-16 pt-12 border-t border-[#E8E0D2]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-[0.25em] text-[#785E1A] uppercase block mb-1">
              PROVEN AT GCC&apos;S MOST PRESTIGIOUS GALA CELEBRATIONS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1A16]">
              Client &amp; Royal Protocol Testimonials
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-[#E2D8C6] hover:border-[#B38E36] transition-all space-y-4 flex flex-col justify-between shadow-sm shadow-stone-200/40"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#B38E36]">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-[#B38E36] text-[#B38E36]" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-[#B38E36]/30" />
                  <p className="text-xs sm:text-sm text-[#2C2621] font-light italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#F0EBE1] space-y-0.5">
                  <span className="font-serif font-bold text-sm text-[#1E1A16] block">
                    {t.client}
                  </span>
                  <span className="text-xs text-[#785E1A] font-medium block">
                    {t.venue}
                  </span>
                  <span className="text-[10px] text-[#786F62] block">
                    {t.event}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick CTA Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2D8C6] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1A16]">
                Ready to experience bespoke event planning with AI?
              </h4>
              <p className="text-xs sm:text-sm text-[#474036] font-light">
                Answer 7 simple questions and our concierge will curate your complete inventory &amp; 3D proposal.
              </p>
            </div>
            <button
              onClick={onOpenPlanner}
              className="gold-gradient-btn px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg text-white"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Launch AI Planner Wizard</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
