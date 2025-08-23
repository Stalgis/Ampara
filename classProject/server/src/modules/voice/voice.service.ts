import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { VoiceCall, VoiceCallDocument, ConversationTurn, ConversationTurnDocument, CallStatus, CallDirection, SpeakerType } from './voice.schema';
import { AiService, ChatMessage } from '../ai/ai.service';

export interface MakeCallDto {
  phoneNumber: string;
  elderId: string;
  message?: string;
  initiatedBy?: string;
}

export interface CallUpdateDto {
  status?: CallStatus;
  duration?: number;
  endTime?: Date;
  twilioData?: Record<string, any>;
}

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);
  private readonly twilioClient: twilio.Twilio;

  constructor(
    @InjectModel(VoiceCall.name) private voiceCallModel: Model<VoiceCallDocument>,
    @InjectModel(ConversationTurn.name) private conversationTurnModel: Model<ConversationTurnDocument>,
    private configService: ConfigService,
    private aiService: AiService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_SID');
    const authToken = this.configService.get<string>('TWILIO_TOKEN');

    if (!accountSid || !authToken) {
      throw new Error('TWILIO_SID and TWILIO_TOKEN are required');
    }

    this.twilioClient = twilio(accountSid, authToken);
  }

  async makeOutboundCall(callData: MakeCallDto): Promise<VoiceCallDocument> {
    try {
      const webhookUrl = this.configService.get<string>('WEBHOOK_URL');
      const twilioNumber = this.configService.get<string>('TWILIO_NUMBER');

      if (!webhookUrl || !twilioNumber) {
        throw new Error('WEBHOOK_URL and TWILIO_NUMBER are required');
      }

      // Make the Twilio call
      const call = await this.twilioClient.calls.create({
        to: callData.phoneNumber,
        from: twilioNumber,
        url: `${webhookUrl}/voice?initial_message=${encodeURIComponent(callData.message || 'Hello! I\'m your AI assistant. How can I help you today?')}`,
        method: 'POST',
      });

      // Save call record to database
      const voiceCall = new this.voiceCallModel({
        callSid: call.sid,
        elderId: new Types.ObjectId(callData.elderId),
        initiatedBy: callData.initiatedBy ? new Types.ObjectId(callData.initiatedBy) : undefined,
        phoneNumber: callData.phoneNumber,
        direction: CallDirection.OUTBOUND,
        status: CallStatus.INITIATED,
        startTime: new Date(),
        twilioData: {
          callSid: call.sid,
          status: call.status,
        },
      });

      const savedCall = await voiceCall.save();
      this.logger.log(`Outbound call initiated: ${call.sid} to ${callData.phoneNumber}`);

      return savedCall;
    } catch (error) {
      this.logger.error('Error making outbound call:', error);
      throw new Error(`Failed to make call: ${error.message}`);
    }
  }

  async updateCallStatus(callSid: string, updateData: CallUpdateDto): Promise<VoiceCallDocument> {
    try {
      const updatedCall = await this.voiceCallModel.findOneAndUpdate(
        { callSid },
        { $set: updateData },
        { new: true }
      ).exec();

      if (!updatedCall) {
        throw new Error(`Call not found: ${callSid}`);
      }

      this.logger.log(`Call ${callSid} updated with status: ${updateData.status}`);
      return updatedCall;
    } catch (error) {
      this.logger.error('Error updating call status:', error);
      throw error;
    }
  }

  async getCall(callSid: string): Promise<VoiceCallDocument> {
    const call = await this.voiceCallModel
      .findOne({ callSid })
      .populate(['elderId', 'initiatedBy', 'conversationTurns'])
      .exec();

    if (!call) {
      throw new Error(`Call not found: ${callSid}`);
    }

    return call as VoiceCallDocument;
  }

  async getCallsByElder(elderId: string): Promise<VoiceCallDocument[]> {
    return this.voiceCallModel
      .find({ elderId: new Types.ObjectId(elderId) })
      .sort({ createdAt: -1 })
      .populate(['initiatedBy', 'conversationTurns'])
      .exec();
  }

  async processUserSpeech(
    callSid: string,
    speechText: string,
    confidence?: number,
  ): Promise<{
    response: string;
    audioBuffer?: Buffer;
  }> {
    try {
      const call = await this.getCall(callSid);
      
      // Get conversation history for context
      const conversationHistory = await this.getConversationHistory(call._id as Types.ObjectId);
      
      // Convert to chat messages format
      const chatMessages: ChatMessage[] = conversationHistory.map(turn => ({
        role: turn.speaker === SpeakerType.USER ? 'user' : 'assistant',
        content: turn.speaker === SpeakerType.USER ? (turn.transcription || '') : (turn.response || ''),
      }));

      // Get elder context (you might want to fetch this from elder user profile)
      const elderContext = 'This person is an elderly user who may need patience and clear communication.';

      // Process with AI
      const aiResult = await this.aiService.processConversationTurn(
        speechText,
        chatMessages,
        elderContext,
      );

      // Save user turn
      await this.addConversationTurn({
        callId: call._id as Types.ObjectId,
        speaker: SpeakerType.USER,
        transcription: speechText,
        confidence,
      });

      // Save AI response turn
      await this.addConversationTurn({
        callId: call._id as Types.ObjectId,
        speaker: SpeakerType.AI,
        response: aiResult.response,
        aiModel: 'gpt-3.5-turbo',
      });

      return aiResult;
    } catch (error) {
      this.logger.error('Error processing user speech:', error);
      return {
        response: "I'm sorry, I'm having trouble understanding right now. Could you please try again?",
      };
    }
  }

  async addConversationTurn(turnData: {
    callId: Types.ObjectId;
    speaker: SpeakerType;
    transcription?: string;
    response?: string;
    audioUrl?: string;
    confidence?: number;
    duration?: number;
    aiModel?: string;
    metadata?: Record<string, any>;
  }): Promise<ConversationTurnDocument> {
    const turn = new this.conversationTurnModel(turnData);
    const savedTurn = await turn.save();

    // Add turn ID to call's conversation turns array
    await this.voiceCallModel.findByIdAndUpdate(
      turnData.callId,
      { $push: { conversationTurns: savedTurn._id } }
    ).exec();

    return savedTurn;
  }

  async getConversationHistory(callId: Types.ObjectId): Promise<ConversationTurnDocument[]> {
    return this.conversationTurnModel
      .find({ callId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async getCallSummary(callSid: string): Promise<{
    summary: string;
    mood: string;
    keyTopics: string[];
    recommendations: string[];
  }> {
    try {
      const call = await this.getCall(callSid);
      const conversationHistory = await this.getConversationHistory(call._id as Types.ObjectId);

      const conversationTurns = conversationHistory.map(turn => ({
        speaker: turn.speaker,
        content: turn.speaker === SpeakerType.USER ? (turn.transcription || '') : (turn.response || ''),
        timestamp: (turn as any).createdAt || new Date(),
      }));

      return this.aiService.analyzeCallSummary(conversationTurns);
    } catch (error) {
      this.logger.error('Error generating call summary:', error);
      return {
        summary: 'Unable to generate summary.',
        mood: 'unknown',
        keyTopics: [],
        recommendations: [],
      };
    }
  }

  generateTwiMLResponse(message: string, action: string = '/voice'): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" timeout="10" speechTimeout="auto" action="${action}" method="POST">
        <Say voice="alice">${message}</Say>
    </Gather>
    <Say voice="alice">I didn't hear anything. Let me try again.</Say>
    <Redirect>${action}</Redirect>
</Response>`;
  }

  generateSayTwiML(message: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">${message}</Say>
    <Hangup/>
</Response>`;
  }

  generateStreamTwiML(streamUrl: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Hello! I'm connecting you to our AI assistant. Please wait a moment.</Say>
    <Connect>
        <Stream url="${streamUrl}" />
    </Connect>
</Response>`;
  }
}