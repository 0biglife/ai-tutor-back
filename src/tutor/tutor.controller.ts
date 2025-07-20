import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TutorService } from './tutor.service';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  // AI 튜터 시작 음성 반환
  @Post('init')
  async generateTTS(@Body('text') text: string) {
    return this.tutorService.processInitialTTS(text);
  }

  // 사용자 음성 반환
  @Post('chat')
  @UseInterceptors(FileInterceptor('audio', { dest: './uploads' }))
  async handleAudio(
    @UploadedFile() file: Express.Multer.File,
    @Body('membershipId') membershipId: string,
  ): Promise<{ userText: string; assistantText: string }> {
    return this.tutorService.processAudio(file, membershipId);
  }
}
