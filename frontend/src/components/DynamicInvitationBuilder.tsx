'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Download, Share2, Check, RefreshCw, Palette, Type, Calendar, MapPin, Users, Heart } from 'lucide-react';
import { api } from '@/lib/api';
import { DEMO_TEMPLATES } from '@/lib/demoData';
import { AcrylicFloralArchCard } from '@/components/AcrylicFloralArchCard';

export const DynamicInvitationBuilder: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Invitation Form Fields
  const [coupleNames, setCoupleNames] = useState('Priya & Rohan');
  const [eventName, setEventName] = useState('The Grand Wedding & Reception');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [eventTime, setEventTime] = useState('6:30 PM Onwards');
  const [venueName, setVenueName] = useState('The Grand St. Regis Ballroom');
  const [venueAddress, setVenueAddress] = useState('The Grand Ballroom Pavilion');
  const [customMessage, setCustomMessage] = useState('Together with their families, we invite you to celebrate our union.');
  const [rsvpContact, setRsvpContact] = useState('+971 4 398 2211 | concierge@fourseasons.com');
  const [fontFamily, setFontFamily] = useState('Playfair Display');
  const [primaryColor, setPrimaryColor] = useState('#FAF6F0');
  const [secondaryColor, setSecondaryColor] = useState('#C8A24B');
  const [bloomRevealed, setBloomRevealed] = useState(true);

  // Share state
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.getTemplates().catch(() => DEMO_TEMPLATES);
      const list = res?.length ? res : DEMO_TEMPLATES;
      setTemplates(list);
      if (list && list.length > 0) {
        setSelectedTemplate(list[0]);
        if (list[0].defaultSettings) {
          const s = list[0].defaultSettings;
          if (s.coupleNames) setCoupleNames(s.coupleNames);
          if (s.eventName) setEventName(s.eventName);
          if (s.eventDate) setEventDate(s.eventDate);
          if (s.eventTime) setEventTime(s.eventTime);
          if (s.venueName) setVenueName(s.venueName);
          if (s.venueAddress) setVenueAddress(s.venueAddress);
          if (s.customMessage) setCustomMessage(s.customMessage);
          if (s.rsvpContact) setRsvpContact(s.rsvpContact);
        }
      }
    } catch (err) {
      console.error('Failed to load invitation templates:', err);
      setTemplates(DEMO_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (t: any) => {
    setSelectedTemplate(t);
    if (t.defaultSettings) {
      const s = t.defaultSettings;
      if (s.coupleNames) setCoupleNames(s.coupleNames);
      if (s.eventName) setEventName(s.eventName);
      if (s.eventDate) setEventDate(s.eventDate);
      if (s.eventTime) setEventTime(s.eventTime);
      if (s.venueName) setVenueName(s.venueName);
      if (s.venueAddress) setVenueAddress(s.venueAddress);
      if (s.customMessage) setCustomMessage(s.customMessage);
      if (s.rsvpContact) setRsvpContact(s.rsvpContact);
      if (s.primaryColor) setPrimaryColor(s.primaryColor);
      if (s.secondaryColor) setSecondaryColor(s.secondaryColor);
    }
  };

  const handleSaveInvitation = async () => {
    try {
      setSaving(true);
      const res = await api.createInvitation({
        templateId: selectedTemplate?.id,
        title: `${coupleNames} — ${eventName}`,
        coupleNames,
        eventName,
        eventDate,
        eventTime,
        venueName,
        venueAddress,
        contactDetails: rsvpContact,
        customMessage,
        fontFamily,
        primaryColor,
        secondaryColor,
      });
      setCreatedSlug(res.shareSlug);
    } catch (err) {
      console.error('Failed to create invitation:', err);
    } finally {
      setSaving(false);
    }
  };

  const shareUrl = createdSlug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${createdSlug}` : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!shareUrl) return;
    const msg = `You are cordially invited to celebrate ${coupleNames} for ${eventName}! View interactive luxury invitation & RSVP here: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="invitations" className="py-24 bg-[#F5EFE6] relative border-t border-[#E8E0D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6EED8] border border-[#E2D4B7] text-[#785E1A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5 text-[#B38E36]" />
            Dynamic Digital Invitation Atelier
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1A16]">
            Bespoke Interactive Invitations
          </h2>
          <p className="text-sm text-[#474036] font-normal mt-3 leading-relaxed">
            Customize typography, regal color palettes, event venues, and personal messages in real-time. Share instantly via WhatsApp with live RSVP tracking.
          </p>
        </div>

        {/* Template Selector Ribbon */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs uppercase font-bold text-[#785E1A] tracking-wider">
              Choose an Invitation Aesthetic:
            </span>
            <span className="text-xs text-[#786F62]">
              {templates.length} Atelier Templates Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate?.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleTemplateSelect(tpl)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all p-2 ${
                    isSelected
                      ? 'border-[#B38E36] bg-[#FDF9F2] shadow-md scale-[1.02]'
                      : 'border-[#E8E0D2] hover:border-[#B38E36]/40 bg-white'
                  }`}
                >
                  <div className="relative h-28 sm:h-36 rounded-xl overflow-hidden mb-2">
                    <img
                      src={tpl.previewImage || '/reference_assets/hero_mandap_red.jpg'}
                      alt={tpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white">
                      {tpl.category}
                    </span>
                  </div>
                  <span className="font-serif font-semibold text-xs sm:text-sm text-[#1E1A16] block truncate">
                    {tpl.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Studio Grid: Form (Left) & Live Canvas (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Customizer Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D2]">
              <h3 className="font-serif text-xl font-bold text-[#1E1A16] flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#B38E36]" />
                Customize Invitation Details
              </h3>
              <span className="text-[11px] text-[#785E1A] bg-[#F6EED8] px-2.5 py-1 rounded-full border border-[#E2D4B7] font-semibold">
                Live Dynamic Sync
              </span>
            </div>

            <div className="space-y-4">
              {/* Couple Names */}
              <div>
                <label className="text-xs font-semibold text-[#474036] block mb-1">
                  Couple / Celebrant Names
                </label>
                <input
                  type="text"
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm focus:outline-none focus:border-[#B38E36] focus:bg-white font-serif"
                />
              </div>

              {/* Event Title */}
              <div>
                <label className="text-xs font-semibold text-[#474036] block mb-1">
                  Event Title &amp; Occasion
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm focus:outline-none focus:border-[#B38E36] focus:bg-white"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#474036] block mb-1">
                    Celebration Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm focus:outline-none focus:border-[#B38E36] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#474036] block mb-1">
                    Ceremony Time
                  </label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm focus:outline-none focus:border-[#B38E36] focus:bg-white"
                  />
                </div>
              </div>

              {/* Venue & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#474036] block mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm focus:outline-none focus:border-[#B38E36] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#474036] block mb-1">
                    Address / City
                  </label>
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm focus:outline-none focus:border-[#B38E36] focus:bg-white"
                  />
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="text-xs font-semibold text-[#474036] block mb-1">
                  Personal Blessing / Invitation Message
                </label>
                <textarea
                  rows={2}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm focus:outline-none focus:border-[#B38E36] focus:bg-white"
                />
              </div>

              {/* RSVP Contact */}
              <div>
                <label className="text-xs font-semibold text-[#474036] block mb-1">
                  RSVP &amp; Concierge Contact
                </label>
                <input
                  type="text"
                  value={rsvpContact}
                  onChange={(e) => setRsvpContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm focus:outline-none focus:border-[#B38E36] focus:bg-white"
                />
              </div>

              {/* Styling: Typography & Accent Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-[#474036] block mb-1 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-[#B38E36]" />
                    Font Family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-sm focus:outline-none focus:border-[#B38E36] focus:bg-white"
                  >
                    <option value="Playfair Display">Playfair Display (Royal Classic)</option>
                    <option value="Georgia">Georgia (Timeless Editorial)</option>
                    <option value="Manrope">Manrope (Modern Architectural)</option>
                    <option value="Pinyon Script">Pinyon Script (Romantic Calligraphy)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#474036] block mb-1 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#B38E36]" />
                    Palette Preset
                  </label>
                  <div className="flex gap-2">
                    {[
                      { name: 'Spring Acrylic', p: '#FAF6F0', s: '#C8A24B' },
                      { name: 'Blush Garden', p: '#FDF2F4', s: '#B77D84' },
                      { name: 'Royal Navy', p: '#0E1B3A', s: '#C8A24B' },
                      { name: 'Crimson Silk', p: '#4A0E17', s: '#E7C977' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setPrimaryColor(preset.p);
                          setSecondaryColor(preset.s);
                        }}
                        className={`flex-1 py-2 rounded-lg border text-[11px] font-medium flex items-center justify-center gap-1.5 ${
                          primaryColor === preset.p
                            ? 'border-[#B38E36] bg-[#F6EED8] text-[#1E1A16] font-bold shadow-sm'
                            : 'border-[#DDD5C7] bg-[#FAF8F5] text-[#474036] hover:bg-[#F3EDE2]'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.s }} />
                        <span className="hidden sm:inline">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Save & Generate Shareable Link */}
            <div className="pt-4 border-t border-[#E8E0D2] flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveInvitation}
                disabled={saving}
                className="gold-gradient-btn flex-1 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg hover:opacity-95"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{saving ? 'Generating Digital Canvas…' : 'Generate & Save Invitation'}</span>
              </button>

              {createdSlug && (
                <>
                  <button
                    onClick={handleCopyLink}
                    className="py-3 px-4 rounded-xl border border-[#B38E36] text-[#785E1A] hover:bg-[#F6EED8] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="py-3 px-4 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Share on WhatsApp</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Live Interactive Acrylic Floral Arch & Blooming Preview (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[380px] flex items-center justify-between mb-3 px-1">
              <span className="text-xs uppercase font-bold text-[#785E1A] tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B38E36]" /> Acrylic Arch Preview
              </span>
              <button
                type="button"
                onClick={() => setBloomRevealed((v) => !v)}
                className="text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-[#E2D4B7] text-[#785E1A] hover:bg-[#F6EED8] transition-colors shadow-sm"
              >
                {bloomRevealed ? 'Test Blooming Seal' : 'Open Invitation'}
              </button>
            </div>

            <div className="relative w-full max-w-[380px] rounded-[36px] p-4 sm:p-5 bg-gradient-to-b from-[#F9F3EB] via-[#F4EAE2] to-[#EFE5D8] border border-[#E2D4B7] shadow-2xl overflow-hidden min-h-[540px] flex items-center justify-center">
              {!bloomRevealed ? (
                <button
                  type="button"
                  onClick={() => setBloomRevealed(true)}
                  className="group relative w-full py-16 px-6 rounded-[28px] bg-white/90 border border-[#E2D4B7] shadow-xl text-center space-y-5 transition-all hover:scale-[1.02]"
                >
                  <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-br from-[#DFBE6F] to-[#9E7822] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B38E36] block">
                      You Are Cordially Invited
                    </span>
                    <h3 className="font-script text-3xl text-[#2B2118]">{coupleNames}</h3>
                    <p className="text-xs text-[#786F62]">{eventName}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full gold-gradient-btn text-white text-xs font-bold shadow-md">
                    <Sparkles className="w-3.5 h-3.5" /> Tap to Bloom Invitation
                  </span>
                </button>
              ) : (
                <AcrylicFloralArchCard
                  coupleNames={coupleNames}
                  eventName={eventName}
                  eventDate={eventDate}
                  eventTime={eventTime}
                  venueName={venueName}
                  venueAddress={venueAddress}
                  customMessage={customMessage}
                  rsvpContact={rsvpContact}
                  fontFamily={fontFamily}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  backgroundImage={selectedTemplate?.previewImage || '/reference_assets/luxury_mandap_twilight.jpg'}
                  compact
                />
              )}
            </div>

            {createdSlug && (
              <div className="mt-4 text-center">
                <a
                  href={`/invite/${createdSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#785E1A] hover:underline font-semibold"
                >
                  Open Full Screen Public Invitation Page →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
