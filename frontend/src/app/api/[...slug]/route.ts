import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname.replace(/^\/api\/?/, '');
    const searchParams = req.nextUrl.searchParams;

    // 1. Auth Profile
    if (pathname === 'auth/profile') {
      return NextResponse.json({
        id: 'admin-001',
        name: 'Four Seasons Administrator',
        email: 'admin@fourseasons.ae',
        role: 'Administrator',
      });
    }

    // 2. Inventory Categories
    if (pathname === 'inventory/categories') {
      return NextResponse.json(DEMO_CATEGORIES);
    }

    // 3. Inventory Items
    if (pathname === 'inventory/items') {
      const categoryParam = searchParams.get('category');
      const themeParam = searchParams.get('theme');
      const searchParam = searchParams.get('search');

      let filtered = [...DEMO_ITEMS];

      if (categoryParam && categoryParam !== 'All') {
        filtered = filtered.filter(
          (i) =>
            i.category.name.toLowerCase() === categoryParam.toLowerCase() ||
            i.category.slug.toLowerCase() === categoryParam.toLowerCase()
        );
      }
      if (themeParam && themeParam !== 'All') {
        filtered = filtered.filter((i) => i.theme.toLowerCase() === themeParam.toLowerCase());
      }
      if (searchParam) {
        const q = searchParam.toLowerCase();
        filtered = filtered.filter(
          (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
        );
      }

      return NextResponse.json({
        items: filtered,
        total: filtered.length,
        page: 1,
        limit: 100,
      });
    }

    // 4. Analytics KPI
    if (pathname === 'analytics/dashboard') {
      return NextResponse.json(DEMO_KPIS);
    }

    // 5. Inquiries
    if (pathname === 'inquiries') {
      return NextResponse.json({ inquiries: DEMO_INQUIRIES, total: DEMO_INQUIRIES.length });
    }

    // 6. Bookings
    if (pathname === 'bookings') {
      return NextResponse.json(DEMO_BOOKINGS);
    }

    // 7. Invitations Templates
    if (pathname === 'invitations/templates') {
      return NextResponse.json(DEMO_TEMPLATES);
    }

    // 8. Services
    if (pathname === 'services' || pathname === 'services/all') {
      return NextResponse.json(DEMO_SERVICES);
    }

    // 9. Portfolio
    if (pathname === 'portfolio' || pathname === 'portfolio/all') {
      return NextResponse.json(DEMO_PORTFOLIO);
    }

    // 10. Settings & SEO
    if (pathname === 'settings/seo' || pathname === 'settings/all' || pathname === 'settings/public') {
      return NextResponse.json({
        meta_title: 'Four Seasons | Luxury Wedding & Event Atelier',
        meta_description:
          'Premier luxury wedding & event organizers. AI-powered event concepting, authentic rental mandaps, wave screen stages, Versace bars, and turnkey celebrations.',
        meta_keywords: 'luxury wedding planner, royal mandap, wave stage, event organizers, four seasons',
        og_title: 'Four Seasons — Bespoke Luxury Celebrations & Weddings',
        og_description: 'Design your dream celebration with AI precision and authentic luxury atelier inventory.',
        og_image: '/reference_assets/hero_mandap_red.jpg',
        twitter_card: 'summary_large_image',
        canonical_url: 'https://fourseasons.events',
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        author: 'Four Seasons Events Organizers LLC',
        google_verification: 'google-site-verification-token-fourseasons',
        locale: 'en_AE',
        geo_region: 'AE',
        geo_placename: 'Luxury Events Atelier',
        brand_name: 'Four Seasons',
        brand_tagline: 'Luxury Weddings & Events Atelier',
      });
    }

    // 11. AI History & Status
    if (pathname === 'ai/history') {
      return NextResponse.json([]);
    }
    if (pathname.startsWith('ai/status/')) {
      return NextResponse.json({
        id: pathname.split('/').pop(),
        status: 'COMPLETED',
        resultUrl: DEMO_ITEMS[3]?.coverImage || '/reference_assets/hero_mandap_red.jpg',
        provider: 'Four Seasons Gemini AI Engine',
        prompt: 'Luxury Four Seasons Event Atelier Concept',
      });
    }

    // 12. Zoho & WhatsApp
    if (pathname === 'zoho/config') {
      return NextResponse.json({ isEnabled: true, autoSyncLeads: true });
    }
    if (pathname === 'whatsapp/config') {
      return NextResponse.json({ isEnabled: true, autoReplyWelcome: true });
    }
    if (pathname === 'whatsapp/logs') {
      return NextResponse.json([]);
    }

    return NextResponse.json({ status: 'ok', pathname });
  } catch (err: any) {
    return NextResponse.json({ status: 'fallback', message: err?.message || 'ok' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname.replace(/^\/api\/?/, '');
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {}

    // 1. Auth Login
    if (pathname === 'auth/login') {
      const email = body?.email || 'admin@fourseasons.ae';
      return NextResponse.json({
        accessToken: 'fs_live_secure_admin_token_2026',
        user: {
          id: 'admin-001',
          name: 'Four Seasons Administrator',
          email: email,
          role: 'Administrator',
        },
      });
    }

    // 2. AI Image Generation
    if (pathname === 'ai/generate-image') {
      const matchedItem = DEMO_ITEMS.find((it) => body.itemIds?.includes(it.id)) || DEMO_ITEMS[3];
      return NextResponse.json({
        id: 'gen-' + Date.now(),
        status: 'COMPLETED',
        resultUrl: matchedItem.coverImage,
        prompt: body.prompt || 'Luxury Four Seasons Event Atelier Concept',
        visualTheme: body.visualTheme || 'Red Bloom',
      });
    }

    // 3. AI Concierge Chat
    if (pathname === 'ai/chat') {
      return NextResponse.json({
        reply: `Welcome to Four Seasons. I am your AI Event Concierge. Our atelier inventory features authentic rental wave stages, royal mandaps, and bespoke production across all luxury venues. How may I assist your celebration?`,
      });
    }

    // 4. Inquiries Submit
    if (pathname === 'inquiries/submit') {
      return NextResponse.json({
        success: true,
        referenceNo: 'FS-REQ-' + Date.now().toString().slice(-6),
        message: 'Inquiry registered with Four Seasons Concierge.',
      });
    }

    // 5. Bookings Create
    if (pathname === 'bookings/create') {
      return NextResponse.json({
        success: true,
        bookingNumber: 'FS-BKG-' + Date.now().toString().slice(-6),
        message: 'Booking created successfully.',
      });
    }

    // 6. Settings SEO update
    if (pathname === 'settings/seo' || pathname === 'settings/update') {
      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully.',
      });
    }

    return NextResponse.json({ success: true, pathname });
  } catch (err: any) {
    return NextResponse.json({ success: true, message: err?.message || 'ok' });
  }
}
