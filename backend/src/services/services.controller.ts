import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Services Management')
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get active event production services' })
  async getActive() {
    return this.servicesService.getActiveServices();
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin get all services' })
  async getAllAdmin() {
    return this.servicesService.getAllAdmin();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin create a service' })
  async create(@Body() body: any) {
    return this.servicesService.createService(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update a service' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.servicesService.updateService(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin delete a service' })
  async delete(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }
}

