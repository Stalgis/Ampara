import { Controller, Get } from '@nestjs/common';

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
  async getDatabaseHealth(): Promise<{ status: string; timestamp: string }> {
    // TODO: Add actual database connection check
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
