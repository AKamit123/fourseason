import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiResponse({ status: 200, description: 'Authentication successful with JWT token' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new customer account' })
  async register(@Body() body: { name: string; email: string; phone: string; password?: string; company?: string }) {
    return this.authService.registerClient(body);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset token' })
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using a valid reset token' })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-plans')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated customer own saved plans, inquiries and bookings (data isolated)' })
  async getMyPlans(@Request() req: any) {
    return this.authService.getMyPortalData(req.user.id, req.user.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}

