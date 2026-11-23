import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private invitationsService: InvitationsService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Get all active dynamic invitation templates' })
  async getTemplates() {
    return this.invitationsService.getTemplates();
  }

  @Get('templates/:idOrSlug')
  @ApiOperation({ summary: 'Get invitation template details' })
  async getTemplate(@Param('idOrSlug') idOrSlug: string) {
    return this.invitationsService.getTemplateByIdOrSlug(idOrSlug);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create new invitation template' })
  async createTemplate(@Body() body: any) {
    return this.invitationsService.createTemplate(body);
  }

  @Post('templates/:id')
  @ApiOperation({ summary: 'Update invitation template' })
  async updateTemplatePost(@Param('id') id: string, @Body() body: any) {
    return this.invitationsService.updateTemplate(id, body);
  }

  @Get('templates/delete/:id')
  @ApiOperation({ summary: 'Delete invitation template' })
  async deleteTemplateGet(@Param('id') id: string) {
    return this.invitationsService.deleteTemplate(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create and customize a dynamic invitation' })
  async createInvitation(@Body() body: any) {
    return this.invitationsService.createInvitation(body);
  }

  @Get('view/:shareSlug')
  @ApiOperation({ summary: 'Publicly view an invitation by its unique link' })
  async viewInvitation(@Param('shareSlug') shareSlug: string) {
    return this.invitationsService.getInvitationBySlug(shareSlug);
  }

  @Post('rsvp/:shareSlug')
  @ApiOperation({ summary: 'Submit RSVP for an invitation' })
  async submitRsvp(
    @Param('shareSlug') shareSlug: string,
    @Body() body: { guestName: string; guestCount: number; attending: boolean; notes?: string },
  ) {
    return this.invitationsService.submitRsvp(shareSlug, body);
  }
}

