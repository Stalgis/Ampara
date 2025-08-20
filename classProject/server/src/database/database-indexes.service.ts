import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseIndexesService implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    await this.createIndexes();
  }

  private async createIndexes() {
    try {
      // ElderUsers indexes
      await this.connection.collection('elderusers').createIndex({ 'phoneNumbers.number': 1 });
      await this.connection.collection('elderusers').createIndex({ caregivers: 1 });

      // Users indexes
      await this.connection.collection('users').createIndex({ email: 1 }, { unique: true });
      await this.connection.collection('users').createIndex({ linkedElders: 1 });

      // Calls indexes
      await this.connection.collection('calls').createIndex({ elderId: 1, calledAt: -1 });
      await this.connection.collection('calls').createIndex({ dialedNumber: 1 });

      // Moods indexes
      await this.connection.collection('moods').createIndex({ elderId: 1, timestamp: -1 });

      // AdviceRequests indexes
      await this.connection.collection('advicerequests').createIndex({ elderId: 1, askedAt: -1 });
      await this.connection.collection('advicerequests').createIndex({ visitorId: 1 });

      // AiInstructions indexes
      await this.connection.collection('aiinstructions').createIndex({ 
        elderId: 1, 
        status: 1, 
        createdAt: 1 
      });
      await this.connection.collection('aiinstructions').createIndex({ callId: 1 });

      console.log('Database indexes created successfully');
    } catch (error) {
      console.error('Error creating database indexes:', error);
    }
  }
}