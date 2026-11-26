'use client';

import React from 'react';
import { X, Printer, Share2, CheckCircle2, Phone, Mail, Calendar, Users, MapPin, Sparkles } from 'lucide-react';

export interface BrandedPlanData {
  referenceNo?: string;
  clientName: string;
  eventType: string;
  communityOrFormat?: string;
  eventDate?: string;
  guestsCount?: number | string;
  location?: string;
  theme?: string;
  paletteColors?: { name: string; hex: string }[];
  chosenItems?: { category: string; name: string; priceRange?: string }[];
  pictureUrl?: string;
  isVerified?: boolean;
  budgetRange?: string;
  pricingBreakdown?: {
    subtotal: number;
    transportFee: number;
    installationFee: number;
    vatAmount: number;
    grandTotal: number;
  };
  notes?: string;
}

interface BrandedPlanPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BrandedPlanData | null;
}

export const BrandedPlanPdfModal: React.FC<BrandedPlanPdfModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  if (!isOpen || !plan) return null;

  const palette = plan.paletteColors || [
    { name: 'Warm Ivory', hex: '#FAF8F5' },
    { name: 'Cashmere Beige', hex: '#E8E0D2' },
    { name: 'Champagne Gold', hex: '#B38E36' },
  ];

  const items = plan.chosenItems?.length
    ? plan.chosenItems
    : [
        { category: 'Stage / Mandap', name: 'Royal Red Naomi Rose Grand Mandap (6m × 4.5m)', priceRange: 'AED 28,000 – 35,000' },
        { category: 'Seating', name: 'Gold Chiavari & Royal Velvet Majlis Lounge', priceRange: 'AED 12,000 – 18,000' },
        { category: 'Tables & Florals', name: 'Spherical Dutch Rose Table Centrepieces', priceRange: 'AED 9,000 – 14,000' },
        { category: 'Lighting', name: 'Wireless Astera AX5 Architectural Pin-Spotting', priceRange: 'AED 8,000 – 12,000' },
      ];

  const handlePrintPdf = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const msg = `Hello! Here is my Four Seasons Event Plan (${plan.referenceNo || 'FS-PLAN'}): ${plan.eventType} for ${plan.guestsCount || 300} guests in ${plan.theme || 'Floral Majesty'} theme.`;
    window.open(`https://wa.me/971508821900?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-white border border-[#E8E0D2] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Action Bar (hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#FAF8F5] border-b border-[#E8E0D2] print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B38E36]" />
            <span className="text-xs font-bold text-[#1E1A16] uppercase tracking-wider">
              Branded Portrait A4 Event Plan PDF
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handlePrintPdf}
              className="gold-gradient-btn px-4 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#E8E0D2] text-[#786F62] hover:text-[#1E1A16]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Portrait A4 Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-[#1E1A16] space-y-6 print:p-6">
          {/* 1. Cover Header */}
          <div className="flex items-start justify-between border-b-2 border-[#B38E36] pb-5">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#B38E36] uppercase block">
                Four Seasons Events · Your Event Plan
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1A16] mt-1">
                Prepared for {plan.clientName || 'Valued Guest'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#474036] mt-2">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#B38E36]" />
                  {plan.eventType} {plan.communityOrFormat ? `· ${plan.communityOrFormat}` : ''}
                </span>
                <span>•</span>
                <span>{plan.eventDate || 'Date Flexible'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#B38E36]" />
                  {plan.guestsCount || 300} Guests
                </span>
                {plan.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B38E36]" />
                      {plan.location}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8F6E22] flex items-center justify-center font-serif font-bold text-white text-xl ml-auto shadow-sm">
                4S
              </div>
              {plan.referenceNo && (
                <span className="font-mono text-[10px] text-[#785E1A] font-bold block mt-1.5">
                  REF: {plan.referenceNo}
                </span>
              )}
            </div>
          </div>

          {/* 2. Their Concept Picture (With Watermark Rule) */}
          <div className="space-y-2">
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#E8E0D2] bg-[#FAF8F5]">
              <img
                src={plan.pictureUrl || '/reference_assets/hero_mandap_red.jpg'}
                alt="Event Concept Visualization"
                className="w-full h-full object-cover"
              />
              {!plan.isVerified && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-white/35 font-serif text-3xl sm:text-4xl font-bold tracking-[0.35em] -rotate-12 uppercase drop-shadow">
                    FOUR SEASONS
                  </span>
                </div>
              )}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/95 border border-[#E2D4B7] text-[10px] font-bold text-[#785E1A] uppercase">
                {plan.isVerified ? 'Verified Clean Concept Visual' : 'AI Visual · Your Selection'}
              </div>
            </div>
            <p className="text-[10px] text-[#786F62] italic text-center">
              An illustration of the style and combination you chose. It is not a photograph of a finished venue. All dimensions and pricing are indicative and subject to venue survey &amp; confirmation.
            </p>
          </div>

          {/* 3. Theme & Palette Swatches */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E0D2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38E36] block">
                Theme &amp; Colour Palette
              </span>
              <span className="font-serif text-lg font-bold text-[#1E1A16]">
                {plan.theme || 'Floral Majesty'}
              </span>
              {plan.budgetRange && (
                <span className="text-xs text-[#474036] block mt-0.5">
                  Indicative Investment Tier: <strong>{plan.budgetRange}</strong>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {palette.map((c, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#E8E0D2]">
                  <span
                    className="w-4 h-4 rounded-full border border-[#DDD5C7]"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] font-semibold text-[#474036]">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Chosen Inventory Items Table */}
          <div>
            <h3 className="font-serif text-base font-bold text-[#1E1A16] mb-2.5">
              Chosen Atelier Inventory &amp; Production Elements
            </h3>
            <div className="rounded-2xl border border-[#E8E0D2] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5EFE6] text-[#474036] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Selected Item</th>
                    <th className="py-2.5 px-4 text-right">Indicative Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D2]">
                  {items.map((item, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="py-2.5 px-4 font-semibold text-[#785E1A]">{item.category}</td>
                      <td className="py-2.5 px-4 font-medium text-[#1E1A16]">{item.name}</td>
                      <td className="py-2.5 px-4 text-right text-[#474036]">
                        {item.priceRange || 'Included in Tier'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Pricing Breakdown (if calculated from Studio) */}
          {plan.pricingBreakdown && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E0D2] text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38E36] block">
                Indicative Estimate Breakdown (Valid 14 Days)
              </span>
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <strong>AED {plan.pricingBreakdown.subtotal.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Transport &amp; Logistics Delivery</span>
                <strong>AED {plan.pricingBreakdown.transportFee.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Installation, Dismantling &amp; Manpower (12%)</span>
                <strong>AED {plan.pricingBreakdown.installationFee.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>UAE VAT (5%)</span>
                <strong>AED {plan.pricingBreakdown.vatAmount.toLocaleString()}</strong>
              </div>
              <div className="pt-2 border-t border-[#E8E0D2] flex justify-between text-sm font-bold text-[#1E1A16]">
                <span>Indicative Grand Total</span>
                <span>AED {plan.pricingBreakdown.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* 6. How We Work */}
          <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E8E0D2] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#785E1A] block">
              How Four Seasons Delivers Your Event
            </span>
            <p className="text-xs text-[#474036] leading-relaxed">
              Every structural mandap, stage, floral installation and lighting rig shown in this plan comes directly from our in-house atelier inventory. Once you confirm a consultation, our production director conducts a technical venue survey, locks your event date to prevent double-booking, and issues a final itemised commercial quotation.
            </p>
          </div>

          {/* 6. What Happens Next Footer */}
          <div className="pt-4 border-t border-[#E8E0D2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#1E1A16] block">What Happens Next?</span>
              <span className="text-[#474036] block">
                Reply on WhatsApp or call our concierge to confirm your consultation &amp; venue survey.
              </span>
            </div>
            <div className="flex flex-col sm:items-end text-[11px] text-[#785E1A] font-semibold">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> +971 50 882 1900 / +971 4 398 2211
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> concierge@fourseasons.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

