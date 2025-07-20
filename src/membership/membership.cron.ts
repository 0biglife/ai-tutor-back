import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MembershipRepository } from './repositories/membership.repository';

@Injectable()
export class MembershipCron {
  private readonly logger = new Logger(MembershipCron.name);

  constructor(private readonly membershipRepo: MembershipRepository) {}

  // @Cron('*/10 * * * *') // 매 5분마다(테스트용)
  @Cron('0 * * * *') // 매 정시마다
  async markExpiredMemberships() {
    const now = new Date();
    const affected = await this.membershipRepo.markAllExpired(now);
    this.logger.log(`✅ Cron Batch Done: 만료 처리된 멤버십 수 - ${affected}`);
  }
}
