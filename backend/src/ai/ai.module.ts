import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ModularMockProvider } from './providers/modular-mock.provider';

@Module({
  providers: [AiService, ModularMockProvider],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}

