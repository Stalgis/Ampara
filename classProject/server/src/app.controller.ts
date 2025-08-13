import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import type { Db } from 'mongodb';

@Controller()
export class AppController {
  constructor(@InjectConnection() private readonly conn: Connection) {}

  @Get('health/db')
  async getDatabaseHealth() {
    if (this.conn.readyState !== 1) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Database connection is not ready',
      };
    }
    const db = this.conn.db as Db | undefined;
    if (!db) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Database handle missing',
      };
    }
    await db.admin().ping();
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
