'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User, Mail, Lock, Phone, LogOut, Sparkles, CheckCircle2,
  KeyRound, FileText, ArrowRight, ShieldCheck
} from 'lucide-react';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BrandedPlanPdfModal } from '@/components/BrandedPlanPdfModal';

export default function CustomerPortalPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [user, setUser] = useState<any | null>(null);
  const [plans, setPlans] = useState<{ inquiries: any[]; bookings: any[] }>({ inquiries: [], bookings: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedPdfPlan, setSelectedPdfPlan] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('fs_client_token');
    const uStr = localStorage.getItem('fs_client_user');
    if (token && uStr) {
      try {
        setUser(JSON.parse(uStr));
        loadCustomerPlans(token);
      } catch (_) {}
    }
  }, []);

  const loadCustomerPlans = async (tokenOverride?: string) => {
    try {
      const token = tokenOverride || localStorage.getItem('fs_client_token');
      if (!token) return;
      // Temporarily attach client token for isolated fetch
      const prevAdmin = localStorage.getItem('fs_auth_token');
      localStorage.setItem('fs_auth_token', token);
      const res = await api.getMyPlans().catch(() => ({ inquiries: [], bookings: [] }));
      if (prevAdmin) localStorage.setItem('fs_auth_token', prevAdmin);
      else localStorage.removeItem('fs_auth_token');
      setPlans({
        inquiries: res?.inquiries || [],
        bookings: res?.bookings || [],
      });
    } catch (_) {}
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.login({ email, password });
      localStorage.setItem('fs_client_token', res.accessToken);
      localStorage.setItem('fs_client_user', JSON.stringify(res.user));
      setUser(res.user);
      await loadCustomerPlans(res.accessToken);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.register({ name, email, phone, password });
      localStorage.setItem('fs_client_token', res.accessToken);
      localStorage.setItem('fs_client_user', JSON.stringify(res.user));
      setUser(res.user);
      await loadCustomerPlans(res.accessToken);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.forgotPassword(email);
      setInfoMsg(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setMode('reset');
      }
    } catch (err: any) {
      setError(err.message || 'Could not process reset request');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.resetPassword(resetToken, newPassword);
      setInfoMsg(res.message);
      setMode('login');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired reset token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fs_client_token');
    localStorage.removeItem('fs_client_user');
    setUser(null);
    setPlans({ inquiries: [], bookings: [] });
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1E1A16] flex flex-col">
      <Navbar />

      <div className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {user ? (
          /* Authenticated Client Portal View (Data Isolated) */
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#B38E36] text-white font-serif font-bold text-xl flex items-center justify-center shadow-sm">
                  {(user.name || 'G')[0]}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B38E36] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Private Client Portal (Data Isolated)
                  </span>
                  <h1 className="font-serif text-2xl font-bold text-[#1E1A16]">
                    Welcome, {user.name}
                  </h1>
                  <p className="text-xs text-[#786F62]">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/studio"
                  className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Studio</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-[#F5EFE6] border border-[#DDD5C7] text-xs font-bold text-[#474036] hover:bg-rose-50 hover:text-rose-700 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Saved Plans / Inquiries */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#1E1A16]">
                Your Saved Event Plans &amp; Proposals ({plans.inquiries.length})
              </h2>
              {plans.inquiries.length === 0 ? (
                <div className="py-10 text-center space-y-3 bg-[#FAF8F5] rounded-2xl border border-[#E8E0D2]">
                  <p className="text-xs text-[#474036]">
                    No saved plans linked to <strong>{user.email}</strong> yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#785E1A] hover:underline"
                  >
                    Start Planning Your Event <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.inquiries.map((inq) => (
                    <div key={inq.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E0D2] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#785E1A]">{inq.referenceNo}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                          {inq.status}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#1E1A16]">
                          {inq.eventType || 'Wedding Celebration'}
                        </h3>
                        <p className="text-xs text-[#474036]">
                          {inq.guestsCount || 300} Guests · {inq.budgetRange || 'Custom Tier'}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPdfPlan({
                          referenceNo: inq.referenceNo,
                          clientName: user.name,
                          eventType: inq.eventType,
                          eventDate: inq.eventDate ? new Date(inq.eventDate).toLocaleDateString() : 'Flexible',
                          guestsCount: inq.guestsCount,
                          budgetRange: inq.budgetRange,
                          theme: inq.requirements?.preferredTheme || 'Floral Majesty',
                          isVerified: true,
                        })}
                        className="w-full py-2 rounded-xl bg-white border border-[#B38E36] text-[#785E1A] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#F6EED8]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Branded PDF Plan</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Guest -> Registered Auth Box */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#E8E0D2] shadow-xl space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#B38E36] text-white font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-md">
                4S
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#1E1A16]">
                {mode === 'login' && 'Client Portal Sign In'}
                {mode === 'register' && 'Create Client Account'}
                {mode === 'forgot' && 'Forgot Password'}
                {mode === 'reset' && 'Reset Password'}
              </h1>
              <p className="text-xs text-[#786F62]">
                Access your saved event plans, AI previews &amp; branded PDFs
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                {error}
              </div>
            )}
            {infoMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center">
                {infoMsg}
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#474036] block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#474036] block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-gradient-btn w-full py-3 rounded-xl font-bold text-sm text-white"
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
                <div className="flex justify-between text-xs pt-1">
                  <button type="button" onClick={() => setMode('forgot')} className="text-[#785E1A] hover:underline">
                    Forgot password?
                  </button>
                  <button type="button" onClick={() => setMode('register')} className="font-bold text-[#1E1A16] hover:underline">
                    Create account →
                  </button>
                </div>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-sm"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-sm"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="WhatsApp / Mobile (+971 50 ...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-sm"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 characters)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-gradient-btn w-full py-3 rounded-xl font-bold text-sm text-white"
                >
                  {loading ? 'Creating Account…' : 'Create Client Account'}
                </button>
                <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs text-[#785E1A] hover:underline">
                  Already have an account? Sign In
                </button>
              </form>
            )}

            {mode === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-gradient-btn w-full py-3 rounded-xl font-bold text-sm text-white"
                >
                  {loading ? 'Generating Reset Token…' : 'Send Reset Token'}
                </button>
                <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs text-[#785E1A] hover:underline">
                  ← Back to Sign In
                </button>
              </form>
            )}

            {mode === 'reset' && (
              <form onSubmit={handleReset} className="space-y-4">
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Reset Token"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-xs font-mono"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 6 characters)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-gradient-btn w-full py-3 rounded-xl font-bold text-sm text-white"
                >
                  {loading ? 'Updating Password…' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <Footer />

      <BrandedPlanPdfModal
        isOpen={!!selectedPdfPlan}
        onClose={() => setSelectedPdfPlan(null)}
        plan={selectedPdfPlan}
      />
    </main>
  );
}

