'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, Sparkles, X, Send, Bot, Phone,
  ArrowUpRight, ShieldCheck, CheckCircle2, ChevronDown,
  Layers, Compass, User
} from 'lucide-react';
import { api } from '@/lib/api';

interface WhatsAppChatbotWidgetProps {
  onOpenPlanner?: () => void;
  onOpenRfq?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  suggestions?: string[];
  action?: string | null;
  inquiryCreated?: { referenceNo: string } | null;
  time: string;
}

export const WhatsAppChatbotWidget: React.FC<WhatsAppChatbotWidgetProps> = ({
  onOpenPlanner,
  onOpenRfq,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Welcome to **Four Seasons**. I am your AI Atelier Concierge.\n\nI can assist you with:\n• 🏛️ **Real Inventory & Sizes**: 7.3m wave stages, Moorish arch stages, Naomi rose mandaps, Versace bars.\n• 💰 **Packages & Pricing**: Essential (AED 49k), Signature (AED 99k), Luxe (AED 185k).\n• ✨ **4K AI Concepting**: Visualize combinations before booking.\n• 🛡️ **Guaranteed Dates**: Zero double-booking verification.`,
      suggestions: [
        'View Packages & Pricing',
        '7.3m Wave Stage Specs',
        'Plan with AI Concierge',
        'Chat on WhatsApp (+971 50 882 1900)',
      ],
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: (m.sender === 'bot' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: m.text,
      }));

      const res = await api.chatConcierge({
        message: textToSend,
        history,
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.reply || 'Thank you for reaching out to Four Seasons. How else may I assist you?',
        suggestions: res.suggestions || [
          'View Packages',
          '7.3m Wave Stage Specs',
          'Connect on WhatsApp (+971 50 882 1900)',
        ],
        action: res.action,
        inquiryCreated: res.inquiryCreated,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: 'bot',
          text: `Thank you for contacting Four Seasons. You can chat directly with our Senior Event Concierge on WhatsApp at **+971 50 882 1900** or click below!`,
          suggestions: ['Chat on WhatsApp Now', 'View Pricing Packages', 'Open Catalog Studio'],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (sug: string) => {
    if (sug.includes('WhatsApp')) {
      window.open(
        'https://wa.me/971508821900?text=Hello%20Four%20Seasons%2C%20I%20would%20like%20to%20discuss%20decor%20and%20booking%20for%20an%20event.',
        '_blank'
      );
      return;
    }
    if (sug.includes('Plan with AI') && onOpenPlanner) {
      onOpenPlanner();
      setIsOpen(false);
      return;
    }
    if (sug.includes('Request Custom Quote') && onOpenRfq) {
      onOpenRfq();
      setIsOpen(false);
      return;
    }
    if (sug.includes('Wave Stage Specs') || sug.includes('Explore')) {
      const el = document.getElementById('studio');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    handleSendMessage(sug);
  };

  const directWhatsAppUrl =
    'https://wa.me/971508821900?text=Hello%20Four%20Seasons%2C%20I%20would%20like%20to%20inquire%20about%20event%20production%20and%20inventory%20rentals.';

  return (
    <>
      {/* Floating Bottom Action Buttons */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center gap-2.5">
        {/* Direct WhatsApp Quick Pill */}
        <a
          href={directWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all border border-emerald-400/40 group"
          title="Direct WhatsApp Chat with Four Seasons Concierge"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="tracking-wide">WhatsApp Concierge</span>
        </a>

        {/* AI Concierge Chatbot Launcher Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-fs-navy-dark border border-fs-gold/60 text-white text-xs font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all backdrop-blur-md group"
          aria-label="Open Four Seasons AI Concierge Chatbot"
        >
          {/* Animated Gold Ring Glow */}
          <div className="absolute inset-0 rounded-full bg-fs-gold/20 animate-ping opacity-40 pointer-events-none" />

          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fs-gold-light via-fs-gold to-fs-gold-dark flex items-center justify-center text-fs-navy shadow-md">
            <Sparkles className="w-4 h-4 fill-fs-navy text-fs-navy" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-white leading-tight">AI Concierge</span>
            <span className="text-[9px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online 24/7
            </span>
          </div>

          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-fs-gold text-fs-navy font-bold text-[10px] flex items-center justify-center shadow-md">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[400px] h-[560px] max-h-[82vh] bg-fs-navy-dark/95 border border-fs-gold/35 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-fade-in">
          {/* Chat Window Header */}
          <div className="px-5 py-3.5 bg-fs-navy border-b border-fs-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fs-gold-light via-fs-gold to-fs-gold-dark flex items-center justify-center text-fs-navy font-serif font-bold text-sm shadow-md">
                4S
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                  Four Seasons AI Concierge
                </span>
                <span className="text-[10px] text-fs-gold-light flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Luxury Atelier · Instant Reply
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors"
                title="Switch to WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-fs-cream/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-fs-gold text-fs-navy font-medium shadow-md shadow-fs-gold/20 rounded-br-none'
                      : 'bg-fs-navy border border-fs-gold/20 text-fs-cream shadow-md rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs font-normal">{m.text}</p>

                  {/* Inquiry Registration Badge */}
                  {m.inquiryCreated && (
                    <div className="mt-2.5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Inquiry Reference: <strong>{m.inquiryCreated.referenceNo}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-fs-cream/40 mt-1 px-1">{m.time}</span>

                {/* Suggestions Chips below Bot Message */}
                {m.sender === 'bot' && m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(sug)}
                        className="px-2.5 py-1 rounded-full bg-fs-gold/10 hover:bg-fs-gold/25 border border-fs-gold/30 text-[10px] text-fs-gold-lighter font-medium transition-all hover:scale-[1.02] text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-fs-navy border border-fs-gold/20 text-fs-cream/70 text-xs w-max animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-fs-gold animate-spin" />
                <span>Four Seasons Concierge is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick WhatsApp Switch Banner */}
          <div className="px-4 py-1.5 bg-emerald-950/30 border-t border-emerald-500/20 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Phone className="w-3 h-3" />
              Prefer human WhatsApp chat?
            </span>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-white font-bold underline flex items-center gap-0.5"
            >
              <span>+971 50 882 1900</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMsg);
            }}
            className="p-3 bg-fs-navy-dark border-t border-fs-gold/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask about stages, bars, packages, or pricing..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-fs-navy border border-white/15 text-white text-xs placeholder:text-fs-cream/40 focus:outline-none focus:border-fs-gold"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || loading}
              className="p-2.5 rounded-xl bg-fs-gold text-fs-navy hover:bg-fs-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

