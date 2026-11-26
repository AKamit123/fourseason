import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, PaymentStatus, InventoryStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) { }

  /**
   * Creates a booking using a database transaction.
   * Performs rigorous check for overlapping bookings and unavailable dates
   * to strictly PREVENT double booking.
   */
  async createBooking(dto: {
    inquiryId?: string;
    customerId: string;
    eventName?: string;
    eventType?: string;
    startDate: string;
    endDate: string;
    venue?: string;
    notes?: string;
    items: Array<{
      itemId: string;
      quantity: number;
    }>;
  }) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      throw new BadRequestException('Invalid booking date range specified');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('A booking must include at least one inventory item');
    }

    const itemIds = dto.items.map(i => i.itemId);

    // Run within a Serializable Prisma transaction to prevent concurrent double-booking
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch all items with lock/consistency
      const inventoryItems = await tx.inventoryItem.findMany({
        where: { id: { in: itemIds } },
      });

      if (inventoryItems.length !== itemIds.length) {
        throw new NotFoundException('One or more inventory items could not be found');
      }

      const itemMap = new Map(inventoryItems.map(i => [i.id, i]));

      // 2. Check for manual date blocks in inventory_availability
      const blockedAvailabilities = await tx.inventoryAvailability.findMany({
        where: {
          itemId: { in: itemIds },
          date: { gte: start, lte: end },
          status: { in: [InventoryStatus.OUT_OF_STOCK, InventoryStatus.RESERVED, InventoryStatus.MAINTENANCE] },
        },
        include: { item: true },
      });

      if (blockedAvailabilities.length > 0) {
        const itemNames = Array.from(new Set(blockedAvailabilities.map(b => b.item.name))).join(', ');
        throw new ConflictException(
          `Booking Conflict: The following items are blocked or marked unavailable for the requested period: ${itemNames}`
        );
      }

      // 3. Check for existing overlapping bookings for these items
      const overlappingBookings = await tx.booking.findMany({
        where: {
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] },
          AND: [
            { startDate: { lte: end } },
            { endDate: { gte: start } },
          ],
          items: {
            some: {
              itemId: { in: itemIds },
            },
          },
        },
        include: {
          items: {
            where: { itemId: { in: itemIds } },
            include: { item: true },
          },
        },
      });

      // Calculate total reserved quantity per item across overlapping bookings
      const reservedQuantities: Record<string, number> = {};
      for (const ob of overlappingBookings) {
        for (const bi of ob.items) {
          reservedQuantities[bi.itemId] = (reservedQuantities[bi.itemId] || 0) + bi.quantity;
        }
      }

      // Verify that requested quantity + already reserved quantity does not exceed total item stock
      for (const reqItem of dto.items) {
        const item = itemMap.get(reqItem.itemId)!;
        const alreadyReserved = reservedQuantities[reqItem.itemId] || 0;
        const availableStock = item.totalQuantity - alreadyReserved;

        if (reqItem.quantity > availableStock) {
          throw new ConflictException(
            `Double Booking Prevention: Item "${item.name}" (SKU: ${item.sku}) only has ${availableStock} unit(s) available between ${dto.startDate} and ${dto.endDate}. Requested: ${reqItem.quantity}.`
          );
        }
      }

      // 4. Calculate total amount
      let totalAmount = 0;
      const bookingItemsData = [];

      for (const reqItem of dto.items) {
        const item = itemMap.get(reqItem.itemId)!;
        const unitPrice = item.price;
        const tradePrice = item.tradePrice || 0;
        const totalPrice = unitPrice * reqItem.quantity;
        totalAmount += totalPrice;

        bookingItemsData.push({
          itemId: item.id,
          quantity: reqItem.quantity,
          unitPrice,
          tradePrice,
          totalPrice,
        });
      }

      const vatAmount = totalAmount * 0.05; // 5% UAE VAT
      const finalAmount = totalAmount + vatAmount;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const bookingReference = `FS-BKG-${new Date().getFullYear()}-${randomNum}`;

      // 5. Create Booking & Items
      const booking = await tx.booking.create({
        data: {
          bookingReference,
          inquiryId: dto.inquiryId || null,
          customerId: dto.customerId,
          eventName: dto.eventName || dto.eventType || 'Four Seasons Luxury Celebration',
          startDate: start,
          endDate: end,
          venue: dto.venue || 'Grand Ballroom Venue',
          totalAmount,
          taxAmount: vatAmount,
          finalAmount,
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.UNPAID,
          notes: dto.notes || '',
          items: {
            create: bookingItemsData,
          },
        },
        include: {
          items: { include: { item: true } },
          customer: true,
        },
      });

      // 6. Update inventory_availability records for dates
      const cur = new Date(start);
      while (cur <= end) {
        for (const reqItem of dto.items) {
          await tx.inventoryAvailability.upsert({
            where: {
              itemId_date: {
                itemId: reqItem.itemId,
                date: new Date(cur),
              },
            },
            update: {
              reservedQuantity: { increment: reqItem.quantity },
              notes: `Reserved for ${booking.bookingReference}`,
            },
            create: {
              itemId: reqItem.itemId,
              date: new Date(cur),
              status: InventoryStatus.RESERVED,
              reservedQuantity: reqItem.quantity,
              notes: `Reserved for ${booking.bookingReference}`,
            },
          });
        }
        cur.setDate(cur.getDate() + 1);
      }

      return booking;
    }, { isolationLevel: 'Serializable' });
  }

  async getBookings(params: { status?: BookingStatus; customerId?: string; search?: string }) {
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.customerId) where.customerId = params.customerId;
    if (params.search) {
      where.OR = [
        { bookingReference: { contains: params.search } },
        { eventName: { contains: params.search } },
        { customer: { name: { contains: params.search } } },
      ];
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        customer: true,
        inquiry: true,
        items: {
          include: { item: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { OR: [{ id }, { bookingReference: id }] },
      include: {
        customer: true,
        inquiry: true,
        items: {
          include: { item: { include: { category: true } } },
        },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async updateBookingStatus(id: string, status: BookingStatus, paymentStatus?: PaymentStatus) {
    return this.prisma.booking.update({
      where: { id },
      data: {
        status,
        paymentStatus: paymentStatus || undefined,
      },
    });
  }
}
