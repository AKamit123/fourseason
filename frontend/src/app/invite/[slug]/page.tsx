'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, CheckCircle2, Clock, Mail, Share2, Heart, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { AcrylicFloralArchCard } from '@/components/AcrylicFloralArchCard';

export default function PublicInvitationPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [invitation, setInvitation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // RSVP Form
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [attending, setAttending] = useState(true);
  const [notes, setNotes] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  useEffect(() => {
    if (slug) {
      loadInvitation(slug);
    }
  }, [slug]);

  const loadInvitation = async (s: string) => {
    try {
      setLoading(true);
      const res = await api.getInvitation(s);
      setInvitation(res);
    } catch (err: any) {
      setError(err.message || 'Invitation not found');
    } finally {
      setLoading(false);
    }
  };

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) return;
    try {
      setSubmittingRsvp(true);
      await api.submitRsvp(slug, {
        guestName,
        guestCount: Number(guestCount),
        attending,
        notes,
      });
      setRsvpSubmitted(true);
    } catch (err: any) {
      alert('Failed to submit RSVP: ' + err.message);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fs-navy flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-fs-gold/30 border-t-fs-gold animate-spin mx-auto" />
          <p className="text-xs text-fs-cream/60 font-serif">Opening Four Seasons Invitation…</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-fs-navy flex items-center justify-center p-4">
        <div className="glass-panel max-w-md w-full p-8 rounded-3xl text-center space-y-4 border border-fs-gold/30">
          <Heart className="w-12 h-12 text-fs-gold mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-white">Invitation Not Found</h2>
          <p className="text-xs text-fs-cream/70">The requested invitation link may have expired or is incorrect.</p>
          <a href="/" className="inline-block gold-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold">
            Visit Four Seasons
          </a>
        </div>
      </div>
    );
  }

  const primary = invitation.primaryColor || '#FAF6F0';
  const secondary = invitation.secondaryColor || '#C8A24B';
  const formattedDate = invitation.eventDate
    ? new Date(invitation.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'TBA';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden bg-gradient-to-b from-[#FAF5EE] via-[#F7ECE6] to-[#FAF5EE]">
      {/* Sunlit Garden Background Ambience */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url('${invitation.template?.previewImage || '/reference_assets/luxury_mandap_twilight.jpg'}')`,
        }}
      />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-200/35 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-200/30 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {!envelopeOpened ? (
          <div className="rounded-[36px] bg-white/90 backdrop-blur-xl border-2 border-[#E2D4B7] p-8 sm:p-12 text-center shadow-2xl space-y-6">
            <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-[#DFBE6F] to-[#9E7822] text-white flex items-center justify-center shadow-xl animate-pulse">
              <Mail className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#B38E36] block">
                Four Seasons Bespoke Invitation
              </span>
              <h1 className="font-script text-4xl sm:text-5xl text-[#2B2118]">
                {invitation.coupleNames}
              </h1>
              <p className="text-sm text-[#474036] font-serif">
                {invitation.eventName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnvelopeOpened(true)}
              className="gold-gradient-btn px-8 py-4 rounded-full text-sm font-bold text-white shadow-xl hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tap to Bloom &amp; Open Invitation</span>
            </button>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <AcrylicFloralArchCard
              coupleNames={invitation.coupleNames}
              eventName={invitation.eventName}
              eventDate={formattedDate}
              eventTime={invitation.eventTime || 'Evening'}
              venueName={invitation.venueName}
              venueAddress={invitation.venueAddress}
              customMessage={invitation.customMessage || 'Together with their families, we request your presence and blessings.'}
              rsvpContact={invitation.contactDetails}
              fontFamily={invitation.fontFamily || 'Playfair Display'}
              primaryColor={primary}
              secondaryColor={secondary}
              backgroundImage={invitation.template?.previewImage || '/reference_assets/luxury_mandap_twilight.jpg'}
            >
              {/* RSVP Form */}
              <div className="pt-5 mt-4 border-t border-[#E2D4B7]/60 font-sans text-left max-w-md mx-auto">
                {rsvpSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-serif text-xl font-bold text-[#1E1A16]">RSVP Received with Gratitude</h4>
                    <p className="text-xs text-[#474036]">Thank you, {guestName}. We look forward to celebrating together!</p>
                  </div>
                ) : (
                  <form onSubmit={handleRsvp} className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-[#E2D4B7] shadow-sm space-y-4 text-[#1E1A16]">
                    <div className="text-center pb-1">
                      <h4 className="font-serif text-lg font-bold text-[#1E1A16]">Confirm Your Attendance</h4>
                      <p className="text-[11px] text-[#786F62]">Kindly RSVP to assist us with guest seating &amp; protocol.</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#474036] block mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq Al Mansoor"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-[#1E1A16] text-xs focus:outline-none focus:border-[#B38E36]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#474036] block mb-1">Total Guests</label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-[#1E1A16] text-xs focus:outline-none focus:border-[#B38E36]"
                        >
                          <option value={1}>1 Guest</option>
                          <option value={2}>2 Guests (Couple)</option>
                          <option value={3}>3 Guests</option>
                          <option value={4}>4 Guests (Family)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#474036] block mb-1">Will You Attend?</label>
                        <select
                          value={attending ? 'yes' : 'no'}
                          onChange={(e) => setAttending(e.target.value === 'yes')}
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-[#1E1A16] text-xs focus:outline-none focus:border-[#B38E36]"
                        >
                          <option value="yes">Joyfully Attend</option>
                          <option value="no">Regretfully Decline</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#474036] block mb-1">Special Dietary / Wishes (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Vegetarian, congratulations!"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-[#1E1A16] text-xs focus:outline-none focus:border-[#B38E36]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingRsvp}
                      className="gold-gradient-btn w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md"
                    >
                      {submittingRsvp ? 'Submitting…' : 'Submit RSVP Confirmation'}
                    </button>
                  </form>
                )}
              </div>
            </AcrylicFloralArchCard>
          </div>
        )}
      </div>
    </div>
  );
}

