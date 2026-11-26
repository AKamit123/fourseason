'use client';

import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface AcrylicFloralArchCardProps {
  coupleNames: string;
  eventName: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  customMessage?: string;
  rsvpContact?: string;
  fontFamily?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundImage?: string;
  compact?: boolean;
  children?: React.ReactNode;
}

const isLightColor = (hex?: string) => {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
};

export const AcrylicFloralArchCard: React.FC<AcrylicFloralArchCardProps> = ({
  coupleNames,
  eventName,
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  customMessage,
  rsvpContact,
  fontFamily = 'Playfair Display',
  primaryColor = '#FAF6F0',
  secondaryColor = '#C8A24B',
  backgroundImage = '/reference_assets/luxury_mandap_twilight.jpg',
  compact = false,
  children,
}) => {
  const light = isLightColor(primaryColor);
  const textMain = light ? '#2B2118' : '#FFFFFF';
  const textMuted = light ? 'rgba(43,33,24,0.74)' : 'rgba(255,255,255,0.82)';

  return (
    <div className="relative w-full mx-auto">
      {/* Soft Sunlit Garden Backdrop Glow */}
      <div
        className="absolute -inset-3 rounded-t-[200px] rounded-b-[40px] opacity-35 blur-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 25%, ${secondaryColor}55, #F7DCE0 45%, transparent 75%)`,
        }}
      />

      {/* Frosted Acrylic Arch Plate */}
      <div
        className={`relative overflow-hidden rounded-t-[180px] rounded-b-[28px] border-2 shadow-[0_24px_60px_-15px_rgba(88,68,42,0.28)] backdrop-blur-xl transition-all duration-500 ${
          compact ? 'px-5 pt-14 pb-6' : 'px-7 sm:px-10 pt-20 pb-10'
        }`}
        style={{
          backgroundColor: light ? 'rgba(255, 252, 248, 0.84)' : `${primaryColor}E6`,
          borderColor: light ? 'rgba(255,255,255,0.92)' : `${secondaryColor}70`,
          color: textMain,
          fontFamily,
        }}
      >
        {/* Subtle Acrylic Specular Sheen & Background Texture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12] mix-blend-multiply pointer-events-none"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/15 pointer-events-none" />

        {/* Delicate Inner Gold Hairline Arch */}
        <div
          className="absolute inset-3 rounded-t-[166px] rounded-b-[20px] border pointer-events-none"
          style={{ borderColor: `${secondaryColor}66` }}
        />

        {/* Dainty Watercolor Botanical Floral Arch SVG (Top Curve) */}
        <svg
          viewBox="0 0 400 175"
          className="absolute top-0 left-0 w-full h-auto pointer-events-none select-none opacity-95"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="blushRose" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF5F6" />
              <stop offset="55%" stopColor="#F4B8C1" />
              <stop offset="100%" stopColor="#D98392" />
            </radialGradient>
            <radialGradient id="ivoryPeony" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F9ECDC" />
              <stop offset="100%" stopColor="#E4C8A8" />
            </radialGradient>
          </defs>
          {/* Eucalyptus & Sage Vines */}
          <path d="M22,165 Q45,55 200,26 Q355,55 378,165" fill="none" stroke="#7A9A7E" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
          <path d="M35,142 Q75,65 160,40" fill="none" stroke="#93B095" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
          <path d="M365,142 Q325,65 240,40" fill="none" stroke="#93B095" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
          {/* Left Botanical Leaves */}
          <ellipse cx="42" cy="118" rx="12" ry="6" transform="rotate(-35 42 118)" fill="#8EAD90" opacity="0.85" />
          <ellipse cx="64" cy="84" rx="13" ry="6.5" transform="rotate(-25 64 84)" fill="#78997B" opacity="0.8" />
          <ellipse cx="98" cy="54" rx="12" ry="6" transform="rotate(-12 98 54)" fill="#A1BE9E" opacity="0.85" />
          {/* Right Botanical Leaves */}
          <ellipse cx="358" cy="118" rx="12" ry="6" transform="rotate(35 358 118)" fill="#8EAD90" opacity="0.85" />
          <ellipse cx="336" cy="84" rx="13" ry="6.5" transform="rotate(25 336 84)" fill="#78997B" opacity="0.8" />
          <ellipse cx="302" cy="54" rx="12" ry="6" transform="rotate(12 302 54)" fill="#A1BE9E" opacity="0.85" />
          {/* Gold Botanical Sprigs */}
          <path d="M125,38 Q155,22 185,26" fill="none" stroke={secondaryColor} strokeWidth="1.4" opacity="0.85" />
          <path d="M275,38 Q245,22 215,26" fill="none" stroke={secondaryColor} strokeWidth="1.4" opacity="0.85" />
          {/* Dainty Peonies & Blush Roses */}
          <circle cx="52" cy="100" r="14" fill="url(#blushRose)" />
          <circle cx="76" cy="70" r="17" fill="url(#ivoryPeony)" />
          <circle cx="114" cy="46" r="13" fill="url(#blushRose)" />
          <circle cx="200" cy="24" r="16" fill="url(#ivoryPeony)" />
          <circle cx="182" cy="29" r="10" fill="url(#blushRose)" />
          <circle cx="218" cy="29" r="10" fill="url(#blushRose)" />
          <circle cx="286" cy="46" r="13" fill="url(#blushRose)" />
          <circle cx="324" cy="70" r="17" fill="url(#ivoryPeony)" />
          <circle cx="348" cy="100" r="14" fill="url(#blushRose)" />
          {/* Gold Berry Accents */}
          <circle cx="145" cy="34" r="3" fill={secondaryColor} />
          <circle cx="158" cy="29" r="2.2" fill={secondaryColor} />
          <circle cx="255" cy="34" r="3" fill={secondaryColor} />
          <circle cx="242" cy="29" r="2.2" fill={secondaryColor} />
        </svg>

        {/* Invitation Content */}
        <div className="relative z-10 text-center space-y-4">
          <div className="space-y-1">
            <span
              className="text-[9px] tracking-[0.32em] uppercase block font-sans font-bold"
              style={{ color: secondaryColor }}
            >
              FOUR SEASONS ATELIER
            </span>
            {customMessage && (
              <p
                className={`${compact ? 'text-[10px]' : 'text-xs sm:text-sm'} font-sans italic px-2 leading-relaxed`}
                style={{ color: textMuted }}
              >
                &ldquo;{customMessage}&rdquo;
              </p>
            )}
          </div>

          <div className={compact ? 'py-2 space-y-1.5' : 'py-4 space-y-2.5'}>
            <span
              className="text-[10px] tracking-[0.22em] uppercase block font-sans font-semibold"
              style={{ color: secondaryColor }}
            >
              Together With Their Families
            </span>
            <h2
              className={`${compact ? 'text-2xl' : 'text-3xl sm:text-5xl'} font-script leading-tight`}
              style={{ color: textMain }}
            >
              {coupleNames}
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="w-8 h-[1px]" style={{ backgroundColor: secondaryColor }} />
              <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: secondaryColor }} />
              <span className="w-8 h-[1px]" style={{ backgroundColor: secondaryColor }} />
            </div>
            <p
              className={`${compact ? 'text-xs' : 'text-base sm:text-lg'} font-serif font-semibold tracking-wide pt-1`}
              style={{ color: textMain }}
            >
              {eventName}
            </p>
          </div>

          {/* Date, Time & Venue Pill */}
          <div
            className={`rounded-2xl border px-4 py-3 font-sans space-y-1.5 ${compact ? 'text-[10px]' : 'text-xs sm:text-sm max-w-md mx-auto'}`}
            style={{
              backgroundColor: light ? 'rgba(255,255,255,0.68)' : 'rgba(0,0,0,0.22)',
              borderColor: `${secondaryColor}45`,
            }}
          >
            <div className="flex items-center justify-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: secondaryColor }} />
              <span>{eventDate || 'TBA'} · {eventTime || 'Evening'}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5" style={{ color: textMuted }}>
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: secondaryColor }} />
              <span className="line-clamp-1">{venueName}{venueAddress ? `, ${venueAddress}` : ''}</span>
            </div>
          </div>

          {rsvpContact && (
            <p className="text-[10px] font-sans pt-1" style={{ color: textMuted }}>
              RSVP &amp; Concierge: {rsvpContact}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

