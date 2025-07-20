import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../entities/membership.entity';

@Injectable()
export class MembershipRepository {
  constructor(
    @InjectRepository(Membership)
    private readonly repo: Repository<Membership>,
  ) {}

  // 유저 ID로 조회
  async findByUserId(userId: string): Promise<Membership[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['plan'],
    });
  }

  // 멤버십 ID로 조회
  async findByMembershipId(membershipId: string): Promise<Membership> {
    const membership = await this.repo.findOne({
      where: { id: membershipId },
      relations: ['plan'],
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return membership;
  }

  // 멤버십 채팅 횟수 차감
  async consumeChatUse(membershipId: string): Promise<{ chatUses: number }> {
    const membership = await this.findByMembershipId(membershipId);

    // 무제한 사용인 경우
    if (membership.plan.chatUses === null) {
      return { chatUses: 1 };
    }

    // 제한 사용인 경우
    if (membership.remainingChatUses > 0) {
      membership.remainingChatUses -= 1;
      await this.repo.save(membership);
    }

    return { chatUses: membership.remainingChatUses };
  }

  // 새로운 멤버십 생성 및 저장
  async registerMembership(data: Partial<Membership>): Promise<Membership> {
    const membership = this.repo.create(data);
    return this.repo.save(membership);
  }

  // 특정 유저의 멤버십 삭제
  async removeMembership(userId: string, membershipId: string): Promise<void> {
    const membership = await this.repo.findOne({
      where: { id: membershipId, user: { id: userId } },
    });

    if (!membership) throw new NotFoundException('Membership not found');

    await this.repo.remove(membership);
  }

  // 만료된 멤버십 조회
  // 1. 현재 시간 기준으로 만료 시 isExpired = true 업데이트
  // 2. 만료 처리된 레코드 수 반환
  async markAllExpired(now: Date): Promise<number> {
    const result = await this.repo
      .createQueryBuilder()
      .update(Membership)
      .set({ isExpired: true })
      .where('expiresAt < :now', { now })
      .andWhere('isExpired = false')
      .execute();

    return result.affected || 0;
  }
}
