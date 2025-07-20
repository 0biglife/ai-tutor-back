import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { openaiProvider } from './openai.provider';

@Module({
  providers: [openaiProvider, OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
