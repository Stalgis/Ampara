import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService, MedicationDetectionResult } from './ai.service';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('detect-medication')
  @UseInterceptors(FileInterceptor('image'))
  async detectMedication(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { barcode?: string; maxSuggestions?: string },
  ): Promise<MedicationDetectionResult> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size too large. Maximum allowed size is 10MB.',
      );
    }

    try {
      const options = {
        barcode: body.barcode,
        maxSuggestions: body.maxSuggestions ? parseInt(body.maxSuggestions) : undefined,
      };

      this.logger.log(
        `Detecting medication from image: ${file.originalname} (${file.size} bytes)${
          options.barcode ? ` with barcode: ${options.barcode}` : ''
        }`,
      );

      const result = await this.aiService.detectMedicationFromImage(
        file.buffer,
        options,
      );

      this.logger.log(
        `Medication detection completed. Confidence: ${result.confidence}%, Suggestions: ${result.suggestions.length}`,
      );

      return result;
    } catch (error) {
      this.logger.error('Error in medication detection endpoint:', error);
      throw new BadRequestException(
        'Failed to process medication detection request',
      );
    }
  }
}