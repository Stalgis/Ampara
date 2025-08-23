import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TranscriptionResult {
  text: string;
  confidence?: number;
}

export interface TTSResult {
  audioBuffer: Buffer;
  duration?: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.openai = new OpenAI({
      apiKey,
    });
  }

  async generateChatResponse(
    messages: ChatMessage[],
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      elderContext?: string;
    } = {},
  ): Promise<string> {
    try {
      const {
        model = 'gpt-3.5-turbo',
        maxTokens = 150,
        temperature = 0.7,
        elderContext,
      } = options;

      // Add elder-specific context if provided
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `You are a helpful AI assistant speaking on a phone call with an elderly person. Be conversational, natural, patient, and speak clearly. Keep responses concise and under 100 words. Speak naturally as if you're having a real phone conversation. ${elderContext ? `Additional context about this person: ${elderContext}` : ''}`,
      };

      const completion = await this.openai.chat.completions.create({
        model,
        messages: [systemMessage, ...messages],
        max_tokens: maxTokens,
        temperature,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I didn't understand that. Could you please repeat?";
    } catch (error) {
      this.logger.error('Error generating chat response:', error);
      return "I'm sorry, I'm having trouble understanding right now. Could you please try again?";
    }
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    options: {
      model?: string;
      language?: string;
      prompt?: string;
    } = {},
  ): Promise<TranscriptionResult> {
    try {
      const { model = 'whisper-1', language, prompt } = options;

      // Create a File-like object from the buffer
      const file = new File([audioBuffer], 'audio.wav', {
        type: 'audio/wav',
      });

      const transcription = await this.openai.audio.transcriptions.create({
        file,
        model,
        language,
        prompt,
        response_format: 'verbose_json',
      });

      return {
        text: transcription.text,
        confidence: transcription.segments?.[0]?.avg_logprob ? 
          Math.exp(transcription.segments[0].avg_logprob) : undefined,
      };
    } catch (error) {
      this.logger.error('Error transcribing audio:', error);
      return {
        text: '',
        confidence: 0,
      };
    }
  }

  async generateSpeech(
    text: string,
    options: {
      model?: string;
      voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
      speed?: number;
    } = {},
  ): Promise<TTSResult> {
    try {
      const {
        model = 'tts-1',
        voice = 'alloy',
        speed = 1.0,
      } = options;

      const mp3 = await this.openai.audio.speech.create({
        model,
        voice,
        input: text,
        speed,
      });

      const audioBuffer = Buffer.from(await mp3.arrayBuffer());

      return {
        audioBuffer,
      };
    } catch (error) {
      this.logger.error('Error generating speech:', error);
      throw new Error('Failed to generate speech');
    }
  }

  async processConversationTurn(
    userInput: string,
    conversationHistory: ChatMessage[] = [],
    elderContext?: string,
  ): Promise<{
    response: string;
    audioBuffer?: Buffer;
  }> {
    try {
      // Add user input to conversation
      const messages: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userInput },
      ];

      // Generate AI response
      const response = await this.generateChatResponse(messages, {
        elderContext,
      });

      // Generate speech for the response
      const { audioBuffer } = await this.generateSpeech(response, {
        voice: 'alloy',
      });

      return {
        response,
        audioBuffer,
      };
    } catch (error) {
      this.logger.error('Error processing conversation turn:', error);
      return {
        response: "I'm sorry, I'm having trouble responding right now.",
      };
    }
  }

  async analyzeCallSummary(
    conversationTurns: Array<{
      speaker: string;
      content: string;
      timestamp: Date;
    }>,
  ): Promise<{
    summary: string;
    mood: string;
    keyTopics: string[];
    recommendations: string[];
  }> {
    try {
      const conversationText = conversationTurns
        .map(turn => `${turn.speaker}: ${turn.content}`)
        .join('\n');

      const prompt = `Analyze this conversation with an elderly person and provide:
1. A brief summary (2-3 sentences)
2. The overall mood/sentiment
3. Key topics discussed
4. Any recommendations for family or caregivers

Conversation:
${conversationText}

Please respond in JSON format with keys: summary, mood, keyTopics (array), recommendations (array)`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        return JSON.parse(response);
      }

      return {
        summary: 'Conversation completed successfully.',
        mood: 'neutral',
        keyTopics: [],
        recommendations: [],
      };
    } catch (error) {
      this.logger.error('Error analyzing call summary:', error);
      return {
        summary: 'Unable to analyze conversation.',
        mood: 'unknown',
        keyTopics: [],
        recommendations: [],
      };
    }
  }
}