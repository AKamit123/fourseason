import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InquiryStatus, BookingStatus, InventoryStatus, AiGenType } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardKpis() {
    const [
      totalInquiries,
      newInquiries,
      pendingRequirements,
      confirmedBookings,
      totalInventory,
      unavailableInventory,
      aiImageGenerations,
      aiVideoGenerations,
      totalInvitations,
      recentActivities,
      recentInquiries,
      popularItems,
    ] = await Promise.all([
      this.prisma.inquiry.count(),
      this.prisma.inquiry.count({ where: { status: InquiryStatus.NEW } }),
      this.prisma.inquiry.count({ where: { status: { in: [InquiryStatus.NEW, InquiryStatus.UNDER_REVIEW] } } }),
      this.prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.prisma.inventoryItem.count({ where: { isEnabled: true } }),
      this.prisma.inventoryItem.count({ where: { isEnabled: true, status: { in: [InventoryStatus.OUT_OF_STOCK, InventoryStatus.RESERVED] } } }),
      this.prisma.aiGeneration.count({ where: { generationType: AiGenType.IMAGE } }),
      this.prisma.aiGeneration.count({ where: { generationType: AiGenType.VIDEO } }),
      this.prisma.invitation.count(),
      this.prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true, email: true } } },
      }),
      this.prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { customer: true },
      }),
      this.prisma.inventoryItem.findMany({
        where: { isFeatured: true },
        take: 6,
        include: { category: true },
      }),
    ]);

    const availableInventory = totalInventory - unavailableInventory;
    const conversionRate = totalInquiries > 0 ? ((confirmedBookings / totalInquiries) * 100).toFixed(1) : '0.0';

    return {
      kpis: {
        totalInquiries,
        newInquiries,
        pendingRequirements,
        confirmedBookings,
        availableInventory,
        unavailableInventory,
        totalInventory,
        aiImageGenerations,
        aiVideoGenerations,
        totalInvitations,
        conversionRate: `${conversionRate}%`,
      },
      charts: {
        monthlyInquiries: [
          { month: 'Jan', count: 18, value: 450000 },
          { month: 'Feb', count: 24, value: 680000 },
          { month: 'Mar', count: 32, value: 920000 },
          { month: 'Apr', count: 28, value: 780000 },
          { month: 'May', count: 35, value: 1100000 },
          { month: 'Jun', count: 42, value: 1350000 },
        ],
        categoryBreakdown: [
          { name: 'Mandap', value: 35, color: '#C8A24B' },
          { name: 'Stage & Backdrop', value: 25, color: '#0E1B3A' },
          { name: 'Floral Décor', value: 20, color: '#E7C977' },
          { name: 'Bar & Stations', value: 12, color: '#16264E' },
          { name: 'Photobooths', value: 8, color: '#A8842F' },
        ],
      },
      recentActivities,
      recentInquiries,
      popularItems,
    };
  }
}

