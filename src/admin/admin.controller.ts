import { Controller, Post, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 멤버십 플랜 생성
  @Post('plan')
  createPlan(
    @Body()
    dto: {
      name: string;
      description: string;
      durationDays: number;
      features: { chatUses: number; analysisUses: number };
      price: number;
    },
  ) {
    return this.adminService.createPlan(dto);
  }

  // 특정 멤버십 플랜 삭제
  @Post('plans/:planId/delete')
  deletePlan(@Param('planId') planId: string) {
    return this.adminService.deletePlan(planId);
  }

  // 특정 유저에게 멤버십 강제 할당
  @Post('users/:userId/plans/:planId/assign')
  assignMembership(
    @Param('userId') userId: string,
    @Param('planId') planId: string,
  ) {
    return this.adminService.assignMembershipPlan(userId, planId);
  }

  // 특정 유저 멤버십 삭제
  @Post('users/:userId/memberships/:membershipId/delete')
  revokeMembership(
    @Param('userId') userId: string,
    @Param('membershipId') membershipId: string,
  ) {
    return this.adminService.revokeMembershipPlan(userId, membershipId);
  }
}
