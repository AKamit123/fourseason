import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Portfolio & Past Projects')
@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get active portfolio projects filterable by category' })
  async getActive(@Query('category') category?: string) {
    return this.portfolioService.getActiveProjects(category);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin get all portfolio projects' })
  async getAllAdmin() {
    return this.portfolioService.getAllAdmin();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin create a portfolio project' })
  async create(@Body() body: any) {
    return this.portfolioService.createProject(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update a portfolio project' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.portfolioService.updateProject(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin delete a portfolio project' })
  async delete(@Param('id') id: string) {
    return this.portfolioService.deleteProject(id);
  }
}

