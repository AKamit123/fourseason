import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getActiveServices() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getAllAdmin() {
    return this.prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getById(id: string) {
    const s = await this.prisma.service.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Service not found');
    return s;
  }

  async createService(dto: {
    name: string;
    description: string;
    shortDesc?: string;
    priceStarting?: number;
    pricingUnit?: string;
    images?: any;
    features?: any;
    isFeatured?: boolean;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    return this.prisma.service.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        shortDesc: dto.shortDesc || dto.description.substring(0, 120),
        priceStarting: dto.priceStarting ?? 0,
        pricingUnit: dto.pricingUnit || 'event',
        images: dto.images || ['/reference_assets/hero_mandap_red.jpg'],
        features: dto.features || ['Turnkey Execution', 'Bespoke AI Concepts', '24/7 Concierge'],
        isFeatured: dto.isFeatured ?? true,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async updateService(id: string, dto: any) {
    await this.getById(id);
    return this.prisma.service.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        shortDesc: dto.shortDesc,
        priceStarting: dto.priceStarting ? Number(dto.priceStarting) : undefined,
        pricingUnit: dto.pricingUnit,
        images: dto.images,
        features: dto.features,
        isFeatured: dto.isFeatured,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
      },
    });
  }

  async deleteService(id: string) {
    await this.getById(id);
    return this.prisma.service.delete({ where: { id } });
  }
}

