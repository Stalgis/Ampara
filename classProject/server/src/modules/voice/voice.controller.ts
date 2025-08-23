import { Controller, Post, Get, Body, Param, Query, Res, Logger, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { VoiceService, MakeCallDto } from './voice.service';
import { CallStatus } from './voice.schema';
import { Auth0Guard, OptionalAuth0Guard } from '../auth/auth0.guard';
import { CurrentUser, Auth0User } from '../auth/current-user.decorator';

export interface TwilioWebhookBody {
  CallSid: string;
  CallStatus: string;
  SpeechResult?: string;
  From: string;
  To: string;
  CallDuration?: string;
  [key: string]: any;
}

@Controller('voice')
export class VoiceController {
  private readonly logger = new Logger(VoiceController.name);

  constructor(private readonly voiceService: VoiceService) {}

  @Post('make-call')
  @UseGuards(Auth0Guard)
  async makeCall(@Body() makeCallDto: MakeCallDto, @CurrentUser() user: Auth0User) {
    try {
      const call = await this.voiceService.makeOutboundCall(makeCallDto);
      
      return {
        success: true,
        message: 'Call initiated successfully',
        callSid: call.callSid,
        data: call,
      };
    } catch (error) {
      this.logger.error('Error making call:', error);
      return {
        success: false,
        message: 'Failed to initiate call',
        error: error.message,
      };
    }
  }

  @Post('webhook')
  async handleTwilioWebhook(
    @Body() body: TwilioWebhookBody,
    @Query('initial_message') initialMessage?: string,
    @Res() res?: Response,
  ) {
    try {
      this.logger.log('Twilio webhook received:', body);

      const { CallSid, CallStatus, SpeechResult } = body;

      // Update call status in database
      if (CallStatus) {
        const status = this.mapTwilioStatusToCallStatus(CallStatus);
        await this.voiceService.updateCallStatus(CallSid, {
          status,
          twilioData: body,
        });
      }

      // Handle speech input
      if (SpeechResult && SpeechResult.trim()) {
        this.logger.log(`User said: ${SpeechResult}`);
        
        const aiResult = await this.voiceService.processUserSpeech(
          CallSid,
          SpeechResult,
        );

        this.logger.log(`AI response: ${aiResult.response}`);

        // Check if conversation should end
        if (aiResult.response.toLowerCase().includes('goodbye') || 
            aiResult.response.toLowerCase().includes('thank you for calling')) {
          const twiml = this.voiceService.generateSayTwiML(aiResult.response);
          res?.type('text/xml').send(twiml);
          return;
        }

        // Continue conversation
        const twiml = this.voiceService.generateTwiMLResponse(aiResult.response);
        res?.type('text/xml').send(twiml);
        return;
      }

      // Initial greeting
      const greeting = initialMessage || "Hello! I'm an AI assistant. How can I help you today?";
      const twiml = this.voiceService.generateTwiMLResponse(greeting);
      res?.type('text/xml').send(twiml);

    } catch (error) {
      this.logger.error('Error handling Twilio webhook:', error);
      
      const errorTwiml = this.voiceService.generateSayTwiML(
        "I'm sorry, I'm experiencing technical difficulties. Please try calling again later."
      );
      res?.status(HttpStatus.INTERNAL_SERVER_ERROR).type('text/xml').send(errorTwiml);
    }
  }

  @Post('realtime-webhook')
  async handleRealtimeWebhook(@Res() res: Response) {
    try {
      const host = res.req.get('host');
      const protocol = res.req.get('x-forwarded-proto') || 'http';
      const wsProtocol = protocol === 'https' ? 'wss' : 'ws';
      const streamUrl = `${wsProtocol}://${host}/voice/media-stream`;

      const twiml = this.voiceService.generateStreamTwiML(streamUrl);
      
      res.type('text/xml').send(twiml);
    } catch (error) {
      this.logger.error('Error handling realtime webhook:', error);
      
      const errorTwiml = this.voiceService.generateSayTwiML(
        "I'm sorry, I'm experiencing technical difficulties."
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).type('text/xml').send(errorTwiml);
    }
  }

  @Get('call/:callSid')
  @UseGuards(Auth0Guard)
  async getCall(@Param('callSid') callSid: string, @CurrentUser() user: Auth0User) {
    try {
      const call = await this.voiceService.getCall(callSid);
      return {
        success: true,
        data: call,
      };
    } catch (error) {
      this.logger.error('Error fetching call:', error);
      return {
        success: false,
        message: 'Call not found',
        error: error.message,
      };
    }
  }

  @Get('calls/elder/:elderId')
  @UseGuards(Auth0Guard)
  async getCallsByElder(@Param('elderId') elderId: string, @CurrentUser() user: Auth0User) {
    try {
      const calls = await this.voiceService.getCallsByElder(elderId);
      return {
        success: true,
        data: calls,
      };
    } catch (error) {
      this.logger.error('Error fetching calls:', error);
      return {
        success: false,
        message: 'Failed to fetch calls',
        error: error.message,
      };
    }
  }

  @Get('call/:callSid/summary')
  async getCallSummary(@Param('callSid') callSid: string) {
    try {
      const summary = await this.voiceService.getCallSummary(callSid);
      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      this.logger.error('Error generating call summary:', error);
      return {
        success: false,
        message: 'Failed to generate summary',
        error: error.message,
      };
    }
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Voice API',
    };
  }

  private mapTwilioStatusToCallStatus(twilioStatus: string): CallStatus {
    switch (twilioStatus.toLowerCase()) {
      case 'queued':
      case 'initiated':
        return CallStatus.INITIATED;
      case 'ringing':
        return CallStatus.RINGING;
      case 'in-progress':
        return CallStatus.IN_PROGRESS;
      case 'completed':
        return CallStatus.COMPLETED;
      case 'failed':
        return CallStatus.FAILED;
      case 'busy':
        return CallStatus.BUSY;
      case 'no-answer':
        return CallStatus.NO_ANSWER;
      default:
        return CallStatus.INITIATED;
    }
  }
}