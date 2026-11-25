import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Sparkles, MessageCircle, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#EDE6D9] border-t border-[#DDD5C7] text-[#474036] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Heritage */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#B38E36] to-[#8F6E22] flex items-center justify-center shadow-md text-white font-serif font-bold text-xl">
                4S
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#1E1A16] block">FOUR SEASONS</span>
                <span className="text-[9px] tracking-[0.2em] text-[#785E1A] block uppercase font-bold">Events Atelier</span>
              </div>
            </div>
            <p className="text-xs text-[#474036] leading-relaxed">
              Premier luxury celebration atelier. Crafting bespoke Indian, Arabic, and destination weddings with photorealistic AI pre-visualization and architectural precision.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#785E1A] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Excellence in Bespoke Celebrations
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-[#1E1A16] text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B38E36]" />
              AI Creative Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#planner" className="text-[#5C5346] hover:text-[#B38E36] transition-colors">AI Wedding Planner Wizard</a></li>
              <li><a href="#studio" className="text-[#5C5346] hover:text-[#B38E36] transition-colors">Dynamic Rental Inventory</a></li>
              <li><a href="#builder" className="text-[#5C5346] hover:text-[#B38E36] transition-colors">AI Combination Image & Video Studio</a></li>
              <li><a href="#invitations" className="text-[#5C5346] hover:text-[#B38E36] transition-colors">Dynamic Digital Invitations</a></li>
              <li><a href="#packages" className="text-[#5C5346] hover:text-[#B38E36] transition-colors">Curated Luxury Packages</a></li>
              <li><a href="#portfolio" className="text-[#5C5346] hover:text-[#B38E36] transition-colors">Real Celebrations</a></li>
            </ul>
          </div>

          {/* Col 3: Inventory Specialties */}
          <div>
            <h4 className="font-serif font-bold text-[#1E1A16] text-base mb-4">Inventory Collections</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-[#785E1A] font-bold">Mandaps:</span> Royal Red Naomi, Grecian Haldi, Beach Pavilion</li>
              <li><span className="text-[#785E1A] font-bold">Stages:</span> 7.3m Curved Wave Screen, Gold Mirror Reflection</li>
              <li><span className="text-[#785E1A] font-bold">Designer Bars:</span> Mediterranean Blue Tile, Versace Gold Medallion</li>
              <li><span className="text-[#785E1A] font-bold">Photobooths:</span> Arabic Heritage Carpet, Neon Foliage</li>
              <li><span className="text-[#785E1A] font-bold">Swings (Jhoola):</span> Magenta & Teal Silk Royal Canopy</li>
              <li><span className="text-[#785E1A] font-bold">Special Effects:</span> Cold Sparkular Fountains, Low Fog Clouds</li>
            </ul>
          </div>

          {/* Col 4: Atelier Concierge */}
          <div>
            <h4 className="font-serif font-bold text-[#1E1A16] text-base mb-4">Atelier Concierge</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B38E36] flex-shrink-0 mt-0.5" />
                <span>Four Seasons Atelier, Central Design District</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B38E36] flex-shrink-0" />
                <span>+971 4 398 2211 / +971 50 882 1900</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B38E36] flex-shrink-0" />
                <span>concierge@fourseasons.com</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/971508821900?text=Hello%20Four%20Seasons%2C%20I%20would%20like%20to%20plan%20a%20luxury%20event."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors text-xs font-semibold shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat on WhatsApp Business
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#DDD5C7] flex flex-col sm:flex-row items-center justify-between text-xs text-[#786F62] gap-4">
          <p>© Four Seasons Events Organizers LLC. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-[#785E1A] font-semibold hover:underline flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
            <span className="text-[#DDD5C7]">|</span>
            <span>Enterprise AI Engine v2.4</span>
            <span className="text-[#DDD5C7]">|</span>
            <span>Zoho CRM & Meta Cloud API Integrated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
