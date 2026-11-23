'use client';

import React from 'react';
import { Sparkles, HeartHandshake, Film, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ServicesSectionProps {
  onOpenRfq: (serviceName?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenRfq }) => {
  const services = [
    {
      title: 'Bespoke Wedding Architecture & Production',
      desc: 'Complete turnkey wedding styling, 3D floor plan engineering, structural floral mandap installation, lighting choreography, and day-of stage management.',
      price: 'From AED 75,000',
      image: '/reference_assets/hero_mandap_red.jpg',
      features: [
        'Dedicated Lead Creative Director',
        'Full 3D Photorealistic Pre-visualization',
        'VIP Protocol & Hospitality Coordination',
        'Civil Defense & Venue Permits',
      ],
    },
    {
      title: 'AI Concept Generation & Visual Studio',
      desc: 'Our proprietary studio allows you to combine real rental inventory elements into high-resolution photorealistic imagery and 4K conceptual video walkthroughs before commitment.',
      price: 'From AED 5,000',
      image: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
      features: [
        'Unlimited Combinations Builder',
        'High-Res Downloadable AI Concept Renders',
        'Cinematic Drone & Steadicam Simulation',
        'Exportable Moodboards with Budget Tracking',
      ],
    },
    {
      title: 'Luxury Sangeet, Mehendi & Cultural Nights',
      desc: 'Vibrant color palettes, Moroccan glass lanterns, interactive folk artist stations, and concert-grade audio-visual trusses tailored for unforgettable musical celebrations.',
      price: 'From AED 45,000',
      image: '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg',
      features: [
        'Custom Dance Stage & Trussing',
        'Low Fog & Sparkular Pyrotechnics',
        'Comfortable Royal Majlis Lounges',
        'LED Walls & Dynamic Live Video Switching',
      ],
    },
    {
      title: 'Dynamic Interactive Digital Invitations',
      desc: 'State-of-the-art responsive digital wedding invitations with dynamic guest personalization, RSVP tracking, Google Maps directions, and one-click WhatsApp broadcast delivery.',
      price: 'From AED 2,500',
      image: '/catalog/fs_catalog_06_welcome_board_gold_mirror_pedestal.jpg',
      features: [
        'Multi-Device Mobile Responsive',
        'Instant WhatsApp Share Links',
        'Live RSVP & Dietary Requirements Dashboard',
        'Custom Font & Color Styling',
      ],
    },
  ];

  return (
    <section id="services" className="py-20 bg-fs-navy relative border-t border-fs-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fs-gold/15 border border-fs-gold/30 text-fs-gold-light text-xs font-semibold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            Our Atelier Services
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Turnkey Luxury Event Services
          </h2>
          <p className="text-sm text-fs-cream/70 font-light mt-2">
            From architectural staging and bespoke Dutch florals to AI visual simulation and automated WhatsApp guest concierge.
          </p>
        </div>

        {/* 2x2 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-fs-gold/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-fs-navy/90 text-xs font-bold text-fs-gold border border-fs-gold/30 backdrop-blur-md">
                    {svc.price}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-fs-gold-lighter transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-fs-cream/75 font-light leading-relaxed mt-2">
                    {svc.desc}
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-fs-gold block">
                    Key Deliverables:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {svc.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-fs-cream/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-fs-gold flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => onOpenRfq(svc.title)}
                  className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4 text-fs-navy" />
                </button>

                <a
                  href="#studio"
                  className="text-xs text-fs-cream/60 hover:text-fs-gold font-medium transition-colors"
                >
                  Explore Rental Catalog →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

