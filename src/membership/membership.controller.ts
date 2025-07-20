import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { AuthGuard } from 'src/auth/auth.guard';

interface AuthRequest extends Request {
  user: { id: string };
}

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // 멤버십 조회
  @Get()
  @UseGuards(AuthGuard)
  async getMembershipPlans(@Req() req: AuthRequest) {
    const userId = req.user.id;
    return await this.membershipService.getAllPlans(userId);
  }

  // 유저 멤버십 구매
  @Post()
  @UseGuards(AuthGuard)
  async purchaseMembershipPlan(
    @Req() req: AuthRequest,
    @Body('planId') planId: string,
  ) {
    const userId = req.user.id;
    return await this.membershipService.purchasePlan(userId, planId);
  }
}
