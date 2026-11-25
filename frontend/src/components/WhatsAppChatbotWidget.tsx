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
          className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-white border border-[#B38E36] text-[#1E1A16] text-xs font-bold shadow-xl hover:scale-105 active:scale-95 transition-all group"
          aria-label="Open Four Seasons AI Concierge Chatbot"
        >
          {/* Animated Gold Ring Glow */}
          <div className="absolute inset-0 rounded-full bg-[#B38E36]/20 animate-ping opacity-40 pointer-events-none" />

          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#B38E36] to-[#8F6E22] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 fill-white text-white" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-[#1E1A16] leading-tight">AI Concierge</span>
            <span className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Online 24/7
            </span>
          </div>

          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#B38E36] text-white font-bold text-[10px] flex items-center justify-center shadow-md">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[400px] h-[560px] max-h-[82vh] bg-[#FAF8F5] border border-[#E8E0D2] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Chat Window Header */}
          <div className="px-5 py-3.5 bg-white border-b border-[#E8E0D2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#B38E36] to-[#8F6E22] flex items-center justify-center text-white font-serif font-bold text-sm shadow-md">
                4S
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm text-[#1E1A16] flex items-center gap-1.5">
                  Four Seasons AI Concierge
                </span>
                <span className="text-[10px] text-[#785E1A] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Luxury Atelier · Instant Reply
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-white hover:bg-emerald-600 transition-colors"
                title="Switch to WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#786F62] hover:text-[#1E1A16] hover:bg-[#F3EDE2] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-[#FAF8F5]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#B38E36] text-white font-medium shadow-sm rounded-br-none'
                      : 'bg-white border border-[#E8E0D2] text-[#1E1A16] shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs font-normal">{m.text}</p>

                  {/* Inquiry Registration Badge */}
                  {m.inquiryCreated && (
                    <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Inquiry Reference: <strong>{m.inquiryCreated.referenceNo}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-[#786F62] mt-1 px-1">{m.time}</span>

                {/* Suggestions Chips below Bot Message */}
                {m.sender === 'bot' && m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(sug)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-[#F6EED8] border border-[#DDD5C7] text-[10px] text-[#785E1A] font-semibold transition-all hover:scale-[1.02] text-left shadow-xs"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#E8E0D2] text-[#474036] text-xs w-max shadow-sm animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-[#B38E36] animate-spin" />
                <span>Four Seasons Concierge is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick WhatsApp Switch Banner */}
          <div className="px-4 py-1.5 bg-[#F6EED8] border-t border-[#E2D4B7] flex items-center justify-between text-[11px]">
            <span className="text-[#785E1A] flex items-center gap-1 font-semibold">
              <Phone className="w-3 h-3 text-[#B38E36]" />
              Prefer human WhatsApp chat?
            </span>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#785E1A] hover:text-[#1E1A16] font-bold underline flex items-center gap-0.5"
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
            className="p-3 bg-white border-t border-[#E8E0D2] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask about stages, bars, packages, or pricing..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] text-xs placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || loading}
              className="p-2.5 rounded-xl bg-[#B38E36] text-white hover:bg-[#8F6E22] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
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

