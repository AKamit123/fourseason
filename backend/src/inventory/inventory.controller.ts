import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryStatus } from '@prisma/client';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all active categories and subcategories' })
  async getCategories() {
    return this.inventoryService.getCategories();
  }

  @Get('categories/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin get all categories with count' })
  async getAllCategoriesAdmin() {
    return this.inventoryService.getAllCategoriesAdmin();
  }

  @Post('categories')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin create a category' })
  async createCategory(@Body() body: any) {
    return this.inventoryService.createCategory(body);
  }

  @Put('categories/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update category' })
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.inventoryService.updateCategory(id, body);
  }

  @Delete('categories/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin delete category' })
  async deleteCategory(@Param('id') id: string) {
    return this.inventoryService.deleteCategory(id);
  }

  @Post('categories/:id/subcategories')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin create subcategory' })
  async createSubcategory(@Param('id') id: string, @Body() body: any) {
    return this.inventoryService.createSubcategory(id, body);
  }

  @Get('items')
  @ApiOperation({ summary: 'Get inventory items with filters and pagination' })
  async getItems(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('theme') theme?: string,
    @Query('search') search?: string,
    @Query('status') status?: InventoryStatus,
    @Query('tradeCategory') tradeCategory?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.inventoryService.getItems({
      category,
      subcategory,
      theme,
      search,
      status,
      tradeCategory,
      page,
      limit,
    });
  }

  @Get('items/:idOrSlug')
  @ApiOperation({ summary: 'Get single inventory item details' })
  async getItem(@Param('idOrSlug') idOrSlug: string) {
    return this.inventoryService.getItemByIdOrSlug(idOrSlug);
  }

  @Post('items')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin create inventory item' })
  async createItem(@Body() body: any) {
    return this.inventoryService.createItem(body);
  }

  @Put('items/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update inventory item' })
  async updateItem(@Param('id') id: string, @Body() body: any) {
    return this.inventoryService.updateItem(id, body);
  }

  @Delete('items/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin delete inventory item' })
  async deleteItem(@Param('id') id: string) {
    return this.inventoryService.deleteItem(id);
  }

  @Get('availability/:itemId')
  @ApiOperation({ summary: 'Get item availability schedule' })
  async getAvailability(
    @Param('itemId') itemId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.inventoryService.getItemAvailability(itemId, startDate, endDate);
  }

  @Post('availability/block-dates')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin block/reserve dates for item' })
  async blockDates(@Body() body: { itemId: string; dates: string[]; status: InventoryStatus; notes?: string }) {
    return this.inventoryService.blockDates(body);
  }
}

