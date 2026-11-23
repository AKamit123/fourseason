'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, CheckCircle2, Clock, Mail, Share2, Heart } from 'lucide-react';
import { api } from '@/lib/api';

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

  const primary = invitation.primaryColor || '#0E1B3A';
  const secondary = invitation.secondaryColor || '#C8A24B';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden"
      style={{ backgroundColor: '#070D20' }}
    >
      {/* Background Ambience */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url('${invitation.template?.previewImage || '/reference_assets/hero_mandap_red.jpg'}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-fs-navy-dark/90 to-black/95 pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-xl bg-fs-navy-surface border-2 border-fs-gold/40 rounded-[36px] overflow-hidden shadow-2xl">
        <div
          className="p-8 sm:p-12 text-center space-y-8 relative"
          style={{ backgroundColor: primary, color: '#FFFFFF', fontFamily: invitation.fontFamily || 'Playfair Display' }}
        >
          {/* Header Monogram */}
          <div className="space-y-2">
            <div
              className="w-12 h-12 rounded-full border-2 border-fs-gold mx-auto flex items-center justify-center font-serif font-bold text-lg"
              style={{ color: secondary, borderColor: secondary }}
            >
              4S
            </div>
            <span
              className="text-[10px] tracking-[0.3em] uppercase block font-sans font-bold"
              style={{ color: secondary }}
            >
              FOUR SEASONS EVENTS
            </span>
            <p className="text-xs sm:text-sm text-white/80 font-sans italic max-w-md mx-auto pt-2 leading-relaxed">
              &ldquo;{invitation.customMessage || 'Together with their families, we request your presence and blessings.'}&rdquo;
            </p>
          </div>

          {/* Couple Names */}
          <div className="space-y-3 py-4">
            <span
              className="text-[11px] tracking-widest uppercase block font-sans font-semibold"
              style={{ color: secondary }}
            >
              Cordially Request The Honor Of Your Presence At
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              {invitation.coupleNames}
            </h1>
            <div
              className="w-20 h-1 mx-auto rounded-full"
              style={{ backgroundColor: secondary }}
            />
            <h3 className="font-serif text-lg sm:text-xl text-white/90">
              {invitation.eventName}
            </h3>
          </div>

          {/* Event Itinerary Info */}
          <div className="glass-gold rounded-2xl p-5 border border-fs-gold/30 text-xs sm:text-sm font-sans space-y-3 text-white max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-fs-gold flex-shrink-0" />
              <span className="font-semibold">{invitation.eventDate ? new Date(invitation.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}</span>
              <span>•</span>
              <span>{invitation.eventTime || 'Evening'}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-fs-gold flex-shrink-0" />
              <span>{invitation.venueName}, {invitation.venueAddress}</span>
            </div>
          </div>

          {/* RSVP Form */}
          <div className="pt-4 border-t border-white/10 font-sans text-left max-w-md mx-auto">
            {rsvpSubmitted ? (
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-serif text-xl font-bold text-white">RSVP Received with Gratitude</h4>
                <p className="text-xs text-fs-cream/80">Thank you, {guestName}. We look forward to celebrating together!</p>
              </div>
            ) : (
              <form onSubmit={handleRsvp} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="text-center pb-2">
                  <h4 className="font-serif text-lg font-bold text-white">Confirm Your Attendance</h4>
                  <p className="text-[11px] text-fs-cream/60">Kindly RSVP to assist us with guest seating &amp; protocol.</p>
                </div>

                <div>
                  <label className="text-xs text-fs-cream/80 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al Mansoor"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-fs-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-fs-cream/80 block mb-1">Total Guests</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-fs-gold"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests (Couple)</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests (Family)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-fs-cream/80 block mb-1">Will You Attend?</label>
                    <select
                      value={attending ? 'yes' : 'no'}
                      onChange={(e) => setAttending(e.target.value === 'yes')}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-fs-gold"
                    >
                      <option value="yes">Joyfully Attend</option>
                      <option value="no">Regretfully Decline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-fs-cream/80 block mb-1">Special Dietary / Wishes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian, congratulations!"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-fs-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingRsvp}
                  className="gold-gradient-btn w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  {submittingRsvp ? 'Submitting…' : 'Submit RSVP Confirmation'}
                </button>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-2 text-[10px] text-white/50 font-sans">
            <span>Official Four Seasons Events Atelier</span>
          </div>
        </div>
      </div>
    </div>
  );
}

