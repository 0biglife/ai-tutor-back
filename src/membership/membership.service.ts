import { Injectable } from '@nestjs/common';
import { MembershipPlan } from './entities/plan.entity';
import { MembershipRepository } from './repositories/membership.repository';
import { PlanRepository } from './repositories/plan.repository';
import { UserRepository } from 'src/users/user.repository';

export interface MembershipPlanWithActive extends MembershipPlan {
  active: boolean;
}

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepo: MembershipRepository,
    private readonly planRepo: PlanRepository,
    private readonly userRepo: UserRepository,
  ) {}

  // 멤버십 조회
  async getAllPlans(userId: string): Promise<MembershipPlanWithActive[]> {
    const [plans, userMemberships] = await Promise.all([
      this.planRepo.getAllPlans(),
      this.membershipRepo.findByUserId(userId),
    ]);

    // 전체 멤버십 중 사용중인 멤버십 검증
    const now = new Date();
    const activePlanIds = new Set(
      userMemberships
        .filter((membership) => new Date(membership.expiresAt) > now)
        .map((membership) => membership.plan.id),
    );

    return plans.map((plan) => ({
      ...plan,
      active: activePlanIds.has(plan.id), // 이 필드로 사용중인지 판별합니다
    }));
  }

  // 멤버십 구매
  async purchasePlan(userId: string, planId: string): Promise<void> {
    // 1. 가정 : PG사 결제 API 연동 성공
    // 2. user / plan 조회
    const user = await this.userRepo.findUserById(userId);
    const plan = await this.planRepo.findPlanById(planId);

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
    );

    // 3. 새 멤버십 생성
    await this.membershipRepo.registerMembership({
      user,
      plan,
      startedAt: now,
      expiresAt,
      remainingChatUses: plan.chatUses ?? null,
      remainingAnalysisUses: plan.analysisUses ?? null,
      grantedByAdmin: false,
      isExpired: false,
    });
  }
}
