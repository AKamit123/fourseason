import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { AiModule } from './ai/ai.module';
import { InvitationsModule } from './invitations/invitations.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { BookingsModule } from './bookings/bookings.module';
import { ZohoModule } from './zoho/zoho.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';
import { ServicesModule } from './services/services.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    InventoryModule,
    AiModule,
    InvitationsModule,
    InquiriesModule,
    BookingsModule,
    ZohoModule,
    WhatsAppModule,
    AnalyticsModule,
    SettingsModule,
    ServicesModule,
    PortfolioModule,
  ],
})
export class AppModule {}

