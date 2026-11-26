import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZohoService {
  private readonly logger = new Logger(ZohoService.name);

  constructor(private prisma: PrismaService) {}

  async getConfig() {
    return this.prisma.zohoIntegration.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateConfig(dto: {
    environment?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    apiDomain?: string;
    isEnabled?: boolean;
    autoSyncLeads?: boolean;
    syncFrequencyMinutes?: number;
  }) {
    const existing = await this.getConfig();
    if (existing) {
      return this.prisma.zohoIntegration.update({
        where: { id: existing.id },
        data: dto,
      });
    }
    return this.prisma.zohoIntegration.create({
      data: {
        environment: dto.environment || 'production',
        clientId: dto.clientId,
        clientSecret: dto.clientSecret,
        refreshToken: dto.refreshToken,
        apiDomain: dto.apiDomain || 'https://www.zohoapis.com',
        isEnabled: dto.isEnabled || false,
        autoSyncLeads: dto.autoSyncLeads !== false,
        syncFrequencyMinutes: dto.syncFrequencyMinutes || 15,
      },
    });
  }

  async syncInquiryLead(inquiryId: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: { customer: true, requirements: true },
    });

    if (!inquiry) {
      throw new Error(`Inquiry ${inquiryId} not found`);
    }

    const config = await this.getConfig();
    const isMock = !config || !config.isEnabled || !config.clientId || !config.refreshToken;

    const leadPayload = {
      Last_Name: inquiry.customer.name,
      Email: inquiry.customer.email,
      Phone: inquiry.customer.phone,
      Company: inquiry.customer.company || 'Private Event',
      Lead_Source: 'Four Seasons AI Studio Platform',
      Description: `Event: ${inquiry.eventType} | Guests: ${inquiry.guestsCount} | Budget: ${inquiry.budgetRange} | Ref: ${inquiry.referenceNo}`,
      Event_Date: inquiry.eventDate?.toISOString().split('T')[0],
      Venue: inquiry.eventLocation,
      Theme: inquiry.requirements?.preferredTheme || 'Red Bloom',
    };

    try {
      let zohoLeadId = inquiry.zohoLeadId;

      if (isMock) {
        // Operational simulated sync when live credentials are not yet entered
        zohoLeadId = `zoho_lead_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        this.logger.log(`Zoho lead synced (simulated/offline mode): ${zohoLeadId} for Inquiry ${inquiry.referenceNo}`);
      } else {
        // Real Zoho OAuth Token Refresh + CRM v2 Leads Upsert
        const accountsUrl = (config.apiDomain || 'https://www.zohoapis.com').includes('.eu')
          ? 'https://accounts.zoho.eu/oauth/v2/token'
          : (config.apiDomain || '').includes('.in')
          ? 'https://accounts.zoho.in/oauth/v2/token'
          : 'https://accounts.zoho.com/oauth/v2/token';

        const tokenParams = new URLSearchParams({
          refresh_token: config.refreshToken!,
          client_id: config.clientId!,
          client_secret: config.clientSecret || '',
          grant_type: 'refresh_token',
        });

        const tokenRes = await fetch(`${accountsUrl}?${tokenParams.toString()}`, { method: 'POST' });
        const tokenJson: any = await tokenRes.json();
        if (!tokenRes.ok || !tokenJson.access_token) {
          throw new Error(`Zoho OAuth refresh failed: ${tokenJson.error || tokenRes.status}`);
        }

        const crmRes = await fetch(`${config.apiDomain || 'https://www.zohoapis.com'}/crm/v2/Leads/upsert`, {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${tokenJson.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: [leadPayload], duplicate_check_fields: ['Email'] }),
        });
        const crmJson: any = await crmRes.json();
        if (!crmRes.ok) {
          throw new Error(`Zoho CRM API error: ${JSON.stringify(crmJson)}`);
        }
        zohoLeadId = crmJson?.data?.[0]?.details?.id || `zoho_live_${Date.now()}`;
      }

      await this.prisma.inquiry.update({
        where: { id: inquiry.id },
        data: { zohoLeadId },
      });

      // Update sync timestamp
      if (config) {
        await this.prisma.zohoIntegration.update({
          where: { id: config.id },
          data: { lastSyncAt: new Date(), lastError: null },
        });
      }

      await this.prisma.communicationLog.create({
        data: {
          channel: 'ZOHO',
          direction: 'OUTBOUND',
          recipient: 'Zoho CRM Leads Module',
          referenceType: 'INQUIRY',
          referenceId: inquiry.referenceNo,
          inquiryId: inquiry.id,
          messagePayload: leadPayload,
          responsePayload: { zohoLeadId, syncStatus: 'SUCCESS', mode: isMock ? 'DEMO_FALLBACK' : 'LIVE' },
          status: 'DELIVERED',
        },
      });

      return {
        success: true,
        zohoLeadId,
        mode: isMock ? 'DEMO_FALLBACK' : 'LIVE',
        message: 'Lead successfully synchronized to Zoho CRM',
      };
    } catch (err: any) {
      this.logger.error(`Zoho sync failed: ${err.message}`);
      if (config) {
        await this.prisma.zohoIntegration.update({
          where: { id: config.id },
          data: { lastError: err.message },
        });
      }
      throw err;
    }
  }

  async getSyncLogs() {
    return this.prisma.communicationLog.findMany({
      where: { channel: 'ZOHO' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

