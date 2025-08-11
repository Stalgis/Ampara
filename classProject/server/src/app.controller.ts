import { Controller, Get } from '@nestjs/common';
import { connection } from 'mongoose';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return 'CompaniOn API is running!';
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/db')
  async getDatabaseHealth(): Promise<{
    status: string;
    timestamp: string;
    message?: string;
  }> {
    if (connection.readyState !== 1) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Database connection is not ready',
      };
    }

    try {
      await connection.db.admin().ping();
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Database ping failed',
      };
    }
  }
}
