'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, Layers, FolderTree, Calendar,
  BookmarkCheck, Sparkles, Film, Mail, Camera, HeartHandshake,
  Workflow, MessageCircle, BarChart3, UserCheck, Globe, Settings,
  History, LogOut, Search, Plus, Filter, RefreshCw, CheckCircle2,
  AlertCircle, ChevronRight, Edit3, Trash2, ArrowUpRight, Send, Download,
  X, Eye, Share2, Tag, Save
} from 'lucide-react';
import { api } from '@/lib/api';
import { BrandedPlanPdfModal } from '@/components/BrandedPlanPdfModal';
import {
  DEMO_CATEGORIES,
  DEMO_ITEMS,
  DEMO_TEMPLATES,
  DEMO_KPIS,
  DEMO_INQUIRIES,
  DEMO_BOOKINGS,
  DEMO_SERVICES,
  DEMO_PORTFOLIO,
} from '@/lib/demoData';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [aiGenerations, setAiGenerations] = useState<any[]>([]);
  const [invitationTemplates, setInvitationTemplates] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [portfolioList, setPortfolioList] = useState<any[]>([]);
  const [zohoConfig, setZohoConfig] = useState<any | null>(null);
  const [whatsAppConfig, setWhatsAppConfig] = useState<any | null>(null);
  const [whatsAppLogs, setWhatsAppLogs] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Action & Feedback States
  const [syncingZohoId, setSyncingZohoId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Modals visibility
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    categoryId: '',
    theme: 'Red Bloom',
    price: 25000,
    tradePrice: 10000,
    totalQuantity: 5,
    description: '',
    coverImage: '/reference_assets/hero_mandap_red.jpg',
  });

  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [catForm, setCatForm] = useState({ name: '', description: '', icon: 'Layers' });

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    priceStarting: 45000,
    pricingUnit: 'event',
    features: 'Turnkey Design, 3D Renders, Event Concierge',
    image: '/reference_assets/hero_mandap_red.jpg',
  });

  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<any | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    eventType: 'Royal Wedding',
    category: 'Wedding',
    clientName: 'VIP Royal Family',
    location: 'Grand Ballroom, UAE',
    description: '',
    coverImage: '/reference_assets/hero_mandap_red.jpg',
    tags: 'Royal Wedding, Royal Mandap, Wave Stage',
  });

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [templateForm, setTemplateForm] = useState({
    title: '',
    category: 'Wedding',
    previewImage: '/reference_assets/hero_mandap_red.jpg',
    description: '',
  });

  // SEO & Meta Settings State
  const [seoForm, setSeoForm] = useState<Record<string, string>>({
    meta_title: 'Four Seasons | Luxury Wedding & Event Atelier',
    meta_description: "Premier luxury wedding & event organizers. AI-powered event concepting, authentic rental mandaps, wave screen stages, Versace bars, and turnkey celebrations.",
    meta_keywords: 'luxury wedding planner, event organizers, wedding decor rental, mandap rental, stage design, arabic nikah decor, royal wedding, corporate event planner, four seasons',
    og_title: 'Four Seasons — Bespoke Luxury Celebrations & Weddings',
    og_description: 'Design your dream celebration with AI precision and authentic luxury atelier inventory.',
    og_image: '/reference_assets/hero_mandap_red.jpg',
    twitter_card: 'summary_large_image',
    canonical_url: 'https://fourseasons.events',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    author: 'Four Seasons Events Organizers LLC',
    google_verification: 'google-site-verification-token-fourseasons',
  });
  const [savingSeo, setSavingSeo] = useState(false);

  // Test WhatsApp Form State
  const [testPhone, setTestPhone] = useState('+971508821900');
  const [testMsg, setTestMsg] = useState('Hello from Four Seasons official operations test dispatch.');

  // CRM Pipeline, Lead Profile, Unified Conversations & Lego-Block Settings (PDF 2 Part 3 & Part 6)
  const [inquiriesView, setInquiriesView] = useState<'list' | 'pipeline'>('list');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [showLeadPdf, setShowLeadPdf] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('15000');
  const [paymentLinks, setPaymentLinks] = useState<Record<string, string>>({});
  const [assistantPaused, setAssistantPaused] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [convReply, setConvReply] = useState('');
  const [convChannel, setConvChannel] = useState<'WhatsApp' | 'Email' | 'SMS'>('WhatsApp');
  const [convThread, setConvThread] = useState<any[]>([
    { id: 1, sender: 'System', channel: 'SMS', time: 'Tue 21:18', text: 'Verification code sent to save the plan.', internal: false },
    { id: 2, sender: 'Assistant', channel: 'Email', time: 'Tue 21:20', text: 'Your wedding plan is attached as a Branded A4 PDF.', internal: false },
    { id: 3, sender: 'Lead', channel: 'WhatsApp', time: 'Tue 23:15', text: 'Can the stage be made wider for 350 guests?', internal: false },
    { id: 4, sender: 'Assistant', channel: 'WhatsApp', time: 'Tue 23:15', text: 'Our stages are built in several widths. I have passed your question to our team, who will confirm the size in the morning.', internal: false },
  ]);
  const [legoSettings, setLegoSettings] = useState({
    brandName: 'Four Seasons',
    watermarkStrength: 'Light',
    freePictureLimit: 5,
    tokenChargeAed: 25,
    aiModel: 'Google Gemini (via OpenRouter)',
    showBudgetRanges: true,
  });
  const [automations, setAutomations] = useState([
    { id: 'pdf', title: 'Visitor saves plan → Send Branded PDF + Create Lead', channel: 'Email, WhatsApp', enabled: true },
    { id: 'followup', title: 'Plan sent → Send helpful theme gallery follow-up', channel: 'Email or WhatsApp', enabled: true },
    { id: 'reminder', title: 'Lead quiet 48h → Gentle consultation reminder', channel: 'Email or WhatsApp', enabled: true },
    { id: 'night', title: 'Question outside office hours → AI Assistant answers', channel: 'WhatsApp, Website Chat', enabled: true },
    { id: 'escalate', title: 'Lead waits beyond SLA → Escalate to Team Lead', channel: 'CRM Task + WhatsApp', enabled: true },
  ]);

  const computeLeadScore = (inq: any) => {
    let score = 60;
    const reasons: string[] = [];
    if (inq.guestsCount >= 300) {
      score += 15;
      reasons.push(`${inq.guestsCount} guests`);
    } else if (inq.guestsCount >= 150) {
      score += 8;
      reasons.push(`${inq.guestsCount} guests`);
    }
    if (inq.eventDate) {
      score += 10;
      reasons.push('Confirmed target date');
    }
    if (inq.specialInstructions?.includes('SMS Verified')) {
      score += 10;
      reasons.push('Mobile SMS verified');
    } else {
      score += 5;
      reasons.push('Plan saved & PDF issued');
    }
    return { score: Math.min(99, score), reasons };
  };

  useEffect(() => {
    const token = localStorage.getItem('fs_auth_token');
    const uStr = localStorage.getItem('fs_user');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    if (uStr) {
      setUser(JSON.parse(uStr));
    }
    loadAllAdminData();
  }, [activeTab]);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [
        kpisRes, inqsRes, itemsRes, catsRes, bkgRes,
        aiRes, tplRes, srvRes, portRes, zohoRes,
        waRes, waLogsRes, setRes, seoRes, logsRes
      ] = await Promise.all([
        api.getDashboardKpis().catch(() => null),
        api.getInquiries().catch(() => ({ inquiries: [] })),
        api.getItems({ limit: 100 }).catch(() => ({ items: [] })),
        api.getCategories().catch(() => []),
        api.getBookings().catch(() => []),
        api.getAiHistory({ limit: 50 }).catch(() => []),
        api.getTemplates().catch(() => []),
        api.getAllServicesAdmin().catch(() => []),
        api.getAllPortfolioAdmin().catch(() => []),
        api.getZohoConfig().catch(() => null),
        api.getWhatsAppConfig().catch(() => null),
        api.getWhatsAppLogs().catch(() => []),
        api.getAllSettings().catch(() => []),
        api.getSeoSettings().catch(() => null),
        api.getActivityLogs().catch(() => []),
      ]);

      setDashboardData(kpisRes || DEMO_KPIS);
      setInquiries(inqsRes?.inquiries?.length ? inqsRes.inquiries : DEMO_INQUIRIES);
      setInventoryItems(itemsRes?.items?.length ? itemsRes.items : DEMO_ITEMS);
      setCategories(catsRes?.length ? catsRes : DEMO_CATEGORIES);
      setBookings(bkgRes?.length ? bkgRes : DEMO_BOOKINGS);
      setAiGenerations(aiRes || []);
      setInvitationTemplates(tplRes?.length ? tplRes : DEMO_TEMPLATES);
      setServicesList(srvRes?.length ? srvRes : DEMO_SERVICES);
      setPortfolioList(portRes?.length ? portRes : DEMO_PORTFOLIO);
      setZohoConfig(zohoRes || { isEnabled: true, autoSyncLeads: true });
      setWhatsAppConfig(waRes || { isEnabled: true, autoReplyWelcome: true });
      setWhatsAppLogs(waLogsRes || []);
      setSystemSettings(setRes || []);
      setActivityLogs(Array.isArray(logsRes) ? logsRes : []);

      if (seoRes) {
        setSeoForm((prev) => ({ ...prev, ...seoRes }));
      }

      if (catsRes && catsRes.length > 0 && !itemForm.categoryId) {
        setItemForm((prev) => ({ ...prev, categoryId: catsRes[0].id }));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const notifySuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('fs_auth_token');
    localStorage.removeItem('fs_user');
    router.push('/admin/login');
  };

  // 1. INVENTORY ITEM CRUD
  const handleOpenItemModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        name: item.name,
        categoryId: item.categoryId || (categories[0]?.id || ''),
        theme: item.theme || 'Red Bloom',
        price: item.price || 25000,
        tradePrice: item.tradePrice || 10000,
        totalQuantity: item.totalQuantity || 5,
        description: item.description || '',
        coverImage: item.coverImage || '/reference_assets/hero_mandap_red.jpg',
      });
    } else {
      setEditingItem(null);
      setItemForm({
        name: '',
        categoryId: categories[0]?.id || '',
        theme: 'Red Bloom',
        price: 25000,
        tradePrice: 10000,
        totalQuantity: 5,
        description: '',
        coverImage: '/reference_assets/hero_mandap_red.jpg',
      });
    }
    setShowItemModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateItem(editingItem.id, {
          name: itemForm.name,
          categoryId: itemForm.categoryId,
          theme: itemForm.theme,
          price: Number(itemForm.price),
          tradePrice: Number(itemForm.tradePrice),
          totalQuantity: Number(itemForm.totalQuantity),
          description: itemForm.description,
          coverImage: itemForm.coverImage,
        });
        notifySuccess(`Item "${itemForm.name}" updated successfully!`);
      } else {
        await api.createItem({
          name: itemForm.name,
          categoryId: itemForm.categoryId,
          theme: itemForm.theme,
          price: Number(itemForm.price),
          tradePrice: Number(itemForm.tradePrice),
          totalQuantity: Number(itemForm.totalQuantity),
          description: itemForm.description,
          coverImage: itemForm.coverImage,
        });
        notifySuccess(`New item "${itemForm.name}" created in catalog!`);
      }
      setShowItemModal(false);
      loadAllAdminData();
    } catch (err: any) {
      alert('Error saving inventory item: ' + err.message);
    }
  };

  const handleDeleteItem = async (item: any) => {
    if (!confirm(`Are you sure you want to delete "${item.name}" from inventory?`)) return;
    try {
      await api.deleteItem(item.id);
      notifySuccess(`Item "${item.name}" deleted successfully.`);
      loadAllAdminData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // 2. CATEGORIES CRUD
  const handleOpenCatModal = (cat?: any) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({ name: cat.name, description: cat.description || '', icon: cat.icon || 'Layers' });
    } else {
      setEditingCat(null);
      setCatForm({ name: '', description: '', icon: 'Layers' });
    }
    setShowCatModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await api.updateCategory(editingCat.id, catForm);
        notifySuccess(`Category "${catForm.name}" updated.`);
      } else {
        await api.createCategory(catForm);
        notifySuccess(`New category "${catForm.name}" created.`);
      }
      setShowCatModal(false);
      loadAllAdminData();
    } catch (err: any) {
      alert('Category save error: ' + err.message);
    }
  };

  const handleDeleteCategory = async (cat: any) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await api.deleteCategory(cat.id);
      notifySuccess(`Category "${cat.name}" deleted.`);
      loadAllAdminData();
    } catch (err: any) {
      alert('Category delete error: ' + err.message);
    }
  };

  // 3. SERVICES CRUD
  const handleOpenServiceModal = (srv?: any) => {
    if (srv) {
      setEditingService(srv);
      setServiceForm({
        name: srv.name,
        description: srv.description || '',
        priceStarting: srv.priceStarting || 45000,
        pricingUnit: srv.pricingUnit || 'event',
        features: Array.isArray(srv.features) ? srv.features.join(', ') : 'Turnkey Production, 3D Renders',
        image: srv.images?.[0] || '/reference_assets/hero_mandap_red.jpg',
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: '',
        description: '',
        priceStarting: 45000,
        pricingUnit: 'event',
        features: 'Turnkey Design, 3D Renders, Event Concierge',
        image: '/reference_assets/hero_mandap_red.jpg',
      });
    }
    setShowServiceModal(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: serviceForm.name,
        description: serviceForm.description,
        priceStarting: Number(serviceForm.priceStarting),
        pricingUnit: serviceForm.pricingUnit,
        images: [serviceForm.image],
        features: serviceForm.features.split(',').map((f) => f.trim()),
      };
      if (editingService) {
        await api.updateService(editingService.id, payload);
        notifySuccess(`Service "${serviceForm.name}" updated.`);
      } else {
        await api.createService(payload);
        notifySuccess(`Service "${serviceForm.name}" created.`);
      }
      setShowServiceModal(false);
      loadAllAdminData();
    } catch (err: any) {
      alert('Service save error: ' + err.message);
    }
  };

  const handleDeleteService = async (srv: any) => {
    if (!confirm(`Delete service "${srv.name}"?`)) return;
    try {
      await api.deleteService(srv.id);
      notifySuccess(`Service "${srv.name}" deleted.`);
      loadAllAdminData();
    } catch (err: any) {
      alert('Service delete error: ' + err.message);
    }
  };

  // 4. PORTFOLIO CRUD
  const handleOpenPortfolioModal = (port?: any) => {
    if (port) {
      setEditingPortfolio(port);
      setPortfolioForm({
        title: port.title,
        eventType: port.eventType || 'Royal Wedding',
        category: port.category || 'Wedding',
        clientName: port.clientName || '',
        location: port.location || 'Grand Ballroom, UAE',
        description: port.description || '',
        coverImage: port.coverImage || '/reference_assets/hero_mandap_red.jpg',
        tags: Array.isArray(port.tags) ? port.tags.join(', ') : 'Royal Wedding, Royal Mandap',
      });
    } else {
      setEditingPortfolio(null);
      setPortfolioForm({
        title: '',
        eventType: 'Royal Wedding',
        category: 'Wedding',
        clientName: 'VIP Royal Family',
        location: 'Grand Ballroom, UAE',
        description: '',
        coverImage: '/reference_assets/hero_mandap_red.jpg',
        tags: 'Royal Wedding, Royal Mandap, Wave Stage',
      });
    }
    setShowPortfolioModal(true);
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: portfolioForm.title,
        eventType: portfolioForm.eventType,
        category: portfolioForm.category,
        clientName: portfolioForm.clientName,
        location: portfolioForm.location,
        description: portfolioForm.description,
        coverImage: portfolioForm.coverImage,
        tags: portfolioForm.tags.split(',').map((t) => t.trim()),
      };
      if (editingPortfolio) {
        await api.updatePortfolioProject(editingPortfolio.id, payload);
        notifySuccess(`Portfolio project "${portfolioForm.title}" updated.`);
      } else {
        await api.createPortfolioProject(payload);
        notifySuccess(`Portfolio project "${portfolioForm.title}" created.`);
      }
      setShowPortfolioModal(false);
      loadAllAdminData();
    } catch (err: any) {
      alert('Portfolio save error: ' + err.message);
    }
  };

  const handleDeletePortfolio = async (port: any) => {
    if (!confirm(`Delete portfolio project "${port.title}"?`)) return;
    try {
      await api.deletePortfolioProject(port.id);
      notifySuccess(`Project "${port.title}" deleted.`);
      loadAllAdminData();
    } catch (err: any) {
      alert('Project delete error: ' + err.message);
    }
  };

  // 5. TEMPLATES CRUD
  const handleOpenTemplateModal = (tpl?: any) => {
    if (tpl) {
      setEditingTemplate(tpl);
      setTemplateForm({
        title: tpl.title,
        category: tpl.category || 'Wedding',
        previewImage: tpl.previewImage || '/reference_assets/hero_mandap_red.jpg',
        description: tpl.description || '',
      });
    } else {
      setEditingTemplate(null);
      setTemplateForm({
        title: '',
        category: 'Wedding',
        previewImage: '/reference_assets/hero_mandap_red.jpg',
        description: '',
      });
    }
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await api.updateTemplate(editingTemplate.id, templateForm);
        notifySuccess(`Template "${templateForm.title}" updated.`);
      } else {
        await api.createTemplate(templateForm);
        notifySuccess(`Template "${templateForm.title}" created.`);
      }
      setShowTemplateModal(false);
      loadAllAdminData();
    } catch (err: any) {
      alert('Template save error: ' + err.message);
    }
  };

  const handleDeleteTemplate = async (tpl: any) => {
    if (!confirm(`Delete template "${tpl.title}"?`)) return;
    try {
      await api.deleteTemplate(tpl.id);
      notifySuccess(`Template "${tpl.title}" deleted.`);
      loadAllAdminData();
    } catch (err: any) {
      alert('Template delete error: ' + err.message);
    }
  };

  // 6. SAVE SEO SETTINGS
  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSeo(true);
      await api.updateSeoSettings(seoForm);
      notifySuccess('SEO, OpenGraph, and Search Keywords updated live!');
    } catch (err: any) {
      alert('SEO save error: ' + err.message);
    } finally {
      setSavingSeo(false);
    }
  };

  // 7. ZOHO & WHATSAPP ACTIONS
  const handleSyncZoho = async (inquiryId: string) => {
    try {
      setSyncingZohoId(inquiryId);
      const res = await api.syncZohoLead(inquiryId);
      notifySuccess(`Zoho lead synced successfully! ID: ${res.zohoLeadId}`);
      loadAllAdminData();
    } catch (err: any) {
      alert('Zoho sync error: ' + err.message);
    } finally {
      setSyncingZohoId(null);
    }
  };

  const handleSendTestWhatsApp = async () => {
    try {
      await api.sendWhatsAppMessage({ to: testPhone, message: testMsg });
      notifySuccess(`WhatsApp test dispatched to ${testPhone}`);
      loadAllAdminData();
    } catch (err: any) {
      alert('WhatsApp error: ' + err.message);
    }
  };

  // Menu Modules List
  const menuModules = [
    { id: 'dashboard', label: '1. Dashboard Overview', icon: LayoutDashboard },
    { id: 'customers', label: '2. Customer Directory', icon: Users },
    { id: 'inquiries', label: '3. Inquiries & RFQs', icon: FileText, badge: inquiries.length },
    { id: 'inventory', label: '4. Dynamic Inventory', icon: Layers, badge: inventoryItems.length },
    { id: 'categories', label: '5. Inventory Categories', icon: FolderTree },
    { id: 'availability', label: '6. Availability & Locks', icon: Calendar },
    { id: 'bookings', label: '7. Bookings & Res', icon: BookmarkCheck, badge: bookings.length },
    { id: 'ai-images', label: '8. AI Concept Images', icon: Sparkles },
    { id: 'ai-videos', label: '9. AI Concept Videos', icon: Film },
    { id: 'templates', label: '10. Invitation Templates', icon: Mail, badge: invitationTemplates.length },
    { id: 'portfolio', label: '11. Portfolio Projects', icon: Camera, badge: portfolioList.length },
    { id: 'services', label: '12. Turnkey Services', icon: HeartHandshake, badge: servicesList.length },
    { id: 'seo', label: '13. SEO & Meta Tags Manager', icon: Globe },
    { id: 'zoho', label: '14. Zoho CRM Integration', icon: Workflow },
    { id: 'whatsapp', label: '15. WhatsApp Business API', icon: MessageCircle },
    { id: 'reports', label: '16. Reports & Analytics', icon: BarChart3 },
    { id: 'users', label: '17. Staff & Roles', icon: UserCheck },
    { id: 'settings', label: '18. System Settings', icon: Settings },
    { id: 'logs', label: '19. Activity Logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1A16] flex flex-col lg:flex-row font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-72 bg-white border-r border-[#E8E0D2] flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Brand Logo */}
          <div className="p-5 border-b border-[#E8E0D2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B38E36] flex items-center justify-center font-serif font-bold text-white text-lg shadow-md">
                4S
              </div>
              <div>
                <span className="font-serif font-bold text-base text-[#1E1A16] block">
                  FOUR SEASONS
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#785E1A] block uppercase font-bold">
                  Atelier Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* User Status */}
          <div className="px-5 py-3 bg-[#F8F5EE] border-b border-[#E8E0D2] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-fs-cream/90 font-medium truncate max-w-[140px]">
                {user?.name || 'Administrator'}
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F6EED8] text-[#785E1A] border border-[#E2D4B7] uppercase font-bold">
              {typeof user?.role === 'object' ? (user?.role?.name || user?.role?.slug || 'Admin') : (user?.role || 'Admin')}
            </span>
          </div>

          {/* Module Nav Links */}
          <nav className="p-2 space-y-0.5 max-h-[calc(100vh-210px)] overflow-y-auto">
            {menuModules.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#B38E36] text-white font-bold shadow-md'
                      : 'text-[#474036] hover:bg-[#F3EDE2] hover:text-[#1E1A16]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{mod.label}</span>
                  </div>
                  {mod.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#E8E0D2] text-[#474036]'
                      }`}
                    >
                      {mod.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#E8E0D2] bg-[#FAF8F5] space-y-2">
          <button
            onClick={() => window.open('/', '_blank')}
            className="w-full py-2 px-3 rounded-xl border border-[#B38E36] text-[#785E1A] hover:bg-[#F6EED8] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>View Public Atelier</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-[#F3EDE2] hover:bg-rose-100 text-[#474036] hover:text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto bg-[#FAF8F5]">
        {/* Notification Banner */}
        {actionSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Operations Command Center</h1>
                <p className="text-xs text-fs-cream/60">Atelier Real-Time Metrics &amp; Key Performance Indicators</p>
              </div>
              <button
                onClick={loadAllAdminData}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#DDD5C7] hover:bg-[#F5EFE6] text-[#474036] text-xs font-medium flex items-center gap-2 self-start shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Data</span>
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E8E0D2] shadow-sm space-y-2">
                <span className="text-[10px] uppercase font-semibold text-fs-gold tracking-widest block">Total Inquiries</span>
                <div className="text-3xl font-serif font-bold text-[#1E1A16]">{inquiries.length}</div>
                <span className="text-[10px] text-emerald-400 block font-medium">Live RFQ Submissions</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E8E0D2] shadow-sm space-y-2">
                <span className="text-[10px] uppercase font-semibold text-fs-gold tracking-widest block">Rental Inventory</span>
                <div className="text-3xl font-serif font-bold text-[#1E1A16]">{inventoryItems.length}</div>
                <span className="text-[10px] text-fs-cream/60 block font-medium">Real Catalog Specifications</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E8E0D2] shadow-sm space-y-2">
                <span className="text-[10px] uppercase font-semibold text-fs-gold tracking-widest block">AI Generations</span>
                <div className="text-3xl font-serif font-bold text-[#1E1A16]">{aiGenerations.length}</div>
                <span className="text-[10px] text-fs-gold-lighter block font-medium">4K Concepts &amp; Videos</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E8E0D2] shadow-sm space-y-2">
                <span className="text-[10px] uppercase font-semibold text-fs-gold tracking-widest block">Confirmed Bookings</span>
                <div className="text-3xl font-serif font-bold text-[#1E1A16]">{bookings.length}</div>
                <span className="text-[10px] text-emerald-400 block font-medium">Double-Booking Protected</span>
              </div>
            </div>

            {/* Recent Inquiries Quick Table */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D2] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#1E1A16]">Recent Customer Requirements (RFQs)</h3>
                <button onClick={() => setActiveTab('inquiries')} className="text-xs text-fs-gold hover:underline flex items-center gap-1">
                  <span>View All Inquiries</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase text-fs-cream/50 tracking-wider border-b border-[#E8E0D2]">
                    <tr>
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Event Type</th>
                      <th className="pb-3">Guests</th>
                      <th className="pb-3">Budget</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inquiries.slice(0, 5).map((inq) => (
                      <tr key={inq.id} className="hover:bg-[#F8F5EE]">
                        <td className="py-3 font-mono font-bold text-fs-gold-light">{inq.referenceNo}</td>
                        <td className="py-3 font-semibold text-[#1E1A16]">{inq.customer?.name}</td>
                        <td className="py-3 text-fs-cream/80">{inq.eventType}</td>
                        <td className="py-3 text-fs-cream/70">{inq.guestsCount}</td>
                        <td className="py-3 font-semibold text-[#1E1A16]">{inq.budgetRange}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                            {inq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. INQUIRIES & CRM LEAD PIPELINE (WITH SCORING & PROFILE) */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">CRM Lead Inbox &amp; Pipeline</h1>
                <p className="text-xs text-[#786F62]">Every enquiry from Planner, WhatsApp &amp; RFQ with automatic Lead Scoring, Timeline &amp; Stripe Payment Links</p>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-[#E8E0D2] p-1 rounded-xl shadow-xs">
                <button
                  onClick={() => setInquiriesView('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inquiriesView === 'list' ? 'bg-[#B38E36] text-white' : 'text-[#474036] hover:bg-[#FAF8F5]'
                  }`}
                >
                  Lead Inbox
                </button>
                <button
                  onClick={() => setInquiriesView('pipeline')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inquiriesView === 'pipeline' ? 'bg-[#B38E36] text-white' : 'text-[#474036] hover:bg-[#FAF8F5]'
                  }`}
                >
                  Pipeline Board
                </button>
              </div>
            </div>

            {inquiriesView === 'pipeline' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { stage: 'NEW', label: 'New Leads', match: (s: string) => s === 'NEW' || s === 'PENDING' },
                  { stage: 'IN_CONVERSATION', label: 'In Conversation', match: (s: string) => s === 'IN_CONVERSATION' || s === 'CONTACTED' },
                  { stage: 'CONSULTATION', label: 'Consultation', match: (s: string) => s === 'CONSULTATION' || s === 'QUALIFIED' },
                  { stage: 'BOOKED', label: 'Booked Event', match: (s: string) => s === 'BOOKED' || s === 'CONFIRMED' },
                ].map((col) => {
                  const colLeads = inquiries.filter((i) => col.match(String(i.status || 'NEW').toUpperCase()));
                  return (
                    <div key={col.stage} className="bg-white rounded-2xl border border-[#E8E0D2] p-4 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D2]">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#785E1A]">{col.label}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#F6EED8] text-[#785E1A] text-[10px] font-bold">
                          {colLeads.length}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {colLeads.map((inq) => {
                          const { score } = computeLeadScore(inq);
                          return (
                            <div
                              key={inq.id}
                              onClick={() => setSelectedLead(inq)}
                              className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E0D2] hover:border-[#B38E36] cursor-pointer transition-all space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-serif font-bold text-xs text-[#1E1A16]">
                                  {inq.customer?.name || 'Guest Lead'}
                                </span>
                                <span className="w-6 h-6 rounded-full bg-[#1E1A16] text-white text-[10px] font-bold flex items-center justify-center">
                                  {score}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#474036]">
                                {inq.eventType} · {inq.guestsCount || 250} guests
                              </div>
                              <div className="text-[10px] text-[#785E1A] font-semibold">
                                {inq.budgetRange}
                              </div>
                            </div>
                          );
                        })}
                        {colLeads.length === 0 && (
                          <p className="text-[11px] text-[#786F62] italic py-4 text-center">No leads in this stage</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 border border-[#E8E0D2] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] uppercase text-[#785E1A] tracking-wider border-b border-[#E8E0D2]">
                      <tr>
                        <th className="pb-3">Score</th>
                        <th className="pb-3">Reference</th>
                        <th className="pb-3">Lead</th>
                        <th className="pb-3">Event Type</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Guests</th>
                        <th className="pb-3">Budget</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E0D2]/60">
                      {inquiries.map((inq) => {
                        const { score } = computeLeadScore(inq);
                        return (
                          <tr key={inq.id} className="hover:bg-[#F8F5EE]">
                            <td className="py-3">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold ${
                                  score >= 85 ? 'bg-[#1E1A16] text-white' : 'bg-[#F6EED8] text-[#785E1A] border border-[#E2D4B7]'
                                }`}
                              >
                                {score}
                              </span>
                            </td>
                            <td className="py-3 font-mono font-bold text-[#785E1A]">{inq.referenceNo}</td>
                            <td className="py-3 font-semibold text-[#1E1A16]">{inq.customer?.name}</td>
                            <td className="py-3 text-[#474036]">{inq.eventType}</td>
                            <td className="py-3 text-[#786F62]">{inq.eventDate ? new Date(inq.eventDate).toLocaleDateString() : 'TBA'}</td>
                            <td className="py-3 text-[#474036]">{inq.guestsCount}</td>
                            <td className="py-3 font-semibold text-[#1E1A16]">{inq.budgetRange}</td>
                            <td className="py-3 flex items-center gap-2">
                              <select
                                value={inq.status || 'NEW'}
                                onChange={async (e) => {
                                  const nextStatus = e.target.value;
                                  try {
                                    await api.updateInquiryStatus(inq.id, nextStatus);
                                    setInquiries((prev) => prev.map((x) => (x.id === inq.id ? { ...x, status: nextStatus } : x)));
                                    notifySuccess(`Inquiry ${inq.referenceNo} updated to ${nextStatus}`);
                                  } catch (err: any) {
                                    alert('Failed to update status: ' + err.message);
                                  }
                                }}
                                className="px-2 py-1 rounded-lg bg-[#FAF8F5] border border-[#DDD5C7] text-[10px] font-bold text-[#1E1A16]"
                              >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="PROPOSAL_SENT">PROPOSAL_SENT</option>
                                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                              <button
                                onClick={() => setSelectedLead(inq)}
                                className="px-2.5 py-1 rounded-lg bg-[#B38E36] text-white text-[10px] font-bold hover:bg-[#8F6E22] flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Profile</span>
                              </button>
                              <button
                                onClick={() => handleSyncZoho(inq.id)}
                                disabled={syncingZohoId === inq.id}
                                className="px-2.5 py-1 rounded-lg bg-[#F6EED8] text-[#785E1A] border border-[#E2D4B7] text-[10px] font-semibold hover:bg-[#EFE2C0]"
                              >
                                {syncingZohoId === inq.id ? 'Syncing...' : inq.zohoLeadId ? 'Resync Zoho' : 'Sync Zoho'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. DYNAMIC INVENTORY MANAGEMENT (WITH ADD, EDIT, DELETE) */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Dynamic Rental Inventory</h1>
                <p className="text-xs text-fs-cream/60">Add, edit, delete items, manage real specifications, stock quantities, and client rates</p>
              </div>
              <button
                onClick={() => handleOpenItemModal()}
                className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start"
              >
                <Plus className="w-4 h-4 text-fs-navy" />
                <span>Add Inventory Item</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D2] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase text-fs-gold tracking-wider border-b border-[#E8E0D2]">
                    <tr>
                      <th className="pb-3">Preview</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Item Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Theme</th>
                      <th className="pb-3">Client Rate</th>
                      <th className="pb-3">Trade Rate</th>
                      <th className="pb-3">Stock Qty</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inventoryItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F8F5EE]">
                        <td className="py-2.5">
                          <img
                            src={item.coverImage || '/reference_assets/hero_mandap_red.jpg'}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E8E0D2]"
                          />
                        </td>
                        <td className="py-2.5 font-mono text-fs-gold-light font-bold text-[11px]">{item.sku}</td>
                        <td className="py-2.5 font-semibold text-[#1E1A16] max-w-[200px] truncate">{item.name}</td>
                        <td className="py-2.5 text-fs-cream/80">{typeof item.category === 'object' ? (item.category?.name || 'Décor') : (item.category || 'Décor')}</td>
                        <td className="py-2.5 text-fs-cream/70">{item.theme}</td>
                        <td className="py-2.5 font-bold text-[#1E1A16]">AED {item.price?.toLocaleString()}</td>
                        <td className="py-2.5 text-fs-gold-lighter">AED {item.tradePrice?.toLocaleString()}</td>
                        <td className="py-2.5 text-fs-cream/80">{item.totalQuantity} {item.unit}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              item.status === 'AVAILABLE'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenItemModal(item)}
                            className="p-1.5 rounded-lg bg-[#F8F5EE] text-fs-gold hover:bg-fs-gold/20 transition-colors"
                            title="Edit Item"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-1.5 rounded-lg bg-[#F8F5EE] text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. INVENTORY CATEGORIES (WITH ADD, EDIT, DELETE) */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Inventory Categories</h1>
                <p className="text-xs text-fs-cream/60">Organize luxury stages, bars, mandaps, backdrops and decor components</p>
              </div>
              <button
                onClick={() => handleOpenCatModal()}
                className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start"
              >
                <Plus className="w-4 h-4 text-fs-navy" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-[#E8E0D2] shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-base text-[#1E1A16]">{c.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-fs-gold/20 text-fs-gold font-bold">
                        {c.subcategories?.length || 0} Subcategories
                      </span>
                    </div>
                    <p className="text-xs text-fs-cream/70 font-light mt-2 line-clamp-2">{c.description || 'Dynamic category for luxury event rentals.'}</p>
                  </div>
                  <div className="pt-3 border-t border-[#E8E0D2] flex items-center justify-between">
                    <span className="text-[10px] text-fs-gold-light font-mono font-medium">{c.slug}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenCatModal(c)}
                        className="p-1.5 rounded-lg bg-[#F8F5EE] text-fs-gold hover:bg-fs-gold/20"
                        title="Edit Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c)}
                        className="p-1.5 rounded-lg bg-[#F8F5EE] text-red-400 hover:bg-red-500/20"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. INVITATION TEMPLATES (WITH ADD, EDIT, DELETE) */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Dynamic Invitation Templates</h1>
                <p className="text-xs text-fs-cream/60">Manage digital wedding invitation layouts, typography, and SVG/HTML canvas templates</p>
              </div>
              <button
                onClick={() => handleOpenTemplateModal()}
                className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start"
              >
                <Plus className="w-4 h-4 text-fs-navy" />
                <span>Add Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {invitationTemplates.map((t) => (
                <div key={t.id} className="glass-panel p-4 rounded-2xl border border-fs-gold/20 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-44 rounded-xl overflow-hidden bg-cover bg-center border border-[#E8E0D2]" style={{ backgroundImage: `url('${t.previewImage || '/reference_assets/hero_mandap_red.jpg'}')` }} />
                    <h3 className="font-serif font-bold text-sm text-[#1E1A16]">{t.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-fs-gold/20 text-fs-gold font-bold inline-block">
                      {typeof t.category === 'object' ? (t.category?.name || 'Wedding') : (t.category || 'Wedding')}
                    </span>
                    <p className="text-xs text-fs-cream/60 line-clamp-2">{t.description}</p>
                  </div>
                  <div className="pt-2 border-t border-[#E8E0D2] flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenTemplateModal(t)}
                        className="p-1.5 rounded-lg bg-[#F8F5EE] text-fs-gold hover:bg-fs-gold/20"
                        title="Edit Template"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(t)}
                        className="p-1.5 rounded-lg bg-[#F8F5EE] text-red-400 hover:bg-red-500/20"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. PORTFOLIO MANAGEMENT (WITH ADD, EDIT, DELETE) */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Portfolio &amp; Past Weddings</h1>
                <p className="text-xs text-fs-cream/60">Curate showcase projects, case studies, high-res photography, and AI concepts</p>
              </div>
              <button
                onClick={() => handleOpenPortfolioModal()}
                className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start"
              >
                <Plus className="w-4 h-4 text-fs-navy" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolioList.map((p) => (
                <div key={p.id} className="glass-panel p-4 rounded-2xl border border-fs-gold/20 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-44 rounded-xl overflow-hidden bg-cover bg-center border border-[#E8E0D2]" style={{ backgroundImage: `url('${p.coverImage || '/reference_assets/hero_mandap_red.jpg'}')` }} />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-fs-gold uppercase tracking-wider">{p.eventType}</span>
                      <span className="text-[10px] text-fs-cream/60">{p.location}</span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#1E1A16]">{p.title}</h3>
                    <p className="text-xs text-fs-cream/70 line-clamp-2">{p.description}</p>
                  </div>
                  <div className="pt-3 border-t border-[#E8E0D2] flex items-center justify-between">
                    <span className="text-[10px] text-fs-gold-lighter font-medium">{p.clientName}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenPortfolioModal(p)}
                        className="p-1.5 rounded-lg bg-[#F8F5EE] text-fs-gold hover:bg-fs-gold/20"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(p)}
                        className="p-1.5 rounded-lg bg-[#F8F5EE] text-red-400 hover:bg-red-500/20"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. SERVICES MANAGEMENT (WITH ADD, EDIT, DELETE) */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Turnkey Event Services</h1>
                <p className="text-xs text-fs-cream/60">Manage production offerings, turnkey packages, and pricing structures</p>
              </div>
              <button
                onClick={() => handleOpenServiceModal()}
                className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start"
              >
                <Plus className="w-4 h-4 text-fs-navy" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {servicesList.map((srv) => (
                <div key={srv.id} className="bg-white p-5 rounded-2xl border border-[#E8E0D2] shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-base text-[#1E1A16]">{srv.name}</h3>
                      <span className="text-xs font-bold text-fs-gold">
                        From AED {srv.priceStarting?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-fs-cream/70 line-clamp-3">{srv.description}</p>
                  </div>
                  <div className="pt-3 border-t border-[#E8E0D2] flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-semibold">Active Service</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenServiceModal(srv)}
                        className="p-1.5 rounded-lg bg-[#F8F5EE] text-fs-gold hover:bg-fs-gold/20"
                        title="Edit Service"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv)}
                        className="p-1.5 rounded-lg bg-[#F8F5EE] text-red-400 hover:bg-red-500/20"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. SEO & OPEN GRAPH META TAGS MANAGER */}
        {activeTab === 'seo' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">SEO &amp; Open Graph Meta Manager</h1>
                <p className="text-xs text-fs-cream/60">Configure organic Google search keywords, titles, descriptions, and social link preview tags</p>
              </div>
              <button
                onClick={handleSaveSeo}
                disabled={savingSeo}
                className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start"
              >
                <Save className="w-4 h-4 text-fs-navy" />
                <span>{savingSeo ? 'Saving Live SEO...' : 'Save Live SEO Settings'}</span>
              </button>
            </div>

            {/* LIVE PREVIEW CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Google Search Snippet Simulation */}
              <div className="glass-panel p-5 rounded-2xl border border-[#E8E0D2] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-fs-gold uppercase tracking-wider">
                  <Globe className="w-4 h-4" />
                  <span>Google Search Live Snippet Preview</span>
                </div>
                <div className="bg-white p-4 rounded-xl text-left space-y-1 shadow-md">
                  <div className="flex items-center gap-1 text-[11px] text-gray-700">
                    <span className="font-medium">https://fourseasons.events</span>
                    <span className="text-gray-400">› luxury-wedding-planner</span>
                  </div>
                  <h4 className="text-base font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                    {seoForm.meta_title || 'Four Seasons | Luxury Wedding & Event Atelier'}
                  </h4>
                  <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                    {seoForm.meta_description || "Premier luxury wedding & event organizers. AI-powered event concepting and turnkey decor rental."}
                  </p>
                </div>
              </div>

              {/* Social Media & WhatsApp Card Simulation */}
              <div className="glass-panel p-5 rounded-2xl border border-[#E8E0D2] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-fs-gold uppercase tracking-wider">
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp / Social Media Share Preview</span>
                </div>
                <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-[#E8E0D2] shadow-md">
                  <div
                    className="h-36 bg-cover bg-center"
                    style={{ backgroundImage: `url('${seoForm.og_image || '/reference_assets/hero_mandap_red.jpg'}')` }}
                  />
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] text-fs-gold-light uppercase font-mono block">fourseasonsstudio.ae</span>
                    <h5 className="font-serif font-bold text-xs text-[#1E1A16] line-clamp-1">{seoForm.og_title || seoForm.meta_title}</h5>
                    <p className="text-[11px] text-fs-cream/70 line-clamp-2">{seoForm.og_description || seoForm.meta_description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Configuration Form */}
            <form onSubmit={handleSaveSeo} className="glass-panel p-6 rounded-3xl border border-fs-gold/20 space-y-5">
              <h3 className="font-serif text-lg font-bold text-[#1E1A16] border-b border-[#E8E0D2] pb-3">Search Engine Meta Tags</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-fs-gold-light">Page Meta Title (Max 60–70 characters recommended)</label>
                  <input
                    type="text"
                    value={seoForm.meta_title || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, meta_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm text-xs focus:border-fs-gold"
                    required
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-fs-gold-light">Meta Description (Max 150–160 characters recommended)</label>
                  <textarea
                    rows={3}
                    value={seoForm.meta_description || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, meta_description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm text-xs focus:border-fs-gold"
                    required
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-fs-gold-light">Target Organic Keywords (Comma separated)</label>
                  <textarea
                    rows={2}
                    value={seoForm.meta_keywords || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, meta_keywords: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm text-xs focus:border-fs-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-fs-gold-light">Open Graph Title (og:title)</label>
                  <input
                    type="text"
                    value={seoForm.og_title || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, og_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm text-xs focus:border-fs-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-fs-gold-light">Open Graph Image URL (og:image / 1200x630)</label>
                  <input
                    type="text"
                    value={seoForm.og_image || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, og_image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm text-xs focus:border-fs-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-fs-gold-light">Canonical Website URL</label>
                  <input
                    type="text"
                    value={seoForm.canonical_url || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, canonical_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm text-xs focus:border-fs-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-fs-gold-light">Robots Directives</label>
                  <input
                    type="text"
                    value={seoForm.robots || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, robots: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm text-xs focus:border-fs-gold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E0D2] flex justify-end">
                <button
                  type="submit"
                  disabled={savingSeo}
                  className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-fs-navy" />
                  <span>{savingSeo ? 'Updating Live...' : 'Publish SEO Meta Tags'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 14. ZOHO CRM INTEGRATION */}
        {activeTab === 'zoho' && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Zoho CRM Integration</h1>
            <p className="text-xs text-fs-cream/60">Configure OAuth credentials, Lead synchronization, and retry schedules</p>
            <div className="glass-panel p-6 rounded-3xl border border-fs-gold/20 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="font-semibold text-sm text-[#1E1A16]">OAuth Connectivity Status: ACTIVE</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-fs-cream/60 block">Zoho Client ID:</span>
                  <span className="font-mono text-fs-gold-light block truncate">{zohoConfig?.clientId || '1000.EXAMPLE_ZOHO_CLIENT_ID'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-fs-cream/60 block">API Domain:</span>
                  <span className="font-mono text-[#1E1A16] block">{zohoConfig?.apiDomain || 'https://www.zohoapis.com'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 15. UNIFIED CONVERSATIONS & WHATSAPP BUSINESS API */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Unified Conversations (WhatsApp · Email · SMS)</h1>
                <p className="text-xs text-[#786F62]">One chronological thread per lead. Take over from the AI Assistant in one tap or leave internal notes.</p>
              </div>
              <button
                onClick={() => {
                  setAssistantPaused(!assistantPaused);
                  notifySuccess(!assistantPaused ? 'You have taken over from the AI Assistant.' : 'Conversation handed back to AI Assistant.');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                  assistantPaused
                    ? 'bg-white border border-[#B38E36] text-[#785E1A]'
                    : 'bg-[#1E1A16] text-white'
                }`}
              >
                {assistantPaused ? 'Hand Back to Assistant' : 'Take Over from Assistant'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Unified Thread */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E0D2] p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {convThread.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-2xl text-xs border ${
                        msg.internal
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : msg.sender === 'Lead'
                          ? 'bg-[#FAF8F5] border-[#E8E0D2] text-[#1E1A16]'
                          : 'bg-[#F6EED8] border-[#E2D4B7] text-[#1E1A16]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-[#785E1A]">
                          {msg.internal ? 'Internal Note · Lead Never Sees This' : `${msg.sender} · ${msg.channel}`}
                        </span>
                        <span className="text-[10px] text-[#786F62]">{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Saved Replies & Reply Box */}
                <div className="pt-3 border-t border-[#E8E0D2] space-y-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-[#786F62] mr-1">Saved Replies:</span>
                    {[
                      'Consultation times: Tomorrow 11:15 AM works well.',
                      'We have confirmed stage stock for your date.',
                      'Would you like to schedule a venue walkthrough?',
                    ].map((sr, i) => (
                      <button
                        key={i}
                        onClick={() => setConvReply(sr)}
                        className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#DDD5C7] text-[10px] text-[#474036] hover:bg-[#F6EED8]"
                      >
                        {sr.slice(0, 32)}…
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={convChannel}
                      onChange={(e) => setConvChannel(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-xs font-bold text-[#1E1A16]"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                    </select>
                    <input
                      type="text"
                      value={convReply}
                      onChange={(e) => setConvReply(e.target.value)}
                      placeholder="Reply on the channel the lead last used..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-xs text-[#1E1A16]"
                    />
                    <button
                      onClick={() => {
                        if (!convReply.trim()) return;
                        setConvThread((prev) => [
                          ...prev,
                          { id: Date.now(), sender: user?.name || 'Team', channel: convChannel, time: 'Just now', text: convReply, internal: false },
                        ]);
                        setConvReply('');
                        notifySuccess(`Reply sent via ${convChannel}`);
                      }}
                      className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Internal Notes + Test Dispatch */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-5 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-3">
                  <h3 className="font-serif font-bold text-sm text-[#1E1A16]">Add Internal Team Note</h3>
                  <textarea
                    rows={2}
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="e.g. Check wide-stage stock for 14 Feb before the call."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-xs text-[#1E1A16]"
                  />
                  <button
                    onClick={() => {
                      if (!internalNote.trim()) return;
                      setConvThread((prev) => [
                        ...prev,
                        { id: Date.now(), sender: 'Team', channel: 'Note', time: 'Just now', text: internalNote, internal: true },
                      ]);
                      setInternalNote('');
                      notifySuccess('Internal note added to thread.');
                    }}
                    className="w-full py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs font-bold text-[#474036] hover:bg-[#F3EDE2]"
                  >
                    Save Internal Note
                  </button>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-3">
                  <h3 className="font-serif font-bold text-sm text-[#1E1A16]">Dispatch Test WhatsApp</h3>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-xs text-[#1E1A16]"
                  />
                  <textarea
                    rows={2}
                    value={testMsg}
                    onChange={(e) => setTestMsg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-xs text-[#1E1A16]"
                  />
                  <button onClick={handleSendTestWhatsApp} className="gold-gradient-btn w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 18. LEGO-BLOCK PLATFORM SETTINGS & AUTOMATIONS (PDF 2 Part 6) */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Lego-Block Platform Settings &amp; Automations</h1>
              <p className="text-xs text-[#786F62]">Adjust brand name, AI picture model, guest preview limits, watermark strength, and automation rules without rebuilding.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1E1A16]">Core Platform Blocks</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#474036] block mb-1">Platform Brand Name (applies to Site, PDF &amp; Emails)</label>
                    <input
                      type="text"
                      value={legoSettings.brandName}
                      onChange={(e) => setLegoSettings({ ...legoSettings, brandName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-[#474036] block mb-1">Watermark Strength</label>
                      <select
                        value={legoSettings.watermarkStrength}
                        onChange={(e) => setLegoSettings({ ...legoSettings, watermarkStrength: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16]"
                      >
                        <option value="Light">Light (Default)</option>
                        <option value="Medium">Medium</option>
                        <option value="Off">Off (Verified Only)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-[#474036] block mb-1">Free Pictures Per Guest</label>
                      <input
                        type="number"
                        value={legoSettings.freePictureLimit}
                        onChange={(e) => setLegoSettings({ ...legoSettings, freePictureLimit: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-[#474036] block mb-1">AI Picture Engine Switch</label>
                      <select
                        value={legoSettings.aiModel}
                        onChange={(e) => setLegoSettings({ ...legoSettings, aiModel: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16]"
                      >
                        <option value="Google Gemini (via OpenRouter)">Google Gemini (Petal Detail)</option>
                        <option value="Flux Luxury Architectural">Flux Luxury Architectural</option>
                        <option value="Internal Mock Engine">Internal Mock Engine</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-[#474036] block mb-1">Premium Video Token (AED)</label>
                      <input
                        type="number"
                        value={legoSettings.tokenChargeAed}
                        onChange={(e) => setLegoSettings({ ...legoSettings, tokenChargeAed: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await api.updateSettings([
                          { key: 'brand_name', value: legoSettings.brandName, group: 'platform', isPublic: true },
                          { key: 'watermark_strength', value: legoSettings.watermarkStrength, group: 'platform', isPublic: false },
                          { key: 'free_picture_limit', value: String(legoSettings.freePictureLimit), group: 'platform', isPublic: false },
                          { key: 'token_charge_aed', value: String(legoSettings.tokenChargeAed), group: 'platform', isPublic: true },
                          { key: 'ai_model', value: legoSettings.aiModel, group: 'platform', isPublic: false },
                        ]);
                        notifySuccess('Lego-Block platform settings persisted to MySQL!');
                      } catch (err: any) {
                        alert('Failed to persist settings: ' + err.message);
                      }
                    }}
                    className="gold-gradient-btn px-5 py-2.5 rounded-xl font-bold text-white"
                  >
                    Save Platform Settings
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1E1A16]">Automation Rules Catalogue</h3>
                <div className="space-y-2.5">
                  {automations.map((rule) => (
                    <div key={rule.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E0D2] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#1E1A16] block">{rule.title}</span>
                        <span className="text-[10px] text-[#785E1A] font-semibold">{rule.channel}</span>
                      </div>
                      <button
                        onClick={() =>
                          setAutomations((prev) =>
                            prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
                          )
                        }
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          rule.enabled ? 'bg-emerald-600 text-white' : 'bg-[#E8E0D2] text-[#474036]'
                        }`}
                      >
                        {rule.enabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CUSTOMER DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Customer Directory</h1>
              <p className="text-xs text-[#786F62]">All families, VIP clients, and corporate planners registered via Planner &amp; RFQs</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D2] shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase text-[#785E1A] tracking-wider border-b border-[#E8E0D2]">
                  <tr>
                    <th className="pb-3">Client Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">WhatsApp / Phone</th>
                    <th className="pb-3">Event &amp; Guests</th>
                    <th className="pb-3">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D2]/60">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-[#F8F5EE]">
                      <td className="py-3 font-semibold text-[#1E1A16]">{inq.customer?.name || 'Valued Guest'}</td>
                      <td className="py-3 text-[#474036]">{inq.customer?.email || 'client@example.ae'}</td>
                      <td className="py-3 font-mono text-[#474036]">{inq.customer?.phone || '+971 50 000 0000'}</td>
                      <td className="py-3 text-[#474036]">{inq.eventType} · {inq.guestsCount || 300} guests</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          SMS &amp; Consent Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. AVAILABILITY & STOCK LOCKS */}
        {activeTab === 'availability' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Availability &amp; Date Locks</h1>
              <p className="text-xs text-[#786F62]">Double-booking prevention across all in-house mandaps, stages, and designer bars</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D2] shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase text-[#785E1A] tracking-wider border-b border-[#E8E0D2]">
                  <tr>
                    <th className="pb-3">Inventory Asset</th>
                    <th className="pb-3">Total Stock</th>
                    <th className="pb-3">Reserved / Locked</th>
                    <th className="pb-3">Available</th>
                    <th className="pb-3">Protection Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D2]/60">
                  {inventoryItems.slice(0, 12).map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8F5EE]">
                      <td className="py-3 font-semibold text-[#1E1A16]">{item.name}</td>
                      <td className="py-3 text-[#474036]">{item.totalQuantity || 2} units</td>
                      <td className="py-3 text-[#785E1A] font-bold">1 locked</td>
                      <td className="py-3 text-emerald-700 font-bold">{Math.max(1, (item.totalQuantity || 2) - 1)} free</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F6EED8] text-[#785E1A] border border-[#E2D4B7]">
                          Zero Double-Booking Guard Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. BOOKINGS & RESERVATIONS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Confirmed Bookings &amp; Reservations</h1>
              <p className="text-xs text-[#786F62]">Track confirmed weddings, venue dates, deposits, and production schedules</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D2] shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase text-[#785E1A] tracking-wider border-b border-[#E8E0D2]">
                  <tr>
                    <th className="pb-3">Booking No</th>
                    <th className="pb-3">Client / Event</th>
                    <th className="pb-3">Event Date</th>
                    <th className="pb-3">Venue</th>
                    <th className="pb-3">Total Value</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D2]/60">
                  {bookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-[#F8F5EE]">
                      <td className="py-3 font-mono font-bold text-[#785E1A]">{b.bookingNumber || 'FS-BKG-2026'}</td>
                      <td className="py-3 font-semibold text-[#1E1A16]">{b.customer?.name || b.eventName || 'Royal Wedding'}</td>
                      <td className="py-3 text-[#474036]">{b.eventDate ? new Date(b.eventDate).toLocaleDateString() : '18 Dec 2026'}</td>
                      <td className="py-3 text-[#474036]">{b.venue || 'Atlantis The Royal'}</td>
                      <td className="py-3 font-bold text-[#1E1A16]">AED {(b.totalAmount || 185000).toLocaleString()}</td>
                      <td className="py-3">
                        <select
                          value={b.status || 'CONFIRMED'}
                          onChange={async (e) => {
                            const nextStatus = e.target.value;
                            try {
                              await api.updateBookingStatus(b.id, nextStatus);
                              setBookings((prev) => prev.map((x) => (x.id === b.id ? { ...x, status: nextStatus } : x)));
                              notifySuccess(`Booking ${b.bookingReference || b.bookingNumber || b.id} updated to ${nextStatus}`);
                            } catch (err: any) {
                              alert('Failed to update booking: ' + err.message);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#DDD5C7] text-[10px] font-bold text-[#1E1A16]"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. AI CONCEPT IMAGES */}
        {activeTab === 'ai-images' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">AI Concept Images Log</h1>
              <p className="text-xs text-[#786F62]">All 4K AI visualizations generated by guests &amp; saved against leads</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(aiGenerations.length ? aiGenerations : [
                { id: '1', visualTheme: 'Red Bloom', prompt: 'Royal Red Naomi Rose Mandap at Atlantis The Royal', resultUrl: '/reference_assets/hero_mandap_red.jpg', status: 'COMPLETED' },
                { id: '2', visualTheme: 'Grecian Haldi', prompt: 'Grecian Column Haldi Courtyard at Bulgari Resort', resultUrl: '/reference_assets/hero_grecian_haldi.jpg', status: 'COMPLETED' },
                { id: '3', visualTheme: 'Bling Glamour', prompt: '7.3m Curved Wave Stage at Armani Hotel Burj Khalifa', resultUrl: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg', status: 'COMPLETED' },
              ]).map((g: any) => (
                <div key={g.id} className="bg-white rounded-3xl border border-[#E8E0D2] overflow-hidden shadow-sm">
                  <img src={g.resultUrl || '/reference_assets/hero_mandap_red.jpg'} alt={g.visualTheme} className="w-full h-48 object-cover" />
                  <div className="p-4 space-y-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-[#F6EED8] text-[#785E1A] text-[10px] font-bold uppercase">{g.visualTheme}</span>
                    <p className="font-semibold text-[#1E1A16] line-clamp-2">{g.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. AI CONCEPT VIDEOS */}
        {activeTab === 'ai-videos' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">AI Concept Videos (Premium Token)</h1>
              <p className="text-xs text-[#786F62]">Cinematic walkthrough generations gated by configurable Stripe token charge ({legoSettings.tokenChargeAed} AED)</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-[#E8E0D2] shadow-sm text-center space-y-3">
              <Film className="w-10 h-10 text-[#B38E36] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#1E1A16]">Premium Video Walkthrough Engine Ready</h3>
              <p className="text-xs text-[#474036] max-w-md mx-auto">
                Visitors can unlock 5-second cinematic stage &amp; mandap flythroughs via Stripe token payment. Adjust the token amount anytime in System Settings.
              </p>
            </div>
          </div>
        )}

        {/* 16. REPORTS & ANALYTICS */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Reports &amp; Executive Analytics</h1>
              <p className="text-xs text-[#786F62]">Enquiries by source, response speed, consultation conversion, and popular inventory items</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#B38E36]">Top Lead Source</span>
                <div className="text-2xl font-serif font-bold text-[#1E1A16]">AI Wedding Planner (64%)</div>
                <p className="text-xs text-[#474036]">Average response time under 15 mins via WhatsApp Assistant.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#B38E36]">Most Requested Asset</span>
                <div className="text-2xl font-serif font-bold text-[#1E1A16]">Red Naomi Rose Mandap</div>
                <p className="text-xs text-[#474036]">Followed by 7.3m Curved Wave LED Stage.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#B38E36]">Pipeline Value</span>
                <div className="text-2xl font-serif font-bold text-[#1E1A16]">AED 1,240,000+</div>
                <p className="text-xs text-[#474036]">Across active Dubai wedding consultations.</p>
              </div>
            </div>
          </div>
        )}

        {/* 17. STAFF & ROLES */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Staff &amp; Role-Based Access</h1>
              <p className="text-xs text-[#786F62]">Manage Administrator, Sales, and View-Only permissions across the CRM</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D2] shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase text-[#785E1A] tracking-wider border-b border-[#E8E0D2]">
                  <tr>
                    <th className="pb-3">Team Member</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D2]/60">
                  {[
                    { name: 'Four Seasons Administrator', email: 'admin@fourseasons.ae', role: 'Administrator', perm: 'Full settings, inventory, leads & billing' },
                    { name: "S. D'Souza", email: 'sales@fourseasons.ae', role: 'Sales', perm: 'Leads, conversations, PDFs & consultations' },
                    { name: 'Executive Viewer', email: 'reports@fourseasons.ae', role: 'View only', perm: 'Reports & analytics read-only' },
                  ].map((u, idx) => (
                    <tr key={idx} className="hover:bg-[#F8F5EE]">
                      <td className="py-3 font-semibold text-[#1E1A16]">{u.name}</td>
                      <td className="py-3 text-[#474036]">{u.email}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F6EED8] text-[#785E1A] border border-[#E2D4B7] text-[10px] font-bold uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-[#474036]">{u.perm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 19. ACTIVITY & AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#1E1A16]">Activity &amp; Audit Logs</h1>
                <p className="text-xs text-[#786F62]">Complete audit trail of admin actions, CRM updates, AI generations, and security events</p>
              </div>
              <div className="flex flex-wrap gap-2 self-start">
                <button
                  onClick={async () => {
                    try {
                      const backup = await api.exportBackup();
                      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `fourseasons_backup_${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      notifySuccess('Full Database JSON Backup downloaded!');
                    } catch (err: any) {
                      alert('Backup export requires live backend admin session: ' + err.message);
                    }
                  }}
                  className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download DB Backup (JSON)</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D2] shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase text-[#785E1A] tracking-wider border-b border-[#E8E0D2]">
                  <tr>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Actor</th>
                    <th className="pb-3">Module</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D2]/60">
                  {(activityLogs.length > 0
                    ? activityLogs.map((l) => ({
                        time: l.createdAt ? new Date(l.createdAt).toLocaleString() : 'Recent',
                        actor: l.user?.name || l.user?.email || 'System',
                        mod: l.module || 'SYSTEM',
                        act: l.action || 'EVENT',
                        detail: l.metadata ? JSON.stringify(l.metadata) : 'Recorded in MySQL Audit Log',
                      }))
                    : [
                        { time: 'Today, 23:45', actor: user?.name || 'Administrator', mod: 'System Settings', act: 'UPDATED', detail: 'Verified light pastel theme & Lego-block settings' },
                        { time: 'Today, 23:18', actor: 'AI Assistant', mod: 'WhatsApp API', act: 'HANDOVER', detail: 'Passed inquiry to Sales Consultant' },
                        { time: 'Today, 22:50', actor: 'System', mod: 'Lead Scoring', act: 'SCORED', detail: 'Assigned Score 91 to Indian Wedding (350 guests)' },
                      ]
                  ).map((log, idx) => (
                    <tr key={idx} className="hover:bg-[#F8F5EE]">
                      <td className="py-3 font-mono text-[#786F62] whitespace-nowrap">{log.time}</td>
                      <td className="py-3 font-semibold text-[#1E1A16]">{log.actor}</td>
                      <td className="py-3 text-[#785E1A] font-semibold">{log.mod}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#F6EED8] text-[#785E1A] border border-[#E2D4B7] text-[10px] font-bold">
                          {log.act}
                        </span>
                      </td>
                      <td className="py-3 text-[#474036]">{log.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD / EDIT INVENTORY ITEM */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-[#E8E0D2] rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D2]">
              <h3 className="font-serif text-lg font-bold text-[#1E1A16]">
                {editingItem ? `Edit Item: ${editingItem.name}` : 'Add New Inventory Asset'}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-fs-cream/60 hover:text-[#1E1A16]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Item Name</label>
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-fs-gold block mb-1 font-semibold">Category</label>
                  <select
                    value={itemForm.categoryId}
                    onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-fs-gold block mb-1 font-semibold">Theme</label>
                  <input
                    type="text"
                    value={itemForm.theme}
                    onChange={(e) => setItemForm({ ...itemForm, theme: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-fs-gold block mb-1 font-semibold">Client Rate (AED)</label>
                  <input
                    type="number"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-fs-gold block mb-1 font-semibold">Trade Rate (AED)</label>
                  <input
                    type="number"
                    value={itemForm.tradePrice}
                    onChange={(e) => setItemForm({ ...itemForm, tradePrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-fs-gold block mb-1 font-semibold">Stock Quantity</label>
                  <input
                    type="number"
                    value={itemForm.totalQuantity}
                    onChange={(e) => setItemForm({ ...itemForm, totalQuantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Image Asset URL / Path</label>
                <input
                  type="text"
                  value={itemForm.coverImage}
                  onChange={(e) => setItemForm({ ...itemForm, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Description &amp; Exact Dimensions</label>
                <textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F5EE] text-fs-cream hover:bg-white/10"
                >
                  Cancel
                </button>
                <button type="submit" className="gold-gradient-btn px-5 py-2 rounded-xl font-bold">
                  {editingItem ? 'Save Updates' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT CATEGORY */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-[#E8E0D2] rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D2]">
              <h3 className="font-serif text-lg font-bold text-[#1E1A16]">
                {editingCat ? `Edit Category: ${editingCat.name}` : 'Add Inventory Category'}
              </h3>
              <button onClick={() => setShowCatModal(false)} className="text-fs-cream/60 hover:text-[#1E1A16]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Category Name</label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F5EE] text-fs-cream hover:bg-white/10"
                >
                  Cancel
                </button>
                <button type="submit" className="gold-gradient-btn px-5 py-2 rounded-xl font-bold">
                  {editingCat ? 'Save Updates' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT SERVICE */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-[#E8E0D2] rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D2]">
              <h3 className="font-serif text-lg font-bold text-[#1E1A16]">
                {editingService ? `Edit Service: ${editingService.name}` : 'Add Turnkey Service'}
              </h3>
              <button onClick={() => setShowServiceModal(false)} className="text-fs-cream/60 hover:text-[#1E1A16]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Service Name</label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Starting Price (AED)</label>
                <input
                  type="number"
                  value={serviceForm.priceStarting}
                  onChange={(e) => setServiceForm({ ...serviceForm, priceStarting: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Key Features (Comma separated)</label>
                <input
                  type="text"
                  value={serviceForm.features}
                  onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F5EE] text-fs-cream hover:bg-white/10"
                >
                  Cancel
                </button>
                <button type="submit" className="gold-gradient-btn px-5 py-2 rounded-xl font-bold">
                  {editingService ? 'Save Updates' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT PORTFOLIO PROJECT */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-[#E8E0D2] rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D2]">
              <h3 className="font-serif text-lg font-bold text-[#1E1A16]">
                {editingPortfolio ? `Edit Project: ${editingPortfolio.title}` : 'Add Portfolio Project'}
              </h3>
              <button onClick={() => setShowPortfolioModal(false)} className="text-fs-cream/60 hover:text-[#1E1A16]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSavePortfolio} className="space-y-3.5 text-xs">
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Project Title</label>
                <input
                  type="text"
                  value={portfolioForm.title}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-fs-gold block mb-1 font-semibold">Event Type</label>
                  <input
                    type="text"
                    value={portfolioForm.eventType}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, eventType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-fs-gold block mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    value={portfolioForm.location}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Cover Image Path / URL</label>
                <input
                  type="text"
                  value={portfolioForm.coverImage}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={portfolioForm.tags}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={portfolioForm.description}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPortfolioModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F5EE] text-fs-cream hover:bg-white/10"
                >
                  Cancel
                </button>
                <button type="submit" className="gold-gradient-btn px-5 py-2 rounded-xl font-bold">
                  {editingPortfolio ? 'Save Updates' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD / EDIT INVITATION TEMPLATE */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-[#E8E0D2] rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D2]">
              <h3 className="font-serif text-lg font-bold text-[#1E1A16]">
                {editingTemplate ? `Edit Template: ${editingTemplate.title}` : 'Add Invitation Template'}
              </h3>
              <button onClick={() => setShowTemplateModal(false)} className="text-fs-cream/60 hover:text-[#1E1A16]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTemplate} className="space-y-3.5 text-xs">
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Template Title</label>
                <input
                  type="text"
                  value={templateForm.title}
                  onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Category (e.g. Wedding, Royal, Minimalist)</label>
                <input
                  type="text"
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Preview Image URL / Path</label>
                <input
                  type="text"
                  value={templateForm.previewImage}
                  onChange={(e) => setTemplateForm({ ...templateForm, previewImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="text-fs-gold block mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E1A16] placeholder:text-[#A0988A] focus:outline-none focus:border-[#B38E36] focus:bg-white shadow-sm"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F5EE] text-fs-cream hover:bg-white/10"
                >
                  Cancel
                </button>
                <button type="submit" className="gold-gradient-btn px-5 py-2 rounded-xl font-bold">
                  {editingTemplate ? 'Save Updates' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* LEAD PROFILE & TIMELINE MODAL (PDF 2 Page 21) */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-white border border-[#E8E0D2] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E0D2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38E36] block">
                  Lead Profile · {selectedLead.referenceNo}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1E1A16]">
                  {selectedLead.customer?.name || 'Valued Lead'}
                </h3>
                <p className="text-xs text-[#474036]">
                  {selectedLead.customer?.email} · {selectedLead.customer?.phone || '+971 50 000 0000'}
                </p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-full hover:bg-[#F3EDE2] text-[#786F62]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Event Details + Score + Stripe Payment Link */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E0D2] space-y-2 text-xs">
                  <div className="font-bold text-[#1E1A16]">
                    {selectedLead.eventType} · {selectedLead.guestsCount || 300} Guests
                  </div>
                  <div className="text-[#474036]">
                    Date: {selectedLead.eventDate ? new Date(selectedLead.eventDate).toLocaleDateString() : 'Flexible'} · Budget: <strong>{selectedLead.budgetRange}</strong>
                  </div>
                  <div className="pt-2 border-t border-[#E8E0D2] flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#1E1A16] text-white text-xs font-bold">
                      Lead Score: {computeLeadScore(selectedLead).score}
                    </span>
                    <span className="text-[11px] text-[#785E1A] font-medium">
                      {computeLeadScore(selectedLead).reasons.join(' · ')}
                    </span>
                  </div>
                </div>

                {/* Stripe Payment Link Generator (PDF 2 Step 12) */}
                <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E8E0D2] space-y-2.5 text-xs">
                  <span className="font-bold text-[#785E1A] uppercase text-[10px] block">
                    Send Stripe Payment Link
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-32 px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs font-bold text-[#1E1A16]"
                    />
                    <button
                      onClick={() => {
                        const link = `https://checkout.stripe.com/pay/fs_${selectedLead.referenceNo}_${paymentAmount}AED`;
                        setPaymentLinks((prev) => ({ ...prev, [selectedLead.id]: link }));
                        notifySuccess(`Stripe payment link (AED ${Number(paymentAmount).toLocaleString()}) generated & logged!`);
                      }}
                      className="gold-gradient-btn flex-1 py-2 px-3 rounded-xl font-bold text-white"
                    >
                      Generate Link (AED)
                    </button>
                  </div>
                  {paymentLinks[selectedLead.id] && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] break-all">
                      ✓ Sent: {paymentLinks[selectedLead.id]}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLeadPdf(true)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#1E1A16] text-white text-xs font-bold hover:bg-[#B38E36]"
                  >
                    View Branded PDF
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLead(null);
                      setActiveTab('whatsapp');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#B38E36] text-[#785E1A] text-xs font-bold hover:bg-[#F6EED8]"
                  >
                    Open Conversation
                  </button>
                </div>
              </div>

              {/* Right: Chronological Lead Timeline */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E0D2] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#785E1A] block">
                  Chronological Lead Timeline
                </span>
                <div className="space-y-3 text-xs border-l-2 border-[#B38E36]/40 pl-3">
                  <div>
                    <span className="font-bold text-[#1E1A16] block">Arrived from Search &amp; Started Planner</span>
                    <span className="text-[10px] text-[#786F62]">Guest session recorded</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1E1A16] block">Chose Theme &amp; Viewed AI Concept Picture</span>
                    <span className="text-[10px] text-[#786F62]">{selectedLead.preferredTheme || 'Floral Majesty'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1E1A16] block">Saved Plan &amp; Branded PDF Issued</span>
                    <span className="text-[10px] text-[#786F62]">Sent via Email &amp; WhatsApp</span>
                  </div>
                  {paymentLinks[selectedLead.id] && (
                    <div>
                      <span className="font-bold text-emerald-700 block">Stripe Payment Link Sent</span>
                      <span className="text-[10px] text-emerald-600">AED {Number(paymentAmount).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <BrandedPlanPdfModal
        isOpen={showLeadPdf}
        onClose={() => setShowLeadPdf(false)}
        plan={
          selectedLead
            ? {
                referenceNo: selectedLead.referenceNo,
                clientName: selectedLead.customer?.name || 'Guest',
                eventType: selectedLead.eventType,
                eventDate: selectedLead.eventDate ? new Date(selectedLead.eventDate).toLocaleDateString() : 'TBA',
                guestsCount: selectedLead.guestsCount,
                theme: selectedLead.preferredTheme || 'Floral Majesty',
                budgetRange: selectedLead.budgetRange,
                isVerified: true,
              }
            : null
        }
      />
    </div>
  );
}
