'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Check, Eye, Trash2, ArrowRight, Filter, Search, SlidersHorizontal, Layers, ShoppingBag, Info, X } from 'lucide-react';
import { api } from '@/lib/api';

interface InventoryStudioProps {
  onTriggerAiGeneration: (selectedItems: any[]) => void;
  onOpenRfqWithCart: (cartItems: any[]) => void;
}

export const InventoryStudio: React.FC<InventoryStudioProps> = ({
  onTriggerAiGeneration,
  onOpenRfqWithCart,
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'builder'>('grid');

  // Combination Builder / Cart State
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeItemDetail, setActiveItemDetail] = useState<any | null>(null);

  // Themes
  const themes = ['All', 'Red Bloom', 'Bling', 'Grecian Haldi', 'Floral Majesty', 'Colourful Mehendi', 'Boho', 'Sufi Traditional', 'Neon'];

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedTheme, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catsRes, itemsRes] = await Promise.all([
        api.getCategories(),
        api.getItems({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          theme: selectedTheme !== 'All' ? selectedTheme : undefined,
          search: searchQuery || undefined,
          limit: 100,
        }),
      ]);
      setCategories(catsRes || []);
      setItems(itemsRes.items || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cart operations
  const addToCart = (item: any) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const found = items.find((i) => i.id === id);
      return found ? { ...found, cartQty: qty } : null;
    })
    .filter(Boolean) as any[];

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.cartQty || 1), 0);

  return (
    <section id="studio" className="py-20 bg-fs-navy relative border-t border-fs-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fs-gold/15 border border-fs-gold/30 text-fs-gold-light text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              Dynamic Rental Inventory &amp; Creative Studio
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Explore Atelier Inventory
            </h2>
            <p className="text-sm text-fs-cream/70 max-w-2xl mt-2 font-light">
              Select items from our prestigious rental collection. Mix, match, and launch the AI visualizer to see your combination come alive.
            </p>
          </div>

          {/* Builder / Studio Mode Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'builder' : 'grid')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                viewMode === 'builder'
                  ? 'bg-fs-gold text-fs-navy shadow-lg font-bold'
                  : 'bg-white/5 border border-fs-gold/30 text-fs-gold-light hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{viewMode === 'builder' ? 'Back to Full Catalog' : 'Open Combination Builder'}</span>
              {cartItems.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-fs-navy text-fs-gold text-xs flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 border border-fs-gold/20 space-y-4">
          {/* Top Bar: Search & Theme Chips */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fs-cream/40" />
              <input
                type="text"
                placeholder="Search mandap, 7.3m stage, bar, photobooth, swing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-fs-navy-dark/90 border border-white/10 text-white placeholder-fs-cream/40 text-xs sm:text-sm focus:outline-none focus:border-fs-gold"
              />
            </div>

            {/* Themes Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] uppercase font-bold text-fs-gold-light mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Theme:
              </span>
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTheme(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedTheme === t
                      ? 'bg-fs-gold text-fs-navy font-bold shadow-sm'
                      : 'bg-white/5 text-fs-cream/70 hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Horizontal Pills */}
          <div className="pt-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-fs-gold text-fs-navy font-bold'
                  : 'bg-white/5 border border-white/10 text-fs-cream/80 hover:bg-white/10'
              }`}
            >
              All Collections
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.name
                    ? 'bg-fs-gold text-fs-navy font-bold shadow-sm'
                    : 'bg-white/5 border border-white/10 text-fs-cream/80 hover:bg-white/10'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* COMBINATION BUILDER DRAWER VIEW */}
        {viewMode === 'builder' ? (
          <div className="space-y-8 animate-fade-in">
            {/* Combination Stage Header */}
            <div className="glass-gold rounded-3xl p-6 sm:p-8 border border-fs-gold/40">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-fs-gold/20">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fs-gold mb-1">
                    <Sparkles className="w-4 h-4" />
                    AI Creative Concept Studio
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Selected Combination Concept ({cartItems.length} Elements)
                  </h3>
                  <p className="text-xs text-fs-cream/70 mt-1">
                    Combine your ceremony mandap, stage, bar, and floral ambience into a single coherent photorealistic render.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onTriggerAiGeneration(cartItems)}
                    disabled={cartItems.length === 0}
                    className={`gold-gradient-btn px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl ${
                      cartItems.length === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-fs-navy" />
                    <span>Generate 4K AI Render</span>
                    <ArrowRight className="w-4 h-4 text-fs-navy" />
                  </button>

                  <button
                    onClick={() => onOpenRfqWithCart(cartItems)}
                    disabled={cartItems.length === 0}
                    className="px-5 py-3.5 rounded-xl border border-fs-gold/40 text-fs-gold-light hover:bg-fs-gold/10 font-semibold text-xs sm:text-sm transition-colors"
                  >
                    Request Quote (AED {cartTotal.toLocaleString()})
                  </button>
                </div>
              </div>

              {/* Slots / Selected Elements Grid */}
              <div className="pt-6">
                {cartItems.length === 0 ? (
                  <div className="py-12 text-center text-fs-cream/50 space-y-3">
                    <Layers className="w-12 h-12 mx-auto text-fs-gold/30" />
                    <p className="text-sm font-medium">No inventory elements selected yet.</p>
                    <button
                      onClick={() => setViewMode('grid')}
                      className="text-xs text-fs-gold hover:underline font-semibold"
                    >
                      Browse catalog below to add mandaps, stages, bars &amp; florals →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="glass-panel rounded-2xl p-3 border border-fs-gold/30 flex flex-col justify-between group hover:border-fs-gold transition-all"
                      >
                        <div className="relative h-36 rounded-xl overflow-hidden mb-2.5">
                          <img
                            src={item.coverImage || '/reference_assets/hero_mandap_red.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-fs-navy/80 text-fs-gold-light backdrop-blur-sm">
                            {item.category?.name || 'Item'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-serif font-semibold text-white block line-clamp-1">
                            {item.name}
                          </span>
                          <div className="flex items-center justify-between text-xs text-fs-cream/70 mt-1">
                            <span className="text-fs-gold font-medium">AED {item.price?.toLocaleString()}</span>
                            <span className="text-[10px] text-fs-cream/50">Theme: {item.theme}</span>
                          </div>
                        </div>
                        <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={() => setActiveItemDetail(item)}
                            className="text-[11px] text-fs-cream/70 hover:text-fs-gold flex items-center gap-1"
                          >
                            <Info className="w-3 h-3" /> Specs
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* INVENTORY ITEMS GRID */}
        {loading ? (
          <div className="py-24 text-center text-fs-cream/60 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-fs-gold/30 border-t-fs-gold animate-spin mx-auto" />
            <p className="text-xs tracking-wider uppercase">Loading Four Seasons Atelier Catalog…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-fs-cream/50 glass-panel rounded-3xl p-8 border border-white/10">
            <p className="text-base font-serif">No inventory items matched your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedTheme('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-fs-gold hover:underline font-semibold"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const inCart = !!cart[item.id];
              return (
                <div
                  key={item.id}
                  className="group relative glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-fs-gold/60 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-black/50"
                >
                  {/* Image Container */}
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-fs-navy-dark">
                    <img
                      src={item.coverImage || '/reference_assets/hero_mandap_red.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-fs-navy-dark/90 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-fs-navy/85 text-fs-gold-lighter border border-fs-gold/30 backdrop-blur-sm">
                        {item.category?.name || 'Décor'}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.status === 'AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Theme badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] text-fs-cream/80 font-medium bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        Theme: {item.theme}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-serif font-bold text-base text-white group-hover:text-fs-gold-lighter transition-colors leading-snug line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-fs-cream/70 line-clamp-2 mt-1 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Pricing and Action */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-fs-cream/50 block text-[10px] uppercase font-semibold">
                          Client Rate ({item.unit})
                        </span>
                        <span className="font-serif font-bold text-base text-fs-gold-light">
                          AED {item.price?.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveItemDetail(item)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-fs-cream/80 hover:text-white transition-colors"
                          title="View Specifications & Catalog Sheet"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => (inCart ? removeFromCart(item.id) : addToCart(item))}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            inCart
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'gold-gradient-btn'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-fs-navy" />
                              <span>Select</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ITEM SPECIFICATIONS MODAL / DRAWER */}
        {activeItemDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-xl bg-fs-navy-surface border border-fs-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveItemDetail(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-fs-cream/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-5">
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-fs-gold/30">
                  <img
                    src={activeItemDetail.coverImage || '/reference_assets/hero_mandap_red.jpg'}
                    alt={activeItemDetail.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-fs-navy/90 text-xs font-bold text-fs-gold border border-fs-gold/30">
                    SKU: {activeItemDetail.sku}
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-fs-gold tracking-wider">
                    {activeItemDetail.category?.name} · {activeItemDetail.theme} Theme
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-1">
                    {activeItemDetail.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-fs-cream/80 leading-relaxed mt-2">
                    {activeItemDetail.description}
                  </p>
                </div>

                {/* Specs Box */}
                {activeItemDetail.specifications && Object.keys(activeItemDetail.specifications).length > 0 && (
                  <div className="glass-panel rounded-xl p-4 border border-white/10 space-y-2 text-xs">
                    <span className="font-bold text-fs-gold uppercase tracking-wider block mb-1">
                      Architectural &amp; Catalog Specifications
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-fs-cream/80">
                      {Object.entries(activeItemDetail.specifications).map(([k, v]) => (
                        <div key={k} className="flex flex-col">
                          <span className="text-[10px] text-fs-cream/50 uppercase font-semibold">{k}</span>
                          <span className="font-medium text-white">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-fs-gold/20">
                  <div>
                    <span className="text-[10px] text-fs-cream/50 uppercase block font-semibold">Standard Rental Rate</span>
                    <span className="font-serif font-bold text-xl text-fs-gold-light">
                      AED {activeItemDetail.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-fs-cream/50 ml-1">/{activeItemDetail.unit}</span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(activeItemDetail);
                      setActiveItemDetail(null);
                    }}
                    className="gold-gradient-btn px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-fs-navy" />
                    <span>Add to Combination</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

