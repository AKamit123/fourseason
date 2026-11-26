import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

function hasValidImageMagicBytes(buf: Buffer, mime: string): boolean {
  if (!buf || buf.length < 12) return false;
  if (mime === 'image/jpeg') {
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  }
  if (mime === 'image/png') {
    return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  }
  if (mime === 'image/webp') {
    return (
      buf.slice(0, 4).toString('ascii') === 'RIFF' &&
      buf.slice(8, 12).toString('ascii') === 'WEBP'
    );
  }
  return false;
}

@ApiTags('Secure Uploads')
@Controller('uploads')
export class UploadsController {
  @Post('image')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Securely upload an image (JPEG/PNG/WEBP, max 5MB, magic-byte verified)' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const ext = ALLOWED_MIME[file.mimetype];
    if (!ext) {
      throw new BadRequestException('Unsupported file type. Only JPEG, PNG, and WEBP images are allowed.');
    }

    if (!hasValidImageMagicBytes(file.buffer, file.mimetype)) {
      throw new BadRequestException('File signature validation failed. Corrupted or spoofed image rejected.');
    }

    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'catalogue');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeFilename = `${randomUUID()}${ext}`;
    const fullPath = path.join(uploadDir, safeFilename);
    fs.writeFileSync(fullPath, file.buffer);

    return {
      success: true,
      filename: safeFilename,
      url: `/uploads/catalogue/${safeFilename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}

