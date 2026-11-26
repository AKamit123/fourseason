'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Shield, FileText } from 'lucide-react';

interface NavbarProps {
  onOpenPlanner?: () => void;
  onOpenRfq?: () => void;
  activeSection?: string;
  setActiveSection?: (s: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPlanner,
  onOpenRfq,
}) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar' | 'ru'>('en');

  const handleLanguageChange = (nextLang: 'en' | 'ar' | 'ru') => {
    setLang(nextLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLang;
      document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    }
    try {
      localStorage.setItem('fs_lang', nextLang);
    } catch (_) {}
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/studio', label: 'Inventory Studio', badge: 'AI' },
    { href: '/packages', label: 'Packages' },
    { href: '/invitations', label: 'Invitations' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/services', label: 'Services' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-md shadow-stone-200/50 border-b border-[#E2D8C6] py-1.5 sm:py-2'
          : 'bg-white/90 backdrop-blur-md border-b border-[#EBE3D5] py-2 sm:py-2.5 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        {/* Main Desktop & Tablet Row */}
        <div className="flex items-center justify-between gap-2 lg:gap-4">
          {/* 1. Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none group flex-shrink-0"
            aria-label="Four Seasons"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#DFBE6F] via-[#B38E36] to-[#8C6A1D] flex items-center justify-center shadow-md shadow-[#B38E36]/25 border border-[#DFBE6F]/40 group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="font-serif font-bold text-lg sm:text-xl text-white tracking-tight">4S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm sm:text-base lg:text-lg tracking-wider text-[#1E1A16] whitespace-nowrap">
                FOUR SEASONS
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.18em] text-[#8F6E22] font-semibold uppercase truncate hidden min-[360px]:block">
                Luxury Events Atelier
              </span>
            </div>
          </Link>

          {/* 2. Desktop & Tablet Inline Menu Capsule */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center bg-[#F5EFE6]/90 border border-[#E2D8C6] rounded-full px-2 py-1 shadow-sm backdrop-blur-sm gap-0.5 lg:gap-1 flex-shrink-0"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 lg:px-3.5 py-1 rounded-full text-[11px] lg:text-[12.5px] font-medium transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#B38E36] text-white font-bold shadow-sm shadow-[#B38E36]/30 scale-[1.02]'
                      : 'text-[#474036] hover:text-[#1E1A16] hover:bg-white/80'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[8px] font-bold px-1 py-0.2 rounded-full uppercase ${
                        isActive
                          ? 'bg-white text-[#B38E36]'
                          : 'bg-[#B38E36] text-white'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={onOpenPlanner}
              className="gold-gradient-btn px-2.5 sm:px-3.5 py-1.5 sm:py-1.8 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#B38E36]/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap text-white"
            >
              <Sparkles className="w-3.5 h-3.5 text-white flex-shrink-0 animate-pulse" />
              <span className="hidden min-[420px]:inline">Plan with AI</span>
              <span className="min-[420px]:hidden">AI</span>
            </button>

            <button
              onClick={onOpenRfq}
              className="px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border border-[#B38E36]/40 text-[#785E1A] bg-[#FAF5E8] hover:bg-[#F3E7CA] transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <FileText className="w-3 h-3 text-[#B38E36] flex-shrink-0" />
              <span className="hidden sm:inline">Get Quote</span>
            </button>

            {/* Language Switcher (EN | AR RTL | RU) */}
            <div className="hidden lg:flex items-center bg-[#F5EFE6] border border-[#E2D8C6] rounded-xl p-0.5 text-[10px] font-bold">
              {(['en', 'ar', 'ru'] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`px-2 py-1 rounded-lg uppercase transition-all ${
                    lang === code
                      ? 'bg-[#B38E36] text-white shadow-xs'
                      : 'text-[#474036] hover:text-[#1E1A16]'
                  }`}
                  title={code === 'ar' ? 'Arabic (RTL)' : code === 'ru' ? 'Russian' : 'English'}
                >
                  {code}
                </button>
              ))}
            </div>

            <Link
              href="/portal"
              className="hidden sm:inline-flex px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border border-[#E2D8C6] text-[#474036] bg-white hover:bg-[#F5EFE6] transition-colors whitespace-nowrap"
            >
              My Plans
            </Link>

            <Link
              href="/admin"
              className="p-1.5 sm:p-2 rounded-xl text-[#786F62] hover:text-[#1E1A16] hover:bg-[#F5EFE6] transition-colors border border-[#E8E0D2]"
              title="Admin Operations Suite"
              aria-label="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B38E36]" />
            </Link>
          </div>
        </div>

        {/* 4. Mobile Inline Menu Ribbon */}
        <div className="md:hidden pt-2 pb-0.5">
          <nav
            aria-label="Mobile Navigation"
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-0.5 py-1 border-t border-[#E8E0D2]"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 flex-shrink-0 flex items-center gap-1 whitespace-nowrap border ${
                    isActive
                      ? 'bg-[#B38E36] text-white font-bold border-[#B38E36] shadow-sm shadow-[#B38E36]/30'
                      : 'bg-white/90 text-[#474036] border-[#E8E0D2] hover:bg-[#F5EFE6] hover:text-[#1E1A16]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[8px] font-bold px-1 py-0.2 rounded-full uppercase ${
                        isActive ? 'bg-white text-[#B38E36]' : 'bg-[#B38E36] text-white'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
