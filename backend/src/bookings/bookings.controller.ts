import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingStatus, PaymentStatus } from '@prisma/client';

@ApiTags('Bookings & Reservations')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager', 'customer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new booking with transactional double-booking prevention' })
  async create(@Body() body: any) {
    return this.bookingsService.createBooking(body);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager', 'customer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new booking with transactional double-booking prevention' })
  async createDirect(@Body() body: any) {
    return this.bookingsService.createBooking(body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings' })
  async getBookings(
    @Query('status') status?: BookingStatus,
    @Query('customerId') customerId?: string,
    @Query('search') search?: string,
  ) {
    return this.bookingsService.getBookings({ status, customerId, search });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager', 'customer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking details by ID or reference' })
  async getBooking(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status and payment status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: BookingStatus; paymentStatus?: PaymentStatus },
  ) {
    return this.bookingsService.updateBookingStatus(id, body.status, body.paymentStatus);
  }
}
