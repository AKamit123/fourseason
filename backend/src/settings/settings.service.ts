import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getPublicSettings() {
    const settings = await this.prisma.systemSetting.findMany({
      where: { isPublic: true },
    });
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.settingKey] = s.settingValue;
    }
    return map;
  }

  async getAllSettingsAdmin() {
    return this.prisma.systemSetting.findMany({
      orderBy: { group: 'asc' },
    });
  }

  async getSeoSettings() {
    const seoSettings = await this.prisma.systemSetting.findMany({
      where: { group: 'seo' },
    });
    const map: Record<string, string> = {
      meta_title: 'Four Seasons | Luxury Wedding & Event Atelier',
      meta_description: "Premier luxury wedding & event organizers. AI-powered event concepting, authentic rental mandaps, wave screen stages, Versace bars, and turnkey celebrations.",
      meta_keywords: 'luxury wedding planner, event organizers, wedding decor rental, mandap rental, stage design, arabic nikah decor, royal wedding, corporate event planner, four seasons',
      og_title: 'Four Seasons — Bespoke Luxury Celebrations & Weddings',
      og_description: 'Design your dream celebration with AI precision and authentic luxury atelier inventory.',
      og_image: '/reference_assets/hero_mandap_red.jpg',
      og_type: 'website',
      twitter_card: 'summary_large_image',
      canonical_url: 'https://fourseasons.events',
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      author: 'Four Seasons Events Organizers LLC',
      google_verification: 'google-site-verification-token-fourseasons',
      locale: 'en_AE',
      geo_region: 'AE',
      geo_placename: 'Luxury Events Atelier',
    };

    for (const s of seoSettings) {
      const cleanKey = s.settingKey.replace(/^seo_/, '');
      map[cleanKey] = s.settingValue;
    }
    return map;
  }

  async updateSettings(settings: Array<{ key: string; value: string; group?: string; isPublic?: boolean }>) {
    const results = [];
    for (const s of settings) {
      const res = await this.prisma.systemSetting.upsert({
        where: { settingKey: s.key },
        update: { settingValue: s.value },
        create: {
          settingKey: s.key,
          settingValue: s.value,
          group: s.group || 'general',
          isPublic: s.isPublic ?? false,
        },
      });
      results.push(res);
    }
    return results;
  }

  async updateSeoSettings(data: Record<string, string>) {
    const updates = Object.entries(data).map(([k, v]) => ({
      key: k.startsWith('seo_') ? k : `seo_${k}`,
      value: String(v),
      group: 'seo',
      isPublic: true,
    }));
    await this.updateSettings(updates);
    return this.getSeoSettings();
  }
}

