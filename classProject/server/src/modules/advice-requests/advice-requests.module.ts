import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdviceRequestsController } from './advice-requests.controller';
import { AdviceRequestsService } from './advice-requests.service';
import { AdviceRequest, AdviceRequestSchema } from './advice-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdviceRequest.name, schema: AdviceRequestSchema },
    ]),
  ],
  controllers: [AdviceRequestsController],
  providers: [AdviceRequestsService],
  exports: [AdviceRequestsService],
})
export class AdviceRequestsModule {}
