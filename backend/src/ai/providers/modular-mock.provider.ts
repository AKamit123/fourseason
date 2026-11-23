import { Injectable } from '@nestjs/common';
import { IAiProvider, AiGenerationRequest, AiGenerationResult } from './ai-provider.interface';

@Injectable()
export class ModularMockProvider implements IAiProvider {
  name = 'modular_mock';

  async generateImage(req: AiGenerationRequest): Promise<AiGenerationResult> {
    // Intelligent visual synthesis based on selected inventory items and theme
    // Preserves the real high-res images of the selected mandap, stage, florals, bar, etc.
    let bestResultUrl = '/reference_assets/hero_mandap_red.jpg';
    const thumbnails: string[] = [];

    // Collect all selected item images
    for (const item of req.itemDetails) {
      if (item.coverImage) {
        thumbnails.push(item.coverImage);
      }
    }

    // Determine the focal composition image based on items and theme
    const themeLower = (req.visualTheme || '').toLowerCase();
    const promptLower = (req.prompt || '').toLowerCase();

    // Check if stage / mandap / photobooth was chosen
    const mandapItem = req.itemDetails.find(i => (i.category || '').toLowerCase().includes('mandap'));
    const stageItem = req.itemDetails.find(i => (i.category || '').toLowerCase().includes('stage'));
    const barItem = req.itemDetails.find(i => (i.category || '').toLowerCase().includes('bar'));
    const photoboothItem = req.itemDetails.find(i => (i.category || '').toLowerCase().includes('photo'));
    const swingItem = req.itemDetails.find(i => (i.category || '').toLowerCase().includes('swing') || (i.name || '').toLowerCase().includes('jhoola'));

    if (mandapItem && mandapItem.coverImage) {
      bestResultUrl = mandapItem.coverImage;
    } else if (stageItem && stageItem.coverImage) {
      bestResultUrl = stageItem.coverImage;
    } else if (swingItem && swingItem.coverImage) {
      bestResultUrl = swingItem.coverImage;
    } else if (barItem && barItem.coverImage) {
      bestResultUrl = barItem.coverImage;
    } else if (photoboothItem && photoboothItem.coverImage) {
      bestResultUrl = photoboothItem.coverImage;
    } else if (thumbnails.length > 0) {
      bestResultUrl = thumbnails[0];
    } else {
      // Default to theme
      if (themeLower.includes('grecian') || themeLower.includes('haldi')) {
        bestResultUrl = '/reference_assets/hero_grecian_haldi.jpg';
      } else if (themeLower.includes('bling')) {
        bestResultUrl = '/reference_assets/slide_bling_stage.jpg';
      } else if (themeLower.includes('boho')) {
        bestResultUrl = '/reference_assets/slide_boho.jpg';
      } else if (themeLower.includes('floral') || themeLower.includes('pastel')) {
        bestResultUrl = '/reference_assets/hero_floral_majesty.jpg';
      } else if (themeLower.includes('mehendi') || themeLower.includes('colourful')) {
        bestResultUrl = '/catalog/fs_catalog_13_swing_jhoola_floral_magenta_royal.jpg';
      }
    }

    if (!thumbnails.includes(bestResultUrl)) {
      thumbnails.unshift(bestResultUrl);
    }

    return {
      resultUrl: bestResultUrl,
      thumbnailUrls: thumbnails,
      provider: 'Four Seasons Modular Mock AI Engine (Smart Compositor v2.4)',
      providerModel: 'fs-luxury-sdxl-hybrid',
      rawResponse: {
        engine: 'smart_compositor',
        status: 'success',
        prompt_analyzed: req.prompt,
        theme_matched: req.visualTheme,
        preserved_inventory_references: req.itemDetails.map(i => i.name),
        estimated_resolution: '3840x2160 (4K UHD)',
      },
    };
  }

  async generateVideo(req: AiGenerationRequest): Promise<AiGenerationResult> {
    const imgResult = await this.generateImage(req);
    return {
      resultUrl: imgResult.resultUrl, // in full production would be mp4 video render
      thumbnailUrls: imgResult.thumbnailUrls,
      provider: 'Four Seasons Cinematic Video Synthesis Engine',
      providerModel: 'fs-luma-cinematic-v2',
      rawResponse: {
        engine: 'cinematic_video_worker',
        duration_seconds: req.durationSeconds || 5,
        camera_path: 'Orbital Crane & Slow Steadicam Inward Glide',
        framerate: '60fps',
        resolution: '1080p Full HD',
      },
    };
  }
}

