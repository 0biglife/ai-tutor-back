import { Injectable } from '@nestjs/common';
import { MembershipRepository } from 'src/membership/repositories/membership.repository';
import { PlanRepository } from 'src/membership/repositories/plan.repository';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class AdminService {
  constructor(
    private userRepo: UserRepository,
    private planRepo: PlanRepository,
    private membershipRepo: MembershipRepository,
  ) {}

  // 멤버십 플랜 생성
  async createPlan(dto: {
    name: string;
    description: string;
    durationDays: number;
    features: { chatUses: number; analysisUses: number };
    price: number;
  }) {
    return await this.planRepo.createPlan(dto);
  }

  // 멤버십 플랜 삭제
  async deletePlan(planId: string) {
    return await this.planRepo.deletePlan(planId);
  }

  // 유저에게 멤버십 할당
  async assignMembershipPlan(userId: string, planId: string) {
    const user = await this.userRepo.findUserById(userId);
    const plan = await this.planRepo.findPlanById(planId);

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(now.getDate() + plan.durationDays);

    return await this.membershipRepo.registerMembership({
      user,
      plan,
      startedAt: now,
      expiresAt,
      grantedByAdmin: true, // 강제 할당 여부 활성화
      isExpired: false,
    });
  }

  // 유저의 멤버십 삭제
  async revokeMembershipPlan(userId: string, membershipId: string) {
    return await this.membershipRepo.removeMembership(userId, membershipId);
  }
}
