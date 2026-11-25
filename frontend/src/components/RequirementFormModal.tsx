'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, FileText, Send, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { BrandedPlanPdfModal } from './BrandedPlanPdfModal';

interface RequirementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'yopmail.com',
  'guerrillamail.com',
  'throwawaymail.com',
];

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
  const [budgetRange, setBudgetRange] = useState(
    initialData?.budget ? `AED ${Number(initialData.budget).toLocaleString()}` : 'AED 150,000–250,000'
  );
  const [preferredTheme, setPreferredTheme] = useState(initialData?.theme || 'Red Bloom');
  const [specialInstructions, setSpecialInstructions] = useState(initialData?.specialInstructions || '');

  // SMS Verification & Consent (PDF 2 Step 9)
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);

  // Submission & PDF state
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phone || phone.trim().length < 7) {
      setError('Please enter a valid WhatsApp / mobile number first.');
      return;
    }
    setError(null);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim().length === 4) {
      setPhoneVerified(true);
      setError(null);
    } else {
      setError('Please enter the 4-digit SMS verification code (demo code: 4816).');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Please provide your name, email, and WhatsApp number.');
      return;
    }

    // Disposable email check (PDF 2 Step 9)
    const domain = email.split('@')[1]?.toLowerCase() || '';
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      setError('Temporary or disposable email addresses are not accepted. Please share an email address you use every day.');
      return;
    }

    if (!consentChecked) {
      setError('Please tick the consent box so our team can send your plan and reach out.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const consentTimestamp = new Date().toISOString();

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
        specialInstructions: `${specialInstructions}${phoneVerified ? ' [SMS Verified]' : ''} [Consent: ${consentTimestamp}]`.trim(),
        serviceRequirements: ['Turnkey Wedding Production', 'AI Concept Pre-visualization'],
        inventoryPreferences: initialData?.cartItems ? initialData.cartItems.map((i: any) => i.id) : [],
      });

      setResult({
        ...res,
        consentTimestamp,
        isVerified: phoneVerified,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit requirements. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-2xl bg-white border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B38E36] flex items-center justify-center font-serif font-bold text-white text-lg shadow-md">
                4S
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-[#1E1A16] block">
                  Save Plan &amp; Request Proposal
                </span>
                <span className="text-[10px] text-[#785E1A] tracking-widest uppercase block font-semibold">
                  Branded A4 PDF · WhatsApp &amp; Email Delivery · SMS Verification
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F3EDE2] text-[#786F62] hover:text-[#1E1A16]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <div className="py-6">
            {result ? (
              /* Success confirmation with unique reference number & Branded PDF CTA */
              <div className="py-6 text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                    Plan Saved &amp; Registered
                  </h3>
                  <p className="text-xs text-[#474036] max-w-md mx-auto leading-relaxed">
                    Your event plan has been saved to our CRM and is ready as a Branded Portrait A4 PDF.
                    {result.isVerified
                      ? ' Your mobile is SMS-verified — your clean unwatermarked visual is unlocked.'
                      : ' Verify your mobile anytime to unlock the clean unwatermarked PDF visual.'}
                  </p>
                </div>

                {/* Unique Reference Number Badge */}
                <div className="bg-[#FAF8F5] rounded-2xl p-6 max-w-sm mx-auto border border-[#E2D4B7] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38E36] block">
                    Official Reference Number
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#1E1A16] tracking-wider block">
                    {result.referenceNo}
                  </span>
                  <span className="text-[11px] text-[#786F62] block pt-1">
                    Keep this reference for concierge &amp; consultation calls
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <button
                    onClick={() => setShowPdfModal(true)}
                    className="gold-gradient-btn px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View &amp; Download Branded PDF</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl border border-[#DDD5C7] text-[#474036] hover:bg-[#F3EDE2] font-semibold text-sm"
                  >
                    Return to Atelier
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* Personal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#474036] block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Riya Mehta"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:border-[#B38E36] focus:bg-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#474036] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. riya.mehta@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:border-[#B38E36] focus:bg-white text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* WhatsApp + SMS OTP Verification (PDF 2 Step 9) */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E0D2] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div>
                      <label className="text-xs font-semibold text-[#474036] block mb-1">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +971 50 123 4567"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setPhoneVerified(false);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:border-[#B38E36] text-xs sm:text-sm focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {phoneVerified ? (
                        <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Number Verified (Clean PDF Unlocked)</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#F6EED8] border border-[#E2D4B7] text-[#785E1A] hover:bg-[#EFE2C0] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{otpSent ? 'Resend SMS Code' : 'Send SMS Verification Code'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {otpSent && !phoneVerified && (
                    <div className="flex items-center gap-2 pt-1 animate-fade-in">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="Enter 4-digit code (e.g. 4816)"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#DDD5C7] text-[#1E1A16] text-xs tracking-widest font-mono focus:outline-none focus:border-[#B38E36]"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-4 py-2 rounded-xl bg-[#B38E36] text-white text-xs font-bold hover:bg-[#8F6E22]"
                      >
                        Verify Code
                      </button>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#474036] block mb-1">
                      Occasion / Event
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-xs focus:outline-none focus:border-[#B38E36]"
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
                    <label className="text-xs font-semibold text-[#474036] block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-xs focus:outline-none focus:border-[#B38E36]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#474036] block mb-1">
                      Guest Count
                    </label>
                    <input
                      type="number"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-xs focus:outline-none focus:border-[#B38E36]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#474036] block mb-1">
                      Indicative Budget Range
                    </label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-xs focus:outline-none focus:border-[#B38E36]"
                    >
                      <option value="AED 50,000–75,000">AED 50,000–75,000</option>
                      <option value="AED 75,000–150,000">AED 75,000–150,000</option>
                      <option value="AED 150,000–250,000">AED 150,000–250,000 (Signature)</option>
                      <option value="AED 250,000+">AED 250,000+ (Royal Luxe)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#474036] block mb-1">
                      Preferred Aesthetic Theme
                    </label>
                    <select
                      value={preferredTheme}
                      onChange={(e) => setPreferredTheme(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-xs focus:outline-none focus:border-[#B38E36]"
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
                  <label className="text-xs font-semibold text-[#474036] block mb-1">
                    Special Instructions / Venue Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Need cold sparkular entry at 8:00 PM and floral chandelier over the dance floor."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] text-xs sm:text-sm focus:outline-none focus:border-[#B38E36]"
                  />
                </div>

                {/* Consent Checkbox (PDF 2 Step 9) */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E0D2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 accent-[#B38E36] w-4 h-4"
                  />
                  <span className="text-[11px] text-[#474036] leading-relaxed">
                    <strong>I agree to be contacted about my plan.</strong> Your plan PDF will be sent to your email and WhatsApp, and your consent is recorded with a timestamp.
                  </span>
                </label>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="gold-gradient-btn w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>{submitting ? 'Saving Plan & Generating PDF…' : 'Send Me My Plan & Branded PDF'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Branded A4 PDF Modal */}
      <BrandedPlanPdfModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        plan={{
          referenceNo: result?.referenceNo,
          clientName: name,
          eventType,
          communityOrFormat: initialData?.style,
          eventDate,
          guestsCount,
          location: initialData?.location || 'Preferred Luxury Venue',
          theme: preferredTheme,
          budgetRange,
          isVerified: phoneVerified,
          chosenItems: initialData?.cartItems?.map((i: any) => ({
            category: i.category?.name || 'Atelier Item',
            name: i.name,
            priceRange: i.price ? `AED ${Number(i.price).toLocaleString()}` : undefined,
          })),
        }}
      />
    </>
  );
};
