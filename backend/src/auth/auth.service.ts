import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      return null;
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role.slug,
    };

    // Log user activity
    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        module: 'AUTH',
        metadata: { email: user.email, role: user.role.slug },
      },
    }).catch(() => {});

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.slug,
        roleName: user.role.name,
        permissions: user.role.permissions,
      },
    };
  }

  async registerClient(dto: { name: string; email: string; phone: string; password?: string; company?: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('An account with this email already exists');
    }

    let customerRole = await this.prisma.role.findUnique({ where: { slug: 'customer' } });
    if (!customerRole) {
      customerRole = await this.prisma.role.create({
        data: { name: 'Client', slug: 'customer', permissions: { view_portal: true } },
      });
    }

    const rawPassword = dto.password || 'Client@2026';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        roleId: customerRole.id,
      },
      include: { role: true },
    });

    // Also link/create Customer record
    await this.prisma.customer.upsert({
      where: { id: newUser.id },
      update: { name: dto.name, phone: dto.phone, company: dto.company },
      create: {
        id: newUser.id,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
      },
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role.slug,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role.slug,
        roleName: newUser.role.name,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    if (!user) throw new UnauthorizedException();
    const { passwordHash, ...result } = user;
    return result;
  }

  async forgotPassword(email: string) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return {
        success: true,
        message: 'If an account exists for that email, a password reset token has been generated.',
      };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, purpose: 'password-reset' },
      { expiresIn: '15m' },
    );

    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        module: 'AUTH',
        metadata: { email: user.email },
      },
    }).catch(() => {});

    return {
      success: true,
      message: 'Password reset token generated (valid for 15 minutes).',
      resetToken: process.env.NODE_ENV === 'production' ? undefined : resetToken,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    let decoded: any;
    try {
      decoded = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (decoded?.purpose !== 'password-reset' || !decoded?.sub) {
      throw new BadRequestException('Invalid password reset token');
    }

    // Enforce single-use reset token: reject if password was already reset after token was issued
    const userRecord = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!userRecord) {
      throw new BadRequestException('User account no longer exists');
    }
    if (decoded.iat && userRecord.updatedAt.getTime() > decoded.iat * 1000 + 1500) {
      throw new BadRequestException('This password reset token has already been used');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: decoded.sub },
      data: { passwordHash },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: decoded.sub,
        action: 'PASSWORD_RESET_COMPLETED',
        module: 'AUTH',
      },
    }).catch(() => {});

    return { success: true, message: 'Password has been reset successfully. You may now sign in.' };
  }

  async getMyPortalData(userId: string, email: string) {
    const customers = await this.prisma.customer.findMany({
      where: { email },
      select: { id: true },
    });
    const customerIds = customers.map((c) => c.id);
    if (customerIds.length === 0) {
      return { inquiries: [], bookings: [] };
    }

    const [inquiries, bookings] = await Promise.all([
      this.prisma.inquiry.findMany({
        where: { customerId: { in: customerIds } },
        include: { requirements: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.findMany({
        where: { customerId: { in: customerIds } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { inquiries, bookings };
  }
}

