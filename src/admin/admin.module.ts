import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from 'src/membership/entities/membership.entity';
import { MembershipPlan } from 'src/membership/entities/plan.entity';
import { User } from 'src/users/user.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PlanRepository } from 'src/membership/repositories/plan.repository';
import { UserRepository } from 'src/users/user.repository';
import { MembershipRepository } from 'src/membership/repositories/membership.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, MembershipPlan, Membership])],
  controllers: [AdminController],
  providers: [
    AdminService,
    MembershipRepository,
    PlanRepository,
    UserRepository,
  ],
})
export class AdminModule {}
