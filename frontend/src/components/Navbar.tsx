'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, Shield, Compass, Wand2, Layers,
  Mail, Images, HeartHandshake, FileText, ChevronRight
} from 'lucide-react';

interface NavbarProps {
  onOpenPlanner?: () => void;
  onOpenRfq?: () => void;
  activeSection?: string;
  setActiveSection?: (s: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPlanner,
  onOpenRfq,
  activeSection = 'home',
  setActiveSection,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'studio', label: 'Inventory Studio' },
    { id: 'builder', label: 'AI Generator', badge: 'AI' },
    { id: 'packages', label: 'Packages' },
    { id: 'invitations', label: 'Invitations' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
  ];

  const handleNavClick = (id: string) => {
    if (setActiveSection) {
      setActiveSection(id);
    }
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 95;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-fs-navy-dark/95 backdrop-blur-md shadow-2xl border-b border-fs-gold/25 py-1.5 sm:py-2'
          : 'bg-fs-navy/90 backdrop-blur-md border-b border-fs-gold/20 py-2 sm:py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        {/* Main Desktop & Tablet Row */}
        <div className="flex items-center justify-between gap-2 lg:gap-4">
          {/* 1. Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none group flex-shrink-0"
            aria-label="Four Seasons"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-fs-gold-light via-fs-gold to-fs-gold-dark flex items-center justify-center shadow-md shadow-fs-gold/25 border border-fs-gold-light/40 group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="font-serif font-bold text-lg sm:text-xl text-fs-navy tracking-tight">4S</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm sm:text-base lg:text-lg tracking-wider text-white whitespace-nowrap">
                  FOUR SEASONS
                </span>
              </div>
              <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.18em] text-fs-gold-light/80 font-medium uppercase truncate hidden min-[360px]:block">
                Luxury Events Atelier
              </span>
            </div>
          </button>

          {/* 2. Desktop & Tablet Inline Menu Capsule (Visible on md & above) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center bg-fs-navy-dark/80 border border-fs-gold/20 rounded-full px-2 py-1 shadow-inner backdrop-blur-sm gap-0.5 lg:gap-1 flex-shrink-0"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2.5 lg:px-3 py-1 rounded-full text-[11px] lg:text-[12.5px] font-medium transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
                    isActive
                      ? 'bg-fs-gold text-fs-navy font-bold shadow-sm shadow-fs-gold/30 scale-[1.02]'
                      : 'text-fs-cream/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[8px] font-bold px-1 py-0.2 rounded-full uppercase ${
                        isActive
                          ? 'bg-fs-navy text-fs-gold'
                          : 'bg-fs-gold text-fs-navy'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Plan with AI button */}
            <button
              onClick={onOpenPlanner}
              className="gold-gradient-btn px-2.5 sm:px-3.5 py-1.5 sm:py-1.8 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md shadow-fs-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-fs-navy flex-shrink-0 animate-pulse" />
              <span className="hidden min-[420px]:inline">Plan with AI</span>
              <span className="min-[420px]:hidden">AI</span>
            </button>

            {/* Get Quote button */}
            <button
              onClick={onOpenRfq}
              className="px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border border-fs-gold/40 text-fs-gold-light hover:bg-fs-gold/10 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <FileText className="w-3 h-3 text-fs-gold flex-shrink-0" />
              <span className="hidden sm:inline">Get Quote</span>
            </button>

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin"
              className="p-1.5 sm:p-2 rounded-xl text-fs-cream/70 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
              title="Admin Operations Suite"
              aria-label="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fs-gold" />
            </Link>
          </div>
        </div>

        {/* 4. Mobile Inline Menu Ribbon (Always visible in Header on < md screens!) */}
        <div className="md:hidden pt-2 pb-0.5">
          <nav
            aria-label="Mobile Navigation"
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-0.5 py-1 border-t border-fs-gold/15"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 flex-shrink-0 flex items-center gap-1 whitespace-nowrap border ${
                    isActive
                      ? 'bg-fs-gold text-fs-navy font-bold border-fs-gold shadow-sm shadow-fs-gold/30'
                      : 'bg-white/5 text-fs-cream/80 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[8px] font-bold px-1 py-0.2 rounded-full uppercase ${
                        isActive ? 'bg-fs-navy text-fs-gold' : 'bg-fs-gold text-fs-navy'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
