import { Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { MembershipRepository } from 'src/membership/repositories/membership.repository';

@Injectable()
export class TutorService {
  private readonly logger = new Logger(TutorService.name);

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly membershipRepository: MembershipRepository,
  ) {}

  // AI 시작 음성 반환
  async processInitialTTS(text: string): Promise<{ ttsUrl: string }> {
    const filename = `welcome-${Date.now()}.mp3`;
    // TTS 변환 + 파일 생성 + URL 반환
    const ttsUrl = await this.openaiService.speakWithTTS(text, filename);
    return { ttsUrl };
  }

  // 사용자 음성 처리
  async processAudio(
    file: Express.Multer.File,
    membershipId: string,
  ): Promise<{
    userText: string;
    assistantText: string;
    ttsUrl: string;
    userAudioUrl: string;
    membershipId: string;
    chatUses: number;
  }> {
    // 1. Whisper API - STT 텍스트 추출
    const userText = await this.transcribeAudio(file);

    // 2. GPT 응답 생성
    const assistantText = await this.getResponseFromAI(userText);

    // 3. TTS 음성 변환
    const ttsUrl = await this.openaiService.speakWithTTS(
      assistantText,
      `${file.filename}.mp3`,
    );

    const userAudioUrl = `/uploads/${file.filename}`;

    this.logger.debug(`STT 결과: ${userText}`);
    this.logger.debug(`GPT 응답: ${assistantText}`);

    // 4. 멤버십 사용 횟수 차감
    let chatUses: number = 1;
    if (membershipId) {
      const result =
        await this.membershipRepository.consumeChatUse(membershipId);
      chatUses = result.chatUses;
    }

    return {
      userText,
      assistantText,
      ttsUrl,
      userAudioUrl,
      membershipId,
      chatUses,
    };
  }

  // STT 호출
  private async transcribeAudio(file: Express.Multer.File): Promise<string> {
    return await this.openaiService.transcribe(file.path);
  }

  // 사용자 응답 생성 호출
  private async getResponseFromAI(userText: string): Promise<string> {
    return await this.openaiService.chatWithGPT([
      { role: 'user', content: userText },
    ]);
  }
}
