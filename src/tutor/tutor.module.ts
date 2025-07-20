import { Module } from '@nestjs/common';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { MembershipModule } from 'src/membership/membership.module';
import { OpenaiModule } from 'src/openai/openai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from 'src/membership/entities/membership.entity';
import { MembershipPlan } from 'src/membership/entities/plan.entity';
import { MembershipRepository } from 'src/membership/repositories/membership.repository';

@Module({
  imports: [
    MembershipModule,
    OpenaiModule,
    TypeOrmModule.forFeature([Membership, MembershipPlan]),
  ],
  controllers: [TutorController],
  providers: [TutorService, MembershipRepository],
})
export class TutorModule {}
