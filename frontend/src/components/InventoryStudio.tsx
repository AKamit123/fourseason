'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Check, Eye, Trash2, ArrowRight, Filter, Search, Layers, Info, X } from 'lucide-react';
import { api } from '@/lib/api';
import { DEMO_CATEGORIES, DEMO_ITEMS } from '@/lib/demoData';

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
  const [cartVariants, setCartVariants] = useState<Record<string, string>>({});
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
        api.getCategories().catch(() => DEMO_CATEGORIES),
        api.getItems({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          theme: selectedTheme !== 'All' ? selectedTheme : undefined,
          search: searchQuery || undefined,
          limit: 100,
        }).catch(() => ({ items: DEMO_ITEMS })),
      ]);
      setCategories(catsRes?.length ? catsRes : DEMO_CATEGORIES);
      setItems(itemsRes?.items?.length ? itemsRes.items : DEMO_ITEMS);
    } catch (err) {
      console.error('Failed to load inventory:', err);
      setCategories(DEMO_CATEGORIES);
      setItems(DEMO_ITEMS);
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

  const updateCartQty = (itemId: string, delta: number) => {
    setCart((prev) => {
      const next = (prev[itemId] || 1) + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const found = items.find((i) => i.id === id);
      return found ? { ...found, cartQty: qty, selectedVariant: cartVariants[id] || found.theme || 'Ivory & Gold' } : null;
    })
    .filter(Boolean) as any[];

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.cartQty || 1), 0);
  const transportFee = cartItems.length > 0 ? 2500 : 0;
  const installationFee = cartItems.length > 0 ? Math.max(3500, Math.round(cartTotal * 0.12)) : 0;
  const vatAmount = Math.round((cartTotal + transportFee + installationFee) * 0.05);
  const indicativeGrandTotal = cartTotal + transportFee + installationFee + vatAmount;

  return (
    <section id="studio" className="py-20 bg-[#FAF8F5] relative border-t border-[#E8E0D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6EED8] border border-[#E3D4B3] text-[#785E1A] text-xs font-semibold uppercase tracking-wider mb-2 shadow-sm">
              <Layers className="w-3.5 h-3.5" />
              Dynamic Rental Inventory &amp; Creative Studio
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E1A16]">
              Explore Atelier Inventory
            </h2>
            <p className="text-sm text-[#474036] max-w-2xl mt-2 font-light">
              Select items from our prestigious rental collection. Mix, match, and launch the AI visualizer to see your combination come alive.
            </p>
          </div>

          {/* Builder / Studio Mode Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'builder' : 'grid')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                viewMode === 'builder'
                  ? 'bg-[#B38E36] text-white shadow-md font-bold'
                  : 'bg-white border border-[#E2D8C6] text-[#785E1A] hover:bg-[#FAF5E8] shadow-sm'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{viewMode === 'builder' ? 'Back to Full Catalog' : 'Open Combination Builder'}</span>
              {cartItems.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#B38E36] text-white text-xs flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 mb-8 border border-[#E8E0D2] shadow-sm space-y-4">
          {/* Top Bar: Search & Theme Chips */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8375]" />
              <input
                type="text"
                placeholder="Search mandap, 7.3m stage, bar, photobooth, swing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-[#1E1A16] placeholder-[#8C8375] text-xs sm:text-sm focus:outline-none focus:border-[#B38E36]"
              />
            </div>

            {/* Themes Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] uppercase font-bold text-[#785E1A] mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Theme:
              </span>
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTheme(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedTheme === t
                      ? 'bg-[#B38E36] text-white font-bold shadow-sm'
                      : 'bg-[#F5EFE6] text-[#474036] hover:bg-[#EAE1D3]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Horizontal Pills */}
          <div className="pt-2 border-t border-[#F0EBE1] flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#B38E36] text-white font-bold'
                  : 'bg-[#F5EFE6] border border-[#E2D8C6] text-[#474036] hover:bg-[#EAE1D3]'
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
                    ? 'bg-[#B38E36] text-white font-bold shadow-sm'
                    : 'bg-[#F5EFE6] border border-[#E2D8C6] text-[#474036] hover:bg-[#EAE1D3]'
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
            <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#B38E36]/30 shadow-md">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E0D2]">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#785E1A] mb-1">
                    <Sparkles className="w-4 h-4" />
                    AI Creative Concept Studio
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1A16]">
                    Selected Combination Concept ({cartItems.length} Elements)
                  </h3>
                  <p className="text-xs text-[#474036] mt-1">
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
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate 4K AI Render</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={() => onOpenRfqWithCart(cartItems)}
                    disabled={cartItems.length === 0}
                    className="px-5 py-3.5 rounded-xl border border-[#B38E36]/40 bg-white text-[#785E1A] hover:bg-[#FAF5E8] font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                  >
                    Request Quote (AED {cartTotal.toLocaleString()})
                  </button>
                </div>
              </div>

              {/* Slots / Selected Elements Grid */}
              <div className="pt-6">
                {cartItems.length === 0 ? (
                  <div className="py-12 text-center text-[#786F62] space-y-3">
                    <Layers className="w-12 h-12 mx-auto text-[#B38E36]/30" />
                    <p className="text-sm font-medium">No inventory elements selected yet.</p>
                    <button
                      onClick={() => setViewMode('grid')}
                      className="text-xs text-[#B38E36] hover:underline font-semibold"
                    >
                      Browse catalog below to add mandaps, stages, bars &amp; florals →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-3 border border-[#E2D8C6] shadow-sm flex flex-col justify-between group hover:border-[#B38E36] transition-all"
                      >
                        <div className="relative h-36 rounded-xl overflow-hidden mb-2.5">
                          <img
                            src={item.coverImage || '/reference_assets/hero_mandap_red.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 text-[#785E1A] shadow-sm">
                            {item.category?.name || 'Item'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-serif font-semibold text-[#1E1A16] block line-clamp-1">
                            {item.name}
                          </span>
                          <div className="flex items-center justify-between text-xs text-[#474036] mt-1">
                            <span className="text-[#8F6E22] font-semibold">AED {(item.price * (item.cartQty || 1)).toLocaleString()}</span>
                            <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E2D8C6] rounded-lg px-1.5 py-0.5">
                              <button onClick={() => updateCartQty(item.id, -1)} className="px-1 font-bold text-[#474036] hover:text-[#1E1A16]">-</button>
                              <span className="text-[11px] font-bold">{item.cartQty}</span>
                              <button onClick={() => updateCartQty(item.id, 1)} className="px-1 font-bold text-[#474036] hover:text-[#1E1A16]">+</button>
                            </div>
                          </div>
                          <select
                            value={item.selectedVariant}
                            onChange={(e) => setCartVariants((prev) => ({ ...prev, [item.id]: e.target.value }))}
                            className="mt-2 w-full px-2 py-1 rounded-lg bg-[#FAF8F5] border border-[#E2D8C6] text-[10px] font-medium text-[#474036]"
                          >
                            <option value="Ivory & Gold">Variant: Ivory &amp; Gold</option>
                            <option value="Crimson Naomi">Variant: Crimson Naomi</option>
                            <option value="Blush Pastel">Variant: Blush Pastel</option>
                            <option value="Emerald & Brass">Variant: Emerald &amp; Brass</option>
                          </select>
                        </div>
                        <div className="pt-2 mt-2 border-t border-[#F0EBE1] flex items-center justify-between">
                          <button
                            onClick={() => setActiveItemDetail(item)}
                            className="text-[11px] text-[#474036] hover:text-[#B38E36] flex items-center gap-1"
                          >
                            <Info className="w-3 h-3" /> Specs
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cartItems.length > 0 && (
                  <div className="mt-6 p-5 rounded-2xl bg-white border border-[#E2D8C6] grid grid-cols-1 md:grid-cols-2 gap-4 items-center text-xs">
                    <div className="space-y-1.5 text-[#474036]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38E36] block">
                        Indicative Estimate &amp; Pricing Rules Breakdown
                      </span>
                      <div className="flex justify-between">
                        <span>Rental Items Subtotal ({cartItems.reduce((s, i) => s + i.cartQty, 0)} units)</span>
                        <strong>AED {cartTotal.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Transport &amp; Logistics Delivery (Dubai)</span>
                        <strong>AED {transportFee.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Installation, Dismantling &amp; Manpower (12%)</span>
                        <strong>AED {installationFee.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>UAE VAT (5%)</span>
                        <strong>AED {vatAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="md:border-l md:border-[#E8E0D2] md:pl-6 flex flex-col justify-between space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#785E1A]">Indicative Grand Total</span>
                      <div className="font-serif text-3xl font-bold text-[#1E1A16]">
                        AED {indicativeGrandTotal.toLocaleString()}
                      </div>
                      <p className="text-[10px] text-[#786F62] italic">
                        Subject to venue site survey, final floorplan dimensions &amp; availability confirmation. Valid for 14 days.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* INVENTORY ITEMS GRID */}
        {loading ? (
          <div className="py-24 text-center text-[#786F62] space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#B38E36]/30 border-t-[#B38E36] animate-spin mx-auto" />
            <p className="text-xs tracking-wider uppercase">Loading Four Seasons Atelier Catalog…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-[#786F62] bg-white rounded-3xl p-8 border border-[#E8E0D2] shadow-sm">
            <p className="text-base font-serif text-[#1E1A16]">No inventory items matched your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedTheme('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-[#B38E36] hover:underline font-semibold"
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
                  className="group relative bg-white rounded-2xl overflow-hidden border border-[#E8E0D2] hover:border-[#B38E36] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg shadow-stone-200/50"
                >
                  {/* Image Container */}
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-[#F3EDE2]">
                    <img
                      src={item.coverImage || '/reference_assets/hero_mandap_red.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-[#785E1A] border border-[#E2D8C6] shadow-sm">
                        {item.category?.name || 'Décor'}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Theme badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] text-white font-medium bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        Theme: {item.theme}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1E1A16] group-hover:text-[#8F6E22] transition-colors leading-snug line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#5A5245] line-clamp-2 mt-1 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Pricing and Action */}
                    <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between">
                      <div>
                        <span className="text-[#786F62] block text-[10px] uppercase font-semibold">
                          Client Rate ({item.unit})
                        </span>
                        <span className="font-serif font-bold text-base text-[#8F6E22]">
                          AED {item.price?.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveItemDetail(item)}
                          className="p-2 rounded-xl bg-[#F5EFE6] hover:bg-[#EAE1D3] text-[#474036] hover:text-[#1E1A16] transition-colors"
                          title="View Specifications & Catalog Sheet"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => (inCart ? removeFromCart(item.id) : addToCart(item))}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            inCart
                              ? 'bg-emerald-600 text-white shadow-sm'
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
                              <Plus className="w-3.5 h-3.5 text-white" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-xl bg-white border border-[#E2D8C6] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveItemDetail(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F5EFE6] text-[#786F62] hover:text-[#1E1A16]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-5">
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#E8E0D2]">
                  <img
                    src={activeItemDetail.coverImage || '/reference_assets/hero_mandap_red.jpg'}
                    alt={activeItemDetail.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-white/95 text-xs font-bold text-[#785E1A] border border-[#E2D8C6] shadow-sm">
                    SKU: {activeItemDetail.sku}
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-[#785E1A] tracking-wider">
                    {activeItemDetail.category?.name} · {activeItemDetail.theme} Theme
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1E1A16] mt-1">
                    {activeItemDetail.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#474036] leading-relaxed mt-2">
                    {activeItemDetail.description}
                  </p>
                </div>

                {/* Specs Box */}
                {activeItemDetail.specifications && Object.keys(activeItemDetail.specifications).length > 0 && (
                  <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E8E0D2] space-y-2 text-xs">
                    <span className="font-bold text-[#785E1A] uppercase tracking-wider block mb-1">
                      Architectural &amp; Catalog Specifications
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[#474036]">
                      {Object.entries(activeItemDetail.specifications).map(([k, v]) => (
                        <div key={k} className="flex flex-col">
                          <span className="text-[10px] text-[#786F62] uppercase font-semibold">{k}</span>
                          <span className="font-medium text-[#1E1A16]">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E8E0D2]">
                  <div>
                    <span className="text-[10px] text-[#786F62] uppercase block font-semibold">Standard Rental Rate</span>
                    <span className="font-serif font-bold text-xl text-[#8F6E22]">
                      AED {activeItemDetail.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#786F62] ml-1">/{activeItemDetail.unit}</span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(activeItemDetail);
                      setActiveItemDetail(null);
                    }}
                    className="gold-gradient-btn px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 text-white"
                  >
                    <Plus className="w-4 h-4 text-white" />
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
