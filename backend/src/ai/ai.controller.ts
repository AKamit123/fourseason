import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiGenType } from '@prisma/client';

@ApiTags('AI Generation')
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate-image')
  @ApiOperation({ summary: 'Submit asynchronous AI image generation task with selected inventory items' })
  async generateImage(@Body() body: {
    itemIds: string[];
    prompt?: string;
    instructions?: string;
    visualTheme?: string;
    aspectRatio?: string;
    customerId?: string;
  }) {
    return this.aiService.initiateImageGeneration(body);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Submit asynchronous AI concept generation task' })
  async generateGeneric(@Body() body: any) {
    if (body.generationType === 'VIDEO') {
      return this.aiService.initiateVideoGeneration(body);
    }
    return this.aiService.initiateImageGeneration(body);
  }

  @Post('generate-video')
  @ApiOperation({ summary: 'Submit asynchronous AI conceptual video generation task' })
  async generateVideo(@Body() body: {
    itemIds: string[];
    instructions?: string;
    visualTheme?: string;
    durationSeconds?: number;
    customerId?: string;
  }) {
    return this.aiService.initiateVideoGeneration(body);
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Poll generation progress and retrieve final output' })
  async getStatus(@Param('id') id: string) {
    return this.aiService.getGenerationStatus(id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get list of past AI image and video generations' })
  async getHistory(
    @Query('customerId') customerId?: string,
    @Query('type') type?: AiGenType,
    @Query('limit') limit?: number,
  ) {
    return this.aiService.getHistory({ customerId, type, limit });
  }

  @Post('regenerate/:id')
  @ApiOperation({ summary: 'Trigger a new variation based on existing generation combination' })
  async regenerate(@Param('id') id: string) {
    return this.aiService.regenerate(id);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Four Seasons Luxury Wedding & Event AI Concierge Chatbot' })
  async chat(@Body() body: {
    message: string;
    history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    customerInfo?: { name?: string; phone?: string; email?: string };
  }) {
    return this.aiService.chatWithConcierge(body);
  }
}
