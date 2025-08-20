import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ElderUsersModule } from './modules/elder-users/elder-users.module';
import { CallsModule } from './modules/calls/calls.module';
import { MoodsModule } from './modules/moods/moods.module';
import { AdviceRequestsModule } from './modules/advice-requests/advice-requests.module';
import { AiInstructionsModule } from './modules/ai-instructions/ai-instructions.module';
import { DatabaseIndexesService } from './database/database-indexes.service';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get('database.uri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ElderUsersModule,
    CallsModule,
    MoodsModule,
    AdviceRequestsModule,
    AiInstructionsModule,
  ],
  providers: [DatabaseIndexesService],
})
export class AppModule {}
