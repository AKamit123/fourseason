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
    <section id="services" className="py-24 bg-[#FAF8F5] relative border-t border-[#E8E0D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6EED8] border border-[#E2D4B7] text-[#785E1A] text-xs font-semibold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-[#B38E36]" />
            Our Atelier Services
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1A16]">
            Turnkey Luxury Event Services
          </h2>
          <p className="text-sm text-[#474036] font-normal mt-3 leading-relaxed">
            From architectural staging and bespoke Dutch florals to AI visual simulation and automated WhatsApp guest concierge.
          </p>
        </div>

        {/* 2x2 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] hover:border-[#B38E36]/50 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl"
            >
              <div className="space-y-4">
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#E8E0D2]">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-white/95 text-xs font-bold text-[#785E1A] border border-[#E2D4B7] shadow-sm backdrop-blur-md">
                    {svc.price}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1A16] group-hover:text-[#8F6E22] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#474036] leading-relaxed mt-2.5">
                    {svc.desc}
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#785E1A] block">
                    Key Deliverables:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {svc.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-[#2D261E]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B38E36] flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8E0D2] flex items-center justify-between">
                <button
                  onClick={() => onOpenRfq(svc.title)}
                  className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center gap-2 shadow-md hover:opacity-95"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <a
                  href="#studio"
                  className="text-xs text-[#786F62] hover:text-[#B38E36] font-semibold transition-colors"
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
