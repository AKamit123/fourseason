import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getActiveProjects(category?: string) {
    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    return this.prisma.portfolioProject.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllAdmin() {
    return this.prisma.portfolioProject.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const p = await this.prisma.portfolioProject.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Portfolio project not found');
    return p;
  }

  async createProject(dto: {
    title: string;
    description: string;
    eventType: string;
    category?: string;
    location?: string;
    clientName?: string;
    eventDate?: string;
    coverImage: string;
    images?: any;
    aiGeneratedImages?: any;
    tags?: any;
    isFeatured?: boolean;
  }) {
    const slug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    return this.prisma.portfolioProject.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        eventType: dto.eventType || 'Luxury Wedding',
        category: dto.category || 'Wedding',
        location: dto.location || 'Grand Ballroom, UAE',
        clientName: dto.clientName || 'VIP Family',
        eventDate: dto.eventDate ? new Date(dto.eventDate) : new Date(),
        coverImage: dto.coverImage || '/reference_assets/hero_mandap_red.jpg',
        images: dto.images || [dto.coverImage || '/reference_assets/hero_mandap_red.jpg'],
        aiGeneratedImages: dto.aiGeneratedImages || [],
        tags: dto.tags || ['Royal Wedding', 'Royal Mandap', 'Wave Screen'],
        isFeatured: dto.isFeatured ?? true,
      },
    });
  }

  async updateProject(id: string, dto: any) {
    await this.getById(id);
    return this.prisma.portfolioProject.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        eventType: dto.eventType,
        category: dto.category,
        location: dto.location,
        clientName: dto.clientName,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
        coverImage: dto.coverImage,
        images: dto.images,
        aiGeneratedImages: dto.aiGeneratedImages,
        tags: dto.tags,
        isFeatured: dto.isFeatured,
      },
    });
  }

  async deleteProject(id: string) {
    await this.getById(id);
    return this.prisma.portfolioProject.delete({ where: { id } });
  }
}

