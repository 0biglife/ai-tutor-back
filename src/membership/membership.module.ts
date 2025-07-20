import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MembershipPlan } from './entities/plan.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UserModule } from 'src/users/user.module';
import { MembershipRepository } from './repositories/membership.repository';
import { PlanRepository } from './repositories/plan.repository';
import { UserRepository } from 'src/users/user.repository';
import { MembershipCron } from './membership.cron';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership, MembershipPlan, User]),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [MembershipController],
  providers: [
    MembershipService,
    MembershipRepository,
    PlanRepository,
    UserRepository,
    MembershipCron,
  ],
  exports: [MembershipService],
})
export class MembershipModule {}
