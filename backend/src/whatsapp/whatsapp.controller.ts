import { Controller, Get, Post, Body, Query, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('WhatsApp Business Integration')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private whatsappService: WhatsAppService) {}

  @Get('config')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get WhatsApp Business Cloud API settings' })
  async getConfig() {
    return this.whatsappService.getConfig();
  }

  @Post('config')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update WhatsApp API token, Phone ID, and webhook settings' })
  async updateConfig(@Body() body: any) {
    return this.whatsappService.updateConfig(body);
  }

  @Post('send-message')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send WhatsApp message, media, or invitation link' })
  async sendMessage(@Body() body: any) {
    return this.whatsappService.sendMessage(body);
  }

  @Get('webhook')
  @ApiOperation({ summary: 'Meta WhatsApp Webhook Verification Handshake' })
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: any,
  ) {
    if (mode === 'subscribe' && token === 'fs_whatsapp_verify_token_2026') {
      return res.status(HttpStatus.OK).send(challenge);
    }
    return res.status(HttpStatus.FORBIDDEN).send('Verification token mismatch');
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Meta WhatsApp Inbound Messages and Delivery Status Webhook' })
  async receiveWebhook(@Body() body: any) {
    return this.whatsappService.handleWebhook(body);
  }

  @Get('logs')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get WhatsApp communication and delivery logs' })
  async getLogs(@Query('limit') limit?: number) {
    return this.whatsappService.getLogs(limit ? Number(limit) : 50);
  }
}

