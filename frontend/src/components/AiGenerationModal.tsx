'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Download, Share2, RefreshCw, CheckCircle2, Clock, AlertCircle, Eye, Layers } from 'lucide-react';
import { api } from '@/lib/api';

interface AiGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: any[];
}

export const AiGenerationModal: React.FC<AiGenerationModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
}) => {
  const [generationType, setGenerationType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [instructions, setInstructions] = useState('');
  const [visualTheme, setVisualTheme] = useState('Red Bloom');
  const [durationSeconds, setDurationSeconds] = useState(5);
  const [aspectRatio, setAspectRatio] = useState('16:9');

  // Async task tracking
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<'IDLE' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('IDLE');
  const [resultData, setResultData] = useState<any | null>(null);
  const [pollingError, setPollingError] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (taskId && (taskStatus === 'PENDING' || taskStatus === 'PROCESSING')) {
      timer = setInterval(async () => {
        try {
          const statusRes = await api.getAiStatus(taskId);
          setTaskStatus(statusRes.status);
          if (statusRes.status === 'COMPLETED') {
            setResultData(statusRes);
            clearInterval(timer);
          } else if (statusRes.status === 'FAILED') {
            setPollingError(statusRes.errorReason || 'Generation task failed');
            clearInterval(timer);
          }
        } catch (err: any) {
          console.error('Polling error:', err);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [taskId, taskStatus]);

  if (!isOpen) return null;

  const handleStartGeneration = async () => {
    try {
      setTaskStatus('PENDING');
      setPollingError(null);
      setResultData(null);

      const itemIds = selectedItems.map((i) => i.id);

      if (generationType === 'IMAGE') {
        const res = await api.generateImage({
          itemIds,
          instructions,
          visualTheme,
          aspectRatio,
        });
        setTaskId(res.id);
      } else {
        const res = await api.generateVideo({
          itemIds,
          instructions,
          visualTheme,
          durationSeconds,
        });
        setTaskId(res.id);
      }
    } catch (err: any) {
      setTaskStatus('FAILED');
      setPollingError(err.message || 'Failed to submit generation task');
    }
  };

  const handleWhatsAppShare = () => {
    if (!resultData?.resultUrl) return;
    const msg = `Hello! Check out this luxury event concept render generated with Four Seasons AI: ${window.location.origin}${resultData.resultUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-fs-navy-surface border border-fs-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-fs-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fs-gold flex items-center justify-center font-serif font-bold text-fs-navy text-lg shadow-lg">
              4S
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-white block">
                AI Visualizer Studio
              </span>
              <span className="text-[10px] text-fs-gold-lighter tracking-widest uppercase block">
                Preserving Authentic Four Seasons Rental Inventory
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

        {/* Content Body */}
        <div className="flex-1 py-6 space-y-6">
          {taskStatus === 'IDLE' ? (
            /* Parameter Configuration */
            <div className="space-y-6">
              {/* Selected Reference Items Badge Carousel */}
              <div>
                <span className="text-xs font-bold text-fs-gold uppercase tracking-wider block mb-2">
                  Inventory Items Selected for Visual Synthesis ({selectedItems.length}):
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {selectedItems.map((it) => (
                    <div
                      key={it.id}
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-fs-gold/20 text-xs text-white"
                    >
                      <img
                        src={it.coverImage || '/reference_assets/hero_mandap_red.jpg'}
                        alt={it.name}
                        className="w-6 h-6 rounded-md object-cover"
                      />
                      <span className="font-medium truncate max-w-[140px]">{it.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mode Toggle: Image vs Video */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGenerationType('IMAGE')}
                  className={`py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    generationType === 'IMAGE'
                      ? 'bg-fs-gold text-fs-navy shadow-md'
                      : 'bg-white/5 border border-white/10 text-fs-cream/80 hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>4K Photorealistic Image</span>
                </button>

                <button
                  onClick={() => setGenerationType('VIDEO')}
                  className={`py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    generationType === 'VIDEO'
                      ? 'bg-fs-gold text-fs-navy shadow-md'
                      : 'bg-white/5 border border-white/10 text-fs-cream/80 hover:bg-white/10'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Cinematic Video Walkthrough</span>
                </button>
              </div>

              {/* Theme & Ratio / Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                    Atmospheric Theme
                  </label>
                  <select
                    value={visualTheme}
                    onChange={(e) => setVisualTheme(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
                  >
                    <option value="Red Bloom">Red Bloom (Crimson Dutch Roses &amp; Gold)</option>
                    <option value="Bling">Bling (Gold Mirrors, LED Shimmer &amp; Chandeliers)</option>
                    <option value="Grecian Haldi">Grecian Haldi (Roman Columns &amp; Marigolds)</option>
                    <option value="Floral Majesty">Floral Majesty (Pastel Hydrangeas &amp; Orchids)</option>
                    <option value="Colourful Mehendi">Colourful Mehendi (Royal Silk Swings &amp; Crates)</option>
                    <option value="Boho">Bohemian Sunset (Beachfront Linen &amp; Pampas)</option>
                    <option value="Sufi Traditional">Sufi Traditional (Persian Rugs &amp; Terracotta)</option>
                  </select>
                </div>

                {generationType === 'IMAGE' ? (
                  <div>
                    <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                      Aspect Ratio
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
                    >
                      <option value="16:9">16:9 Landscape (Widescreen Ballroom)</option>
                      <option value="4:3">4:3 Architectural Frame</option>
                      <option value="1:1">1:1 Square (Instagram / Portfolio)</option>
                      <option value="9:16">9:16 Vertical Mobile Screen</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                      Render Duration
                    </label>
                    <select
                      value={durationSeconds}
                      onChange={(e) => setDurationSeconds(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
                    >
                      <option value={5}>5 Seconds (Orbital Camera Sweep)</option>
                      <option value={10}>10 Seconds (Steadicam Walk-In)</option>
                      <option value={15}>15 Seconds (Full Ballroom Flythrough)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="text-xs font-semibold text-fs-cream/80 block mb-1">
                  Custom Atelier Prompt / Styling Instructions
                </label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Ensure red roses are deep crimson Naomi shade, warm amber pinspot lighting on the mirror stage, and keep the floral arch symmetrical."
                  className="w-full px-3 py-2.5 rounded-xl bg-fs-navy-dark border border-white/10 text-white placeholder-fs-cream/40 text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartGeneration}
                  className="gold-gradient-btn w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-xl"
                >
                  <Sparkles className="w-5 h-5 text-fs-navy" />
                  <span>Launch Asynchronous {generationType} Generation</span>
                </button>
              </div>
            </div>
          ) : taskStatus === 'PENDING' || taskStatus === 'PROCESSING' ? (
            /* Loading / Asynchronous Processing State */
            <div className="py-16 text-center space-y-6 animate-fade-in">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-fs-gold/30 border-t-fs-gold animate-spin" />
                <div className="absolute inset-2.5 rounded-full bg-fs-gold/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-fs-gold animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fs-gold/20 text-fs-gold-light text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-fs-gold animate-ping" />
                  Status: {taskStatus}
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Synthesizing {generationType === 'IMAGE' ? '4K Concept Image' : 'Cinematic Video'}
                </h3>
                <p className="text-xs text-fs-cream/70 max-w-md mx-auto">
                  Preserving exact geometry and floral textures from your {selectedItems.length} selected inventory items.
                </p>
              </div>
            </div>
          ) : taskStatus === 'COMPLETED' && resultData ? (
            /* Completed Result Preview */
            <div className="space-y-6 animate-fade-in">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-fs-gold/40 shadow-2xl bg-black">
                <img
                  src={resultData.resultUrl || '/reference_assets/hero_mandap_red.jpg'}
                  alt="AI Generated Concept"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-fs-navy/90 text-xs font-bold text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AI Render Completed
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-fs-navy-dark/85 backdrop-blur-md border border-fs-gold/20 text-xs">
                  <span className="text-[10px] text-fs-gold-light uppercase font-bold block mb-0.5">
                    Engine: {resultData.provider}
                  </span>
                  <p className="text-fs-cream/90 text-[11px] line-clamp-1">
                    {resultData.prompt}
                  </p>
                </div>
              </div>

              {/* Actions: Download, WhatsApp Share, Regenerate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={resultData.resultUrl}
                  download="FourSeasons_AI_Concept.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="gold-gradient-btn py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-center"
                >
                  <Download className="w-4 h-4 text-fs-navy" />
                  <span>Download High-Res</span>
                </a>

                <button
                  onClick={handleWhatsAppShare}
                  className="py-3 px-4 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share via WhatsApp</span>
                </button>

                <button
                  onClick={() => setTaskStatus('IDLE')}
                  className="py-3 px-4 rounded-xl border border-white/20 text-fs-cream hover:bg-white/10 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-fs-gold" />
                  <span>New Variation</span>
                </button>
              </div>
            </div>
          ) : (
            /* Error State */
            <div className="py-12 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
              <h4 className="font-serif text-xl font-bold text-white">Generation Failed</h4>
              <p className="text-xs text-rose-300">{pollingError || 'An error occurred during processing.'}</p>
              <button
                onClick={() => setTaskStatus('IDLE')}
                className="gold-gradient-btn px-6 py-2 rounded-xl text-xs font-bold"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

