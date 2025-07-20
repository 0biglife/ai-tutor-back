import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

export const openaiProvider = {
  provide: 'OPENAI_API',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const apiKey = configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
    return new OpenAI({ apiKey });
  },
};
