'use client';

import React, { useState } from 'react';
import { Camera, MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const projects = [
    {
      title: 'The Royal Red Bloom Wedding at Atlantis The Royal',
      client: 'Priya & Rohan',
      category: 'Wedding',
      location: 'Palm Jumeirah',
      date: 'Feb 2026',
      image: '/reference_assets/hero_mandap_red.jpg',
      desc: '500-guest regal celebration featuring our 6m Red Naomi rose mandap, gold mirror reflection stage, and synchronised cold spark fountains overlooking the Arabian Gulf.',
      tags: ['Atlantis The Royal', 'Red Bloom', 'Mandap', 'Gold Mirror Stage'],
    },
    {
      title: 'Grecian Elegance Haldi at Bulgari Yacht Club',
      client: 'Zoya & Aamir',
      category: 'Haldi',
      location: 'Jumeirah Bay Island',
      date: 'Jan 2026',
      image: '/reference_assets/hero_grecian_haldi.jpg',
      desc: 'Mediterranean-inspired courtyard celebration with sculpted Corinthian Roman pillars, fresh citrus centerpieces, and traditional marigold cascades.',
      tags: ['Bulgari Resort', 'Grecian Columns', 'Outdoor', 'Haldi'],
    },
    {
      title: 'Midnight Bling Gala at Armani Hotel Burj Khalifa',
      client: 'Fatima & Tariq',
      category: 'Reception',
      location: 'Downtown Boulevard',
      date: 'Mar 2026',
      image: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
      desc: 'High-glamour black-tie evening featuring 7.3m curved wave screen staging, cascading crystal chandeliers, and Astera AX5 architectural hall lighting.',
      tags: ['Armani Hotel', 'Bling', 'Grand Ballroom', '7.3m Wave Stage'],
    },
    {
      title: 'Sunset Beachfront Boho Celebration at Nikki Beach',
      client: 'Chloe & Marcus',
      category: 'Destination',
      location: 'Pearl Jumeira Lawn',
      date: 'Oct 2025',
      image: '/reference_assets/slide_boho.jpg',
      desc: 'Barefoot luxury oceanfront ceremony with sheer linen draped pavilion, pampas grass plumes, and wooden directional signage.',
      tags: ['Nikki Beach', 'Boho', 'Beachfront Mandap', 'Destination'],
    },
    {
      title: 'Royal Sufi & Sangeet Night at One&Only Royal Mirage',
      client: 'Simran & Kabir',
      category: 'Sangeet',
      location: 'Coastal Estate Grounds',
      date: 'Dec 2025',
      image: '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg',
      desc: 'Vibrant cultural celebration with our hand-carved royal swing (Jhoola) in magenta & teal silk, Moorish arch orchestra riser, and Moroccan glass lanterns.',
      tags: ['Royal Swing', 'Sangeet', 'One&Only', 'Magenta Silks'],
    },
    {
      title: 'Versace Imperial Reception at Palazzo Versace',
      client: 'Nasser & Layla',
      category: 'Reception',
      location: 'Palatial Ballroom',
      date: 'Nov 2025',
      image: '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg',
      desc: 'Imperial banquet showcasing the 5.9m Versace gold medallion bar counter, crystal fairy light ceiling, and white chesterfield majlis seating.',
      tags: ['Palazzo Versace', 'Versace Bar', 'Imperial Gold', 'Luxury'],
    },
  ];

  const categories = ['All', 'Wedding', 'Haldi', 'Reception', 'Sangeet', 'Destination'];

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-20 bg-fs-navy-dark relative border-t border-fs-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fs-gold/15 border border-fs-gold/30 text-fs-gold-light text-xs font-semibold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" />
              Real Celebrations &amp; Case Studies
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Our Past Work
            </h2>
            <p className="text-sm text-fs-cream/70 max-w-2xl mt-2 font-light">
              Explore real weddings and celebrations brought to life across iconic palaces, luxury ballrooms, and prestigious private estates.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === c
                    ? 'bg-fs-gold text-fs-navy font-bold shadow-sm'
                    : 'bg-white/5 border border-white/10 text-fs-cream/70 hover:bg-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((proj, idx) => (
            <div
              key={idx}
              className="group glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-fs-gold/50 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/60"
            >
              {/* Cover Image */}
              <div className="relative h-64 overflow-hidden bg-fs-navy-dark">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fs-navy-dark/95 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-fs-navy/85 border border-fs-gold/30 text-[10px] font-bold text-fs-gold-lighter uppercase backdrop-blur-md">
                  {proj.category}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-fs-cream/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-fs-gold" />
                    {proj.location}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-fs-cream/60">
                    <Calendar className="w-3 h-3 text-fs-gold" />
                    {proj.date}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-serif italic text-fs-gold-light block mb-1">
                    Client: {proj.client}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white group-hover:text-fs-gold-lighter transition-colors leading-snug">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-fs-cream/70 line-clamp-3 mt-2 font-light leading-relaxed">
                    {proj.desc}
                  </p>
                </div>

                {/* Tags & Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                    {proj.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-fs-cream/60">
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#studio"
                    className="text-xs font-semibold text-fs-gold hover:text-fs-gold-lighter flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Decor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

