import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import WebSocket from 'ws';
import { ConfigService } from '@nestjs/config';
import { VoiceService } from './voice.service';
import { AiService } from '../ai/ai.service';

interface TwilioMediaMessage {
  event: string;
  sequenceNumber?: string;
  media?: {
    track: string;
    chunk: string;
    timestamp: string;
    payload: string;
  };
  start?: {
    streamSid: string;
    accountSid: string;
    callSid: string;
    tracks: string[];
    mediaFormat: {
      encoding: string;
      sampleRate: number;
      channels: number;
    };
  };
  streamSid?: string;
}

interface OpenAIRealtimeMessage {
  type: string;
  [key: string]: any;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/voice/media-stream',
})
export class VoiceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(VoiceGateway.name);
  private openaiConnections = new Map<string, WebSocket>();
  private twilioConnections = new Map<string, Socket>();

  constructor(
    private configService: ConfigService,
    private voiceService: VoiceService,
    private aiService: AiService,
  ) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Clean up OpenAI connection if exists
    const openaiWs = this.openaiConnections.get(client.id);
    if (openaiWs) {
      openaiWs.close();
      this.openaiConnections.delete(client.id);
    }

    this.twilioConnections.delete(client.id);
  }

  @SubscribeMessage('media')
  async handleTwilioMedia(
    @MessageBody() data: TwilioMediaMessage,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      switch (data.event) {
        case 'connected':
          this.logger.log('Twilio media stream connected');
          break;

        case 'start':
          this.logger.log(`Media stream started: ${data.start?.streamSid}`);
          this.twilioConnections.set(client.id, client);
          await this.initializeOpenAIConnection(client.id, data.start?.callSid);
          break;

        case 'media':
          await this.handleAudioData(client.id, data);
          break;

        case 'stop':
          this.logger.log('Media stream stopped');
          await this.cleanup(client.id);
          break;

        default:
          this.logger.debug(`Unhandled event: ${data.event}`);
      }
    } catch (error) {
      this.logger.error('Error handling Twilio media:', error);
    }
  }

  private async initializeOpenAIConnection(clientId: string, callSid?: string): Promise<void> {
    try {
      const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
      if (!openaiApiKey) {
        throw new Error('OPENAI_API_KEY not configured');
      }

      const openaiWsUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';

      const openaiWs = new WebSocket(openaiWsUrl, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'OpenAI-Beta': 'realtime=v1',
        },
      });

      openaiWs.on('open', () => {
        this.logger.log('Connected to OpenAI Realtime API');
        this.sendSessionUpdate(openaiWs);
      });

      openaiWs.on('message', (data) => {
        this.handleOpenAIResponse(clientId, data);
      });

      openaiWs.on('error', (error) => {
        this.logger.error('OpenAI WebSocket error:', error);
      });

      openaiWs.on('close', () => {
        this.logger.log('OpenAI connection closed');
        this.openaiConnections.delete(clientId);
      });

      this.openaiConnections.set(clientId, openaiWs);
    } catch (error) {
      this.logger.error('Error initializing OpenAI connection:', error);
    }
  }

  private sendSessionUpdate(openaiWs: WebSocket): void {
    const sessionUpdate = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: 'You are a helpful AI assistant on a phone call with an elderly person. Be conversational, natural, patient, and speak clearly. Keep responses concise and under 100 words. Speak naturally as if you\'re having a real phone conversation.',
        voice: 'alloy',
        input_audio_format: 'g711_ulaw',
        output_audio_format: 'g711_ulaw',
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 800,
        },
        temperature: 0.8,
        max_response_output_tokens: 'inf',
      },
    };

    openaiWs.send(JSON.stringify(sessionUpdate));
  }

  private async handleAudioData(clientId: string, data: TwilioMediaMessage): Promise<void> {
    const openaiWs = this.openaiConnections.get(clientId);
    
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN && data.media?.payload) {
      const audioAppend = {
        type: 'input_audio_buffer.append',
        audio: data.media.payload,
      };
      
      openaiWs.send(JSON.stringify(audioAppend));
    }
  }

  private handleOpenAIResponse(clientId: string, data: Buffer): void {
    try {
      const response: OpenAIRealtimeMessage = JSON.parse(data.toString());
      const twilioSocket = this.twilioConnections.get(clientId);

      switch (response.type) {
        case 'session.created':
          this.logger.log('OpenAI session created');
          break;

        case 'response.audio.delta':
          if (twilioSocket && response.delta) {
            const audioData = {
              event: 'media',
              streamSid: 'stream_' + clientId,
              media: {
                payload: response.delta,
              },
            };
            twilioSocket.emit('media', audioData);
          }
          break;

        case 'response.audio_transcript.delta':
          if (response.delta) {
            this.logger.debug(`AI speaking: ${response.delta}`);
          }
          break;

        case 'input_audio_buffer.speech_started':
          this.logger.debug('User started speaking');
          break;

        case 'input_audio_buffer.speech_stopped':
          this.logger.debug('User stopped speaking');
          break;

        case 'conversation.item.input_audio_transcription.completed':
          if (response.transcript) {
            this.logger.log(`User said: ${response.transcript}`);
          }
          break;

        case 'error':
          this.logger.error('OpenAI error:', response.error);
          break;

        default:
          this.logger.debug(`Unhandled OpenAI response: ${response.type}`);
      }
    } catch (error) {
      this.logger.error('Error handling OpenAI response:', error);
    }
  }

  private async cleanup(clientId: string): Promise<void> {
    const openaiWs = this.openaiConnections.get(clientId);
    if (openaiWs) {
      openaiWs.close();
      this.openaiConnections.delete(clientId);
    }

    this.twilioConnections.delete(clientId);
  }
}