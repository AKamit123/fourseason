import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('System Settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get public system branding, currency, contact info' })
  async getPublic() {
    return this.settingsService.getPublicSettings();
  }

  @Get('seo')
  @ApiOperation({ summary: 'Get SEO, OpenGraph and Twitter meta configuration' })
  async getSeo() {
    return this.settingsService.getSeoSettings();
  }

  @Post('seo')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update SEO, OpenGraph, keywords and meta tags' })
  async updateSeo(@Body() body: Record<string, string>) {
    return this.settingsService.updateSeoSettings(body);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin get all operational system settings' })
  async getAllAdmin() {
    return this.settingsService.getAllSettingsAdmin();
  }

  @Post('update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin batch update system settings' })
  async update(@Body() body: { settings: Array<{ key: string; value: string; group?: string; isPublic?: boolean }> }) {
    return this.settingsService.updateSettings(body.settings);
  }
}

