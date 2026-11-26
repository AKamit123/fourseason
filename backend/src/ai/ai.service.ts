import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModularMockProvider } from './providers/modular-mock.provider';
import { AiGenType, AiGenStatus, ItemRoleInGen } from '@prisma/client';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private prisma: PrismaService,
    private mockProvider: ModularMockProvider,
  ) {}

  // ==========================================
  // ASYNCHRONOUS GENERATION DISPATCHER
  // ==========================================

  async initiateImageGeneration(dto: {
    itemIds: string[];
    prompt?: string;
    instructions?: string;
    visualTheme?: string;
    aspectRatio?: string;
    customerId?: string;
  }) {
    if (!dto.itemIds || dto.itemIds.length === 0) {
      throw new BadRequestException('At least one inventory item must be selected for creative generation');
    }

    // 1. Fetch item details
    const items = await this.prisma.inventoryItem.findMany({
      where: { id: { in: dto.itemIds } },
      include: { category: true },
    });

    if (items.length === 0) {
      throw new BadRequestException('Selected inventory items were not found');
    }

    const itemNames = items.map(i => i.name).join(', ');
    const prompt = dto.prompt || `Luxury wedding celebration setup featuring ${itemNames} in ${dto.visualTheme || 'Red Bloom'} theme, photorealistic 8k, architectural lighting, masterpiece`;

    // 2. Create record with PENDING status
    const generation = await this.prisma.aiGeneration.create({
      data: {
        customerId: dto.customerId || null,
        generationType: AiGenType.IMAGE,
        status: AiGenStatus.PENDING,
        prompt,
        instructions: dto.instructions || '',
        visualTheme: dto.visualTheme || items[0].theme || 'Red Bloom',
        aspectRatio: dto.aspectRatio || '16:9',
        provider: 'modular_mock',
        providerModel: 'fs-luxury-v1',
        thumbnailUrls: items.map(i => i.coverImage).filter(Boolean) as string[],
      },
    });

    // 3. Link items
    for (const item of items) {
      let role: ItemRoleInGen = ItemRoleInGen.GENERAL;
      const catSlug = item.category.slug.toLowerCase();
      if (catSlug.includes('mandap')) role = ItemRoleInGen.MANDAP;
      else if (catSlug.includes('stage')) role = ItemRoleInGen.STAGE;
      else if (catSlug.includes('floral')) role = ItemRoleInGen.FLORAL;
      else if (catSlug.includes('light')) role = ItemRoleInGen.LIGHTING;

      await this.prisma.aiGenerationItem.create({
        data: {
          generationId: generation.id,
          itemId: item.id,
          role,
          referenceImageUrl: item.coverImage,
        },
      });
    }

    // 4. Asynchronously process via worker queue / event loop
    this.processGenerationAsync(generation.id, items);

    return this.getGenerationStatus(generation.id);
  }

  async initiateVideoGeneration(dto: {
    itemIds: string[];
    instructions?: string;
    visualTheme?: string;
    durationSeconds?: number;
    customerId?: string;
  }) {
    if (!dto.itemIds || dto.itemIds.length === 0) {
      throw new BadRequestException('At least one inventory item must be selected for video generation');
    }

    const items = await this.prisma.inventoryItem.findMany({
      where: { id: { in: dto.itemIds } },
      include: { category: true },
    });

    const itemNames = items.map(i => i.name).join(', ');
    const prompt = `Cinematic 4K camera flythrough of luxury ballroom featuring ${itemNames}, atmospheric haze, moving lights`;

    const generation = await this.prisma.aiGeneration.create({
      data: {
        customerId: dto.customerId || null,
        generationType: AiGenType.VIDEO,
        status: AiGenStatus.PENDING,
        prompt,
        instructions: dto.instructions || '',
        visualTheme: dto.visualTheme || items[0].theme || 'Bling',
        durationSeconds: dto.durationSeconds || 5,
        aspectRatio: '16:9',
        provider: 'modular_mock',
        providerModel: 'fs-luma-cinematic-v2',
        thumbnailUrls: items.map(i => i.coverImage).filter(Boolean) as string[],
      },
    });

    for (const item of items) {
      await this.prisma.aiGenerationItem.create({
        data: {
          generationId: generation.id,
          itemId: item.id,
          referenceImageUrl: item.coverImage,
        },
      });
    }

    this.processGenerationAsync(generation.id, items);

    return this.getGenerationStatus(generation.id);
  }

  private async processGenerationAsync(generationId: string, items: any[]) {
    // Step A: Transition to PROCESSING after 800ms
    setTimeout(async () => {
      try {
        await this.prisma.aiGeneration.update({
          where: { id: generationId },
          data: { status: AiGenStatus.PROCESSING },
        });

        // Step B: Call AI provider synthesis after 2200ms
        setTimeout(async () => {
          try {
            const genRecord = await this.prisma.aiGeneration.findUnique({
              where: { id: generationId },
            });
            if (!genRecord) return;

            const payload = {
              generationType: genRecord.generationType,
              prompt: genRecord.prompt,
              instructions: genRecord.instructions || undefined,
              visualTheme: genRecord.visualTheme || undefined,
              aspectRatio: genRecord.aspectRatio || undefined,
              itemIds: items.map(i => i.id),
              itemDetails: items.map(i => ({
                id: i.id,
                name: i.name,
                theme: i.theme,
                coverImage: i.coverImage,
                category: i.category?.name,
              })),
            };

            let providerResult: any;
            let attempts = 0;
            while (attempts < 2) {
              try {
                attempts += 1;
                providerResult = await this.mockProvider.generateImage(payload);
                break;
              } catch (retryErr: any) {
                this.logger.warn(`AI generation attempt ${attempts} failed for ${generationId}: ${retryErr.message}`);
                if (attempts >= 2) {
                  // Graceful fallback to matched catalog cover image
                  providerResult = {
                    resultUrl: items[0]?.coverImage || '/reference_assets/hero_mandap_red.jpg',
                    thumbnailUrls: items.map(i => i.coverImage).filter(Boolean),
                    provider: 'fallback_atelier_renderer',
                    providerModel: 'catalog-harmonizer-v1',
                    rawResponse: { fallback: true, reason: retryErr.message },
                  };
                }
              }
            }

            // Update to COMPLETED
            await this.prisma.aiGeneration.update({
              where: { id: generationId },
              data: {
                status: AiGenStatus.COMPLETED,
                resultUrl: providerResult.resultUrl,
                thumbnailUrls: providerResult.thumbnailUrls,
                provider: providerResult.provider,
                providerModel: providerResult.providerModel,
                rawResponse: providerResult.rawResponse,
                completedAt: new Date(),
              },
            });

            // Save history variation
            await this.prisma.aiGenerationHistory.create({
              data: {
                generationId,
                variationIndex: 1,
                imageUrl: providerResult.resultUrl,
                promptUsed: genRecord.prompt,
              },
            });

            this.logger.log(`AI Generation ${generationId} completed successfully`);
          } catch (err: any) {
            this.logger.error(`Error completing generation ${generationId}: ${err.message}`);
            await this.prisma.aiGeneration.update({
              where: { id: generationId },
              data: {
                status: AiGenStatus.FAILED,
                errorReason: err.message || 'Generation failed in processing worker',
              },
            }).catch(() => {});
          }
        }, 2200);
      } catch (err: any) {
        this.logger.error(`Failed to update generation to PROCESSING: ${err.message}`);
      }
    }, 800);
  }

  // ==========================================
  // STATUS & HISTORY
  // ==========================================

  async getGenerationStatus(id: string) {
    const gen = await this.prisma.aiGeneration.findUnique({
      where: { id },
      include: {
        items: {
          include: { item: true },
        },
        history: {
          orderBy: { variationIndex: 'asc' },
        },
      },
    });

    if (!gen) {
      throw new NotFoundException(`Generation task ${id} not found`);
    }

    return gen;
  }

  async getHistory(params: { customerId?: string; type?: AiGenType; limit?: number }) {
    const where: any = {};
    if (params.customerId) where.customerId = params.customerId;
    if (params.type) where.generationType = params.type;

    return this.prisma.aiGeneration.findMany({
      where,
      include: {
        items: {
          include: { item: true },
        },
        history: true,
      },
      orderBy: { createdAt: 'desc' },
      take: params.limit || 50,
    });
  }

  async regenerate(id: string) {
    const existing = await this.getGenerationStatus(id);
    const items = existing.items.map(it => it.item);
    return this.initiateImageGeneration({
      itemIds: items.map(i => i.id),
      prompt: `${existing.prompt} (Variation)`,
      instructions: existing.instructions || undefined,
      visualTheme: existing.visualTheme || undefined,
      aspectRatio: existing.aspectRatio || undefined,
      customerId: existing.customerId || undefined,
    });
  }

  // ==========================================
  // FOUR SEASONS AI CONCIERGE CHATBOT ENGINE
  // ==========================================
  async chatWithConcierge(dto: {
    message: string;
    history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    customerInfo?: { name?: string; phone?: string; email?: string };
  }) {
    const rawMsg = (dto.message || '').trim();
    const msg = rawMsg.toLowerCase();
    const sender = dto.customerInfo?.name || 'Honored Guest';

    // 1. Phone number or email extraction for auto-inquiry lead generation
    const phoneMatch = rawMsg.match(/(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
    const emailMatch = rawMsg.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);

    let inquiryCreated: any = null;

    if ((phoneMatch || emailMatch) && (msg.includes('book') || msg.includes('quote') || msg.includes('inquiry') || msg.includes('wedding') || msg.includes('want') || msg.includes('chahiye'))) {
      const detectedPhone = phoneMatch ? phoneMatch[0] : (dto.customerInfo?.phone || '+971500000000');
      const detectedEmail = emailMatch ? emailMatch[0] : (dto.customerInfo?.email || 'inquiry@fourseasonsstudio.ae');

      try {
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        const refNo = `FS-REQ-${year}-${rand}`;

        // Create or find customer
        let cust = await this.prisma.customer.findFirst({
          where: { OR: [{ phone: detectedPhone }, { email: detectedEmail }] },
        });

        if (!cust) {
          cust = await this.prisma.customer.create({
            data: {
              name: dto.customerInfo?.name || 'VIP Client via AI Chat',
              phone: detectedPhone,
              email: detectedEmail,
              city: 'Luxury Atelier',
            },
          });
        }

        const newInq = await this.prisma.inquiry.create({
          data: {
            referenceNo: refNo,
            customerId: cust.id,
            eventType: 'AI Concierge Chat Inquiry',
            eventStyle: 'Luxury Atelier',
            status: 'NEW',
            priority: 'HIGH',
            notes: `Auto-captured from AI Concierge chat: "${rawMsg}"`,
          },
        });

        inquiryCreated = {
          referenceNo: refNo,
          inquiryId: newInq.id,
        };
      } catch (e) {
        this.logger.warn(`Could not auto-generate inquiry from chat: ${e}`);
      }
    }

    // 2. Intelligent Response Routing based on Atelier Knowledge
    // A. Packages & Pricing
    if (msg.includes('package') || msg.includes('price') || msg.includes('rate') || msg.includes('cost') || msg.includes('kharcha') || msg.includes('budget') || msg.includes('paisa') || msg.includes('fees')) {
      const reply = `At Four Seasons, our curated wedding atelier packages are tailored for GCC grand ballrooms:

👑 **The Royal Four Seasons Luxe (From AED 185,000)**:
Palatial multi-day celebration featuring our iconic 7.3m Stepped Wave Screen Stage, 6m Versace/Art Deco Bar Counter, Royal Naomi Rose Mandap, 40 floral table centerpieces, and full wireless Astera pin-spotting. *(Savings: AED 38,000)*

✨ **Signature Grand Atelier (AED 99,000 - Most Popular)**:
Complete wedding production with Royal Red Rose Mandap (6m x 4.5m), 12m Bling Mirror Stage, Mediterranean Azulejo Tile Bar (4.2m), Arabic Heritage Photobooth, Baroque Mirror Welcome Sign, and 4x Cold Sparkular machines. *(Savings: AED 24,000)*

🌸 **Essential Elegance (AED 49,000)**:
Intimate celebrations with Pastel Blossom Ceremonial Pavilion, Grecian column backdrop, gold Chiavari chairs, and ambient uplighting. *(Savings: AED 12,000)*

Would you like to customize one of these packages in our **AI Studio**, or would you like an official proposal for your event date?`;

      return {
        reply,
        suggestions: ['Customize in AI Studio', 'Check 7.3m Wave Stage', 'Chat on WhatsApp (+971 50 882 1900)', 'Request Custom Quote'],
        action: 'open_packages',
        inquiryCreated,
      };
    }

    // B. Real Catalog Inventory & Specifications
    if (msg.includes('stage') || msg.includes('mandap') || msg.includes('bar') || msg.includes('versace') || msg.includes('jhoola') || msg.includes('swing') || msg.includes('wave') || msg.includes('moorish') || msg.includes('photobooth') || msg.includes('mirror') || msg.includes('size') || msg.includes('spec') || msg.includes('dimension')) {
      const reply = `Here are the authentic engineering specifications from our in-house inventory:

• **Stepped Curved Wave Screen Stage**: 7.3m total width, 2.7m height with stepped acoustic curve wings and integrated central 2.5m x 2.5m high-refresh LED video screen.
• **Moorish Arch Orchestra Stage**: 1,100cm (11m) width x 350cm height multi-tier illuminated Arabian geometric arch screen.
• **Art Deco Gold Geometric Bar**: 600cm (6m) / 244cm width x 122cm height with warm backlight and gold lattice facade.
• **Versace Medallion Bar**: 590cm width x 122cm height featuring neoclassical Greek key border and circular gold medallions.
• **Mediterranean Blue Tile Bar**: 420cm (4.2m) width x 112cm height with blue azulejo florals and fresh lemon crates.
• **Royal Mehendi Jhoola (Swing)**: Hand-carved solid teak suspended in silk ropes with marigold and magenta floral swags.
• **Baroque Gold Mirror Sign**: 71.5cm width x 172cm height in antique gold leaf.

All inventory is 100% in-house with zero third-party markups. Would you like to select items and preview them in **4K AI Render**?`;

      return {
        reply,
        suggestions: ['Launch 4K AI Generator', 'Check Availability for Date', 'View Bar Counters', 'Chat with Atelier Team on WhatsApp'],
        action: 'open_studio',
        inquiryCreated,
      };
    }

    // C. Date Availability & Double Booking
    if (msg.includes('available') || msg.includes('date') || msg.includes('book') || msg.includes('reserve') || msg.includes('calendar') || msg.includes('december') || msg.includes('november') || msg.includes('january') || msg.includes('february') || msg.includes('october')) {
      let reply = `Our inventory is backed by an automated **Transactional Anti-Double Booking Engine**. When an asset (such as the 7.3m wave stage or Versace bar) is confirmed for a ballroom date, our database atomically locks it to guarantee zero scheduling conflicts.`;

      if (inquiryCreated) {
        reply += `\n\n✅ **Inquiry Registered!** Reference: **${inquiryCreated.referenceNo}**. Our Senior Event Director will verify ballroom stock and contact you within 2 hours.`;
      } else {
        reply += `\n\nTo check exact date availability, please share your **celebration date**, **venue name** (e.g. Armani Hotel, Atlantis The Royal, Jumeirah Al Naseem), and **contact number**.`;
      }

      return {
        reply,
        suggestions: ['Chat on WhatsApp (+971 50 882 1900)', 'Open RFQ Form', 'View Pricing Packages'],
        action: 'open_rfq',
        inquiryCreated,
      };
    }

    // D. Direct WhatsApp & Contact Information
    if (msg.includes('whatsapp') || msg.includes('call') || msg.includes('phone') || msg.includes('contact') || msg.includes('number') || msg.includes('address') || msg.includes('location') || msg.includes('office') || msg.includes('showroom')) {
      const reply = `You can connect directly with our Senior Production Concierge at Four Seasons:

📱 **Official WhatsApp Business**: [+971 50 882 1900](https://wa.me/971508821900?text=Hello%20Four%20Seasons%2C%20I%20would%20like%20to%20discuss%20an%20upcoming%20event.)
📞 **Concierge Desk**: +971 4 398 2211
📧 **Email**: concierge@fourseasons.com
📍 **Atelier Showroom & Warehouse**: Central Design District (Open Mon–Sun 9:00 AM – 10:00 PM)

Click the button below to start a live WhatsApp chat immediately!`;

      return {
        reply,
        suggestions: ['Open WhatsApp Chat Now', 'View Catalog Specs', 'Plan with AI Concierge'],
        action: 'open_whatsapp',
        inquiryCreated,
      };
    }

    // E. Dynamic Digital Invitations
    if (msg.includes('invitation') || msg.includes('invite') || msg.includes('card') || msg.includes('rsvp')) {
      const reply = `Our **Dynamic Luxury Invitation Studio** creates personalized digital web invitations with:
• Live mobile & tablet canvas preview.
• Dynamic typography (Playfair Display, Great Vibes, Pinyon Script).
• Custom color palettes (Royal Gold, Emerald Noir, Rose Gold, Midnight Navy).
• Unique guest share slugs (e.g., \`/invite/your-names-2026\`).
• Automated **Guest RSVP Tracking** with dietary preferences and live headcounts.
• One-tap WhatsApp guest dispatch.

Would you like to design an invitation right now?`;

      return {
        reply,
        suggestions: ['Open Invitation Studio', 'View Live Sample Invitation', 'WhatsApp Concierge'],
        action: 'open_invitations',
        inquiryCreated,
      };
    }

    // F. General Hospitality Welcome / Fallback
    let reply = `Welcome to **Four Seasons**. I am your AI Event Concierge.

I can assist you with:
1. 🏛️ **Real Catalog Inventory**: 7.3m wave stages, Moorish arch stages, Naomi rose mandaps, and designer bars with exact dimensions.
2. ✨ **Asynchronous 4K AI Visualizer**: Combine our in-house decor into photorealistic concepts before booking.
3. 👑 **Curated Packages**: Essential (AED 49k), Signature (AED 99k), and Royal Luxe (AED 185k).
4. 💌 **Dynamic Invitations & Live RSVPs**: Interactive mobile invitations with WhatsApp guest links.
5. 🛡️ **Guaranteed Dates**: Zero double-booking reservation integrity.

How may I assist your celebration today? Feel free to ask about pricing, specific decor sizes, or dates!`;

    if (inquiryCreated) {
      reply = `Thank you! I have registered your inquiry under reference **${inquiryCreated.referenceNo}**. Our atelier team will review your specifications and contact you promptly. How else may I assist you today?`;
    }

    return {
      reply,
      suggestions: ['View Packages & Pricing', 'Explore 7.3m Wave Stage', 'Plan with AI Concierge', 'Connect on WhatsApp (+971 50 882 1900)'],
      action: null,
      inquiryCreated,
    };
  }
}

