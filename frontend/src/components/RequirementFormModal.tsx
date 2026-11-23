'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, FileText, Send, Calendar, DollarSign, Users, Sparkles, Phone, Mail, Building } from 'lucide-react';
import { api } from '@/lib/api';

interface RequirementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const RequirementFormModal: React.FC<RequirementFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [eventType, setEventType] = useState(initialData?.occasion || 'Wedding');
  const [eventDate, setEventDate] = useState(initialData?.eventDate || '');
  const [guestsCount, setGuestsCount] = useState(initialData?.guests || 300);
  const [budgetRange, setBudgetRange] = useState(initialData?.budget ? `AED ${initialData.budget.toLocaleString()}` : 'AED 150,000–250,000');
  const [preferredTheme, setPreferredTheme] = useState(initialData?.theme || 'Red Bloom');
  const [specialInstructions, setSpecialInstructions] = useState(initialData?.specialInstructions || '');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please provide your name, email, and contact number.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await api.submitInquiry({
        name,
        email,
        phone,
        company,
        eventType,
        eventDate: eventDate || undefined,
        guestsCount: Number(guestsCount),
        budgetRange,
        preferredTheme,
        specialInstructions,
        serviceRequirements: ['Turnkey Wedding Production', 'AI Concept Pre-visualization'],
        inventoryPreferences: initialData?.cartItems ? initialData.cartItems.map((i: any) => i.id) : [],
      });

      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit requirements. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-fs-navy-surface border border-fs-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-fs-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fs-gold flex items-center justify-center font-serif font-bold text-fs-navy text-lg shadow-lg">
              4S
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-white block">
                Atelier Requirement Gathering
              </span>
              <span className="text-[10px] text-fs-gold-lighter tracking-widest uppercase block">
                Official Quotation &amp; Zoho CRM Lead Generation
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-fs-cream/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-6">
          {result ? (
            /* Success confirmation with unique reference number */
            <div className="py-8 text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-white">
                  Inquiry Received with Privilege
                </h3>
                <p className="text-xs text-fs-cream/80 max-w-md mx-auto">
                  Your requirements have been securely registered in MySQL and synchronized with Zoho CRM. An automated confirmation has been dispatched.
                </p>
              </div>

              {/* Unique Reference Number Badge */}
              <div className="glass-gold rounded-2xl p-6 max-w-sm mx-auto border border-fs-gold/40 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-fs-gold block">
                  Official Reference Number
                </span>
                <span className="font-mono text-2xl font-bold text-white tracking-wider block">
                  {result.referenceNo}
                </span>
                <span className="text-[11px] text-fs-cream/60 block pt-1">
                  Keep this reference for concierge inquiries
                </span>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="gold-gradient-btn px-8 py-3 rounded-xl font-bold text-sm"
                >
                  Return to Atelier
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Nair"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya.nair@example.ae"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Contact Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +971 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Company / Family Office (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nair Celebrations"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Occasion / Event
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs focus:outline-none focus:border-fs-gold"
                  >
                    <option value="Wedding">Indian Wedding</option>
                    <option value="Arabic Nikah">Arabic Nikah Banquet</option>
                    <option value="Haldi / Mehendi">Haldi &amp; Mehendi Night</option>
                    <option value="Sangeet Reception">Sangeet Musical Night</option>
                    <option value="Destination Beach">Destination Beach Wedding</option>
                    <option value="Corporate Gala">Corporate Luxury Gala</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs focus:outline-none focus:border-fs-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Guest Count
                  </label>
                  <input
                    type="number"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs focus:outline-none focus:border-fs-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Budget Range
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs focus:outline-none focus:border-fs-gold"
                  >
                    <option value="AED 50,000–75,000">AED 50,000–75,000</option>
                    <option value="AED 75,000–150,000">AED 75,000–150,000</option>
                    <option value="AED 150,000–250,000">AED 150,000–250,000 (Signature)</option>
                    <option value="AED 250,000+">AED 250,000+ (Royal Luxe)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Preferred Aesthetic Theme
                  </label>
                  <select
                    value={preferredTheme}
                    onChange={(e) => setPreferredTheme(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs focus:outline-none focus:border-fs-gold"
                  >
                    <option value="Red Bloom">Red Bloom (Dutch Naomi Roses)</option>
                    <option value="Bling">Bling (Gold Mirrors &amp; Kinetic Stage)</option>
                    <option value="Grecian Haldi">Grecian Haldi (Roman Columns &amp; Citrus)</option>
                    <option value="Floral Majesty">Floral Majesty (Pastel Hydrangeas)</option>
                    <option value="Colourful Mehendi">Colourful Mehendi (Royal Swings)</option>
                    <option value="Boho">Bohemian Sunset Beachfront</option>
                  </select>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                  Special Instructions / Venue Preferences
                </label>
                <textarea
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Venue is Atlantis The Royal ballroom. Need cold sparkular entry at 8:00 PM and floral chandelier over the dance floor."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white placeholder-fs-cream/40 text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="gold-gradient-btn w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl"
                >
                  <Send className="w-4 h-4 text-fs-navy" />
                  <span>{submitting ? 'Registering Requirements…' : 'Submit Requirements & Generate Reference ID'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

