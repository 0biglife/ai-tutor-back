import { Injectable, Inject, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const ffmpegPath: string = (ffmpegInstaller as { path: string }).path;

ffmpeg.setFfmpegPath(ffmpegPath);

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);

  constructor(@Inject('OPENAI_API') private readonly openai: OpenAI) {}

  // 사용자 메시지 응답 생성
  // 1. system 메시지를 통해 영어 응답 강제 반환
  // 2. 응답 길이 제한: 100 tokens
  async chatWithGPT(
    messages: { role: 'user' | 'assistant'; content: string }[],
  ) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        // 영어로 강제 응답하도록 제어
        {
          role: 'system',
          content:
            'Respond only in fluent and natural English regardless of the user language.',
        },
        ...messages,
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message.content ?? 'No response.';
    return content;
  }

  // 오디오 파일 텍스트로 변환(STT)
  async transcribe(filePath: string): Promise<string> {
    const convertedPath = await this.convertToWav(filePath);

    const file = fs.createReadStream(convertedPath);
    const transcription = await this.openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      response_format: 'text',
      language: 'en',
    });

    fs.unlinkSync(convertedPath); // 변환된 파일 삭제
    return transcription;
  }

  // 입력된 텍스트 음성 파일로 변환(TTS)
  async speakWithTTS(text: string, filename = 'output.mp3'): Promise<string> {
    // gpt voice로 mp3 생성
    const response = await this.openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
      input: text,
    });

    // uploads 폴더 저장
    const buffer = Buffer.from(await response.arrayBuffer());
    const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
    fs.writeFileSync(filePath, buffer);

    // 경로 반환
    return `/uploads/${filename}`;
  }

  // wav 포맷 변환 및 무음 제거
  private convertToWav(inputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputPath = path.join('uploads', `${uuid()}.wav`);

      ffmpeg(inputPath)
        .audioFilters(
          'silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-50dB',
        )
        .toFormat('wav')
        .on('end', () => {
          this.logger.log(`무음 제거 및 변환 완료: ${outputPath}`);
          resolve(outputPath);
        })
        .on('error', (err) => {
          this.logger.error('변환 중 오류 발생', err);
          reject(err);
        })
        .save(outputPath);
    });
  }
}
