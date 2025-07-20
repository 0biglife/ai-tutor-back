import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipPlan } from '../entities/plan.entity';

@Injectable()
export class PlanRepository {
  constructor(
    @InjectRepository(MembershipPlan)
    private readonly planRepo: Repository<MembershipPlan>,
  ) {}

  // 모든 플랜 조회
  async getAllPlans(): Promise<MembershipPlan[]> {
    return this.planRepo.find();
  }

  // 특정 플랜 조회
  async findPlanById(id: string): Promise<MembershipPlan> {
    const plan = await this.planRepo.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Membership plan not found');
    return plan;
  }

  // 플랜 생성
  async createPlan(planData: Partial<MembershipPlan>): Promise<MembershipPlan> {
    const plan = this.planRepo.create({
      ...planData,
      target: 'B2B',
    });
    return this.planRepo.save(plan);
  }

  // 플랜 삭제
  async deletePlan(id: string): Promise<void> {
    const plan = await this.planRepo.findOne({ where: { id } });

    if (!plan) throw new NotFoundException('Membership plan not found');

    await this.planRepo.remove(plan);
  }
}
