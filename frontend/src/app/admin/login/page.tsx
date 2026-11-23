'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@fourseasons.ae');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.login({ email, password });
      if (res.accessToken) {
        localStorage.setItem('fs_auth_token', res.accessToken);
        localStorage.setItem('fs_user', JSON.stringify(res.user));
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fs-navy-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105 pointer-events-none"
        style={{ backgroundImage: "url('/reference_assets/hero_mandap_red.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-fs-navy-dark via-fs-navy/90 to-fs-navy-dark pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-fs-navy-surface border border-fs-gold/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Brand Crest */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fs-gold-light via-fs-gold to-fs-gold-dark flex items-center justify-center mx-auto shadow-xl text-fs-navy font-serif font-bold text-2xl">
            4S
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            FOUR SEASONS
          </h2>
          <span className="text-[10px] tracking-[0.25em] text-fs-gold block uppercase font-medium">
            Enterprise Operations Portal
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fs-cream/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fourseasons.ae"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
              Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fs-cream/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="p-3 rounded-xl bg-fs-gold/10 border border-fs-gold/20 text-[11px] text-fs-gold-lighter space-y-1">
            <span className="font-bold block uppercase tracking-wider">Default Admin Credentials:</span>
            <div className="flex justify-between">
              <span>Email: <strong className="text-white">admin@fourseasons.ae</strong></span>
              <span>Pass: <strong className="text-white">Admin@123</strong></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gold-gradient-btn w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl"
          >
            <span>{loading ? 'Authenticating…' : 'Sign in to Dashboard'}</span>
            <ArrowRight className="w-4 h-4 text-fs-navy" />
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-fs-cream/50 hover:text-fs-gold transition-colors font-medium">
            ← Return to Customer Website
          </a>
        </div>
      </div>
    </div>
  );
}

