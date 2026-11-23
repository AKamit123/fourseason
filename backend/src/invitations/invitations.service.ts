import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async getTemplates() {
    return this.prisma.invitationTemplate.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getTemplateByIdOrSlug(idOrSlug: string) {
    const t = await this.prisma.invitationTemplate.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (!t) throw new NotFoundException('Template not found');
    return t;
  }

  async createTemplate(dto: any) {
    const slug = dto.slug || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(100 + Math.random() * 900);
    return this.prisma.invitationTemplate.create({
      data: {
        title: dto.title,
        slug,
        category: dto.category || 'Wedding',
        description: dto.description || '',
        previewImage: dto.previewImage || '/reference_assets/hero_mandap_red.jpg',
        canvasWidth: dto.canvasWidth || 1080,
        canvasHeight: dto.canvasHeight || 1920,
        defaultSettings: dto.defaultSettings || {},
        sortOrder: dto.sortOrder || 0,
        isActive: true,
      },
    });
  }

  async updateTemplate(id: string, dto: any) {
    return this.prisma.invitationTemplate.update({
      where: { id },
      data: {
        title: dto.title,
        category: dto.category,
        description: dto.description,
        previewImage: dto.previewImage,
        canvasWidth: dto.canvasWidth ? Number(dto.canvasWidth) : undefined,
        canvasHeight: dto.canvasHeight ? Number(dto.canvasHeight) : undefined,
        defaultSettings: dto.defaultSettings,
        sortOrder: dto.sortOrder ? Number(dto.sortOrder) : undefined,
        isActive: dto.isActive,
      },
    });
  }

  async deleteTemplate(id: string) {
    return this.prisma.invitationTemplate.delete({
      where: { id },
    });
  }

  async createInvitation(dto: {
    templateId?: string;
    customerId?: string;
    title: string;
    coupleNames?: string;
    eventName: string;
    eventDate?: string;
    eventTime?: string;
    venueName?: string;
    venueAddress?: string;
    contactDetails?: string;
    customMessage?: string;
    fontFamily?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    uploadedAssets?: any;
    customData?: any;
  }) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanNames = (dto.coupleNames || dto.title || 'celebration').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const shareSlug = `${cleanNames}-${randomSuffix}`;

    return this.prisma.invitation.create({
      data: {
        shareSlug,
        templateId: dto.templateId || null,
        customerId: dto.customerId || null,
        title: dto.title,
        coupleNames: dto.coupleNames,
        eventName: dto.eventName,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : null,
        eventTime: dto.eventTime,
        venueName: dto.venueName,
        venueAddress: dto.venueAddress,
        contactDetails: dto.contactDetails,
        customMessage: dto.customMessage,
        fontFamily: dto.fontFamily || 'Playfair Display',
        primaryColor: dto.primaryColor || '#0E1B3A',
        secondaryColor: dto.secondaryColor || '#C8A24B',
        accentColor: dto.accentColor || '#E7C977',
        uploadedAssets: dto.uploadedAssets || [],
        customData: dto.customData || {},
        status: 'ACTIVE',
      },
    });
  }

  async getInvitationBySlug(shareSlug: string) {
    const inv = await this.prisma.invitation.findUnique({
      where: { shareSlug },
      include: { template: true },
    });
    if (!inv) throw new NotFoundException('Invitation not found');

    // Increment view count
    await this.prisma.invitation.update({
      where: { id: inv.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    return inv;
  }

  async submitRsvp(shareSlug: string, rsvpData: { guestName: string; guestCount: number; attending: boolean; notes?: string }) {
    const inv = await this.getInvitationBySlug(shareSlug);
    const existingData = (inv.customData as any) || {};
    const rsvpList = existingData.rsvps || [];
    rsvpList.push({
      ...rsvpData,
      submittedAt: new Date().toISOString(),
    });

    return this.prisma.invitation.update({
      where: { id: inv.id },
      data: {
        rsvpCount: { increment: rsvpData.attending ? (rsvpData.guestCount || 1) : 0 },
        customData: {
          ...existingData,
          rsvps: rsvpList,
        },
      },
    });
  }
}

