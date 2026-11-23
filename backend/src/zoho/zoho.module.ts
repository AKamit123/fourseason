import { Module } from '@nestjs/common';
import { ZohoService } from './zoho.service';
import { ZohoController } from './zoho.controller';

@Module({
  providers: [ZohoService],
  controllers: [ZohoController],
  exports: [ZohoService],
})
export class ZohoModule {}

