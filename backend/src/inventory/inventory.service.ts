import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryStatus } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // CATEGORIES & SUBCATEGORIES
  // ==========================================

  async getCategories() {
    return this.prisma.inventoryCategory.findMany({
      where: { isActive: true },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getAllCategoriesAdmin() {
    return this.prisma.inventoryCategory.findMany({
      include: {
        subcategories: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(dto: { name: string; slug?: string; description?: string; icon?: string; image?: string; sortOrder?: number }) {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.inventoryCategory.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        icon: dto.icon || 'Folder',
        image: dto.image,
        sortOrder: dto.sortOrder || 0,
      },
    });
  }

  async updateCategory(id: string, dto: any) {
    return this.prisma.inventoryCategory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(id: string) {
    return this.prisma.inventoryCategory.delete({ where: { id } });
  }

  async createSubcategory(categoryId: string, dto: { name: string; slug?: string; description?: string; sortOrder?: number }) {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.inventorySubcategory.create({
      data: {
        categoryId,
        name: dto.name,
        slug,
        description: dto.description,
        sortOrder: dto.sortOrder || 0,
      },
    });
  }

  // ==========================================
  // INVENTORY ITEMS
  // ==========================================

  async getItems(params: {
    category?: string;
    subcategory?: string;
    theme?: string;
    search?: string;
    status?: InventoryStatus;
    tradeCategory?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = { isEnabled: true };

    if (params.category && params.category !== 'All') {
      where.OR = [
        { category: { slug: params.category } },
        { category: { name: params.category } },
      ];
    }

    if (params.subcategory) {
      where.subcategory = { slug: params.subcategory };
    }

    if (params.theme && params.theme !== 'All') {
      where.theme = params.theme;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.tradeCategory && params.tradeCategory !== 'All') {
      where.tradeCategory = params.tradeCategory;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { description: { contains: params.search } },
        { sku: { contains: params.search } },
        { theme: { contains: params.search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.inventoryItem.findMany({
        where,
        include: {
          category: true,
          subcategory: true,
          media: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.inventoryItem.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getItemByIdOrSlug(idOrSlug: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }, { sku: idOrSlug }],
      },
      include: {
        category: true,
        subcategory: true,
        media: {
          orderBy: { sortOrder: 'asc' },
        },
        availabilities: {
          where: {
            date: { gte: new Date() },
          },
          take: 30,
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item ${idOrSlug} not found`);
    }

    return item;
  }

  async createItem(dto: any) {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sku = dto.sku || `FS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const item = await this.prisma.inventoryItem.create({
      data: {
        sku,
        name: dto.name,
        slug,
        categoryId: dto.categoryId,
        subcategoryId: dto.subcategoryId || null,
        theme: dto.theme || 'Red Bloom',
        description: dto.description || '',
        specifications: dto.specifications || {},
        price: Number(dto.price) || 0,
        unit: dto.unit || 'each',
        tradePrice: Number(dto.tradePrice) || 0,
        tradeCategory: dto.tradeCategory || 'Décor',
        totalQuantity: Number(dto.totalQuantity) || 1,
        availableQuantity: Number(dto.availableQuantity) || Number(dto.totalQuantity) || 1,
        status: dto.status || InventoryStatus.AVAILABLE,
        isAvailable: dto.isAvailable !== false,
        isEnabled: dto.isEnabled !== false,
        isFeatured: dto.isFeatured || false,
        tags: dto.tags || [],
        coverImage: dto.coverImage || dto.image || '/reference_assets/hero_mandap_red.jpg',
      },
    });

    // Add media if provided
    if (dto.mediaUrls && Array.isArray(dto.mediaUrls)) {
      for (let i = 0; i < dto.mediaUrls.length; i++) {
        await this.prisma.inventoryMedia.create({
          data: {
            itemId: item.id,
            url: dto.mediaUrls[i],
            isPrimary: i === 0,
            sortOrder: i,
          },
        });
      }
    } else if (item.coverImage) {
      await this.prisma.inventoryMedia.create({
        data: {
          itemId: item.id,
          url: item.coverImage,
          isPrimary: true,
          sortOrder: 0,
        },
      });
    }

    return this.getItemByIdOrSlug(item.id);
  }

  async updateItem(id: string, dto: any) {
    const updated = await this.prisma.inventoryItem.update({
      where: { id },
      data: {
        name: dto.name,
        categoryId: dto.categoryId,
        subcategoryId: dto.subcategoryId,
        theme: dto.theme,
        description: dto.description,
        specifications: dto.specifications,
        price: dto.price !== undefined ? Number(dto.price) : undefined,
        unit: dto.unit,
        tradePrice: dto.tradePrice !== undefined ? Number(dto.tradePrice) : undefined,
        tradeCategory: dto.tradeCategory,
        totalQuantity: dto.totalQuantity !== undefined ? Number(dto.totalQuantity) : undefined,
        availableQuantity: dto.availableQuantity !== undefined ? Number(dto.availableQuantity) : undefined,
        status: dto.status,
        isAvailable: dto.isAvailable,
        isEnabled: dto.isEnabled,
        isFeatured: dto.isFeatured,
        tags: dto.tags,
        coverImage: dto.coverImage,
      },
    });

    return this.getItemByIdOrSlug(updated.id);
  }

  async deleteItem(id: string) {
    return this.prisma.inventoryItem.delete({ where: { id } });
  }

  // ==========================================
  // AVAILABILITY & CALENDAR
  // ==========================================

  async getItemAvailability(itemId: string, startDate?: string, endDate?: string) {
    const where: any = { itemId };
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    return this.prisma.inventoryAvailability.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  }

  async blockDates(dto: { itemId: string; dates: string[]; status: InventoryStatus; notes?: string }) {
    const results = [];
    for (const d of dto.dates) {
      const dateObj = new Date(d);
      const res = await this.prisma.inventoryAvailability.upsert({
        where: {
          itemId_date: {
            itemId: dto.itemId,
            date: dateObj,
          },
        },
        update: {
          status: dto.status,
          notes: dto.notes,
        },
        create: {
          itemId: dto.itemId,
          date: dateObj,
          status: dto.status,
          notes: dto.notes,
        },
      });
      results.push(res);
    }
    return results;
  }
}

