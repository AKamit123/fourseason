import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InquiryStatus } from '@prisma/client';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async submitInquiry(dto: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    eventType?: string;
    eventStyle?: string;
    eventDate?: string;
    eventLocation?: string;
    guestsCount?: number;
    budgetRange?: string;
    serviceRequirements?: string[];
    inventoryPreferences?: string[];
    preferredTheme?: string;
    specialInstructions?: string;
    referenceAttachments?: string[];
  }) {
    // Generate unique reference ID: FS-REQ-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `FS-REQ-${year}-${randomHex}`;

    // 1. Create or link customer
    let customer = await this.prisma.customer.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          company: dto.company || null,
          city: dto.eventLocation || 'Grand Ballroom',
        },
      });
    } else {
      await this.prisma.customer.update({
        where: { id: customer.id },
        data: { name: dto.name, company: dto.company || customer.company },
      });
    }

    // 2. Create Inquiry
    const inquiry = await this.prisma.inquiry.create({
      data: {
        referenceNo,
        customerId: customer.id,
        eventType: dto.eventType || 'Luxury Wedding',
        eventStyle: dto.eventStyle || 'Luxury Atelier',
        eventDate: dto.eventDate ? new Date(dto.eventDate) : null,
        eventLocation: dto.eventLocation || 'Grand Ballroom, UAE',
        guestsCount: Number(dto.guestsCount) || 200,
        budgetRange: dto.budgetRange || 'AED 150,000–250,000',
        status: InquiryStatus.NEW,
        priority: 'HIGH',
      },
    });

    // 3. Create Requirements
    const requirement = await this.prisma.requirement.create({
      data: {
        inquiryId: inquiry.id,
        serviceRequirements: dto.serviceRequirements || ['Wedding Production', 'AI Concepting'],
        inventoryPreferences: dto.inventoryPreferences || [],
        preferredTheme: dto.preferredTheme || 'Red Bloom',
        specialInstructions: dto.specialInstructions || '',
        referenceAttachments: dto.referenceAttachments || [],
      },
    });

    // 4. Create Notification for Admin
    await this.prisma.notification.create({
      data: {
        title: `New Inquiry from ${dto.name}`,
        message: `Reference: ${referenceNo} | Event: ${dto.eventType || 'Wedding'} | Guests: ${dto.guestsCount || 200}`,
        type: 'INQUIRY',
        actionUrl: `/admin/inquiries/${inquiry.id}`,
      },
    }).catch(() => {});

    // 5. Automated communication log for confirmation
    await this.prisma.communicationLog.create({
      data: {
        channel: 'WHATSAPP',
        direction: 'OUTBOUND',
        recipient: dto.phone,
        inquiryId: inquiry.id,
        templateName: 'fs_inquiry_received_v1',
        messagePayload: { referenceNo, customerName: dto.name },
        status: 'SENT',
      },
    }).catch(() => {});

    return {
      success: true,
      referenceNo,
      inquiryId: inquiry.id,
      customer,
      inquiry,
      requirement,
    };
  }

  async getInquiries(params: { status?: InquiryStatus; search?: string; page?: number; limit?: number }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }
    if (params.search) {
      where.OR = [
        { referenceNo: { contains: params.search } },
        { customer: { name: { contains: params.search } } },
        { customer: { email: { contains: params.search } } },
        { customer: { phone: { contains: params.search } } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        include: {
          customer: true,
          requirements: true,
          bookings: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return {
      inquiries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getInquiryById(id: string) {
    const inq = await this.prisma.inquiry.findFirst({
      where: { OR: [{ id }, { referenceNo: id }] },
      include: {
        customer: true,
        requirements: true,
        bookings: {
          include: { items: { include: { item: true } } },
        },
        communicationLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!inq) throw new NotFoundException('Inquiry not found');
    return inq;
  }

  async updateStatus(id: string, status: InquiryStatus, notes?: string, assignedTo?: string) {
    return this.prisma.inquiry.update({
      where: { id },
      data: {
        status,
        notes: notes || undefined,
        assignedTo: assignedTo || undefined,
      },
    });
  }
}

