import { PrismaClient, InventoryStatus, InquiryStatus, BookingStatus, PaymentStatus, AiGenType, AiGenStatus, ItemRoleInGen } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Four Seasons Database Seed ---');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Administrator',
      slug: 'admin',
      description: 'Super Administrator with full access across all 19 modules',
      permissions: { all: true, manage_users: true, manage_inventory: true, manage_ai: true, manage_integrations: true }
    }
  });

  const managerRole = await prisma.role.upsert({
    where: { slug: 'manager' },
    update: {},
    create: {
      name: 'Event Operations Manager',
      slug: 'manager',
      description: 'Manages bookings, availability, inquiries, and customer communication',
      permissions: { manage_inventory: true, manage_bookings: true, view_analytics: true }
    }
  });

  const designerRole = await prisma.role.upsert({
    where: { slug: 'designer' },
    update: {},
    create: {
      name: 'Creative & AI Designer',
      slug: 'designer',
      description: 'Generates creative combinations, manages templates, and AI concepts',
      permissions: { manage_ai: true, manage_invitations: true }
    }
  });

  const customerRole = await prisma.role.upsert({
    where: { slug: 'customer' },
    update: {},
    create: {
      name: 'Client',
      slug: 'customer',
      description: 'Prospective or confirmed event client',
      permissions: { view_portal: true, create_inquiry: true, build_invitation: true }
    }
  });

  // 2. Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const managerPassword = await bcrypt.hash('Manager@123', salt);

  await prisma.user.upsert({
    where: { email: 'admin@fourseasons.ae' },
    update: { passwordHash: adminPassword },
    create: {
      name: 'Four Seasons Administrator',
      email: 'admin@fourseasons.ae',
      phone: '+971 4 398 2211',
      passwordHash: adminPassword,
      roleId: adminRole.id,
      isActive: true
    }
  });

  await prisma.user.upsert({
    where: { email: 'manager@fourseasons.ae' },
    update: { passwordHash: managerPassword },
    create: {
      name: 'Operations Manager',
      email: 'manager@fourseasons.ae',
      phone: '+971 50 123 4567',
      passwordHash: managerPassword,
      roleId: managerRole.id,
      isActive: true
    }
  });

  console.log('Seeded Roles and Users successfully');

  // 3. System Settings
  const settings = [
    { key: 'brand_name', value: 'Four Seasons', group: 'branding', desc: 'Platform Brand Name' },
    { key: 'brand_tagline', value: 'Luxury Weddings & Events Atelier', group: 'branding', desc: 'Hero Brand Tagline' },
    { key: 'default_currency', value: 'AED', group: 'finance', desc: 'Base Operational Currency' },
    { key: 'contact_email', value: 'concierge@fourseasons.com', group: 'general', desc: 'Primary Contact Email' },
    { key: 'contact_phone', value: '+971 4 398 2211', group: 'general', desc: 'Concierge Telephone' },
    { key: 'whatsapp_number', value: '+971 50 882 2026', group: 'integrations', desc: 'Official WhatsApp Business Number' },
    { key: 'ai_active_provider', value: 'modular_mock', group: 'ai', desc: 'Active AI Generation Provider' },
    { key: 'enable_double_booking_prevention', value: 'true', group: 'inventory', desc: 'Strict transactional conflict check for inventory dates' },
    { key: 'vat_percentage', value: '5', group: 'finance', desc: 'UAE Standard VAT percentage' },
    { key: 'seo_meta_title', value: 'Four Seasons | Luxury Wedding & Event Atelier', group: 'seo', desc: 'Primary Search Engine Meta Title' },
    { key: 'seo_meta_description', value: "Premier luxury wedding & event organizers. AI-powered event concepting, authentic rental mandaps, wave screen stages, Versace bars, and turnkey celebrations.", group: 'seo', desc: 'Primary Search Engine Meta Description' },
    { key: 'seo_meta_keywords', value: 'luxury wedding planner, royal mandap, wave stage, event organizers, four seasons', group: 'seo', desc: 'Target Organic Search Keywords' },
    { key: 'seo_og_title', value: 'Four Seasons — Bespoke Luxury Celebrations & Weddings', group: 'seo', desc: 'OpenGraph Social Share Title' },
    { key: 'seo_og_description', value: 'Design your dream celebration with AI precision and authentic luxury atelier inventory.', group: 'seo', desc: 'OpenGraph Social Share Description' },
    { key: 'seo_og_image', value: '/reference_assets/hero_mandap_red.jpg', group: 'seo', desc: 'OpenGraph & Twitter Preview Image' },
    { key: 'seo_twitter_card', value: 'summary_large_image', group: 'seo', desc: 'Twitter Card Preview Type' },
    { key: 'seo_canonical_url', value: 'https://fourseasons.events', group: 'seo', desc: 'Canonical URL' },
    { key: 'seo_robots', value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', group: 'seo', desc: 'Search Robot Index Directives' },
    { key: 'seo_author', value: 'Four Seasons Events Organizers LLC', group: 'seo', desc: 'Website Author / Entity' },
    { key: 'seo_google_verification', value: 'google-site-verification-token-fourseasons', group: 'seo', desc: 'Google Search Console Verification Tag' },
    { key: 'seo_geo_region', value: 'AE', group: 'seo', desc: 'Geographic Region Code' },
    { key: 'seo_geo_placename', value: 'Luxury Events Atelier', group: 'seo', desc: 'Geographic City & Country' }
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { settingKey: s.key },
      update: { settingValue: s.value },
      create: {
        settingKey: s.key,
        settingValue: s.value,
        group: s.group,
        description: s.desc,
        isPublic: true
      }
    });
  }

  // 4. Categories & Subcategories
  const categoryDefs = [
    {
      name: 'Mandap',
      slug: 'mandap',
      desc: 'Sacred ceremonial mandaps featuring hand-carved pillars, fresh red blooms, and draped silks',
      icon: 'HeartHandshake',
      image: '/reference_assets/hero_mandap_red.jpg',
      subs: ['Floral Mandaps', 'Draped Silk Mandaps', 'Beachfront Mandaps', 'Contemporary Geometrics']
    },
    {
      name: 'Stage & Backdrop',
      slug: 'stage-backdrop',
      desc: 'Grand reception stages, shimmer sequin walls, structural architectural backdrops, and jali fretwork',
      icon: 'Sparkles',
      image: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
      subs: ['Mirror Stages', 'LED Shimmer Stages', 'Flower Walls', 'Grecian Columns', 'Wave Screen Stages', 'Moorish Jali Arches', 'French Window Backdrops', 'Geometric Frame Stages']
    },
    {
      name: 'Floral Décor',
      slug: 'floral-decor',
      desc: 'Imported Dutch florals, cascading table runners, hanging chandeliers, and aisle installations',
      icon: 'Flower2',
      image: '/reference_assets/hero_floral_majesty.jpg',
      subs: ['Table Centrepieces', 'Aisle Runners', 'Hanging Floral Installations', 'Entrance Blooms']
    },
    {
      name: 'Entrance & Walkway',
      slug: 'entrance-walkway',
      desc: 'Immersive welcome arches, illuminated mirror carpet walkways, and floral tunnels',
      icon: 'DoorOpen',
      image: '/reference_assets/hero_bling.jpg',
      subs: ['Floral Arches', 'Mirror Aisle Carpets', 'Grand Welcome Portals']
    },
    {
      name: 'Bar & Beverage Stations',
      slug: 'bar-beverage-stations',
      desc: 'Custom designer bar counters including Art Deco gold, Versace medallion, Mediterranean azulejo tile, and lotus brocade',
      icon: 'Wine',
      image: '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg',
      subs: ['Art Deco Bar', 'Versace Medallion Bar', 'Mediterranean Tile Bar', 'Royal Lotus Brocade Bar', 'Velvet Draped Bar']
    },
    {
      name: 'Photobooths & Backdrops',
      slug: 'photobooths-backdrops',
      desc: 'Instagram-worthy photo moments, traditional Arabic carpet corners, rustic monogram wood walls, and tropical neon setups',
      icon: 'Camera',
      image: '/catalog/fs_catalog_01_photobooth_carpet_arabic.jpg',
      subs: ['Arabic Heritage Photobooth', 'Arched Calligraphy Wall', 'Tropical Neon Photobooth', 'Rustic Wood Photo Wall', 'Bienvenue Memory Wall']
    },
    {
      name: 'Welcome Boards & Signage',
      slug: 'welcome-boards-signage',
      desc: 'Ornate gold baroque mirror signage, acrylic floral easels, brass stand welcome boards, and festive direction posts',
      icon: 'Signpost',
      image: '/catalog/fs_catalog_06_welcome_board_gold_mirror_pedestal.jpg',
      subs: ['Baroque Mirror Signs', 'Acrylic Floral Easels', 'Brass Frame Boards', 'Festive Direction Signage', 'Beach Ceremony Signage']
    },
    {
      name: 'Ceremonial Swings (Jhoola)',
      slug: 'ceremonial-swings-jhoola',
      desc: 'Traditional royal wooden hand-carved swings (Jhoola) draped in magenta and teal silks crowned with floral canopies',
      icon: 'Palmtree',
      image: '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg',
      subs: ['Royal Floral Swing', 'Teal & Magenta Mehendi Jhoola', 'Garden Bloom Swing']
    },
    {
      name: 'Lighting & Ambience',
      slug: 'lighting-ambience',
      desc: 'Architectural mood lighting, fairy light canopies, warm pin-spotting, and intelligent beam heads',
      icon: 'Sun',
      image: '/reference_assets/slide_neon.jpg',
      subs: ['Fairy Light Canopies', 'Architectural Uplighting', 'Intelligent Beams', 'Chandelier Clusters']
    },
    {
      name: 'Sound & AV',
      slug: 'sound-av',
      desc: 'L-Acoustics precision sound arrays, wireless audio, and 4K LED video backdrops',
      icon: 'Volume2',
      image: '/reference_assets/slide_entertainment.jpg',
      subs: ['Concert Line Array', 'DJ Backline Systems', 'LED Video Displays']
    },
    {
      name: 'Special Effects',
      slug: 'special-effects',
      desc: 'Indoor pyrotechnic cold sparkular fountains, dry-ice cloud fog, and holographic monograms',
      icon: 'Flame',
      image: '/reference_assets/slide_sufi.jpg',
      subs: ['Cold Sparkular Fountains', 'Low-Fog Dancing on Clouds', 'Confetti Blasters']
    },
    {
      name: 'Entertainment',
      slug: 'entertainment',
      desc: 'Symphonic fusion quartets, Arabic oud ensembles, sufi performers, and international DJs',
      icon: 'Music',
      image: '/reference_assets/slide_entertainment.jpg',
      subs: ['Live Fusion Bands', 'Sufi & Qawwali Artists', 'Luxury Wedding DJs']
    },
    {
      name: 'Lounge & Furniture',
      slug: 'lounge-furniture',
      desc: 'Bespoke royal velvet chesterfields, gold-plated chiavari chairs, and VIP majlis lounges',
      icon: 'Armchair',
      image: '/reference_assets/hero_pastel.jpg',
      subs: ['Royal Velvet Sofas', 'Chiavari Dining Chairs', 'Cocktail High Tables']
    }
  ];

  const catMap: Record<string, string> = {};
  const subMap: Record<string, string> = {};

  for (let i = 0; i < categoryDefs.length; i++) {
    const c = categoryDefs[i];
    const createdCat = await prisma.inventoryCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.desc, image: c.image, icon: c.icon, sortOrder: i },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.desc,
        icon: c.icon,
        image: c.image,
        sortOrder: i,
        isActive: true
      }
    });
    catMap[c.name] = createdCat.id;

    for (let j = 0; j < c.subs.length; j++) {
      const subName = c.subs[j];
      const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const createdSub = await prisma.inventorySubcategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: createdCat.id,
            slug: subSlug
          }
        },
        update: { name: subName, sortOrder: j },
        create: {
          categoryId: createdCat.id,
          name: subName,
          slug: subSlug,
          sortOrder: j,
          isActive: true
        }
      });
      subMap[`${c.name}::${subName}`] = createdSub.id;
    }
  }

  // 5. Inventory Items (Combining Reference Core + 15 User Uploaded Catalog Spec Sheets)
  const items = [
    // Core Mandaps
    {
      sku: 'FS-MAN-001',
      name: 'Royal Red Floral Mandap',
      slug: 'royal-red-floral-mandap',
      cat: 'Mandap',
      sub: 'Floral Mandaps',
      theme: 'Red Bloom',
      image: '/reference_assets/hero_mandap_red.jpg',
      price: 45000,
      unit: 'each',
      trade: 18000,
      tradeCat: 'Décor',
      qty: 3,
      status: InventoryStatus.AVAILABLE,
      desc: 'Bespoke red velvet draped ceremonial mandap crowned with thousands of fresh Dutch Red Naomi roses, jasmine strands, and integrated warm spotlighting.',
      specs: { dimensions: '6m x 6m x 4.5m', setupTimeHours: 6, weightKg: 850, powerRequired: '16A single phase' },
      tags: ['mandap', 'wedding', 'royal', 'red bloom', 'roses', 'traditional']
    },
    {
      sku: 'FS-MAN-002',
      name: 'Pastel Blossom Floral Mandap',
      slug: 'pastel-blossom-floral-mandap',
      cat: 'Mandap',
      sub: 'Floral Mandaps',
      theme: 'Floral Majesty',
      image: '/reference_assets/hero_floral_majesty.jpg',
      price: 38000,
      unit: 'each',
      trade: 15000,
      tradeCat: 'Décor',
      qty: 2,
      status: InventoryStatus.LIMITED,
      desc: 'Soft blush pink, cream hydrangea, and garden rose floral mandap with open pavilion design for panoramic photography.',
      specs: { dimensions: '5.5m x 5.5m x 4m', setupTimeHours: 5, weightKg: 700 },
      tags: ['mandap', 'pastel', 'floral majesty', 'romantic', 'day wedding']
    },
    {
      sku: 'FS-MAN-003',
      name: 'Beachfront Drape Pavilion Mandap',
      slug: 'beachfront-drape-mandap',
      cat: 'Mandap',
      sub: 'Beachfront Mandaps',
      theme: 'Boho',
      image: '/reference_assets/slide_boho.jpg',
      price: 42000,
      unit: 'each',
      trade: 16500,
      tradeCat: 'Décor',
      qty: 2,
      status: InventoryStatus.AVAILABLE,
      desc: 'Airy linen sheer draped mandap anchored with dried pampas grass, driftwood accents, and tropical monstera arrangements.',
      specs: { dimensions: '5m x 5m x 3.8m', setupTimeHours: 4, windRatedKmh: 45 },
      tags: ['beach', 'boho', 'outdoor', 'destination', 'drape']
    },

    // 15 Four Seasons Catalog Specification Items (from client upload)
    {
      sku: 'FS-STG-005',
      name: 'Stepped Organic Curved Wave Screen Stage (7.3m)',
      slug: 'stepped-organic-wave-screen-stage',
      cat: 'Stage & Backdrop',
      sub: 'Wave Screen Stages',
      theme: 'Bling',
      image: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
      price: 68000,
      unit: 'each',
      trade: 28000,
      tradeCat: 'Staging & Trussing',
      qty: 2,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Architectural Design: 7.3m Stage with central 2.5m x 2.5m LED screen flanked by organic stepped golden wave fluted wings (Height 270cm, Width 185cm) and floral clusters.',
      specs: { stageWidth: '7.3m', screenDimensions: '2.5m x 2.5m', wingHeight: '270cm', wingWidth: '185cm', finish: 'Metallic Brushed Champagne Gold' },
      tags: ['stage', 'wave screen', 'curved', '4s catalog', 'led screen', 'luxury']
    },
    {
      sku: 'FS-STG-006',
      name: 'Moorish Arched Candlelight Band Stage (11m)',
      slug: 'moorish-arched-candlelight-stage',
      cat: 'Stage & Backdrop',
      sub: 'Moorish Jali Arches',
      theme: 'Sufi Traditional',
      image: '/catalog/fs_catalog_09_stage_moorish_arch_star_minimalist.jpg',
      price: 62000,
      unit: 'each',
      trade: 25000,
      tradeCat: 'Staging & Trussing',
      qty: 2,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Architectural Design: 11-metre wide Moorish arch backdrop (Height 350cm, 5 panels of W 184cm x H 82cm) with tiered staircase candle glow riser and live orchestra setup.',
      specs: { totalWidth: '1100cm', totalHeight: '350cm', panelWidth: '184cm', panelArchHeight: '82cm', candleRiserWidth: '11m' },
      tags: ['moorish', 'arch', 'candlelight', 'orchestra', 'sufi', 'arabic']
    },
    {
      sku: 'FS-STG-007',
      name: 'Haldi Vibrant Pink Arched Panel Stage (4.88m)',
      slug: 'haldi-vibrant-pink-arched-stage',
      cat: 'Stage & Backdrop',
      sub: 'Geometric Frame Stages',
      theme: 'Colourful Bliss',
      image: '/catalog/fs_catalog_11_stage_haldi_pink_arches_modern_slat.jpg',
      price: 28000,
      unit: 'each',
      trade: 11000,
      tradeCat: 'Décor',
      qty: 3,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: 488cm wide stepped arched panels in fuchsia pink and gold borders (Heights: 235cm, 210cm, 185cm, 160cm) with brass urli tubs and fresh marigolds for Haldi.',
      specs: { width: '488cm', panelHeights: '235cm, 210cm, 185cm, 160cm', panelWidths: '130cm, 115cm, 100cm, 85cm', includesUrliTubs: true },
      tags: ['haldi', 'pink arches', 'mehendi', 'urli', 'brass', 'marigold']
    },
    {
      sku: 'FS-STG-008',
      name: 'Moroccan Royal Jali Fretwork Gold Arch Stage',
      slug: 'moroccan-royal-jali-gold-arch-stage',
      cat: 'Stage & Backdrop',
      sub: 'Moorish Jali Arches',
      theme: 'Red Bloom',
      image: '/catalog/fs_catalog_12_stage_crystal_jali_moroccan_triangles.jpg',
      price: 48000,
      unit: 'each',
      trade: 19000,
      tradeCat: 'Décor',
      qty: 2,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Intricate laser-cut gold Moroccan jali arches with vivid magenta silk drapes, central flower-packed botanical wall, and ceremonial seating.',
      specs: { centralJaliWidth: '4.2m', archHeight: '3.6m', material: 'Precision CNC Gold Acrylic & Steel Frame' },
      tags: ['jali', 'moroccan', 'fretwork', 'gold', 'royal', 'wedding']
    },
    {
      sku: 'FS-STG-009',
      name: 'Triple Arched French Window Floral Stage (7.0m)',
      slug: 'triple-arched-french-window-floral-stage',
      cat: 'Stage & Backdrop',
      sub: 'French Window Backdrops',
      theme: 'Red Bloom',
      image: '/catalog/fs_catalog_15_stage_marina_arch_casino_french_window.jpg',
      price: 52000,
      unit: 'each',
      trade: 21000,
      tradeCat: 'Décor',
      qty: 2,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: 700cm wide x 350cm high French arched window architectural backdrop with individual window arches (W 233cm x H 242cm) covered in climbing red roses and white modular sofa.',
      specs: { totalWidth: '700cm', totalHeight: '350cm', windowWidth: '233cm', windowHeight: '242cm', floralDensity: 'Ultra-Dense' },
      tags: ['french window', 'red roses', 'arches', 'architectural', 'luxury']
    },
    {
      sku: 'FS-SWG-001',
      name: 'Royal Floral Mehendi Swing (Jhoola)',
      slug: 'royal-floral-mehendi-swing-jhoola',
      cat: 'Ceremonial Swings (Jhoola)',
      sub: 'Teal & Magenta Mehendi Jhoola',
      theme: 'Colourful Mehendi',
      image: '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg',
      price: 24000,
      unit: 'each',
      trade: 9500,
      tradeCat: 'Décor',
      qty: 2,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Hand-carved traditional royal wooden swing (Jhoola) draped in rich magenta and teal silk valances, crowned with an immense arch of lilac, magenta, and purple florals.',
      specs: { dimensions: '2.4m width x 2.8m height x 1.6m depth', weightCapacityKg: 350, includesSilkCushions: true, persianRugIncluded: true },
      tags: ['swing', 'jhoola', 'mehendi', 'magenta', 'teal', 'floral canopy', '4s catalog']
    },

    // Bars from 4S Catalog
    {
      sku: 'FS-BAR-001',
      name: 'Mediterranean Blue Azulejo Tile Bar Counter (4.2m)',
      slug: 'mediterranean-blue-azulejo-bar',
      cat: 'Bar & Beverage Stations',
      sub: 'Mediterranean Tile Bar',
      theme: 'Grecian Haldi',
      image: '/catalog/fs_catalog_02_bar_velvet_mediterranean.jpg',
      price: 18000,
      unit: 'each',
      trade: 7200,
      tradeCat: 'Décor',
      qty: 3,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Size W 420cm x H 112cm. Hand-printed Mediterranean blue floral and tile motif front bar with lemon crates, bougainvillea overhead trellis, and pendant hanging lamps.',
      specs: { width: '420cm', height: '112cm', depth: '90cm', includesLemonProps: true, includesTrellis: true },
      tags: ['bar', 'mediterranean', 'blue tile', 'azulejo', 'lemon', 'outdoor']
    },
    {
      sku: 'FS-BAR-002',
      name: 'Art Deco Black & Gold Geometric Bar (6m)',
      slug: 'art-deco-black-gold-bar',
      cat: 'Bar & Beverage Stations',
      sub: 'Art Deco Bar',
      theme: 'Bling',
      image: '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg',
      price: 22000,
      unit: 'each',
      trade: 8800,
      tradeCat: 'Décor',
      qty: 3,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Sizes W 244cm / W 600cm x H 122cm. Ultra-luxe Art Deco gilded chevron geometric pattern with glowing backlit bar top and cascading fiber-optic rain ceiling.',
      specs: { widthOptions: '244cm or 600cm', height: '122cm', backlitLED: true, powerRequired: '13A' },
      tags: ['bar', 'art deco', 'gold', 'geometric', 'bling', 'cocktail']
    },
    {
      sku: 'FS-BAR-003',
      name: 'Versace Imperial Gold Medallion Bar (5.9m)',
      slug: 'versace-imperial-gold-medallion-bar',
      cat: 'Bar & Beverage Stations',
      sub: 'Versace Medallion Bar',
      theme: 'Bling',
      image: '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg',
      price: 26000,
      unit: 'each',
      trade: 10400,
      tradeCat: 'Décor',
      qty: 2,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Sizes W 244cm / W 590cm x H 122cm. Roman meander Greek key border and imperial concentric gold medallion motifs with high-crystal chandelier canopy.',
      specs: { widthOptions: '244cm or 590cm', height: '122cm', finish: 'High-Gloss Gold Metallic on Piano Black' },
      tags: ['bar', 'versace', 'medallion', 'greek key', 'luxury', 'bling']
    },
    {
      sku: 'FS-BAR-004',
      name: 'Royal Lotus Red & Gold Brocade Banquet Bar',
      slug: 'royal-lotus-red-gold-bar',
      cat: 'Bar & Beverage Stations',
      sub: 'Royal Lotus Brocade Bar',
      theme: 'Red Bloom',
      image: '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg',
      price: 19500,
      unit: 'each',
      trade: 7800,
      tradeCat: 'Décor',
      qty: 3,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Indian palace inspired golden lotus floral motif across scarlet velvet bar panels with draped valances and grand tiered back-bar shelves.',
      specs: { width: '600cm', height: '120cm', fabric: 'Embossed Gold Brocade on Scarlet Velvet' },
      tags: ['bar', 'lotus', 'red and gold', 'royal', 'brocade', 'palace']
    },

    // Photobooths from 4S Catalog
    {
      sku: 'FS-PB-001',
      name: 'Arabic Heritage Persian Carpet & Pampas Photobooth',
      slug: 'arabic-heritage-carpet-photobooth',
      cat: 'Photobooths & Backdrops',
      sub: 'Arabic Heritage Photobooth',
      theme: 'Sufi Traditional',
      image: '/catalog/fs_catalog_01_photobooth_carpet_arabic.jpg',
      price: 14000,
      unit: 'each',
      trade: 5600,
      tradeCat: 'Décor',
      qty: 3,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Authentic ornate woven carpet backdrop flanked by fluffy golden pampas grass pots, terracotta urns, fresh marigolds, and corner floral swag.',
      specs: { height: '3.2m', width: '2.8m', includesTerracottaUrns: true, pampasHeight: '1.8m' },
      tags: ['photobooth', 'carpet', 'pampas', 'arabic heritage', 'traditional', '4s catalog']
    },
    {
      sku: 'FS-PB-002',
      name: 'Arabic Calligraphy Arched Panel Photobooth',
      slug: 'arabic-calligraphy-arched-photobooth',
      cat: 'Photobooths & Backdrops',
      sub: 'Arched Calligraphy Wall',
      theme: 'Arabic Luxury',
      image: '/catalog/fs_catalog_01_photobooth_carpet_arabic.jpg',
      price: 16500,
      unit: 'each',
      trade: 6600,
      tradeCat: 'Décor',
      qty: 3,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Double arched backdrop (W 90cm x H 220cm & W 90cm x H 178cm) inscribed with gold Arabic calligraphy poetry, velvet drapes, and yellow flower bowls.',
      specs: { panel1: 'W 90cm x H 220cm', panel2: 'W 90cm x H 178cm', calligraphy: 'Bespoke Gold Foil Engraving' },
      tags: ['photobooth', 'calligraphy', 'arabic', 'arched', 'velvet', 'luxury']
    },
    {
      sku: 'FS-PB-003',
      name: 'Tropical Neon Glow Foliage Photobooth',
      slug: 'tropical-neon-foliage-photobooth',
      cat: 'Photobooths & Backdrops',
      sub: 'Tropical Neon Photobooth',
      theme: 'Neon',
      image: '/catalog/fs_catalog_01_photobooth_carpet_arabic.jpg',
      price: 12500,
      unit: 'each',
      trade: 5000,
      tradeCat: 'Décor',
      qty: 4,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Dense living botanical green wall laced with vibrant pink monstera, hot pink flamingos, and custom illuminated acrylic neon typography sign.',
      specs: { dimensions: '3m x 2.4m', neonSignText: 'Customizable couple hashtag', powerRequired: '13A' },
      tags: ['photobooth', 'neon', 'tropical', 'flamingo', 'foliage', 'instagram']
    },
    {
      sku: 'FS-PB-004',
      name: 'Rustic Monogram Wood Wall & Memory Gallery',
      slug: 'rustic-wood-monogram-photo-wall',
      cat: 'Photobooths & Backdrops',
      sub: 'Rustic Wood Photo Wall',
      theme: 'Boho',
      image: '/catalog/fs_catalog_04_photobooth_rustic_wood_bienvenue.jpg',
      price: 11000,
      unit: 'each',
      trade: 4400,
      tradeCat: 'Décor',
      qty: 3,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Weathered oak plank wood wall with laser-cut central couple monogram crest, hanging vintage picture frames, pedestal floral bouquets, and candle lanterns.',
      specs: { dimensions: '3m width x 2.6m height', material: 'Natural Reclaimed Oak', includesPedestals: true },
      tags: ['photobooth', 'rustic', 'wood', 'monogram', 'memory gallery', 'boho']
    },

    // Welcome Boards from 4S Catalog
    {
      sku: 'FS-WB-001',
      name: 'Ornate Gold Baroque Mirror Welcome Board (1.65m)',
      slug: 'ornate-gold-baroque-mirror-welcome-board',
      cat: 'Welcome Boards & Signage',
      sub: 'Baroque Mirror Signs',
      theme: 'Bling',
      image: '/catalog/fs_catalog_06_welcome_board_gold_mirror_pedestal.jpg',
      price: 4500,
      unit: 'each',
      trade: 1800,
      tradeCat: 'Décor',
      qty: 6,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Size W 70cm x H 165cm. Full-sized vintage baroque bevelled mirror with custom white calligraphy vinyl and organic red rose base swag with candles.',
      specs: { width: '70cm', height: '165cm', calligraphyOptions: 'Gold, White or Frosted Glass' },
      tags: ['welcome board', 'mirror', 'baroque', 'gold', 'calligraphy', 'entrance']
    },
    {
      sku: 'FS-WB-002',
      name: 'Brushed Brass Metal Stand Welcome Board',
      slug: 'brushed-brass-stand-welcome-board',
      cat: 'Welcome Boards & Signage',
      sub: 'Brass Frame Boards',
      theme: 'Floral Majesty',
      image: '/catalog/fs_catalog_05_welcome_board_easel_brass.jpg',
      price: 3200,
      unit: 'each',
      trade: 1200,
      tradeCat: 'Décor',
      qty: 8,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Size W 86.6cm x H 120cm. Minimalist architectural rectangular brass easel frame with premium acrylic signage plate and floral corner corsage.',
      specs: { width: '86.6cm', height: '120cm', frameMaterial: 'Brushed Architectural Brass' },
      tags: ['welcome board', 'brass', 'acrylic', 'minimalist', 'modern', 'seating chart']
    },
    {
      sku: 'FS-WB-003',
      name: 'Antique Grand Floor-Standing Mirror Sign (1.72m)',
      slug: 'antique-grand-floor-mirror-sign',
      cat: 'Welcome Boards & Signage',
      sub: 'Baroque Mirror Signs',
      theme: 'Red Bloom',
      image: '/catalog/fs_catalog_10_welcome_board_antique_mirror_lawn.jpg',
      price: 5500,
      unit: 'each',
      trade: 2200,
      tradeCat: 'Décor',
      qty: 4,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Size W 71.5cm x H 172cm. Heavy ornate gilt mirror standing dramatically on lush lawn or ballroom foyer surrounded by clustered glass hurricane candles.',
      specs: { width: '71.5cm', height: '172cm', includesCandlesCount: 16 },
      tags: ['mirror', 'welcome sign', 'grand', 'antique', 'candles']
    },
    {
      sku: 'FS-SIGN-001',
      name: 'Festive Painted Wooden Crate Direction Signpost',
      slug: 'festive-wooden-crate-direction-signpost',
      cat: 'Welcome Boards & Signage',
      sub: 'Festive Direction Signage',
      theme: 'Colourful Mehendi',
      image: '/catalog/fs_catalog_07_direction_signage_wooden_beach.jpg',
      price: 2800,
      unit: 'each',
      trade: 1000,
      tradeCat: 'Décor',
      qty: 6,
      status: InventoryStatus.AVAILABLE,
      desc: 'Official 4S Catalog: Multicolored rustic wooden directional signpost ("Mehendipur", "Nacho Gao", "Chaat Street", "Drinks", "Dance") mounted in flower-filled painted crates.',
      specs: { height: '2.2m', arrowsCount: 6, customWordingSupported: true },
      tags: ['direction', 'signpost', 'mehendi', 'festive', 'colorful', 'crates']
    },

    // Additional Core Items
    {
      sku: 'FS-STG-001',
      name: 'Bling Mirror Reflection Stage',
      slug: 'bling-mirror-stage',
      cat: 'Stage & Backdrop',
      sub: 'Mirror Stages',
      theme: 'Bling',
      image: '/reference_assets/slide_bling_stage.jpg',
      price: 60000,
      unit: 'each',
      trade: 24000,
      tradeCat: 'Staging & Trussing',
      qty: 2,
      status: InventoryStatus.AVAILABLE,
      desc: 'Ultra-luxurious full gold mirror acrylic stage platform with integrated underfloor LED matrix glow and crystal surround trim.',
      specs: { dimensions: '12m x 6m x 0.8m', loadCapacityKgPerSqm: 500, mirrorFinish: '99.8% reflective gold' },
      tags: ['bling', 'stage', 'mirror', 'reception', 'gold', 'luxury']
    },
    {
      sku: 'FS-FLO-001',
      name: 'Red Rose Grand Centrepieces',
      slug: 'red-rose-grand-centrepieces',
      cat: 'Floral Décor',
      sub: 'Table Centrepieces',
      theme: 'Red Bloom',
      image: '/reference_assets/hero_mandap_red.jpg',
      price: 3500,
      unit: 'per 10 tables',
      trade: 1400,
      tradeCat: 'Décor',
      qty: 40,
      status: InventoryStatus.AVAILABLE,
      desc: 'Spherical elevated rose arrangements set atop crystal pedestals with hanging teardrop glass orbs and floating votives.',
      specs: { heightCm: 85, flowerCountPerUnit: 140 },
      tags: ['centrepieces', 'red bloom', 'tables', 'floral', 'dining']
    },
    {
      sku: 'FS-LGT-001',
      name: 'Architectural Uplighting & Pin-Spot Package',
      slug: 'architectural-uplighting-package',
      cat: 'Lighting & Ambience',
      sub: 'Architectural Uplighting',
      theme: 'Bling',
      image: '/reference_assets/slide_neon.jpg',
      price: 9500,
      unit: 'full hall package',
      trade: 3800,
      tradeCat: 'Lighting',
      qty: 10,
      status: InventoryStatus.AVAILABLE,
      desc: '32 wireless battery-powered Astera AX5 LED uplighters plus 12 table pin-spots with custom color temperature matching.',
      specs: { fixturesCount: 44, batteryLifeHours: 20, wirelessCRMX: true },
      tags: ['lighting', 'uplighting', 'ambience', 'astera']
    },
    {
      sku: 'FS-SFX-001',
      name: 'Cold Sparkular Indoor Pyro Machines',
      slug: 'cold-sparkular-fountains',
      cat: 'Special Effects',
      sub: 'Cold Sparkular Fountains',
      theme: 'Bling',
      image: '/reference_assets/slide_sufi.jpg',
      price: 4500,
      unit: 'set of 6 machines',
      trade: 1800,
      tradeCat: 'Special Effects',
      qty: 12,
      status: InventoryStatus.AVAILABLE,
      desc: 'Non-hazardous, smell-free cold spark fountain machines safe for indoor ballrooms. Ideal for grand bride & groom entries and cake cutting.',
      specs: { sparkHeightMetres: 5, safetyCert: 'Civil Defense & Safety Approved' },
      tags: ['cold sparks', 'pyro', 'effects', 'entry', 'celebration']
    },
    {
      sku: 'FS-FURN-001',
      name: 'Gold Phoenix & Chiavari Chairs Set',
      slug: 'gold-chiavari-chairs-set',
      cat: 'Lounge & Furniture',
      sub: 'Chiavari Dining Chairs',
      theme: 'Bling',
      image: '/reference_assets/hero_pastel.jpg',
      price: 25,
      unit: 'per chair',
      trade: 10,
      tradeCat: 'Furniture',
      qty: 500,
      status: InventoryStatus.AVAILABLE,
      desc: 'High-gloss gold metallic chiavari banquet chairs equipped with ivory velvet padded cushion.',
      specs: { material: 'Solid beechwood with 5-coat gold lacquer', weightKg: 4.8 },
      tags: ['chairs', 'chiavari', 'gold', 'furniture', 'dining']
    }
  ];

  for (const it of items) {
    const catId = catMap[it.cat];
    const subId = subMap[`${it.cat}::${it.sub}`] || null;

    const createdItem = await prisma.inventoryItem.upsert({
      where: { sku: it.sku },
      update: {
        name: it.name,
        price: it.price,
        tradePrice: it.trade,
        tradeCategory: it.tradeCat,
        coverImage: it.image,
        description: it.desc,
        theme: it.theme,
        totalQuantity: it.qty,
        availableQuantity: it.qty,
        specifications: it.specs,
        tags: it.tags
      },
      create: {
        sku: it.sku,
        name: it.name,
        slug: it.slug,
        categoryId: catId,
        subcategoryId: subId,
        theme: it.theme,
        description: it.desc,
        specifications: it.specs,
        price: it.price,
        unit: it.unit,
        tradePrice: it.trade,
        tradeCategory: it.tradeCat,
        totalQuantity: it.qty,
        availableQuantity: it.qty,
        status: it.status,
        isAvailable: true,
        isEnabled: true,
        isFeatured: true,
        tags: it.tags,
        coverImage: it.image
      }
    });

    await prisma.inventoryMedia.deleteMany({ where: { itemId: createdItem.id } });
    await prisma.inventoryMedia.create({
      data: {
        itemId: createdItem.id,
        mediaType: 'IMAGE',
        url: it.image,
        altText: it.name,
        isPrimary: true,
        sortOrder: 0
      }
    });
  }

  console.log(`Seeded ${items.length} Inventory Items & Media successfully`);

  // 6. Dynamic Invitation Templates
  const invitationTemplates = [
    {
      title: 'Royal Red Bloom Wedding',
      slug: 'royal-red-bloom',
      category: 'Wedding',
      description: 'Opulent crimson and antique gold motif for royal Indian, Arab, or destination multi-day weddings.',
      previewImage: '/reference_assets/hero_mandap_red.jpg',
      defaultSettings: {
        fontFamily: 'Playfair Display',
        primaryColor: '#0E1B3A',
        secondaryColor: '#C8A24B',
        accentColor: '#E7C977',
        headingText: 'Together With Their Families',
        coupleNames: 'Priya & Rohan',
        eventName: 'Grand Wedding & Reception',
        eventDate: '2026-11-20',
        eventTime: '6:30 PM Onwards',
        venueName: 'The Grand St. Regis Ballroom',
        venueAddress: 'The Palm, Royal Ballroom',
        rsvpContact: 'concierge@fourseasons.com | +971 4 398 2211',
        customMessage: 'We request the honor of your presence and blessings as we unite in holy matrimony.'
      }
    },
    {
      title: 'Grecian Ivory & Sunlit Haldi',
      slug: 'grecian-ivory-haldi',
      category: 'Haldi & Ceremony',
      description: 'Warm Mediterranean sunburst accents with minimalist Roman architecture and floral borders.',
      previewImage: '/reference_assets/hero_grecian_haldi.jpg',
      defaultSettings: {
        fontFamily: 'Georgia',
        primaryColor: '#7A5E1C',
        secondaryColor: '#E0BC66',
        accentColor: '#0E1B3A',
        headingText: 'Join Us for a Joyous Celebration of Colors',
        coupleNames: 'Zoya & Aamir',
        eventName: 'Grecian Garden Haldi & Sangeet',
        eventDate: '2026-10-15',
        eventTime: '11:00 AM',
        venueName: 'Bulgari Resort Yacht Club',
        venueAddress: 'Jumeirah Bay Island',
        rsvpContact: '+971 50 123 4567',
        customMessage: 'Dress code: Sunlit Yellow & Pastel Silks.'
      }
    },
    {
      title: 'Midnight Velvet & Shimmer Gala',
      slug: 'midnight-velvet-gala',
      category: 'Reception & Nikah',
      description: 'Dramatic navy night sky with kinetic gold shimmer dust, ideal for black-tie receptions and nikah banquets.',
      previewImage: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
      defaultSettings: {
        fontFamily: 'Cinzel',
        primaryColor: '#F7F3EC',
        secondaryColor: '#E7C977',
        accentColor: '#C8A24B',
        headingText: 'The Wedding Reception Of',
        coupleNames: 'Tariq & Noor',
        eventName: 'Grand Reception & Dinner Banquet',
        eventDate: '2026-12-05',
        eventTime: '8:00 PM',
        venueName: 'Armani Hotel Grand Ballroom',
        venueAddress: 'Downtown Ballroom',
        rsvpContact: 'rsvp@tariqnoor.ae',
        customMessage: 'An enchanting evening of music, gourmet dining, and celebrations.'
      }
    },
    {
      title: 'Bohemian Sunset Sand',
      slug: 'bohemian-sunset-sand',
      category: 'Beach Wedding',
      description: 'Natural linen textures, pampas plumes, and sunset terracotta tones for beachfront ceremonies.',
      previewImage: '/reference_assets/slide_boho.jpg',
      defaultSettings: {
        fontFamily: 'Playfair Display',
        primaryColor: '#2B1A09',
        secondaryColor: '#C8A24B',
        accentColor: '#D4A373',
        headingText: 'Two Souls, One Ocean Sunset',
        coupleNames: 'Chloe & Marcus',
        eventName: 'Beachside Vows & Dinner Under Stars',
        eventDate: '2026-10-28',
        eventTime: '4:30 PM',
        venueName: 'Nikki Beach Resort & Spa',
        venueAddress: 'Pearl Jumeira Waterfront',
        rsvpContact: '+971 52 987 6543',
        customMessage: 'Barefoot luxury and sunset cocktails following the vows.'
      }
    }
  ];

  for (let i = 0; i < invitationTemplates.length; i++) {
    const t = invitationTemplates[i];
    await prisma.invitationTemplate.upsert({
      where: { slug: t.slug },
      update: {
        title: t.title,
        category: t.category,
        description: t.description,
        previewImage: t.previewImage,
        defaultSettings: t.defaultSettings,
        sortOrder: i
      },
      create: {
        title: t.title,
        slug: t.slug,
        category: t.category,
        description: t.description,
        previewImage: t.previewImage,
        defaultSettings: t.defaultSettings,
        canvasWidth: 1080,
        canvasHeight: 1920,
        sortOrder: i,
        isActive: true,
        isFeatured: true
      }
    });
  }

  console.log('Seeded Invitation Templates successfully');

  // 7. Services
  const services = [
    {
      name: 'Bespoke Wedding Architecture & Production',
      slug: 'bespoke-wedding-production',
      desc: 'Complete turnkey wedding styling, 3D floor plan engineering, structural floral mandap installation, lighting choreography, and day-of stage management.',
      shortDesc: 'Turnkey luxury wedding production from concept to execution.',
      priceStarting: 75000,
      images: ['/reference_assets/hero_mandap_red.jpg', '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg'],
      features: ['Dedicated Lead Creative Director', 'Full 3D Photorealistic Pre-visualization', 'VIP Protocol & Hospitality Coordination', 'Civil Defense & Venue Permits']
    },
    {
      name: 'AI Concept Generation & Visual Atelier',
      slug: 'ai-concept-generation',
      desc: 'Our proprietary atelier allows you to combine real rental inventory elements into high-resolution photorealistic imagery and 4K conceptual video walkthroughs before commitment.',
      shortDesc: 'See your exact inventory combination brought to life with AI.',
      priceStarting: 5000,
      images: ['/catalog/fs_catalog_15_stage_marina_arch_casino_french_window.jpg', '/catalog/fs_catalog_03_bar_artdeco_versace_lotus.jpg'],
      features: ['Unlimited Combinations Builder', 'High-Res Downloadable AI Concept Renders', 'Cinematic Drone & Steadicam Simulation', 'Exportable Moodboards with Budget Tracking']
    },
    {
      name: 'Luxury Sangeet, Mehendi & Cultural Nights',
      slug: 'sangeet-mehendi-nights',
      desc: 'Vibrant color palettes, Moroccan glass lanterns, interactive folk artist stations, and concert-grade audio-visual trusses tailored for unforgettable musical celebrations.',
      shortDesc: 'Vibrant, high-energy experiential cultural nights.',
      priceStarting: 45000,
      images: ['/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg', '/catalog/fs_catalog_11_stage_haldi_pink_arches_modern_slat.jpg'],
      features: ['Custom Dance Stage & Trussing', 'Low Fog & Sparkular Pyrotechnics', 'Comfortable Royal Majlis Lounges', 'LED Walls & Dynamic Live Video Switching']
    },
    {
      name: 'Dynamic Interactive Digital Invitations',
      slug: 'dynamic-invitations',
      desc: 'State-of-the-art responsive digital wedding invitations with dynamic guest personalization, RSVP tracking, Google Maps directions, and one-click WhatsApp broadcast delivery.',
      shortDesc: 'Bespoke mobile invitations with live RSVP and WhatsApp sharing.',
      priceStarting: 2500,
      images: ['/reference_assets/hero_floral_majesty.jpg', '/catalog/fs_catalog_06_welcome_board_gold_mirror_pedestal.jpg'],
      features: ['Multi-Device Mobile Responsive', 'Instant WhatsApp Share Links', 'Live RSVP & Dietary Requirements Dashboard', 'Custom Font & Color Styling']
    }
  ];

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.desc,
        shortDesc: s.shortDesc,
        priceStarting: s.priceStarting,
        images: s.images,
        features: s.features,
        sortOrder: i
      },
      create: {
        name: s.name,
        slug: s.slug,
        description: s.desc,
        shortDesc: s.shortDesc,
        priceStarting: s.priceStarting,
        images: s.images,
        features: s.features,
        sortOrder: i,
        isFeatured: true,
        isActive: true
      }
    });
  }

  // 8. Portfolio Projects
  const portfolio = [
    {
      title: 'The Royal Red Bloom Wedding at Atlantis The Royal',
      slug: 'royal-red-bloom-atlantis',
      clientName: 'Priya & Rohan',
      eventType: 'Luxury Indian Wedding',
      eventDate: new Date('2026-02-14'),
      location: 'Palm Jumeirah',
      description: 'A 500-guest regal celebration featuring a 6-metre Red Naomi rose mandap, gold mirror reflection stage, and synchronised cold spark fountains overlooking the waterfront skyline.',
      coverImage: '/reference_assets/hero_mandap_red.jpg',
      category: 'Wedding',
      tags: ['Atlantis The Royal', 'Red Bloom', 'Mandap', 'Gold Mirror Stage']
    },
    {
      title: 'Grecian Haldi Ceremony at Bulgari Yacht Club',
      slug: 'grecian-haldi-bulgari',
      clientName: 'Zoya & Aamir',
      eventType: 'Haldi & Sangeet',
      eventDate: new Date('2026-01-20'),
      location: 'Jumeirah Bay',
      description: 'Mediterranean-inspired open-air courtyard celebration with sculpted Roman pillars, fresh citrus centerpieces, and traditional marigold water cascades.',
      coverImage: '/reference_assets/hero_grecian_haldi.jpg',
      category: 'Haldi',
      tags: ['Bulgari', 'Grecian', 'Outdoor', 'Yellow Blooms']
    },
    {
      title: 'Midnight Bling Reception at Armani Hotel Ballroom',
      slug: 'midnight-bling-armani',
      clientName: 'Fatima & Tariq',
      eventType: 'Reception Banquet',
      eventDate: new Date('2026-03-01'),
      location: 'Downtown Ballroom',
      description: 'High-glamour black-tie evening featuring 4K shimmer LED kinetic walls, crystal chandeliers, and full room architectural Astera lighting.',
      coverImage: '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg',
      category: 'Reception',
      tags: ['Armani Hotel', 'Bling', 'Grand Ballroom', 'LED Kinetic']
    }
  ];

  for (let i = 0; i < portfolio.length; i++) {
    const p = portfolio[i];
    await prisma.portfolioProject.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        clientName: p.clientName,
        eventType: p.eventType,
        description: p.description,
        coverImage: p.coverImage,
        sortOrder: i
      },
      create: {
        title: p.title,
        slug: p.slug,
        clientName: p.clientName,
        eventType: p.eventType,
        eventDate: p.eventDate,
        location: p.location,
        description: p.description,
        coverImage: p.coverImage,
        category: p.category,
        tags: p.tags,
        sortOrder: i,
        isFeatured: true,
        isActive: true
      }
    });
  }

  // 9. Customers & Inquiries
  const sampleCustomer = await prisma.customer.upsert({
    where: { id: 'cust-priya-001' },
    update: {},
    create: {
      id: 'cust-priya-001',
      name: 'Priya Nair',
      email: 'priya.nair@example.ae',
      phone: '+971 50 491 8292',
      company: 'Nair Family Celebrations',
      address: 'Emirates Hills, Villa 42',
      city: 'Metropolitan',
      notes: 'Interested in Signature Red Bloom 3-day wedding package. Budget AED 250k.'
    }
  });

  const inquiry1 = await prisma.inquiry.upsert({
    where: { referenceNo: 'FS-REQ-2026-001' },
    update: {},
    create: {
      referenceNo: 'FS-REQ-2026-001',
      customerId: sampleCustomer.id,
      eventType: 'Indian Wedding & Reception',
      eventStyle: 'Indian Royal',
      eventDate: new Date('2026-09-12'),
      eventLocation: 'Grand Ballroom',
      guestsCount: 400,
      budgetRange: 'AED 250,000+',
      status: InquiryStatus.NEW,
      priority: 'HIGH',
      notes: 'Requires Mandap, Mirror Stage, Red Rose Table decor, and Cold Sparks.'
    }
  });

  await prisma.requirement.upsert({
    where: { inquiryId: inquiry1.id },
    update: {},
    create: {
      inquiryId: inquiry1.id,
      serviceRequirements: ['Turnkey Wedding Production', 'AI Visual Preview', 'Cold Sparkular Pyro'],
      inventoryPreferences: ['FS-MAN-001', 'FS-STG-005', 'FS-FLO-001', 'FS-SFX-001'],
      preferredTheme: 'Red Bloom',
      specialInstructions: 'Ceremony begins precisely at 6:30 PM with bride walk-in over mirrored floral aisle.'
    }
  });

  // Second Customer & Inquiry
  const sampleCustomer2 = await prisma.customer.upsert({
    where: { id: 'cust-fatima-002' },
    update: {},
    create: {
      id: 'cust-fatima-002',
      name: 'Fatima Al Hashimi',
      email: 'fatima.hashimi@example.ae',
      phone: '+971 55 901 2345',
      company: 'Al Hashimi Group',
      city: 'Metropolitan',
      notes: 'Arabic Nikah banquet at Jumeirah Waterfront.'
    }
  });

  await prisma.inquiry.upsert({
    where: { referenceNo: 'FS-REQ-2026-002' },
    update: {},
    create: {
      referenceNo: 'FS-REQ-2026-002',
      customerId: sampleCustomer2.id,
      eventType: 'Arabic Nikah & Banquet',
      eventStyle: 'Arabic Modern Luxury',
      eventDate: new Date('2026-10-04'),
      eventLocation: 'Jumeirah Waterfront',
      guestsCount: 250,
      budgetRange: 'AED 150,000',
      status: InquiryStatus.PROPOSAL_SENT,
      priority: 'HIGH',
      notes: 'Floral Majesty theme requested with hanging floral canopy.'
    }
  });

  // 10. Sample AI Generation
  await prisma.aiGeneration.upsert({
    where: { id: 'gen-sample-001' },
    update: {},
    create: {
      id: 'gen-sample-001',
      customerId: sampleCustomer.id,
      generationType: AiGenType.IMAGE,
      status: AiGenStatus.COMPLETED,
      prompt: 'Regal luxury wedding ballroom setting with Royal Red Floral Mandap, surrounded by gold mirror reflection stage and cascading red rose centerpieces under warm pinspot lighting, photorealistic 8k, architectural digest quality',
      instructions: 'Ensure red roses are rich crimson and mirror stage reflects the floral arches cleanly.',
      visualTheme: 'Red Bloom',
      aspectRatio: '16:9',
      provider: 'modular_mock',
      providerModel: 'fs-luxury-v1',
      resultUrl: '/reference_assets/hero_mandap_red.jpg',
      thumbnailUrls: ['/reference_assets/hero_mandap_red.jpg', '/catalog/fs_catalog_08_stage_curve_wave_screen_triple_arch.jpg'],
      completedAt: new Date()
    }
  });

  // 11. Zoho & WhatsApp Integrations status
  await prisma.zohoIntegration.upsert({
    where: { id: 'zoho-default-config' },
    update: {},
    create: {
      id: 'zoho-default-config',
      environment: 'production',
      clientId: '1000.EXAMPLE_ZOHO_CLIENT_ID',
      clientSecret: 'EXAMPLE_ZOHO_CLIENT_SECRET',
      apiDomain: 'https://www.zohoapis.com',
      isEnabled: true,
      autoSyncLeads: true,
      syncFrequencyMinutes: 15
    }
  });

  await prisma.whatsAppIntegration.upsert({
    where: { id: 'whatsapp-default-config' },
    update: {},
    create: {
      id: 'whatsapp-default-config',
      phoneNumberId: '123456789012345',
      businessAccountId: '987654321098765',
      webhookVerifyToken: 'fs_whatsapp_verify_token_2026',
      isEnabled: true,
      autoReplyWelcome: true,
      autoSendBookingConfirm: true,
      autoSendInvitationLink: true,
      templatesConfig: {
        inquiry_welcome: 'fs_inquiry_received_v1',
        booking_confirmed: 'fs_booking_confirmation_v1',
        invitation_share: 'fs_invitation_view_v1'
      }
    }
  });

  console.log('--- Four Seasons Database Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
