import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiInstructionsController } from './ai-instructions.controller';
import { AiInstructionsService } from './ai-instructions.service';
import { AiInstruction, AiInstructionSchema } from './ai-instructions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiInstruction.name, schema: AiInstructionSchema }]),
  ],
  controllers: [AiInstructionsController],
  providers: [AiInstructionsService],
  exports: [AiInstructionsService],
})
export class AiInstructionsModule {}