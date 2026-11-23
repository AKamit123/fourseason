import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InquiryStatus } from '@prisma/client';

@ApiTags('Inquiries & Requirements')
@Controller('inquiries')
export class InquiriesController {
  constructor(private inquiriesService: InquiriesService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Submit client requirements and generate unique reference number' })
  async submit(@Body() body: any) {
    return this.inquiriesService.submitInquiry(body);
  }

  @Post()
  @ApiOperation({ summary: 'Submit client requirements and generate unique reference number' })
  async submitDirect(@Body() body: any) {
    return this.inquiriesService.submitInquiry(body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all inquiries with filter & pagination' })
  async getInquiries(
    @Query('status') status?: InquiryStatus,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.inquiriesService.getInquiries({ status, search, page, limit });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get full details of inquiry by ID or reference number' })
  async getInquiry(@Param('id') id: string) {
    return this.inquiriesService.getInquiryById(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inquiry status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: InquiryStatus; notes?: string; assignedTo?: string },
  ) {
    return this.inquiriesService.updateStatus(id, body.status, body.notes, body.assignedTo);
  }
}
