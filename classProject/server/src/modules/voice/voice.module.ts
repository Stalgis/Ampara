import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { VoiceGateway } from './voice.gateway';
import { VoiceCall, VoiceCallSchema, ConversationTurn, ConversationTurnSchema } from './voice.schema';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VoiceCall.name, schema: VoiceCallSchema },
      { name: ConversationTurn.name, schema: ConversationTurnSchema },
    ]),
    AiModule,
  ],
  controllers: [VoiceController],
  providers: [VoiceService, VoiceGateway],
  exports: [VoiceService],
})
export class VoiceModule {}