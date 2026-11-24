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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug ? slug.join('/') : '';
  const searchParams = req.nextUrl.searchParams;

  // 1. Auth Profile
  if (path === 'auth/profile') {
    return NextResponse.json({
      id: 'admin-001',
      name: 'Four Seasons Administrator',
      email: 'admin@fourseasons.ae',
      role: { slug: 'admin', name: 'Administrator' },
    });
  }

  // 2. Inventory Categories
  if (path === 'inventory/categories') {
    return NextResponse.json(DEMO_CATEGORIES);
  }

  // 3. Inventory Items
  if (path === 'inventory/items') {
    const categoryParam = searchParams.get('category');
    const themeParam = searchParams.get('theme');
    const searchParam = searchParams.get('search');

    let filtered = [...DEMO_ITEMS];

    if (categoryParam && categoryParam !== 'All') {
      filtered = filtered.filter(
        (i) => i.category.name.toLowerCase() === categoryParam.toLowerCase() ||
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
  if (path === 'analytics/dashboard') {
    return NextResponse.json(DEMO_KPIS);
  }

  // 5. Inquiries
  if (path === 'inquiries') {
    return NextResponse.json({ inquiries: DEMO_INQUIRIES, total: DEMO_INQUIRIES.length });
  }

  // 6. Bookings
  if (path === 'bookings') {
    return NextResponse.json(DEMO_BOOKINGS);
  }

  // 7. Invitations Templates
  if (path === 'invitations/templates') {
    return NextResponse.json(DEMO_TEMPLATES);
  }

  // 8. Services
  if (path === 'services' || path === 'services/all') {
    return NextResponse.json(DEMO_SERVICES);
  }

  // 9. Portfolio
  if (path === 'portfolio' || path === 'portfolio/all') {
    return NextResponse.json(DEMO_PORTFOLIO);
  }

  // 10. Settings & SEO
  if (path === 'settings/seo' || path === 'settings/all' || path === 'settings/public') {
    return NextResponse.json({
      meta_title: 'Four Seasons | Luxury Wedding & Event Atelier',
      meta_description: 'Premier luxury wedding & event organizers. AI-powered event concepting, authentic rental mandaps, wave screen stages, Versace bars, and turnkey celebrations.',
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

  // 11. AI History
  if (path === 'ai/history') {
    return NextResponse.json([]);
  }

  // 12. Zoho & WhatsApp configs
  if (path === 'zoho/config') {
    return NextResponse.json({ isEnabled: true, autoSyncLeads: true });
  }
  if (path === 'whatsapp/config') {
    return NextResponse.json({ isEnabled: true, autoReplyWelcome: true });
  }
  if (path === 'whatsapp/logs') {
    return NextResponse.json([]);
  }

  return NextResponse.json({ status: 'ok', path });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug ? slug.join('/') : '';
  let body: any = {};
  try {
    body = await req.json();
  } catch (_) {}

  // 1. Auth Login
  if (path === 'auth/login') {
    const { email, password } = body;
    // Allow admin credentials
    if (
      (email?.toLowerCase().includes('admin') || email === 'admin@fourseasons.ae' || email === 'admin@fourseasons.com') &&
      (password === 'Admin@123' || password === 'FourSeasons@2026' || password?.length >= 6)
    ) {
      return NextResponse.json({
        accessToken: 'fs_live_secure_admin_token_2026',
        user: {
          id: 'admin-001',
          name: 'Four Seasons Administrator',
          email: email || 'admin@fourseasons.ae',
          role: { slug: 'admin', name: 'Administrator' },
        },
      });
    }

    return NextResponse.json(
      { message: 'Invalid credentials. Use admin@fourseasons.ae / Admin@123' },
      { status: 401 }
    );
  }

  // 2. AI Image Generation
  if (path === 'ai/generate-image') {
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
  if (path === 'ai/chat') {
    return NextResponse.json({
      reply: `Welcome to Four Seasons. I am your AI Event Concierge. Our atelier inventory features authentic rental wave stages, royal mandaps, and bespoke production across all luxury venues. How may I assist your celebration?`,
    });
  }

  // 4. Inquiries Submit
  if (path === 'inquiries/submit') {
    return NextResponse.json({
      success: true,
      referenceNo: 'FS-REQ-' + Date.now().toString().slice(-6),
      message: 'Inquiry registered with Four Seasons Concierge.',
    });
  }

  // 5. Bookings Create
  if (path === 'bookings/create') {
    return NextResponse.json({
      success: true,
      bookingNumber: 'FS-BKG-' + Date.now().toString().slice(-6),
      message: 'Booking created successfully.',
    });
  }

  // 6. Settings SEO update
  if (path === 'settings/seo' || path === 'settings/update') {
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully.',
    });
  }

  // Default POST response
  return NextResponse.json({ success: true, path });
}
