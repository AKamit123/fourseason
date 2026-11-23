import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ZohoService } from './zoho.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Zoho CRM Integration')
@Controller('zoho')
export class ZohoController {
  constructor(private zohoService: ZohoService) {}

  @Get('config')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Zoho integration configuration' })
  async getConfig() {
    return this.zohoService.getConfig();
  }

  @Post('config')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Zoho CRM settings and API credentials' })
  async updateConfig(@Body() body: any) {
    return this.zohoService.updateConfig(body);
  }

  @Post('sync-lead/:inquiryId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger synchronization of inquiry as a lead in Zoho CRM' })
  async syncLead(@Param('inquiryId') inquiryId: string) {
    return this.zohoService.syncInquiryLead(inquiryId);
  }

  @Get('sync-logs')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recent Zoho CRM synchronization logs' })
  async getSyncLogs() {
    return this.zohoService.getSyncLogs();
  }
}

